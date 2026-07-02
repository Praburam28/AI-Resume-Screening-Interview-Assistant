# 🤖 AI Resume Screening & Interview Assistant

A full-stack AI-powered recruitment web application that helps HR teams and recruiters upload resumes, extract candidate information, match candidates against job descriptions, generate interview questions, produce candidate summaries, and view recruitment analytics.

---

## 📌 Project Objective

The objective of this project is to build a web application that helps recruiters and HR teams efficiently screen resumes, evaluate candidate suitability, and generate AI-powered interview insights.

The system is capable of:

* Uploading and managing candidate resumes
* Extracting information from PDF and DOCX resumes
* Matching candidates against job descriptions using AI
* Generating interview questions automatically
* Producing candidate summaries and hiring recommendations
* Maintaining candidate evaluation history
* Supporting multiple users with role-based access
* Displaying hiring analytics through a dashboard

---

## 🚀 Key Features

### 👤 Candidate Management

Users can:

* Upload PDF resumes
* Upload DOCX resumes
* View candidate profiles
* Search candidates
* Delete candidates

The system extracts:

* Candidate name
* Email address
* Phone number
* Skills
* Work experience
* Education

---

### 💼 Job Description Management

HR users can:

* Create job descriptions
* View job descriptions
* Update job descriptions
* Delete job descriptions

Job description fields include:

* Job title
* Required skills
* Experience requirement
* Location
* Employment type
* Job description content

---

### 🧠 AI Resume Matching

The system compares uploaded resumes with selected job descriptions and generates:

* Match score
* Missing skills
* Candidate strengths
* Candidate weaknesses
* Hiring recommendation

Example use cases:

* Is this candidate suitable for the Python Developer role?
* What skills are missing for this position?
* Which candidate has the highest match score?

---

### 💬 AI Interview Question Generator

The system generates interview questions based on:

* Candidate skills
* Candidate experience level
* Job description

Generated question types:

* Technical questions
* Scenario-based questions
* Behavioral questions

---

### 📄 AI Candidate Summary

The system generates:

* Candidate overview
* Skill assessment
* Experience summary
* Hiring recommendation

If insufficient information is available, the system returns an appropriate response.

---

### 🔍 Search and Retrieval

The system supports:

* Candidate search by skills
* Candidate search by experience
* Resume retrieval
* Semantic candidate search using embeddings

---

### 📊 Analytics Dashboard

The dashboard displays:

* Total candidates
* Total job descriptions
* Average match score
* Most requested skills
* Recent candidate uploads
* Most active users
* Resume ranking leaderboard

---

### 🔐 Authentication and Roles

The system includes:

* User registration
* User login
* JWT authentication
* Role-based permissions

Supported roles:

#### HR

HR users can:

* Manage candidates
* Manage job descriptions
* View analytics
* Run AI workflows
* Send interview invitations

#### Recruiter

Recruiter users can:

* View candidates
* Generate AI reports
* Run AI matching
* Generate interview questions
* Generate candidate summaries

---

## 🧰 Technology Stack

### Backend

* Python
* FastAPI
* SQLAlchemy ORM
* MySQL
* JWT Authentication
* Gemini AI
* Alembic

### Frontend

* React
* Vite
* Axios
* React Router DOM
* Lucide React Icons
* Recharts
* CSS

### DevOps

* Docker
* Docker Compose
* GitHub Actions CI/CD

---

## 📁 Project Structure

```txt
ai-resume-screening-assistant/
│
├── backend/
│   ├── app/
│   │   ├── core/
│   │   │   ├── config.py
│   │   │   ├── database.py
│   │   │   └── security.py
│   │   │
│   │   ├── dependencies/
│   │   │   └── auth_dependency.py
│   │   │
│   │   ├── models/
│   │   │   ├── user.py
│   │   │   ├── candidate.py
│   │   │   ├── job.py
│   │   │   ├── evaluation.py
│   │   │   ├── ai_output.py
│   │   │   ├── candidate_embedding.py
│   │   │   └── interview_invitation.py
│   │   │
│   │   ├── routers/
│   │   │   ├── auth_router.py
│   │   │   ├── candidate_router.py
│   │   │   ├── job_router.py
│   │   │   ├── ai_router.py
│   │   │   ├── analytics_router.py
│   │   │   ├── semantic_router.py
│   │   │   ├── email_router.py
│   │   │   └── health_router.py
│   │   │
│   │   ├── schemas/
│   │   ├── services/
│   │   ├── utils/
│   │   └── main.py
│   │
│   ├── migrations/
│   ├── requirements.txt
│   ├── alembic.ini
│   └── Dockerfile
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── styles/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── package.json
│   └── Dockerfile
│
├── docker-compose.yml
├── README.md
└── .github/
    └── workflows/
        └── ci.yml
```

