"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.optimizeResume = optimizeResume;
// ═══════════════ Agent 1B: Resume Optimizer ═══════════════
const ai_service_1 = require("../../services/ai.service");
const prompts_1 = require("./prompts");
async function optimizeResume(resumeText, jobDescription, parsedResume) {
    const response = await (0, ai_service_1.callAI)(prompts_1.RESUME_OPTIMIZER_PROMPT, [{
            role: "user",
            content: `Analyze:\n\nJD:\n${jobDescription}\n\nPARSED:\n${parsedResume}\n\nRAW:\n${resumeText}`,
        }], { temperature: 0.3, maxTokens: 3000 });
    return response.content;
}
//# sourceMappingURL=optimizer.js.map