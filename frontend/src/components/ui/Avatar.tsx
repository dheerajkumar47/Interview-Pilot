import React from "react";

interface AvatarProps {
  name: string;
  src?: string;
  size?: number;
}

export default function Avatar({ name, src, size = 36 }: AvatarProps) {
  const initials = name.split(" ").map((w) => w[0]).join("").substring(0, 2).toUpperCase();

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        style={{ width: size, height: size, borderRadius: "var(--radius-md)", objectFit: "cover" }}
      />
    );
  }

  return (
    <div
      style={{
        width: size, height: size, borderRadius: "var(--radius-md)", display: "flex",
        alignItems: "center", justifyContent: "center", fontSize: size * 0.35, fontWeight: 700,
        background: "var(--accent-gradient)", color: "#fff",
      }}
    >
      {initials}
    </div>
  );
}
