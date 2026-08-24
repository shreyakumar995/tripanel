export type ScoreResult = {
  persona: string;
  score?: number;
  reasoning?: string;
  weaknesses?: string[];
  failed?: boolean;
};

const PERSONA_STYLES: Record<
  string,
  { border: string; avatar: string; initial: string; pulse: string }
> = {
  "Strict Technical Reviewer": {
    border: "border-t-[3px] border-t-[#72D13D] border-[#DCE4D8]",
    avatar: "bg-[#72D13D]/15 text-[#48B536]",
    initial: "R",
    pulse: "text-[#48B536]",
  },
  "Friendly HR Interviewer": {
    border: "border-t-[3px] border-t-[#172018]/25 border-[#DCE4D8]",
    avatar: "bg-[#172018]/8 text-[#172018]",
    initial: "P",
    pulse: "text-[#172018]",
  },
  "System Design Skeptic": {
    border: "border-t-[3px] border-t-[#667066] border-[#DCE4D8]",
    avatar: "bg-[#667066]/12 text-[#667066]",
    initial: "A",
    pulse: "text-[#667066]",
  },
};

const PENDING_PERSONAS = [
  "Strict Technical Reviewer",
  "Friendly HR Interviewer",
  "System Design Skeptic",
] as const;

type ScorePanelProps = {
  results?: ScoreResult[];
  isPending?: boolean;
};

export default function ScorePanel({
  results = [],
  isPending = false,
}: ScorePanelProps) {
  if (isPending) {
    return (
      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {PENDING_PERSONAS.map((persona) => {
          const style = PERSONA_STYLES[persona];
          return (
            <article
              key={persona}
              className={`landing-card animate-pulse p-6 ${style.border}`}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-display text-sm font-semibold ${style.avatar}`}
                >
                  {style.initial}
                </span>
                <h2 className="font-display text-sm font-semibold tracking-tight text-[#172018]">
                  {persona}
                </h2>
              </div>
              <p
                className={`mt-4 font-mono text-2xl font-semibold tracking-tight ${style.pulse}`}
              >
                Thinking...
              </p>
            </article>
          );
        })}
      </section>
    );
  }

  return (
    <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {results.map((result, index) => {
        const persona = result.persona || "Unknown persona";
        const style = PERSONA_STYLES[persona];
        const initial = persona.trim().charAt(0).toUpperCase() || "?";

        if (result.failed) {
          return (
            <article
              key={persona || index}
              className="landing-card border-t-[3px] border-t-[#B84A5A] p-6"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FCE8EB] font-display text-sm font-semibold text-[#B84A5A]">
                  {initial}
                </span>
                <h2 className="font-display text-sm font-semibold tracking-tight text-[#172018]">
                  {persona}
                </h2>
              </div>
              <p className="mt-3 text-sm font-medium text-[#B84A5A]">
                Failed to load
              </p>
            </article>
          );
        }

        const weaknesses = Array.isArray(result.weaknesses)
          ? result.weaknesses
          : [];
        const scoreLow =
          typeof result.score === "number" && result.score <= 5;

        return (
          <article
            key={persona || index}
            className={`landing-card p-6 transition-all hover:-translate-y-0.5 hover:shadow-md ${
              style?.border ?? "border-[#DCE4D8]"
            }`}
          >
            <div className="flex items-center gap-3">
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-display text-sm font-semibold ${
                  style?.avatar ?? "bg-[#667066]/12 text-[#667066]"
                }`}
              >
                {style?.initial ?? initial}
              </span>
              <h2 className="font-display text-sm font-semibold tracking-tight text-[#172018]">
                {persona}
              </h2>
            </div>
            <p
              className={`mt-4 font-mono text-4xl font-semibold tabular-nums tracking-tight ${
                scoreLow ? "text-[#B84A5A]" : "text-[#172018]"
              }`}
            >
              {typeof result.score === "number" ? `${result.score}/10` : "—"}
            </p>
            {result.reasoning ? (
              <p className="mt-3 text-sm leading-relaxed text-[#667066]">
                {result.reasoning}
              </p>
            ) : null}
            {weaknesses.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {weaknesses.map((weakness) => (
                  <span
                    key={weakness}
                    className="rounded-full border border-[#B84A5A]/25 bg-[#FCE8EB] px-2.5 py-1 text-xs font-medium text-[#B84A5A]"
                  >
                    {weakness}
                  </span>
                ))}
              </div>
            )}
          </article>
        );
      })}
    </section>
  );
}
