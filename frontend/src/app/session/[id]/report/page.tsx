"use client";
import { useEffect, useState, use } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import styles from "./report.module.css";

const STAGE_WEIGHTS: Record<string, { label: string; icon: string; weight: number; color: string }> = {
  resume:    { label: "Resume Match", icon: "🔍", weight: 20, color: "#6366f1" },
  initial:   { label: "Initial Assessment", icon: "🎯", weight: 20, color: "#3b82f6" },
  technical: { label: "Technical Interview", icon: "💻", weight: 40, color: "#f97316" },
  knowledge: { label: "Knowledge Round", icon: "📚", weight: 10, color: "#10b981" },
  hr:        { label: "HR & Behavioral", icon: "🤝", weight: 10, color: "#ec4899" },
};

function ScoreRing({ score, color, size = 80 }: { score: number; color: string; size?: number }) {
  const r = (size / 2) - 8;
  const circ = 2 * Math.PI * r;
  const offset = circ - (circ * Math.min(score, 100)) / 100;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="6" />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth="6"
        strokeDasharray={circ} strokeDashoffset={offset}
        strokeLinecap="round" style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%', transition: 'stroke-dashoffset 1s ease' }} />
      <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle"
        fill="white" fontSize={size * 0.22} fontWeight="700">{score}%</text>
    </svg>
  );
}

function getGrade(score: number) {
  if (score >= 85) return { grade: "A+", label: "Outstanding", color: "#10b981" };
  if (score >= 75) return { grade: "A", label: "Excellent", color: "#6366f1" };
  if (score >= 65) return { grade: "B+", label: "Good", color: "#3b82f6" };
  if (score >= 55) return { grade: "B", label: "Above Average", color: "#f59e0b" };
  if (score >= 45) return { grade: "C", label: "Needs Improvement", color: "#f97316" };
  return { grade: "D", label: "Below Expectations", color: "#ef4444" };
}

