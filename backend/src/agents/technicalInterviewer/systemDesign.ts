// ═══════════════ Agent 2B: System Design ═══════════════
import { callAI, AIMessage } from "../../services/ai.service";
import { SYSTEM_DESIGN_PROMPT } from "./prompts";

export async function askSystemDesign(messages: AIMessage[], context: { candidateLevel: string }): Promise<string> {
  const prompt = SYSTEM_DESIGN_PROMPT + `\n\nCandidate Level: ${context.candidateLevel}`;
  const response = await callAI(prompt, messages, { temperature: 0.7 });
  return response.content;
}
