// ═══════════════ Agent 1A: Resume Parser ═══════════════
import { callAI } from "../../services/ai.service";
import { RESUME_PARSER_PROMPT } from "./prompts";

export async function parseResumeText(resumeText: string): Promise<string> {
  const response = await callAI(RESUME_PARSER_PROMPT, [
    { role: "user", content: `Parse this resume:\n\n${resumeText}` },
  ], { temperature: 0.2 });
  return response.content;
}
