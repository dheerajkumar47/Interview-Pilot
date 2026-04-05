"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import styles from "./session.module.css";

type Stage = "resume" | "initial" | "technical" | "knowledge" | "hr" | "report";

interface StageInfo {
  id: Stage;
  label: string;
  icon: string;
  agent: string;
  status: "locked" | "current" | "completed";
  score?: number;
}

export default function SessionPage({ params }: { params: Promise<{ id: string }> }) {
  const [resolvedParams, setResolvedParams] = useState<{ id: string } | null>(null);
  const [sessionData, setSessionData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    params.then(setResolvedParams);
  }, [params]);

  useEffect(() => {
    if (resolvedParams?.id) {
      const fetchSession = async () => {
        // 🚀 Guard Clause: Ignore if we are in the 'new session' creation flow
        if (resolvedParams!.id === "new") {
          setLoading(false);
          return;
        }

        setLoading(true);
        if (!supabase) {
          setError("Supabase not configured");
          setLoading(false);
          return;
        }
        
        try {
          const { data, error: sbError } = await supabase
            .from('sessions')
            .select('*')
            .eq('id', resolvedParams.id);
          
          if (sbError) throw sbError;
          
          if (!data || data.length === 0) {
            setError("Session not found or you don't have access to it.");
            setLoading(false);
            return;
          }
          
          setSessionData(data[0]);
        } catch (err: any) {
          console.error("Fetch session error:", err);
          setError(err.message || "Failed to load session");
        } finally {
          setLoading(false);
        }
      };
      fetchSession();
    }
  }, [resolvedParams]);

  if (loading) {
    return <div className={styles.session} style={{ display: 'flex', justifyContent: 'center', marginTop: '10vh' }}><span className="spinner"></span><p style={{ marginLeft: 12 }}>Loading Session...</p></div>;
  }

  if (error || !sessionData) {
    return (
      <div className={styles.session} style={{ textAlign: 'center', padding: '4rem' }}>
        <h2 style={{ color: 'var(--error)' }}>⚠️ Session not found</h2>
        <p>{error || "We couldn't retrieve this session."}</p>
        <Link href="/dashboard" className="btn btn-primary" style={{ marginTop: 24 }}>Back to Dashboard</Link>
      </div>
    );
  }

  // Extract resume analysis data
  const resumeAnalysis = sessionData.resume_analysis;
  const matchScore = resumeAnalysis?.matchScore || resumeAnalysis?.score || 0;
  const analysisSummary = resumeAnalysis?.summary || resumeAnalysis?.analysis || "";

  // Base stages (we dynamicize their status based on DB)
  const STAGE_ORDER: Stage[] = ["resume", "initial", "technical", "knowledge", "hr", "report"];
  const stageMetadata: Record<Stage, { label: string, icon: string, agent: string }> = {
    resume: { label: "Resume Analysis", icon: "🔍", agent: "Resume Analyst" },
    initial: { label: "Initial Assessment", icon: "🎯", agent: "Knowledge Assessor" },
    technical: { label: "Technical Interview", icon: "💻", agent: "Technical Interviewer" },
    knowledge: { label: "Knowledge Deep Dive", icon: "📚", agent: "Knowledge Assessor" },
    hr: { label: "HR & Behavioral", icon: "🤝", agent: "HR Coach" },
    report: { label: "Final Report", icon: "📊", agent: "All Agents" },
  };

  const currentStatus = sessionData.status === 'created' ? 'resume' : sessionData.status;
  const currentIndex = STAGE_ORDER.indexOf(currentStatus as Stage);

  const stages: StageInfo[] = STAGE_ORDER.map((id, index) => {
    let status: "locked" | "current" | "completed" = "locked";
    if (index < currentIndex) status = "completed";
    else if (index === currentIndex) status = "current";

    // Get score from DB scores object
    const dbScores = sessionData.scores || {};
    const stageScore = id === "resume"
      ? (matchScore || dbScores.resume || 0)
      : (dbScores[id] || 0);

    return {
      id,
      ...stageMetadata[id],
      status,
      score: stageScore > 0 ? stageScore : undefined
    };
  });

  const currentStage = stages.find((s) => s.status === "current") || stages[0];
  const sId = resolvedParams!.id;

  return (
    <div className={styles.session}>
      {/* Session Header */}
      <div className={styles.sessionHeader}>
        <div className={styles.sessionInfo}>
          <span className="badge badge-primary">{sessionData.status.replace('_', ' ')}</span>
          <h1 className={styles.sessionTitle}>{sessionData.job_title} — {sessionData.company_name}</h1>
          <p className={styles.sessionMeta}>
            Experience: {sessionData.experience_required} &bull; Started: {new Date(sessionData.created_at).toLocaleDateString()}
          </p>
        </div>
        <div className={styles.overallProgress}>
          <div className={styles.progressCircle}>
            <svg viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="42" className={styles.progressBg} />
              <circle
                cx="50" cy="50" r="42"
                className={styles.progressFill}
                strokeDasharray={264}
                strokeDashoffset={264 - (264 * Math.min(parseInt(sessionData.overall_score || 0), 100)) / 100}
              />
            </svg>
            <div className={styles.progressValue}>{sessionData.overall_score || 0}%</div>
          </div>
          <span className={styles.progressLabel}>Overall Progress</span>
        </div>
      </div>

      {/* Pipeline */}
      <div className={styles.pipeline}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h2 className={styles.sectionTitle}>Interview Pipeline</h2>
          {matchScore > 0 && (
            <div className="badge badge-success" style={{ padding: '8px 16px' }}>
              Resume Match: {matchScore}%
            </div>
          )}
        </div>
        
        <div className={styles.stagesGrid}>
          {stages.map((stage, i) => (
            <div key={stage.id} className={styles.stageWrapper}>
              {i > 0 && (
                <div className={`${styles.stageConnector} ${stage.status !== "locked" ? styles.stageConnectorActive : ""}`} />
              )}
              <div
                className={`${styles.stageCard} glass-card ${styles[`stage-${stage.status}`]}`}
              >
                <div className={styles.stageIcon}>{stage.icon}</div>
                <h3 className={styles.stageLabel}>{stage.label}</h3>
                <p className={styles.stageAgent}>{stage.agent}</p>
                
                {stage.score !== undefined && stage.score > 0 && (
                  <div className={styles.stageScore}>
                    <span className={styles.scoreValue}>{stage.score}%</span>
                  </div>
                )}
                
                {stage.status === "current" && stage.id !== "report" && (
                  <Link href={`/session/${sId}/${stage.id}`} className="btn btn-primary btn-sm" style={{ marginTop: 12 }}>
                    Continue →
                  </Link>
                )}
                {stage.id === "report" && stage.status === "current" && (
                  <Link href={`/session/${sId}/report`} className="btn btn-primary btn-sm" style={{ marginTop: 12, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}>
                    📊 View Report
                  </Link>
                )}
                {stage.status === "completed" && stage.id !== "report" && (
                  <Link href={`/session/${sId}/${stage.id}`} className="btn btn-ghost btn-sm" style={{ marginTop: 12 }}>
                    Review
                  </Link>
                )}
                {stage.status === "locked" && (
                  <span className={styles.stageLocked}>🔒 Locked</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detailed Analysis Section */}
      {resumeAnalysis && (
        <div className={styles.analysisContainer}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 className={styles.sectionTitle}>📄 Resume Match Analysis</h2>
            <div className={`badge ${
              sessionData.resume_analysis?.shortlistStatus === 'shortlisted' ? 'badge-success' : 
              sessionData.resume_analysis?.shortlistStatus === 'borderline' ? 'badge-warning' : 'badge-error'
            }`} style={{ padding: '8px 16px', fontSize: '0.875rem' }}>
              Status: {sessionData.resume_analysis?.shortlistStatus?.replace('_', ' ') || 'Evaluation'}
            </div>
          </div>

          <div className={`${styles.analysisGrid}`}>
            {/* Scores */}
            <div className="glass-card" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', padding: 0 }}>
              <div className={styles.scoreCard} style={{ borderRight: '1px solid var(--border-subtle)' }}>
                <div className={styles.scoreCircle}>
                  <svg viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="42" className={styles.progressBg} />
                    <circle cx="50" cy="50" r="42" className={styles.progressFill} strokeDasharray={264} strokeDashoffset={264 - (264 * (resumeAnalysis.matchScore || 0)) / 100} />
                  </svg>
                  <div className={styles.progressValue}>{resumeAnalysis.matchScore || 0}%</div>
                </div>
                <span className={styles.scoreLabel}>Role Match Score</span>
              </div>
              <div className={styles.scoreCard}>
                <div className={styles.scoreCircle}>
                  <svg viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="42" className={styles.progressBg} />
                    <circle cx="50" cy="50" r="42" className={styles.progressFill} style={{ stroke: 'var(--info)' }} strokeDasharray={264} strokeDashoffset={264 - (264 * (resumeAnalysis.atsScore || 0)) / 100} />
                  </svg>
                  <div className={styles.progressValue}>{resumeAnalysis.atsScore || 0}%</div>
                </div>
                <span className={styles.scoreLabel}>ATS Compatibility</span>
              </div>
            </div>

            {/* Overview Feedback */}
            <div className="glass-card" style={{ padding: 24 }}>
              <h3 className={styles.sectionHeader} style={{ marginBottom: 12 }}>Overall Feedback</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, fontSize: '0.9375rem' }}>
                {resumeAnalysis.overallFeedback || analysisSummary}
              </p>
            </div>
          </div>

          <div className={styles.analysisGrid}>
            {/* Gaps */}
            <div className={styles.analysisSection}>
              <h3 className={styles.sectionHeader}>⚠️ Identified Gaps</h3>
              <div className={styles.gapsGrid}>
                {resumeAnalysis.gaps?.length > 0 ? (
                  resumeAnalysis.gaps.map((gap: any, i: number) => (
                    <div key={i} className={`${styles.gapCard} ${styles[`gap-${gap.severity || 'low'}`]}`}>
                      <span className={styles.gapCategory}>{gap.category}</span>
                      <p className={styles.gapDesc}>{gap.description}</p>
                    </div>
                  ))
                ) : (
                  <p style={{ color: 'var(--text-muted)' }}>No significant gaps identified.</p>
                )}
              </div>
            </div>

            {/* Suggestions */}
            <div className={styles.analysisSection}>
              <h3 className={styles.sectionHeader}>💡 Optimization Suggestions</h3>
              <div className={styles.suggestionsList}>
                {resumeAnalysis.suggestions?.length > 0 ? (
                  resumeAnalysis.suggestions.map((sug: any, i: number) => (
                    <div key={i} className={styles.suggestionItem}>
                      <span className={styles.suggestionType}>{sug.type?.replace('_', ' ')}</span>
                      <p className={styles.suggestionDesc}>{sug.description}</p>
                    </div>
                  ))
                ) : (
                  <p style={{ color: 'var(--text-muted)' }}>Resume is highly optimized already!</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Active Stage Panel */}
      {currentStage && (
        <div className={styles.activeStage}>
          <h2 className={styles.sectionTitle}>
            Current Stage: {currentStage.icon} {currentStage.label}
          </h2>
          <div className={`${styles.activeCard} glass-card`}>
            <div className={styles.activeInfo}>
              <p className={styles.activeDesc}>
                The <strong>{currentStage.agent}</strong> is ready to interview you.
                This stage includes coding challenges and problem-solving discussions tailored to your job requirements.
              </p>
              <div className={styles.activeExpect}>
                <h4>What to expect:</h4>
                <ul>
                  <li>Live evaluation based on {sessionData.job_title} requirements</li>
                  <li>Real-time question generation and feedback loops</li>
                  <li>Algorithm, architecture & behavioral evaluations</li>
                </ul>
              </div>
            </div>
            <Link href={`/session/${sId}/${currentStage.id}`} className="btn btn-primary btn-lg">
              🚀 Enter {currentStage.label} Room
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
