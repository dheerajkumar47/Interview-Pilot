"use client";
import React, { useState } from "react";

interface CodeEditorProps {
  language?: string;
  initialCode?: string;
  onSubmit?: (code: string) => void;
}

export default function CodeEditor({ language = "javascript", initialCode = "", onSubmit }: CodeEditorProps) {
  const [code, setCode] = useState(initialCode);

  return (
    <div style={{ border: "1px solid var(--border-default)", borderRadius: "var(--radius-lg)", overflow: "hidden" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "var(--space-2) var(--space-4)", background: "var(--bg-tertiary)", borderBottom: "1px solid var(--border-subtle)" }}>
        <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase" }}>{language}</span>
        <div style={{ display: "flex", gap: "var(--space-2)" }}>
          <button className="btn btn-ghost btn-sm" onClick={() => setCode("")}>Clear</button>
          <button className="btn btn-primary btn-sm" onClick={() => onSubmit?.(code)}>▶ Run</button>
        </div>
      </div>
      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        style={{
          width: "100%", minHeight: 300, padding: "var(--space-4)", background: "#0d0d1a", color: "#e5e5e5", border: "none",
          fontFamily: "'JetBrains Mono', 'Fira Code', monospace", fontSize: "0.875rem", lineHeight: 1.7, resize: "vertical", outline: "none",
          tabSize: 2,
        }}
        placeholder={`// Write your ${language} solution here...\n\nfunction solution() {\n  // your code\n}`}
        spellCheck={false}
      />
    </div>
  );
}
