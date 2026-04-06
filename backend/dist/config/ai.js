"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.aiConfig = void 0;
// AI Provider configuration
exports.aiConfig = {
    gemini: { model: "gemini-2.0-flash", maxTokens: 2048, temperature: 0.7 },
    groq: { model: "llama-3.3-70b-versatile", maxTokens: 2048, temperature: 0.7 },
    retryAttempts: 2,
    retryDelayMs: 1000,
};
//# sourceMappingURL=ai.js.map