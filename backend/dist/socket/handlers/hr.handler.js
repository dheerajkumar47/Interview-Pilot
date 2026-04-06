"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleHRStage = void 0;
const hrCoach_1 = require("../../agents/hrCoach");
const session_service_1 = require("../../services/session.service");
const handleHRStage = async (socket, data, sessionData) => {
    console.log(`🤝 [HR HANDLER] Processing message for session: ${data.sessionId}`);
    try {
        if (!sessionData.conversationHistory["hr"]) {
            sessionData.conversationHistory["hr"] = [];
        }
        // Add user message
        sessionData.conversationHistory["hr"].push({ role: "user", content: data.message });
        // Call Agent 4
        const response = await (0, hrCoach_1.conductHRInterview)(sessionData.conversationHistory["hr"], {
            jobDescription: sessionData.jobDescription || "",
            jobTitle: sessionData.jobTitle || "Software Engineer",
            company: sessionData.company || "Unknown",
            experience: sessionData.experience || "Not specified",
            mode: "behavioral",
        });
        // Add assistant response
        sessionData.conversationHistory["hr"].push({ role: "assistant", content: response });
        // Extract score if present in response (e.g., [SCORE: 85] or **Score:** 85)
        const scoreMatch = response.match(/\[SCORE:\s*(\d+)\]/i) || response.match(/\*\*Score:\*\*\s*(\d+)/i) || response.match(/Score:\s*(\d+)/i);
        if (scoreMatch) {
            const score = Math.min(100, Math.max(0, parseInt(scoreMatch[1])));
            sessionData.scores.hr = score;
            // 🚀 Save immediately
            await (0, session_service_1.updateSession)(data.sessionId, { scores: sessionData.scores });
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
    }
    catch (error) {
        console.error("❌ [HR HANDLER] Error:", error);
        socket.emit("interview:error", { message: "Failed to get response from HR Coach" });
    }
};
exports.handleHRStage = handleHRStage;
//# sourceMappingURL=hr.handler.js.map