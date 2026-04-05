"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";

const navItems = [
  { href: "/dashboard", icon: "📊", label: "Dashboard" },
  { href: "/session/new", icon: "➕", label: "New Session" },
  { href: "/dashboard", icon: "📋", label: "My Sessions" },
  { href: "/profile", icon: "👤", label: "Profile" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside style={{
      width: collapsed ? 64 : 220, height: "100vh", position: "fixed", top: 0, left: 0,
      background: "var(--bg-secondary)", borderRight: "1px solid var(--border-subtle)",
      display: "flex", flexDirection: "column", transition: "width 0.3s var(--ease-out)", zIndex: 50,
    }}>
      {/* Brand */}
      <div style={{ padding: "var(--space-4)", display: "flex", alignItems: "center", gap: "var(--space-2)", borderBottom: "1px solid var(--border-subtle)" }}>
        <span style={{ width: 32, height: 32, background: "var(--accent-gradient)", borderRadius: "var(--radius-md)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>🚀</span>
        {!collapsed && <span style={{ fontWeight: 800, fontSize: "0.9375rem" }}>InterviewPilot</span>}
        <button onClick={() => setCollapsed(!collapsed)} style={{ marginLeft: "auto", background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: "0.875rem" }}>
          {collapsed ? "→" : "←"}
        </button>
      </div>

      {/* Nav Items */}
      <nav style={{ flex: 1, padding: "var(--space-3)", display: "flex", flexDirection: "column", gap: "var(--space-1)" }}>
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            style={{
              display: "flex", alignItems: "center", gap: "var(--space-3)", padding: "var(--space-2) var(--space-3)",
              borderRadius: "var(--radius-md)", fontSize: "0.875rem", color: pathname === item.href ? "var(--accent-400)" : "var(--text-secondary)",
              background: pathname === item.href ? "rgba(99,102,241,0.08)" : "transparent",
              transition: "all 0.15s ease",
            }}
          >
            <span style={{ fontSize: "1rem" }}>{item.icon}</span>
            {!collapsed && item.label}
          </Link>
        ))}
      </nav>

      {/* Bottom */}
      <div style={{ padding: "var(--space-3)", borderTop: "1px solid var(--border-subtle)" }}>
        <button style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", padding: "var(--space-2) var(--space-3)", width: "100%", background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: "0.875rem", borderRadius: "var(--radius-md)" }}>
          <span>🚪</span>
          {!collapsed && "Log Out"}
        </button>
      </div>
    </aside>
  );
}
