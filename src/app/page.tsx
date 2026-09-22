"use client";

import { useState, useEffect, useRef } from "react";
import {
  Mic,
  Cpu,
  CheckCircle2,
  CalendarCheck2,
  Wifi,
  Battery,
  Sparkles,
  Volume2,
  AlertCircle,
  Clock,
  Calendar,
  ShieldCheck,
  Check,
  X,
  HelpCircle,
  RotateCcw,
  Keyboard,
  ArrowRight,
} from "lucide-react";
import { extractIntent, type IntentResult } from "./actions";

type AgentStatus =
  | "idle"
  | "listening"
  | "processing"
  | "created"
  | "unhandled"
  | "pending_confirmation";

interface ReminderItem {
  id: string;
  title: string;
  date: string;
  time: string;
  confidence: number;
}

interface PendingReminder {
  title: string;
  date: string;
  time: string;
  confidence: number;
}

// TypeScript declarations for Web Speech API
interface SpeechRecognitionEventLike extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEventLike extends Event {
  error: string;
  message?: string;
}

interface SpeechRecognitionLike extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onstart: ((this: SpeechRecognitionLike, ev: Event) => void) | null;
  onresult: ((this: SpeechRecognitionLike, ev: SpeechRecognitionEventLike) => void) | null;
  onerror: ((this: SpeechRecognitionLike, ev: SpeechRecognitionErrorEventLike) => void) | null;
  onend: ((this: SpeechRecognitionLike, ev: Event) => void) | null;
  onspeechend: ((this: SpeechRecognitionLike, ev: Event) => void) | null;
}

declare global {
  interface Window {
    SpeechRecognition?: {
      new (): SpeechRecognitionLike;
    };
    webkitSpeechRecognition?: {
      new (): SpeechRecognitionLike;
    };
  }
}

