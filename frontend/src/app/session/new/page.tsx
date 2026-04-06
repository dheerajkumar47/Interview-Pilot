"use client";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { API_BASE } from "@/lib/api";
import styles from "./new-session.module.css";

type Step = 1 | 2 | 3;

function NewSessionContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode") || "full";
  const { user } = useAuth();
  const [step, setStep] = useState<Step>(1);
  const [jobDescription, setJobDescription] = useState("");
  const [extractedInfo, setExtractedInfo] = useState({
    jobTitle: "",
    company: "",
    experience: "",
    roleType: "developer",
    skills: [] as string[],
  });
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeDragActive, setResumeDragActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleJDPaste = (text: string) => {
    setJobDescription(text);
    // Simple extraction heuristics
    const lines = text.toLowerCase();
    const titleMatch = text.match(/(?:position|role|title)[:\s]*(.+)/i);
    if (titleMatch) {
      setExtractedInfo(prev => ({ ...prev, jobTitle: titleMatch[1].trim() }));
    }
  };

  const handleResumeUpload = (file: File) => {
    if (file.type === "application/pdf" || file.name.endsWith(".docx") || file.name.endsWith(".doc")) {
      setResumeFile(file);
      setError(null);
    } else {
      setError("Please upload a PDF or DOCX file");
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setResumeDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file) handleResumeUpload(file);
  };

  const handleStartSession = async () => {
    if (!resumeFile || !jobDescription) return;

    setIsProcessing(true);
    setError(null);
    console.log("👤 USER IDENTITY AT START:", user?.id || "NULL / NOT LOGGED IN");

    try {
      const formData = new FormData();
      formData.append("resume", resumeFile);
      formData.append("jobDescription", jobDescription);
      formData.append("jobTitle", extractedInfo.jobTitle);
      formData.append("company", extractedInfo.company);
      formData.append("experience", extractedInfo.experience);
      formData.append("roleType", extractedInfo.roleType);
      formData.append("sessionMode", mode); // New mode parameter
      if (user?.id) formData.append("userId", user.id);

      const response = await fetch(`${API_BASE}/api/resume/upload`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      console.log("📡 API FULL RESPONSE:", data);
      console.log("🔍 TRUTH LOG: Session creation attempt completed.");

      if (data.success && data.sessionId) {
        console.log("🚀 REDIRECTING TO NEW SESSION:", data.sessionId);
        router.push(`/session/${data.sessionId}`);
      } else {
        console.error("❌ SESSION CREATION FAILED:", data);
        throw new Error(data.message || "Failed to create session");
      }
    } catch (err: any) {
      console.error("Session creation error:", err);
      setError(err.message || "Something went wrong. Please try again.");
      setIsProcessing(false);
    }
  };

  return (
    <div className={styles.newSession}>
      <div className={styles.header}>
        <h1 className={styles.title}>Start New Interview Session</h1>
        <p className={styles.subtitle}>
          Paste a job description, upload your resume, and let our AI agents guide you through a complete mock interview.
        </p>
      </div>

      {error && (
        <div className={styles.errorBanner}>
          ⚠️ {error}
        </div>
      )}

      {/* Progress Steps */}
      <div className={styles.progressSteps}>
        {[
          { num: 1, label: "Job Description" },
          { num: 2, label: "Upload Resume" },
          { num: 3, label: "Start Interview" },
        ].map((s) => (
          <div
            key={s.num}
            className={`${styles.progressStep} ${step >= s.num ? styles.progressStepActive : ""} ${step === s.num ? styles.progressStepCurrent : ""}`}
          >
            <div className={styles.progressDot}>{step > s.num ? "✓" : s.num}</div>
            <span className={styles.progressLabel}>{s.label}</span>
          </div>
        ))}
        <div className={styles.progressLine}>
          <div className={styles.progressLineFill} style={{ width: `${((step - 1) / 2) * 100}%` }}></div>
        </div>
      </div>

      {/* Step 1: Job Description */}
      {step === 1 && (
        <div className={`${styles.stepContent} animate-slide-up`}>
          <div className={`${styles.stepCard} glass-card`}>
            <div className={styles.stepCardHeader}>
              <h2 className={styles.stepTitle}>📋 Paste the Job Description</h2>
              <p className={styles.stepDesc}>
                Copy the entire job posting from the company&apos;s career page. Our AI will extract key requirements.
              </p>
            </div>
            <div className={styles.jdForm}>
              <textarea
                className={`input textarea ${styles.jdInput}`}
                placeholder="Paste the complete job description here...&#10;&#10;Example:&#10;Software Engineer (0-3 years)&#10;Company: XYZ Corp&#10;&#10;Requirements:&#10;- Proficiency in React, Node.js, TypeScript&#10;- Understanding of system design&#10;- Strong problem-solving skills..."
                value={jobDescription}
                onChange={(e) => handleJDPaste(e.target.value)}
                rows={12}
              />

              {/* Quick Info Fields */}
              <div className={styles.infoGrid}>
                <div className="input-group">
                  <label className="input-label">Job Title</label>
                  <input
                    type="text"
                    className="input"
                    placeholder="e.g., Software Engineer"
                    value={extractedInfo.jobTitle}
                    onChange={(e) => setExtractedInfo(prev => ({ ...prev, jobTitle: e.target.value }))}
                  />
                </div>
                <div className="input-group">
                  <label className="input-label">Company Name</label>
                  <input
                    type="text"
                    className="input"
                    placeholder="e.g., Google"
                    value={extractedInfo.company}
                    onChange={(e) => setExtractedInfo(prev => ({ ...prev, company: e.target.value }))}
                  />
                </div>
                <div className="input-group">
                  <label className="input-label">Experience Required</label>
                  <select
                    className="input"
                    value={extractedInfo.experience}
                    onChange={(e) => setExtractedInfo(prev => ({ ...prev, experience: e.target.value }))}
                  >
                    <option value="">Select</option>
                    <option value="fresher">Fresher (0 years)</option>
                    <option value="0-1">0-1 years</option>
                    <option value="1-3">1-3 years</option>
                    <option value="3-5">3-5 years</option>
                    <option value="5+">5+ years</option>
                  </select>
                </div>
                <div className="input-group">
                  <label className="input-label">Role Type</label>
                  <select
                    className="input"
                    value={extractedInfo.roleType}
                    onChange={(e) => setExtractedInfo(prev => ({ ...prev, roleType: e.target.value }))}
                  >
                    <option value="developer">Developer</option>
                    <option value="tester">QA / Tester</option>
                    <option value="devops">DevOps / Cloud</option>
                    <option value="data">Data / ML</option>
                    <option value="design">UI/UX Design</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
            </div>
            <div className={styles.stepActions}>
              <button
                className="btn btn-primary btn-lg"
                onClick={() => setStep(2)}
                disabled={!jobDescription.trim() || !extractedInfo.jobTitle}
              >
                Continue to Resume Upload →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Resume Upload */}
      {step === 2 && (
        <div className={`${styles.stepContent} animate-slide-up`}>
          <div className={`${styles.stepCard} glass-card`}>
            <div className={styles.stepCardHeader}>
              <h2 className={styles.stepTitle}>📄 Upload Your Resume</h2>
              <p className={styles.stepDesc}>
                Upload your latest resume in PDF or DOCX format. Our Resume Analyst agent will score and analyze it.
              </p>
            </div>

            <div
              className={`${styles.dropZone} ${resumeDragActive ? styles.dropZoneActive : ""} ${resumeFile ? styles.dropZoneDone : ""}`}
              onDragOver={(e) => { e.preventDefault(); setResumeDragActive(true); }}
              onDragLeave={() => setResumeDragActive(false)}
              onDrop={handleDrop}
              onClick={() => document.getElementById("resumeInput")?.click()}
            >
              <input
                id="resumeInput"
                type="file"
                accept=".pdf,.doc,.docx"
                style={{ display: "none" }}
                onChange={(e) => e.target.files?.[0] && handleResumeUpload(e.target.files[0])}
              />
              {resumeFile ? (
                <div className={styles.uploadedFile}>
                  <div className={styles.fileIcon}>📄</div>
                  <div className={styles.fileInfo}>
                    <span className={styles.fileName}>{resumeFile.name}</span>
                    <span className={styles.fileSize}>{(resumeFile.size / 1024).toFixed(1)} KB</span>
                  </div>
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={(e) => { e.stopPropagation(); setResumeFile(null); }}
                  >
                    ✕ Remove
                  </button>
                </div>
              ) : (
                <div className={styles.dropContent}>
                  <div className={styles.dropIcon}>📁</div>
                  <p className={styles.dropText}>
                    <strong>Drag & drop</strong> your resume here, or <span className={styles.dropLink}>browse files</span>
                  </p>
                  <p className={styles.dropHint}>Supports PDF, DOC, DOCX (Max 5MB)</p>
                </div>
              )}
            </div>

            <div className={styles.stepActions}>
              <button className="btn btn-secondary" onClick={() => setStep(1)}>
                ← Back
              </button>
              <button
                className="btn btn-primary btn-lg"
                onClick={() => setStep(3)}
                disabled={!resumeFile}
              >
                Continue to Review →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Review & Start */}
      {step === 3 && (
        <div className={`${styles.stepContent} animate-slide-up`}>
          <div className={`${styles.stepCard} glass-card`}>
            <div className={styles.stepCardHeader}>
              <h2 className={styles.stepTitle}>🚀 Ready to Start</h2>
              <p className={styles.stepDesc}>
                Review your session details. Our 4 AI agents are ready to guide you through the complete interview process.
              </p>
            </div>

            <div className={styles.reviewGrid}>
              <div className={styles.reviewSection}>
                <h3 className={styles.reviewLabel}>Job Details</h3>
                <div className={styles.reviewItem}>
                  <span className={styles.reviewKey}>Title:</span>
                  <span className={styles.reviewValue}>{extractedInfo.jobTitle}</span>
                </div>
                <div className={styles.reviewItem}>
                  <span className={styles.reviewKey}>Company:</span>
                  <span className={styles.reviewValue}>{extractedInfo.company || "Not specified"}</span>
                </div>
                <div className={styles.reviewItem}>
                  <span className={styles.reviewKey}>Experience:</span>
                  <span className={styles.reviewValue}>{extractedInfo.experience || "Not specified"}</span>
                </div>
                <div className={styles.reviewItem}>
                  <span className={styles.reviewKey}>Role Type:</span>
                  <span className="badge badge-primary">{extractedInfo.roleType}</span>
                </div>
              </div>
              <div className={styles.reviewSection}>
                <h3 className={styles.reviewLabel}>Resume</h3>
                <div className={styles.reviewItem}>
                  <span className={styles.reviewKey}>File:</span>
                  <span className={styles.reviewValue}>{resumeFile?.name}</span>
                </div>
                <div className={styles.reviewItem}>
                  <span className={styles.reviewKey}>Size:</span>
                  <span className={styles.reviewValue}>{resumeFile && (resumeFile.size / 1024).toFixed(1)} KB</span>
                </div>
              </div>
              <div className={styles.reviewSection}>
                <h3 className={styles.reviewLabel}>Interview Pipeline</h3>
                <div className={styles.pipelineSteps}>
                  <div className={styles.pipelineStep}>
                    <span className={styles.pipelineIcon}>🔍</span>
                    <span>Resume Analysis & Shortlisting</span>
                  </div>
                  <div className={styles.pipelineStep}>
                    <span className={styles.pipelineIcon}>🎯</span>
                    <span>Initial Knowledge Assessment</span>
                  </div>
                  <div className={styles.pipelineStep}>
                    <span className={styles.pipelineIcon}>💻</span>
                    <span>Technical Interview</span>
                  </div>
                  <div className={styles.pipelineStep}>
                    <span className={styles.pipelineIcon}>📚</span>
                    <span>Knowledge Deep Dive</span>
                  </div>
                  <div className={styles.pipelineStep}>
                    <span className={styles.pipelineIcon}>🤝</span>
                    <span>HR & Behavioral Round</span>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.stepActions}>
              <button className="btn btn-secondary" onClick={() => setStep(2)}>
                ← Back
              </button>
              <button
                className="btn btn-success btn-lg"
                onClick={handleStartSession}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }}></span>
                    Preparing Session...
                  </>
                ) : (
                  "🚀 Start Interview Session"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function NewSessionPage() {
  return (
    <Suspense fallback={<div className="container p-8">Loading session setup...</div>}>
      <NewSessionContent />
    </Suspense>
  );
}