---

# ⚙️ Project Setup Instructions

## 1. Clone the Repository

```bash
git clone https://github.com/your-username/ai-resume-screening-assistant.git
cd ai-resume-screening-assistant
```

---

## 2. Backend Setup

Go to the backend folder:

```bash
cd backend
```

Create virtual environment:

```bash
python -m venv venv
```

Activate virtual environment on Windows:

```bash
venv\Scripts\Activate.ps1
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Create a `.env` file inside the `backend` folder:

```env
DATABASE_URL=mysql+pymysql://root:your_mysql_password@localhost:3306/ai_resume_assistant

SECRET_KEY=your_secret_key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60

GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-2.0-flash

EMBEDDING_PROVIDER=gemini
GEMINI_EMBEDDING_MODEL=gemini-embedding-001
EMBEDDING_DIMENSIONS=768

FRONTEND_URL=http://localhost:5173

SMTP_HOST=
SMTP_PORT=587
SMTP_USERNAME=
SMTP_PASSWORD=
SMTP_FROM_EMAIL=
SMTP_USE_TLS=true
```

Start the backend server:

```bash
uvicorn app.main:app --reload
```

Backend runs at:

```txt
http://127.0.0.1:8000
```

Swagger API documentation:

```txt
http://127.0.0.1:8000/docs
```

---

## 3. Frontend Setup

Open a new terminal and go to the frontend folder:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file inside the `frontend` folder:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000
```

Start the frontend:

```bash
npm run dev
```

Frontend runs at:

```txt
http://localhost:5173
```

---

## 4. Database Setup

Create a MySQL database:

```sql
CREATE DATABASE ai_resume_assistant;
```

The backend uses SQLAlchemy models to create and manage database tables.

For Alembic migration setup:

```bash
alembic revision -m "baseline existing database"
alembic stamp head
```

---

# 🔌 API Documentation

## Authentication APIs

| Method | Endpoint         | Description                 |
| ------ | ---------------- | --------------------------- |
| POST   | `/auth/register` | Register a new user         |
| POST   | `/auth/login`    | Login and receive JWT token |
| GET    | `/auth/me`       | Get logged-in user details  |

---

## Candidate APIs

| Method | Endpoint             | Description             |
| ------ | -------------------- | ----------------------- |
| POST   | `/candidates/upload` | Upload candidate resume |
| GET    | `/candidates`        | Get all candidates      |
| GET    | `/candidates/{id}`   | Get candidate by ID     |
| DELETE | `/candidates/{id}`   | Delete candidate        |

---

## Job APIs

| Method | Endpoint     | Description              |
| ------ | ------------ | ------------------------ |
| POST   | `/jobs`      | Create job description   |
| GET    | `/jobs`      | Get all job descriptions |
| GET    | `/jobs/{id}` | Get job by ID            |
| PUT    | `/jobs/{id}` | Update job description   |
| DELETE | `/jobs/{id}` | Delete job description   |

---

## AI APIs

| Method | Endpoint          | Description                                 |
| ------ | ----------------- | ------------------------------------------- |
| POST   | `/ai/match`       | Match candidate resume with job description |
| POST   | `/ai/questions`   | Generate AI interview questions             |
| POST   | `/ai/summary`     | Generate AI candidate summary               |
| GET    | `/ai/evaluations` | View AI evaluation history                  |

---

## Analytics APIs

