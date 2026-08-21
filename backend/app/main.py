from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .api.resume import router as resume_router

app = FastAPI(
    title="ResuForge AI", 
    description="ResuForge AI is resume analysis tool that uses AI to analyze resumes and provide feedback on how to improve them.", 
    version="1.0.0"
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(resume_router)

@app.get("/")
def read_root():
    return {
        "message": "ResuForge AI Backend Running"
    }
