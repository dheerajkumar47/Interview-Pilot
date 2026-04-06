"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.askBehavioral = askBehavioral;
const ai_service_1 = require("../../services/ai.service");
const prompts_1 = require("./prompts");
async function askBehavioral(messages, context) {
    const prompt = prompts_1.BEHAVIORAL_PROMPT.replace("{jobTitle}", context.jobTitle).replace("{company}", context.company);
    const response = await (0, ai_service_1.callAI)(prompt, messages, { temperature: 0.7 });
    return response.content;
}
//# sourceMappingURL=behavioral.js.map