# core/hybrid_estimator.py
from pathlib import Path
import joblib
from typing import Dict
from .parametric import estimate  # relative import

MODEL_PATH = Path("model.pkl")
ML_WEIGHT  = 0.7

_model = joblib.load(MODEL_PATH) if MODEL_PATH.exists() else None

def predict(
    area_sqft: float,
    floors: int,
    rooms: int,
    include_hvac: bool,
    include_solar: bool,
    solar_capacity: int,
    method: str = "hybrid"   # new parameter
) -> Dict:
    """
    method: one of 'parametric', 'ml', or 'hybrid'
    """
    # 1️⃣ parametric baseline
    base = estimate(area_sqft, floors, rooms, include_hvac, include_solar, solar_capacity)
    base_total = base.total_project()

    # 2️⃣ if no ML model or user wants purely parametric
    if _model is None or method == "parametric":
        return {
            "grey": base.grey,
            "finish": base.finish,
            "elec": base.elec,
            "plumb": base.plumb,
            "hvac": base.hvac,
            "solar": base.solar,
            "total_construction_cost": base.total_construction(),
            "total_project_cost": base.total_project(),
            "method": "parametric"
        }

    # 3️⃣ Get ML‐only prediction
    features = [[area_sqft, floors, rooms, int(include_hvac), int(include_solar), solar_capacity]]
    ml_total = float(_model.predict(features)[0])

    # 4️⃣ Compute final total based on user choice
    if method == "ml":
        final_total = ml_total
    else:  # hybrid
        final_total = ML_WEIGHT * ml_total + (1 - ML_WEIGHT) * base_total

    # 5️⃣ Scale breakdown proportions from parametric
    scale_factor = final_total / base_total if base_total else 1.0
    return {
        "grey": base.grey * scale_factor,
        "finish": base.finish * scale_factor,
        "elec": base.elec * scale_factor,
        "plumb": base.plumb * scale_factor,
        "hvac": base.hvac * scale_factor,
        "solar": base.solar,  # solar is fixed, not scaled
        "total_construction_cost": base.total_construction() * scale_factor,
        "total_project_cost": final_total,
        "method": method
    }
