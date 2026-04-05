import { callAI, AIMessage } from "../../services/ai.service";

// ═══════════════════════════════════════════
// AGENT 1: RESUME ANALYST (The Gatekeeper)
// Sub-agents: Parser + Optimizer
// ═══════════════════════════════════════════

const RESUME_PARSER_PROMPT = `You are an expert Resume Parser AI. Your job is to extract structured information from resume text.

Extract and return a JSON object with these fields:
{
  "name": "Full Name",
  "email": "email@example.com",
  "phone": "phone number",
  "summary": "professional summary if present",
  "skills": ["skill1", "skill2"],
  "experience": [
    { "title": "Job Title", "company": "Company", "duration": "dates", "description": "what they did" }
  ],
  "education": [
    { "degree": "Degree", "institution": "School", "year": "year" }
  ],
  "projects": [
    { "name": "Project Name", "description": "what it does", "technologies": ["tech1"] }
  ],
  "certifications": ["cert1"],
  "totalYearsExperience": 0,
  "experienceLevel": "fresher|junior|mid|senior"
}

Be thorough and accurate. If information is not found, use null or empty arrays.`;

const RESUME_OPTIMIZER_PROMPT = `You are an expert Resume Optimizer and ATS (Applicant Tracking System) specialist. 

Given a candidate's resume and a job description, you must:

1. **Score the resume** (0-100) based on:
   - Keyword match with JD (30%)
   - Skills alignment (25%)
   - Experience relevance (25%)
   - ATS formatting compatibility (20%)

2. **Identify gaps** between the JD requirements and the resume

3. **Provide specific, actionable suggestions** to improve the resume for this particular job

4. **Determine shortlist status**:
   - Score 80+: "shortlisted" — ready for interview
   - Score 60-79: "borderline" — needs specific improvements
   - Score 0-59: "not_shortlisted" — needs significant overhaul

Return your analysis in this JSON format:
{
  "matchScore": 78,
  "atsScore": 72,
  "shortlistStatus": "borderline",
  "keywordMatches": ["React", "Node.js"],
  "missingKeywords": ["CI/CD", "Agile"],
  "strengths": ["Strong technical skills", "Relevant projects"],
  "gaps": [
    { "category": "skills", "description": "Missing CI/CD experience", "severity": "high" }
  ],
  "suggestions": [
    { "type": "add_keyword", "description": "Add 'CI/CD' to your skills section", "priority": "high" },
    { "type": "quantify", "description": "Add metrics to your XYZ achievement", "priority": "medium" }
  ],
  "overallFeedback": "Your resume shows strong technical foundation but needs..."
}

Be specific, honest, and actionable. Do NOT give vague advice.`;

export async function parseResume(resumeText: string): Promise<string> {
  const response = await callAI(RESUME_PARSER_PROMPT, [
    { role: "user", content: `Parse this resume:\n\n${resumeText}` },
  ], { temperature: 0.2, jsonMode: true });
  return response.content;
}

export async function analyzeResume(
  resumeText: string,
  jobDescription: string,
  parsedResume: string
): Promise<string> {
  const response = await callAI(RESUME_OPTIMIZER_PROMPT, [
    {
      role: "user",
      content: `Analyze this resume against the job description.

JOB DESCRIPTION:
${jobDescription}

PARSED RESUME DATA:
${parsedResume}

RAW RESUME TEXT:
${resumeText}

Provide your detailed analysis.`,
    },
  ], { temperature: 0.3, maxTokens: 3000, jsonMode: true });
  return response.content;
}

export async function chatWithResumeAgent(
  messages: AIMessage[],
  resumeText: string,
  jobDescription: string,
  analysis: string
): Promise<string> {
  const systemPrompt = `You are the Resume Analyst agent in InterviewPilot. You have already analyzed the candidate's resume.

RESUME: ${resumeText.substring(0, 2000)}

JOB DESCRIPTION: ${jobDescription.substring(0, 2000)}

ANALYSIS: ${analysis.substring(0, 2000)}

Help the candidate understand their resume score, gaps, and how to improve. Be encouraging but honest.
Provide specific, actionable advice. If they ask about specific sections, give detailed guidance.
IMPORTANT: You are only the Resume Analyst. DO NOT ask technical interview questions, coding challenges, or system design questions. Those will come in later stages. Focus ONLY on the resume content, score, and career alignment.`;

  const response = await callAI(systemPrompt, messages, { temperature: 0.6 });
  return response.content;
}
