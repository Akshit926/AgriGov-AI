"""Field Verification API routes."""
from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional
from app.services.field_verifier import verify_field_claim

router = APIRouter(prefix="/api/field", tags=["Field Verification"])


class FieldVerifyRequest(BaseModel):
    application_id: Optional[str] = None
    farmer_name: str
    crop_type: str
    land_area: float
    location: str
    season: str
    registered_area: Optional[float] = None


@router.post("/verify")
async def verify_field(request: FieldVerifyRequest):
    """Verify a farmer's field claim against regional data."""
    claim = request.model_dump()
    if claim["registered_area"] is None:
        claim["registered_area"] = claim["land_area"]
    result = verify_field_claim(claim)
    result["application_id"] = request.application_id
    result["farmer_name"] = request.farmer_name
    return result


@router.get("/regions")
async def get_supported_regions():
    """Get list of regions with available crop data."""
    from app.services.field_verifier import REGIONAL_CROP_DATA
    return {
        region: {
            "seasons": {k: v for k, v in data.items() if isinstance(v, list)},
            "avg_holding": data.get("avg_land_holding"),
        }
        for region, data in REGIONAL_CROP_DATA.items()
    }
