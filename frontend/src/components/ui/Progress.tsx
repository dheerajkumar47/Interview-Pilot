import React from "react";
import { getScoreColor } from "@/lib/utils";

interface ProgressProps {
  value: number;
  max?: number;
  label?: string;
  showPercentage?: boolean;
  size?: "sm" | "md" | "lg";
}

export default function Progress({ value, max = 100, label, showPercentage = true, size = "md" }: ProgressProps) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  const heights = { sm: 4, md: 8, lg: 12 };

  return (
    <div>
      {(label || showPercentage) && (
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: "0.8125rem" }}>
          {label && <span style={{ color: "var(--text-secondary)" }}>{label}</span>}
          {showPercentage && <span style={{ fontWeight: 700, color: getScoreColor(pct) }}>{pct}%</span>}
        </div>
      )}
      <div style={{ width: "100%", height: heights[size], background: "var(--bg-elevated)", borderRadius: 99, overflow: "hidden" }}>
        <div
          style={{
            width: `${pct}%`,
            height: "100%",
            background: getScoreColor(pct),
            borderRadius: 99,
            transition: "width 0.6s var(--ease-out)",
          }}
        />
      </div>
    </div>
  );
}
