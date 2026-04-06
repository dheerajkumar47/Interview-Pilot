import { Socket } from "socket.io";
import { conductKnowledgeAssessment } from "../../agents/knowledgeAssessor";
import { InterviewState } from "../../agents/state";
import { updateSession } from "../../services/session.service";

export const handleKnowledgeStage = async (
  socket: Socket,
  data: { sessionId: string; message: string; stage: string },
  sessionData: InterviewState
) => {
  console.log(`📚 [KNOWLEDGE HANDLER] Processing message for session: ${data.sessionId}`);

  try {
    if (!sessionData.conversationHistory[data.stage]) {
      sessionData.conversationHistory[data.stage] = [];
    }

    // Add user message
    sessionData.conversationHistory[data.stage].push({ role: "user", content: data.message });

    // Call Agent 3
    const response = await conductKnowledgeAssessment(
      sessionData.conversationHistory[data.stage] as any,
      {
        jobDescription: sessionData.jobDescription || "",
        jobTitle: sessionData.jobTitle || "Software Engineer",
        skills: sessionData.skills || [],
        candidateLevel: sessionData.candidateLevel || "beginner",
        mode: data.stage === "initial" ? "discussion" : "mcq",
      }
    );

    // Add assistant response
    sessionData.conversationHistory[data.stage].push({ role: "assistant", content: response });

    // Extract score if present in response (e.g., [SCORE: 85] or **Score:** 85)
    const scoreMatch = response.match(/\[SCORE:\s*(\d+)\]/i) || response.match(/\*\*Score:\*\*\s*(\d+)/i) || response.match(/Score:\s*(\d+)/i);
    if (scoreMatch) {
      const score = Math.min(100, Math.max(0, parseInt(scoreMatch[1])));
      const stageKey = data.stage === 'initial' ? 'initial' : 'knowledge';
      sessionData.scores[stageKey] = score;

      // 🚀 Save immediately
      await updateSession(data.sessionId, { scores: sessionData.scores });
      socket.emit("score:update", { sessionId: data.sessionId, stage: stageKey, score });
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
      stage: data.stage,
      message: cleanedResponse,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error("❌ [KNOWLEDGE HANDLER] Error:", error);
    socket.emit("interview:error", { message: "Failed to get response from Knowledge Assessor" });
  }
};
