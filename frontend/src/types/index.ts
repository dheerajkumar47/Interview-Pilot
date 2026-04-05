// ═══════════════════════════════════════════
// InterviewPilot — TypeScript Interfaces
// ═══════════════════════════════════════════

// ── User & Auth ──
export interface User {
  id: string;
  fullName: string;
  email: string;
  avatarUrl?: string;
  experienceLevel: "fresher" | "junior" | "mid" | "senior";
  targetRole?: string;
  totalSessions: number;
  createdAt: string;
}

// ── Session ──
export type SessionStatus =
  | "created"
  | "resume_uploaded"
  | "resume_analyzed"
  | "shortlisted"
  | "not_shortlisted"
  | "initial_assessment"
  | "technical_interview"
  | "knowledge_assessment"
  | "hr_interview"
  | "completed";

export type RoleType = "developer" | "tester" | "devops" | "data" | "design" | "other";

export interface Session {
  id: string;
  userId: string;
  jobTitle: string;
  companyName?: string;
  jobDescription: string;
  experienceRequired: string;
  roleType: RoleType;
  status: SessionStatus;
  currentStage: number;
  overallScore?: number;
  createdAt: string;
  updatedAt: string;
}

// ── Resume ──
export interface ParsedResume {
  name: string;
  email: string;
  phone?: string;
  summary?: string;
  skills: string[];
  experience: ResumeExperience[];
  education: ResumeEducation[];
  projects: ResumeProject[];
  certifications: string[];
  totalYearsExperience: number;
  experienceLevel: "fresher" | "junior" | "mid" | "senior";
}

export interface ResumeExperience {
  title: string;
  company: string;
  duration: string;
  description: string;
}

export interface ResumeEducation {
  degree: string;
  institution: string;
  year: string;
}

export interface ResumeProject {
  name: string;
  description: string;
  technologies: string[];
}

export interface ResumeAnalysis {
  matchScore: number;
  atsScore: number;
  shortlistStatus: "shortlisted" | "borderline" | "not_shortlisted";
  keywordMatches: string[];
  missingKeywords: string[];
  strengths: string[];
  gaps: Array<{ category: string; description: string; severity: "high" | "medium" | "low" }>;
  suggestions: Array<{ type: string; description: string; priority: "high" | "medium" | "low" }>;
  overallFeedback: string;
}

// ── Chat & Messages ──
export interface ChatMessage {
  id: string;
  role: "ai" | "user";
  content: string;
  timestamp: Date;
  agentType?: string;
  metadata?: Record<string, unknown>;
}

export type AgentType =
  | "resume_analyst"
  | "technical_interviewer"
  | "coding_challenge"
  | "system_design"
  | "knowledge_assessor"
  | "mcq"
  | "domain_expert"
  | "hr_coach"
  | "behavioral"
  | "negotiation";

export interface AgentConfig {
  name: string;
  icon: string;
  color: string;
  greeting: string;
}

// ── Interview ──
export type InterviewStage = "resume" | "initial" | "technical" | "knowledge" | "hr" | "report";

export interface StageInfo {
  id: InterviewStage;
  label: string;
  icon: string;
  agent: string;
  status: "locked" | "current" | "completed";
  score?: number;
}

// ── Coding Challenge ──
export interface CodingChallenge {
  id: string;
  title: string;
  description: string;
  difficulty: "easy" | "medium" | "hard";
  language: string;
  userSolution?: string;
  evaluation?: CodingEvaluation;
  hintsUsed: number;
  completed: boolean;
}

export interface CodingEvaluation {
  correctness: number;
  complexity: string;
  codeQuality: number;
  score: number;
  feedback: string;
}

// ── MCQ ──
export interface MCQQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  userAnswer?: string;
  explanation?: string;
  topic: string;
  difficulty: "easy" | "medium" | "hard";
  isCorrect?: boolean;
}

// ── Report ──
export interface Report {
  id: string;
  sessionId: string;
  resumeScore: number;
  technicalScore: number;
  knowledgeScore: number;
  hrScore: number;
  overallScore: number;
  readinessLevel: "not_ready" | "needs_practice" | "almost_ready" | "ready";
  strengths: string[];
  weaknesses: string[];
  recommendations: Array<{ area: string; action: string; priority: "high" | "medium" | "low" }>;
  detailedFeedback: Record<string, string>;
  createdAt: string;
}

// ── Scores ──
export interface Scores {
  resume: number;
  technical: number;
  knowledge: number;
  hr: number;
  overall: number;
}

// ── API Response ──
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
