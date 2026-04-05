import { callAI, AIMessage } from "../../services/ai.service";
import { DOMAIN_EXPERT_PROMPT } from "./prompts";

export async function askDomainQuestion(messages: AIMessage[]): Promise<string> {
  const response = await callAI(DOMAIN_EXPERT_PROMPT, messages, { temperature: 0.7 });
  return response.content;
}
