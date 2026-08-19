
from fastapi import APIRouter, File, UploadFile

from ..services.ai_analyzer import analyze_resume
from ..services.ats_scorer import calculate_ats_score
from ..services.resume_analyzer import analyze_resume_structure
from ..services.resume_parser import extract_text

router = APIRouter(
    prefix= "/resume",
    tags = ["Resume"],
)



@router.post("/upload")
async def upload_resume(file: UploadFile = File(...)): 
    file_byte = await file.read()
    # print(f"Received file: {file.filename}, size: {len(file_byte)} bytes")
    resume_text = extract_text(file.filename, file_byte)

    return {
        "filename": file.filename,
        "resume_text": resume_text,
    }


@router.post("/analyze")
async def analyze_resume_endpoint(
    file: UploadFile = File(...),
    target_role: str | None = None,
    job_description: str | None = None
):
    file_byte = await file.read()
    resume_text = extract_text(file.filename, file_byte)

    ats_result = calculate_ats_score(
        resume_text=resume_text,
        target_role = target_role, 
        job_description=job_description
    )

    ai_result = analyze_resume(
        resume_text=resume_text,
        target_role=target_role,
        job_description=job_description
    )

    resume_result = analyze_resume_structure(
        resume_text=resume_text,
    )

    return {
        "filename": file.filename,
        "resume_analysis": resume_result,
        "ats_analysis": ats_result,
        "ai_analysis": ai_result,
    }

    