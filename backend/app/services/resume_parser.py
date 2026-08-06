from io import BytesIO

import fitz
from docx import Document


def extract_text_from_pdf(file: bytes) -> str:
    text = ""
    pdf_doc = fitz.open(
        stream=file, 
        filetype="pdf"
    )

    for page in pdf_doc:
        text += page.get_text()
    pdf_doc.close()
    return text

def extract_text_from_docx(file: bytes) -> str:
    text = ""
    doc = Document(BytesIO(file))

    for para in doc.paragraphs:
        text += para.text + "\n"
    return text

def extract_text(filename: str, file: bytes) -> str:
    if filename.endswith(".pdf"):
        return extract_text_from_pdf(file)
    
    elif filename.endswith(".docx"):
        return extract_text_from_docx(file)
    else:
        raise ValueError("Unsupported file format. Please upload a PDF or DOCX file.")