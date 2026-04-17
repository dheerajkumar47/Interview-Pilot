import { Router } from "express";
import multer from "multer";
import { parseResume, analyzeResume } from "../agents/resumeAnalyst";
import { extractResumeText } from "../services/resume.service";
import { createSession } from "../services/session.service";
import { cleanJSON } from "../services/ai.service";
import { randomUUID } from "crypto";

const router = Router();

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (req, file, cb) => {
    const allowed = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/msword"];
    if (allowed.includes(file.mimetype) || file.originalname.match(/\.(pdf|docx?)$/i)) {
      cb(null, true);
    } else {
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

    const { 
      jobDescription, 
      jobTitle, 
      company, 
      experience, 
      roleType, 
      candidateLevel,
      userId,
      sessionMode
    } = req.body;

    console.log(`📄 Processing resume for: ${jobTitle} at ${company}`);

    // 1. Extract text from file (PDF or DOCX)
    const resumeText = await extractResumeText(req.file.buffer, req.file.originalname);

    // 2. Parse resume structure with AI
    const parsedResumeRaw = await parseResume(resumeText);
    const parsedResume = typeof parsedResumeRaw === 'string' ? JSON.parse(cleanJSON(parsedResumeRaw)) : parsedResumeRaw;

    // 3. Analyze resume against JD
    let analysis = null;
    if (jobDescription) {
      const analysisRaw = await analyzeResume(resumeText, jobDescription, JSON.stringify(parsedResume));
      analysis = typeof analysisRaw === 'string' ? JSON.parse(cleanJSON(analysisRaw)) : analysisRaw;
    }

    // 4. Create real Session in DB (ONLY IF VALID ANALYSIS)
    let sessionId: string = randomUUID();
    
    const isRealScan = analysis && analysis.matchScore > 0;

    if (isRealScan) {
      try {
        const session = await createSession({
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
      } catch (err: any) {
        console.error("⚠️ Resilient Mode: Session creation failed, but returning analysis.", err.message);
      }
    } else {
      console.log("🚫 [RESUME ROUTE] Junk input detected. Skipping DB session creation.");
    }

    res.json({
      success: true,
      sessionId: sessionId,
      analysis: analysis,
      fileName: req.file.originalname,
    });
  } catch (error) {
    console.error("🚀 Session creation error:", error);
    res.status(500).json({
      error: "Failed to create session from resume",
      message: (error as Error).message,
    });
  }
});

export default router;