export default function ReportPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) { setLoading(false); return; }
    supabase.from('sessions').select('*').eq('id', id).single()
      .then(({ data }) => { setSession(data); setLoading(false); });
  }, [id]);

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh', flexDirection: 'column', gap: 16 }}>
      <span className="spinner" />
      <p>Loading your report...</p>
    </div>
  );

  if (!session) return (
    <div style={{ textAlign: 'center', padding: '4rem' }}>
      <h2>📊 Report not found</h2>
      <Link href="/sessions" className="btn btn-primary" style={{ marginTop: 24 }}>My Sessions</Link>
    </div>
  );

  const scores = session.scores || {};
  const overallScore = session.overall_score || scores.overall || 0;
  const matchScore = session.match_score || session.resume_analysis?.matchScore || 0;
  const grade = getGrade(overallScore);
  const resumeAnalysis = session.resume_analysis || {};
  const conversationHistory = session.conversation_history || {};

  return (
    <div className={styles.reportPage}>
      {/* Hero Header */}
      <div className={styles.reportHero}>
        <div className={styles.heroContent}>
          <div>
            <h1 className={styles.companyName}>{session.company_name}</h1>
            <p className={styles.jobTitle}>{session.job_title}</p>
            <p className={styles.reportDate}>
              Interview Date: {new Date(session.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <div className={styles.gradeBlock}>
            <ScoreRing score={overallScore} color={grade.color} size={120} />
            <div>
              <div className={styles.gradeBadge} style={{ background: `${grade.color}22`, color: grade.color, border: `1px solid ${grade.color}44` }}>
                Grade: {grade.grade}
              </div>
              <p style={{ color: grade.color, fontWeight: 600, marginTop: 6 }}>{grade.label}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Score Breakdown */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>📊 Score Breakdown (Weighted)</h2>
        <div className={styles.scoreGrid}>
          {Object.entries(STAGE_WEIGHTS).map(([key, meta]) => {
            const stageScore = key === 'resume' ? matchScore : (scores[key] || 0);
            return (
              <div key={key} className={`${styles.scoreCard} glass-card`}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <span style={{ fontSize: 24 }}>{meta.icon}</span>
                  <span style={{ fontSize: 11, background: `${meta.color}18`, padding: '2px 8px', borderRadius: 20, color: meta.color }}>
                    {meta.weight}% weight
                  </span>
                </div>
                <ScoreRing score={stageScore} color={meta.color} size={72} />
                <p className={styles.scoreLabel}>{meta.label}</p>
                <div style={{ height: 4, background: 'var(--border-subtle)', borderRadius: 2, marginTop: 8 }}>
                  <div style={{ height: '100%', width: `${stageScore}%`, background: meta.color, borderRadius: 2, transition: 'width 1s ease' }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Resume Analysis Summary */}
      {resumeAnalysis && Object.keys(resumeAnalysis).length > 0 && (
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>🔍 Resume & ATS Analysis</h2>
          <div className={styles.analysisRow}>
            <div className="glass-card" style={{ padding: 24, flex: 1 }}>
              <h3 style={{ marginBottom: 8, fontSize: '1rem', color: 'var(--text-secondary)' }}>📝 Overall Feedback</h3>
              <p style={{ color: 'var(--text-primary)', lineHeight: 1.7 }}>
                {resumeAnalysis.overallFeedback || "Good overall profile with areas for improvement."}
              </p>
            </div>
            <div className="glass-card" style={{ padding: 24, minWidth: 200 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 32, fontWeight: 800, color: '#6366f1' }}>{matchScore}%</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Role Match</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 32, fontWeight: 800, color: '#10b981' }}>{resumeAnalysis.atsScore || 0}%</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>ATS Score</div>
                </div>
              </div>
            </div>
          </div>

          {resumeAnalysis.gaps?.length > 0 && (
            <div className={styles.gapsSection}>
              <h3>⚠️ Skill Gaps Identified</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
                {resumeAnalysis.gaps.map((gap: any, i: number) => (
                  <span key={i} style={{
                    background: '#ef444418', color: '#ef4444', border: '1px solid #ef444430',
                    padding: '4px 12px', borderRadius: 20, fontSize: 13
                  }}>{gap.category || gap}</span>
                ))}
              </div>
            </div>
          )}

          {resumeAnalysis.suggestions?.length > 0 && (
            <div className={styles.suggestionsSection}>
              <h3>💡 Improvement Tips</h3>
              <ul style={{ marginTop: 8, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {resumeAnalysis.suggestions.slice(0, 5).map((sug: any, i: number) => (
                  <li key={i} style={{ color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    <strong style={{ color: 'var(--text-primary)' }}>{sug.type?.replace('_', ' ')}:</strong> {sug.description || sug}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Hiring Recommendation */}
      <div className={styles.section}>
        <div className={`glass-card ${styles.recommendation}`} style={{ borderLeft: `4px solid ${grade.color}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 24 }}>
            <div>
              <h2 style={{ fontSize: '1.25rem', marginBottom: 8 }}>🎯 Hiring Recommendation</h2>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                {overallScore >= 75
                  ? `Strong candidate for ${session.job_title} at ${session.company_name}. Technical competence and behavioral alignment are well above average. Recommend for next round.`
                  : overallScore >= 55
                  ? `Moderate candidate with good potential. Some skill gaps identified. Consider for second interview with focused technical assessment.`
                  : `Candidate requires further preparation. Recommend revisiting core concepts and practicing more mock interviews before reapplying.`}
              </p>
            </div>
            <div style={{ minWidth: 120, textAlign: 'center' }}>
              <div style={{ fontSize: 48 }}>
                {overallScore >= 75 ? '✅' : overallScore >= 55 ? '⚠️' : '❌'}
              </div>
              <div style={{ fontSize: 13, fontWeight: 600, color: grade.color, marginTop: 4 }}>
                {overallScore >= 75 ? 'Recommended' : overallScore >= 55 ? 'Consider' : 'Not Ready'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className={styles.actions}>
        <Link href="/session/new" className="btn btn-primary">🚀 New Interview</Link>
        <Link href="/sessions" className="btn btn-secondary">📋 My Sessions</Link>
        <Link href={`/session/${id}`} className="btn btn-ghost">← Back to Session</Link>
      </div>
    </div>
  );
}
