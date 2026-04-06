import { AIMessage } from "../../services/ai.service";
export declare function parseResume(resumeText: string): Promise<string>;
export declare function analyzeResume(resumeText: string, jobDescription: string, parsedResume: string): Promise<string>;
export declare function chatWithResumeAgent(messages: AIMessage[], resumeText: string, jobDescription: string, analysis: string): Promise<string>;
//# sourceMappingURL=index.d.ts.map