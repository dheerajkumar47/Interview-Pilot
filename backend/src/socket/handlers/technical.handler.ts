import { Socket } from "socket.io";
import { conductTechnicalInterview } from "../../agents/technicalInterviewer";
import { InterviewState } from "../../agents/state";

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

    // Call Agent 2
    const response = await conductTechnicalInterview(
      sessionData.conversationHistory["technical"] as any,
      {
        jobTitle: sessionData.jobTitle || "Software Engineer",
        company: sessionData.company || "Tech Corp",
        experience: sessionData.experience || "0-3 years",
        jobDescription: sessionData.jobDescription || "",
        skills: (sessionData.resumeAnalysis as any)?.keywordMatches || [],
        candidateLevel: sessionData.candidateLevel || "beginner"
      }
    );

    // Add assistant response
    sessionData.conversationHistory["technical"].push({ role: "assistant", content: response });

    // Extract score if present in response (e.g., [SCORE: 85])
    const scoreMatch = response.match(/\[SCORE:\s*(\d+)\]/i);
    if (scoreMatch) {
      const score = parseInt(scoreMatch[1]);
      sessionData.scores.technical = score;
      socket.emit("score:update", { sessionId: data.sessionId, stage: "technical", score });
    }

    // Emit back to frontend
    socket.emit("interview:response", {
      sessionId: data.sessionId,
      stage: "technical",
      message: response.replace(/\[SCORE:\s*\d+\]/i, "").trim(),
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error("❌ [TECHNICAL HANDLER] Error:", error);
    socket.emit("interview:error", { message: "Failed to get response from Technical Interviewer" });
  }
};
