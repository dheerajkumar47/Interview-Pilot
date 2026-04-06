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
export declare function callAI(systemPrompt: string, messages: AIMessage[], options?: {
    temperature?: number;
    maxTokens?: number;
    jsonMode?: boolean;
}): Promise<AIResponse>;
/**
 * Utility to clean AI response if it contains markdown JSON blocks
 */
export declare function cleanJSON(content: string): string;
//# sourceMappingURL=ai.service.d.ts.map