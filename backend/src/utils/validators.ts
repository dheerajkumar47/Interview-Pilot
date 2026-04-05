import { z } from "zod";

export const createSessionSchema = z.object({
  jobDescription: z.string().min(50, "Job description must be at least 50 characters"),
  jobTitle: z.string().min(2, "Job title is required"),
  company: z.string().optional(),
  experience: z.string().optional(),
  roleType: z.enum(["developer", "tester", "devops", "data", "design", "other"]).optional(),
});

export const chatMessageSchema = z.object({
  stage: z.enum(["resume", "initial", "technical", "knowledge", "hr"]),
  message: z.string().min(1),
  sessionId: z.string(),
});
