"""
Field Verification Service
AI-based remote crop and land claim verification using regional agricultural data.
"""
from datetime import datetime

# Regional crop data — what crops are typically grown where
REGIONAL_CROP_DATA = {
    "pune": {
        "kharif": ["soybean", "bajra", "jowar", "groundnut", "cotton", "sugarcane"],
        "rabi": ["wheat", "gram", "jowar", "sunflower", "safflower"],
        "summer": ["groundnut", "vegetables", "sunflower"],
        "annual": ["sugarcane"],
        "avg_land_holding": 2.8,  # hectares
        "max_land_holding": 12.0,
    },
    "nashik": {
        "kharif": ["bajra", "rice", "maize", "soybean", "groundnut"],
        "rabi": ["wheat", "gram", "onion", "garlic"],
        "summer": ["onion", "vegetables"],
        "annual": ["grapes", "sugarcane"],
        "avg_land_holding": 2.2,
        "max_land_holding": 10.0,
    },
    "kolhapur": {
        "kharif": ["rice", "soybean", "groundnut"],
        "rabi": ["wheat", "gram", "jowar"],
        "summer": ["vegetables"],
        "annual": ["sugarcane", "turmeric"],
        "avg_land_holding": 2.0,
        "max_land_holding": 8.0,
    },
    "aurangabad": {
        "kharif": ["cotton", "soybean", "bajra", "jowar"],
        "rabi": ["wheat", "gram", "jowar", "safflower"],
        "summer": ["sunflower"],
        "annual": ["sugarcane"],
        "avg_land_holding": 3.5,
        "max_land_holding": 15.0,
    },
    "nagpur": {
        "kharif": ["cotton", "soybean", "rice", "jowar"],
        "rabi": ["wheat", "gram", "linseed"],
        "summer": ["vegetables", "groundnut"],
        "annual": ["orange", "sugarcane"],
        "avg_land_holding": 3.2,
        "max_land_holding": 14.0,
    },
    "latur": {
        "kharif": ["soybean", "jowar", "bajra", "cotton"],
        "rabi": ["wheat", "gram", "jowar", "safflower"],
        "summer": ["sunflower"],
        "annual": ["sugarcane"],
        "avg_land_holding": 3.0,
        "max_land_holding": 12.0,
    },
    "solapur": {
        "kharif": ["bajra", "jowar", "groundnut"],
        "rabi": ["wheat", "gram", "jowar", "safflower"],
        "summer": ["vegetables"],
        "annual": ["sugarcane", "pomegranate"],
        "avg_land_holding": 2.5,
        "max_land_holding": 10.0,
    },
    "yavatmal": {
        "kharif": ["cotton", "soybean", "jowar", "tur"],
        "rabi": ["wheat", "gram", "jowar"],
        "summer": ["groundnut"],
        "annual": ["orange"],
        "avg_land_holding": 3.8,
        "max_land_holding": 16.0,
    },
    "baramati": {
        "kharif": ["bajra", "jowar", "soybean"],
        "rabi": ["wheat", "gram", "jowar"],
        "summer": ["vegetables", "onion"],
        "annual": ["sugarcane", "grapes"],
        "avg_land_holding": 2.6,
        "max_land_holding": 10.0,
    },
}


def _normalize_season(season_str: str) -> str:
    """Normalize season string to standard format."""
    season_lower = season_str.lower()
    if "kharif" in season_lower:
        return "kharif"
    elif "rabi" in season_lower:
        return "rabi"
    elif "summer" in season_lower or "zaid" in season_lower:
        return "summer"
    elif "annual" in season_lower or "perennial" in season_lower:
        return "annual"
    return "kharif"  # default


def _normalize_district(location: str) -> str:
    """Extract district name from location string."""
    location_lower = location.lower().strip()
    for district in REGIONAL_CROP_DATA:
        if district in location_lower:
            return district
    # Try first word
    first_word = location_lower.split(",")[0].strip().split()[0] if location_lower else ""
    return first_word if first_word in REGIONAL_CROP_DATA else None


def verify_field_claim(claim: dict) -> dict:
    """
    Verify a farmer's field claim against regional agricultural data.

    Args:
        claim: dict with keys: crop_type, land_area, location, season,
               registered_area (optional)

    Returns:
        Verification result with status, confidence, and analysis details.
    """
    crop = claim.get("crop_type", "").lower().strip()
    area = float(claim.get("land_area", 0))
    location = claim.get("location", "")
    season = _normalize_season(claim.get("season", "kharif"))
    registered_area = float(claim.get("registered_area", area))

    district = _normalize_district(location)
    issues = []
    confidence_deductions = 0

    # 1. Check if district data is available
    if district and district in REGIONAL_CROP_DATA:
        district_data = REGIONAL_CROP_DATA[district]

        # 2. Verify crop is grown in this region and season
        season_crops = district_data.get(season, [])
        all_crops = []
        for s_crops in district_data.values():
            if isinstance(s_crops, list):
                all_crops.extend(s_crops)

        crop_in_season = any(crop in c.lower() for c in season_crops)
        crop_in_region = any(crop in c.lower() for c in all_crops)

        if not crop_in_season and not crop_in_region:
            issues.append(f"{crop.title()} is not typically grown in {district.title()} district")
            confidence_deductions += 40
        elif not crop_in_season:
            issues.append(f"{crop.title()} is grown in {district.title()} but not during {season} season")
            confidence_deductions += 20

        # 3. Verify land area is reasonable
        max_holding = district_data.get("max_land_holding", 15.0)
        avg_holding = district_data.get("avg_land_holding", 3.0)

        if area > max_holding:
            issues.append(f"Claimed area ({area} ha) exceeds maximum typical holding ({max_holding} ha) for {district.title()}")
            confidence_deductions += 30
        elif area > avg_holding * 2:
            issues.append(f"Claimed area ({area} ha) is significantly above average ({avg_holding} ha) for {district.title()}")
            confidence_deductions += 10

        # 4. Check claimed vs registered area
        if area > registered_area * 1.1:  # 10% tolerance
            excess = ((area - registered_area) / registered_area) * 100
            issues.append(f"Claimed area exceeds registered area by {excess:.0f}%")
            confidence_deductions += 35
    else:
        issues.append(f"Regional data not available for location: {location}")
        confidence_deductions += 15

    # Calculate final confidence
    confidence = max(5.0, 100.0 - confidence_deductions)
    status = "valid" if confidence >= 65 else "mismatch"

    # Generate analysis details
    if status == "valid":
        details = f"{crop.title()} cultivation in {location} is consistent with regional crop data."
        if area <= registered_area:
            details += f" Land area ({area} ha) matches records."
    else:
        details = " ".join(issues)

    return {
        "status": status,
        "confidence": round(confidence, 1),
        "issues": issues,
        "details": details,
        "crop_verified": confidence_deductions < 30,
        "area_verified": area <= registered_area * 1.1,
        "region_data_available": district is not None and district in REGIONAL_CROP_DATA,
        "verified_at": datetime.utcnow().isoformat(),
    }
