import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer style={{
      textAlign: "center", padding: "var(--space-8) var(--space-4)",
      borderTop: "1px solid var(--border-subtle)", color: "var(--text-muted)", fontSize: "0.8125rem",
    }}>
      <p>© {new Date().getFullYear()} <Link href="/" style={{ color: "var(--accent-400)" }}>InterviewPilot</Link>. Built with AI, for your success.</p>
    </footer>
  );
}
