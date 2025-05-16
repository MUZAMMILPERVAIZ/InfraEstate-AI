# core/simulate_data.py
"""
Monte-Carlo simulation to create dataset.csv for ML training.
"""

import csv, random, math, numpy as np, pathlib
from .parametric import estimate

ROWS = 15_000
OUT  = pathlib.Path("dataset.csv")

def random_project():
    area = math.exp(np.random.normal(math.log(1800), 0.45))   # log-normal
    area = max(800, min(area, 6000))

    floors = random.choices([1,2,3], weights=[0.65,0.3,0.05])[0]
    rooms  = int(np.clip(np.random.normal(area/300, 1.5), 2, 18))
    hvac   = random.random() < 0.25
    solar  = random.random() < 0.20
    solar_kw = random.randint(3,10) if solar else 0

    b = estimate(area, floors, rooms, hvac, solar, solar_kw)
    noise = np.random.normal(0,0.04)
    total = b.total_project() * (1+noise)

    return [round(area,1),floors,rooms,hvac,solar,solar_kw,round(total)]

def main():
    with OUT.open("w",newline="") as f:
        w=csv.writer(f)
        w.writerow(["area_sqft","floors","rooms","hvac","solar","solar_kw","total"])
        for _ in range(ROWS):
            w.writerow(random_project())
    print("Dataset written:", OUT)

if __name__ == "__main__":
    main()
