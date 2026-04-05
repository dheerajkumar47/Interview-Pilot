import { callAI, AIMessage } from "../../services/ai.service";
import { NEGOTIATION_PROMPT } from "./prompts";

export async function practiceNegotiation(messages: AIMessage[], context: { jobTitle: string }): Promise<string> {
  const prompt = NEGOTIATION_PROMPT.replace("{jobTitle}", context.jobTitle);
  const response = await callAI(prompt, messages, { temperature: 0.7 });
  return response.content;
}
