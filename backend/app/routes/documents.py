"""Document Processing API routes."""
from fastapi import APIRouter, UploadFile, File, Form
from pydantic import BaseModel
from typing import Optional
from app.services.document_verifier import process_document, DOCUMENT_REQUIREMENTS

router = APIRouter(prefix="/api/documents", tags=["Documents"])


class DocumentVerifyRequest(BaseModel):
    text: str
    doc_type: str
    application_id: Optional[str] = None


@router.get("/types")
async def get_document_types():
    """Get supported document types and their requirements."""
    return {
        doc_type: {
            "display_name": info["display_name"],
            "required_fields": [f.replace("_", " ").title() for f in info["required_fields"]],
        }
        for doc_type, info in DOCUMENT_REQUIREMENTS.items()
    }


@router.post("/verify")
async def verify_document(request: DocumentVerifyRequest):
    """
    Verify a document by processing extracted text.
    In production, this would accept file upload and run OCR first.
    """
    result = process_document(
        text=request.text,
        doc_type=request.doc_type,
        application_id=request.application_id,
    )
    return result


@router.post("/upload")
async def upload_and_process(
    file: UploadFile = File(...),
    doc_type: str = Form(...),
    application_id: str = Form(None),
):
    """
    Upload a document file and process with OCR + AI verification.
    Currently simulates OCR — in production would use EasyOCR.
    """
    content = await file.read()
    file_size = len(content)

    # Simulated OCR text extraction
    simulated_text = f"""
    Name: Farmer Name Extracted
    Survey No: 142/A
    Area: 2.5 hectares
    Village: Sample Village
    Taluka: Sample Taluka
    District: Pune
    File: {file.filename} ({file_size} bytes)
    """

    result = process_document(
        text=simulated_text,
        doc_type=doc_type,
        application_id=application_id,
    )
    result["filename"] = file.filename
    result["file_size"] = file_size
    return result
