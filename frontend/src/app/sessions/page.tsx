"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { getSocket } from "@/lib/socket";
import styles from "./sessions.module.css";

const statusColors: Record<string, string> = {
  completed: "#10b981",
  report: "#6366f1",
  hr: "#ec4899",
  technical: "#f97316",
  knowledge: "#10b981",
  initial: "#3b82f6",
  resume: "#6366f1",
  created: "#6b7280",
};

const statusLabel: Record<string, string> = {
  completed: "Completed", report: "Final Report",
  hr: "HR Round", technical: "Technical", knowledge: "Knowledge",
  initial: "Assessment", resume: "Resume Stage", created: "Created",
};

export default function SessionsPage() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchSessions = async () => {
    if (!supabase || !user) { setLoading(false); return; }
    const { data, error } = await supabase
      .from('sessions').select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    if (!error && data) setSessions(data);
    setLoading(false);
  };

  useEffect(() => { if (user) fetchSessions(); }, [user]);

  const handleDelete = async (sessionId: string) => {
    if (!confirm("Delete this session? This cannot be undone.")) return;
    setDeleting(sessionId);
    
    // Use socket to delete (syncs backend memory + DB)
    const socket = getSocket();
    if (socket) {
      socket.emit("session:delete", { sessionId });
      socket.once("session:deleted", () => {
        setSessions(prev => prev.filter(s => s.id !== sessionId));
        setDeleting(null);
      });
    } else {
      // Fallback: direct supabase delete
      if (supabase) await supabase.from('sessions').delete().eq('id', sessionId);
      setSessions(prev => prev.filter(s => s.id !== sessionId));
      setDeleting(null);
    }
  };

  return (
    <div className={styles.sessionsWrapper}>
      <header className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>My Interview Sessions</h1>
          <p className={styles.pageDesc}>View and manage all your past and current interview practice sessions.</p>
        </div>
        <Link href="/session/new" className="btn btn-primary">➕ New Session</Link>
      </header>

      {loading ? (
        <div style={{ padding: '4rem', textAlign: 'center' }}>
          <span className="spinner"></span>
          <p style={{ marginTop: 16 }}>Loading your sessions...</p>
        </div>
      ) : sessions.length === 0 ? (
        <div className="glass-card" style={{ padding: '4rem', textAlign: 'center' }}>
          <h3>No sessions found</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>You haven't started any interviews yet. Ready to begin?</p>
          <Link href="/session/new" className="btn btn-primary">Start Your First Interview</Link>
        </div>
      ) : (
        <div className={styles.sessionsGrid}>
          {sessions.map((session) => {
            const color = statusColors[session.status] || "#6b7280";
            const label = statusLabel[session.status] || session.status;
            const matchScore = session.match_score || session.resume_analysis?.matchScore || null;
            const overallScore = session.overall_score || 0;
            const isDone = session.status === 'completed' || session.status === 'report';

            return (
              <div key={session.id} className={`${styles.sessionCard} glass-card`}>
                <div className={styles.cardHeader}>
                  <div>
                    <h3 className={styles.sessionCompany}>{session.company_name}</h3>
                    <p className={styles.sessionRole}>{session.job_title}</p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span className="badge" style={{ background: `${color}22`, color, border: `1px solid ${color}44` }}>
                      {label}
                    </span>
                    <button
                      onClick={() => handleDelete(session.id)}
                      disabled={deleting === session.id}
                      title="Delete session"
                      style={{
                        background: 'none', border: '1px solid var(--error, #ef4444)',
                        borderRadius: 8, cursor: 'pointer', padding: '4px 8px',
                        color: 'var(--error, #ef4444)', fontSize: 14, opacity: deleting === session.id ? 0.5 : 1
                      }}
                    >
                      {deleting === session.id ? '...' : '🗑️'}
                    </button>
                  </div>
                </div>

                <div className={styles.cardStats}>
                  <div className={styles.cardStat}>
                    <span className={styles.statLabel}>Match Score</span>
                    <span className={styles.statValue} style={{ color: matchScore ? '#10b981' : undefined }}>
                      {matchScore ? `${matchScore}%` : '—'}
                    </span>
                  </div>
                  <div className={styles.cardStat}>
                    <span className={styles.statLabel}>Interview Score</span>
                    <span className={styles.statValue} style={{ color: isDone || overallScore > 0 ? '#6366f1' : undefined }}>
                      {isDone || overallScore > 0 ? `${overallScore}%` : 'Pending'}
                    </span>
                  </div>
                </div>

                <div className={styles.cardFooter}>
                  <span className={styles.cardDate}>
                    {new Date(session.created_at).toLocaleDateString()}
                  </span>
                  {isDone ? (
                    <Link href={`/session/${session.id}`} className="btn btn-primary btn-sm">
                      🔍 View Session
                    </Link>
                  ) : (
                    <Link href={`/session/${session.id}`} className="btn btn-secondary btn-sm">
                      Continue →
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
