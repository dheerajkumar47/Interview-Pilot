"use client";
import React, { ReactNode, useEffect, useRef } from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

export default function Modal({ open, onClose, title, children }: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    if (open) document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      ref={overlayRef}
      style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)",
        display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000,
        animation: "fadeIn 0.2s ease-out",
      }}
      onClick={(e) => e.target === overlayRef.current && onClose()}
    >
      <div
        className="glass-card"
        style={{ maxWidth: 560, width: "90%", padding: "var(--space-6)", animation: "slideUp 0.3s var(--ease-out)" }}
      >
        {title && (
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "var(--space-5)" }}>
            <h2 style={{ fontSize: "1.25rem", fontWeight: 700 }}>{title}</h2>
            <button className="btn btn-ghost btn-sm" onClick={onClose}>✕</button>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
