import React from "react";
import Link from "next/link";

export default function Hero() {
  return (
    <section style={{ textAlign: "center", padding: "120px 0 60px" }}>
      <span className="badge badge-primary" style={{ marginBottom: "var(--space-6)" }}>⚡ Powered by 4 AI Agents</span>
      <h1 style={{ fontSize: "3.5rem", fontWeight: 900, letterSpacing: "-0.03em", lineHeight: 1.1 }}>
        Crack Any Interview<br /><span className="gradient-text">With AI Mock Practice</span>
      </h1>
      <p style={{ maxWidth: 600, margin: "var(--space-6) auto", color: "var(--text-secondary)", fontSize: "1.125rem", lineHeight: 1.7 }}>
        Paste any job description, upload your resume, and get guided through a complete interview simulation — from resume screening to HR rounds — by 4 specialized AI agents.
      </p>
      <div style={{ display: "flex", gap: "var(--space-4)", justifyContent: "center", marginTop: "var(--space-8)" }}>
        <Link href="/signup" className="btn btn-primary btn-lg">Start Free Mock Interview →</Link>
        <Link href="/#how" className="btn btn-secondary btn-lg">See How It Works</Link>
      </div>
    </section>
  );
}
