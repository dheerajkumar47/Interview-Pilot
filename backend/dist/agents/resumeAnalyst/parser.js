"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseResumeText = parseResumeText;
// ═══════════════ Agent 1A: Resume Parser ═══════════════
const ai_service_1 = require("../../services/ai.service");
const prompts_1 = require("./prompts");
async function parseResumeText(resumeText) {
    const response = await (0, ai_service_1.callAI)(prompts_1.RESUME_PARSER_PROMPT, [
        { role: "user", content: `Parse this resume:\n\n${resumeText}` },
    ], { temperature: 0.2 });
    return response.content;
}
//# sourceMappingURL=parser.js.map