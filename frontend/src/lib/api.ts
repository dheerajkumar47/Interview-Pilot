// ═══════════════════════════════════════════
// API Helper Functions
// ═══════════════════════════════════════════

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.message || "API request failed");
  }
  return res.json();
}

// Sessions
export const sessionsApi = {
  create: (data: Record<string, unknown>) => request("/sessions", { method: "POST", body: JSON.stringify(data) }),
  list: () => request("/sessions"),
  get: (id: string) => request(`/sessions/${id}`),
  update: (id: string, data: Record<string, unknown>) => request(`/sessions/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (id: string) => request(`/sessions/${id}`, { method: "DELETE" }),
};

// Resume
export const resumeApi = {
  upload: async (file: File, jobDescription?: string) => {
    const formData = new FormData();
    formData.append("resume", file);
    if (jobDescription) formData.append("jobDescription", jobDescription);
    const res = await fetch(`${API_BASE}/resume/upload`, { method: "POST", body: formData });
    if (!res.ok) throw new Error("Resume upload failed");
    return res.json();
  },
};

// Interview (REST fallback, Socket.io is primary)
export const interviewApi = {
  chat: (stage: string, messages: unknown[], context?: Record<string, unknown>) =>
    request("/interview/chat", { method: "POST", body: JSON.stringify({ stage, messages, context }) }),
};

// Health
export const healthApi = {
  check: () => request("/health"),
};
