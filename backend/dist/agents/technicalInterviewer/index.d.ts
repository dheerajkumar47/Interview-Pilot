import { AIMessage } from "../../services/ai.service";
export declare function conductTechnicalInterview(messages: AIMessage[], context: {
    jobDescription: string;
    jobTitle: string;
    company: string;
    experience: string;
    skills: string[];
    candidateLevel: string;
}): Promise<string>;
export declare function conductSystemDesign(messages: AIMessage[], context: {
    jobDescription: string;
    candidateLevel: string;
}): Promise<string>;
export declare function conductDiscovery(messages: AIMessage[]): Promise<string>;
//# sourceMappingURL=index.d.ts.map