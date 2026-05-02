"""
Fraud Detection Service
Uses Isolation Forest anomaly detection and fuzzy matching to detect
duplicate/fraudulent applications.
"""
import numpy as np
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import StandardScaler
from datetime import datetime
import random

# Pre-trained anomaly detection model (simulated)
# In production, this would be trained on historical application data
_model = None
_scaler = None


def _init_model():
    """Initialize and train the fraud detection model with synthetic data."""
    global _model, _scaler

    # Generate synthetic training data representing normal applications
    np.random.seed(42)
    n_samples = 500

    # Features: [land_area, claimed_amount, num_applications, days_since_last, income_level]
    normal_data = np.column_stack([
        np.random.normal(3.0, 1.5, n_samples),    # land_area (hectares)
        np.random.normal(50000, 20000, n_samples), # claimed_amount (₹)
        np.random.poisson(1.2, n_samples),          # num_applications
        np.random.exponential(180, n_samples),      # days_since_last_claim
        np.random.normal(120000, 40000, n_samples), # annual_income
    ])

    _scaler = StandardScaler()
    scaled_data = _scaler.fit_transform(normal_data)

    _model = IsolationForest(
        n_estimators=100,
        contamination=0.05,
        random_state=42,
    )
    _model.fit(scaled_data)


def calculate_fraud_score(application: dict) -> dict:
    """
    Calculate fraud score for an application using ML anomaly detection.

    Args:
        application: dict with keys like land_area, claimed_amount, etc.

    Returns:
        dict with fraud_score, risk_level, and details
    """
    if _model is None:
        _init_model()

    # Extract features
    features = np.array([[
        application.get("land_area", 3.0),
        application.get("claimed_amount", 50000),
        application.get("num_previous_applications", 1),
        application.get("days_since_last_claim", 180),
        application.get("annual_income", 120000),
    ]])

    scaled = _scaler.transform(features)

    # Get anomaly score (-1 = anomaly, 1 = normal)
    prediction = _model.predict(scaled)[0]
    raw_score = _model.score_samples(scaled)[0]

    # Convert to 0-1 fraud score (lower raw_score = more anomalous)
    fraud_score = max(0, min(1, 0.5 - raw_score * 0.5))

    # Determine risk level
    if fraud_score >= 0.8:
        risk_level = "critical"
    elif fraud_score >= 0.6:
        risk_level = "high"
    elif fraud_score >= 0.4:
        risk_level = "medium"
    else:
        risk_level = "low"

    return {
        "fraud_score": round(fraud_score, 3),
        "risk_level": risk_level,
        "prediction": "anomaly" if prediction == -1 else "normal",
        "analyzed_at": datetime.utcnow().isoformat(),
    }


def check_duplicates(application: dict, existing_applications: list) -> list:
    """
    Check for duplicate applications using fuzzy matching.

    Checks:
    - Same Aadhaar number
    - Same land survey number
    - Same bank account
    - Similar name + address combination
    """
    duplicates = []
    aadhaar = application.get("aadhaar", "")
    survey_no = application.get("survey_number", "")
    bank_account = application.get("bank_account", "")
    farmer_name = application.get("farmer_name", "").lower()

    for existing in existing_applications:
        reasons = []

        # Exact Aadhaar match
        if aadhaar and existing.get("aadhaar") == aadhaar:
            reasons.append("Same Aadhaar number")

        # Same land record
        if survey_no and existing.get("survey_number") == survey_no:
            reasons.append("Same survey/land number")

        # Same bank account
        if bank_account and existing.get("bank_account") == bank_account:
            reasons.append("Same bank account")

        # Name similarity (basic Jaccard similarity)
        existing_name = existing.get("farmer_name", "").lower()
        if farmer_name and existing_name:
            name_tokens = set(farmer_name.split())
            existing_tokens = set(existing_name.split())
            if name_tokens and existing_tokens:
                similarity = len(name_tokens & existing_tokens) / len(name_tokens | existing_tokens)
                if similarity > 0.6:
                    reasons.append(f"Name similarity: {similarity:.0%}")

        if reasons:
            duplicates.append({
                "matching_application_id": existing.get("application_id"),
                "matching_farmer": existing.get("farmer_name"),
                "reasons": reasons,
                "match_confidence": len(reasons) / 4.0,
            })

    return duplicates


def detect_land_overlap(application: dict, existing_applications: list) -> dict:
    """
    Detect if the same land is claimed by multiple applicants
    by checking survey numbers and total claimed area.
    """
    survey_no = application.get("survey_number", "")
    claimed_area = application.get("land_area", 0)

    overlapping = [
        app for app in existing_applications
        if app.get("survey_number") == survey_no and app.get("application_id") != application.get("application_id")
    ]

    if overlapping:
        total_claimed = sum(app.get("land_area", 0) for app in overlapping) + claimed_area
        registered_area = application.get("registered_area", claimed_area)

        return {
            "overlap_detected": total_claimed > registered_area,
            "total_claimed_area": total_claimed,
            "registered_area": registered_area,
            "overlapping_applications": [app.get("application_id") for app in overlapping],
            "excess_percentage": round(((total_claimed - registered_area) / max(registered_area, 0.01)) * 100, 1) if total_claimed > registered_area else 0,
        }

    return {"overlap_detected": False}


def run_full_fraud_scan(application: dict, existing_applications: list = None) -> dict:
    """
    Run complete fraud detection pipeline on an application.
    """
    if existing_applications is None:
        existing_applications = []

    # ML anomaly detection
    ml_result = calculate_fraud_score(application)

    # Duplicate check
    duplicates = check_duplicates(application, existing_applications)

    # Land overlap check
    land_overlap = detect_land_overlap(application, existing_applications)

    # Combine results
    fraud_types = []
    if ml_result["prediction"] == "anomaly":
        fraud_types.append("suspicious_pattern")
    if duplicates:
        fraud_types.append("duplicate_application")
    if land_overlap.get("overlap_detected"):
        fraud_types.append("land_overlap")

    # Aggregate fraud score
    combined_score = ml_result["fraud_score"]
    if duplicates:
        combined_score = max(combined_score, 0.7 + len(duplicates) * 0.05)
    if land_overlap.get("overlap_detected"):
        combined_score = max(combined_score, 0.8)

    combined_score = min(combined_score, 0.99)

    # Final risk level
    if combined_score >= 0.8:
        risk_level = "critical"
    elif combined_score >= 0.6:
        risk_level = "high"
    elif combined_score >= 0.4:
        risk_level = "medium"
    else:
        risk_level = "low"

    return {
        "fraud_score": round(combined_score, 3),
        "risk_level": risk_level,
        "fraud_types": fraud_types,
        "ml_analysis": ml_result,
        "duplicate_matches": duplicates,
        "land_overlap": land_overlap,
        "scanned_at": datetime.utcnow().isoformat(),
        "recommendation": _generate_recommendation(risk_level, fraud_types),
    }


def _generate_recommendation(risk_level: str, fraud_types: list) -> str:
    """Generate human-readable recommendation based on fraud analysis."""
    if risk_level == "critical":
        return "BLOCK application immediately. Multiple fraud indicators detected. Forward to investigation unit."
    elif risk_level == "high":
        types_str = ", ".join(fraud_types) if fraud_types else "anomalous patterns"
        return f"Flag for mandatory manual review. Detected: {types_str}. Do not process until verified."
    elif risk_level == "medium":
        return "Recommend additional verification. Request supporting documents before approval."
    else:
        return "No significant fraud indicators. Application can proceed through normal workflow."
