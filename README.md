# 🚀 InterviewPilot — AI Mock Interview Platform

A fully automated, multi-agentic mock interview platform that guides candidates through the entire hiring process — from resume screening to HR rounds.

## 🤖 AI Agents

| Agent | Role | Sub-Agents |
|-------|------|-----------|
| 🔍 Resume Analyst | Screens resume against JD, scores ATS compatibility | Parser, Optimizer |
| 💻 Technical Interviewer | Conducts coding challenges & system design | Coding Challenge, System Design |
| 📚 Knowledge Assessor | Tests knowledge with MCQs and discussions | MCQ Generator, Domain Expert |
| 🤝 HR Coach | Behavioral interview prep & salary negotiation | Behavioral Q&A, Negotiation |

## 🛠 Tech Stack

- **Frontend:** Next.js 14, TypeScript, CSS Modules
- **Backend:** Node.js, Express, Socket.io
- **AI:** Google Gemini 2.0 Flash (Primary), Groq/Llama 3.3 (Fallback)
- **Database:** Supabase (PostgreSQL)
- **Deployment:** Vercel (Frontend) + Render (Backend)

## 📦 Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/your-username/interview-pilot.git
cd interview-pilot

# 2. Install dependencies
cd frontend && npm install
cd ../backend && npm install

# 3. Set up environment variables
cp .env.example .env
# Add your API keys to .env

# 4. Start development servers
# Terminal 1 — Frontend
cd frontend && npm run dev

# Terminal 2 — Backend
cd backend && npm run dev
```

## 🗂 Project Structure

```
interview-pilot/
├── frontend/          # Next.js 14 App
├── backend/           # Express + AI Agents
├── database/          # Supabase schema
└── .env.example       # Environment template
```

## 🔑 Environment Variables

```env
GEMINI_API_KEY=         # Google Gemini API key (free)
GROQ_API_KEY=           # Groq API key (free)
SUPABASE_URL=           # Supabase project URL
SUPABASE_SERVICE_KEY=   # Supabase service key
```

## 📄 License

MIT
