# ResuForge AI

An intelligent resume analysis platform powered by AI that provides comprehensive feedback on resume quality, ATS compatibility, and actionable improvement suggestions.

## Overview

ResuForge AI combines multiple AI providers (Google Gemini and Groq) with advanced NLP techniques to deliver:

- **AI-Powered Analysis**: Detailed qualitative feedback on strengths, weaknesses, and suggestions for improvement
- **ATS Scoring**: Industry-standard Applicant Tracking System (ATS) compatibility assessment
- **Structural Analysis**: Deep evaluation of resume formatting and organization
- **Priority Improvements**: Intelligently ranked actionable recommendations
- **Multi-Format Support**: Handle PDF, DOCX, and text-based resumes
- **Job-Aware Feedback**: Context-aware analysis based on target role and job descriptions

## Technology Stack

### Backend
- **Framework**: FastAPI (Python 3.12+)
- **AI Providers**: Google Gemini API, Groq API (with intelligent fallback)
- **Document Processing**: PyMuPDF, python-docx
- **Server**: Uvicorn
- **Dependencies**: See `backend/app/requirements.txt`

### Frontend
- **Framework**: Next.js 16 with React 19
- **Styling**: Tailwind CSS v4
- **Language**: TypeScript
- **Package Manager**: npm
- **Dependencies**: See `frontend/package.json`

### Infrastructure
- **Containerization**: Docker & Docker Compose
- **Deployment**: Containerized services with CORS-enabled communication

## Project Structure

```
resuforge-ai/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI application entry point
│   │   ├── requirements.txt      # Python dependencies
│   │   ├── pyproject.toml        # Project configuration
│   │   ├── api/
│   │   │   └── resume.py         # Resume endpoints
│   │   ├── services/
│   │   │   ├── ai_analyzer.py              # AI-powered resume analysis
│   │   │   ├── ats_scorer.py               # ATS compatibility scoring
│   │   │   ├── resume_analyzer.py          # Structural analysis
│   │   │   ├── resume_parser.py            # Document text extraction
│   │   │   ├── priority_improvements.py    # Ranking improvements
│   │   │   ├── jd_analyzer.py              # Job description analysis
│   │   │   └── skill_normalizer.py         # Skill standardization
│   │   └── core/
│   │       └── config.py         # Configuration & environment variables
│   ├── Dockerfile
│   └── tests/
├── frontend/
│   ├── app/                      # Next.js app directory
│   ├── components/               # React components
│   ├── lib/                      # Utility functions
│   ├── types/                    # TypeScript definitions
│   ├── public/                   # Static assets
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.js
│   ├── Dockerfile
│   └── next.config.ts
├── docker-compose.yml
└── .gitignore
```

## Getting Started

### Prerequisites

- Python 3.12+ (for backend)
- Node.js 18+ (for frontend)
- Docker & Docker Compose (optional, for containerized setup)
- API Keys:
  - Google Gemini API key (or Groq API key as fallback)
  - At least one AI provider must be configured

### Quick Start with Docker Compose

1. **Clone the repository**
   ```bash
   git clone https://github.com/Hridaykp/resuforge-ai.git
   cd resuforge-ai
   ```

2. **Configure environment variables**
   ```bash
   # Create backend/.env with your API keys
   echo "GEMINI_API_KEY=your_gemini_key_here" > backend/.env
   echo "GROQ_API_KEY=your_groq_key_here" >> backend/.env
   ```

3. **Start services**
   ```bash
   docker-compose up --build
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

### Local Development Setup

#### Backend

1. **Navigate to backend**
   ```bash
   cd backend
   ```

2. **Create and activate virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r app/requirements.txt
   ```

4. **Configure environment**
   ```bash
   # Create .env file in backend/ directory
   cat > .env << EOF
   GEMINI_API_KEY=your_key_here
   GROQ_API_KEY=your_key_here
   EOF
   ```

5. **Run development server**
   ```bash
   cd app
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

#### Frontend

1. **Navigate to frontend**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:3000
   ```

## API Endpoints

### Resume Analysis

**Upload Resume**
```
POST /resume/upload
Content-Type: multipart/form-data

Parameters:
- file: Resume file (PDF, DOCX, or text)

Response:
{
  "filename": "resume.pdf",
  "resume_text": "extracted text content..."
}
```

**Comprehensive Analysis**
```
POST /resume/analyze
Content-Type: multipart/form-data

Parameters:
- file: Resume file (required)
- target_role: Job title or role (optional)
- job_description: Full job description (optional)

Response:
{
  "filename": "resume.pdf",
  "resume_analysis": {...},
  "ats_analysis": {...},
  "ai_analysis": {...},
  "priority_improvements": [...]
}
```

