"""
Grievance Classification Service
NLP-based text classification for categorizing farmer complaints
and predicting priority levels.
"""
import re
from datetime import datetime

# Keyword-based classification (production would use spaCy/transformers)
CATEGORY_KEYWORDS = {
    "subsidy": [
        "subsidy", "payment", "pm-kisan", "pm kisan", "dbt", "installment",
        "amount", "money", "fund", "benefit", "scheme amount", "not received",
        "pending payment", "bank transfer", "credited", "disbursement",
        "kisan samman", "nidhi", "financial assistance",
    ],
    "insurance": [
        "insurance", "pmfby", "crop insurance", "fasal bima", "premium",
        "claim", "settlement", "policy", "coverage", "insured", "indemnity",
        "compensation", "loss assessment", "survey", "insurance company",
    ],
    "crop_damage": [
        "crop damage", "flood", "drought", "hailstorm", "pest", "disease",
        "destroyed", "damaged", "loss", "natural disaster", "cyclone",
        "heavy rain", "waterlogging", "crop failure", "standing crop",
        "assessment", "compensation", "relief",
    ],
    "water_issue": [
        "water", "irrigation", "canal", "dam", "borewell", "groundwater",
        "water supply", "drought", "dry", "rainfall", "water shortage",
        "well", "pump", "drip irrigation", "sprinkler", "water release",
    ],
    "technical": [
        "login", "password", "otp", "portal", "website", "app", "error",
        "technical", "system", "update", "registration", "form", "upload",
        "download", "certificate", "unable to access", "not working",
        "mobile", "sms", "aadhaar link", "seeding",
    ],
}

PRIORITY_INDICATORS = {
    "urgent": [
        "urgent", "immediate", "emergency", "critical", "asap", "dying",
        "starvation", "completely destroyed", "no food", "life threat",
        "suicide", "desperate", "weeks", "already expired",
    ],
    "high": [
        "months", "long time", "repeated", "no response", "escalate",
        "serious", "severe", "major", "significant", "substantial",
        "completely", "total loss", "entire crop", "all destroyed",
    ],
    "medium": [
        "request", "please check", "kindly", "issue", "problem",
        "facing", "difficulty", "need help", "re-verify", "incorrect",
    ],
    "low": [
        "query", "information", "status", "when", "how to", "guide",
        "general", "feedback", "suggestion", "clarification",
    ],
}


def classify_grievance(complaint_text: str) -> dict:
    """
    Classify a grievance complaint into category and priority.

    Uses keyword matching with TF-IDF-like scoring.
    Production version would use fine-tuned transformer model.
    """
    text_lower = complaint_text.lower()
    words = set(re.findall(r'\b\w+\b', text_lower))
    text_for_phrase_match = text_lower

    # Score each category
    category_scores = {}
    for category, keywords in CATEGORY_KEYWORDS.items():
        score = 0
        matched_keywords = []
        for keyword in keywords:
            if " " in keyword:
                # Phrase matching
                if keyword in text_for_phrase_match:
                    score += 2.0  # Phrases are more specific
                    matched_keywords.append(keyword)
            else:
                if keyword in words:
                    score += 1.0
                    matched_keywords.append(keyword)
        category_scores[category] = {
            "score": score,
            "matched": matched_keywords,
        }

    # Find best category
    best_category = max(category_scores, key=lambda k: category_scores[k]["score"])
    best_score = category_scores[best_category]["score"]

    # Calculate confidence
    total_score = sum(cs["score"] for cs in category_scores.values())
    confidence = (best_score / max(total_score, 1)) * 100 if total_score > 0 else 50.0
    confidence = min(98.5, max(30.0, confidence))

    # Determine priority
    priority = "medium"  # default
    priority_scores = {}
    for level, indicators in PRIORITY_INDICATORS.items():
        p_score = sum(1 for ind in indicators if ind in text_for_phrase_match)
        priority_scores[level] = p_score

    best_priority = max(priority_scores, key=lambda k: priority_scores[k])
    if priority_scores[best_priority] > 0:
        priority = best_priority

    # If complaint is long and mentions specific amounts/dates, bump priority
    if len(complaint_text) > 200 and any(
        term in text_lower for term in ["months", "not received", "destroyed", "immediate"]
    ):
        if priority == "low":
            priority = "medium"
        elif priority == "medium":
            priority = "high"

    return {
        "category": best_category,
        "priority": priority,
        "confidence": round(confidence, 1),
        "category_scores": {k: round(v["score"], 2) for k, v in category_scores.items()},
        "matched_keywords": category_scores[best_category]["matched"][:5],
        "classified_at": datetime.utcnow().isoformat(),
    }


def batch_classify(complaints: list) -> list:
    """Classify multiple complaints at once."""
    return [
        {**classify_grievance(c["text"]), "complaint_id": c.get("id")}
        for c in complaints
    ]
