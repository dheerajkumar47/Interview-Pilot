import { Socket } from "socket.io";
import { conductHRInterview } from "../../agents/hrCoach";
import { InterviewState } from "../../agents/state";
import { updateSession } from "../../services/session.service";

export const handleHRStage = async (
  socket: Socket,
  data: { sessionId: string; message: string },
  sessionData: InterviewState
) => {
  console.log(`🤝 [HR HANDLER] Processing message for session: ${data.sessionId}`);

  try {
    if (!sessionData.conversationHistory["hr"]) {
      sessionData.conversationHistory["hr"] = [];
    }

    // Add user message
    sessionData.conversationHistory["hr"].push({ role: "user", content: data.message });

    // Call Agent 4
    const response = await conductHRInterview(
      sessionData.conversationHistory["hr"] as any,
      {
        jobDescription: sessionData.jobDescription || "",
        jobTitle: sessionData.jobTitle || "Software Engineer",
        company: sessionData.company || "Unknown",
        experience: sessionData.experience || "Not specified",
        mode: "behavioral",
      }
    );

    // Add assistant response
    sessionData.conversationHistory["hr"].push({ role: "assistant", content: response });

    // Extract score if present in response (e.g., [SCORE: 85] or **Score:** 85)
    const scoreMatch = response.match(/\[SCORE:\s*(\d+)\]/i) || response.match(/\*\*Score:\*\*\s*(\d+)/i) || response.match(/Score:\s*(\d+)/i);
    if (scoreMatch) {
      const score = Math.min(100, Math.max(0, parseInt(scoreMatch[1])));
      sessionData.scores.hr = score;

      // 🚀 Save immediately
      await updateSession(data.sessionId, { scores: sessionData.scores });
      socket.emit("score:update", { sessionId: data.sessionId, stage: "hr", score });
    }

    // Clean up response: remove score tags and redundant formatting
    const cleanedResponse = response
      .replace(/\[SCORE:\s*\d+\]/gi, "")
      .replace(/\*\*Score:\*\*\s*\d*/gi, "")
      .replace(/^#\s*\*/gm, "") // Remove weird "# *" prefix
      .trim();

    // Emit back to frontend
    socket.emit("interview:response", {
      sessionId: data.sessionId,
      stage: "hr",
      message: cleanedResponse,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error("❌ [HR HANDLER] Error:", error);
    socket.emit("interview:error", { message: "Failed to get response from HR Coach" });
  }
};
