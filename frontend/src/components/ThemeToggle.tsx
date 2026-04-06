"use client";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  useEffect(() => {
    // 🔍 Check saved preference
    const saved = localStorage.getItem("theme") as "light" | "dark";
    if (saved) {
      setTheme(saved);
      document.documentElement.setAttribute("data-theme", saved);
    }
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
  };

  return (
    <button
      onClick={toggleTheme}
      className="btn btn-ghost btn-icon"
      title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
      style={{ fontSize: "1.2rem" }}
    >
      {theme === "dark" ? "🌙" : "☀️"}
    </button>
  );
}
