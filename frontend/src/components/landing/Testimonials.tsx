import React from "react";

const testimonials = [
  { name: "Priya S.", role: "SDE @ Amazon", text: "InterviewPilot helped me crack my Amazon interview. The technical agent's coding questions were spot on!", avatar: "PS" },
  { name: "Raj K.", role: "Frontend Dev @ Flipkart", text: "The HR Coach agent taught me the STAR method perfectly. I aced my behavioral round!", avatar: "RK" },
  { name: "Ananya M.", role: "SDE Intern @ Google", text: "As a fresher, the resume optimizer helped me improve my ATS score from 45% to 88%. Got shortlisted!", avatar: "AM" },
];

export default function Testimonials() {
  return (
    <section style={{ padding: "60px 0", textAlign: "center" }}>
      <h2 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: "var(--space-8)" }}>What Candidates Say</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "var(--space-5)", maxWidth: 1000, margin: "0 auto" }}>
        {testimonials.map((t) => (
          <div key={t.name} className="glass-card" style={{ padding: "var(--space-5)", textAlign: "left" }}>
            <p style={{ fontSize: "0.9375rem", color: "var(--text-secondary)", lineHeight: 1.7, marginBottom: "var(--space-4)", fontStyle: "italic" }}>&quot;{t.text}&quot;</p>
            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: "var(--accent-gradient)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "0.75rem", color: "#fff" }}>{t.avatar}</div>
              <div>
                <div style={{ fontWeight: 600, fontSize: "0.875rem" }}>{t.name}</div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{t.role}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
