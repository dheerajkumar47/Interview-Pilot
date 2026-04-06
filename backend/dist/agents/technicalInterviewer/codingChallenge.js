"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.askCodingQuestion = askCodingQuestion;
// ═══════════════ Agent 2A: Coding Challenge ═══════════════
const ai_service_1 = require("../../services/ai.service");
const prompts_1 = require("./prompts");
async function askCodingQuestion(messages, context) {
    const prompt = prompts_1.CODING_CHALLENGE_PROMPT.replace("{skills}", context.skills.join(", ")).replace("{candidateLevel}", context.candidateLevel);
    const response = await (0, ai_service_1.callAI)(prompt, messages, { temperature: 0.7 });
    return response.content;
}
//# sourceMappingURL=codingChallenge.js.map