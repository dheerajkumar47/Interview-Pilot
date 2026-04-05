export function generateId(): string {
  return `${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

export function truncateText(text: string, maxLength: number): string {
  return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
}

export function extractSkillsFromJD(jd: string): string[] {
  const skillPatterns = /\b(react|angular|vue|node\.?js|python|java|typescript|javascript|go|rust|c\+\+|sql|nosql|mongodb|postgres|redis|docker|kubernetes|aws|gcp|azure|git|ci\/cd|agile|scrum|rest|graphql|html|css|sass|webpack|next\.?js|express|django|flask|spring|swift|kotlin)\b/gi;
  const matches = jd.match(skillPatterns) || [];
  return [...new Set(matches.map((s) => s.toLowerCase()))];
}
