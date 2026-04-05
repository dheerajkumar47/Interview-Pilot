"use client";
import React, { ReactNode, useState } from "react";

interface TooltipProps {
  content: string;
  children: ReactNode;
}

export default function Tooltip({ content, children }: TooltipProps) {
  const [show, setShow] = useState(false);

  return (
    <div
      style={{ position: "relative", display: "inline-block" }}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      {show && (
        <div
          style={{
            position: "absolute", bottom: "calc(100% + 8px)", left: "50%", transform: "translateX(-50%)",
            background: "var(--bg-elevated)", border: "1px solid var(--border-default)", borderRadius: "var(--radius-md)",
            padding: "var(--space-2) var(--space-3)", fontSize: "0.75rem", color: "var(--text-secondary)",
            whiteSpace: "nowrap", zIndex: 50, animation: "fadeIn 0.15s ease-out",
          }}
        >
          {content}
        </div>
      )}
    </div>
  );
}
