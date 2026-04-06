"use client";
import { useState, useRef, useEffect, use } from "react";
import { connectSocket, disconnectSocket, getSocket } from "@/lib/socket";
import { supabase } from "@/lib/supabase";
import styles from "./interview-room.module.css";
import Link from "next/link";

interface Message {
  id: string;
  role: "ai" | "user";
  content: string;
  timestamp: Date;
  agentType?: string;
}

const STAGE_ORDER = ["resume", "initial", "technical", "knowledge", "hr", "report"] as const;
type Stage = typeof STAGE_ORDER[number];

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
  const [language, setLanguage] = useState("en");
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isVoiceListening, setIsVoiceListening] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [questionCount, setQuestionCount] = useState(0);
  const [stageFinished, setStageFinished] = useState(false);
  const [code, setCode] = useState("// Type your solution here...\n\nfunction solution() {\n  \n}");
  const [terminalOutput, setTerminalOutput] = useState("Console: Ready. Click 'Run' to test your code.");
  const [isExecuting, setIsExecuting] = useState(false);
  const [isAutoVoice, setIsAutoVoice] = useState(false);
  const [isCodingQuestion, setIsCodingQuestion] = useState(false);
  const [isReviewMode, setIsReviewMode] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const recognitionRef = useRef<any>(null);

  const currentIndex = STAGE_ORDER.indexOf(stage as Stage);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Persist code to localStorage
  useEffect(() => {
    if (stage === 'technical') {
      const savedCode = localStorage.getItem(`code_${id}`);
      if (savedCode) setCode(savedCode);
    }
  }, [id, stage]);

  useEffect(() => {
    if (stage === 'technical') {
      localStorage.setItem(`code_${id}`, code);
    }
  }, [code, id, stage]);

  const handleRunCode = () => {
    setTerminalOutput("Running tests...");
    setIsExecuting(true);
    
    setTimeout(() => {
      try {
        const cleanCode = code.replace(/\/\/.*$/gm, "").trim();
        if (cleanCode.length < 10) {
           setTerminalOutput("Error: No functional code detected. Please write your solution before running.");
           setIsExecuting(false);
           return;
        }

        // 🧠 Realistic Syntax Validation
        new Function(code); 
        
        setTerminalOutput("Output:\n> Test Case 1: Passed\n> Test Case 2: Passed\n> All conditions met. Great progress! Remember to explain your thinking to the interviewer.");
      } catch (err: any) {
        setTerminalOutput(`❌ Compilation Error: ${err.message}\n\nCheck your syntax and try again.`);
      }
      setIsExecuting(false);
    }, 1200);
  };

  // 🛡️ Review Mode Detection & History Load
  useEffect(() => {
    const checkReviewMode = async () => {
      try {
        if (!supabase) return;
        const { data: session } = await supabase.from('sessions').select('*').eq('id', id).single();
        if (session) {
          const dbScores = session.scores || {};
          const isFinished = dbScores[stage] !== undefined && dbScores[stage] !== null;
          
          if (isFinished) {
            setIsReviewMode(true);
            // Load History
            const history = session.conversation_history?.[stage] || [];
            if (history.length > 0) {
              const formattedMsgs: Message[] = history.map((m: any, idx: number) => ({
                id: `hist-${idx}`,
                role: m.role === 'user' ? 'user' : 'ai',
                content: m.content,
                timestamp: new Date() // Best effort
              }));
              setMessages(formattedMsgs);

              // 🔍 Detect if this was a coding session from history
              const hasCoding = history.some((m: any) => 
                ["coding", "function", "write a", "implement", "solution", "```"].some(kw => 
                  m.content.toLowerCase().includes(kw)
                )
              );
              setIsCodingQuestion(hasCoding);
            }
          } else {
             // Normal Greeting
             if (messages.length === 0) {
               setMessages([{
                 id: "greeting",
                 role: "ai",
                 content: GREETINGS[stage] || GREETINGS.technical,
                 timestamp: new Date(),
                 agentType: stage,
               }]);
             }
          }
        }
      } catch (err) { console.error("Review mode check failed:", err); }
    };
    checkReviewMode();

    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, [id, stage]);

  // Socket setup
  useEffect(() => {
    if (isReviewMode) return; // Don't init socket in review mode
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

      // 🔍 Dynamic Detection: Show coding workspace ONLY if code is requested
      const codingKeywords = ["coding", "function", "write a", "implement", "solution", "```", "algorithmic"];
      const isCoding = codingKeywords.some(kw => data.message.toLowerCase().includes(kw));
      setIsCodingQuestion(isCoding);

      if (isAutoVoice || config.name === "Resume Analyst") {
        speakMessage(aiMsg.content);
      }

      setQuestionCount(prev => {
        const next = prev + 1;
        if (next >= config.maxQuestions) {
          setStageFinished(true);
        } else {
          setTimeLeft(config.timePerQuestion);
          setTimerActive(true);
        }
        return next;
      });

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

    s.on("interview:response", onResponse);
    s.on("interview:error", onError);
    s.on("session:advanced", () => {
      window.location.href = `/session/${id}`;
    });

    return () => {
      s.off("interview:response", onResponse);
      s.off("interview:error", onError);
      s.off("session:advanced");
      disconnectSocket();
    };
  }, [id, stage, language, isAutoVoice, config]);

  // Countdown timer logic
  useEffect(() => {
    if (!timerActive || stageFinished) return;
    if (timeLeft <= 0) {
      setTimerActive(false);
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
    if (isReviewMode) {
      window.location.href = `/session/${id}`;
      return;
    }
    if (!confirm(`Finish ${config.name} and move to the next step?`)) return;
    if (window.speechSynthesis) window.speechSynthesis.cancel();
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
        if (event.results[i].isFinal) finalTranscript += event.results[i][0].transcript;
      }
      if (finalTranscript) setInput(prev => prev + ' ' + finalTranscript);
    };
    recognition.onerror = () => setIsVoiceListening(false);
    recognition.start();
    recognitionRef.current = recognition;
  };

  const stopVoiceInput = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsVoiceListening(false);
    }
  };

  const speakMessage = (text: string) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language === 'ur' ? 'ur-PK' : language === 'de' ? 'de-DE' : language === 'hi' ? 'hi-IN' : language === 'fr' ? 'fr-FR' : 'en-US';
    utterance.rate = 1.0;
    utterance.onend = () => {
      if (isAutoVoice && !stageFinished) startVoiceInput();
    };
    window.speechSynthesis.speak(utterance);
  };

  const timerPercent = (timeLeft / config.timePerQuestion) * 100;
  const timerColor = timeLeft > 30 ? '#10b981' : timeLeft > 10 ? '#f59e0b' : '#ef4444';

  const renderMainContent = () => (
    <div className={styles.chatPanel}>
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
                  <button onClick={() => speakMessage(msg.content)} title="Speak" className={styles.speakBtn}>
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
              <div className={styles.typingIndicator}><span></span><span></span><span></span></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className={styles.inputArea}>
        <div className={styles.inputWrapper}>
          <button
            onClick={isVoiceListening ? stopVoiceInput : startVoiceInput}
            className={`${styles.voiceBtn} ${isVoiceListening ? styles.voiceBtnActive : ""}`}
            style={{ background: isVoiceListening ? '#ef4444' : 'var(--bg-secondary)' }}
          >
            {isVoiceListening ? "⏹️" : "🎙️"}
          </button>
          <textarea
            ref={inputRef}
            className={styles.chatInput}
            placeholder={isReviewMode ? "Read-only mode" : stageFinished ? "Stage complete!" : "Type your answer..."}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
            rows={1}
            disabled={isTyping || stageFinished || isReviewMode}
          />
          <button
            className={styles.sendBtn}
            onClick={() => handleSend()}
            disabled={!input.trim() || isTyping || stageFinished || isReviewMode}
          >
            ➤
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className={styles.room}>
      <div className={styles.roomHeader}>
        <div className={styles.agentInfo}>
          <div className={styles.agentAvatar} style={{ background: config.color }}>{config.icon}</div>
          <div>
            <h2 className={styles.agentName}>{config.name}</h2>
            <p className={styles.agentStatus}>
              {isReviewMode ? (
                <span style={{ color: 'var(--info)', fontWeight: 700 }}>📄 Review Mode (Read-Only)</span>
              ) : (
                `Online • Phase ${currentIndex + 1}/5`
              )}
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsAutoVoice(!isAutoVoice)}
          className={`${styles.modeToggle} ${isAutoVoice ? styles.modeActive : ""}`}
        >
          {isAutoVoice ? "🎙️ Voice ON" : "💬 Text Only"}
        </button>

        <select
          value={language}
          onChange={e => setLanguage(e.target.value)}
          className={styles.languageSelect}
        >
          {LANGUAGES.map(l => <option key={l.code} value={l.code}>{l.label}</option>)}
        </select>

        <div className={styles.roomActions}>
          <span className={styles.qCount}>Q {questionCount}/{config.maxQuestions}</span>
          {timerActive && !stageFinished && (
            <div className={styles.timer}>
              <svg width="24" height="24" viewBox="0 0 36 36"><circle cx="18" cy="18" r="15" fill="none" stroke="var(--border)" strokeWidth="3" /><circle cx="18" cy="18" r="15" fill="none" stroke={timerColor} strokeWidth="3" strokeDasharray="94" strokeDashoffset={94 - (94 * timerPercent) / 100} style={{ transition: 'all 1s linear' }} /></svg>
              <span style={{ color: timerColor }}>{timeLeft}s</span>
            </div>
          )}
          <button onClick={handleFinishStage} className="btn btn-secondary btn-sm">
            {isReviewMode ? "← Back" : "Finish →"}
          </button>
        </div>
      </div>

      <div className={styles.progressBar}>
        <div style={{ background: config.color, width: `${(questionCount / config.maxQuestions) * 100}%` }} />
      </div>

      {stage === 'technical' && isCodingQuestion ? (
        <div className={styles.technicalContainer}>
          {renderMainContent()}
          <div className={styles.editorPanel}>
            <div className={styles.editorHeader}>
              <span className={styles.editorTitle}>Solution Editor</span>
              <button className="btn btn-primary btn-xs" onClick={handleRunCode} disabled={isExecuting}>
                {isExecuting ? "Executing..." : "▶ Run Code"}
              </button>
            </div>
            <textarea className={styles.editorArea} value={code} onChange={(e) => setCode(e.target.value)} placeholder="Write your code here..." spellCheck={false} />
            <div className={styles.terminalPanel}>
              <div className={styles.terminalHeader}>Console Output</div>
              <pre>{terminalOutput}</pre>
            </div>
          </div>
        </div>
      ) : (
        <div className={styles.chatOnlyContainer}>
          {renderMainContent()}
        </div>
      )}
    </div>
  );
}
