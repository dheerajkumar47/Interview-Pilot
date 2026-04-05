"use client";
import React, { useState } from "react";
import type { MCQQuestion } from "@/types";

interface MCQPanelProps {
  question: MCQQuestion;
  onAnswer: (answer: string) => void;
}

export default function MCQPanel({ question, onAnswer }: MCQPanelProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!selected) return;
    setSubmitted(true);
    onAnswer(selected);
  };

  return (
    <div className="glass-card" style={{ padding: "var(--space-6)" }}>
      <div style={{ marginBottom: "var(--space-2)", fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
        {question.topic} • {question.difficulty}
      </div>
      <h3 style={{ fontSize: "1.0625rem", fontWeight: 700, marginBottom: "var(--space-5)", lineHeight: 1.6 }}>{question.question}</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
        {question.options.map((opt, i) => {
          const letter = String.fromCharCode(65 + i);
          const isCorrect = submitted && opt === question.correctAnswer;
          const isWrong = submitted && selected === opt && opt !== question.correctAnswer;
          return (
            <button
              key={i}
              onClick={() => !submitted && setSelected(opt)}
              style={{
                display: "flex", alignItems: "center", gap: "var(--space-3)", padding: "var(--space-3) var(--space-4)",
                borderRadius: "var(--radius-md)", border: `1px solid ${isCorrect ? "var(--success)" : isWrong ? "var(--error)" : selected === opt ? "var(--accent-500)" : "var(--border-default)"}`,
                background: isCorrect ? "rgba(16,185,129,0.1)" : isWrong ? "rgba(239,68,68,0.1)" : selected === opt ? "rgba(99,102,241,0.05)" : "transparent",
                cursor: submitted ? "default" : "pointer", textAlign: "left", color: "var(--text-primary)", width: "100%",
              }}
            >
              <span style={{ width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "0.75rem", background: selected === opt ? "var(--accent-gradient)" : "var(--bg-elevated)", color: selected === opt ? "#fff" : "var(--text-muted)", flexShrink: 0 }}>{letter}</span>
              <span style={{ fontSize: "0.9375rem" }}>{opt}</span>
            </button>
          );
        })}
      </div>
      {!submitted ? (
        <button className="btn btn-primary" style={{ marginTop: "var(--space-5)", width: "100%" }} onClick={handleSubmit} disabled={!selected}>Submit Answer</button>
      ) : question.explanation ? (
        <div style={{ marginTop: "var(--space-5)", padding: "var(--space-4)", background: "var(--bg-input)", borderRadius: "var(--radius-md)", fontSize: "0.875rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
          <strong>Explanation:</strong> {question.explanation}
        </div>
      ) : null}
    </div>
  );
}
