import React, { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export default function Input({ label, error, className, ...props }: InputProps) {
  return (
    <div className="input-group">
      {label && <label className="input-label">{label}</label>}
      <input className={cn("input", error && "input-error", className)} {...props} />
      {error && <span style={{ fontSize: "0.75rem", color: "var(--error)", marginTop: 4 }}>{error}</span>}
    </div>
  );
}
