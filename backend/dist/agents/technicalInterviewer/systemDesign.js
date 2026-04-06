"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.askSystemDesign = askSystemDesign;
// ═══════════════ Agent 2B: System Design ═══════════════
const ai_service_1 = require("../../services/ai.service");
const prompts_1 = require("./prompts");
async function askSystemDesign(messages, context) {
    const prompt = prompts_1.SYSTEM_DESIGN_PROMPT + `\n\nCandidate Level: ${context.candidateLevel}`;
    const response = await (0, ai_service_1.callAI)(prompt, messages, { temperature: 0.7 });
    return response.content;
}
//# sourceMappingURL=systemDesign.js.map