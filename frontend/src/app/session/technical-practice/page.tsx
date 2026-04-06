"use client";
import { useEffect, useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

function TechnicalPracticeContent() {
  const router = useRouter();
  const { user } = useAuth();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const createPracticeSession = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        const response = await fetch(`${API_URL}/api/sessions`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: user?.id || null,
            jobTitle: "Technical Practice",
            company: "Practice Simulation",
            sessionMode: "technical_only",
            currentStage: "technical"
          }),
        });

        if (!response.ok) throw new Error("Failed to start practice session.");
        
        const data = await response.json();
        if (data.success && data.session) {
          router.push(`/session/${data.session.sessionId}/technical`);
        } else {
          throw new Error("Invalid session response.");
        }
      } catch (err: any) {
        setError(err.message || "Something went wrong.");
      }
    };

    if (user !== undefined) {
      createPracticeSession();
    }
  }, [user, router]);

  if (error) {
    return (
      <div className="container p-12 text-center">
        <div className="alert alert-error mb-4">{error}</div>
        <button className="btn btn-primary" onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  return (
    <div className="container p-12 text-center flex flex-col items-center justify-center min-h-[60vh]">
      <div className="spinner mb-6" style={{ width: 64, height: 64, borderWidth: 4 }}></div>
      <h2 className="text-2xl font-bold mb-2">Preparing Your Technical Practice...</h2>
      <p className="opacity-70">Setting up your AI technical interviewer. One moment...</p>
    </div>
  );
}

export default function TechnicalPracticePage() {
  return (
    <Suspense fallback={<div className="p-12 text-center">Initializing...</div>}>
      <TechnicalPracticeContent />
    </Suspense>
  );
}
