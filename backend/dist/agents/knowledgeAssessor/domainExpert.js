"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.askDomainQuestion = askDomainQuestion;
const ai_service_1 = require("../../services/ai.service");
const prompts_1 = require("./prompts");
async function askDomainQuestion(messages) {
    const response = await (0, ai_service_1.callAI)(prompts_1.DOMAIN_EXPERT_PROMPT, messages, { temperature: 0.7 });
    return response.content;
}
//# sourceMappingURL=domainExpert.js.map