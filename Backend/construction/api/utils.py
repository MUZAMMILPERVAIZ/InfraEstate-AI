# construction/api/utils.py

from typing import Dict

from .models import ChartData, ConstructionBreakdown, DetailBreakdown
from ..core.hybrid_estimator import predict as hybrid_predict
from ..core.parametric import recommend_solar_capacity


def calculate_area_sqft(area: float, unit: str) -> float:
    from ..core.parametric import MARLA_TO_SQFT
    return area * MARLA_TO_SQFT if unit == "Marla" else area


def calculate_costs(
        area_sqft: float,
        floors: int,
        rooms: int,
        include_hvac: bool,
        include_solar: bool,
        solar_capacity: int,
        model_type: str,
        rates: Dict
) -> Dict:
    # If user wants solar but passes 0 capacity, recommend one
    if include_solar and not solar_capacity:
        solar_capacity = recommend_solar_capacity(area_sqft)

    pred = hybrid_predict(
        area_sqft,
        floors,
        rooms,
        include_hvac,
        include_solar,
        solar_capacity,
        method=model_type
    )

    # Build breakdown dict
    breakdown_dict = {
        "Grey Structure": pred["grey"],
        "Finishing": pred["finish"],
        "Electrical": pred["elec"],
        "Plumbing": pred["plumb"],
    }
    if include_hvac:
        breakdown_dict["HVAC"] = pred["hvac"]
    if include_solar:
        breakdown_dict["Solar"] = pred["solar"]

    breakdown = ConstructionBreakdown(
        grey_structure=DetailBreakdown(total=pred["grey"], details={}),
        finishing=DetailBreakdown(total=pred["finish"], details={}),
        electrical=DetailBreakdown(total=pred["elec"], details={}),
        plumbing=DetailBreakdown(total=pred["plumb"], details={}),
        construction_breakdown=breakdown_dict
    )

    labels, values = list(breakdown_dict.keys()), list(breakdown_dict.values())
    pie = ChartData(labels=labels, values=values)
    bar = ChartData(labels=labels, values=values)

    return {
        "area_sqft": area_sqft,
        "cost_grey_structure": pred["grey"],
        "cost_finishing": pred["finish"],
        "cost_electrical": pred["elec"],
        "cost_plumbing": pred["plumb"],
        "cost_hvac": pred["hvac"],
        "cost_solar": pred["solar"],
        "total_construction_cost": pred["total_construction_cost"],
        "total_project_cost": pred["total_project_cost"],
        "breakdown": breakdown,
        "pie_chart_data": pie,
        "bar_chart_data": bar
    }
