"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import styles from "./dashboard.module.css";

const statusLabels: Record<string, { label: string; cls: string }> = {
  completed: { label: "Completed", cls: "badge-success" },
  in_progress: { label: "In Progress", cls: "badge-primary" },
  resume_analyzed: { label: "Resume Analyzed", cls: "badge-warning" },
  created: { label: "Created", cls: "badge-primary" },
};

export default function DashboardPage() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      const fetchSessions = async () => {
        if (!supabase) {
          setLoading(false);
          return;
        }
        const { data, error } = await supabase
          .from('sessions')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        
        if (!error && data) {
          // 🛡️ Filter out junk and practice sessions
          const filtered = data.filter((s: any) => 
            s.session_mode !== 'technical_only' && 
            s.session_mode !== 'resume_only' &&
            s.job_title !== 'Technical Practice' &&
            s.job_title !== 'Practice Simulation'
          );
          setSessions(filtered);
        }
        setLoading(false);
      };
      
      fetchSessions();
    }
  }, [user]);

  const avgScore = sessions.length ? Math.round(sessions.reduce((acc, s) => acc + (s.overall_score || 0), 0) / sessions.length) : 0;
  const completedCount = sessions.filter(s => s.status === 'completed').length;
  const bestScore = sessions.reduce((max, s) => Math.max(max, s.overall_score || 0), 0);

  return (
    <div className={styles.dashboard}>
      {/* Welcome */}
      <div className={styles.welcome}>
        <div>
          <h1 className={styles.welcomeTitle}>Welcome back! 👋</h1>
          <p className={styles.welcomeDesc}>Ready to practice for your next interview?</p>
        </div>
        <Link href="/session/new" className="btn btn-primary btn-lg">
          ➕ New Interview Session
        </Link>
      </div>

      {/* Stats */}
      <div className={styles.statsGrid}>
        <div className={`${styles.statCard} glass-card`}>
          <div className={styles.statIcon} style={{ background: 'linear-gradient(135deg, #6366f1, #818cf8)' }}>📋</div>
          <div className={styles.statInfo}>
            <div className={styles.statValue}>{sessions.length}</div>
            <div className={styles.statLabel}>Total Sessions</div>
          </div>
        </div>
        <div className={`${styles.statCard} glass-card`}>
          <div className={styles.statIcon} style={{ background: 'linear-gradient(135deg, #10b981, #34d399)' }}>📈</div>
          <div className={styles.statInfo}>
            <div className={styles.statValue}>{avgScore}%</div>
            <div className={styles.statLabel}>Avg Score</div>
          </div>
        </div>
        <div className={`${styles.statCard} glass-card`}>
          <div className={styles.statIcon} style={{ background: 'linear-gradient(135deg, #f97316, #fb923c)' }}>🎯</div>
          <div className={styles.statInfo}>
            <div className={styles.statValue}>{completedCount}</div>
            <div className={styles.statLabel}>Completed</div>
          </div>
        </div>
        <div className={`${styles.statCard} glass-card`}>
          <div className={styles.statIcon} style={{ background: 'linear-gradient(135deg, #ec4899, #f472b6)' }}>🏆</div>
          <div className={styles.statInfo}>
            <div className={styles.statValue}>{bestScore}</div>
            <div className={styles.statLabel}>Best Score</div>
          </div>
        </div>
      </div>

      {/* Quick Start */}
      <div className={styles.quickStartSection}>
        <h2 className={styles.sectionTitle}>Quick Start</h2>
        <div className={styles.quickStartGrid}>
          <Link href="/session/new" className={`${styles.quickCard} glass-card`}>
            <div className={styles.quickIcon}>🚀</div>
            <h3 className={styles.quickTitle}>Full Interview Simulation</h3>
            <p className={styles.quickDesc}>Complete pipeline — Resume → Technical → Knowledge → HR</p>
          </Link>
          <Link href="/session/resume-scan" className={`${styles.quickCard} glass-card`}>
            <div className={styles.quickIcon}>📄</div>
            <h3 className={styles.quickTitle}>Resume Review Only</h3>
            <p className={styles.quickDesc}>Get your resume scored and optimized for a specific JD</p>
          </Link>
          <Link href="/session/technical-practice" className={`${styles.quickCard} glass-card`}>
            <div className={styles.quickIcon}>💻</div>
            <h3 className={styles.quickTitle}>Technical Practice</h3>
            <p className={styles.quickDesc}>Coding challenges and system design questions</p>
          </Link>
        </div>
      </div>

      {/* Session History */}
      <div className={styles.historySection}>
        <h2 className={styles.sectionTitle}>Recent Sessions</h2>
        <div className={styles.sessionsTable}>
          <div className={styles.tableHeader}>
            <span>Company / Role</span>
            <span>Status</span>
            <span>Score</span>
            <span>Date</span>
            <span>Action</span>
          </div>
          {loading ? (
             <div style={{ padding: '2rem', textAlign: 'center' }}>Loading sessions...</div>
          ) : sessions.length === 0 ? (
             <div style={{ padding: '2rem', textAlign: 'center' }}>No sessions yet. Create one!</div>
          ) : sessions.map((session) => (
             <div key={session.id} className={styles.tableRow}>
               <div className={styles.sessionInfo}>
                 <span className={styles.sessionCompany}>{session.company_name}</span>
                 <span className={styles.sessionRole}>{session.job_title}</span>
               </div>
               <span className={`badge ${statusLabels[session.status]?.cls || 'badge-primary'}`}>
                 {statusLabels[session.status]?.label || session.status}
               </span>
               <span className={styles.sessionScore}>
                 {session.overall_score !== null && session.overall_score !== undefined ? `${session.overall_score}%` : "—"}
               </span>
               <span className={styles.sessionDate}>{new Date(session.created_at).toLocaleDateString()}</span>
               <Link href={`/session/${session.id}`} className="btn btn-ghost btn-sm">
                 View →
               </Link>
             </div>
          ))}
        </div>
      </div>
    </div>
  );
}
