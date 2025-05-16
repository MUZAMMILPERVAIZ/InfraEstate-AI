# tune_model.py

import pandas as pd
import joblib
import json
from pathlib import Path
from sklearn.model_selection import train_test_split, RandomizedSearchCV
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline
from sklearn.ensemble import GradientBoostingRegressor
from scipy.stats import randint, uniform

def load_data(path="dataset.csv"):
    df = pd.read_csv(path)
    X = df[["area_sqft", "floors", "rooms", "hvac", "solar", "solar_kw"]]
    y = df["total"]
    return X, y

def tune_gbm(X_train, y_train, n_iter=50, cv=5, random_state=42):
    """
    Randomized search over key GBM hyperparameters.
    """
    pipeline = Pipeline([
        ("scaler", StandardScaler()),
        ("gbr", GradientBoostingRegressor(random_state=random_state))
    ])

    param_dist = {
        "gbr__n_estimators": randint(100, 1000),
        "gbr__learning_rate": uniform(0.01, 0.19),
        "gbr__max_depth": randint(3, 10),
        "gbr__subsample": uniform(0.6, 0.4),
        "gbr__min_samples_split": randint(2, 20),
        "gbr__max_features": ["auto", "sqrt", "log2", 0.5]
    }

    rs = RandomizedSearchCV(
        pipeline,
        param_distributions=param_dist,
        n_iter=n_iter,
        scoring="neg_mean_absolute_error",
        cv=cv,
        verbose=2,
        n_jobs=-1,
        random_state=random_state
    )
    rs.fit(X_train, y_train)
    return rs

if __name__ == "__main__":
    # 1. Load & split
    X, y = load_data("dataset.csv")
    X_train, X_val, y_train, y_val = train_test_split(
        X, y, test_size=0.2, random_state=42
    )

    # 2. Tune
    search = tune_gbm(X_train, y_train, n_iter=50, cv=5)
    best_model  = search.best_estimator_
    best_params = search.best_params_

    # 3. Evaluate on hold-out
    val_pred = best_model.predict(X_val)
    val_mae  = (abs(y_val - val_pred)).mean()
    print(f"Validation MAE: {val_mae:.2f}")

    # 4. Save model & params
    MODEL_OUT = Path("best_model.pkl")
    PARAM_OUT = Path("best_params.json")

    joblib.dump(best_model, MODEL_OUT)
    with PARAM_OUT.open("w") as f:
        json.dump(best_params, f, indent=2)

    print(f"Saved tuned model to {MODEL_OUT}")
    print(f"Saved best params to {PARAM_OUT}")