export default function Home() {
  const [status, setStatus] = useState<AgentStatus>("idle");
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [statusSubtitle, setStatusSubtitle] = useState<string>("Tap mic or press 1 / 2 to run demo");
  const [transcript, setTranscript] = useState<string>("");
  const [isSupported, setIsSupported] = useState<boolean>(true);
  const [remainingTime, setRemainingTime] = useState<number>(6);
  const [reminders, setReminders] = useState<ReminderItem[]>([]);
  const [pendingReminder, setPendingReminder] = useState<PendingReminder | null>(null);

  // Typed input fallback state
  const [showTypedInput, setShowTypedInput] = useState<boolean>(false);
  const [typedValue, setTypedValue] = useState<string>("");

  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const transcriptRef = useRef<string>("");
  const hardTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const silenceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isListeningRef = useRef<boolean>(false);
  const textInputRef = useRef<HTMLInputElement | null>(null);

  // Reset entire demo state
  const handleReset = () => {
    stopListening();
    setReminders([]);
    setPendingReminder(null);
    setTranscript("");
    transcriptRef.current = "";
    setTypedValue("");
    setStatus("idle");
    setStatusMessage("Tap mic to speak");
    setStatusSubtitle("ContextOS is ready and standing by");
  };

  // Helper to add a confirmed reminder
  const addReminder = (item: { title: string; date: string; time: string; confidence: number }) => {
    const newReminder: ReminderItem = {
      id: Date.now().toString(),
      title: item.title,
      date: item.date,
      time: item.time,
      confidence: item.confidence,
    };
    setReminders((prev) => [newReminder, ...prev]);

    const dateTimeStr = [item.date, item.time].filter(Boolean).join(" ");
    setStatus("created");
    setStatusMessage(`✓ Reminder created: ${item.title}${dateTimeStr ? `, ${dateTimeStr}` : ""}`);
    setStatusSubtitle(`Confidence ${(item.confidence * 100).toFixed(0)}% • Synced locally`);
  };

  // Process extractIntent result based on confidence tiers
  const processIntentResult = (result: IntentResult) => {
    console.log("[ContextOS] Processing Intent Result:", result);

    if (result.error) {
      setPendingReminder(null);
      setStatus("unhandled");
      setStatusMessage("Could not process intent");
      setStatusSubtitle(result.error);
      return;
    }

    if (result.intent === "create_reminder" && result.title) {
      if (result.confidence >= 0.85) {
        setPendingReminder(null);
        addReminder({
          title: result.title,
          date: result.date,
          time: result.time,
          confidence: result.confidence,
        });
      } else if (result.confidence >= 0.5) {
        setPendingReminder({
          title: result.title,
          date: result.date,
          time: result.time,
          confidence: result.confidence,
        });
        setStatus("pending_confirmation");
        setStatusMessage(`Confirmation required (${(result.confidence * 100).toFixed(0)}% confidence)`);
        setStatusSubtitle("Review suggestion before adding to schedule");
      } else {
        setPendingReminder(null);
        setStatus("unhandled");
        setStatusMessage("Didn't catch an actionable intent");
        setStatusSubtitle("Try saying a specific task, time, or date");
      }
    } else {
      setPendingReminder(null);
      setStatus("unhandled");
      setStatusMessage("Didn't catch an actionable intent");
      setStatusSubtitle("Try saying a specific task, time, or date");
    }
  };

  // Call the server action extractIntent
  const handleExtractIntent = async (text: string) => {
    console.log("[ContextOS] Calling extractIntent server action for:", text);
    stopListening();
    setPendingReminder(null);
    setStatus("processing");
    setStatusMessage("Processing locally...");
    setStatusSubtitle("Extracting intent via local context engine");

    try {
      const result: IntentResult = await extractIntent(text);
      processIntentResult(result);
    } catch (err) {
      console.error("[ContextOS] Failed to extract intent:", err);
      setStatus("unhandled");
      setStatusMessage("Didn't catch an actionable intent");
      setStatusSubtitle("Speech could not be parsed");
    }
  };

  // Handle user confirming inline card
  const handleConfirmPending = () => {
    if (pendingReminder) {
      addReminder(pendingReminder);
      setPendingReminder(null);
    }
  };

  // Handle user dismissing inline card
  const handleDismissPending = () => {
    setPendingReminder(null);
    setStatus("idle");
    setStatusMessage("Suggestion dismissed");
    setStatusSubtitle("ContextOS is ready and standing by");
  };

  // Handle typed fallback submission
  const handleTypedSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = typedValue.trim();
    if (!trimmed) return;
    transcriptRef.current = trimmed;
    setTranscript(trimmed);
    setTypedValue("");
    handleExtractIntent(trimmed);
  };

  // Check Web Speech API support on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognitionClass =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognitionClass) {
        setIsSupported(false);
      }
    }
  }, []);

  const handleExtractIntentRef = useRef(handleExtractIntent);
  useEffect(() => {
    handleExtractIntentRef.current = handleExtractIntent;
  });

  // Hidden keyboard shortcuts for demo presentation:
  // Key "1": English test phrase ("Let's meet Rahul tomorrow at 5.")
  // Key "2": Hinglish stretch phrase ("Kal 5 baje Rahul se milna hai")
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Do not trigger hotkeys if user is currently typing in an input
      const target = e.target as HTMLElement;
      if (target?.tagName === "INPUT" || target?.tagName === "TEXTAREA") {
        return;
      }

      if (e.key === "2") {
        e.preventDefault();
        const hinglishPhrase = "Kal 5 baje Rahul se milna hai";
        transcriptRef.current = hinglishPhrase;
        setTranscript(hinglishPhrase);
        handleExtractIntentRef.current(hinglishPhrase);
      } else if (e.key === "1") {
        e.preventDefault();
        const engPhrase = "Let's meet Rahul tomorrow at 5.";
        transcriptRef.current = engPhrase;
        setTranscript(engPhrase);
        handleExtractIntentRef.current(engPhrase);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const clearAllTimers = () => {
    if (hardTimeoutRef.current) {
      clearTimeout(hardTimeoutRef.current);
      hardTimeoutRef.current = null;
    }
    if (silenceTimeoutRef.current) {
      clearTimeout(silenceTimeoutRef.current);
      silenceTimeoutRef.current = null;
    }
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }
  };

  const stopListening = () => {
    clearAllTimers();
    if (recognitionRef.current && isListeningRef.current) {
      isListeningRef.current = false;
      try {
        recognitionRef.current.stop();
      } catch {
        // Recognition might already be stopped
      }
    }
  };

  const startListening = () => {
    if (typeof window === "undefined") return;

    const SpeechRecognitionClass =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognitionClass) {
      setIsSupported(false);
      setShowTypedInput(true);
      return;
    }

    stopListening();
    setPendingReminder(null);

    try {
      const recognition = new SpeechRecognitionClass();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      transcriptRef.current = "";
      setTranscript("");
      setRemainingTime(6);
      setStatus("listening");
      setStatusMessage("Listening...");
      setStatusSubtitle("Auto-stops on silence or after 6s");
      isListeningRef.current = true;

      recognition.onstart = () => {
        hardTimeoutRef.current = setTimeout(() => {
          stopListening();
        }, 6000);

        let secondsLeft = 6;
        countdownIntervalRef.current = setInterval(() => {
          secondsLeft -= 1;
          setRemainingTime(secondsLeft >= 0 ? secondsLeft : 0);
          if (secondsLeft <= 0) {
            if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
          }
        }, 1000);
      };

      recognition.onresult = (event: SpeechRecognitionEventLike) => {
        let currentTranscript = "";
        for (let i = 0; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }

        transcriptRef.current = currentTranscript;
        setTranscript(currentTranscript);

        if (silenceTimeoutRef.current) {
          clearTimeout(silenceTimeoutRef.current);
        }

        silenceTimeoutRef.current = setTimeout(() => {
          stopListening();
        }, 1800);
      };

      recognition.onspeechend = () => {
        if (silenceTimeoutRef.current) clearTimeout(silenceTimeoutRef.current);
        silenceTimeoutRef.current = setTimeout(() => {
          stopListening();
        }, 1200);
      };

      recognition.onerror = (event: SpeechRecognitionErrorEventLike) => {
        console.warn("[ContextOS] Speech recognition error:", event.error);
        if (event.error !== "no-speech") {
          stopListening();
        }
      };

      recognition.onend = () => {
        isListeningRef.current = false;
        clearAllTimers();

        const finalText = transcriptRef.current.trim();
        if (finalText.length > 0) {
          handleExtractIntent(finalText);
        } else {
          setStatus("idle");
          setStatusMessage("Tap mic to speak");
          setStatusSubtitle("ContextOS is ready and standing by");
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error("[ContextOS] Failed to start recognition:", err);
      setStatus("idle");
    }
  };

  const handleMicClick = () => {
    if (status === "listening") {
      stopListening();
    } else {
      startListening();
    }
  };

  useEffect(() => {
    return () => {
      clearAllTimers();
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // noop
        }
      }
    };
  }, []);

  const getStatusDisplayConfig = () => {
    switch (status) {
      case "listening":
        return {
          title: "Listening...",
          subtitle: `Auto-stops on silence or in ${remainingTime}s`,
          color: "text-sky-400",
          ringColor: "ring-sky-500/50",
          badgeBorder: "border-sky-500/30",
          badgeBg: "bg-sky-950/40",
          icon: <Volume2 className="w-4 h-4 text-sky-400 animate-pulse shrink-0" />,
        };
      case "processing":
        return {
          title: statusMessage || "Processing locally...",
          subtitle: statusSubtitle || "Resolving intent & dates",
          color: "text-amber-400",
          ringColor: "ring-amber-500/50",
          badgeBorder: "border-amber-500/30",
          badgeBg: "bg-amber-950/40",
          icon: <Cpu className="w-4 h-4 text-amber-400 animate-spin shrink-0" />,
        };
      case "created":
        return {
          title: statusMessage || "✓ Reminder created",
          subtitle: statusSubtitle,
          color: "text-emerald-400",
          ringColor: "ring-emerald-500/50",
          badgeBorder: "border-emerald-500/30",
          badgeBg: "bg-emerald-950/40",
          icon: <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />,
        };
      case "pending_confirmation":
        return {
          title: statusMessage || "Confirmation needed",
          subtitle: statusSubtitle,
          color: "text-indigo-400",
          ringColor: "ring-indigo-500/50",
          badgeBorder: "border-indigo-500/30",
          badgeBg: "bg-indigo-950/40",
          icon: <HelpCircle className="w-4 h-4 text-indigo-400 shrink-0" />,
        };
      case "unhandled":
        return {
          title: statusMessage || "Didn't catch an actionable intent",
          subtitle: statusSubtitle,
          color: "text-zinc-400",
          ringColor: "ring-zinc-700/50",
          badgeBorder: "border-zinc-700/40",
          badgeBg: "bg-zinc-900/60",
          icon: <AlertCircle className="w-4 h-4 text-zinc-400 shrink-0" />,
        };
      case "idle":
      default:
        return {
          title: statusMessage || "Tap mic to speak",
          subtitle: statusSubtitle || "Say a meeting, task, or reminder",
          color: "text-zinc-400",
          ringColor: "ring-zinc-700/50",
          badgeBorder: "border-zinc-800",
          badgeBg: "bg-zinc-900/60",
          icon: <Sparkles className="w-4 h-4 text-zinc-400 shrink-0" />,
        };
    }
  };

  const current = getStatusDisplayConfig();

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col items-center justify-center p-3 sm:p-6 select-none">
      {/* Ambient background glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden flex items-center justify-center">
        <div className="w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] -translate-y-20" />
        <div className="w-[400px] h-[400px] bg-sky-500/10 rounded-full blur-[100px] translate-y-32" />
      </div>

      {/* Simulated Phone Container (~390px width) */}
      <div className="relative w-full max-w-[390px] h-[844px] rounded-[50px] border-[8px] border-zinc-800/80 bg-zinc-900/95 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_0_1px_rgba(255,255,255,0.08)] flex flex-col overflow-hidden backdrop-blur-xl">
        
        {/* Phone Top Speaker & Notch */}
        <div className="absolute top-0 left-0 right-0 z-30 flex justify-center pt-3">
          <div className="w-28 h-4 bg-zinc-950 rounded-full flex items-center justify-center space-x-1.5 px-3">
            <div className="w-2.5 h-2.5 rounded-full bg-zinc-900 border border-zinc-800" />
            <div className="w-10 h-1 rounded-full bg-zinc-800/60" />
          </div>
        </div>

        {/* System Status Bar */}
        <div className="pt-3 px-7 pb-2 flex justify-between items-center text-[12px] font-medium text-zinc-400 z-20">
          <span>9:41</span>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-semibold tracking-wider text-zinc-400 bg-zinc-800/60 px-1.5 py-0.5 rounded">5G</span>
            <Wifi className="w-3.5 h-3.5 text-zinc-400" />
            <Battery className="w-4 h-4 text-zinc-300" />
          </div>
        </div>

        {/* Header Branding & Reset Button (Top Right) */}
        <header className="px-5 pt-2 pb-2 flex items-center justify-between border-b border-zinc-800/50">
          <div className="flex items-center space-x-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-indigo-600 via-sky-500 to-indigo-400 flex items-center justify-center shadow-md shadow-indigo-500/20">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-base font-semibold tracking-tight text-white flex items-center gap-1.5">
                ContextOS
              </h1>
              <p className="text-[10px] text-zinc-400 uppercase tracking-wider font-mono">
                On-Device Assistant
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-zinc-800/70 border border-zinc-700/40 text-[10px] text-emerald-400 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>NPU</span>
            </div>

            {/* Top Right Reset Button */}
            <button
              type="button"
              onClick={handleReset}
              title="Reset demo (clear reminders & return to idle)"
              className="p-1.5 rounded-full bg-zinc-800/80 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-100 border border-zinc-700/50 transition-all active:scale-90"
              aria-label="Reset demo"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </header>

        {/* Browser Warning if Web Speech is unsupported */}
        {!isSupported && (
          <div className="mx-4 mt-2 p-2 rounded-xl bg-amber-950/40 border border-amber-500/30 text-amber-300 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-medium">Mic unready:</span> Use the typed input or press 1 / 2 below.
            </div>
          </div>
        )}

        {/* Main Phone Body */}
        <div className="flex-1 flex flex-col justify-between px-5 py-2.5 overflow-y-auto">
          
          {/* Upper Hero: Mic, Status, Privacy Badge, Live Transcript */}
          <div className="flex flex-col items-center justify-center my-auto">
            
            {/* Centered Large Mic Button */}
            <div className="relative flex items-center justify-center my-2.5">
              
              {/* Pulsing rings when listening */}
              {status === "listening" && (
                <>
                  <div className="absolute w-36 h-36 rounded-full bg-sky-500/15 animate-ping" />
                  <div className="absolute w-32 h-32 rounded-full border border-sky-400/30 animate-pulse" />
                </>
              )}

              {status === "processing" && (
                <div className="absolute w-32 h-32 rounded-full border-2 border-dashed border-amber-400/40 animate-spin" />
              )}

              {status === "created" && (
                <div className="absolute w-32 h-32 rounded-full bg-emerald-500/20 blur-md" />
              )}

              <button
                type="button"
                onClick={handleMicClick}
                aria-label={status === "listening" ? "Stop listening" : "Start listening"}
                className={`group relative z-10 w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 transform active:scale-95 shadow-2xl focus:outline-none ring-4 ${current.ringColor} ${
                  status === "listening"
                    ? "bg-gradient-to-b from-sky-500 to-indigo-600 shadow-sky-500/40 text-white"
                    : status === "processing"
                    ? "bg-gradient-to-b from-amber-500 to-orange-600 shadow-amber-500/30 text-white"
                    : status === "created"
                    ? "bg-gradient-to-b from-emerald-500 to-teal-600 shadow-emerald-500/30 text-white"
                    : status === "pending_confirmation"
                    ? "bg-gradient-to-b from-indigo-600 to-purple-700 shadow-indigo-500/30 text-white"
                    : "bg-gradient-to-b from-zinc-800 to-zinc-900 border border-zinc-700/60 text-zinc-300 hover:text-white hover:border-zinc-500"
                }`}
              >
                {status === "created" ? (
                  <CheckCircle2 className="w-10 h-10 text-white transition-transform group-hover:scale-105" />
                ) : status === "processing" ? (
                  <Cpu className="w-10 h-10 text-white animate-pulse" />
                ) : status === "listening" ? (
                  <Mic className="w-10 h-10 animate-bounce" />
                ) : (
                  <Mic className="w-10 h-10 transition-transform group-hover:scale-105" />
                )}
              </button>
            </div>

            {/* Status Line Below Mic */}
            <div className="flex flex-col items-center text-center space-y-1 mb-1 max-w-full px-1">
              <div
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-semibold tracking-wide transition-all duration-300 max-w-full truncate ${current.badgeBorder} ${current.badgeBg} ${current.color}`}
              >
                {current.icon}
                <span className="truncate">{current.title}</span>
              </div>
              <p className="text-[11px] text-zinc-400 font-normal truncate max-w-full">
                {current.subtitle}
              </p>
            </div>

            {/* Privacy Narrative Badge */}
            <div className="mt-0.5 mb-1.5">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-zinc-900/90 border border-zinc-800 text-[10px] font-medium text-emerald-400/90 tracking-wide shadow-sm">
                <ShieldCheck className="w-3 h-3 text-emerald-400 shrink-0" />
                <span>Processed on device • 0 cloud uploads</span>
              </div>
            </div>

            {/* Inline Confirm/Dismiss Card (for confidence 0.5 - 0.85) */}
            {pendingReminder && (
              <div className="w-full my-1.5 p-3 rounded-2xl bg-indigo-950/40 border border-indigo-500/40 shadow-lg animate-slide-in">
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-mono tracking-wider text-indigo-400 font-semibold flex items-center gap-1">
                      <HelpCircle className="w-3 h-3" />
                      Suggested Reminder
                    </span>
                    <h4 className="text-xs font-semibold text-zinc-100">
                      Add reminder for &ldquo;{pendingReminder.title}&rdquo;?
                    </h4>
                    <div className="flex items-center gap-2 text-[11px] text-zinc-300 pt-0.5">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-indigo-400" />
                        {pendingReminder.date || "Tomorrow"}
                      </span>
                      {pendingReminder.time && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-indigo-400" />
                          {pendingReminder.time}
                        </span>
                      )}
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-900/60 border border-indigo-400/30 text-indigo-300 font-mono">
                        {(pendingReminder.confidence * 100).toFixed(0)}% conf
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-2.5 pt-2 border-t border-indigo-500/20">
                  <button
                    type="button"
                    onClick={handleConfirmPending}
                    className="flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition-all shadow-sm active:scale-95"
                  >
                    <Check className="w-3.5 h-3.5" />
                    Add Reminder
                  </button>
                  <button
                    type="button"
                    onClick={handleDismissPending}
                    className="flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl bg-zinc-800/80 hover:bg-zinc-800 text-zinc-300 text-xs font-medium transition-all border border-zinc-700/50 active:scale-95"
                  >
                    <X className="w-3.5 h-3.5" />
                    Dismiss
                  </button>
                </div>
              </div>
            )}

            {/* Live Transcript Display Box */}
            <div className="w-full mt-1 mb-1.5">
              <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/60 p-2 shadow-inner">
                <div className="flex items-center justify-between text-[10px] text-zinc-400 uppercase tracking-wider font-mono mb-1">
                  <span className="flex items-center gap-1">
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        status === "listening"
                          ? "bg-sky-400 animate-pulse"
                          : "bg-zinc-500"
                      }`}
                    />
                    Live Transcript
                  </span>
                  <div className="flex items-center gap-2">
                    {status === "listening" && (
                      <span className="flex items-center gap-1 text-sky-400 font-sans normal-case font-medium">
                        <Clock className="w-3 h-3" />
                        {remainingTime}s
                      </span>
                    )}
                    {/* Toggle Typed Input Fallback */}
                    <button
                      type="button"
                      onClick={() => {
                        setShowTypedInput((prev) => !prev);
                        setTimeout(() => textInputRef.current?.focus(), 100);
                      }}
                      title="Toggle typed input fallback"
                      className="text-zinc-400 hover:text-zinc-200 transition-colors flex items-center gap-1 text-[10px] font-sans normal-case"
                    >
                      <Keyboard className="w-3 h-3" />
                      <span>{showTypedInput ? "Hide text" : "Type"}</span>
                    </button>
                  </div>
                </div>

                <div className="min-h-[32px] flex items-center justify-center text-center px-1">
                  {transcript ? (
                    <p className="text-xs text-zinc-200 font-medium italic leading-relaxed break-words line-clamp-2">
                      &ldquo;{transcript}&rdquo;
                    </p>
                  ) : status === "listening" ? (
                    <p className="text-xs text-sky-400/80 animate-pulse">
                      Listening... speak now
                    </p>
                  ) : (
                    <p className="text-[11px] text-zinc-500">
                      Tap mic or press &ldquo;1&rdquo; / &ldquo;2&rdquo; on keyboard
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Typed Input Fallback Form (expandable / always accessible for recording) */}
            {showTypedInput && (
              <form
                onSubmit={handleTypedSubmit}
                className="w-full flex items-center gap-1.5 my-1 animate-slide-in"
              >
                <div className="relative flex-1">
                  <input
                    ref={textInputRef}
                    type="text"
                    value={typedValue}
                    onChange={(e) => setTypedValue(e.target.value)}
                    placeholder="Type reminder (e.g. Kal 5 baje Rahul...)"
                    className="w-full px-3 py-1.5 rounded-xl bg-zinc-950 border border-zinc-700/70 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <button
                  type="submit"
                  disabled={!typedValue.trim()}
                  className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:hover:bg-indigo-600 text-white text-xs font-medium flex items-center gap-1 transition-all shrink-0"
                >
                  <span>Run</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </form>
            )}

            {/* Scripted Demo Shortcut Controls */}
            <div className="w-full pt-1 space-y-1">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 px-1 flex items-center justify-between">
                <span>Demo Scripts (Press key or click)</span>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {/* Script 1: English */}
                <button
                  type="button"
                  onClick={() => {
                    const phrase = "Let's meet Rahul tomorrow at 5.";
                    transcriptRef.current = phrase;
                    setTranscript(phrase);
                    handleExtractIntent(phrase);
                  }}
                  className="p-1.5 rounded-lg bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700/50 text-[10px] text-zinc-300 font-medium text-left transition-all truncate group"
                  title="Press key '1' anytime to run this phrase"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-zinc-200">English</span>
                    <kbd className="px-1 py-0.2 rounded bg-zinc-900 border border-zinc-700 text-[9px] text-zinc-400 font-mono">1</kbd>
                  </div>
                  <span className="text-[9px] text-zinc-400 block truncate group-hover:text-zinc-300">&ldquo;Let&apos;s meet Rahul...&rdquo;</span>
                </button>

                {/* Script 2: Hinglish Stretch Goal */}
                <button
                  type="button"
                  onClick={() => {
                    const phrase = "Kal 5 baje Rahul se milna hai";
                    transcriptRef.current = phrase;
                    setTranscript(phrase);
                    handleExtractIntent(phrase);
                  }}
                  className="p-1.5 rounded-lg bg-indigo-950/40 hover:bg-indigo-900/50 border border-indigo-500/40 text-[10px] text-indigo-300 font-medium text-left transition-all truncate group"
                  title="Press key '2' anytime to run this Hinglish phrase"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-indigo-200">Hinglish</span>
                    <kbd className="px-1 py-0.2 rounded bg-indigo-900/80 border border-indigo-500/40 text-[9px] text-indigo-300 font-mono">2</kbd>
                  </div>
                  <span className="text-[9px] text-indigo-300/80 block truncate group-hover:text-indigo-200">&ldquo;Kal 5 baje Rahul...&rdquo;</span>
                </button>
              </div>
            </div>

          </div>

          {/* Lower Section: Upcoming Reminders */}
          <div className="mt-1.5 pt-2.5 border-t border-zinc-800/60 flex-1 flex flex-col min-h-0">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <CalendarCheck2 className="w-4 h-4 text-zinc-400" />
                <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
                  Upcoming Reminders
                </h2>
              </div>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-zinc-800/80 text-zinc-400 border border-zinc-700/50 font-mono">
                {reminders.length}
              </span>
            </div>

            {/* Reminders List or Empty State */}
            {reminders.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-zinc-800 bg-zinc-900/40 p-3.5 flex flex-col items-center text-center my-auto">
                <div className="w-7 h-7 rounded-xl bg-zinc-800/60 flex items-center justify-center text-zinc-400 mb-1">
                  <CalendarCheck2 className="w-4 h-4 text-zinc-400" />
                </div>
                <p className="text-xs font-medium text-zinc-300">
                  No reminders yet
                </p>
                <p className="text-[10px] text-zinc-400 mt-0.5 max-w-[240px] leading-relaxed">
                  Speak, type, or press &ldquo;1&rdquo; or &ldquo;2&rdquo; to test live reminder extraction.
                </p>
              </div>
            ) : (
              <div className="space-y-1.5 overflow-y-auto max-h-[145px] pr-1">
                {reminders.map((reminder) => (
                  <div
                    key={reminder.id}
                    className="p-2 rounded-xl bg-zinc-900/90 border border-zinc-800/90 flex items-start justify-between shadow-sm animate-slide-in"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <h3 className="text-xs font-semibold text-zinc-100">
                          {reminder.title}
                        </h3>
                      </div>
                      <div className="flex items-center gap-3 text-[10px] text-zinc-400 pl-5">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-zinc-400" />
                          {reminder.date || "Tomorrow"}
                        </span>
                        {reminder.time && (
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-zinc-400" />
                            {reminder.time}
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 font-mono">
                      {(reminder.confidence * 100).toFixed(0)}%
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Phone Bottom Home Indicator */}
        <div className="pb-2 pt-1 flex justify-center z-20">
          <div className="w-32 h-1 bg-zinc-600/70 rounded-full" />
        </div>

      </div>

      {/* Frame Label / Shortcut Helper Note */}
      <footer className="mt-2 text-center text-[11px] text-zinc-400 flex items-center justify-center gap-2">
        <span>Press <kbd className="px-1 py-0.5 bg-zinc-900 border border-zinc-800 rounded font-mono text-[10px] text-zinc-300">1</kbd> for English</span>
        <span>•</span>
        <span>Press <kbd className="px-1 py-0.5 bg-zinc-900 border border-zinc-800 rounded font-mono text-[10px] text-zinc-300">2</kbd> for Hinglish</span>
      </footer>
    </main>
  );
}
