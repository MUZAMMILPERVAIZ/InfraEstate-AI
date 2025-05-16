import os
from datetime import datetime
from typing import Dict, List

from bson.objectid import ObjectId
# Import dependencies from the dependencies.py file
from dependencies import get_current_user, get_current_admin_user, db
from fastapi import APIRouter, Depends, HTTPException, status
from langchain_aws import ChatBedrock
from pymongo import ReturnDocument

# Import models and utilities from local modules
from .models import (
    ConstructionRates, ConstructionInput, ConstructionResult,
    UpdateRatesRequest, ChartData, SuggestionInput, SuggestionItem, SuggestionResult

)
from .utils import calculate_area_sqft, calculate_costs
from ..core.parametric import estimate as parametric_estimate

router = APIRouter(
    prefix="/construction",
    tags=["construction"],
    responses={404: {"description": "Not found"}},
)


@router.get("/rates", response_model=ConstructionRates)
async def get_construction_rates():
    """Get current construction rates"""
    rates = db.construction_rates.find_one({}, sort=[("last_updated", -1)])

    # If no rates exist, return default rates
    if not rates:
        default_rates = ConstructionRates()
        return default_rates

    # Convert _id to string if present
    if "_id" in rates:
        rates["_id"] = str(rates["_id"])

    return rates


@router.post("/rates", response_model=ConstructionRates)
async def update_construction_rates(
        rates_update: UpdateRatesRequest,
        current_user: dict = Depends(get_current_admin_user)
):
    """Update construction rates (admin only)"""

    # Get current rates to update only specified fields
    current_rates = await get_construction_rates()

    # Create a dictionary of updates for only the fields that were provided
    updates = {}
    for field, value in rates_update.dict(exclude_unset=True).items():
        if value is not None:
            updates[field] = value

    if not updates:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No valid updates provided"
        )

    # Add metadata
    updates["last_updated"] = datetime.now()
    updates["updated_by"] = current_user.get("email")

    # Update or insert rates
    result = db.construction_rates.find_one_and_update(
        {"_id": current_rates.get("_id") if hasattr(current_rates, "get") and current_rates.get("_id") else None},
        {"$set": updates},
        upsert=True,
        return_document=ReturnDocument.AFTER
    )

    # Convert _id to string if present
    if "_id" in result:
        result["_id"] = str(result["_id"])

    return result


@router.post("/calculate", response_model=ConstructionResult)
async def calculate_construction_costs(
        input_data: ConstructionInput,
        current_user: dict = Depends(get_current_user)
):
    print(input_data)
    # 1. Get rates
    rates = await get_construction_rates()
    rates_dict = rates.dict() if not isinstance(rates, dict) else rates

    # 2. Convert area
    area_sqft = calculate_area_sqft(input_data.area, input_data.unit)

    # 3. Determine solar capacity
    solar_capacity = input_data.solar_capacity if input_data.include_solar else 0

    # 4. Calculate with our unified helper
    result = calculate_costs(
        area_sqft=area_sqft,
        floors=input_data.floors,
        rooms=input_data.rooms,
        include_hvac=input_data.include_hvac,
        include_solar=input_data.include_solar,
        solar_capacity=solar_capacity,
        model_type=input_data.model_type,  # new argument
        rates=rates_dict
    )

    # 5. Log for analytics
    log = {
        "user_email": current_user["email"],
        "input_parameters": input_data.dict(),
        "results": {
            "area_sqft": result["area_sqft"],
            "total_construction_cost": result["total_construction_cost"],
            "total_project_cost": result["total_project_cost"],
            "pie_chart_data": result["pie_chart_data"].dict(),
            "bar_chart_data": result["bar_chart_data"].dict()
        },
        "rates_used": rates_dict,
        "timestamp": datetime.utcnow()
    }
    db.construction_calculations.insert_one(log)

    return result


os.environ['AWS_ACCESS_KEY_ID'] = os.getenv('access_key')
os.environ['AWS_SECRET_ACCESS_KEY'] = os.getenv('access_secret')
os.environ['AWS_DEFAULT_REGION'] = os.getenv('region_name')

import boto3

bedrock_client = boto3.client(
    service_name='bedrock-runtime',
    region_name='us-east-1',
    aws_access_key_id=os.getenv('access_key'),
    aws_secret_access_key=os.getenv('access_secret')
)

llm = ChatBedrock(
    model_id="us.anthropic.claude-3-5-sonnet-20241022-v2:0",
    # model_id="anthropic.claude-3-7-sonnet-20250219-v1:0",
    model_kwargs={"temperature": 0.5},
    client=bedrock_client
)


