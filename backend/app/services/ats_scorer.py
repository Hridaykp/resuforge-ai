import re
from typing import Any


def calculate_ats_score(
    resume_text: str,
    target_role: str | None = None,
    job_description: str | None = None,
) -> dict[str, Any]:
    """
    Calculate an explainable ATS-oriented resume score out of 100.

    Score categories:
    - Completeness: 20
    - Section structure: 20
    - Skills & keywords: 20
    - Experience & achievements: 20
    - Readability & ATS parsing: 20

    If a job description is provided, keyword relevance is evaluated
    against relevant technical terms from the job description.
    Otherwise, a general technical-skill check is used.

    This is an ATS compatibility estimate, not the score used by
    any specific ATS platform.
    """

    if not resume_text or not resume_text.strip():
        raise ValueError("Resume text cannot be empty.")

    text = resume_text.strip()
    text_lower = text.lower()

    # ---------------------------------------------------------
    # Helper
    # ---------------------------------------------------------

    def contains_term(
        term: str,
        content: str = text_lower,
    ) -> bool:
        """
        Check whether a term exists without matching it as part
        of another word.
        """
        escaped = re.escape(term.lower())

        return bool(
            re.search(
                rf"(?<!\w){escaped}(?!\w)",
                content,
            )
        )

    # ---------------------------------------------------------
    # Score structure
    # ---------------------------------------------------------

    scores = {
        "completeness": 0,              # 20
        "section_structure": 0,         # 20
        "skills_keywords": 0,           # 20
        "experience_achievements": 0,  # 20
        "readability_parsing": 0,       # 20
    }

    # ---------------------------------------------------------
    # 1. Completeness - 20 points
    # ---------------------------------------------------------

    completeness_checks = {
        "email": bool(
            re.search(
                r"\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b",
                text,
                re.IGNORECASE,
            )
        ),

        "phone": bool(
            re.search(
                r"(?:\+?\d[\d\s().-]{7,}\d)",
                text,
            )
        ),

        "education": any(
            contains_term(term)
            for term in [
                "education",
                "degree",
                "bachelor",
                "master",
                "b.tech",
                "m.tech",
                "b.e.",
                "m.e.",
                "university",
                "college",
            ]
        ),

        "skills": any(
            contains_term(term)
            for term in [
                "skills",
                "technical skills",
                "technologies",
                "technical expertise",
            ]
        ),

        "experience": any(
            contains_term(term)
            for term in [
                "experience",
                "work experience",
                "professional experience",
                "employment",
            ]
        ),
    }

    completeness_count = sum(
        completeness_checks.values()
    )

    scores["completeness"] = min(
        completeness_count * 4,
        20,
    )

    # ---------------------------------------------------------
    # 2. Section Structure - 20 points
    # ---------------------------------------------------------

    standard_sections = [
        "summary",
        "professional summary",
        "objective",
        "experience",
        "work experience",
        "professional experience",
        "education",
        "skills",
        "technical skills",
        "projects",
        "certifications",
        "achievements",
    ]

    found_sections: set[str] = set()

    for section in standard_sections:
        if not contains_term(section):
            continue

        if section in {
            "experience",
            "work experience",
            "professional experience",
        }:
            found_sections.add("experience")

        elif section in {
            "skills",
            "technical skills",
        }:
            found_sections.add("skills")

        elif section in {
            "summary",
            "professional summary",
            "objective",
        }:
            found_sections.add("summary")

        else:
            found_sections.add(section)

    section_count = len(found_sections)

    scores["section_structure"] = min(
        section_count * 3,
        20,
    )

    # ---------------------------------------------------------
    # 3. Skills & Keywords - 20 points
    # ---------------------------------------------------------

    common_technical_skills = [
        # Languages
        "python",
        "java",
        "javascript",
        "typescript",
        "c",
        "c++",
        "c#",

        # Frontend
        "html",
        "html5",
        "css",
        "react",
        "angular",
        "vue",
        "node",
        "tailwind",
        "bootstrap",

        # Backend
        "fastapi",
        "django",
        "flask",
        "spring",
        "asp.net",
        ".net",

        # Databases
        "sql",
        "postgresql",
        "mysql",
        "mongodb",
        "redis",

        # Cloud / DevOps
        "docker",
        "kubernetes",
        "aws",
        "azure",
        "gcp",
        "terraform",
        "jenkins",

        # Tools / APIs
        "git",
        "github",
        "rest",
        "api",
        "graphql",
        "linux",
    ]

    matched_keywords: list[str] = []

    # ---------------------------------------------------------
    # JD-based keyword matching
    # ---------------------------------------------------------

    if job_description and job_description.strip():

        jd_lower = job_description.lower()

        target_keywords = [
            skill
            for skill in common_technical_skills
            if contains_term(skill, jd_lower)
        ]

        # Remove duplicates while preserving order.
        target_keywords = list(
            dict.fromkeys(target_keywords)
        )

        for keyword in target_keywords:
            if contains_term(keyword):
                matched_keywords.append(keyword)

        if target_keywords:
            keyword_ratio = (
                len(matched_keywords)
                / len(target_keywords)
            )

            scores["skills_keywords"] = min(
                round(keyword_ratio * 20),
                20,
            )
        else:
            scores["skills_keywords"] = 0

    # ---------------------------------------------------------
    # General keyword matching
    # ---------------------------------------------------------

    else:

        for skill in common_technical_skills:
            if contains_term(skill):
                matched_keywords.append(skill)

        # Remove duplicates.
        matched_keywords = list(
            dict.fromkeys(matched_keywords)
        )

        scores["skills_keywords"] = min(
            len(matched_keywords) * 2,
            20,
        )

    # ---------------------------------------------------------
    # 4. Experience & Achievements - 20 points
    # ---------------------------------------------------------

    experience_indicators = [
        "experience",
        "intern",
        "internship",
        "developer",
        "engineer",
        "worked",
        "project",
        "developed",
        "implemented",
        "built",
        "designed",
        "created",
        "deployed",
        "managed",
    ]

    experience_count = sum(
        1
        for keyword in experience_indicators
        if contains_term(keyword)
    )

    experience_points = min(
        experience_count * 1.5,
        12,
    )

    achievement_indicators = [
        "increased",
        "decreased",
        "improved",
        "reduced",
        "saved",
        "optimized",
        "users",
        "requests",
        "performance",
        "latency",
        "revenue",
        "cost",
        "growth",
    ]

    achievement_count = sum(
        1
        for indicator in achievement_indicators
        if contains_term(indicator)
    )

    # Percentage evidence.
    if "%" in text:
        achievement_count += 1

    achievement_points = min(
        achievement_count * 2,
        8,
    )

    scores["experience_achievements"] = min(
        round(
            experience_points
            + achievement_points
        ),
        20,
    )

    # ---------------------------------------------------------
    # 5. Readability & ATS Parsing - 20 points
    # ---------------------------------------------------------

    word_count = len(text.split())

    # Resume length.
    if 300 <= word_count <= 1000:
        scores["readability_parsing"] += 8

    elif 200 <= word_count <= 1200:
        scores["readability_parsing"] += 5

    elif word_count > 0:
        scores["readability_parsing"] += 2

    # Bullet points.
    bullet_count = (
        text.count("•")
        + len(
            re.findall(
                r"(?m)^\s*[-*]\s+",
                text,
            )
        )
    )

    if bullet_count >= 8:
        scores["readability_parsing"] += 5

    elif bullet_count >= 5:
        scores["readability_parsing"] += 4

    elif bullet_count >= 3:
        scores["readability_parsing"] += 2

    # Extremely long lines may indicate poor extraction.
    lines = [
        line.strip()
        for line in text.splitlines()
        if line.strip()
    ]

    long_lines = sum(
        1
        for line in lines
        if len(line) > 180
    )

    if long_lines == 0:
        scores["readability_parsing"] += 4

    elif long_lines <= 2:
        scores["readability_parsing"] += 2

    # Standard sections improve parsing.
    if section_count >= 5:
        scores["readability_parsing"] += 3

    elif section_count >= 3:
        scores["readability_parsing"] += 2

    scores["readability_parsing"] = min(
        scores["readability_parsing"],
        20,
    )

    # ---------------------------------------------------------
    # Final Score
    # ---------------------------------------------------------

    total_score = sum(scores.values())

    return {
        "ats_score": total_score,
        "max_score": 100,
        "breakdown": scores,
        "matched_keywords": matched_keywords,
        "target_role": target_role,
        "job_description_provided": bool(
            job_description
            and job_description.strip()
        ),
    }
