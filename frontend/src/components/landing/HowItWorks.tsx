import React from "react";

const steps = [
  { num: 1, title: "Paste Job Description", desc: "Copy the job posting from any company. Our AI extracts skills, requirements, and role type." },
  { num: 2, title: "Upload Resume", desc: "Upload your PDF/DOCX resume. The Resume Analyst scores it and suggests improvements." },
  { num: 3, title: "Get Shortlisted", desc: "If your resume needs work, get specific guidance. Once ready, proceed to interviews." },
  { num: 4, title: "Mock Interviews", desc: "Face technical coding, knowledge assessments, and HR rounds with expert AI agents." },
  { num: 5, title: "Get Your Score", desc: "Receive a detailed report with scores, strengths, weaknesses, and a readiness verdict." },
];

export default function HowItWorks() {
  return (
    <section id="how" style={{ padding: "80px 0", textAlign: "center" }}>
      <h2 style={{ fontSize: "2rem", fontWeight: 800 }}>How <span className="gradient-text">InterviewPilot</span> Works</h2>
      <p style={{ color: "var(--text-secondary)", marginTop: "var(--space-3)", marginBottom: "var(--space-10)" }}>A complete interview simulation pipeline — from job description to interview readiness.</p>
      <div style={{ display: "flex", justifyContent: "center", gap: "var(--space-6)", flexWrap: "wrap", maxWidth: 1100, margin: "0 auto" }}>
        {steps.map((s) => (
          <div key={s.num} style={{ textAlign: "center", maxWidth: 200 }}>
            <div style={{ width: 44, height: 44, borderRadius: "50%", background: "var(--accent-gradient)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, margin: "0 auto var(--space-4)", color: "#fff" }}>{s.num}</div>
            <h3 style={{ fontWeight: 700, fontSize: "0.9375rem", marginBottom: "var(--space-2)" }}>{s.title}</h3>
            <p style={{ fontSize: "0.8125rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
