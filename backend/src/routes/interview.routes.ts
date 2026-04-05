import { Router } from "express";
import { conductTechnicalInterview } from "../agents/technicalInterviewer";
import { conductKnowledgeAssessment } from "../agents/knowledgeAssessor";
import { conductHRInterview } from "../agents/hrCoach";
import { chatWithResumeAgent } from "../agents/resumeAnalyst";

const router = Router();

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
        response = await chatWithResumeAgent(
          messages,
          defaultContext.resumeText,
          defaultContext.jobDescription,
          typeof defaultContext.analysis === 'string' 
            ? defaultContext.analysis 
            : JSON.stringify(defaultContext.analysis)
        );
        break;
      case "technical":
        response = await conductTechnicalInterview(messages, defaultContext);
        break;
      case "knowledge":
      case "initial":
        response = await conductKnowledgeAssessment(messages, {
          ...defaultContext,
          mode: stage === "initial" ? "discussion" : "mcq",
        });
        break;
      case "hr":
        response = await conductHRInterview(messages, {
          ...defaultContext,
          mode: "behavioral",
        });
        break;
      default:
        response = "Invalid interview stage";
    }

    res.json({ success: true, response, stage });
  } catch (error) {
    console.error("Interview chat error:", error);
    res.status(500).json({ error: "Failed to get AI response" });
  }
});

export default router;
