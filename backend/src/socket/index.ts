import { Server, Socket } from "socket.io";
import { getSession, updateSession, deleteSession } from "../services/session.service";
import { handleResumeStage, triggerResumeGreeting } from "./handlers/resume.handler";
import { handleTechnicalStage } from "./handlers/technical.handler";
import { handleKnowledgeStage } from "./handlers/knowledge.handler";
import { handleHRStage } from "./handlers/hr.handler";
import { InterviewState, createInitialState } from "../agents/state";

const sessions: Record<string, InterviewState> = {};

export function setupSocketHandlers(io: Server) {
  io.on("connection", (socket: Socket) => {
    console.log(`🔌 [SOCKET] Client connected: ${socket.id}`);

    socket.on("session:init", async (data: { sessionId: string; stage?: string; language?: string }) => {
      if (!sessions[data.sessionId]) {
        const dbSession = await getSession(data.sessionId);
        sessions[data.sessionId] = dbSession || createInitialState({ sessionId: data.sessionId });
      }
      
      if (data.language) sessions[data.sessionId].language = data.language;

      // Handle direct routing for modes
      if (sessions[data.sessionId].sessionMode === "technical_only" && sessions[data.sessionId].currentStage === "resume") {
        sessions[data.sessionId].currentStage = "technical";
      }

      socket.join(data.sessionId);
      socket.emit("session:initialized", { sessionId: data.sessionId, currentStage: sessions[data.sessionId].currentStage });

      if (sessions[data.sessionId].currentStage === "resume") {
        await triggerResumeGreeting(socket, data.sessionId, sessions[data.sessionId]);
      }
    });

    // Advance to next stage + calculate stage score
    socket.on("session:advance", async (data: { sessionId: string; currentStage: string }) => {
      // 🔄 Sync with latest DB state to prevent stale score overwrites
      const session = await getSession(data.sessionId);
      if (!session) return;
      sessions[data.sessionId] = session; // Update cache

      const STAGES = ["resume", "initial", "technical", "knowledge", "hr", "report"];
      let nextStage: string = "report";

      if (session.sessionMode === "resume_only") {
        nextStage = "report";
      } else if (session.sessionMode === "technical_only") {
        nextStage = data.currentStage === "technical" ? "report" : "technical"; // Limited tech only flow or jump to report
      } else {
        const currentIndex = STAGES.indexOf(data.currentStage);
        if (currentIndex !== -1 && currentIndex < STAGES.length - 1) {
          nextStage = STAGES[currentIndex + 1];
        }
      }

      session.currentStage = nextStage as any;
      
      // ... same scoring logic ...
      const scores = session.scores;
      const weights: Record<string, number> = {
        resume: 0.2, initial: 0.2, technical: 0.4, knowledge: 0.1, hr: 0.1
      };
      let totalScore = 0;
      let totalWeight = 0;
      for (const [stage, weight] of Object.entries(weights)) {
        const stageScore = (scores as any)[stage] || 0;
        if (stageScore > 0) {
          totalScore += stageScore * weight;
          totalWeight += weight;
        }
      }
      session.scores.overall = totalWeight > 0 ? Math.round(totalScore / totalWeight) : 0;

      await updateSession(data.sessionId, {
        currentStage: nextStage as any,
        scores: session.scores,
      });

      socket.emit("session:advanced", { sessionId: data.sessionId, nextStage });
    });

    // Update score for a specific stage
    socket.on("score:update", async (data: { sessionId: string; stage: string; score: number }) => {
      const session = sessions[data.sessionId];
      if (session) {
        (session.scores as any)[data.stage] = data.score;
        await updateSession(data.sessionId, { scores: session.scores });
        socket.emit("score:updated", { sessionId: data.sessionId, scores: session.scores });
      }
    });

    // Delete session
    socket.on("session:delete", async (data: { sessionId: string }) => {
      delete sessions[data.sessionId];
      await deleteSession(data.sessionId);
      socket.emit("session:deleted", { sessionId: data.sessionId });
    });

    // Core message dispatcher 
    socket.on("interview:message", async (data: { sessionId: string; stage: string; message: string }) => {
      const sessionData = sessions[data.sessionId];
      if (!sessionData) {
        socket.emit("interview:error", { message: "Session not initialized. Please refresh." });
        return;
      }
      sessionData.currentStage = data.stage as any;

      switch (data.stage) {
        case "resume": await handleResumeStage(socket, data, sessionData); break;
        case "technical": await handleTechnicalStage(socket, data, sessionData); break;
        case "knowledge":
        case "initial": await handleKnowledgeStage(socket, data, sessionData); break;
        case "hr": await handleHRStage(socket, data, sessionData); break;
        default: socket.emit("interview:error", { message: "Unknown stage." });
      }
    });

    socket.on("disconnect", () => {
      console.log(`🔌 [SOCKET] Client disconnected: ${socket.id}`);
    });
  });
}
