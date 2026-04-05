"use client";
import { useState, useRef, useEffect, use } from "react";
import { connectSocket, disconnectSocket, getSocket } from "@/lib/socket";
import styles from "./interview-room.module.css";
import Link from "next/link";

interface Message {
  id: string;
  role: "ai" | "user";
  content: string;
  timestamp: Date;
  agentType?: string;
}

// Question limits and timers per stage
const STAGE_CONFIG: Record<string, { maxQuestions: number; timePerQuestion: number; name: string; icon: string; color: string }> = {
  resume: { maxQuestions: 6, timePerQuestion: 90, name: "Resume Analyst", icon: "🔍", color: "#6366f1" },
  initial: { maxQuestions: 5, timePerQuestion: 60, name: "Knowledge Assessor", icon: "🎯", color: "#10b981" },
  technical: { maxQuestions: 8, timePerQuestion: 180, name: "Technical Interviewer", icon: "💻", color: "#f97316" },
  knowledge: { maxQuestions: 6, timePerQuestion: 90, name: "Knowledge Assessor", icon: "📚", color: "#10b981" },
  hr: { maxQuestions: 6, timePerQuestion: 120, name: "HR Coach", icon: "🤝", color: "#ec4899" },
};

const GREETINGS: Record<string, string> = {
  resume: "Hi! I'm the Resume Analyst. I've analyzed your resume against the job description. Let me walk you through the results...",
  initial: "Hello! Before we dive into the interview, let me ask you a few general questions to understand your background. Ready?",
  technical: "Welcome to the Technical Interview! I'll ask coding and problem-solving questions tailored to the job. Let's start with a warm-up. Are you ready?",
  knowledge: "Welcome to the Knowledge Assessment! I'll test your understanding of key concepts. Let's begin!",
  hr: "Hi there! I'm your HR Interview Coach. We'll practice behavioral questions using the STAR method. How do you describe yourself for this role?",
};

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "de", label: "Deutsch" },
  { code: "ur", label: "اردو" },
  { code: "hi", label: "हिंदी" },
  { code: "fr", label: "Français" },
];

