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


def _extract_experience_requirement(text: str,) -> dict[str, Any] | None:
    """
    Extract minimum/maximum years of experience.

    Examples:
        "7+ years" -> min_years=7
        "3 years" -> min_years=3
        "3-5 years" -> min_years=3, max_years=5
    """

    # Check ranges first so "3-5 years" is not captured as "3 years".
    range_pattern = (
        r"\b"
        r"(?P<min>\d+)"
        r"\s*-\s*"
        r"(?P<max>\d+)"
        r"\s*"
        r"(?:years?|yrs?)"
        r"\b"
    )

    range_match = re.search(
        range_pattern,
        text,
        re.IGNORECASE,
    )

    if range_match:
        return {
            "min_years": int(range_match.group("min")),
            "max_years": int(range_match.group("max")),
            "raw_requirement": range_match.group(0),
            "is_required": True,
        }

    # Check requirements such as "7+ years" or "7 years".
    single_pattern = (
        r"\b"
        r"(?P<min>\d+)"
        r"\+?"
        r"\s*"
        r"(?:years?|yrs?)"
        r"\b"
    )

    single_match = re.search(
        single_pattern,
        text,
        re.IGNORECASE,
    )

    if single_match:
        return {
            "min_years": int(single_match.group("min")),
            "max_years": None,
            "raw_requirement": single_match.group(0),
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