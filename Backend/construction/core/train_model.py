# core/train_model.py
"""
Train GradientBoosting on dataset.csv, save model.pkl,
and record training/validation metrics to metrics.json
"""

import pandas as pd
import joblib
import pathlib
import json

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.metrics import (
    mean_absolute_percentage_error,
    r2_score,
    mean_squared_error
)

# Paths
CSV_PATH = pathlib.Path("dataset.csv")
MODEL_PATH = pathlib.Path("model.pkl")
METRICS_PATH = pathlib.Path("metrics.json")

def main():
    # 1. Load data
    df = pd.read_csv(CSV_PATH)
    X = df[["area_sqft", "floors", "rooms", "hvac", "solar", "solar_kw"]]
    y = df["total"]

    # 2. Train/validation split
    X_train, X_val, y_train, y_val = train_test_split(
        X, y, test_size=0.2, random_state=42
    )

    # 3. Build pipeline
    pipeline = Pipeline([
        ("scaler", StandardScaler()),
        ("gbr", GradientBoostingRegressor(
            n_estimators=484,
            learning_rate=0.01978096273749798,
            max_depth=7,
            random_state=42,
            subsample=0.695824756266789,
            max_features=0.5,
            min_samples_split=2

        ))
    ])

    # 4. Fit model
    pipeline.fit(X_train, y_train)

    # 5. Predictions
    y_train_pred = pipeline.predict(X_train)
    y_val_pred   = pipeline.predict(X_val)

    # 6. Compute metrics
    metrics = {
        "train": {
            "MAPE": mean_absolute_percentage_error(y_train, y_train_pred),
            "R2":   r2_score(y_train, y_train_pred),
            "RMSE": mean_squared_error(y_train, y_train_pred, squared=False)
        },
        "validation": {
            "MAPE": mean_absolute_percentage_error(y_val, y_val_pred),
            "R2":   r2_score(y_val, y_val_pred),
            "RMSE": mean_squared_error(y_val, y_val_pred, squared=False)
        }
    }

    # 7. Print metrics
    print("=== Training Metrics ===")
    print(f"MAPE: {metrics['train']['MAPE']*100:.2f}%")
    print(f"R²:   {metrics['train']['R2']:.4f}")
    print(f"RMSE: {metrics['train']['RMSE']:.2f}")
    print("\n=== Validation Metrics ===")
    print(f"MAPE: {metrics['validation']['MAPE']*100:.2f}%")
    print(f"R²:   {metrics['validation']['R2']:.4f}")
    print(f"RMSE: {metrics['validation']['RMSE']:.2f}")

    # 8. Save model
    joblib.dump(pipeline, MODEL_PATH)
    print(f"\nSaved model to {MODEL_PATH}")

    # 9. Save metrics
    # Convert metrics to serializable form (floats)
    serializable_metrics = {
        split: {k: float(v) for k, v in vals.items()}
        for split, vals in metrics.items()
    }
    with METRICS_PATH.open("w") as f:
        json.dump(serializable_metrics, f, indent=4)
    print(f"Saved metrics to {METRICS_PATH}")

if __name__ == "__main__":
    main()
