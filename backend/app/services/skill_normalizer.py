import re

# map  
#  
SKILL_ALIASES: dict[str, str] = {
    # SQL / Databases
    "mysql": "sql",
    "postgresql": "sql",
    "postgres": "sql",
    "sql server": "sql",
    "microsoft sql server": "sql",

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

    # .NET
    "dotnet": ".net",
    "dot net": ".net",
}


def normalize_skill(skill: str) -> str:
    """
    Convert a skill name into its canonical form.

    Examples:
        MySQL -> sql
        PostgreSQL -> sql
        ReactJS -> react
        React.js -> react
        AWS Cloud -> aws
    """

    normalized = skill.strip().lower()

    # Normalize multiple spaces
    normalized = re.sub(r"\s+", " ", normalized)

    # Return canonical name if an alias exists
    return SKILL_ALIASES.get(
        normalized,
        normalized,
    )


def skill_matches(
    resume_text: str,
    jd_skill: str,
) -> bool:
    """
    Check whether a JD skill is present in the resume,
    including known aliases.

    Examples:
        Resume: "Python, MySQL"
        JD skill: "SQL"
        -> True

        Resume: "ReactJS"
        JD skill: "React"
        -> True
    """

    resume_lower = resume_text.lower()
    normalized_jd_skill = normalize_skill(jd_skill)

    # Check the JD skill itself
    if _contains_term(jd_skill, resume_lower):
        return True

    # Check aliases belonging to the same canonical skill
    for alias, canonical_skill in SKILL_ALIASES.items():

        if canonical_skill != normalized_jd_skill:
            continue

        if _contains_term(alias, resume_lower):
            return True

    return False


def _contains_term(
    term: str,
    text: str,
) -> bool:
    """
    Match a term as a complete word/phrase rather than
    matching it inside another word.
    """

    escaped_term = re.escape(term.lower())

    return bool(
        re.search(
            rf"(?<!\w){escaped_term}(?!\w)",
            text,
        )
    )