"use client";
import React, { useRef, useEffect, useState } from "react";
import type { ChatMessage, AgentConfig } from "@/types";
import { formatTime } from "@/lib/utils";

interface ChatInterfaceProps {
  messages: ChatMessage[];
  isTyping: boolean;
  agent: AgentConfig;
  onSend: (message: string) => void;
  disabled?: boolean;
}

export default function ChatInterface({ messages, isTyping, agent, onSend, disabled }: ChatInterfaceProps) {
  const [input, setInput] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, isTyping]);

  const handleSend = () => { if (input.trim() && !isTyping) { onSend(input.trim()); setInput(""); } };
  const handleKey = (e: React.KeyboardEvent) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "var(--bg-secondary)", borderRadius: "var(--radius-lg)", border: "1px solid var(--border-subtle)", overflow: "hidden" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "var(--space-4) var(--space-6)", borderBottom: "1px solid var(--border-subtle)", background: "var(--bg-tertiary)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
          <div style={{ width: 42, height: 42, borderRadius: "var(--radius-md)", background: `linear-gradient(135deg, ${agent.color}, ${agent.color}cc)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.25rem" }}>{agent.icon}</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: "1rem" }}>{agent.name}</div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{isTyping ? "Typing..." : "● Online"}</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: "var(--space-2)" }}>
          <button className="btn btn-ghost btn-sm">💡 Hint</button>
          <button className="btn btn-ghost btn-sm">⏭️ Skip</button>
          <button className="btn btn-secondary btn-sm">End Stage</button>
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: "var(--space-6)", display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
        {messages.map((msg) => (
          <div key={msg.id} style={{ display: "flex", gap: "var(--space-3)", maxWidth: "80%", alignSelf: msg.role === "user" ? "flex-end" : "flex-start", flexDirection: msg.role === "user" ? "row-reverse" : "row" }}>
            <div style={{ width: 34, height: 34, borderRadius: "var(--radius-sm)", background: msg.role === "ai" ? `linear-gradient(135deg, ${agent.color}, ${agent.color}cc)` : "linear-gradient(135deg, #10b981, #34d399)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: msg.role === "ai" ? "0.9375rem" : "0.625rem", fontWeight: 700, color: "#fff", flexShrink: 0 }}>
              {msg.role === "ai" ? agent.icon : "You"}
            </div>
            <div style={{ padding: "var(--space-3) var(--space-4)", borderRadius: "var(--radius-lg)", background: msg.role === "ai" ? "var(--bg-tertiary)" : "rgba(99,102,241,0.12)", border: `1px solid ${msg.role === "ai" ? "var(--border-subtle)" : "rgba(99,102,241,0.2)"}`, lineHeight: 1.65, fontSize: "0.9375rem", whiteSpace: "pre-wrap" }}>
              {msg.content}
              <div style={{ fontSize: "0.6875rem", color: "var(--text-muted)", marginTop: 4, textAlign: "right" }}>{formatTime(msg.timestamp)}</div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div style={{ display: "flex", gap: "var(--space-3)", alignSelf: "flex-start" }}>
            <div style={{ width: 34, height: 34, borderRadius: "var(--radius-sm)", background: `linear-gradient(135deg, ${agent.color}, ${agent.color}cc)`, display: "flex", alignItems: "center", justifyContent: "center" }}>{agent.icon}</div>
            <div style={{ padding: "var(--space-3) var(--space-4)", borderRadius: "var(--radius-lg)", background: "var(--bg-tertiary)", border: "1px solid var(--border-subtle)" }}>
              <div style={{ display: "flex", gap: 4 }}>
                {[0, 1, 2].map((i) => <span key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--text-muted)", animation: `pulse 1.4s infinite`, animationDelay: `${i * 0.2}s` }} />)}
              </div>
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Input */}
      <div style={{ padding: "var(--space-4) var(--space-6)", borderTop: "1px solid var(--border-subtle)", background: "var(--bg-tertiary)" }}>
        <div style={{ display: "flex", gap: "var(--space-3)", alignItems: "flex-end" }}>
          <textarea
            style={{ flex: 1, padding: "var(--space-3) var(--space-4)", background: "var(--bg-input)", border: "1px solid var(--border-default)", borderRadius: "var(--radius-lg)", color: "var(--text-primary)", fontFamily: "var(--font-sans)", fontSize: "0.9375rem", resize: "none", outline: "none", maxHeight: 120, lineHeight: 1.5 }}
            placeholder={`Type your response to ${agent.name}...`}
            value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKey} rows={1} disabled={disabled || isTyping}
          />
          <button onClick={handleSend} disabled={!input.trim() || isTyping || disabled} style={{ width: 44, height: 44, background: "var(--accent-gradient)", border: "none", borderRadius: "var(--radius-md)", color: "#fff", cursor: "pointer", fontSize: "1.125rem", flexShrink: 0, opacity: !input.trim() ? 0.4 : 1 }}>➤</button>
        </div>
        <p style={{ fontSize: "0.6875rem", color: "var(--text-muted)", marginTop: "var(--space-2)", textAlign: "center" }}>Press Enter to send, Shift+Enter for new line</p>
      </div>
    </div>
  );
}
