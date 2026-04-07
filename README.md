# 🚀 InterviewPilot — AI Mock Interview Platform

[![Demo](https://img.shields.io/badge/Demo-Live-brightgreen)](https://interview-pilot-phi.vercel.app/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Developed by](https://img.shields.io/badge/Developed%20by-Dheeraj%20Kumar-blue)](https://github.com/dheerajkumar47)

A fully automated, multi-agentic mock interview platform that guides candidates through the entire hiring process — from resume screening and ATS scoring to specialized technical and HR rounds.

## 🌟 Key Features

- **ATS Resume Scoring:** Upload your resume and get an instant compatibility score against any job description.
- **Specialized AI Agents:** Four distinct agents act as your interview panel, each with their own domain expertise.
- **Multimodal Simulation:** Realistic interview experience with coding challenges, MCQs, and behavioral questions.
- **Deep Analytics:** Get a detailed report on your strengths, weaknesses, and overall "Readiness Verdict".

## 🤖 Meet the AI Interview Panel

| Agent | Role | Capabilities |
| :--- | :--- | :--- |
| **🔍 Resume Analyst** | ATS & Optimization | Resume parsing, skill gap analysis, and ATS optimization suggestions. |
| **💻 Technical Interviewer** | Deep-Dive Technical | Live coding simulations, system design problems, and architecture deep-dives. |
| **📚 Knowledge Assessor** | Domain Knowledge | Targeted MCQs and conceptual discussions across frontend, backend, and DevOps. |
| **🤝 HR Coach** | Behavioral & STAR | STAR method behavioral questions, culture-fit assessment, and salary strategy. |

## 🛠 Tech Stack

- **Frontend:** [Next.js 14](https://nextjs.org/), [TypeScript](https://www.typescriptlang.org/), [Tailwind CSS](https://tailwindcss.com/)
- **Backend:** [Node.js](https://nodejs.org/), [Express](https://expressjs.com/), [Socket.io](https://socket.io/) (Real-time updates)
- **AI Engine:** [Google Gemini 2.0 Flash](https://aistudio.google.com/) (Primary), [Groq Llama 3.3](https://groq.com/) (Fallback)
- **Database:** [Supabase](https://supabase.com/) (PostgreSQL)
- **Deployment:** Vercel (Frontend) & Render (Backend)

## 📦 Getting Started

### 1. Clone & Install
```bash
git clone https://github.com/dheerajkumar47/Interview-Pilot.git
cd Interview-Pilot

# Install Frontend dependencies
cd frontend && npm install

# Install Backend dependencies
cd ../backend && npm install
```

### 2. Environment Setup
Create a `.env` file in both `frontend` and `backend` directories (follow `.env.example`).

```env
GEMINI_API_KEY=your_key
GROQ_API_KEY=your_key
SUPABASE_URL=your_url
SUPABASE_SERVICE_KEY=your_key
```

### 3. Run Locally
```bash
# Terminal 1: Frontend
cd frontend && npm run dev

# Terminal 2: Backend
cd backend && npm run dev
```

---

*Developed with ❤️ by [Dheeraj Kumar](https://github.com/dheerajkumar47). Built with AI to help you land your dream job.*
