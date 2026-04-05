import { callAI, AIMessage } from "../../services/ai.service";
import { BEHAVIORAL_PROMPT } from "./prompts";

export async function askBehavioral(messages: AIMessage[], context: { jobTitle: string; company: string }): Promise<string> {
  const prompt = BEHAVIORAL_PROMPT.replace("{jobTitle}", context.jobTitle).replace("{company}", context.company);
  const response = await callAI(prompt, messages, { temperature: 0.7 });
  return response.content;
}
