import React from "react";
import type { Scores } from "@/types";
import Progress from "@/components/ui/Progress";

interface ScoreCardProps {
  scores: Scores;
  readiness?: string;
}

export default function ScoreCard({ scores, readiness }: ScoreCardProps) {
  return (
    <div className="glass-card" style={{ padding: "var(--space-6)" }}>
      <h3 style={{ fontWeight: 700, fontSize: "1.125rem", marginBottom: "var(--space-5)" }}>📊 Interview Scores</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
        <Progress value={scores.resume} label="🔍 Resume Analysis" />
        <Progress value={scores.technical} label="💻 Technical Interview" />
        <Progress value={scores.knowledge} label="📚 Knowledge Assessment" />
        <Progress value={scores.hr} label="🤝 HR & Behavioral" />
        <div style={{ borderTop: "1px solid var(--border-subtle)", paddingTop: "var(--space-4)", marginTop: "var(--space-2)" }}>
          <Progress value={scores.overall} label="⭐ Overall Score" size="lg" />
        </div>
      </div>
      {readiness && (
        <div style={{ textAlign: "center", marginTop: "var(--space-5)", padding: "var(--space-3)", background: "var(--bg-input)", borderRadius: "var(--radius-md)" }}>
          <span style={{ fontSize: "0.8125rem", color: "var(--text-muted)" }}>Readiness: </span>
          <strong>{readiness}</strong>
        </div>
      )}
    </div>
  );
}
