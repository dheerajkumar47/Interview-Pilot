// ═══════════════════════════════════════════
// Utility functions
// ═══════════════════════════════════════════

export function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatTime(date: string | Date): string {
  return new Date(date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export function truncate(str: string, length: number): string {
  return str.length > length ? str.substring(0, length) + "..." : str;
}

export function getScoreColor(score: number): string {
  if (score >= 80) return "var(--success)";
  if (score >= 60) return "var(--warning)";
  return "var(--error)";
}

export function getReadinessLabel(level: string): { label: string; color: string } {
  const map: Record<string, { label: string; color: string }> = {
    ready: { label: "Ready!", color: "var(--success)" },
    almost_ready: { label: "Almost Ready", color: "var(--accent-400)" },
    needs_practice: { label: "Needs Practice", color: "var(--warning)" },
    not_ready: { label: "Not Ready", color: "var(--error)" },
  };
  return map[level] || { label: level, color: "var(--text-muted)" };
}

export function generateId(): string {
  return `${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

export function debounce<T extends (...args: unknown[]) => unknown>(fn: T, delay: number) {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}
