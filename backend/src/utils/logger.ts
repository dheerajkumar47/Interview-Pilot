// Logger utility
export function log(level: "info" | "warn" | "error", message: string, data?: unknown) {
  const timestamp = new Date().toISOString();
  const emoji = { info: "ℹ️", warn: "⚠️", error: "❌" };
  console.log(`${emoji[level]} [${timestamp}] ${message}`, data || "");
}

export const logger = {
  info: (msg: string, data?: unknown) => log("info", msg, data),
  warn: (msg: string, data?: unknown) => log("warn", msg, data),
  error: (msg: string, data?: unknown) => log("error", msg, data),
};
