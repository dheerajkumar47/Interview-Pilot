// Shared agent state definition for LangGraph
export interface InterviewState {
  sessionId: string;
  userId: string;
  jobDescription: string;
  jobTitle: string;
  company: string;
  experience: string;
  skills: string[];
  roleType: string;
  candidateLevel: "fresher" | "beginner" | "intermediate" | "advanced";
  resumeText: string;
  parsedResume: Record<string, unknown> | null;
  resumeAnalysis: Record<string, unknown> | null;
  shortlistStatus: "shortlisted" | "borderline" | "not_shortlisted" | null;
  currentStage: "resume" | "initial" | "technical" | "knowledge" | "hr" | "report";
  sessionMode: "full" | "resume_only" | "technical_only";
  conversationHistory: Record<string, Array<{ role: string; content: string }>>;
  scores: { resume: number; initial: number; technical: number; knowledge: number; hr: number; overall: number };
  questionCount: Record<string, number>;
  language: string;
  report: Record<string, unknown> | null;
  startedAt: string;
  completedAt: string | null;
}

export function createInitialState(overrides: Partial<InterviewState> = {}): InterviewState {
  return {
    sessionId: "",
    userId: "",
    jobDescription: "",
    jobTitle: "",
    company: "",
    experience: "",
    skills: [],
    roleType: "developer",
    candidateLevel: "beginner",
    resumeText: "",
    parsedResume: null,
    resumeAnalysis: null,
    shortlistStatus: null,
    currentStage: "resume",
    sessionMode: "full",
    conversationHistory: {},
    scores: { resume: 0, initial: 0, technical: 0, knowledge: 0, hr: 0, overall: 0 },
    questionCount: {},
    language: "en",
    report: null,
    startedAt: new Date().toISOString(),
    completedAt: null,
    ...overrides,
  };
}
