from datetime import datetime
from typing import Dict, List, Optional, Literal

from pydantic import BaseModel, Field


class ConstructionRates(BaseModel):
    """Model for storing construction rates"""
    grey_structure_rate: float = Field(2000, description="Grey structure cost per square foot")
    finishing_rate: float = Field(1800, description="Finishing cost per square foot")
    electrical_rate: float = Field(400, description="Electrical cost per square foot")
    plumbing_rate: float = Field(400, description="Plumbing cost per square foot")
    hvac_rate: float = Field(300, description="HVAC cost per square foot")
    solar_panel_cost_per_watt: float = Field(50, description="Solar panel cost per watt")
    fixed_solar_equipment_cost: float = Field(500000, description="Fixed solar equipment cost")
    last_updated: datetime = Field(default_factory=datetime.now)
    updated_by: Optional[str] = None


class DetailBreakdown(BaseModel):
    """Detailed breakdown of costs"""
    total: float
    details: Dict[str, float]


class ConstructionBreakdown(BaseModel):
    """Full construction breakdown"""
    grey_structure: DetailBreakdown
    finishing: DetailBreakdown
    electrical: DetailBreakdown
    plumbing: DetailBreakdown
    construction_breakdown: Dict[str, float]


class ChartData(BaseModel):
    labels: List[str]
    values: List[float]


class ConstructionInput(BaseModel):
    """Input parameters for construction calculation"""

    area: float = Field(..., description="Area value")
    unit: str = Field(..., description="Unit of area (Marla or Sq.ft.)")
    floors: int = Field(1, ge=1, description="Number of floors")
    rooms: int = Field(1, ge=1, description="Number of rooms")
    include_hvac: bool = Field(False)
    include_solar: bool = Field(False)
    solar_capacity: Optional[int] = Field(0, ge=0)
    model_type: Literal["parametric", "ml", "hybrid"] = Field(
        "hybrid",
        description="Which estimator to use: 'parametric', 'ml', or 'hybrid'"
    )


class ConstructionResult(BaseModel):
    """Full result of construction calculation"""
    area_sqft: float
    cost_grey_structure: float
    cost_finishing: float
    cost_electrical: float
    cost_plumbing: float
    cost_hvac: Optional[float] = 0
    cost_solar: Optional[float] = 0
    total_construction_cost: float
    total_project_cost: float
    breakdown: ConstructionBreakdown
    pie_chart_data: ChartData
    bar_chart_data: ChartData


class UpdateRatesRequest(BaseModel):
    """Request model for updating construction rates"""
    grey_structure_rate: Optional[float] = None
    finishing_rate: Optional[float] = None
    electrical_rate: Optional[float] = None
    plumbing_rate: Optional[float] = None
    hvac_rate: Optional[float] = None
    solar_panel_cost_per_watt: Optional[float] = None
    fixed_solar_equipment_cost: Optional[float] = None


class SuggestionInput(BaseModel):
    area: float = Field(..., description="Property size")
    unit: str = Field(..., description="Unit of area (Marla or Sq.ft.)")
    budget: float = Field(..., gt=0, description="Maximum project budget (PKR)")
    max_floors: Optional[int] = Field(3, ge=1, description="Optional cap on floors to consider")

class SuggestionItem(BaseModel):
    floors: int
    rooms: int
    total_project_cost: float

class SuggestionResult(BaseModel):
    suggestions: List[SuggestionItem]
    suggestion_report: str = Field(..., description="OpenAI-generated comprehensive recommendation")



