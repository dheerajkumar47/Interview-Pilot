"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";
import type { Session, ResumeAnalysis, Scores, InterviewStage } from "@/types";

interface SessionContextType {
  session: Session | null;
  resumeAnalysis: ResumeAnalysis | null;
  scores: Scores;
  currentStage: InterviewStage;
  setSession: (s: Session) => void;
  setResumeAnalysis: (a: ResumeAnalysis) => void;
  updateScore: (stage: keyof Scores, score: number) => void;
  setCurrentStage: (stage: InterviewStage) => void;
}

const defaultScores: Scores = { resume: 0, technical: 0, knowledge: 0, hr: 0, overall: 0 };

const SessionContext = createContext<SessionContextType | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [resumeAnalysis, setResumeAnalysis] = useState<ResumeAnalysis | null>(null);
  const [scores, setScores] = useState<Scores>(defaultScores);
  const [currentStage, setCurrentStage] = useState<InterviewStage>("resume");

  const updateScore = (stage: keyof Scores, score: number) => {
    setScores((prev) => {
      const updated = { ...prev, [stage]: score };
      updated.overall = Math.round((updated.resume + updated.technical + updated.knowledge + updated.hr) / 4);
      return updated;
    });
  };

  return (
    <SessionContext.Provider
      value={{ session, resumeAnalysis, scores, currentStage, setSession, setResumeAnalysis, updateScore, setCurrentStage }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export function useSessionContext() {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useSessionContext must be used within SessionProvider");
  return ctx;
}
