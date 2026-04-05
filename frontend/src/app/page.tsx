import Link from "next/link";
import styles from "./page.module.css";

export default function LandingPage() {
  return (
    <div className={styles.landing}>
      {/* ── HEADER ── */}
      <header className={styles["landing-header"]}>
        <div className={styles["landing-header-inner"]}>
          <div className={styles.logo}>
            <div className={styles["logo-icon"]}>🚀</div>
            InterviewPilot
          </div>
          <ul className={styles["nav-links"]}>
            <li><a href="#agents">AI Agents</a></li>
            <li><a href="#how-it-works">How It Works</a></li>
            <li><a href="#start">Get Started</a></li>
          </ul>
          <div className={styles["nav-actions"]}>
            <Link href="/login" className="btn btn-ghost">Log In</Link>
            <Link href="/signup" className="btn btn-primary">Sign Up Free</Link>
          </div>
        </div>
      </header>

      {/* ── HERO ── */}
      <section className={styles.hero}>
        <div className="container">
          <div className={styles["hero-badge"]}>
            <span className={styles["hero-badge-dot"]}></span>
            Powered by 4 AI Agents
          </div>
          <h1 className={styles["hero-title"]}>
            <span className={styles["hero-title-line"]}>Crack Any Interview</span>
            <span className={`${styles["hero-title-line"]} gradient-text`}>With AI Mock Practice</span>
          </h1>
          <p className={styles["hero-description"]}>
            Paste any job description, upload your resume, and get guided through a complete
            interview simulation — from resume screening to HR rounds — by 4 specialized AI agents.
          </p>
          <div className={styles["hero-actions"]}>
            <Link href="/signup" className="btn btn-primary btn-lg">
              Start Free Mock Interview →
            </Link>
            <Link href="#how-it-works" className="btn btn-secondary btn-lg">
              See How It Works
            </Link>
          </div>
          <div className={styles["hero-stats"]}>
            <div className={styles["hero-stat"]}>
              <div className={`${styles["hero-stat-value"]} gradient-text`}>4</div>
              <div className={styles["hero-stat-label"]}>Specialized AI Agents</div>
            </div>
            <div className={styles["hero-stat"]}>
              <div className={`${styles["hero-stat-value"]} gradient-text`}>8</div>
              <div className={styles["hero-stat-label"]}>Sub-Agents Working</div>
            </div>
            <div className={styles["hero-stat"]}>
              <div className={`${styles["hero-stat-value"]} gradient-text`}>5</div>
              <div className={styles["hero-stat-label"]}>Interview Stages</div>
            </div>
            <div className={styles["hero-stat"]}>
              <div className={`${styles["hero-stat-value"]} gradient-text`}>100%</div>
              <div className={styles["hero-stat-label"]}>Free to Use</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── AGENTS ── */}
      <section id="agents" className={styles["agents-section"]}>
        <div className={styles["agents-section-header"]}>
          <h2 className="section-title">
            Meet Your <span className="gradient-text">AI Interview Panel</span>
          </h2>
          <p className="section-subtitle" style={{ margin: '0 auto' }}>
            Four expert AI agents, each with specialized sub-agents, guide you through every stage of the hiring process.
          </p>
        </div>
        <div className={`${styles["agents-grid"]} stagger-children`}>
          {/* Agent 1 */}
          <div className={`${styles["agent-card"]} glass-card`}>
            <div className={`${styles["agent-icon"]} ${styles["agent-icon-1"]}`}>🔍</div>
            <h3 className={styles["agent-card-title"]}>Resume Analyst</h3>
            <p className={styles["agent-card-desc"]}>
              Screens your resume against the job description, scores ATS compatibility, and provides targeted improvement suggestions.
            </p>
            <div className={styles["agent-sub-agents"]}>
              <span className={styles["agent-sub-agent"]}>Resume Parser</span>
              <span className={styles["agent-sub-agent"]}>Resume Optimizer</span>
            </div>
          </div>

          {/* Agent 2 */}
          <div className={`${styles["agent-card"]} glass-card`}>
            <div className={`${styles["agent-icon"]} ${styles["agent-icon-2"]}`}>💻</div>
            <h3 className={styles["agent-card-title"]}>Technical Interviewer</h3>
            <p className={styles["agent-card-desc"]}>
              Conducts realistic coding challenges and system design interviews, adapting difficulty to your experience level.
            </p>
            <div className={styles["agent-sub-agents"]}>
              <span className={styles["agent-sub-agent"]}>Coding Challenge Agent</span>
              <span className={styles["agent-sub-agent"]}>System Design Agent</span>
            </div>
          </div>

          {/* Agent 3 */}
          <div className={`${styles["agent-card"]} glass-card`}>
            <div className={`${styles["agent-icon"]} ${styles["agent-icon-3"]}`}>📚</div>
            <h3 className={styles["agent-card-title"]}>Knowledge Assessor</h3>
            <p className={styles["agent-card-desc"]}>
              Tests your theoretical knowledge with MCQs, domain deep-dives, and concept discussions tailored to the role.
            </p>
            <div className={styles["agent-sub-agents"]}>
              <span className={styles["agent-sub-agent"]}>MCQ Generator</span>
              <span className={styles["agent-sub-agent"]}>Domain Expert</span>
            </div>
          </div>

          {/* Agent 4 */}
          <div className={`${styles["agent-card"]} glass-card`}>
            <div className={`${styles["agent-icon"]} ${styles["agent-icon-4"]}`}>🤝</div>
            <h3 className={styles["agent-card-title"]}>HR Coach</h3>
            <p className={styles["agent-card-desc"]}>
              Prepares you for behavioral interviews using the STAR method, and guides salary negotiation strategy.
            </p>
            <div className={styles["agent-sub-agents"]}>
              <span className={styles["agent-sub-agent"]}>Behavioral Q&A Agent</span>
              <span className={styles["agent-sub-agent"]}>Salary Negotiation Agent</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className={styles["how-section"]}>
        <div className={styles["how-section-header"]}>
          <h2 className="section-title">
            How <span className="gradient-text">InterviewPilot</span> Works
          </h2>
          <p className="section-subtitle" style={{ margin: '0 auto' }}>
            A complete interview simulation pipeline — from job description to interview readiness.
          </p>
        </div>
        <div className={styles["steps-container"]}>
          <div className={styles["step-connector"]}></div>

          <div className={styles["step-card"]}>
            <div className={styles["step-number"]}>1</div>
            <h3 className={styles["step-title"]}>Paste Job Description</h3>
            <p className={styles["step-desc"]}>
              Copy the job posting from any company. Our AI extracts skills, requirements, and role type.
            </p>
          </div>

          <div className={styles["step-card"]}>
            <div className={styles["step-number"]}>2</div>
            <h3 className={styles["step-title"]}>Upload Resume</h3>
            <p className={styles["step-desc"]}>
              Upload your PDF/DOCX resume. The Resume Analyst scores it and suggests improvements.
            </p>
          </div>

          <div className={styles["step-card"]}>
            <div className={styles["step-number"]}>3</div>
            <h3 className={styles["step-title"]}>Get Shortlisted</h3>
            <p className={styles["step-desc"]}>
              If your resume needs work, get specific guidance. Once ready, proceed to interviews.
            </p>
          </div>

          <div className={styles["step-card"]}>
            <div className={styles["step-number"]}>4</div>
            <h3 className={styles["step-title"]}>Mock Interviews</h3>
            <p className={styles["step-desc"]}>
              Face technical coding, knowledge assessments, and HR rounds with expert AI agents.
            </p>
          </div>

          <div className={styles["step-card"]}>
            <div className={styles["step-number"]}>5</div>
            <h3 className={styles["step-title"]}>Get Your Score</h3>
            <p className={styles["step-desc"]}>
              Receive a detailed report with scores, strengths, weaknesses, and a readiness verdict.
            </p>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section id="start" className={styles["cta-section"]}>
        <div className={`${styles["cta-box"]} glass-card`}>
          <h2 className={styles["cta-title"]}>
            Ready to <span className="gradient-text">Ace Your Interview?</span>
          </h2>
          <p className={styles["cta-desc"]}>
            Join thousands of candidates who cracked their dream jobs with AI-powered mock interviews.
            Completely free, no credit card required.
          </p>
          <Link href="/signup" className="btn btn-primary btn-lg">
            Start Mock Interview — It&apos;s Free →
          </Link>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className={styles["landing-footer"]}>
        <p className={styles["footer-text"]}>
          © 2026 <span>InterviewPilot</span>. Built with AI, for your success.
        </p>
      </footer>
    </div>
  );
}
