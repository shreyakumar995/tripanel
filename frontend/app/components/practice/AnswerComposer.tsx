"use client";

import { useEffect, useRef, useState } from "react";
import { getSettings } from "../../lib/settings";

const WAVE_COUNT = 24;

type AnswerComposerProps = {
  answer: string;
  onAnswerChange: (value: string) => void;
  isListening: boolean;
  onListeningChange: (value: boolean) => void;
  isSubmitting: boolean;
  isSubmitted: boolean;
  onSubmit: () => void;
  disabled?: boolean;
  onAnsweringStart?: () => void;
  /** Must resolve true before answering can begin. Camera is mandatory. */
  onEnsureCamera?: () => Promise<boolean>;
};

export default function AnswerComposer({
  answer,
  onAnswerChange,
  isListening,
  onListeningChange,
  isSubmitting,
  isSubmitted,
  onSubmit,
  disabled = false,
  onAnsweringStart,
  onEnsureCamera,
}: AnswerComposerProps) {
  const recognitionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const keepListeningRef = useRef(false);
  const finalTranscriptRef = useRef("");
  const [levels, setLevels] = useState<number[]>(() =>
    Array.from({ length: WAVE_COUNT }, () => 0.15),
  );
  const [micError, setMicError] = useState("");
  const isEmpty = answer.trim().length === 0;

  function cleanupAudio() {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    void audioContextRef.current?.close();
    audioContextRef.current = null;
    analyserRef.current = null;
    setLevels(Array.from({ length: WAVE_COUNT }, () => 0.15));
  }

  useEffect(() => {
    return () => {
      keepListeningRef.current = false;
      recognitionRef.current?.stop();
      cleanupAudio();
    };
  }, []);

  function attachRecognitionHandlers(recognition: any) {
    recognition.onresult = (event: any) => {
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscriptRef.current += transcript + " ";
        } else {
          interim += transcript;
        }
      }
      onAnswerChange(finalTranscriptRef.current + interim);
    };

    recognition.onerror = (event: any) => {
      // Browser often fires "no-speech" after a pause — keep going.
      if (event?.error === "no-speech" || event?.error === "aborted") {
        return;
      }
      if (event?.error === "not-allowed") {
        keepListeningRef.current = false;
        cleanupAudio();
        onListeningChange(false);
        setMicError("Microphone permission blocked. Allow mic access and try again.");
        return;
      }
      // network / service-not-allowed etc. — stop cleanly
      keepListeningRef.current = false;
      cleanupAudio();
      onListeningChange(false);
      setMicError("Voice recognition stopped. Tap the mic to continue.");
    };

    recognition.onend = () => {
      // Chrome ends recognition after silence even with continuous=true.
      // Restart until the user explicitly finishes.
      if (keepListeningRef.current) {
        try {
          recognition.start();
        } catch {
          // Already started or briefly unavailable — retry once.
          window.setTimeout(() => {
            if (!keepListeningRef.current) return;
            try {
              recognition.start();
            } catch {
              keepListeningRef.current = false;
              cleanupAudio();
              onListeningChange(false);
            }
          }, 200);
        }
        return;
      }
      cleanupAudio();
      onListeningChange(false);
    };
  }

  async function startListening() {
    setMicError("");

    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setMicError("Voice input isn’t supported in this browser — try Chrome or Edge.");
      return;
    }

    if (onEnsureCamera) {
      const cameraOk = await onEnsureCamera();
      if (!cameraOk) {
        setMicError(
          "Camera is required to start answering. Allow camera access and try again.",
        );
        return;
      }
    } else {
      try {
        await navigator.mediaDevices.getUserMedia({ video: true });
      } catch {
        setMicError(
          "Camera is required to start answering. Allow camera access and try again.",
        );
        return;
      }
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const audioContext = new AudioContext();
      audioContextRef.current = audioContext;
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 64;
      analyserRef.current = analyser;
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      function tick() {
        analyser.getByteFrequencyData(dataArray);
        const next = Array.from({ length: WAVE_COUNT }, (_, i) => {
          const sample =
            dataArray[Math.floor((i / WAVE_COUNT) * dataArray.length)] ?? 0;
          return Math.max(0.12, Math.min(1, sample / 180));
        });
        setLevels(next);
        animationFrameRef.current = requestAnimationFrame(tick);
      }
      tick();
    } catch {
      setMicError(
        "Microphone access denied. Camera and mic are both required to answer.",
      );
      return;
    }

    finalTranscriptRef.current = answer.trim() ? `${answer.trim()} ` : "";
    keepListeningRef.current = true;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = getSettings().voiceRecognitionLanguage;
    attachRecognitionHandlers(recognition);

    recognition.start();
    recognitionRef.current = recognition;
    onListeningChange(true);
    onAnsweringStart?.();
  }

  function stopListening() {
    keepListeningRef.current = false;
    recognitionRef.current?.stop();
    cleanupAudio();
    onListeningChange(false);
  }

  if (isSubmitted) {
    return (
      <section className="practice-panel mx-4 mb-5 px-5 py-5 sm:mx-6">
        <p className="studio-label">Your response</p>
        <p className="mt-3 text-sm leading-relaxed text-[#687268] line-clamp-6">
          {answer || "—"}
        </p>
        <p className="mt-2 text-xs font-medium text-[#4FB832]">
          Submitted to panel
        </p>
      </section>
    );
  }

  return (
    <section
      className={`practice-panel mx-4 mb-5 px-5 py-8 sm:mx-6 sm:py-10 ${
        isListening ? "ring-2 ring-[#22C55E]/20" : ""
      }`}
    >
      <p className="studio-label text-center">Your response</p>

      {/* Centered mic + waveform stage */}
      <div className="mt-8 flex flex-col items-center justify-center">
        {isListening ? (
          <>
            <div className="relative flex h-28 w-full max-w-md items-center justify-center gap-1 sm:h-32">
              {levels.map((level, i) => {
                const distance = Math.abs(i - (WAVE_COUNT - 1) / 2);
                const taper = 1 - distance / WAVE_COUNT;
                const height = Math.max(8, level * 96 * (0.55 + taper * 0.55));
                return (
                  <span
                    key={i}
                    className="w-[3px] rounded-full bg-[#22C55E] transition-[height] duration-75 sm:w-1"
                    style={{ height: `${height}px` }}
                  />
                );
              })}

              <button
                type="button"
                onClick={stopListening}
                disabled={isSubmitting}
                aria-label="Stop recording"
                className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#22C55E] text-white shadow-[0_0_0_10px_rgba(34,197,94,0.15)] transition hover:bg-[#16A34A] sm:h-[4.5rem] sm:w-[4.5rem]"
              >
                <MicIcon className="h-7 w-7" />
              </button>
            </div>

            <p className="mt-6 flex items-center gap-2 text-sm font-medium text-[#22C55E]">
              <span className="h-2 w-2 animate-pulse rounded-full bg-[#22C55E]" />
              Listening…
            </p>
            <p className="mt-3 max-w-lg px-2 text-center text-sm leading-relaxed text-[#687268]">
              {answer.trim() || "Speak your answer clearly — we’ll capture it live."}
            </p>
            <button
              type="button"
              onClick={stopListening}
              className="mt-6 rounded-lg border border-[#DCE5D8] bg-white px-5 py-2 text-sm font-medium text-[#172018] transition hover:border-[#22C55E]/50"
            >
              Done answering
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={() => void startListening()}
              disabled={disabled || isSubmitting}
              aria-label="Start answering"
              className="group flex h-20 w-20 items-center justify-center rounded-full bg-[#22C55E] text-white shadow-[0_8px_28px_rgba(34,197,94,0.28)] transition hover:scale-[1.03] hover:bg-[#16A34A] disabled:cursor-not-allowed disabled:opacity-50 sm:h-24 sm:w-24"
            >
              <MicIcon className="h-8 w-8 sm:h-9 sm:w-9" />
            </button>
            <p className="mt-5 text-sm font-medium text-[#172018]">
              Tap the mic to start answering
            </p>
            <p className="mt-1 max-w-sm text-center text-xs text-[#687268]">
              Camera turns on automatically — both camera and mic are required,
              like a real interview
            </p>

            {answer.trim() && (
              <div className="mt-6 w-full max-w-lg rounded-xl border border-[#DCE5D8] bg-[#F7FAF5] px-4 py-3 text-left">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-[#687268]">
                  Captured answer
                </p>
                <p className="mt-1.5 text-sm leading-relaxed text-[#172018]">
                  {answer}
                </p>
              </div>
            )}

            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              {answer.trim() && (
                <button
                  type="button"
                  onClick={() => void startListening()}
                  disabled={disabled || isSubmitting}
                  className="landing-btn-secondary text-sm"
                >
                  Re-record
                </button>
              )}
              <button
                type="button"
                disabled={isEmpty || isSubmitting || disabled}
                onClick={onSubmit}
                className="landing-btn-primary text-sm disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting ? "Submitting…" : "Submit answer"}
              </button>
            </div>
          </>
        )}
      </div>

      {micError && (
        <p className="mt-4 text-center text-sm text-[#B84A5A]">{micError}</p>
      )}
    </section>
  );
}

function MicIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <line x1="12" y1="19" x2="12" y2="23" />
      <line x1="8" y1="23" x2="16" y2="23" />
    </svg>
  );
}
