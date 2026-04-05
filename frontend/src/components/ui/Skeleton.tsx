import React from "react";

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: string;
  count?: number;
}

export default function Skeleton({ width = "100%", height = 20, borderRadius = "var(--radius-md)", count = 1 }: SkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          style={{
            width, height, borderRadius, background: "var(--bg-elevated)",
            animation: "pulse 1.5s ease-in-out infinite", marginBottom: count > 1 ? "var(--space-2)" : 0,
          }}
        />
      ))}
    </>
  );
}
