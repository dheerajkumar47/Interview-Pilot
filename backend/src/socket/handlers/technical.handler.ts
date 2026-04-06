import { Socket } from "socket.io";
import { conductTechnicalInterview, conductDiscovery as interviewerDiscovery } from "../../agents/technicalInterviewer";
import { conductPracticeSession, conductPracticeDiscovery } from "../../agents/practiceMentor";
import { InterviewState } from "../../agents/state";
import { updateSession } from "../../services/session.service";

export const handleTechnicalStage = async (
  socket: Socket,
  data: { sessionId: string; message: string },
  sessionData: InterviewState
) => {
  console.log(`💻 [TECHNICAL HANDLER] Processing message for session: ${data.sessionId} [Mode: ${sessionData.sessionMode}]`);

  try {
    if (!sessionData.conversationHistory["technical"]) {
      sessionData.conversationHistory["technical"] = [];
    }

    // Add user message
    sessionData.conversationHistory["technical"].push({ role: "user", content: data.message });

    const history = sessionData.conversationHistory["technical"] as any;
    const isTechnicalOnly = sessionData.sessionMode === "technical_only";
    
    // 🔍 Discovery Detection Logic (Enhanced)
    const assistantMsgs = history.filter((m: any) => m.role === "assistant");
    const hasFinishedOnboarding = assistantMsgs.some((m: any) => 
      m.content.toLowerCase().includes("ready?") || m.content.toLowerCase().includes("let's start")
    );
    
    // We stay in discovery if they haven't finished onboarding OR we're still collecting the 4-5 baseline questions
    const isDiscovery = isTechnicalOnly && (!hasFinishedOnboarding || assistantMsgs.length < 4);

    let response: string;
    if (isDiscovery) {
      // 🚀 Practice Discovery (From dedicated agent)
      response = await conductPracticeDiscovery(history);
    } else if (isTechnicalOnly) {
      // 🚀 Practice Session (Coaching/Mentoring)
      response = await conductPracticeSession(
        history,
        {
          jobTitle: sessionData.jobTitle || "Professional Role",
          jobDescription: sessionData.jobDescription || "",
          experience: sessionData.experience || "Not specified",
          skills: (sessionData.resumeAnalysis as any)?.keywordMatches || [],
          candidateLevel: sessionData.candidateLevel || "beginner"
        }
      );
    } else {
      // 🚀 Normal Mock Interview (Traditional Interviewer)
      response = await conductTechnicalInterview(
        history,
        {
          jobTitle: sessionData.jobTitle || "Software Engineer",
          company: sessionData.company || "Tech Corp",
          experience: sessionData.experience || "0-3 years",
          jobDescription: sessionData.jobDescription || "",
          skills: (sessionData.resumeAnalysis as any)?.keywordMatches || [],
          candidateLevel: sessionData.candidateLevel || "beginner"
        }
      );
    }

    // Add assistant response
    sessionData.conversationHistory["technical"].push({ role: "assistant", content: response });

    // Extract score if present in response (e.g., [SCORE: 85] or **Score:** 85)
    const scoreMatch = response.match(/\[SCORE:\s*(\d+)\]/i) || response.match(/\*\*Score:\*\*\s*(\d+)/i) || response.match(/Score:\s*(\d+)/i);
    if (scoreMatch) {
      const score = Math.min(100, Math.max(0, parseInt(scoreMatch[1]))); // Clamp 0-100
      sessionData.scores.technical = score;
      
      // 🚀 Save immediately
      await updateSession(data.sessionId, { scores: sessionData.scores });
      socket.emit("score:update", { sessionId: data.sessionId, stage: "technical", score });
    }

    // Clean up response: remove score tags and redundant formatting
    const cleanedResponse = response
      .replace(/\[SCORE:\s*\d+\]/gi, "")
      .replace(/\*\*Score:\*\*\s*\d*/gi, "")
      .replace(/^#\s*\*/gm, "") // Remove weird "# *" prefix
      .trim();

    // 🚀 MISSING EMIT FIXED
    socket.emit("interview:response", {
      sessionId: data.sessionId,
      stage: "technical",
      message: cleanedResponse,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error("❌ [TECHNICAL HANDLER] Error:", error);
    socket.emit("interview:error", { message: "Failed to get response from Technical Interviewer" });
  }
};
