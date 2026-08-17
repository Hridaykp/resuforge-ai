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
) -> dict[str, Any] | None:
    """
    Extract experience requirements from a JD.

    Supports:
    - 2-5 years
    - 2 to 5 years
    - 2+ years
    - 2 years
    """

    patterns = [
        # Range: 2-5 years / 2 to 5 years
        (
            (
                r"\b(\d+(?:\.\d+)?)\s*"  
                r"(?:-|–|—|to)\s*"
                r"(\d+(?:\.\d+)?)\s*"
                r"(?:years?|yrs?)\b"
            ),
            "range",
        ),

        # Minimum: 2+ years
        (
            (
                r"\b(\d+(?:\.\d+)?)\s*\+\s*"  
                r"(?:years?|yrs?)\b"
            ),
            "minimum",
        ),

        # Exact: 2 years
        (
            (
                r"\b(\d+(?:\.\d+)?)\s*"  
                r"(?:years?|yrs?)\b"
            ),
            "exact",
        ),
    ]

    for pattern, requirement_type in patterns:

        match = re.search(
            pattern,
            text,
            re.IGNORECASE,
        )

        if not match:
            continue

        if requirement_type == "range":
            min_years = float(match.group(1))
            max_years = float(match.group(2))

            return {
                "min_years": min_years,
                "max_years": max_years,
                "raw_requirement": match.group(0),
                "is_required": True,
            }

        if requirement_type == "minimum":
            min_years = float(match.group(1))

            return {
                "min_years": min_years,
                "max_years": None,
                "raw_requirement": match.group(0),
                "is_required": True,
            }

        if requirement_type == "exact":
            years = float(match.group(1))

            return {
                "min_years": years,
                "max_years": years,
                "raw_requirement": match.group(0),
                "is_required": True,
            }

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

def _extract_responsibilities(
    text: str,
) -> list[str]:
    """
    Extract responsibility-like lines from the JD.

    This is intentionally lightweight for V1.
    A stronger semantic extraction can be added later with Gemini.
    """

    responsibilities = []

    lines = text.splitlines()

    responsibility_keywords = (
        "responsibilities",
        "responsibility",
        "what you'll do",
        "what you will do",
        "requirements",
        "role",
        "you will",
        "you'll",
    )

    in_responsibility_section = False

    for line in lines:
        cleaned = line.strip()

        if not cleaned:
            continue

        lower_line = cleaned.lower()

        # Detect a likely responsibility section.
        if any(
            keyword in lower_line
            for keyword in responsibility_keywords
        ):
            in_responsibility_section = True
            continue

        if in_responsibility_section and cleaned.startswith(
            ("-", "•", "*", "–", "—")
        ):
            # Accept bullet-point lines.
            responsibility = cleaned.lstrip(
                "-•*–— "
            ).strip()

            if responsibility:
                responsibilities.append(
                    responsibility
                )

    return responsibilities[:15]


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
    responsibilities = []
    return {
        "target_role": target_role,

        "requirements": {
            "experience": experience_requirement,
            "skills": {
                "required": skills,
                "preferred": [],
            },
            "education": {
                "required": education_requirements,
                "preferred": [],
            },
            "certifications": [],
        },

        "responsibilities": responsibilities,

        "keywords": skills,

        "skill_count": {
            "required": len(skills),
            "preferred": 0,
            "total": len(skills),
        },
    }