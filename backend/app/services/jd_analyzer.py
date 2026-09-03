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
    "rust",
    "kotlin",
    "php",
    "ruby",

    # Backend
    "fastapi",
    "django",
    "flask",
    "spring",
    "spring boot",
    "node.js",
    "node",
    ".net",
    "asp.net",

    # Frontend
    "react",
    "angular",
    "vue",
    "html",
    "css",
    "tailwind",

    # Databases
    "sql",
    "postgresql",
    "postgres",
    "mysql",
    "mongodb",
    "redis",
    "sqlite",
    "oracle",

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
    "rest api",
    "graphql",
    "git",
    "github",
    "gitlab",
    "linux",

    # Engineering concepts
    "microservices",
    "ci/cd",
    "unit testing",
    "integration testing",
    "testing",
    "debugging",
    "troubleshooting",
    "clean code",
    "agile",
    "scrum",
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


def _contains_term(term: str,text: str, ) -> bool:
    """
    Check whether a term appears as a standalone skill/term.

    Handles programming languages with special characters:

        C     != C#
        C     != C++
        Java  != JavaScript
        C++   == C++
        C#    == C#
    """

    term = term.lower().strip()
    text = text.lower()

    escaped_term = re.escape(term)

    if term in {"c", "c++", "c#"}:
        pattern = (
            rf"(?<![a-z0-9+#])"
            rf"{escaped_term}"
            rf"(?![a-z0-9+#])"
        )
    else:
        pattern = (
            rf"(?<![a-z0-9])"
            rf"{escaped_term}"
            rf"(?![a-z0-9])"
        )

    return bool(
        re.search(pattern, text)
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
    Extract responsibility-like statements from a job description.

    Supports:
    1. Bullet-point JDs
    2. Responsibility sections
    3. Normal prose JDs

    Example:

        "Design, develop and maintain scalable applications.
         Collaborate with teams and troubleshoot issues."

    Can produce:

        [
            "Design, develop and maintain scalable applications.",
            "Collaborate with teams and troubleshoot issues."
        ]
    """

    responsibilities: list[str] = []

    lines = [
        line.strip()
        for line in text.splitlines()
        if line.strip()
    ]

    # ---------------------------------------------------------
    # 1. First try explicit responsibility sections
    # ---------------------------------------------------------

    responsibility_headers = (
        "responsibilities",
        "responsibility",
        "what you'll do",
        "what you will do",
        "what you'll be doing",
        "role responsibilities",
        "key responsibilities",
        "duties",
    )

    in_responsibility_section = False

    for line in lines:
        lower_line = line.lower()

        # Detect responsibility section.
        if any(
            header in lower_line
            for header in responsibility_headers
        ):
            in_responsibility_section = True
            continue

        if in_responsibility_section:

            # Stop when another obvious section starts.
            if (
                lower_line.endswith(":")
                and len(lower_line.split()) <= 6
            ):
                in_responsibility_section = False
                continue

            # Bullet point.
            if line.startswith(
                ("-", "•", "*", "–", "—")
            ):
                responsibility = line.lstrip(
                    "-•*–— "
                ).strip()

                if responsibility:
                    responsibilities.append(
                        responsibility
                    )

    # If we found responsibilities, return them.
    if responsibilities:
        return responsibilities[:15]

    # ---------------------------------------------------------
    # 2. Look for bullet points anywhere in the JD
    # ---------------------------------------------------------

    bullet_responsibilities: list[str] = []

    for line in lines:

        if line.startswith(
            ("-", "•", "*", "–", "—")
        ):
            responsibility = line.lstrip(
                "-•*–— "
            ).strip()

            if responsibility:
                bullet_responsibilities.append(
                    responsibility
                )

    if bullet_responsibilities:
        return bullet_responsibilities[:15]

    # ---------------------------------------------------------
    # 3. Fallback: analyze normal prose
    # ---------------------------------------------------------
    #
    # Example:
    #
    # "Software Engineer responsible for designing,
    # developing, testing, and maintaining scalable
    # applications. Collaborate with teams, write clean
    # code, troubleshoot issues, and implement new features."
    #
    # Split the prose into sentences and identify sentences
    # containing responsibility/action verbs.
    # ---------------------------------------------------------

    action_verbs = {
        "design",
        "designing",
        "develop",
        "developing",
        "build",
        "building",
        "create",
        "creating",
        "implement",
        "implementing",
        "maintain",
        "maintaining",
        "test",
        "testing",
        "debug",
        "debugging",
        "troubleshoot",
        "troubleshooting",
        "collaborate",
        "collaborating",
        "write",
        "writing",
        "develop",  # noqa: B033
        "developing",  # noqa: B033
        "deploy",
        "deploying",
        "manage",
        "managing",
        "optimize",
        "optimizing",
        "integrate",
        "integrating",
        "review",
        "reviewing",
        "support",
        "supporting",
    }

    # Convert newlines into spaces.
    normalized_text = " ".join(lines)

    # Split into sentences.
    sentences = re.split(
        r"(?<=[.!?])\s+",
        normalized_text,
    )

    for sentence in sentences:

        sentence = sentence.strip()

        if not sentence:
            continue

        sentence_lower = sentence.lower()

        # Check whether sentence contains an action verb.
        words = set(
            re.findall(
                r"\b[a-zA-Z]+\b",
                sentence_lower,
            )
        )

        if words.intersection(action_verbs):

            responsibilities.append(sentence)

    # ---------------------------------------------------------
    # 4. Handle "responsible for X, Y, Z"
    # ---------------------------------------------------------
    #
    # Example:
    #
    # "Responsible for designing, developing, testing,
    # and maintaining scalable applications."
    #
    # Sentence-level extraction may keep this as one item,
    # which is actually fine for V1.
    # ---------------------------------------------------------

    return list(
        dict.fromkeys(responsibilities)
    )[:15]




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

    experience_requirement = (_extract_experience_requirement(text))

    education_requirements = _extract_education(text)
    responsibilities = _extract_responsibilities(text)
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