"use client";
import { useState, Suspense } from "react";
import styles from "./resume-scan.module.css";
import Link from "next/link";
import { API_BASE } from "@/lib/api";
import { 
  Briefcase, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  TrendingUp, 
  Upload, 
  Search,
  ArrowRight,
  ShieldAlert,
  Zap,
  RotateCcw
} from "lucide-react";

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
      setError("Provide both JD and Resume to begin analysis.");
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

      const response = await fetch(`${API_BASE}/api/resume/upload`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Connection lost. Please try again.");
      
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
        <h1 className={styles.title}>ATS Optimization Engine</h1>
        <p className={styles.subtitle}>
          Stop getting rejected by bots. Align your resume with AI precision to beat the ATS 
          and land the interview.
        </p>
      </div>

      <div className={styles.scanContainer}>
        {error && (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 mb-6 animate-in fade-in slide-in-from-top-4">
            <AlertCircle size={20} />
            <span className="font-semibold">{error}</span>
          </div>
        )}

        {!analysis && (
          <div className={styles.glassCard}>
            <div className={styles.jdWrapper}>
              <label className={styles.label}>
                <Briefcase size={20} className="text-indigo-400" />
                Target Job Description
              </label>
              <textarea 
                className={styles.jdTextarea}
                placeholder="Paste the target Job Description (JD) here..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
              />
            </div>
            
            <div className="mt-8">
              <label className={styles.label}>
                <FileText size={20} className="text-purple-400" />
                Your Professional Resume
              </label>
              <div 
                className={`${styles.dropZone} ${dragActive ? styles.dropZoneActive : ""} ${resumeFile ? styles.dropZoneDone : ""}`}
                onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                onDragLeave={() => setDragActive(false)}
                onDrop={(e) => { e.preventDefault(); setDragActive(false); if(e.dataTransfer.files[0]) handleFileUpload(e.dataTransfer.files[0]); }}
                onClick={() => document.getElementById("fileInput")?.click()}
              >
                <input id="fileInput" type="file" hidden onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])} />
                <div className={styles.uploadIcon}>
                  {resumeFile ? <CheckCircle size={48} className="text-green-500" /> : <Upload size={48} className="text-indigo-500" />}
                </div>
                {resumeFile ? (
                  <div className="text-center">
                    <p className="font-bold text-lg text-white">{resumeFile.name}</p>
                    <p className="text-sm opacity-60">Ready for high-speed analysis</p>
                    <button className="mt-2 text-xs text-red-400 hover:text-red-300 transition-colors uppercase tracking-widest font-black" onClick={(e) => { e.stopPropagation(); setResumeFile(null); }}>Change File</button>
                  </div>
                ) : (
                  <div>
                    <p className="text-lg font-bold text-white">Drag & drop your resume or <span className="text-indigo-400">browse</span></p>
                    <p className="text-sm opacity-50">Supports PDF, DOCX (Max 10MB)</p>
                  </div>
                )}
              </div>
            </div>

            <button 
              className={`${styles.actionBtn} mt-10`}
              disabled={isScanning || !resumeFile || !jobDescription}
              onClick={startScan}
            >
              {isScanning ? (
                <>
                  <div className={styles.loadingSpinner} />
                  <span>AI Engine Analyzing...</span>
                </>
              ) : (
                <>
                  <Zap size={20} fill="currentColor" />
                  <span>Generate Match Report</span>
                </>
              )}
            </button>
          </div>
        )}

        {analysis && (
          <div className={styles.resultsGrid}>
            {/* Left: Score Panel */}
            <div className={`${styles.glassCard} ${styles.scorePanel}`}>
              <div className={styles.scoreCircleWrapper}>
                <div className={styles.scoreCircle} style={{ '--progress': `${analysis.matchScore}%` } as any} />
                <div className={styles.scoreText}>
                  <span className={styles.scoreNumber}>{analysis.matchScore}</span>
                  <span className={styles.scorePercent}>ATS MATCH</span>
                </div>
              </div>
              <div className="text-center">
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3 ${
                  analysis.shortlistStatus === 'shortlisted' ? 'bg-green-500/10 text-green-500' : 'bg-orange-500/10 text-orange-400'
                }`}>
                  {analysis.shortlistStatus === 'shortlisted' ? <CheckCircle size={14} /> : <ShieldAlert size={14} />}
                  {analysis.shortlistStatus === 'shortlisted' ? "Highly Compatible" : "Optimization Required"}
                </div>
                <p className="text-sm text-balance opacity-70 leading-relaxed px-2">
                  {analysis.shortlistStatus === 'shortlisted' 
                    ? "Great alignment! Your profile strongly matches the requirements. Some minor tweaks could still help."
                    : "Your resume is missing critical keywords. Bots might filter you out before a human sees your application."}
                </p>
                <button 
                  onClick={() => setAnalysis(null)}
                  className="mt-6 flex items-center gap-2 text-xs font-bold opacity-60 hover:opacity-100 transition-opacity mx-auto"
                >
                  <RotateCcw size={14} /> RESET SCAN
                </button>
              </div>
            </div>

            {/* Right: Detailed Analysis */}
            <div className={styles.analysisContent}>
              <div className={styles.tagGroup}>
                <h3 className="flex items-center gap-2 font-bold mb-4">
                  <TrendingUp size={20} className="text-green-500" />
                  Primary Keyword Matches
                </h3>
                <div className={styles.tagList}>
                  {analysis.keywordMatches?.map((kw: string, i: number) => (
                    <span key={i} className={styles.tag}>{kw}</span>
                  ))}
                  {(!analysis.keywordMatches || analysis.keywordMatches.length === 0) && (
                    <p className="text-sm opacity-40 italic">No significant matches found.</p>
                  )}
                </div>
              </div>

              <div className={styles.tagGroup}>
                <h3 className="flex items-center gap-2 font-bold mb-4 text-red-400">
                  <ShieldAlert size={20} />
                  Critical Keyword Gaps
                </h3>
                <div className={styles.tagList}>
                  {analysis.missingKeywords?.map((kw: string, i: number) => (
                    <span key={i} className={styles.tag} style={{ border: '1px solid rgba(239, 68, 68, 0.2)', color: '#fca5a5' }}>{kw}</span>
                  ))}
                  {(!analysis.missingKeywords || analysis.missingKeywords.length === 0) && (
                    <p className="text-sm opacity-40 italic">Outstanding! No missing keywords identified.</p>
                  )}
                </div>
              </div>

              <div>
                <h3 className="flex items-center gap-2 font-bold mb-4">
                  <Zap size={20} className="text-yellow-500" />
                  Strategic Optimization Plan
                </h3>
                {analysis.suggestions?.map((s: any, i: number) => (
                  <div key={i} className={styles.suggestionCard}>
                    <h5 className="font-bold text-white mb-1 flex items-center gap-2">
                      <Search size={14} className="text-indigo-400" />
                      {s.type === 'add_keyword' ? 'Enhance Skill Presence' : 'Critical Formatting Rule'}
                    </h5>
                    <p className="text-sm opacity-70">{s.description}</p>
                  </div>
                ))}
                
                <Link href="/session/new" className="group mt-8 flex items-center justify-between p-6 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 hover:bg-indigo-500/20 transition-all">
                  <div>
                    <h4 className="font-bold text-white text-lg">Next Step: Full AI Simulation</h4>
                    <p className="text-sm opacity-70">Practice answering questions about these skills.</p>
                  </div>
                  <ArrowRight className="group-hover:translate-x-2 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-12 text-center opacity-50 hover:opacity-100 transition-opacity">
        <Link href="/dashboard" className="text-sm font-bold flex items-center justify-center gap-2">
          ← BACK TO CONSOLE
        </Link>
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
