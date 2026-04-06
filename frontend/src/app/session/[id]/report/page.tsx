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
    // 🛡️ Guard against null client or missing ID
    if (!supabase || !id) { 
      setLoading(false); 
      return; 
    }

    const fetchSession = async () => {
      try {
        // 🚨 Final defensive check
        if (!supabase) return;

        const { data, error } = await supabase
          .from('sessions')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        if (data) setSession(data);
      } catch (err) {
        console.error("❌ [REPORT FETCH ERROR]:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, [id]);

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh', flexDirection: 'column', gap: 24 }}>
      <span className="spinner" style={{ width: 40, height: 40, borderWidth: 4 }} />
      <p style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>Analyzing your performance...</p>
    </div>
  );

  if (!session) return (
    <div style={{ textAlign: 'center', padding: '6rem 2rem' }}>
      <div style={{ fontSize: 64, marginBottom: 24 }}>📊</div>
      <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: 16 }}>Report not found</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: 32 }}>We couldn&apos;t retrieve the analysis for this session.</p>
      <Link href="/sessions" className="btn btn-primary btn-lg">Back to My Sessions</Link>
    </div>
  );

  const s = session.scores || {};
  
  // 🧮 Frontend Fallback Calculation (matches backend logic)
  const resumeScore = session.match_score || session.resume_analysis?.matchScore || 0;
  const initialScore = s.initial || 0;
  const technicalScore = s.technical || 0;
  const knowledgeScore = s.knowledge || 0;
  const hrScore = s.hr || 0;

  const calculatedOverall = Math.round(
    (resumeScore * 0.20) + 
    (initialScore * 0.20) + 
    (technicalScore * 0.40) + 
    (knowledgeScore * 0.10) + 
    (hrScore * 0.10)
  );

  const overallScore = session.overall_score || calculatedOverall;
  const grade = getGrade(overallScore);
  const resumeAnalysis = session.resume_analysis || {};

  return (
    <div className={styles.centerWrapper}>
      <div className={styles.reportPage}>
        {/* Hero Header */}
        <div className={styles.reportHero}>
          <div className={styles.heroContent}>
            <div style={{ flex: 1 }}>
              <h1 className={styles.companyName}>{session.company_name || "Target Company"}</h1>
              <p className={styles.jobTitle}>{session.job_title}</p>
              <p className={styles.reportDate}>
                <span>📅</span> {new Date(session.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
            <div className={styles.gradeBlock}>
              <ScoreRing score={overallScore} color={grade.color} size={110} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <div className={styles.gradeBadge} style={{ background: `${grade.color}20`, color: grade.color, border: `1px solid ${grade.color}40` }}>
                  GRADE: {grade.grade}
                </div>
                <p style={{ color: grade.color, fontWeight: 700, margin: 0, fontSize: '0.9rem' }}>{grade.label}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Score Breakdown */}
        <div className={styles.section}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 className={styles.sectionTitle}>Performance Analytics</h2>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 500, background: 'rgba(255,255,255,0.05)', padding: '4px 12px', borderRadius: 20 }}>
              Weighted Metrics
            </span>
          </div>
          <div className={styles.scoreGrid}>
            {Object.entries(STAGE_WEIGHTS).map(([key, meta]) => {
              const stageScore = key === 'resume' ? resumeScore : (s[key] || 0);
              return (
                <div key={key} className={styles.scoreCard}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                    <span style={{ fontSize: '1.5rem', filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.2))' }}>{meta.icon}</span>
                    <span style={{ fontSize: 10, fontWeight: 800, opacity: 0.5, letterSpacing: '0.1em' }}>
                      {meta.weight}%
                    </span>
                  </div>
                  <ScoreRing score={stageScore} color={meta.color} size={84} />
                  <p className={styles.scoreLabel}>{meta.label}</p>
                  
                  {/* Micro Progress Bar */}
                  <div style={{ width: '100%', height: 4, background: 'rgba(255,255,255,0.05)', borderRadius: 10, marginTop: 4, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${stageScore}%`, background: meta.color, boxShadow: `0 0 10px ${meta.color}50` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Resume Analysis Summary */}
        {resumeAnalysis && Object.keys(resumeAnalysis).length > 0 && (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>🔍 Resume & ATS Deep Dive</h2>
            <div className={styles.analysisRow}>
              <div className="glass-card" style={{ padding: 32, flex: 1, background: 'rgba(255,255,255,0.02)', borderRadius: 24, border: '1px solid rgba(255,255,255,0.05)' }}>
                <h3 style={{ marginBottom: 16, fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ opacity: 0.7 }}>📝</span> Strategic Feedback
                </h3>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '1rem' }}>
                  {resumeAnalysis.overallFeedback || "The candidate presents a structured profile. Further emphasis on specific technical outcomes would strengthen the application."}
                </p>
              </div>
              <div className="glass-card" style={{ padding: 32, minWidth: 220, background: 'rgba(255,255,255,0.02)', borderRadius: 24, border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 24 }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 36, fontWeight: 900, color: '#6366f1', letterSpacing: '-0.02em' }}>{resumeScore}%</div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginTop: 4 }}>Role Match</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 36, fontWeight: 900, color: '#10b981', letterSpacing: '-0.02em' }}>{resumeAnalysis.atsScore || 0}%</div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginTop: 4 }}>ATS Accuracy</div>
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
              {resumeAnalysis.gaps?.length > 0 && (
                <div className={styles.gapsSection}>
                  <h3>⚠️ Identified Skill Gaps</h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 12 }}>
                    {resumeAnalysis.gaps.map((gap: any, i: number) => (
                      <span key={i} style={{
                        background: 'rgba(239, 68, 68, 0.1)', color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.2)',
                        padding: '6px 16px', borderRadius: 12, fontSize: '0.85rem', fontWeight: 600
                      }}>{gap.category || gap}</span>
                    ))}
                  </div>
                </div>
              )}

              {resumeAnalysis.suggestions?.length > 0 && (
                <div className={styles.suggestionsSection}>
                  <h3>💡 Strategic Improvements</h3>
                  <ul style={{ listStyle: 'none', padding: 0, margin: '12px 0 0', display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {resumeAnalysis.suggestions.slice(0, 5).map((sug: any, i: number) => (
                      <li key={i} style={{ color: 'var(--text-secondary)', fontSize: '0.925rem', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                        <span style={{ color: '#fbbf24', marginTop: 2 }}>⚡</span>
                        <span>
                          <strong style={{ color: '#fff' }}>{sug.type?.replace('_', ' ')}:</strong> {sug.description || sug}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Hiring Recommendation */}
        <div className={styles.section}>
          <div className={styles.recommendation} style={{ borderLeft: `8px solid ${grade.color}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 48, flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: 320 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                  <div style={{ width: 12, height: 12, borderRadius: '50%', background: grade.color, boxShadow: `0 0 15px ${grade.color}` }}></div>
                  <h2 style={{ fontSize: '1.75rem', fontWeight: 900, margin: 0, letterSpacing: '-0.03em' }}>Executive Summary</h2>
                </div>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.9, fontSize: '1.1rem', margin: 0 }}>
                  {overallScore >= 80
                    ? `Exceptional candidate with strong technical proficiency and cultural alignment. Highly recommended for immediate hiring.`
                    : overallScore >= 65
                    ? `Strong foundational potential. Demonstrates clear competence with minor areas for growth. Recommend proceeding with caution or additional screening.`
                    : `Currently below the threshold for this role. Significant skill gaps identified in core areas. Recommend further preparation and resubmission at a later date.`}
                </p>
              </div>
              <div style={{ textAlign: 'center', background: 'rgba(255,255,255,0.03)', padding: '32px 48px', borderRadius: 28, border: '1px solid rgba(255,255,255,0.05)', minWidth: 200 }}>
                <div style={{ fontSize: 72, marginBottom: 12, filter: 'drop-shadow(0 0 15px rgba(255,255,255,0.1))' }}>
                  {overallScore >= 80 ? '🏆' : overallScore >= 65 ? '⚖️' : '🚀'}
                </div>
                <div style={{ fontSize: 13, fontWeight: 900, color: grade.color, textTransform: 'uppercase', letterSpacing: '0.15em' }}>
                  {overallScore >= 80 ? 'Highly Recommended' : overallScore >= 65 ? 'Consideration' : 'Keep Training'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className={styles.actions}>
          <Link href="/session/new" className="btn btn-primary btn-lg" style={{ borderRadius: 16, padding: '16px 32px' }}>Start New Session</Link>
          <Link href="/sessions" className="btn btn-secondary btn-lg" style={{ borderRadius: 16, padding: '16px 32px' }}>My Results Archive</Link>
          <Link href={`/session/${id}`} className="btn btn-ghost btn-lg" style={{ borderRadius: 16 }}>Back to Summary</Link>
        </div>
      </div>
    </div>
  );
}

