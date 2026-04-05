"use client";
import { useState, useCallback } from "react";
import type { Session } from "@/types";
import { sessionsApi } from "@/lib/api";

export function useSession() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createSession = useCallback(async (data: Partial<Session>) => {
    setLoading(true);
    setError(null);
    try {
      const result = await sessionsApi.create(data as Record<string, unknown>);
      setSession(result as unknown as Session);
      return result;
    } catch (e) { setError((e as Error).message); }
    finally { setLoading(false); }
  }, []);

  const loadSession = useCallback(async (id: string) => {
    setLoading(true);
    try {
      const result = await sessionsApi.get(id) as { session: Session };
      setSession(result.session);
    } catch (e) { setError((e as Error).message); }
    finally { setLoading(false); }
  }, []);

  return { session, loading, error, createSession, loadSession, setSession };
}
