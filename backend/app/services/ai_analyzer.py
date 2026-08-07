
from app.core.config import GEMINI_API_KEY
from google import genai

client = genai.Client(api_key=GEMINI_API_KEY) if GEMINI_API_KEY else None


def _build_prompt(resume_text: str, target_role: str | None = None) -> str:
    role_context = f" for the role of {target_role}" if target_role else ""

    return f"""
    You are an expert resume reviewer.

    Analyze the following resume{role_context} and provide concise, actionable feedback.

    Resume:
    {resume_text}

    Instructions:
    - Use only information that is present in the resume.
    - Do not invent experience, skills, tools, or achievements.
    - If important information is missing, say "Not enough information provided."
    - Be specific, practical, and grounded in the content.
    - Focus on relevance, clarity, impact, ATS compatibility, and missing evidence.

    Return your response as plain text only.

    Use this format exactly:

    Overall Assessment:
    <brief assessment>

    Strengths:
    - Point 1
    - Point 2
    - Point 3

    Weaknesses:
    - Point 1
    - Point 2
    - Point 3

    Suggestions for Improvement:
    1. Suggestion 1
    2. Suggestion 2
    3. Suggestion 3

    ATS Optimization Tips:
    - Tip 1
    - Tip 2
    - Tip 3

    Do not return JSON, Markdown, HTML, XML, or code blocks.
    Return only plain text.
    """.strip()


def analyze_resume(resume_text: str, target_role: str | None = None) -> str:
    if not resume_text or not resume_text.strip():
        raise ValueError("Resume text cannot be empty.")

    if not GEMINI_API_KEY:
        raise RuntimeError("GEMINI_API_KEY is not configured.")

    prompt = _build_prompt(resume_text, target_role)

    try:
        global client
        if client is None:  
            
            client = genai.Client(api_key=GEMINI_API_KEY)

        response = client.models.generate_content(
            model="gemini-3.6-flash",
            contents=prompt,
        )
        return getattr(response, "text", "").strip()
    except Exception as exc:
        raise RuntimeError(f"Failed to analyze resume: {exc}") from exc


