"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.practiceNegotiation = practiceNegotiation;
const ai_service_1 = require("../../services/ai.service");
const prompts_1 = require("./prompts");
async function practiceNegotiation(messages, context) {
    const prompt = prompts_1.NEGOTIATION_PROMPT.replace("{jobTitle}", context.jobTitle);
    const response = await (0, ai_service_1.callAI)(prompt, messages, { temperature: 0.7 });
    return response.content;
}
//# sourceMappingURL=negotiation.js.map