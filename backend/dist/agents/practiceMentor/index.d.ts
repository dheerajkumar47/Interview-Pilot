import { AIMessage } from "../../services/ai.service";
export declare function conductPracticeSession(messages: AIMessage[], context: {
    jobDescription: string;
    jobTitle: string;
    experience: string;
    skills: string[];
    candidateLevel: string;
}): Promise<string>;
export declare function conductPracticeDiscovery(messages: AIMessage[]): Promise<string>;
//# sourceMappingURL=index.d.ts.map