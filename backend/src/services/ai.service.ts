import OpenAI from "openai";

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

export interface AIMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface AIResponse {
  content: string;
  provider: "openai" | "mock";
  model: string;
  tokensUsed?: number;
}

/**
 * Call AI using OpenAI SDK
 */
export async function callAI(
  systemPrompt: string,
  messages: AIMessage[],
  options: { temperature?: number; maxTokens?: number; jsonMode?: boolean } = {}
): Promise<AIResponse> {
  const { temperature = 0.7, maxTokens = 2048, jsonMode = false } = options;

  if (openai) {
    try {
      const allMessages = [
        { role: "system" as const, content: systemPrompt },
        ...messages.map((m) => ({
          role: m.role,
          content: m.content,
        })),
      ];

      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: allMessages,
        temperature,
        max_tokens: maxTokens,
        response_format: jsonMode ? { type: "json_object" } : undefined,
      });

      return {
        content: completion.choices[0]?.message?.content || "",
        provider: "openai",
        model: "gpt-4o-mini",
        tokensUsed: completion.usage?.total_tokens,
      };
    } catch (error) {
      console.warn("OpenAI failed, using mock response:", (error as Error).message);
    }
  }

  // Mock fallback for development or if no API key
  return getMockResponse(systemPrompt, messages, jsonMode);
}

/**
 * Utility to clean AI response if it contains markdown JSON blocks
 */
export function cleanJSON(content: string): string {
  // Remove markdown code blocks if present
  let clean = content.replace(/```json\n?|```/g, "").trim();
  
  // If it still doesn't look like JSON, try to extract first { and last }
  if (!clean.startsWith("{") && clean.includes("{")) {
    const start = clean.indexOf("{");
    const end = clean.lastIndexOf("}");
    if (start !== -1 && end !== -1) {
      clean = clean.substring(start, end + 1);
    }
  }
  
  return clean;
}

function getMockResponse(systemPrompt: string, messages: AIMessage[], jsonMode: boolean = false): AIResponse {
  const isResumeParser = systemPrompt.toLowerCase().includes("resume parser");
  const isResumeOptimizer = systemPrompt.toLowerCase().includes("ats");

  let content = "I'm having trouble connecting to my primary model. Please try rephrasing your message or check your API configuration.";

  if (jsonMode) {
    if (isResumeParser) {
       content = JSON.stringify({
         name: "Dheeraj",
         email: "dheeraj@example.com",
         phone: "123-456-7890",
         summary: "Experienced software engineer specializing in full-stack development.",
         skills: ["React", "Next.js", "Node.js", "Supabase"],
         experience: [{ title: "Founder", company: "InterviewPilot", duration: "2024-Present", description: "Building AI agents." }],
         education: [{ degree: "Computer Science", institution: "Tech University", year: "2024" }],
         projects: [],
         certifications: [],
         totalYearsExperience: 2,
         experienceLevel: "fresher"
       });
    } else if (isResumeOptimizer) {
       content = JSON.stringify({
         matchScore: 82,
         atsScore: 75,
         shortlistStatus: "shortlisted",
         keywordMatches: ["React", "Node.js"],
         missingKeywords: ["CI/CD"],
         strengths: ["Strong technical match"],
         gaps: [{ category: "DevOps", description: "Missing CI/CD experience", severity: "medium" }],
         suggestions: [{ type: "add_keyword", description: "Add CI/CD to your resume", priority: "high" }],
         overallFeedback: "Great match for this role!"
       });
    }
  }

  return {
    content,
    provider: "mock",
    model: "mock-agent",
  };
}
