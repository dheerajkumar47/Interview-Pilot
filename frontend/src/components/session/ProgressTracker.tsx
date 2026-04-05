import React from "react";
import type { StageInfo } from "@/types";

interface ProgressTrackerProps {
  stages: StageInfo[];
}

export default function ProgressTracker({ stages }: ProgressTrackerProps) {
  return (
    <div style={{ display: "flex", gap: "var(--space-3)", alignItems: "center", flexWrap: "wrap" }}>
      {stages.map((stage, i) => (
        <React.Fragment key={stage.id}>
          {i > 0 && <div style={{ width: 24, height: 2, background: stage.status !== "locked" ? "var(--accent-500)" : "var(--bg-elevated)" }} />}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "var(--space-1)", opacity: stage.status === "locked" ? 0.4 : 1 }}>
            <div style={{
              width: 40, height: 40, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem",
              background: stage.status === "completed" ? "var(--success)" : stage.status === "current" ? "var(--accent-gradient)" : "var(--bg-elevated)",
              color: stage.status !== "locked" ? "#fff" : "var(--text-muted)", boxShadow: stage.status === "current" ? "var(--accent-glow)" : "none",
            }}>{stage.status === "completed" ? "✓" : stage.icon}</div>
            <span style={{ fontSize: "0.6875rem", color: "var(--text-muted)", whiteSpace: "nowrap" }}>{stage.label}</span>
          </div>
        </React.Fragment>
      ))}
    </div>
  );
}
