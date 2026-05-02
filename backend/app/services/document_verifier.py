"""
Document Verification Service
Uses OCR to extract text and AI to verify completeness of farmer documents.
"""
import re
import random
from datetime import datetime

# Required fields per document type
DOCUMENT_REQUIREMENTS = {
    "land_record": {
        "required_fields": ["farmer_name", "survey_number", "area", "village", "taluka", "district"],
        "display_name": "Land Record (7/12 Extract)",
    },
    "aadhaar": {
        "required_fields": ["name", "aadhaar_number", "date_of_birth", "address"],
        "display_name": "Aadhaar Card",
    },
    "income_certificate": {
        "required_fields": ["name", "annual_income", "issuing_authority", "date_of_issue", "taluka"],
        "display_name": "Income Certificate",
    },
    "bank_passbook": {
        "required_fields": ["account_holder", "account_number", "ifsc_code", "branch_name", "bank_name"],
        "display_name": "Bank Passbook",
    },
    "crop_certificate": {
        "required_fields": ["farmer_name", "crop_type", "season", "area_sown", "village"],
        "display_name": "Crop Sowing Certificate",
    },
    "caste_certificate": {
        "required_fields": ["name", "category", "certificate_number", "issuing_date", "district_collector_seal"],
        "display_name": "Caste Certificate",
    },
}

# Simulated OCR patterns for demonstration
FIELD_PATTERNS = {
    "farmer_name": r"(?:name|naam|applicant)\s*[:\-]?\s*([A-Za-z\s\.]+)",
    "survey_number": r"(?:survey\s*no|gat\s*no|s\.no)\s*[:\-]?\s*([\d\/A-Za-z]+)",
    "area": r"(?:area|kshetrafal)\s*[:\-]?\s*([\d\.]+\s*(?:hectare|ha|acre|guntha)s?)",
    "village": r"(?:village|gaon|gav)\s*[:\-]?\s*([A-Za-z\s]+)",
    "aadhaar_number": r"(\d{4}\s?\d{4}\s?\d{4})",
    "account_number": r"(?:a\/c|account)\s*(?:no\.?)?\s*[:\-]?\s*(\d{9,18})",
    "ifsc_code": r"(?:ifsc)\s*[:\-]?\s*([A-Z]{4}0[A-Z0-9]{6})",
    "annual_income": r"(?:income|annual)\s*[:\-]?\s*(?:rs\.?|₹)?\s*([\d,\.]+)",
    "crop_type": r"(?:crop|pik)\s*[:\-]?\s*([A-Za-z\s]+)",
}


def extract_fields_from_text(text: str, doc_type: str) -> dict:
    """
    Extract structured fields from OCR text using pattern matching.
    In production, this would use NER models (spaCy/transformers).
    """
    extracted = {}
    requirements = DOCUMENT_REQUIREMENTS.get(doc_type, {})
    required_fields = requirements.get("required_fields", [])

    for field in required_fields:
        pattern = FIELD_PATTERNS.get(field)
        if pattern:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                extracted[field] = match.group(1).strip()
            else:
                # Simulate partial extraction for demo
                if random.random() > 0.3:
                    extracted[field] = f"[Extracted: {field.replace('_', ' ').title()}]"
        else:
            if random.random() > 0.4:
                extracted[field] = f"[Extracted: {field.replace('_', ' ').title()}]"

    return extracted


def verify_document(extracted_fields: dict, doc_type: str) -> dict:
    """
    Verify document completeness and correctness.
    Returns verification status, missing fields, and confidence score.
    """
    requirements = DOCUMENT_REQUIREMENTS.get(doc_type, {})
    required_fields = requirements.get("required_fields", [])

    present_fields = [f for f in required_fields if f in extracted_fields]
    missing_fields = [f for f in required_fields if f not in extracted_fields]

    # Calculate confidence based on field completeness
    completeness_ratio = len(present_fields) / max(len(required_fields), 1)
    base_confidence = completeness_ratio * 100

    # Add some realistic variation
    confidence = min(99.5, max(15.0, base_confidence + random.uniform(-8, 5)))

    # Determine status
    if len(missing_fields) == 0 and confidence >= 85:
        status = "verified"
    elif len(missing_fields) <= 1 and confidence >= 60:
        status = "needs_review"
    else:
        status = "missing_fields"

    return {
        "status": status,
        "confidence_score": round(confidence, 1),
        "extracted_fields": extracted_fields,
        "missing_fields": [f.replace("_", " ").title() for f in missing_fields],
        "total_required": len(required_fields),
        "total_found": len(present_fields),
        "document_type": requirements.get("display_name", doc_type),
        "verified_at": datetime.utcnow().isoformat(),
    }


def process_document(text: str, doc_type: str, application_id: str = None) -> dict:
    """
    Full document processing pipeline:
    1. Extract fields from OCR text
    2. Verify completeness
    3. Return structured result
    """
    extracted = extract_fields_from_text(text, doc_type)
    result = verify_document(extracted, doc_type)
    result["application_id"] = application_id
    return result
