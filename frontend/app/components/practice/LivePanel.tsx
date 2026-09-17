"use client";

import { useEffect, useRef, type ReactNode } from "react";
import ConsistencyBadge from "../ConsistencyBadge";
import ScorePanel, { type ScoreResult } from "../ScorePanel";
import { PANEL_PERSONAS } from "./constants";

type LivePanelProps = {
  cameraOn: boolean;
  cameraError: string;
  onCameraChange: (on: boolean) => void;
  onCameraError: (error: string) => void;
  results: ScoreResult[] | null;
  isSubmitted: boolean;
  isSubmitting: boolean;
  /** When true, camera stays on and cannot be turned off. */
  cameraLocked?: boolean;
  /** Parent registers this so answering can force-start the camera. */
  onRegisterStartCamera?: (start: () => Promise<boolean>) => void;
  /** Rendered below score panels after evaluation (e.g. follow-up). */
  afterScores?: ReactNode;
};

export default function LivePanel({
  cameraOn,
  cameraError,
  onCameraChange,
  onCameraError,
  results,
  isSubmitted,
  isSubmitting,
  cameraLocked = false,
  onRegisterStartCamera,
  afterScores,
}: LivePanelProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  async function startCamera(): Promise<boolean> {
    if (streamRef.current && videoRef.current?.srcObject) {
      onCameraChange(true);
      onCameraError("");
      return true;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
      onCameraChange(true);
      onCameraError("");
      return true;
    } catch {
      onCameraError("Camera access denied. Camera is required to answer.");
      onCameraChange(false);
      return false;
    }
  }

  function stopCamera() {
    if (cameraLocked) return;
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    onCameraChange(false);
  }

  useEffect(() => {
    onRegisterStartCamera?.(startCamera);
  });

  useEffect(() => {
    if (cameraLocked) {
      void startCamera();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cameraLocked]);

  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  const scores = results?.filter(
    (r) => !r.failed && typeof r.score === "number",
  );
  const overall =
    scores && scores.length > 0
      ? scores.reduce((s, r) => s + (r.score as number), 0) / scores.length
      : null;

  if (isSubmitting || (isSubmitted && results && results.length > 0)) {
    return (
      <aside className="flex w-full shrink-0 flex-col border-t border-[#DCE5D8] bg-white xl:w-[360px] xl:border-l xl:border-t-0">
        <div className="flex-1 overflow-y-auto p-4 sm:p-5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#4FB832]">
            Panel feedback
          </p>

          {isSubmitting ? (
            <div className="mt-5 [&_section]:grid-cols-1">
              <ScorePanel isPending />
            </div>
          ) : (
            <>
              {overall !== null && (
                <div className="practice-state-enter mt-4 rounded-xl bg-[#F0F6EC] px-4 py-5 text-center">
                  <p className="text-xs text-[#687268]">Overall</p>
                  <p className="font-display mt-1 text-4xl font-semibold tabular-nums text-[#172018]">
                    {overall.toFixed(1)}
                    <span className="text-lg text-[#687268]"> /10</span>
                  </p>
                </div>
              )}

              {scores && scores.length > 0 && (
                <div className="mt-4">
                  <ConsistencyBadge
                    scores={scores.map((r) => r.score as number)}
                  />
                </div>
              )}

              <div className="mt-5 [&_section]:grid-cols-1">
                <ScorePanel results={results ?? []} />
              </div>

              {afterScores}
            </>
          )}
        </div>
      </aside>
    );
  }

  return (
    <aside className="flex w-full shrink-0 flex-col border-t border-[#DCE5D8] bg-white xl:w-[360px] xl:border-l xl:border-t-0">
      <div className="flex-1 overflow-y-auto p-4 sm:p-5">
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#687268]">
          Live interview
        </p>

        <div className="group relative mt-3 overflow-hidden rounded-xl border border-[#DCE5D8] bg-[#F0F6EC]">
          {cameraOn && (
            <span className="absolute left-3 top-3 z-10 flex items-center gap-1.5 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-medium text-[#4FB832]">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#4FB832]" />
              {cameraLocked ? "Required" : "Live"}
            </span>
          )}
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className={`aspect-[4/3] w-full object-cover ${cameraOn ? "" : "hidden"}`}
          />
          {!cameraOn && (
            <div className="flex aspect-[4/3] flex-col items-center justify-center gap-3 px-4 text-center">
              <p className="text-sm text-[#687268]">
                {cameraLocked
                  ? "Turning camera on…"
                  : "Camera is required to answer"}
              </p>
              {!cameraLocked && (
                <button
                  type="button"
                  onClick={() => void startCamera()}
                  className="landing-btn-primary text-xs"
                >
                  Turn on camera
                </button>
              )}
            </div>
          )}
          {cameraOn && !cameraLocked && (
            <div className="absolute inset-x-0 bottom-0 flex justify-end bg-gradient-to-t from-[#172018]/50 to-transparent p-3 opacity-0 transition-opacity group-hover:opacity-100">
              <button
                type="button"
                onClick={stopCamera}
                className="rounded-lg bg-white/95 px-3 py-1.5 text-xs font-medium text-[#172018]"
              >
                Turn off
              </button>
            </div>
          )}
          {cameraOn && cameraLocked && (
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#172018]/55 to-transparent p-3">
              <p className="text-center text-[10px] font-medium text-white/95">
                Camera stays on while you answer
              </p>
            </div>
          )}
        </div>

        {cameraError && (
          <p className="mt-2 text-xs text-[#B84A5A]">{cameraError}</p>
        )}

        <div className="mt-5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#687268]">
            AI panel
          </p>
          <ul className="mt-2 space-y-2">
            {PANEL_PERSONAS.map((p) => (
              <li
                key={p.initial}
                className="flex items-start gap-2.5 rounded-lg border border-[#DCE5D8] bg-[#F7FAF5] px-3 py-2"
              >
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold ${p.color}`}
                >
                  {p.initial}
                </span>
                <div>
                  <p className="text-xs font-medium text-[#172018]">{p.name}</p>
                  <p className="text-[10px] text-[#687268]">{p.focus}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#687268]">
            Live signal
          </p>
          <div className="mt-3 space-y-2.5">
            {["Confidence", "Clarity", "Technical depth", "Answer structure"].map(
              (label) => (
                <div key={label}>
                  <div className="flex justify-between text-[10px] text-[#687268]">
                    <span>{label}</span>
                    <span>After submit</span>
                  </div>
                  <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-[#F0F6EC]">
                    <div className="h-full w-0 rounded-full bg-[#DCE5D8]" />
                  </div>
                </div>
              ),
            )}
            <p className="text-[10px] leading-relaxed text-[#687268]">
              Detailed metrics appear here once you submit your answer.
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
