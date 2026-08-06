from fastapi import FastAPI

from .api.resume import router as resume_router

app = FastAPI(
    title="ResuForge AI", 
    description="ResuForge AI is resume analysis tool that uses AI to analyze resumes and provide feedback on how to improve them.", 
    version="1.0.0"
)

app.include_router(resume_router)

@app.get("/")
def read_root():
    return {
        "message": "ResuForge AI Backend Running"
    }
