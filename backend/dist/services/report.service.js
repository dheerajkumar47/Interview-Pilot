"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateReport = generateReport;
// Report generation service
function generateReport(scores) {
    const overall = Math.round((scores.resume + scores.technical + scores.knowledge + scores.hr) / 4);
    const readiness = overall >= 80 ? "ready" : overall >= 65 ? "almost_ready" : overall >= 50 ? "needs_practice" : "not_ready";
    return {
        scores: { ...scores, overall },
        readinessLevel: readiness,
        strengths: [],
        weaknesses: [],
        recommendations: [],
        generatedAt: new Date().toISOString(),
    };
}
//# sourceMappingURL=report.service.js.map