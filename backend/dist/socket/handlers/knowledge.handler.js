"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleKnowledgeStage = void 0;
const knowledgeAssessor_1 = require("../../agents/knowledgeAssessor");
const session_service_1 = require("../../services/session.service");
const handleKnowledgeStage = async (socket, data, sessionData) => {
    console.log(`📚 [KNOWLEDGE HANDLER] Processing message for session: ${data.sessionId}`);
    try {
        if (!sessionData.conversationHistory[data.stage]) {
            sessionData.conversationHistory[data.stage] = [];
        }
        // Add user message
        sessionData.conversationHistory[data.stage].push({ role: "user", content: data.message });
        // Call Agent 3
        const response = await (0, knowledgeAssessor_1.conductKnowledgeAssessment)(sessionData.conversationHistory[data.stage], {
            jobDescription: sessionData.jobDescription || "",
            jobTitle: sessionData.jobTitle || "Software Engineer",
            skills: sessionData.skills || [],
            candidateLevel: sessionData.candidateLevel || "beginner",
            mode: data.stage === "initial" ? "discussion" : "mcq",
        });
        // Add assistant response
        sessionData.conversationHistory[data.stage].push({ role: "assistant", content: response });
        // Extract score if present in response (e.g., [SCORE: 85] or **Score:** 85)
        const scoreMatch = response.match(/\[SCORE:\s*(\d+)\]/i) || response.match(/\*\*Score:\*\*\s*(\d+)/i) || response.match(/Score:\s*(\d+)/i);
        if (scoreMatch) {
            const score = Math.min(100, Math.max(0, parseInt(scoreMatch[1])));
            const stageKey = data.stage === 'initial' ? 'initial' : 'knowledge';
            sessionData.scores[stageKey] = score;
            // 🚀 Save immediately
            await (0, session_service_1.updateSession)(data.sessionId, { scores: sessionData.scores });
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
    }
    catch (error) {
        console.error("❌ [KNOWLEDGE HANDLER] Error:", error);
        socket.emit("interview:error", { message: "Failed to get response from Knowledge Assessor" });
    }
};
exports.handleKnowledgeStage = handleKnowledgeStage;
//# sourceMappingURL=knowledge.handler.js.map