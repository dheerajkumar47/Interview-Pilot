import { AIMessage } from "../../services/ai.service";
export declare function conductHRInterview(messages: AIMessage[], context: {
    jobDescription: string;
    jobTitle: string;
    company: string;
    experience: string;
    mode: "behavioral" | "negotiation";
}): Promise<string>;
//# sourceMappingURL=index.d.ts.map