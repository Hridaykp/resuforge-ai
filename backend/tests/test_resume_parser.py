import io

import fitz
import pytest
from app.services.resume_parser import (
    extract_text,
    extract_text_from_docx,
    extract_text_from_pdf,
)
from docx import Document


def create_pdf(text: str) -> bytes:
    pdf = fitz.open()
    page = pdf.new_page()
    page.insert_text((72, 72), text)

    file = pdf.tobytes()
    pdf.close()

    return file


def create_docx(text: str) -> bytes:
    document = Document()
    document.add_paragraph(text)

    buffer = io.BytesIO()
    document.save(buffer)

    return buffer.getvalue()


def test_extract_text_from_pdf():
    pdf_file = create_pdf("John Doe\nSoftware Engineer")

    result = extract_text_from_pdf(pdf_file)

    assert "John Doe" in result
    assert "Software Engineer" in result


def test_extract_text_from_docx():
    docx_file = create_docx("John Doe\nSoftware Engineer")

    result = extract_text_from_docx(docx_file)

    assert "John Doe" in result
    assert "Software Engineer" in result


def test_extract_text_supports_pdf():
    pdf_file = create_pdf("Python Developer")

    result = extract_text("resume.pdf", pdf_file)

    assert "Python Developer" in result


def test_extract_text_supports_docx():
    docx_file = create_docx("Python Developer")

    result = extract_text("resume.docx", docx_file)

    assert "Python Developer" in result


def test_extract_text_rejects_unsupported_file():
    with pytest.raises(
        ValueError,
        match="Unsupported file format",
    ):
        extract_text("resume.txt", b"some text")


def test_extract_text_rejects_empty_pdf():
    pdf = fitz.open()
    page = pdf.new_page()
    page.insert_text((72, 72), "")
    pdf_file = pdf.tobytes()
    pdf.close()

    with pytest.raises(
        ValueError,
        match="No text found",
    ):
        extract_text("resume.pdf", pdf_file)
