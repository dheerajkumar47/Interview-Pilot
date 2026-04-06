import { Socket } from "socket.io";
import { conductTechnicalInterview, conductDiscovery } from "../../agents/technicalInterviewer";
import { InterviewState } from "../../agents/state";
import { updateSession } from "../../services/session.service";

export const handleTechnicalStage = async (
  socket: Socket,
  data: { sessionId: string; message: string },
  sessionData: InterviewState
) => {
  console.log(`💻 [TECHNICAL HANDLER] Processing message for session: ${data.sessionId}`);

  try {
    if (!sessionData.conversationHistory["technical"]) {
      sessionData.conversationHistory["technical"] = [];
    }

    // Add user message
    sessionData.conversationHistory["technical"].push({ role: "user", content: data.message });

    // 🔍 Discovery Phase Logic for 'technical_only' sessions
    const history = sessionData.conversationHistory["technical"] as any;
    const isTechnicalOnly = sessionData.sessionMode === "technical_only";
    
    let isDiscovery = false;
    if (isTechnicalOnly) {
      // Logic for Onboarding
      const hasFinishedOnboarding = history.some((m: any) => 
        m.role === "assistant" && m.content.toLowerCase().includes("ready?")
      );
      
      // If history has 1 or fewer assistant messages, definitely in discovery
      const assistantMsgs = history.filter((m: any) => m.role === "assistant").length;
      if (!hasFinishedOnboarding || assistantMsgs < 4) {
        isDiscovery = true;
      }
    }

    let response: string;
    if (isDiscovery) {
      response = await conductDiscovery(history);
    } else {
      // Normal Interview
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
