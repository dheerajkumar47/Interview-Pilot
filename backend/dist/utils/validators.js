"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatMessageSchema = exports.createSessionSchema = void 0;
const zod_1 = require("zod");
exports.createSessionSchema = zod_1.z.object({
    jobDescription: zod_1.z.string().min(50, "Job description must be at least 50 characters"),
    jobTitle: zod_1.z.string().min(2, "Job title is required"),
    company: zod_1.z.string().optional(),
    experience: zod_1.z.string().optional(),
    roleType: zod_1.z.enum(["developer", "tester", "devops", "data", "design", "other"]).optional(),
});
exports.chatMessageSchema = zod_1.z.object({
    stage: zod_1.z.enum(["resume", "initial", "technical", "knowledge", "hr"]),
    message: zod_1.z.string().min(1),
    sessionId: zod_1.z.string(),
});
//# sourceMappingURL=validators.js.map