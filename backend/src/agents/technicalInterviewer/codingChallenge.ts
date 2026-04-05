// ═══════════════ Agent 2A: Coding Challenge ═══════════════
import { callAI, AIMessage } from "../../services/ai.service";
import { CODING_CHALLENGE_PROMPT } from "./prompts";

export async function askCodingQuestion(messages: AIMessage[], context: { skills: string[]; candidateLevel: string }): Promise<string> {
  const prompt = CODING_CHALLENGE_PROMPT.replace("{skills}", context.skills.join(", ")).replace("{candidateLevel}", context.candidateLevel);
  const response = await callAI(prompt, messages, { temperature: 0.7 });
  return response.content;
}
