import { Socket } from "socket.io";
import { chatWithResumeAgent } from "../../agents/resumeAnalyst";
import { InterviewState } from "../../agents/state";

export const handleResumeStage = async (
  socket: Socket,
  data: { sessionId: string; message: string },
  sessionData: InterviewState
) => {
  console.log(`🔍 [RESUME HANDLER] Processing message for session: ${data.sessionId}`);

  try {
    if (!sessionData.conversationHistory["resume"]) {
      sessionData.conversationHistory["resume"] = [];
    }

    // Add user message
    sessionData.conversationHistory["resume"].push({ role: "user", content: data.message });

    // Call Agent 1
    const response = await chatWithResumeAgent(
      sessionData.conversationHistory["resume"] as any,
      sessionData.resumeText || "",
      sessionData.jobDescription || "",
      typeof sessionData.resumeAnalysis === 'string' 
        ? sessionData.resumeAnalysis 
        : JSON.stringify(sessionData.resumeAnalysis || {})
    );

    // Add assistant response
    sessionData.conversationHistory["resume"].push({ role: "assistant", content: response });

    // Emit back to frontend
    socket.emit("interview:response", {
      sessionId: data.sessionId,
      stage: "resume",
      message: response,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error("❌ [RESUME HANDLER] Error:", error);
    socket.emit("interview:error", { message: "Failed to get response from Resume Analyst" });
  }
};

/**
 * Trigger proactive greeting for resume stage
 */
export const triggerResumeGreeting = async (
  socket: Socket,
  sessionId: string,
  sessionData: InterviewState
) => {
  if (!sessionData.conversationHistory["resume"] || sessionData.conversationHistory["resume"].length === 0) {
    console.log(`🤖 [RESUME HANDLER] Triggering proactive greeting for: ${sessionId}`);
    
    try {
      const response = await chatWithResumeAgent(
        [{ role: "user", content: "Hi! Please introduce yourself and give me a summary of my resume analysis results." }] as any,
        sessionData.resumeText || "",
        sessionData.jobDescription || "",
        typeof sessionData.resumeAnalysis === 'string' 
          ? sessionData.resumeAnalysis 
          : JSON.stringify(sessionData.resumeAnalysis || {})
      );

      if (!sessionData.conversationHistory["resume"]) sessionData.conversationHistory["resume"] = [];
      sessionData.conversationHistory["resume"].push({ role: "assistant", content: response });

      socket.emit("interview:response", {
        sessionId,
        stage: "resume",
        message: response,
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      console.error("❌ [RESUME HANDLER] Proactive Greeting Error:", err);
    }
  }
};
