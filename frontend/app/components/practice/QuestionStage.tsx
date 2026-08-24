"use client";

import { PANEL_PERSONAS, type Track } from "./constants";
import { difficultyBadge } from "./InterviewSetup";

type QuestionStageProps = {
  question: string;
  difficulty: string;
  track: Track;
  isGenerating: boolean;
  isSubmitted: boolean;
};

export default function QuestionStage({
  question,
  difficulty,
  track,
  isGenerating,
  isSubmitted,
}: QuestionStageProps) {
  const badge = difficulty ? difficultyBadge(difficulty) : null;

  if (isGenerating) {
    return (
      <section className="practice-panel mx-4 my-5 px-5 py-10 sm:mx-6">
        <p className="studio-label">Question</p>
        <div className="mt-6 flex items-center gap-3 text-sm text-[#687268]">
          <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-[#DCE5D8] border-t-[#72D13D]" />
          Generating your next question…
        </div>
      </section>
    );
  }

  if (!question) {
    return (
      <section className="practice-panel mx-4 my-5 px-5 py-12 text-center sm:mx-6">
        <div className="mx-auto flex max-w-md flex-col items-center">
          <div className="flex -space-x-2">
            {PANEL_PERSONAS.map((p) => (
              <span
                key={p.initial}
                className={`flex h-9 w-9 items-center justify-center rounded-full border-2 border-white text-xs font-semibold ${p.color}`}
              >
                {p.initial}
              </span>
            ))}
          </div>
          <h2 className="font-display mt-5 text-xl font-semibold text-[#172018]">
            Generate your first question
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-[#687268]">
            Choose an interview type above and let the panel begin.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section
      className={`practice-panel practice-state-enter mx-4 my-5 px-5 py-6 sm:mx-6 sm:px-7 sm:py-7 ${
        isSubmitted ? "opacity-90" : ""
      }`}
    >
      <p className="studio-label">Question</p>
      <div className="mt-3 flex flex-wrap gap-2">
        <span className="rounded-full bg-[#F0F6EC] px-2.5 py-0.5 text-[10px] font-medium text-[#687268]">
          {track}
        </span>
        {badge && (
          <span
            className={`rounded-full px-2.5 py-0.5 text-[10px] font-medium ${badge.className}`}
          >
            {badge.label}
          </span>
        )}
      </div>
      <p className="practice-question-text mt-4 text-[#172018]">{question}</p>
    </section>
  );
}
