"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSocketHandlers = setupSocketHandlers;
const session_service_1 = require("../services/session.service");
const resume_handler_1 = require("./handlers/resume.handler");
const technical_handler_1 = require("./handlers/technical.handler");
const knowledge_handler_1 = require("./handlers/knowledge.handler");
const hr_handler_1 = require("./handlers/hr.handler");
const state_1 = require("../agents/state");
const sessions = {};
function setupSocketHandlers(io) {
    io.on("connection", (socket) => {
        console.log(`🔌 [SOCKET] Client connected: ${socket.id}`);
        socket.on("session:init", async (data) => {
            if (!sessions[data.sessionId]) {
                const dbSession = await (0, session_service_1.getSession)(data.sessionId);
                sessions[data.sessionId] = dbSession || (0, state_1.createInitialState)({ sessionId: data.sessionId });
            }
            if (data.language)
                sessions[data.sessionId].language = data.language;
            // Handle direct routing for modes
            if (sessions[data.sessionId].sessionMode === "technical_only" && sessions[data.sessionId].currentStage === "resume") {
                sessions[data.sessionId].currentStage = "technical";
            }
            socket.join(data.sessionId);
            socket.emit("session:initialized", { sessionId: data.sessionId, currentStage: sessions[data.sessionId].currentStage });
            if (sessions[data.sessionId].currentStage === "resume") {
                await (0, resume_handler_1.triggerResumeGreeting)(socket, data.sessionId, sessions[data.sessionId]);
            }
        });
        // Advance to next stage + calculate stage score
        socket.on("session:advance", async (data) => {
            // 🔄 Sync with latest DB state to prevent stale score overwrites
            const session = await (0, session_service_1.getSession)(data.sessionId);
            if (!session)
                return;
            sessions[data.sessionId] = session; // Update cache
            const STAGES = ["resume", "initial", "technical", "knowledge", "hr", "report"];
            let nextStage = "report";
            if (session.sessionMode === "resume_only") {
                nextStage = "report";
            }
            else if (session.sessionMode === "technical_only") {
                nextStage = data.currentStage === "technical" ? "report" : "technical"; // Limited tech only flow or jump to report
            }
            else {
                const currentIndex = STAGES.indexOf(data.currentStage);
                if (currentIndex !== -1 && currentIndex < STAGES.length - 1) {
                    nextStage = STAGES[currentIndex + 1];
                }
            }
            session.currentStage = nextStage;
            // ... same scoring logic ...
            const scores = session.scores;
            const weights = {
                resume: 0.2, initial: 0.2, technical: 0.4, knowledge: 0.1, hr: 0.1
            };
            let totalScore = 0;
            let totalWeight = 0;
            for (const [stage, weight] of Object.entries(weights)) {
                const stageScore = scores[stage] || 0;
                if (stageScore > 0) {
                    totalScore += stageScore * weight;
                    totalWeight += weight;
                }
            }
            session.scores.overall = totalWeight > 0 ? Math.round(totalScore / totalWeight) : 0;
            await (0, session_service_1.updateSession)(data.sessionId, {
                currentStage: nextStage,
                scores: session.scores,
            });
            socket.emit("session:advanced", { sessionId: data.sessionId, nextStage });
        });
        // Update score for a specific stage
        socket.on("score:update", async (data) => {
            const session = sessions[data.sessionId];
            if (session) {
                session.scores[data.stage] = data.score;
                await (0, session_service_1.updateSession)(data.sessionId, { scores: session.scores });
                socket.emit("score:updated", { sessionId: data.sessionId, scores: session.scores });
            }
        });
        // Delete session
        socket.on("session:delete", async (data) => {
            delete sessions[data.sessionId];
            await (0, session_service_1.deleteSession)(data.sessionId);
            socket.emit("session:deleted", { sessionId: data.sessionId });
        });
        // Core message dispatcher 
        socket.on("interview:message", async (data) => {
            const sessionData = sessions[data.sessionId];
            if (!sessionData) {
                socket.emit("interview:error", { message: "Session not initialized. Please refresh." });
                return;
            }
            sessionData.currentStage = data.stage;
            switch (data.stage) {
                case "resume":
                    await (0, resume_handler_1.handleResumeStage)(socket, data, sessionData);
                    break;
                case "technical":
                    await (0, technical_handler_1.handleTechnicalStage)(socket, data, sessionData);
                    break;
                case "knowledge":
                case "initial":
                    await (0, knowledge_handler_1.handleKnowledgeStage)(socket, data, sessionData);
                    break;
                case "hr":
                    await (0, hr_handler_1.handleHRStage)(socket, data, sessionData);
                    break;
                default: socket.emit("interview:error", { message: "Unknown stage." });
            }
        });
        socket.on("disconnect", () => {
            console.log(`🔌 [SOCKET] Client disconnected: ${socket.id}`);
        });
    });
}
//# sourceMappingURL=index.js.map