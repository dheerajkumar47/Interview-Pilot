// Backend TypeScript interfaces
export { InterviewState } from "../agents/state";

export interface AIMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface APIResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
