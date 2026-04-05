import React from "react";

interface Stat {
  icon: string;
  label: string;
  value: string | number;
  gradient: string;
}

interface StatsOverviewProps {
  stats: Stat[];
}

export default function StatsOverview({ stats }: StatsOverviewProps) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${stats.length}, 1fr)`, gap: "var(--space-5)" }}>
      {stats.map((stat, i) => (
        <div key={i} className="glass-card" style={{ display: "flex", alignItems: "center", gap: "var(--space-4)", padding: "var(--space-5)" }}>
          <div style={{ width: 48, height: 48, borderRadius: "var(--radius-lg)", background: stat.gradient, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.25rem", flexShrink: 0 }}>{stat.icon}</div>
          <div><div style={{ fontSize: "1.75rem", fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1 }}>{stat.value}</div><div style={{ fontSize: "0.8125rem", color: "var(--text-muted)", marginTop: 4 }}>{stat.label}</div></div>
        </div>
      ))}
    </div>
  );
}
