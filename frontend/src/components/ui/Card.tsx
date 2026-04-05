import React, { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface CardProps {
  children: ReactNode;
  className?: string;
  glass?: boolean;
  hover?: boolean;
  padding?: "sm" | "md" | "lg";
}

export default function Card({ children, className, glass = true, hover = false, padding = "md" }: CardProps) {
  const padMap = { sm: "var(--space-4)", md: "var(--space-6)", lg: "var(--space-8)" };
  return (
    <div
      className={cn(glass ? "glass-card" : undefined, className)}
      style={{ padding: padMap[padding], cursor: hover ? "pointer" : undefined }}
    >
      {children}
    </div>
  );
}