| Method | Endpoint                           | Description                    |
| ------ | ---------------------------------- | ------------------------------ |
| GET    | `/analytics`                       | Get dashboard analytics        |
| GET    | `/analytics/resume-ranking`        | Get resume ranking leaderboard |
| GET    | `/analytics/recent-candidates`     | Get recent candidate uploads   |
| GET    | `/analytics/most-requested-skills` | Get most requested skills      |
| GET    | `/analytics/most-active-users`     | Get most active users          |

---

## Semantic Search APIs

| Method | Endpoint                                  | Description                        |
| ------ | ----------------------------------------- | ---------------------------------- |
| POST   | `/semantic-search/candidates`             | Search candidates using embeddings |
| POST   | `/semantic-search/rebuild-all`            | Rebuild all candidate embeddings   |
| POST   | `/semantic-search/rebuild/{candidate_id}` | Rebuild one candidate embedding    |

---

## Interview Invitation APIs

| Method | Endpoint               | Description                        |
| ------ | ---------------------- | ---------------------------------- |
| POST   | `/invitations/send`    | Send or draft interview invitation |
| GET    | `/invitations/history` | View invitation history            |

---

# 🏗️ Architecture Overview

The system follows a full-stack client-server architecture.

```txt
React Frontend
      ↓
Axios API Requests
      ↓
FastAPI Backend
      ↓
Service Layer
      ↓
SQLAlchemy ORM
      ↓
MySQL Database
```

## Frontend Layer

The frontend is built using React. It provides pages for login, registration, dashboard, resume upload, candidate management, job management, AI matching, interview questions, summaries, search, ranking, and invitations.

## Backend Layer

The backend is built using FastAPI. It exposes REST APIs for authentication, candidates, jobs, AI features, analytics, semantic search, and interview invitations.

## Service Layer

The service layer contains the main business logic. It handles resume parsing, AI processing, matching logic, question generation, summaries, analytics, and email invitations.

## Database Layer

The database layer uses SQLAlchemy ORM to communicate with MySQL. All users, candidates, jobs, evaluations, questions, summaries, embeddings, and invitations are stored in MySQL.

## AI Layer

Gemini AI is used to analyze candidate resumes, compare them with job descriptions, generate questions, create summaries, and provide hiring recommendations.

---

# 🗄️ Database Design Explanation

The project uses a relational database design.

## Main Tables

### users

Stores user account information.

Fields include:

* id
* full_name
* email
* hashed_password
* role
* created_at

---

### candidates

Stores candidate resume information.

Fields include:

* id
* name
* email
* phone
* education
* total_experience
* resume_file_name
* resume_file_path
* uploaded_by
* created_at

---

### candidate_skills

Stores extracted candidate skills.

Fields include:

* id
* candidate_id
* skill_name

Relationship:

* One candidate can have many skills.

---

### job_descriptions

Stores job details.

Fields include:

* id
* job_title
* experience_requirement
* location
* employment_type
* description
* created_by
* created_at

---

### job_skills

Stores required skills for a job.

Fields include:

* id
* job_id
* skill_name

Relationship:

* One job description can have many required skills.

---

### resume_evaluations

Stores AI resume matching results.

Fields include:

* id
* candidate_id
* job_id
* match_score
* missing_skills
* strengths
* weaknesses
* recommendation
* created_at

---

### interview_question_sets

Stores AI-generated interview questions.

Fields include:

* id
* candidate_id
* job_id
* technical_questions
* scenario_questions
* behavioral_questions
* created_at

---

### candidate_summaries

Stores AI-generated candidate summaries.

Fields include:

* id
* candidate_id
* job_id
* candidate_overview
* skill_assessment
* experience_summary
* hiring_recommendation
* created_at

---

### candidate_embeddings

Stores candidate embeddings for semantic search.

Fields include:

* id
* candidate_id
* embedding_json
* source_text
* embedding_model
* created_at
* updated_at

---

### interview_invitations

Stores interview invitation records.

Fields include:

* id
* candidate_id
* job_id
* recipient_email
* subject
* message
* status
* sent_by
* created_at

---

# 🧠 AI Workflow Explanation

The AI workflow is used for resume matching, question generation, and candidate summary generation.

## 1. Resume Upload

The HR user uploads a PDF or DOCX resume.

## 2. Resume Parsing