export default function InterviewRoom({ params }: { params: Promise<{ id: string; stage: string }> }) {
  const { id, stage: currentStageRaw } = use(params);
  const stage = (currentStageRaw || "technical") as keyof typeof STAGE_CONFIG;
  const config = STAGE_CONFIG[stage] || STAGE_CONFIG.technical;

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [questionCount, setQuestionCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(config.timePerQuestion);
  const [timerActive, setTimerActive] = useState(false);
  const [language, setLanguage] = useState("en");
  const [stageFinished, setStageFinished] = useState(false);
  const [isVoiceListening, setIsVoiceListening] = useState(false);
  const [isAutoVoice, setIsAutoVoice] = useState(false);
  const [sessionMode, setSessionMode] = useState<string>("full");

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const recognitionRef = useRef<any>(null);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Greeting on mount
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{
        id: "greeting",
        role: "ai",
        content: GREETINGS[stage] || GREETINGS.technical,
        timestamp: new Date(),
        agentType: stage,
      }]);
    }
  }, [stage]);

  // Socket setup
  useEffect(() => {
    const s = connectSocket();
    s.emit("session:init", { sessionId: id, stage, language });

    const onResponse = (data: { sessionId: string; stage: string; message: string; timestamp: string; score?: number }) => {
      if (data.sessionId !== id || data.stage !== stage) return;
      setIsTyping(false);

      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        role: "ai",
        content: data.message.replace(/\[SCORE:\s*\d+\]/i, "").trim(),
        timestamp: new Date(data.timestamp || new Date()),
        agentType: data.stage,
      };

      setMessages(prev => [...prev, aiMsg]);

      // Professional: Auto-speak AI response if auto-voice is ON
      if (isAutoVoice || config.name === "Resume Analyst") {
        speakMessage(data.message.replace(/\[SCORE:\s*\d+\]/i, "").trim());
      }

      // Increment question count and start timer for user's next reply
      setQuestionCount(prev => {
        const next = prev + 1;
        if (next >= config.maxQuestions) {
          setStageFinished(true);
        } else {
          // Start countdown timer
          setTimeLeft(config.timePerQuestion);
          setTimerActive(true);
        }
        return next;
      });

      // If score came with response, update it
      if (data.score !== undefined) {
        s.emit("score:update", { sessionId: id, stage, score: data.score });
      }
    };

    const onError = (data: { message: string }) => {
      setIsTyping(false);
      setMessages(prev => [...prev, {
        id: `err-${Date.now()}`,
        role: "ai",
        content: `⚠️ ${data.message}`,
        timestamp: new Date(),
        agentType: stage,
      }]);
    };

    const onScoreUpdated = (data: { scores: any }) => {
      // Score updated in DB, we can show live score if needed
      console.log("Scores updated:", data.scores);
    };

    s.on("interview:response", onResponse);
    s.on("interview:error", onError);
    s.on("score:updated", onScoreUpdated);
    s.on("session:advanced", () => {
      window.location.href = `/session/${id}`;
    });

    return () => {
      s.off("interview:response", onResponse);
      s.off("interview:error", onError);
      s.off("score:updated", onScoreUpdated);
      s.off("session:advanced");
      disconnectSocket();
    };
  }, [id, stage, language]);

  // Countdown timer logic
  useEffect(() => {
    if (!timerActive || stageFinished) return;
    if (timeLeft <= 0) {
      setTimerActive(false);
      // Auto-send if user hasn't responded (time's up)
      if (input.trim()) {
        handleSend();
      } else {
        handleSend("[Time's up — no answer provided]");
      }
      return;
    }
    timerRef.current = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [timerActive, timeLeft, stageFinished]);

  const handleFinishStage = () => {
    if (!confirm(`Finish ${config.name} and move to the next step?`)) return;
    const s = getSocket();
    if (s) s.emit("session:advance", { sessionId: id, currentStage: stage });
  };

  const handleSend = (overrideText?: string) => {
    const text = overrideText ?? input.trim();
    if (!text || isTyping) return;
    setTimerActive(false);
    if (timerRef.current) clearTimeout(timerRef.current);

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    const s = getSocket();
    if (s) {
      s.emit("interview:message", {
        sessionId: id, stage,
        message: `[Language: ${language}] ${text}`,
      });
    }
  };

  // Voice Speech-to-Text
  const startVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert("Voice input is not supported in this browser. Please use Chrome.");
      return;
    }
    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = language === 'ur' ? 'ur-PK' : language === 'de' ? 'de-DE' : language === 'hi' ? 'hi-IN' : language === 'fr' ? 'fr-FR' : 'en-US';
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onstart = () => setIsVoiceListening(true);
    recognition.onend = () => setIsVoiceListening(false);
    recognition.onresult = (event: any) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }
      if (finalTranscript) setInput(prev => prev + ' ' + finalTranscript);
    };
    recognition.onerror = (e: any) => {
      console.error("Speech error", e);
      setIsVoiceListening(false);
    };
    recognition.start();
    recognitionRef.current = recognition;
  };

  const stopVoiceInput = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsVoiceListening(false);
    }
  };

  // Text-to-Speech for AI messages
  const speakMessage = (text: string) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language === 'ur' ? 'ur-PK' : language === 'de' ? 'de-DE' : language === 'hi' ? 'hi-IN' : language === 'fr' ? 'fr-FR' : 'en-US';
    utterance.rate = 1.0;
    
    // Auto-listen chain logic
    utterance.onend = () => {
      if (isAutoVoice && !stageFinished) {
        startVoiceInput();
      }
    };
    
    window.speechSynthesis.speak(utterance);
  };

  const timerPercent = (timeLeft / config.timePerQuestion) * 100;
  const timerColor = timeLeft > 30 ? '#10b981' : timeLeft > 10 ? '#f59e0b' : '#ef4444';

  return (
    <div className={styles.interviewRoom}>
      {/* Header */}
      <div className={styles.roomHeader}>
        <div className={styles.agentInfo}>
          <div className={styles.agentAvatar} style={{ background: `linear-gradient(135deg, ${config.color}, ${config.color}cc)` }}>
            {config.icon}
          </div>
          <div>
            <h2 className={styles.agentName}>{config.name}</h2>
            <span className={styles.agentStatus}>
              <span className={styles.statusDot}></span>
              {isTyping ? "Typing..." : "Online"}
            </span>
          </div>
        </div>

        {/* Voice Mode Toggle */}
        <button
          onClick={() => setIsAutoVoice(!isAutoVoice)}
          className={`${styles.modeToggle} ${isAutoVoice ? styles.modeActive : ""}`}
          title={isAutoVoice ? "Voice Mode ON (Auto-listen)" : "Voice Mode OFF"}
        >
          {isAutoVoice ? "🎙️ Voice Mode: ON" : "💬 Text Mode"}
        </button>

        {/* Language Picker */}
        <select
          value={language}
          onChange={e => setLanguage(e.target.value)}
          className={styles.languageSelect}
        >
          {LANGUAGES.map(l => <option key={l.code} value={l.code}>{l.label}</option>)}
        </select>

        <div className={styles.roomActions} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* Question Progress */}
          <span style={{ fontSize: 13, color: 'var(--text-secondary)', minWidth: 100 }}>
            Q {questionCount}/{config.maxQuestions}
          </span>

          {/* Timer */}
          {timerActive && !stageFinished && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <svg width="28" height="28" viewBox="0 0 36 36" style={{ transform: 'rotate(-90deg)' }}>
                <circle cx="18" cy="18" r="15" fill="none" stroke="var(--border)" strokeWidth="3" />
                <circle cx="18" cy="18" r="15" fill="none" stroke={timerColor} strokeWidth="3"
                  strokeDasharray="94" strokeDashoffset={94 - (94 * timerPercent) / 100}
                  style={{ transition: 'stroke-dashoffset 1s linear, stroke 0.3s' }} />
              </svg>
              <span style={{ fontWeight: 600, color: timerColor, fontSize: 14, minWidth: 28 }}>{timeLeft}s</span>
            </div>
          )}

          {stageFinished && (
            <span style={{ color: '#10b981', fontWeight: 600, fontSize: 13 }}>✅ Stage Complete!</span>
          )}

          <button onClick={handleFinishStage} className="btn btn-secondary btn-sm">
            Finish & Proceed →
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div style={{ height: 3, background: 'var(--border-subtle)' }}>
        <div style={{
          height: '100%', background: config.color,
          width: `${(questionCount / config.maxQuestions) * 100}%`,
          transition: 'width 0.4s ease'
        }} />
      </div>

      {/* Chat Messages */}
      <div className={styles.chatMessages}>
        {messages.map((msg) => (
          <div key={msg.id} className={`${styles.message} ${styles[`message-${msg.role}`]}`}>
            <div className={styles.messageAvatar}>
              {msg.role === "ai" ? (
                <div className={styles.avatarAi} style={{ background: `linear-gradient(135deg, ${config.color}, ${config.color}cc)` }}>
                  {config.icon}
                </div>
              ) : (
                <div className={styles.avatarUser}>You</div>
              )}
            </div>
            <div className={`${styles.messageBubble} ${styles[`bubble-${msg.role}`]}`}>
              <div className={styles.messageContent}>
                {msg.content.split("\n").map((line, i) => (
                  <span key={i}>
                    {line.startsWith("**") && line.endsWith("**")
                      ? <strong>{line.slice(2, -2)}</strong> : line}
                    {i < msg.content.split("\n").length - 1 && <br />}
                  </span>
                ))}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
                <span className={styles.messageTime}>
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                {msg.role === "ai" && (
                  <button
                    onClick={() => speakMessage(msg.content)}
                    title="Listen to this message"
                    style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, opacity: 0.6, padding: '0 4px' }}
                  >
                    🔊
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className={`${styles.message} ${styles["message-ai"]}`}>
            <div className={styles.messageAvatar}>
              <div className={styles.avatarAi} style={{ background: `linear-gradient(135deg, ${config.color}, ${config.color}cc)` }}>
                {config.icon}
              </div>
            </div>
            <div className={`${styles.messageBubble} ${styles["bubble-ai"]}`}>
              <div className={styles.typingIndicator}>
                <span></span><span></span><span></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className={styles.inputArea}>
        <div className={styles.inputWrapper}>
          {/* Voice Input Button */}
          <button
            onClick={isVoiceListening ? stopVoiceInput : startVoiceInput}
            disabled={isTyping || stageFinished}
            title={isVoiceListening ? "Stop listening" : "Start voice input"}
            className={`${styles.voiceBtn} ${isVoiceListening ? styles.voiceBtnActive : ""}`}
            style={{
              background: isVoiceListening ? '#ef4444' : 'var(--bg-secondary)',
              border: '1px solid var(--border)', borderRadius: 10, cursor: 'pointer',
              padding: '8px 12px', fontSize: 18, flexShrink: 0,
              animation: isVoiceListening ? 'pulse-border 1.5s infinite' : 'none'
            }}
          >
            {isVoiceListening ? "⏹️" : "🎙️"}
          </button>
          <textarea
            ref={inputRef}
            className={styles.chatInput}
            placeholder={stageFinished ? "Stage complete! Click 'Finish & Proceed' →" : `Type your answer to ${config.name}...`}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
            }}
            rows={1}
            disabled={isTyping || stageFinished}
          />
          <button
            className={styles.sendBtn}
            onClick={() => handleSend()}
            disabled={!input.trim() || isTyping || stageFinished}
          >
            ➤
          </button>
        </div>
        <p className={styles.inputHint}>
          {isVoiceListening ? "🎙️ Listening... Speak now" : "Press Enter to send • Shift+Enter for new line • 🎙️ for voice"}
        </p>
      </div>
    </div>
  );
}
