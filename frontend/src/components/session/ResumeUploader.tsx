"use client";
import React, { useState } from "react";

interface ResumeUploaderProps {
  onFileSelect: (file: File) => void;
  selectedFile: File | null;
}

export default function ResumeUploader({ onFileSelect, selectedFile }: ResumeUploaderProps) {
  const [dragActive, setDragActive] = useState(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file && (file.type === "application/pdf" || file.name.endsWith(".docx"))) onFileSelect(file);
  };

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
      onDragLeave={() => setDragActive(false)}
      onDrop={handleDrop}
      onClick={() => document.getElementById("resumeFileInput")?.click()}
      style={{
        border: `2px dashed ${selectedFile ? "var(--success)" : dragActive ? "var(--accent-500)" : "var(--border-default)"}`,
        borderRadius: "var(--radius-xl)", padding: "var(--space-12)", textAlign: "center", cursor: "pointer",
        background: selectedFile ? "var(--success-bg)" : dragActive ? "rgba(99,102,241,0.03)" : "var(--bg-input)",
        transition: "all 0.2s ease",
      }}
    >
      <input id="resumeFileInput" type="file" accept=".pdf,.doc,.docx" style={{ display: "none" }} onChange={(e) => e.target.files?.[0] && onFileSelect(e.target.files[0])} />
      {selectedFile ? (
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-4)", justifyContent: "center" }}>
          <span style={{ fontSize: "2rem" }}>📄</span>
          <div style={{ textAlign: "left" }}>
            <div style={{ fontWeight: 600 }}>{selectedFile.name}</div>
            <div style={{ fontSize: "0.8125rem", color: "var(--text-muted)" }}>{(selectedFile.size / 1024).toFixed(1)} KB</div>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={(e) => { e.stopPropagation(); onFileSelect(null as unknown as File); }}>✕</button>
        </div>
      ) : (
        <>
          <div style={{ fontSize: "3rem", marginBottom: "var(--space-3)" }}>📁</div>
          <p style={{ color: "var(--text-secondary)" }}><strong>Drag & drop</strong> your resume here, or <span style={{ color: "var(--accent-400)" }}>browse files</span></p>
          <p style={{ fontSize: "0.8125rem", color: "var(--text-muted)", marginTop: "var(--space-2)" }}>Supports PDF, DOC, DOCX (Max 5MB)</p>
        </>
      )}
    </div>
  );
}
