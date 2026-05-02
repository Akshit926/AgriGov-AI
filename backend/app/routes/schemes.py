"""Scheme Prediction API routes."""
from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional
from app.services.scheme_predictor import predict_demand, predict_all_schemes, get_regional_comparison

router = APIRouter(prefix="/api/schemes", tags=["Scheme Prediction"])


class PredictionRequest(BaseModel):
    scheme_name: str
    region: str
    season: str = "kharif"


@router.post("/predict")
async def predict_scheme_demand(request: PredictionRequest):
    """Predict demand for a specific scheme in a region."""
    return predict_demand(request.scheme_name, request.region, request.season)


@router.get("/predict-all")
async def predict_all(region: str = "Western Maharashtra", season: str = "kharif"):
    """Predict demand for all schemes in a region."""
    return predict_all_schemes(region, season)


@router.get("/regional-comparison")
async def regional_comparison(scheme: str = "PM-KISAN", season: str = "kharif"):
    """Compare scheme demand across all regions."""
    return get_regional_comparison(scheme, season)


@router.get("/schemes")
async def get_available_schemes():
    """Get list of available schemes for prediction."""
    return {
        "schemes": ["PM-KISAN", "PMFBY", "Soil Health Card", "KCC"],
        "regions": [
            "Western Maharashtra", "Marathwada", "Vidarbha",
            "Konkan", "North Maharashtra",
        ],
        "seasons": ["kharif", "rabi", "summer", "annual"],
    }
