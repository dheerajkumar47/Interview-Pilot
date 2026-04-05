"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { connectSocket, disconnectSocket, getSocket } from "@/lib/socket";
import type { ChatMessage } from "@/types";
import { generateId } from "@/lib/utils";

export function useSocket(sessionId: string, stage: string) {
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const socketRef = useRef(getSocket());

  useEffect(() => {
    const socket = connectSocket();
    socketRef.current = socket;

    socket.on("connect", () => setConnected(true));
    socket.on("disconnect", () => setConnected(false));

    socket.on("interview:response", (data: { message: string; stage: string }) => {
      setIsTyping(false);
      setMessages((prev) => [...prev, {
        id: generateId(),
        role: "ai",
        content: data.message,
        timestamp: new Date(),
        agentType: data.stage,
      }]);
    });

    socket.on("interview:error", (data: { message: string }) => {
      setIsTyping(false);
      setMessages((prev) => [...prev, {
        id: generateId(),
        role: "ai",
        content: `⚠️ ${data.message}`,
        timestamp: new Date(),
      }]);
    });

    // Initialize session
    socket.emit("session:init", { sessionId });

    return () => {
      disconnectSocket();
    };
  }, [sessionId]);

  const sendMessage = useCallback((content: string) => {
    const userMsg: ChatMessage = { id: generateId(), role: "user", content, timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);
    socketRef.current.emit("interview:message", { sessionId, stage, message: content });
  }, [sessionId, stage]);

  return { connected, messages, isTyping, sendMessage, setMessages };
}
