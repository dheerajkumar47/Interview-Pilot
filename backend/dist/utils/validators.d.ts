import { z } from "zod";
export declare const createSessionSchema: z.ZodObject<{
    jobDescription: z.ZodString;
    jobTitle: z.ZodString;
    company: z.ZodOptional<z.ZodString>;
    experience: z.ZodOptional<z.ZodString>;
    roleType: z.ZodOptional<z.ZodEnum<["developer", "tester", "devops", "data", "design", "other"]>>;
}, "strip", z.ZodTypeAny, {
    jobDescription: string;
    jobTitle: string;
    company?: string | undefined;
    experience?: string | undefined;
    roleType?: "data" | "developer" | "tester" | "devops" | "design" | "other" | undefined;
}, {
    jobDescription: string;
    jobTitle: string;
    company?: string | undefined;
    experience?: string | undefined;
    roleType?: "data" | "developer" | "tester" | "devops" | "design" | "other" | undefined;
}>;
export declare const chatMessageSchema: z.ZodObject<{
    stage: z.ZodEnum<["resume", "initial", "technical", "knowledge", "hr"]>;
    message: z.ZodString;
    sessionId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    sessionId: string;
    stage: "resume" | "initial" | "technical" | "knowledge" | "hr";
    message: string;
}, {
    sessionId: string;
    stage: "resume" | "initial" | "technical" | "knowledge" | "hr";
    message: string;
}>;
//# sourceMappingURL=validators.d.ts.map