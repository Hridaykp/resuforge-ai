from unittest.mock import patch


def test_upload_resume(client):
    file_content = b"fake resume content"

    with patch(
        "app.api.resume.extract_text",
        return_value="John Doe\nSoftware Engineer",
    ) as mock_extract:
        response = client.post(
            "/resume/upload",
            files={
                "file": (
                    "resume.pdf",
                    file_content,
                    "application/pdf",
                )
            },
        )

    assert response.status_code == 200

    data = response.json()

    assert data["filename"] == "resume.pdf"
    assert data["resume_text"] == "John Doe\nSoftware Engineer"

    mock_extract.assert_called_once_with(
        "resume.pdf",
        file_content,
    )


def test_analyze_resume(client):
    file_content = b"fake resume content"

    ats_result = {
        "score": 85,
        "matched_keywords": ["python", "fastapi"],
    }

    ai_result = {
        "summary": "Strong backend experience.",
    }

    resume_result = {
        "sections": ["experience", "skills", "projects"],
    }

    priority_improvements = [
        {
            "id": "missing-keywords",
            "priority": 1,
            "title": "Strengthen relevant technical skills",
        }
    ]

    with (
        patch(
            "app.api.resume.extract_text",
            return_value="John Doe\nSoftware Engineer",
        ) as mock_extract,
        patch(
            "app.api.resume.calculate_ats_score",
            return_value=ats_result,
        ) as mock_ats,
        patch(
            "app.api.resume.analyze_resume",
            return_value=ai_result,
        ) as mock_ai,
        patch(
            "app.api.resume.analyze_resume_structure",
            return_value=resume_result,
        ) as mock_structure,
        patch(
            "app.api.resume.generate_priority_improvements",
            return_value=priority_improvements,
        ) as mock_improvements,
    ):
        response = client.post(
            "/resume/analyze",
            files={
                "file": (
                    "resume.pdf",
                    file_content,
                    "application/pdf",
                )
            },
            data={
                "target_role": "Backend Engineer",
                "job_description": "Python FastAPI backend developer",
            },
        )

    assert response.status_code == 200

    data = response.json()

    assert data["filename"] == "resume.pdf"
    assert data["resume_analysis"] == resume_result
    assert data["ats_analysis"] == ats_result
    assert data["ai_analysis"] == ai_result
    assert data["priority_improvements"] == priority_improvements

    mock_extract.assert_called_once_with(
        "resume.pdf",
        file_content,
    )

    mock_ats.assert_called_once_with(
        resume_text="John Doe\nSoftware Engineer",
        target_role="Backend Engineer",
        job_description="Python FastAPI backend developer",
    )

    mock_ai.assert_called_once_with(
        resume_text="John Doe\nSoftware Engineer",
        target_role="Backend Engineer",
        job_description="Python FastAPI backend developer",
    )

    mock_structure.assert_called_once_with(
        resume_text="John Doe\nSoftware Engineer",
        target_role="Backend Engineer",
        job_description="Python FastAPI backend developer",
    )

    mock_improvements.assert_called_once_with(
        ats_result=ats_result,
        ai_result=ai_result,
        resume_result=resume_result,
    )
