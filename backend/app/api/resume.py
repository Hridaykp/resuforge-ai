from app.services.resume_parser import extract_text
from fastapi import APIRouter, File, UploadFile

from ..services.ai_analyzer import analyze_resume

router = APIRouter(
    prefix= "/resume",
    tags = ["Resume"],
)



@router.post("/upload")
async def upload_resume(file: UploadFile = File(...)): 
    file_byte = await file.read()
    # print(f"Received file: {file.filename}, size: {len(file_byte)} bytes")
    resume_text = extract_text(file.filename, file_byte)
    anslysis_result = analyze_resume(resume_text)
    
    return {
        "filename": file.filename,
        "analysis_result": anslysis_result
    }