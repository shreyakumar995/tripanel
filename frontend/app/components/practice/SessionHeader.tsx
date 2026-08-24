"use client";

import type { Track } from "./constants";

export type InterviewPhase =
  | "idle"
  | "question-ready"
  | "responding"
  | "recording"
  | "submitting"
  | "submitted";

type SessionHeaderProps = {
  track: Track;
  phase: InterviewPhase;
  sessionNumber: number;
  elapsedSeconds: number;
  cameraOn: boolean;
  micActive: boolean;
  onOpenHistory?: () => void;
};

function formatElapsed(seconds: number) {
  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");
  return `${mm}:${ss}`;
}

const PHASE_LABEL: Record<InterviewPhase, string> = {
  idle: "Ready to begin",
  "question-ready": "Question ready",
  responding: "Responding",
  recording: "Recording",
  submitting: "Evaluating…",
  submitted: "Feedback ready",
};

export default function SessionHeader({
  track,
  phase,
  sessionNumber,
  elapsedSeconds,
  cameraOn,
  micActive,
  onOpenHistory,
}: SessionHeaderProps) {
  return (
    <header className="shrink-0 border-b border-[#DCE5D8] bg-white/90 px-4 py-3 backdrop-blur-sm sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          {onOpenHistory && (
            <button
              type="button"
              onClick={onOpenHistory}
              className="rounded-lg border border-[#DCE5D8] px-2.5 py-1.5 text-xs font-medium text-[#687268] lg:hidden"
            >
              History
            </button>
          )}
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#4FB832]">
              Practice studio
            </p>
            <div className="mt-0.5 flex flex-wrap items-center gap-2">
              <h1 className="font-display text-base font-semibold text-[#172018] sm:text-lg">
                {track}
              </h1>
              <span className="rounded-full bg-[#F0F6EC] px-2 py-0.5 text-[10px] font-medium text-[#687268]">
                AI Panel Interview
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs text-[#687268]">
          <span>Session {sessionNumber}</span>
          <span className="hidden h-3 w-px bg-[#DCE5D8] sm:inline" />
          <span className="font-mono tabular-nums">{formatElapsed(elapsedSeconds)}</span>
          <span className="hidden h-3 w-px bg-[#DCE5D8] sm:inline" />
          <span className="flex items-center gap-1.5">
            <span
              className={`h-1.5 w-1.5 rounded-full ${cameraOn ? "bg-[#4FB832]" : "bg-[#DCE5D8]"}`}
            />
            Camera {cameraOn ? "on" : "off"}
          </span>
          <span className="flex items-center gap-1.5">
            <span
              className={`h-1.5 w-1.5 rounded-full ${micActive ? "bg-[#B84A5A] animate-pulse" : "bg-[#DCE5D8]"}`}
            />
            Mic {micActive ? "live" : "idle"}
          </span>
          <span className="rounded-full bg-[#F0F6EC] px-2.5 py-1 font-medium text-[#172018]">
            {PHASE_LABEL[phase]}
          </span>
        </div>
      </div>
    </header>
  );
}
