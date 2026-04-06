"use client";
import { useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import styles from "./resume-scan.module.css";
import Link from "next/link";
import { API_BASE } from "@/lib/api";

function ResumeScanContent() {
  const [jobDescription, setJobDescription] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFileUpload = (file: File) => {
    if (file.type === "application/pdf" || file.name.endsWith(".docx") || file.name.endsWith(".doc")) {
      setResumeFile(file);
      setError(null);
    } else {
      setError("Please upload a PDF or DOCX file");
    }
  };

  const startScan = async () => {
    if (!resumeFile || !jobDescription) {
      setError("Please provide both a Job Description and a Resume.");
      return;
    }

    setIsScanning(true);
    setError(null);
    setAnalysis(null);

    try {
      const formData = new FormData();
      formData.append("resume", resumeFile);
      formData.append("jobDescription", jobDescription);
      formData.append("sessionMode", "resume_only");
      formData.append("jobTitle", "Target Role");

      const response = await fetch(`${API_BASE}/api/resume/upload`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to analyze resume. Please check your connection.");
      
      const data = await response.json();
      if (data.success && data.analysis) {
        setAnalysis(data.analysis);
      } else {
        throw new Error(data.message || "Analysis failed");
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong during the scan.");
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className={styles.resumeScan}>
      <div className={styles.header}>
        <h1 className={styles.title}>ATS Resume Optimizer</h1>
        <p className={styles.subtitle}>Get instant scoring, keyword analysis, and optimization suggestions for your specific target role.</p>
      </div>

      {error && <div className="alert alert-error mb-6">{error}</div>}

      <div className={styles.scanGrid}>
        {/* Left: Input */}
        <div className={styles.inputSection}>
          <div className="glass-card p-6">
            <label className={styles.label}>Target Job Description</label>
            <textarea 
              className={styles.jdTextarea}
              placeholder="Paste the Job Description here... AI needs it to calculate your match score."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
            />
            
            <div className="mt-6">
              <label className={styles.label}>Your Resume</label>
              <div 
                className={`${styles.dropZone} ${dragActive ? styles.dropZoneActive : ""} ${resumeFile ? styles.dropZoneDone : ""}`}
                onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                onDragLeave={() => setDragActive(false)}
                onDrop={(e) => { e.preventDefault(); setDragActive(false); if(e.dataTransfer.files[0]) handleFileUpload(e.dataTransfer.files[0]); }}
                onClick={() => document.getElementById("fileInput")?.click()}
              >
                <input id="fileInput" type="file" hidden onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])} />
                {resumeFile ? (
                  <div>
                    <span style={{ fontSize: '2rem' }}>✅</span>
                    <p><strong>{resumeFile.name}</strong></p>
                    <button className="btn btn-ghost btn-xs text-error" onClick={(e) => { e.stopPropagation(); setResumeFile(null); }}>Remove</button>
                  </div>
                ) : (
                  <div>
                    <span style={{ fontSize: '2rem' }}>📄</span>
                    <p>Drag resume here or <strong>browse</strong></p>
                    <p style={{ fontSize: '0.8rem', opacity: 0.6 }}>PDF, DOCX accepted</p>
                  </div>
                )}
              </div>
            </div>

            <button 
              className="btn btn-primary w-full mt-6 btn-lg"
              disabled={isScanning || !resumeFile || !jobDescription}
              onClick={startScan}
            >
              {isScanning ? <><span className="spinner mr-2"></span> Analyzing...</> : "🚀 Scan My Resume"}
            </button>
          </div>
        </div>

        {/* Right: Results */}
        <div className={styles.resultsSection}>
          {!analysis && !isScanning && (
            <div className="glass-card p-12 text-center opacity-60 flex flex-col items-center justify-center h-full">
              <span style={{ fontSize: '4rem', marginBottom: '1rem' }}>📈</span>
              <h3>Scan Results</h3>
              <p>Upload your JD and Resume to see your ATS score and optimization tips here.</p>
            </div>
          )}

          {isScanning && (
            <div className="glass-card p-12 text-center flex flex-col items-center justify-center h-full">
              <div className="spinner mb-4" style={{ width: 48, height: 48 }}></div>
              <h3>Analyzing your fit...</h3>
              <p>Comparing skills, experience, and keywords using AI agents.</p>
            </div>
          )}

          {analysis && (
            <div className={styles.resultCard}>
              <div className={styles.scoreBanner}>
                <div className={styles.scoreCircle} style={{ background: analysis.matchScore >= 80 ? '#10b981' : analysis.matchScore >= 60 ? '#f59e0b' : '#ef4444' }}>
                  {analysis.matchScore}%
                </div>
                <div>
                  <h3 className={styles.scoreLabel}>ATS Match Score</h3>
                  <p className={styles.scoreDesc}>{analysis.shortlistStatus === 'shortlisted' ? "🔥 High probability of getting shortlisted!" : "⚠️ Needs optimization to pass filters."}</p>
                </div>
              </div>

              <div className={styles.analysisList}>
                <div className={styles.analysisGroup}>
                  <h4>🎯 Top Keyword Matches</h4>
                  <div className={styles.tagList}>
                    {analysis.keywordMatches?.map((kw: string, i: number) => (
                      <span key={i} className={styles.tag} style={{ borderColor: '#10b981', color: '#10b981' }}>{kw}</span>
                    ))}
                  </div>
                </div>

                <div className={styles.analysisGroup}>
                  <h4>❌ Missing Keywords</h4>
                  <div className={styles.tagList}>
                    {analysis.missingKeywords?.map((kw: string, i: number) => (
                      <span key={i} className={styles.tag} style={{ borderColor: '#ef4444', color: '#ef4444' }}>{kw}</span>
                    ))}
                  </div>
                </div>

                <div className={styles.analysisGroup}>
                  <h4>💡 Optimization Suggestions</h4>
                  {analysis.suggestions?.map((s: any, i: number) => (
                    <div key={i} className={styles.suggestionItem}>
                      <h5>{s.type === 'add_keyword' ? '➕ Keyword Addition' : '📝 Format / Content Rule'}</h5>
                      <p>{s.description}</p>
                    </div>
                  ))}
                  {analysis.gaps?.map((g: any, i: number) => (
                    <div key={`gap-${i}`} className={styles.suggestionItem} style={{ borderLeftColor: '#ef4444' }}>
                      <h5>⚠️ Experience Gap: {g.category}</h5>
                      <p>{g.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-dashed border-gray-700">
                <Link href="/session/new" className="btn btn-ghost w-full">
                  Ready to practice? Start a full interview simulation →
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className={styles.actions}>
        <Link href="/dashboard" className="text-secondary hover:underline">← Back to Dashboard</Link>
      </div>
    </div>
  );
}

export default function ResumeScanPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center">Loading scanner...</div>}>
      <ResumeScanContent />
    </Suspense>
  );
}
