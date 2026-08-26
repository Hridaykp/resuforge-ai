import re

# =========================================================
# Exact aliases
# =========================================================

SKILL_ALIASES: dict[str, str] = {

    # React
    "reactjs": "react",
    "react.js": "react",
    "react js": "react",

    # AWS
    "amazon web services": "aws",
    "amazon aws": "aws",
    "aws cloud": "aws",

    # JavaScript
    "js": "javascript",

    # TypeScript
    "ts": "typescript",

    # Node.js
    "nodejs": "node.js",
    "node js": "node.js",

    # C#
    "csharp": "c#",
    "c sharp": "c#",

    # C++
    "cpp": "c++",
    "c plus plus": "c++",

    # .NET
    "dotnet": ".net",
    "dot net": ".net",
}



# =========================================================
# Broader skill categories
#
# These are useful for semantic/general classification,
# but SHOULD NOT be used to claim that one specific
# technology exists in the resume.
# =========================================================

SKILL_CATEGORIES: dict[str, set[str]] = {
    "sql": {
        "sql",
        "mysql",
        "postgresql",
        "postgres",
        "sql server",
        "microsoft sql server",
        "oracle",
        "sqlite",
    },
}


# =========================================================
# Normalize
# =========================================================

def normalize_skill(skill: str) -> str:
    """
    Normalize a skill to its canonical exact name.

    Examples:
        MySQL -> mysql
        PostgreSQL -> postgresql
        ReactJS -> react
        React.js -> react
        AWS Cloud -> aws
        C Sharp -> c#
    """

    normalized = skill.strip().lower()

    normalized = re.sub(
        r"\s+",
        " ",
        normalized,
    )

    return SKILL_ALIASES.get(
        normalized,
        normalized,
    )


# =========================================================
# Contains term
# =========================================================

def _contains_term(
    term: str,
    text: str,
) -> bool:
    """
    Check whether a skill exists as a standalone term.

    Unlike a normal word-boundary check, this also handles
    programming-language names correctly.

    Examples:
        C     matches "C"
        C     does NOT match "C#"
        C     does NOT match "C++"
        C++   matches "C++"
        C#    matches "C#"
        Java  does NOT match "JavaScript"
    """

    term = term.lower().strip()
    text = text.lower()

    escaped_term = re.escape(term)

    # -----------------------------------------------------
    # Special handling for short / symbolic skills
    # -----------------------------------------------------

    if term in {"c", "c++", "c#"}:
        pattern = rf"(?<![a-z0-9+#]){escaped_term}(?![a-z0-9+#])"

    else:
        # Normal skills
        pattern = rf"(?<![a-z0-9]){escaped_term}(?![a-z0-9])"

    return bool(
        re.search(
            pattern,
            text,
        )
    )


# =========================================================
# Skill matching
# =========================================================

def skill_matches(
    resume_text: str,
    jd_skill: str,
) -> bool:
    """
    Check whether the exact JD skill, or one of its
    true aliases, exists in the resume.

    Important:
        MySQL does NOT match PostgreSQL.
        PostgreSQL does NOT match MySQL.

    However:
        ReactJS matches React.
        NodeJS matches Node.js.
        C Sharp matches C#.
    """

    if not resume_text or not jd_skill:
        return False

    resume_lower = resume_text.lower()

    normalized_jd_skill = normalize_skill(
        jd_skill
    )

    # -----------------------------------------------------
    # 1. Exact JD skill
    # -----------------------------------------------------

    if _contains_term(
        normalized_jd_skill,
        resume_lower,
    ):
        return True

    # -----------------------------------------------------
    # 2. Exact aliases
    #
    # Example:
    # JD = React
    # Resume = ReactJS
    # -----------------------------------------------------

    for alias, canonical in SKILL_ALIASES.items():

        if canonical != normalized_jd_skill:
            continue

        if _contains_term(
            alias,
            resume_lower,
        ):
            return True

    # -----------------------------------------------------
    # Do NOT use SKILL_CATEGORIES here.
    #
    # Therefore:
    #
    # MySQL != PostgreSQL
    # MySQL != Oracle
    # PostgreSQL != MySQL
    #
    # even though all belong to SQL.
    # -----------------------------------------------------

    return False