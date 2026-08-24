"use client";

import { DIFFICULTY_BADGE, TRACKS, type Track } from "./constants";

type InterviewSetupProps = {
  track: Track;
  onTrackChange: (track: Track) => void;
  jdText: string;
  onJdChange: (value: string) => void;
  isJdOpen: boolean;
  onJdOpenChange: (open: boolean) => void;
  isGenerating: boolean;
  onGenerate: () => void;
  collapsed: boolean;
  onCollapsedChange: (collapsed: boolean) => void;
  hasQuestion: boolean;
  error?: string;
};

export default function InterviewSetup({
  track,
  onTrackChange,
  jdText,
  onJdChange,
  isJdOpen,
  onJdOpenChange,
  isGenerating,
  onGenerate,
  collapsed,
  onCollapsedChange,
  hasQuestion,
  error,
}: InterviewSetupProps) {
  if (collapsed && hasQuestion) {
    return (
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#DCE5D8] bg-[#F0F6EC]/50 px-4 py-2.5 sm:px-6">
        <p className="text-xs text-[#687268]">
          Mode: <span className="font-medium text-[#172018]">{track}</span>
          {jdText.trim() ? " · JD tailored" : ""}
        </p>
        <button
          type="button"
          onClick={() => onCollapsedChange(false)}
          className="text-xs font-medium text-[#4FB832] hover:text-[#172018]"
        >
          Edit setup
        </button>
      </div>
    );
  }

  return (
    <section className="border-b border-[#DCE5D8] bg-white px-4 py-4 sm:px-6">
      <div className="flex items-center justify-between gap-3">
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#687268]">
          Interview mode
        </p>
        {hasQuestion && (
          <button
            type="button"
            onClick={() => onCollapsedChange(true)}
            className="text-xs text-[#687268] hover:text-[#172018]"
          >
            Collapse
          </button>
        )}
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {TRACKS.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onTrackChange(option)}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors sm:text-sm ${
              track === option ? "studio-track-active" : "studio-track-inactive"
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      <div className="mt-3 overflow-hidden rounded-lg border border-[#DCE5D8] bg-[#F7FAF5]">
        <button
          type="button"
          onClick={() => onJdOpenChange(!isJdOpen)}
          aria-expanded={isJdOpen}
          className="flex w-full items-center justify-between px-3 py-2.5 text-left text-xs text-[#687268] hover:text-[#172018]"
        >
          <span>Tailor to job description (optional)</span>
          <span className={`text-[10px] transition-transform ${isJdOpen ? "rotate-180" : ""}`}>
            ▼
          </span>
        </button>
        {isJdOpen && (
          <div className="border-t border-[#DCE5D8] bg-white px-3 pb-3 pt-2">
            <textarea
              value={jdText}
              onChange={(e) => onJdChange(e.target.value)}
              placeholder="Paste a job description..."
              rows={4}
              className="studio-input w-full resize-y px-3 py-2 text-xs leading-relaxed"
            />
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={onGenerate}
        disabled={isGenerating}
        className={`mt-3 text-sm disabled:cursor-not-allowed disabled:opacity-50 ${
          hasQuestion ? "landing-btn-secondary" : "landing-btn-primary"
        }`}
      >
        {isGenerating ? "Generating…" : hasQuestion ? "New question" : "Generate question"}
      </button>

      {error && <p className="mt-2 text-xs text-[#B84A5A]">{error}</p>}
    </section>
  );
}

export function difficultyBadge(difficulty: string) {
  const key = difficulty.toLowerCase();
  return (
    DIFFICULTY_BADGE[key] ?? {
      label: difficulty,
      className: "bg-[#F0F6EC] text-[#687268]",
    }
  );
}
