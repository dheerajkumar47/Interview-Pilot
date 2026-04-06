"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const resumeAnalyst_1 = require("../agents/resumeAnalyst");
const resume_service_1 = require("../services/resume.service");
const session_service_1 = require("../services/session.service");
const ai_service_1 = require("../services/ai.service");
const router = (0, express_1.Router)();
// Configure multer for file uploads
const upload = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
    fileFilter: (req, file, cb) => {
        const allowed = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/msword"];
        if (allowed.includes(file.mimetype) || file.originalname.match(/\.(pdf|docx?)$/i)) {
            cb(null, true);
        }
        else {
            cb(new Error("Only PDF and DOCX files are allowed"));
        }
    },
});
/**
 * Endpoint: POST /api/resume/upload
 * Handles: Full session creation pipeline from resume upload
 */
router.post("/upload", upload.single("resume"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }
        const { jobDescription, jobTitle, company, experience, roleType, candidateLevel, userId, sessionMode } = req.body;
        console.log(`📄 Processing resume for: ${jobTitle} at ${company}`);
        // 1. Extract text from file (PDF or DOCX)
        const resumeText = await (0, resume_service_1.extractResumeText)(req.file.buffer, req.file.originalname);
        // 2. Parse resume structure with AI
        const parsedResumeRaw = await (0, resumeAnalyst_1.parseResume)(resumeText);
        const parsedResume = typeof parsedResumeRaw === 'string' ? JSON.parse((0, ai_service_1.cleanJSON)(parsedResumeRaw)) : parsedResumeRaw;
        // 3. Analyze resume against JD
        let analysis = null;
        if (jobDescription) {
            const analysisRaw = await (0, resumeAnalyst_1.analyzeResume)(resumeText, jobDescription, JSON.stringify(parsedResume));
            analysis = typeof analysisRaw === 'string' ? JSON.parse((0, ai_service_1.cleanJSON)(analysisRaw)) : analysisRaw;
        }
        // 4. Create real Session in DB (Wrap in try-catch to be resilient)
        let sessionId = "temp-" + Date.now();
        try {
            const session = await (0, session_service_1.createSession)({
                userId: userId || null,
                jobTitle: jobTitle || "Software Engineer",
                company: company || "Unknown",
                jobDescription: jobDescription || "",
                experience: experience || "0-3 years",
                roleType: roleType || "developer",
                candidateLevel: candidateLevel || "beginner",
                resumeText: resumeText,
                resumeAnalysis: analysis,
                sessionMode: sessionMode || "full",
                currentStage: "resume",
            });
            sessionId = session.sessionId;
        }
        catch (err) {
            console.error("⚠️ Resilient Mode: Session creation failed, but returning analysis.", err.message);
        }
        res.json({
            success: true,
            sessionId: sessionId,
            analysis: analysis,
            fileName: req.file.originalname,
        });
    }
    catch (error) {
        console.error("🚀 Session creation error:", error);
        res.status(500).json({
            error: "Failed to create session from resume",
            message: error.message,
        });
    }
});
exports.default = router;
//# sourceMappingURL=resume.routes.js.map