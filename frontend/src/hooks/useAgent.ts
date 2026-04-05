"use client";
import { useCallback } from "react";
import { interviewApi } from "@/lib/api";

export function useAgent() {
  const sendToAgent = useCallback(async (stage: string, messages: unknown[], context?: Record<string, unknown>) => {
    const result = await interviewApi.chat(stage, messages, context);
    return result;
  }, []);

  return { sendToAgent };
}
