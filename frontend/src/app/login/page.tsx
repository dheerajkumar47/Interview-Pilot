"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import styles from "../auth.module.css";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      await login(email, password);
      router.push("/dashboard");
    } catch (err: any) {
      console.error("Login Error:", err);
      setError(err.message || "Invalid email or password. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.authPage}>
      <div className={styles.authLeft}>
        <div className={styles.brandContent}>
          <Link href="/" className={styles.backLink}>← Back to Home</Link>
          <div className={styles.brandLogo}>
            <span className={styles.brandIcon}>🚀</span>
            <span className={styles.brandName}>InterviewPilot</span>
          </div>
          <h1 className={styles.brandTitle}>
            Practice Makes <span className="gradient-text">Perfect</span>
          </h1>
          <p className={styles.brandDesc}>
            4 AI agents. 8 sub-agents. One mission — get you interview-ready.
          </p>
          <div className={styles.brandFeatures}>
            <div className={styles.brandFeature}><span>🔍</span> Resume Screening</div>
            <div className={styles.brandFeature}><span>💻</span> Technical Interviews</div>
            <div className={styles.brandFeature}><span>📚</span> Knowledge Assessment</div>
            <div className={styles.brandFeature}><span>🤝</span> HR Preparation</div>
          </div>
        </div>
      </div>
      <div className={styles.authRight}>
        <div className={styles.authForm}>
          <h2 className={styles.authTitle}>Welcome back</h2>
          <p className={styles.authSubtitle}>Log in to continue your interview practice</p>
          
          {error && (
            <div className="alert alert-error" style={{ marginBottom: 16 }}>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className="input-group" style={{ marginBottom: 16 }}>
              <label className="input-label">Email</label>
              <input
                type="email"
                className="input"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="input-group" style={{ marginBottom: 24 }}>
              <label className="input-label">Password</label>
              <input
                type="password"
                className="input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className={`btn btn-primary btn-lg ${styles.authBtn}`} disabled={isLoading}>
              {isLoading ? <><span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }}></span> Logging in...</> : "Log In"}
            </button>
          </form>

          <div className={styles.divider}>
            <span>or</span>
          </div>

          <button className={`btn btn-secondary btn-lg ${styles.authBtn}`}>
            Continue with Google
          </button>

          <p className={styles.authSwitch}>
            Don&apos;t have an account? <Link href="/signup">Sign up free</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
