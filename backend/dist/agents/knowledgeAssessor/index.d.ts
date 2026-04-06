import { AIMessage } from "../../services/ai.service";
export declare function conductKnowledgeAssessment(messages: AIMessage[], context: {
    jobDescription: string;
    jobTitle: string;
    skills: string[];
    candidateLevel: string;
    mode: "mcq" | "discussion";
}): Promise<string>;
//# sourceMappingURL=index.d.ts.map