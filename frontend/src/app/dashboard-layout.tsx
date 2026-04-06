"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import ThemeToggle from "@/components/ThemeToggle";
import styles from "./dashboard-layout.module.css";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: "📊" },
  { href: "/session/new", label: "New Session", icon: "➕" },
  { href: "/sessions", label: "My Sessions", icon: "📋" },
  { href: "/profile", label: "Profile", icon: "👤" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const getInitials = (name: string) => {
    return name?.split(" ").map(n => n[0]).join("").toUpperCase() || "?";
  };

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  return (
    <div className={styles.layout}>
      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : styles.sidebarClosed}`}>
        <div className={styles.sidebarHeader}>
          <Link href="/" className={styles.logo}>
            <span className={styles.logoIcon}>🚀</span>
            {sidebarOpen && <span className={styles.logoText}>InterviewPilot</span>}
          </Link>
          <button
            className={styles.sidebarToggle}
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? "◀" : "▶"}
          </button>
        </div>

        <nav className={styles.sidebarNav}>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.navItem} ${pathname === item.href ? styles.navItemActive : ""}`}
            >
              <span className={styles.navIcon}>{item.icon}</span>
              {sidebarOpen && <span className={styles.navLabel}>{item.label}</span>}
            </Link>
          ))}
        </nav>

        <div className={styles.sidebarFooter}>
          <button onClick={handleLogout} className={styles.navItem} style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer' }}>
            <span className={styles.navIcon}>🚪</span>
            {sidebarOpen && <span className={styles.navLabel}>Log Out</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={styles.mainContent}>
        <header className={styles.topBar}>
          <div className={styles.breadcrumb}>
            <span className={styles.breadcrumbItem}>InterviewPilot</span>
            <span className={styles.breadcrumbSep}>/</span>
            <span className={styles.breadcrumbCurrent}>
              {pathname === "/session/resume-scan" ? "Resume Optimizer" :
               pathname === "/session/technical-practice" ? "Technical Practice" :
               pathname.includes("/report") ? "Interview Report" :
               navItems.find(i => i.href === pathname)?.label || "Session"}
            </span>
          </div>
          <div className={styles.topBarActions}>
            <ThemeToggle />
            <div className={styles.userAvatar}>{getInitials(user?.fullName || "User")}</div>
          </div>
        </header>
        <div className={styles.contentArea}>
          {children}
        </div>
      </main>
    </div>
  );
}
