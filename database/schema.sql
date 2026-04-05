-- ═══════════════════════════════════════════
-- InterviewPilot — Supabase Database Schema
-- ═══════════════════════════════════════════

-- Users (managed by Supabase Auth, this extends the profile)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  experience_level TEXT DEFAULT 'fresher' CHECK (experience_level IN ('fresher', 'junior', 'mid', 'senior')),
  target_role TEXT,
  total_sessions INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Interview Sessions
CREATE TABLE IF NOT EXISTS sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  job_title TEXT NOT NULL,
  company_name TEXT,
  job_description TEXT NOT NULL,
  experience_required TEXT,
  role_type TEXT DEFAULT 'developer',
  status TEXT DEFAULT 'created' CHECK (status IN (
    'created', 'resume_uploaded', 'resume_analyzed', 'shortlisted', 'not_shortlisted',
    'initial_assessment', 'technical_interview', 'knowledge_assessment', 'hr_interview', 'completed'
  )),
  current_stage INTEGER DEFAULT 0,
  overall_score INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Resume Data
CREATE TABLE IF NOT EXISTS resumes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID REFERENCES sessions(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_url TEXT,
  raw_text TEXT,
  parsed_data JSONB,
  analysis_data JSONB,
  match_score INTEGER,
  ats_score INTEGER,
  shortlist_status TEXT CHECK (shortlist_status IN ('shortlisted', 'borderline', 'not_shortlisted')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Conversation History
CREATE TABLE IF NOT EXISTS conversations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID REFERENCES sessions(id) ON DELETE CASCADE,
  stage TEXT NOT NULL CHECK (stage IN ('resume', 'initial', 'technical', 'knowledge', 'hr')),
  messages JSONB DEFAULT '[]'::jsonb,
  score INTEGER,
  feedback TEXT,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  ended_at TIMESTAMPTZ
);

-- Final Reports
CREATE TABLE IF NOT EXISTS reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID REFERENCES sessions(id) ON DELETE CASCADE UNIQUE,
  resume_score INTEGER DEFAULT 0,
  technical_score INTEGER DEFAULT 0,
  knowledge_score INTEGER DEFAULT 0,
  hr_score INTEGER DEFAULT 0,
  overall_score INTEGER DEFAULT 0,
  readiness_level TEXT CHECK (readiness_level IN ('not_ready', 'needs_practice', 'almost_ready', 'ready')),
  strengths JSONB DEFAULT '[]'::jsonb,
  weaknesses JSONB DEFAULT '[]'::jsonb,
  recommendations JSONB DEFAULT '[]'::jsonb,
  detailed_feedback JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_status ON sessions(status);
CREATE INDEX IF NOT EXISTS idx_conversations_session_id ON conversations(session_id);
CREATE INDEX IF NOT EXISTS idx_resumes_session_id ON resumes(session_id);

-- Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can view own sessions" ON sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create sessions" ON sessions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own sessions" ON sessions FOR UPDATE USING (auth.uid() = user_id);
