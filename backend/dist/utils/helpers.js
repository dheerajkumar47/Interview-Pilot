"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateId = generateId;
exports.truncateText = truncateText;
exports.extractSkillsFromJD = extractSkillsFromJD;
function generateId() {
    return `${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}
function truncateText(text, maxLength) {
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
}
function extractSkillsFromJD(jd) {
    const skillPatterns = /\b(react|angular|vue|node\.?js|python|java|typescript|javascript|go|rust|c\+\+|sql|nosql|mongodb|postgres|redis|docker|kubernetes|aws|gcp|azure|git|ci\/cd|agile|scrum|rest|graphql|html|css|sass|webpack|next\.?js|express|django|flask|spring|swift|kotlin)\b/gi;
    const matches = jd.match(skillPatterns) || [];
    return [...new Set(matches.map((s) => s.toLowerCase()))];
}
//# sourceMappingURL=helpers.js.map