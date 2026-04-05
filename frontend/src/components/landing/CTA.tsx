import React from "react";
import Link from "next/link";

export default function CTA() {
  return (
    <section style={{ padding: "60px 0", textAlign: "center" }}>
      <div className="glass-card" style={{ maxWidth: 700, margin: "0 auto", padding: "var(--space-12)" }}>
        <h2 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: "var(--space-4)" }}>Ready to <span className="gradient-text">Ace Your Interview</span>?</h2>
        <p style={{ color: "var(--text-secondary)", marginBottom: "var(--space-8)" }}>Join thousands of candidates who cracked their dream jobs with AI-powered mock interviews. Completely free, no credit card required.</p>
        <Link href="/signup" className="btn btn-primary btn-lg">Start Mock Interview — It&apos;s Free →</Link>
      </div>
    </section>
  );
}
