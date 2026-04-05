// ═══════════════ Agent 1B: Resume Optimizer ═══════════════
import { callAI } from "../../services/ai.service";
import { RESUME_OPTIMIZER_PROMPT } from "./prompts";

export async function optimizeResume(resumeText: string, jobDescription: string, parsedResume: string): Promise<string> {
  const response = await callAI(RESUME_OPTIMIZER_PROMPT, [{
    role: "user",
    content: `Analyze:\n\nJD:\n${jobDescription}\n\nPARSED:\n${parsedResume}\n\nRAW:\n${resumeText}`,
  }], { temperature: 0.3, maxTokens: 3000 });
  return response.content;
}
