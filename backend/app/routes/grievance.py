"""Grievance System API routes."""
from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional
from app.services.grievance_classifier import classify_grievance, batch_classify

router = APIRouter(prefix="/api/grievance", tags=["Grievance"])


class GrievanceRequest(BaseModel):
    farmer_name: str
    district: str
    complaint_text: str


class BatchGrievanceItem(BaseModel):
    id: str
    text: str


class BatchRequest(BaseModel):
    complaints: list[BatchGrievanceItem]


@router.post("/classify")
async def classify_complaint(request: GrievanceRequest):
    """Classify a single farmer complaint using NLP."""
    result = classify_grievance(request.complaint_text)
    result["farmer_name"] = request.farmer_name
    result["district"] = request.district
    return result


@router.post("/batch-classify")
async def classify_batch(request: BatchRequest):
    """Classify multiple complaints at once."""
    complaints = [{"id": c.id, "text": c.text} for c in request.complaints]
    return batch_classify(complaints)


@router.get("/categories")
async def get_categories():
    """Get supported grievance categories."""
    return {
        "categories": [
            {"key": "subsidy", "label": "Subsidy", "description": "Issues related to PM-KISAN, DBT, and financial assistance"},
            {"key": "insurance", "label": "Insurance", "description": "Crop insurance claims and PMFBY related"},
            {"key": "crop_damage", "label": "Crop Damage", "description": "Natural disaster, pest, and crop loss complaints"},
            {"key": "water_issue", "label": "Water Issue", "description": "Irrigation, canal, and water supply problems"},
            {"key": "technical", "label": "Technical", "description": "Portal, app, and system access issues"},
        ],
        "priority_levels": ["urgent", "high", "medium", "low"],
    }
