"""Dashboard API routes."""
from fastapi import APIRouter

router = APIRouter(prefix="/api/dashboard", tags=["Dashboard"])

@router.get("/stats")
async def get_dashboard_stats():
    """Get dashboard summary statistics."""
    return {
        "total_applications": 12847,
        "pending_review": 342,
        "fraud_alerts": 28,
        "missing_documents": 156,
        "high_priority_cases": 43,
        "resolved_today": 89,
        "avg_processing_time": "2.4 hrs",
        "ai_accuracy": 96.8,
    }

@router.get("/alerts")
async def get_recent_alerts():
    """Get recent AI-generated alerts."""
    return [
        {"id": "ALT-001", "type": "fraud", "message": "Duplicate land record detected for Aadhaar ending 4523", "severity": "critical", "time": "5 min ago", "module": "Fraud Detection"},
        {"id": "ALT-002", "type": "document", "message": "Missing income certificate in application #APP-8842", "severity": "warning", "time": "12 min ago", "module": "Document Processing"},
        {"id": "ALT-003", "type": "grievance", "message": "Urgent crop damage complaint from Nashik district", "severity": "high", "time": "18 min ago", "module": "Grievance System"},
        {"id": "ALT-004", "type": "field", "message": "Crop type mismatch — claimed wheat in non-wheat zone", "severity": "high", "time": "25 min ago", "module": "Field Verification"},
    ]
