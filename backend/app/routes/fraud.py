"""Fraud Detection API routes."""
from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional, List
from app.services.fraud_detector import run_full_fraud_scan, calculate_fraud_score

router = APIRouter(prefix="/api/fraud", tags=["Fraud Detection"])


class FraudScanRequest(BaseModel):
    application_id: str
    farmer_name: str
    aadhaar: Optional[str] = None
    survey_number: Optional[str] = None
    bank_account: Optional[str] = None
    land_area: float = 3.0
    claimed_amount: float = 50000
    annual_income: float = 120000
    num_previous_applications: int = 1
    days_since_last_claim: int = 180


class ExistingApp(BaseModel):
    application_id: str
    farmer_name: str
    aadhaar: Optional[str] = None
    survey_number: Optional[str] = None
    bank_account: Optional[str] = None
    land_area: float = 3.0


class FraudBatchRequest(BaseModel):
    application: FraudScanRequest
    existing_applications: List[ExistingApp] = []


@router.post("/scan")
async def scan_for_fraud(request: FraudBatchRequest):
    """Run full fraud detection scan on an application."""
    result = run_full_fraud_scan(
        application=request.application.model_dump(),
        existing_applications=[app.model_dump() for app in request.existing_applications],
    )
    result["application_id"] = request.application.application_id
    return result


@router.post("/quick-score")
async def quick_fraud_score(request: FraudScanRequest):
    """Get a quick ML-based fraud score without duplicate checking."""
    return calculate_fraud_score(request.model_dump())


@router.get("/alerts")
async def get_fraud_alerts():
    """Get active fraud alerts (demo data)."""
    return {
        "total_scanned": 4520,
        "alerts": [
            {"id": "FRD-001", "application_id": "APP-8842", "fraud_type": "Duplicate Application", "risk_level": "critical", "fraud_score": 0.94},
            {"id": "FRD-002", "application_id": "APP-8790", "fraud_type": "Land Overlap", "risk_level": "high", "fraud_score": 0.87},
            {"id": "FRD-003", "application_id": "APP-8650", "fraud_type": "Suspicious Pattern", "risk_level": "medium", "fraud_score": 0.72},
        ],
    }
