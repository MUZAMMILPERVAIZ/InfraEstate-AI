# core/parametric.py
"""
Rule-based cost estimator for average-quality residential construction in Pakistan (2025).
Includes realistic floor-by-floor costs, per-room allowances, and solar sizing recommendations.
"""

from dataclasses import dataclass, asdict
from typing import Dict, Optional

# --- constants (updated to April 2025 market averages) ---

MARLA_TO_SQFT = 272.25  # unchanged

GROUND_GREY_RATE = 2000  # ↓ from 2800 to match avg. 2025 contractor rates
UPPER_GREY_FACTOR = 0.90  # keep 10% discount for upper floors

GROUND_FINISH_RATE = 1800  # ↓ from 2700 for average‐quality finishes
UPPER_FINISH_FACTOR = 0.90

ELEC_RATE = 400  # ↓ from 500 to better reflect large‐house rates
PLUMB_RATE = 400  # keep at 400 (incl. fixtures)
HVAC_RATE = 300  # same

SOLAR_WATT_RATE = 50  # ↑ from 33 Rs/W to reflect panel+installation
SOLAR_FIXED_COST = 500_000  # unchanged

ROOM_ALLOWANCE = 100_000  # grey-structure per extra room
FINISH_ROOM_ALLOWANCE = 50_000  # plaster/paint on partitions
ELEC_ROOM_ALLOWANCE = 10_000  # extra wiring & fixtures
PLUMB_ROOM_ALLOWANCE = 8_000  # extra pipes & fittings

ECONOMIES_MIN_AREA = 1500
ECONOMIES_MAX_AREA = 4000
ECONOMIES_MAX_DISC = 0.12


@dataclass
class Breakdown:
    grey: float
    finish: float
    elec: float
    plumb: float
    hvac: float = 0.0
    solar: float = 0.0

    def total_construction(self) -> float:
        return self.grey + self.finish + self.elec + self.plumb + self.hvac

    def total_project(self) -> float:
        return self.total_construction() + self.solar

    def as_dict(self) -> Dict[str, float]:
        d = asdict(self)
        d["total_construction_cost"] = self.total_construction()
        d["total_project_cost"] = self.total_project()
        return d


def economies_scale(area: float) -> float:
    if area <= ECONOMIES_MIN_AREA:
        return 1.0
    if area >= ECONOMIES_MAX_AREA:
        return 1.0 - ECONOMIES_MAX_DISC
    frac = (area - ECONOMIES_MIN_AREA) / (ECONOMIES_MAX_AREA - ECONOMIES_MIN_AREA)
    return 1.0 - frac * ECONOMIES_MAX_DISC


def recommend_solar_capacity(area_sqft: float) -> int:
    return max(1, int(area_sqft / 500 + 0.5))


def estimate(
        area_sqft: float,
        floors: int,
        rooms: int,
        include_hvac: bool,
        include_solar: bool,
        solar_capacity_kw: Optional[int] = None,
) -> Breakdown:
    if area_sqft <= 0 or floors < 1 or rooms < 1:
        raise ValueError("Invalid inputs")

    # — solar —
    solar = 0.0
    if include_solar:
        kw = solar_capacity_kw if solar_capacity_kw and solar_capacity_kw > 0 else recommend_solar_capacity(area_sqft)
        solar = kw * SOLAR_WATT_RATE * 1_000 + SOLAR_FIXED_COST

    # — scale (economies of scale) —
    scale = economies_scale(area_sqft)

    # — grey & finish base rates (ground + upper floors) —
    grey_ground = GROUND_GREY_RATE * scale
    grey_upper = grey_ground * UPPER_GREY_FACTOR
    finish_ground = GROUND_FINISH_RATE * scale
    finish_upper = finish_ground * UPPER_FINISH_FACTOR

    grey_cost = grey_ground * area_sqft + (floors - 1) * grey_upper * area_sqft
    finish_cost = finish_ground * area_sqft + (floors - 1) * finish_upper * area_sqft

    # — MEP full-floor costs —
    elec_cost = ELEC_RATE * area_sqft * floors
    plumb_cost = PLUMB_RATE * area_sqft * floors
    hvac_cost = (HVAC_RATE * area_sqft) if include_hvac else 0.0

    # — room partition allowances —
    baseline_rooms = max(1, round(area_sqft / 300))
    extra_rooms = rooms - baseline_rooms

    # positive allowances
    grey_room_cost = max(0, extra_rooms) * ROOM_ALLOWANCE
    finish_room_cost = max(0, extra_rooms) * FINISH_ROOM_ALLOWANCE
    elec_room_cost = max(0, extra_rooms) * ELEC_ROOM_ALLOWANCE
    plumb_room_cost = max(0, extra_rooms) * PLUMB_ROOM_ALLOWANCE

    # negative credit if fewer rooms than baseline
    # (you can cap this if you like, e.g. at –5% of grey_cost)
    grey_credit = min(0, extra_rooms) * ROOM_ALLOWANCE
    finish_credit = min(0, extra_rooms) * FINISH_ROOM_ALLOWANCE
    elec_credit = min(0, extra_rooms) * ELEC_ROOM_ALLOWANCE
    plumb_credit = min(0, extra_rooms) * PLUMB_ROOM_ALLOWANCE

    total_grey = grey_cost + grey_room_cost + grey_credit
    total_finish = finish_cost + finish_room_cost + finish_credit
    total_elec = elec_cost + elec_room_cost + elec_credit
    total_plumb = plumb_cost + plumb_room_cost + plumb_credit

    return Breakdown(
        grey=total_grey,
        finish=total_finish,
        elec=total_elec,
        plumb=total_plumb,
        hvac=hvac_cost,
        solar=solar
    )


# Example usage:
if __name__ == "__main__":
    b = estimate(area_sqft=1500, floors=1, rooms=1, include_hvac=False, include_solar=False)
    print("Breakdown:", b.as_dict())
