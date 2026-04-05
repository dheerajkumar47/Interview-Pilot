"use client";
import { useState, useCallback } from "react";
import type { User } from "@/types";

// Placeholder auth hook — will integrate with Supabase later
export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    // TODO: Supabase auth
    setUser({ id: "demo", fullName: "Demo User", email, experienceLevel: "fresher", totalSessions: 0, createdAt: new Date().toISOString() });
    setLoading(false);
  }, []);

  const signup = useCallback(async (name: string, email: string, password: string) => {
    setLoading(true);
    setUser({ id: "demo", fullName: name, email, experienceLevel: "fresher", totalSessions: 0, createdAt: new Date().toISOString() });
    setLoading(false);
  }, []);

  const logout = useCallback(async () => {
    setUser(null);
  }, []);

  return { user, loading, login, signup, logout, isAuthenticated: !!user };
}