## Core Features

### 1. AI-Powered Analysis (`ai_analyzer.py`)
- Multi-provider support (Gemini → Groq fallback)
- Automatic retry with exponential backoff
- Comprehensive prompt engineering for consistent quality
- Structured response parsing

**Analysis Output:**
- Overall assessment
- Strengths (3+ points)
- Weaknesses (3+ points)
- Improvement suggestions
- ATS optimization tips
- Missing information

### 2. ATS Scoring (`ats_scorer.py`)
- Keyword matching from job descriptions
- Format compatibility assessment
- Readability scoring
- Skill alignment evaluation

### 3. Resume Structure Analysis (`resume_analyzer.py`)
- Section organization evaluation
- Content completeness check
- Formatting quality assessment
- Length and density analysis

### 4. Priority Improvements (`priority_improvements.py`)
- Intelligently ranks recommendations
- Balances ATS and AI feedback
- Provides actionable, prioritized suggestions

### 5. Multi-Format Support (`resume_parser.py`)
- PDF parsing via PyMuPDF
- DOCX extraction via python-docx
- Plain text handling
- Automatic format detection

## Environment Variables

### Backend (.env)

```env
# Required: At least one AI provider key
GEMINI_API_KEY=your_google_gemini_api_key
GROQ_API_KEY=your_groq_api_key

# Optional: Additional configuration
DEBUG=false
```

### Frontend

```env
# Configured via docker-compose
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Configuration

Backend configuration is centralized in `backend/app/core/config.py`. Key settings:

- AI provider selection and fallback strategy
- API timeouts and retry limits
- CORS origins (default: `http://localhost:3000`)
- Model selection (Gemini 3.5 Flash Lite, Groq OSS 120B)

## Testing

Run backend tests:
```bash
cd backend
pytest tests/
```

## Deployment

### Docker Deployment

The project includes production-ready Dockerfiles for both services:

```bash
# Build images
docker build -t resuforge-backend:latest ./backend
docker build -t resuforge-frontend:latest ./frontend

# Run with docker-compose
docker-compose up -d
```

### Production Considerations

1. **API Keys**: Use secure secret management (e.g., GitHub Secrets, environment services)
2. **CORS**: Update allowed origins in `backend/app/main.py` for production domains
3. **Rate Limiting**: Implement rate limiting for API endpoints
4. **Monitoring**: Add logging and monitoring for AI API calls
5. **Caching**: Consider caching common analyses
6. **Error Handling**: Implement comprehensive error tracking

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    User Browser                          │
└─────────────────────────────────────────────────────────┘
                         │ HTTP
                         ↓
┌─────────────────────────────────────────────────────────┐
│               Frontend (Next.js + React)                 │
│  - Resume upload UI                                      │
│  - Analysis results display                              │
│  - Improvement recommendations                           │
└─────────────────────────────────────────────────────────┘
                         │ REST API
                         ↓
┌─────────────────────────────────────────────────────────┐
│                 Backend (FastAPI)                        │
│  ┌─────────────────────────────────────────────────┐   │
│  │ API Layer (resume.py)                           │   │
│  └─────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────┐   │
│  │ Service Layer                                   │   │
│  │ - Document parsing & extraction                 │   │
│  │ - ATS scoring & analysis                        │   │
│  │ - Structure analysis                            │   │
│  │ - Priority ranking                              │   │
│  └─────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────┐   │
│  │ AI Integration                                  │   │
│  │ - Gemini API (primary)                          │   │
│  │ - Groq API (fallback)                           │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

## Contributing

Contributions are welcome! Please follow these guidelines:

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Commit changes: `git commit -m 'Add feature'`
3. Push to branch: `git push origin feature/your-feature`
4. Submit a pull request

## License

This project is open source. See LICENSE file for details.

## Support

For issues, questions, or suggestions:
- Open an issue on [GitHub](https://github.com/Hridaykp/resuforge-ai/issues)
- Check existing documentation in `frontend/AGENTS.md`

## Roadmap

- [ ] User authentication and history tracking
- [ ] Advanced skill extraction and normalization
- [ ] Resume template recommendations
- [ ] Bulk analysis capabilities
- [ ] Export analysis reports (PDF, JSON)
- [ ] Integration with job boards
- [ ] Performance optimizations and caching

---

**Built with ❤️ for job seekers and career professionals**