The backend extracts text from the uploaded resume and identifies candidate details such as name, email, phone number, skills, experience, and education.

## 3. Job Description Selection

The user selects a job description created in the system.

## 4. AI Resume Matching

The backend sends candidate details and job description details to the AI service.

The AI compares:

* Candidate skills
* Candidate experience
* Candidate education
* Required job skills
* Job description content

## 5. AI Evaluation Output

The AI returns:

* Match score
* Missing skills
* Strengths
* Weaknesses
* Hiring recommendation

## 6. Store Evaluation

The result is stored in the database as evaluation history.

## 7. Interview Question Generation

The AI generates:

* Technical questions
* Scenario-based questions
* Behavioral questions

## 8. Candidate Summary Generation

The AI generates:

* Candidate overview
* Skill assessment
* Experience summary
* Hiring recommendation

## 9. Dashboard Analytics

The system updates analytics such as total candidates, average match score, most requested skills, resume ranking, and recent uploads.

---

# 🔍 Semantic Search Workflow

Semantic search helps recruiters find candidates based on meaning, not only exact keywords.

Workflow:

```txt
Candidate profile text
      ↓
Generate embedding vector
      ↓
Store embedding in database
      ↓
User enters search query
      ↓
Generate query embedding
      ↓
Compare using similarity score
      ↓
Return ranked matching candidates
```

Example:

If the recruiter searches:

```txt
Backend API Developer
```

The system can find candidates with skills such as:

```txt
Python, FastAPI, REST API, MySQL
```

even if the exact phrase is not present in the resume.

---

# 🚀 Deployment Instructions

## Local Deployment

Start backend:

```bash
cd backend
venv\Scripts\Activate.ps1
uvicorn app.main:app --reload
```

Start frontend:

```bash
cd frontend
npm run dev
```

Open:

```txt
Frontend: http://localhost:5173
Backend:  http://127.0.0.1:8000/docs
```

---

## Docker Deployment

Make sure Docker Desktop is installed and running.

Run from project root:

```bash
docker compose up --build
```

Services:

```txt
Frontend: http://localhost:5173
Backend:  http://localhost:8000/docs
MySQL:    localhost:3307
```

---

## GitHub Actions CI/CD

The project includes GitHub Actions workflow:

```txt
.github/workflows/ci.yml
```

The workflow checks:

* Backend dependency installation
* Backend Python compilation
* Frontend dependency installation
* Frontend production build

---

## Production Deployment

The backend can be deployed on:

* Render
* Railway
* AWS EC2
* Azure App Service
* Docker-based VPS

The frontend can be deployed on:

* Vercel
* Netlify
* Firebase Hosting
* Nginx server

Required backend environment variables:

```env
DATABASE_URL=
SECRET_KEY=
GEMINI_API_KEY=
SMTP_HOST=
SMTP_USERNAME=
SMTP_PASSWORD=
SMTP_FROM_EMAIL=
```

Required frontend environment variable:

```env
VITE_API_BASE_URL=https://your-backend-url.com
```

---

# 🧪 Testing Flow

Use this order to test the project:

```txt
1. Register HR user
2. Login
3. Upload candidate resume
4. View candidate profile
5. Create job description
6. Run AI resume matching
7. Generate interview questions
8. Generate candidate summary
9. View evaluation history
10. Check analytics dashboard
11. Search candidates
12. Test resume ranking
13. Send interview invitation
```

---

# ✅ Evaluation Criteria Coverage

| Criteria                | Status    |
| ----------------------- | --------- |
| Code Quality            | Completed |
| API Design              | Completed |
| AI Integration Approach | Completed |
| Database Design         | Completed |
| System Architecture     | Completed |
| Security Implementation | Completed |
| Documentation Quality   | Completed |
| User Experience         | Completed |

---

# 📌 Project Status

```txt
Core Features: Completed
AI Features: Completed
Authentication: Completed
Role-Based Access: Completed
Analytics Dashboard: Completed
Semantic Search: Completed
Email Invitations: Completed
Docker Setup: Added
CI/CD Setup: Added
Documentation: Completed
```

---

# 👨‍💻 Author

**Praburam R**

AI Resume Screening & Interview Assistant
Full Stack FastAPI + React Project
