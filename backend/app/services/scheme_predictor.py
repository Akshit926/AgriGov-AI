"""
Scheme Demand Prediction Service
Uses linear regression and historical pattern analysis to forecast
scheme demand by region and season.
"""
import numpy as np
from sklearn.linear_model import LinearRegression
from datetime import datetime

# Historical scheme application data (simulated)
HISTORICAL_DATA = {
    "PM-KISAN": {
        "western_maharashtra": [3200, 3500, 3800, 4000, 4200],
        "marathwada": [2800, 3100, 3400, 3600, 3800],
        "vidarbha": [2500, 2700, 2900, 3100, 3200],
        "konkan": [1000, 1100, 1200, 1300, 1400],
        "north_maharashtra": [2200, 2400, 2600, 2800, 2900],
    },
    "PMFBY": {
        "western_maharashtra": [2400, 2600, 2800, 3000, 3100],
        "marathwada": [2800, 3000, 3200, 3400, 3600],
        "vidarbha": [2200, 2400, 2600, 2700, 2800],
        "konkan": [600, 700, 750, 800, 900],
        "north_maharashtra": [1600, 1800, 1900, 2000, 2100],
    },
    "Soil Health Card": {
        "western_maharashtra": [1400, 1500, 1600, 1700, 1800],
        "marathwada": [900, 1000, 1050, 1100, 1200],
        "vidarbha": [1600, 1700, 1800, 1900, 2100],
        "konkan": [400, 450, 500, 550, 600],
        "north_maharashtra": [1100, 1200, 1250, 1300, 1400],
    },
    "KCC": {
        "western_maharashtra": [1800, 1900, 2000, 2200, 2400],
        "marathwada": [1400, 1500, 1600, 1700, 1900],
        "vidarbha": [1200, 1300, 1400, 1500, 1600],
        "konkan": [1500, 1700, 1800, 2000, 2200],
        "north_maharashtra": [1400, 1500, 1600, 1700, 1800],
    },
}

# Seasonal multipliers
SEASONAL_MULTIPLIERS = {
    "kharif": 1.3,
    "rabi": 1.1,
    "summer": 0.6,
    "annual": 1.0,
}


def predict_demand(scheme_name: str, region: str, season: str = "kharif") -> dict:
    """
    Predict future demand for a given scheme in a region.
    Uses linear regression on historical data.
    """
    region_key = region.lower().replace(" ", "_")
    scheme_data = HISTORICAL_DATA.get(scheme_name, {})
    history = scheme_data.get(region_key)

    if history is None:
        return {
            "scheme": scheme_name,
            "region": region,
            "error": "No historical data available",
        }

    # Linear regression
    X = np.arange(len(history)).reshape(-1, 1)
    y = np.array(history)

    model = LinearRegression()
    model.fit(X, y)

    # Predict next period
    next_period = np.array([[len(history)]])
    base_prediction = model.predict(next_period)[0]

    # Apply seasonal multiplier
    season_key = season.lower()
    multiplier = SEASONAL_MULTIPLIERS.get(season_key, 1.0)
    adjusted_prediction = base_prediction * multiplier

    # Calculate trend
    slope = model.coef_[0]
    if slope > 50:
        trend = "increasing"
    elif slope < -50:
        trend = "decreasing"
    else:
        trend = "stable"

    # Demand level
    if adjusted_prediction > 3500:
        demand_level = "Very High"
        demand_score = min(98, int(70 + adjusted_prediction / 200))
    elif adjusted_prediction > 2500:
        demand_level = "High"
        demand_score = min(85, int(55 + adjusted_prediction / 200))
    elif adjusted_prediction > 1500:
        demand_level = "Medium"
        demand_score = min(70, int(40 + adjusted_prediction / 200))
    else:
        demand_level = "Low"
        demand_score = min(55, int(20 + adjusted_prediction / 200))

    # Confidence based on R² score
    r2 = model.score(X, y)
    confidence = max(60, min(98, r2 * 100))

    # Growth rate
    growth_rate = ((history[-1] - history[0]) / history[0]) * 100

    return {
        "scheme": scheme_name,
        "region": region,
        "season": season,
        "predicted_applications": int(adjusted_prediction),
        "demand_level": demand_level,
        "demand_score": demand_score,
        "trend": trend,
        "confidence": round(confidence, 1),
        "growth_rate": round(growth_rate, 1),
        "historical_data": history,
        "predicted_at": datetime.utcnow().isoformat(),
    }


def predict_all_schemes(region: str, season: str = "kharif") -> list:
    """Predict demand for all schemes in a region."""
    results = []
    for scheme_name in HISTORICAL_DATA:
        result = predict_demand(scheme_name, region, season)
        if "error" not in result:
            results.append(result)
    return sorted(results, key=lambda x: x["demand_score"], reverse=True)


def get_regional_comparison(scheme_name: str, season: str = "kharif") -> list:
    """Compare demand predictions across all regions for a scheme."""
    results = []
    scheme_data = HISTORICAL_DATA.get(scheme_name, {})
    for region_key in scheme_data:
        region_name = region_key.replace("_", " ").title()
        result = predict_demand(scheme_name, region_name, season)
        if "error" not in result:
            results.append(result)
    return sorted(results, key=lambda x: x["demand_score"], reverse=True)
