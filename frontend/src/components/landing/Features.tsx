import React from "react";

const agents = [
  { icon: "🔍", name: "Resume Analyst", desc: "Screens your resume against the job description, scores ATS compatibility, and provides targeted improvement suggestions.", subs: ["Resume Parser", "Resume Optimizer"], color: "#6366f1" },
  { icon: "💻", name: "Technical Interviewer", desc: "Conducts realistic coding challenges and system design interviews, adapting difficulty to your experience level.", subs: ["Coding Challenge Agent", "System Design Agent"], color: "#f97316" },
  { icon: "📚", name: "Knowledge Assessor", desc: "Tests your theoretical knowledge with MCQs, domain deep-dives, and concept discussions tailored to the role.", subs: ["MCQ Generator", "Domain Expert"], color: "#10b981" },
  { icon: "🤝", name: "HR Coach", desc: "Prepares you for behavioral interviews using the STAR method, and guides salary negotiation strategy.", subs: ["Behavioral Q&A Agent", "Salary Negotiation Agent"], color: "#ec4899" },
];

export default function Features() {
  return (
    <section id="agents" style={{ padding: "80px 0", textAlign: "center" }}>
      <h2 style={{ fontSize: "2rem", fontWeight: 800 }}>Meet Your <span className="gradient-text">AI Interview Panel</span></h2>
      <p style={{ color: "var(--text-secondary)", marginTop: "var(--space-3)", marginBottom: "var(--space-10)" }}>Four expert AI agents, each with specialized sub-agents, guide you through every stage.</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "var(--space-5)", maxWidth: 1100, margin: "0 auto" }}>
        {agents.map((a) => (
          <div key={a.name} className="glass-card" style={{ padding: "var(--space-6)", textAlign: "center" }}>
            <div style={{ width: 56, height: 56, borderRadius: "var(--radius-lg)", background: `linear-gradient(135deg, ${a.color}, ${a.color}99)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem", margin: "0 auto var(--space-4)" }}>{a.icon}</div>
            <h3 style={{ fontWeight: 700, marginBottom: "var(--space-2)" }}>{a.name}</h3>
            <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: "var(--space-4)" }}>{a.desc}</p>
            {a.subs.map((s) => <div key={s} style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: 4 }}>→ {s}</div>)}
          </div>
        ))}
      </div>
    </section>
  );
}
