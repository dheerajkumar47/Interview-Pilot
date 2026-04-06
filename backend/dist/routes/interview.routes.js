"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const technicalInterviewer_1 = require("../agents/technicalInterviewer");
const knowledgeAssessor_1 = require("../agents/knowledgeAssessor");
const hrCoach_1 = require("../agents/hrCoach");
const resumeAnalyst_1 = require("../agents/resumeAnalyst");
const router = (0, express_1.Router)();
// REST endpoint for interview messages (alternative to WebSocket)
router.post("/chat", async (req, res) => {
    try {
        const { stage, messages, context } = req.body;
        let response = "";
        const defaultContext = {
            jobDescription: context?.jobDescription || "Software Engineer role",
            jobTitle: context?.jobTitle || "Software Engineer",
            company: context?.company || "Unknown",
            experience: context?.experience || "0-3 years",
            skills: context?.skills || ["JavaScript", "React"],
            candidateLevel: context?.candidateLevel || "beginner",
            resumeText: context?.resumeText || "",
            analysis: context?.analysis || "",
        };
        switch (stage) {
            case "resume":
                response = await (0, resumeAnalyst_1.chatWithResumeAgent)(messages, defaultContext.resumeText, defaultContext.jobDescription, typeof defaultContext.analysis === 'string'
                    ? defaultContext.analysis
                    : JSON.stringify(defaultContext.analysis));
                break;
            case "technical":
                response = await (0, technicalInterviewer_1.conductTechnicalInterview)(messages, defaultContext);
                break;
            case "knowledge":
            case "initial":
                response = await (0, knowledgeAssessor_1.conductKnowledgeAssessment)(messages, {
                    ...defaultContext,
                    mode: stage === "initial" ? "discussion" : "mcq",
                });
                break;
            case "hr":
                response = await (0, hrCoach_1.conductHRInterview)(messages, {
                    ...defaultContext,
                    mode: "behavioral",
                });
                break;
            default:
                response = "Invalid interview stage";
        }
        res.json({ success: true, response, stage });
    }
    catch (error) {
        console.error("Interview chat error:", error);
        res.status(500).json({ error: "Failed to get AI response" });
    }
});
exports.default = router;
//# sourceMappingURL=interview.routes.js.map