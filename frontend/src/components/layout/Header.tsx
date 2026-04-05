"use client";
import Link from "next/link";
import React, { useState } from "react";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header style={{
      position: "fixed", top: 0, left: 0, right: 0, height: "var(--header-height)",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0 var(--space-8)", background: "rgba(10, 10, 20, 0.8)", backdropFilter: "blur(16px)",
      borderBottom: "1px solid var(--border-subtle)", zIndex: 100,
    }}>
      <Link href="/" style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", fontWeight: 800, fontSize: "1.125rem" }}>
        <span style={{ width: 32, height: 32, background: "var(--accent-gradient)", borderRadius: "var(--radius-md)", display: "flex", alignItems: "center", justifyContent: "center" }}>🚀</span>
        InterviewPilot
      </Link>
      <nav style={{ display: "flex", gap: "var(--space-6)", alignItems: "center" }}>
        <Link href="/#agents" style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>AI Agents</Link>
        <Link href="/#how" style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>How It Works</Link>
        <Link href="/login" style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>Log In</Link>
        <Link href="/signup" className="btn btn-primary btn-sm">Sign Up Free</Link>
      </nav>
    </header>
  );
}
