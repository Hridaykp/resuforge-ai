import re
from typing import Any

COMMON_TECHNICAL_SKILLS = [
    # Languages
    "python",
    "java",
    "javascript",
    "typescript",
    "c",
    "c++",
    "c#",
    "go",

    # Backend
    "fastapi",
    "django",
    "flask",
    "spring",
    "node.js",
    "node",
    ".net",

    # Frontend
    "react",
    "angular",
    "vue",
    "html",
    "css",

    # Databases
    "sql",
    "postgresql",
    "postgres",
    "mysql",
    "mongodb",
    "redis",

    # Cloud / DevOps
    "aws",
    "azure",
    "gcp",
    "docker",
    "kubernetes",
    "terraform",
    "jenkins",

    # APIs / Tools
    "rest",
    "graphql",
    "git",
    "github",
    "linux",

    # Engineering concepts
    "microservices",
    "ci/cd",
    "unit testing",
    "integration testing",
]


EDUCATION_TERMS = [
    "bachelor",
    "master",
    "b.tech",
    "m.tech",
    "b.e.",
    "m.e.",
    "computer science",
    "information technology",
]


def _contains_term(term: str, text: str) -> bool:
    """Check whether a term appears as a complete term."""
    pattern = rf"(?<!\w){re.escape(term.lower())}(?!\w)"

    return bool(
        re.search(
            pattern,
            text.lower(),
        )
    )


def _extract_skills(text: str) -> list[str]:
    """Extract known technical skills from a job description."""
    skills = []

    for skill in COMMON_TECHNICAL_SKILLS:
        if _contains_term(skill, text):
            skills.append(skill)

    return list(dict.fromkeys(skills))


def _extract_experience_requirement(
    text: str,
) -> str | None:
    """Extract simple experience requirements."""

    patterns = [
        r"\b\d+\+?\s*(?:years?|yrs?)\b",
        r"\b\d+\s*-\s*\d+\s*(?:years?|yrs?)\b",
    ]

    for pattern in patterns:
        match = re.search(
            pattern,
            text,
            re.IGNORECASE,
        )

        if match:
            return match.group(0)

    return None


def _extract_education(
    text: str,
) -> list[str]:
    """Extract education-related requirements."""

    education = []

    for term in EDUCATION_TERMS:
        if _contains_term(term, text):
            education.append(term)

    return list(dict.fromkeys(education))


def analyze_job_description(
    job_description: str,
    target_role: str | None = None,
) -> dict[str, Any]:
    """
    Analyze a job description and extract
    ATS-relevant requirements.
    """

    if not job_description or not job_description.strip():
        raise ValueError(
            "Job description cannot be empty."
        )

    text = job_description.strip()

    skills = _extract_skills(text)

    experience_requirement = (
        _extract_experience_requirement(text)
    )

    education_requirements = _extract_education(text)

    return {
        "target_role": target_role,
        "skills": skills,
        "experience_requirement": experience_requirement,
        "education_requirements": education_requirements,
        "skill_count": len(skills),
    }