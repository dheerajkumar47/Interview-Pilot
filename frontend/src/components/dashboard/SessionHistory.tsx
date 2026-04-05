import React from "react";
import type { Session } from "@/types";
import Link from "next/link";
import Badge from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";

interface SessionHistoryProps {
  sessions: Session[];
}

const statusMap: Record<string, { label: string; variant: "primary" | "success" | "warning" }> = {
  completed: { label: "Completed", variant: "success" },
  technical_interview: { label: "In Progress", variant: "primary" },
  resume_analyzed: { label: "Resume Analyzed", variant: "warning" },
  created: { label: "Created", variant: "primary" },
};

export default function SessionHistory({ sessions }: SessionHistoryProps) {
  return (
    <div style={{ border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-lg)", overflow: "hidden" }}>
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 0.7fr 1fr 0.8fr", padding: "var(--space-3) var(--space-5)", background: "var(--bg-tertiary)", fontSize: "0.75rem", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
        <span>Company / Role</span><span>Status</span><span>Score</span><span>Date</span><span>Action</span>
      </div>
      {sessions.map((s) => (
        <div key={s.id} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 0.7fr 1fr 0.8fr", alignItems: "center", padding: "var(--space-4) var(--space-5)", borderTop: "1px solid var(--border-subtle)" }}>
          <div><div style={{ fontWeight: 600 }}>{s.companyName || "Unknown"}</div><div style={{ fontSize: "0.8125rem", color: "var(--text-muted)" }}>{s.jobTitle}</div></div>
          <Badge variant={statusMap[s.status]?.variant || "primary"}>{statusMap[s.status]?.label || s.status}</Badge>
          <span style={{ fontWeight: 700 }}>{s.overallScore ? `${s.overallScore}%` : "—"}</span>
          <span style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>{formatDate(s.createdAt)}</span>
          <Link href={`/session/${s.id}`} className="btn btn-ghost btn-sm">View →</Link>
        </div>
      ))}
    </div>
  );
}
