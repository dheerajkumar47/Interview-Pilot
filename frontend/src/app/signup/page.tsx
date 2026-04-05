"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import styles from "../auth.module.css";

export default function SignupPage() {
  const router = useRouter();
  const { signup } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await signup(name, email, password);
      router.push("/dashboard");
    } catch (err: any) {
      console.error("Signup Error:", err);
      setError(err.message || "Failed to create account. Please try again.");
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
            Start Your <span className="gradient-text">Journey</span>
          </h1>
          <p className={styles.brandDesc}>
            Join thousands of candidates who cracked their dream jobs with AI-powered interview prep.
          </p>
          <div className={styles.brandFeatures}>
            <div className={styles.brandFeature}><span>✅</span> 100% Free — No credit card</div>
            <div className={styles.brandFeature}><span>🤖</span> 4 Expert AI Agents</div>
            <div className={styles.brandFeature}><span>📊</span> Detailed Score Reports</div>
            <div className={styles.brandFeature}><span>🔄</span> Unlimited Practice</div>
          </div>
        </div>
      </div>
      <div className={styles.authRight}>
        <div className={styles.authForm}>
          <h2 className={styles.authTitle}>Create your account</h2>
          <p className={styles.authSubtitle}>Get started with free AI mock interviews</p>
          
          {error && (
            <div className="alert alert-error" style={{ marginBottom: 16 }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSignup}>
            <div className="input-group" style={{ marginBottom: 16 }}>
              <label className="input-label">Full Name</label>
              <input
                type="text"
                className="input"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
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
                placeholder="Min 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
              />
            </div>
            <button type="submit" className={`btn btn-primary btn-lg ${styles.authBtn}`} disabled={isLoading}>
              {isLoading ? <><span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }}></span> Creating account...</> : "Create Account"}
            </button>
          </form>

          <div className={styles.divider}>
            <span>or</span>
          </div>

          <button className={`btn btn-secondary btn-lg ${styles.authBtn}`}>
            Sign up with Google
          </button>

          <p className={styles.authSwitch}>
            Already have an account? <Link href="/login">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
