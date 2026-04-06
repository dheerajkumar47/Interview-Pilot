"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseResume = parseResume;
exports.analyzeResume = analyzeResume;
exports.chatWithResumeAgent = chatWithResumeAgent;
const ai_service_1 = require("../../services/ai.service");
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
const RESUME_OPTIMIZER_PROMPT = `You are a world-class Elite ATS Evaluator. Your goal is to provide a brutal, high-fidelity analysis of how a resume matches a Job Description. 

CRITICAL: **INPUT VERIFICATION (SANITY CHECK)**:
If the Job Description (JD) or Resume text is suspiciously short, nonsensical, contains placeholders only (e.g. "hi", "test", "dummy"), or lacks professional substance:
- You MUST set "matchScore" and "atsScore" to EXACTLY 0.
- Set "shortlistStatus" to "not_shortlisted".
- In "overallFeedback", explain that the input data is insufficient for a professional analysis.
- DO NOT hallucinate keywords if the JD is just "hi".

SCORING CRITERIA FOR VALID INPUTS:
1. **Match Score** (0-100):
   - Direct Technical Skill Matches (40%)
   - Experience Relevance (30%)
   - Role Alignment (20%)
   - Education/Certs (10%)

2. **ATS Score** (0-100):
   - Formatting & Hierarchy (50%)
   - Keyword Density (50%)

REQUIRED JSON OUTPUT:
{
  "matchScore": number,
  "atsScore": number,
  "shortlistStatus": "shortlisted" | "borderline" | "not_shortlisted",
  "keywordMatches": string[],
  "missingKeywords": string[],
  "strengths": string[],
  "gaps": [ { "category": string, "description": string, "severity": "low" | "medium" | "high" } ],
  "suggestions": [ { "type": "add_keyword" | "formatting" | "quantify", "description": string, "priority": "low" | "medium" | "high" } ],
  "overallFeedback": string
}

BE HONEST. If they are a bad match, tell them. If they have garbage inputs, give them a zero.`;
async function parseResume(resumeText) {
    const response = await (0, ai_service_1.callAI)(RESUME_PARSER_PROMPT, [
        { role: "user", content: `Parse this resume:\n\n${resumeText}` },
    ], { temperature: 0.2, jsonMode: true });
    return response.content;
}
async function analyzeResume(resumeText, jobDescription, parsedResume) {
    // 🛡️ CODE-LEVEL SANITY CHECK (HARD GUARD)
    const jdWords = jobDescription.trim().split(/\s+/).length;
    const resumeWords = resumeText.trim().split(/\s+/).length;
    const isJunk = (jdWords < 5) ||
        (jobDescription.toLowerCase().includes("hi") && jdWords < 3) ||
        (jobDescription.toLowerCase() === "test") ||
        (resumeWords < 20);
    if (isJunk) {
        console.log("🚫 [ATS GUARD] Junk input detected. Forcing 0% score.");
        return JSON.stringify({
            matchScore: 0,
            atsScore: 0,
            shortlistStatus: "not_shortlisted",
            keywordMatches: [],
            missingKeywords: ["Professional JD Required", "Professional Resume Required"],
            strengths: [],
            gaps: [{ category: "Validation", description: "The provided Job Description or Resume is too short or contains placeholder text.", severity: "high" }],
            suggestions: [{ type: "formatting", description: "Please provide a complete Job Description and a professional Resume for a valid analysis.", priority: "high" }],
            overallFeedback: "Analysis Failed: The input data provided is insufficient for a professional ATS evaluation. Please paste a full Job Description and ensure your resume is correctly uploaded."
        });
    }
    const response = await (0, ai_service_1.callAI)(RESUME_OPTIMIZER_PROMPT, [
        { role: "user", content: `RESUME TEXT:\n${resumeText}\n\nPARSED DATA:\n${parsedResume}\n\nJOB DESCRIPTION:\n${jobDescription}` }
    ], { temperature: 0.1, jsonMode: true });
    // 🛡️ POST-AI SANITY CHECK (Double Guard)
    try {
        const data = JSON.parse((0, ai_service_1.cleanJSON)(response.content));
        if (data.matchScore > 10 && (jdWords < 12)) {
            console.log("🚫 [ATS GUARD] AI Over-hallucinated. Overriding high score for short JD.");
            data.matchScore = 5;
            data.shortlistStatus = "not_shortlisted";
            return JSON.stringify(data);
        }
    }
    catch (e) { }
    return response.content;
}
async function chatWithResumeAgent(messages, resumeText, jobDescription, analysis) {
    const systemPrompt = `You are the Resume Analyst agent in InterviewPilot. You have already analyzed the candidate's resume.

RESUME: ${resumeText.substring(0, 2000)}

JOB DESCRIPTION: ${jobDescription.substring(0, 2000)}

ANALYSIS: ${analysis.substring(0, 2000)}

Help the candidate understand their resume score, gaps, and how to improve. Be encouraging but honest.
Provide specific, actionable advice. If they ask about specific sections, give detailed guidance.
IMPORTANT: You are only the Resume Analyst. DO NOT ask technical interview questions, coding challenges, or system design questions. Those will come in later stages. Focus ONLY on the resume content, score, and career alignment.`;
    const response = await (0, ai_service_1.callAI)(systemPrompt, messages, { temperature: 0.6 });
    return response.content;
}
//# sourceMappingURL=index.js.map