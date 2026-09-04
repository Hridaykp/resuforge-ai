from unittest.mock import patch

import pytest
from app.services.ats_scorer import calculate_ats_score


def test_empty_resume_raises_error():
    with pytest.raises(ValueError, match="Resume text cannot be empty"):
        calculate_ats_score("")


def test_general_resume_returns_valid_score():
    resume = """
    John Doe
    john@example.com
    +91 9876543210

    Summary
    Backend developer with Python experience.

    Skills
    Python, FastAPI, Docker, SQL

    Experience
    Software Engineer
    Developed backend APIs and deployed applications.

    Education
    Bachelor of Technology
    """

    result = calculate_ats_score(resume)

    assert 0 <= result["ats_score"] <= 100
    assert result["max_score"] == 100

    assert set(result["breakdown"]) == {
        "completeness",
        "section_structure",
        "skills_keywords",
        "experience_achievements",
        "readability_parsing",
    }


def test_complete_resume_gets_completeness_score():
    resume = """
    john@example.com
    +91 9876543210

    Education
    Bachelor of Technology

    Skills
    Python

    Experience
    Software Engineer
    """

    result = calculate_ats_score(resume)

    assert result["breakdown"]["completeness"] == 20


def test_resume_with_sections_gets_section_score():
    resume = """
    Summary
    Backend developer.

    Experience
    Software Engineer.

    Education
    Bachelor of Technology.

    Skills
    Python.

    Projects
    Resume Analyzer.

    Certifications
    AWS Certified.
    """

    result = calculate_ats_score(resume)

    assert result["breakdown"]["section_structure"] == 18


def test_general_skill_matching():
    resume = """
    Skills
    Python
    FastAPI
    Docker
    SQL
    React
    Node.js
    """

    result = calculate_ats_score(resume)

    assert "python" in result["matched_keywords"]
    assert "docker" in result["matched_keywords"]
    assert result["breakdown"]["skills_keywords"] > 0


@patch("app.services.ats_scorer.skill_matches")
@patch("app.services.ats_scorer.analyze_job_description")
def test_job_description_required_skills(
    mock_analyze_jd,
    mock_skill_matches,
):
    mock_analyze_jd.return_value = {
        "requirements": {
            "skills": {
                "required": ["python", "fastapi"],
                "preferred": ["docker"],
            }
        }
    }

    mock_skill_matches.side_effect = lambda resume_text, jd_skill: (
        jd_skill in {"python", "fastapi"}
    )

    result = calculate_ats_score(
        resume_text="Python FastAPI developer",
        target_role="Backend Engineer",
        job_description="Python FastAPI developer with Docker",
    )

    assert result["matched_keywords"] == [
        "python",
        "fastapi",
    ]

    assert result["missing_keywords"] == []

    assert result["preferred_keywords"]["matched"] == []

    assert result["preferred_keywords"]["missing"] == ["docker"]

    assert result["breakdown"]["skills_keywords"] == 20


@patch("app.services.ats_scorer.skill_matches")
@patch("app.services.ats_scorer.analyze_job_description")
def test_job_description_missing_required_skills(
    mock_analyze_jd,
    mock_skill_matches,
):
    mock_analyze_jd.return_value = {
        "requirements": {
            "skills": {
                "required": ["python", "fastapi", "sql", "docker"],
                "preferred": [],
            }
        }
    }

    mock_skill_matches.side_effect = lambda resume_text, jd_skill: (
        jd_skill in {"python", "fastapi"}
    )

    result = calculate_ats_score(
        resume_text="Python FastAPI developer",
        target_role="Backend Engineer",
        job_description="Python FastAPI SQL Docker",
    )

    assert result["matched_keywords"] == [
        "python",
        "fastapi",
    ]

    assert result["missing_keywords"] == [
        "sql",
        "docker",
    ]

    assert result["breakdown"]["skills_keywords"] == 10


@patch("app.services.ats_scorer.skill_matches")
@patch("app.services.ats_scorer.analyze_job_description")
def test_preferred_skills_are_tracked_separately(
    mock_analyze_jd,
    mock_skill_matches,
):
    mock_analyze_jd.return_value = {
        "requirements": {
            "skills": {
                "required": ["python"],
                "preferred": ["docker", "aws"],
            }
        }
    }

    mock_skill_matches.side_effect = lambda resume_text, jd_skill: (
        jd_skill in {"python", "docker"}
    )

    result = calculate_ats_score(
        resume_text="Python Docker developer",
        target_role="Backend Engineer",
        job_description="Python developer with Docker and AWS",
    )

    assert result["matched_keywords"] == ["python"]

    assert result["missing_keywords"] == []

    assert result["preferred_keywords"]["matched"] == ["docker"]

    assert result["preferred_keywords"]["missing"] == ["aws"]

    # Preferred skills don't affect the primary ATS score.
    assert result["breakdown"]["skills_keywords"] == 20


def test_experience_and_achievements_are_scored():
    resume = """
    Experience

    Software Engineer

    Developed and implemented backend APIs.
    Built and deployed scalable services.
    Improved performance by 30%.
    Reduced latency by 20%.
    Optimized database queries.
    """

    result = calculate_ats_score(resume)

    assert result["breakdown"]["experience_achievements"] > 0


def test_readability_score_rewards_reasonable_resume():
    resume = """
    Summary
    Backend developer with experience building APIs.

    Skills
    Python, FastAPI, Docker.

    Experience
    Software Engineer.

    Projects
    Resume Analyzer.

    Education
    Bachelor of Technology.

    • Built REST APIs
    • Improved application performance
    • Deployed Docker containers
    • Implemented authentication
    • Designed database schemas
    """

    result = calculate_ats_score(resume)

    assert result["breakdown"]["readability_parsing"] > 0
