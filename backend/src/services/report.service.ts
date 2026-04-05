// Report generation service
export function generateReport(scores: { resume: number; technical: number; knowledge: number; hr: number }) {
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
