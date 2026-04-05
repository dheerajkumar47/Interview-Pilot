import React from "react";
import type { ResumeAnalysis } from "@/types";
import Progress from "@/components/ui/Progress";
import Badge from "@/components/ui/Badge";

interface ResumeAnalysisPanelProps {
  analysis: ResumeAnalysis;
}

export default function ResumeAnalysisPanel({ analysis }: ResumeAnalysisPanelProps) {
  const statusVariant = analysis.shortlistStatus === "shortlisted" ? "success" : analysis.shortlistStatus === "borderline" ? "warning" : "error";

  return (
    <div className="glass-card" style={{ padding: "var(--space-6)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-6)" }}>
        <h3 style={{ fontWeight: 700, fontSize: "1.125rem" }}>📊 Resume Analysis</h3>
        <Badge variant={statusVariant}>{analysis.shortlistStatus.replace("_", " ").toUpperCase()}</Badge>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-5)", marginBottom: "var(--space-6)" }}>
        <Progress value={analysis.matchScore} label="Match Score" />
        <Progress value={analysis.atsScore} label="ATS Score" />
      </div>

      <div style={{ marginBottom: "var(--space-5)" }}>
        <h4 style={{ fontWeight: 600, fontSize: "0.875rem", marginBottom: "var(--space-3)", color: "var(--success)" }}>✅ Strengths</h4>
        {analysis.strengths.map((s, i) => <div key={i} style={{ fontSize: "0.875rem", color: "var(--text-secondary)", paddingLeft: "var(--space-4)", marginBottom: 4 }}>• {s}</div>)}
      </div>

      <div style={{ marginBottom: "var(--space-5)" }}>
        <h4 style={{ fontWeight: 600, fontSize: "0.875rem", marginBottom: "var(--space-3)", color: "var(--warning)" }}>⚠️ Missing Keywords</h4>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-2)" }}>
          {analysis.missingKeywords.map((k, i) => <Badge key={i} variant="warning">{k}</Badge>)}
        </div>
      </div>

      <div>
        <h4 style={{ fontWeight: 600, fontSize: "0.875rem", marginBottom: "var(--space-3)" }}>💡 Suggestions</h4>
        {analysis.suggestions.map((s, i) => (
          <div key={i} style={{ display: "flex", gap: "var(--space-3)", marginBottom: "var(--space-2)", fontSize: "0.875rem" }}>
            <Badge variant={s.priority === "high" ? "error" : s.priority === "medium" ? "warning" : "info"}>{s.priority}</Badge>
            <span style={{ color: "var(--text-secondary)" }}>{s.description}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
