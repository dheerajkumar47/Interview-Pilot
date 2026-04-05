import React from "react";
import { cn } from "@/lib/utils";

interface BadgeProps {
  variant?: "primary" | "success" | "warning" | "error" | "info";
  children: React.ReactNode;
  className?: string;
}

export default function Badge({ variant = "primary", children, className }: BadgeProps) {
  return <span className={cn(`badge badge-${variant}`, className)}>{children}</span>;
}