@router.post("/suggest-layout", response_model=SuggestionResult)
async def suggest_layout(
        input_data: SuggestionInput,
        current_user: dict = Depends(get_current_user)
):
    """
    Given property size and budget (and optional max_floors),
    suggest floor/room combinations and produce a detailed report via OpenAI.
    """
    # 1. Convert area
    area_sqft = calculate_area_sqft(input_data.area, input_data.unit)

    raw: List[SuggestionItem] = []
    max_floors = input_data.max_floors or 1
    baseline_rooms = max(1, round(area_sqft / 300))
    max_rooms = baseline_rooms * 2

    for floors in range(1, max_floors + 1):
        for rooms in range(1, max_rooms + 1):
            b = parametric_estimate(
                area_sqft, floors, rooms,
                include_hvac=False, include_solar=False, solar_capacity_kw=0
            )
            cost = round(b.total_project(), 2)
            if cost <= input_data.budget:
                raw.append(SuggestionItem(floors=floors, rooms=rooms, total_project_cost=cost))

    if not raw:
        raise HTTPException(404, "No layout combinations found within budget.")

    # dedupe same-cost entries
    unique: Dict[float, SuggestionItem] = {}
    for s in raw:
        existing = unique.get(s.total_project_cost)
        if existing is None or (s.rooms, s.floors) > (existing.rooms, existing.floors):
            unique[s.total_project_cost] = s

    suggestions = list(unique.values())
    suggestions.sort(key=lambda s: (-s.rooms, -s.floors, s.total_project_cost))
    top_suggestions = suggestions[:10]

    # 3. Build a detailed prompt for OpenAI
    prompt = f"""
You are a construction planning assistant for residential buildings in Pakistan (2025).
A user has a property of {input_data.area} {input_data.unit} (~{area_sqft:.0f} sq.ft) and a budget of PKR {input_data.budget:,.0f}.
They wish to know what combination of number of floors and rooms they can build within that budget.

Here are the top layout options (floors, rooms, total cost):
{chr(10).join(f"- {s.floors} floors, {s.rooms} rooms: PKR {s.total_project_cost:,.0f}" for s in top_suggestions)}

Please provide a comprehensive recommendation report that includes:
- A summary of the user’s inputs (area, budget)
- Explanation of how cost varies with floors and rooms
- Detailed overview of each suggested layout (pros and cons)
- Any tips on maximizing space, cost savings (e.g. room layout, multi-story efficiency)
- Advice on ensuring quality and managing contingencies
- A brief note on whether adding HVAC or solar could be considered later

Write in clear, concise paragraphs suitable for a homeowner planning their build.
"""

    # 4. Call Claude 3.7 sonnet to generate the report
    try:
        report = llm.invoke(prompt).content
    except Exception as e:
        report = f"Could not generate detailed report: {e}"

    # 5. (Optional) Log the request
    db.layout_suggestions.insert_one({
        "user_email": current_user["email"],
        "input": input_data.dict(),
        "suggestions": [s.dict() for s in top_suggestions],
        "report": report,
        "timestamp": datetime.utcnow()
    })

    return SuggestionResult(
        suggestions=top_suggestions,
        suggestion_report=report
    )


@router.get("/chart-data/{calculation_id}", response_model=Dict[str, ChartData])
async def get_chart_data(
        calculation_id: str,
        current_user: dict = Depends(get_current_user)
):
    """Get chart data for a previous calculation"""
    calculation = db.construction_calculations.find_one({"_id": ObjectId(calculation_id)})

    if not calculation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Calculation not found"
        )

    # Check if the calculation belongs to the current user
    if calculation.get("user_email") != current_user.get("email"):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access this calculation"
        )

    # Return the chart data
    result = calculation.get("results", {})
    return {
        "pie_chart": result.get("pie_chart_data", {}),
        "bar_chart": result.get("bar_chart_data", {})
    }


@router.get("/calculations", response_model=List[Dict])
async def get_user_calculations(
        current_user: dict = Depends(get_current_user)
):
    """Get all calculations done by the current user"""
    calculations = list(
        db.construction_calculations.find(
            {"user_email": current_user.get("email")},
            {"results": 1, "input_parameters": 1, "timestamp": 1}
        ).sort("timestamp", -1)
    )

    # Convert ObjectId to string
    for calc in calculations:
        calc["_id"] = str(calc["_id"])

    return calculations


@router.get("/admin/calculations", response_model=List[Dict])
async def get_all_calculations(
        limit: int = 50,
        current_user: dict = Depends(get_current_admin_user)
):
    """Get all calculations (admin only)"""
    calculations = list(
        db.construction_calculations.find(
            {},
            {"results": 1, "input_parameters": 1, "timestamp": 1, "user_email": 1}
        ).sort("timestamp", -1).limit(limit)
    )

    # Convert ObjectId to string
    for calc in calculations:
        calc["_id"] = str(calc["_id"])

    return calculations
