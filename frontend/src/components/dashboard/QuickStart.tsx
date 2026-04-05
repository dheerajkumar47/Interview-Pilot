import React from "react";
import Link from "next/link";

const quickCards = [
  { href: "/session/new", icon: "🚀", title: "Full Interview Simulation", desc: "Complete pipeline — Resume → Technical → Knowledge → HR" },
  { href: "/session/new?mode=resume", icon: "📄", title: "Resume Review Only", desc: "Get your resume scored and optimized for a specific JD" },
  { href: "/session/new?mode=technical", icon: "💻", title: "Technical Practice", desc: "Coding challenges and system design questions" },
];

export default function QuickStart() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "var(--space-5)" }}>
      {quickCards.map((card) => (
        <Link key={card.href} href={card.href} className="glass-card" style={{ padding: "var(--space-6)", textDecoration: "none", color: "inherit" }}>
          <div style={{ fontSize: "2rem", marginBottom: "var(--space-4)" }}>{card.icon}</div>
          <h3 style={{ fontWeight: 700, fontSize: "1.0625rem", marginBottom: "var(--space-2)" }}>{card.title}</h3>
          <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>{card.desc}</p>
        </Link>
      ))}
    </div>
  );
}
