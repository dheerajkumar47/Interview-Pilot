import { callAI, AIMessage } from "../../services/ai.service";
import { MCQ_PROMPT } from "./prompts";

export async function generateMCQ(messages: AIMessage[], context: { skills: string[]; candidateLevel: string }): Promise<string> {
  const prompt = MCQ_PROMPT.replace("{skills}", context.skills.join(", ")).replace("{candidateLevel}", context.candidateLevel);
  const response = await callAI(prompt, messages, { temperature: 0.7 });
  return response.content;
}
