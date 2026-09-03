import os

from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
# print("Gemini API key loaded:", bool(GEMINI_API_KEY))