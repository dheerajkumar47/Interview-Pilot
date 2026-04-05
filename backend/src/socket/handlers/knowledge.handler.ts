import { Socket } from "socket.io";
import { conductKnowledgeAssessment } from "../../agents/knowledgeAssessor";
import { InterviewState } from "../../agents/state";

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

    // Emit back to frontend
    socket.emit("interview:response", {
      sessionId: data.sessionId,
      stage: data.stage,
      message: response,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error("❌ [KNOWLEDGE HANDLER] Error:", error);
    socket.emit("interview:error", { message: "Failed to get response from Knowledge Assessor" });
  }
};
