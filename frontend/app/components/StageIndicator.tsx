export type Stage =
  | "idle"
  | "question_ready"
  | "answering"
  | "reviewing"
  | "feedback_ready";

const STAGES = [
  { id: "question_ready" as const, label: "Question" },
  { id: "answering" as const, label: "Answer" },
  { id: "reviewing" as const, label: "Review" },
  { id: "feedback_ready" as const, label: "Feedback" },
];

const STAGE_ORDER: Stage[] = [
  "idle",
  "question_ready",
  "answering",
  "reviewing",
  "feedback_ready",
];

type StageIndicatorProps = {
  stage: Stage;
};

export default function StageIndicator({ stage }: StageIndicatorProps) {
  const currentIndex = STAGE_ORDER.indexOf(stage);

  return (
    <div
      className="flex items-center justify-center gap-0 border-b border-[#DCE5D8] bg-white px-4 py-3 sm:px-6"
      role="status"
      aria-label={`Interview stage: ${stage === "idle" ? "not started" : STAGES.find((s) => s.id === stage)?.label ?? stage}`}
    >
      <div className="flex items-center gap-2">
        {STAGES.map((item, index) => {
          // Map display index (0-3) to STAGE_ORDER index (1-4)
          const stageIndex = index + 1;
          const isComplete = currentIndex > stageIndex;
          const isCurrent = currentIndex === stageIndex;
          const isActive = isComplete || isCurrent;

          return (
            <span key={item.id} className="flex items-center gap-2">
              <span
                className={`block h-2.5 w-2.5 rounded-full transition-colors ${
                  isActive
                    ? "bg-[#22C55E]"
                    : "border border-[#9CA3AF] bg-transparent"
                } ${isCurrent ? "ring-2 ring-[#22C55E]/25" : ""}`}
                title={item.label}
                aria-current={isCurrent ? "step" : undefined}
              />
              {index < STAGES.length - 1 && (
                <span
                  className={`block h-px w-8 sm:w-12 ${
                    currentIndex > stageIndex ? "bg-[#22C55E]" : "bg-[#DCE5D8]"
                  }`}
                  aria-hidden
                />
              )}
            </span>
          );
        })}
      </div>
    </div>
  );
}
