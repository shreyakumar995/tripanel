export type ScoreResult = {
  persona: string;
  score?: number;
  reasoning?: string;
  weaknesses?: string[];
  failed?: boolean;
};

const PERSONA_STYLES: Record<
  string,
  { border: string; avatar: string; initial: string }
> = {
  "Strict Technical Reviewer": {
    border: "border-t-[3px] border-t-accent border-border-subtle",
    avatar: "bg-accent/12 text-accent",
    initial: "R",
  },
  "Friendly HR Interviewer": {
    border: "border-t-[3px] border-t-ivory/50 border-border-subtle",
    avatar: "bg-ivory/10 text-ivory",
    initial: "P",
  },
  "System Design Skeptic": {
    border: "border-t-[3px] border-t-text-muted border-border-subtle",
    avatar: "bg-surface-elevated text-text-muted",
    initial: "A",
  },
};

type ScorePanelProps = {
  results: ScoreResult[];
};

export default function ScorePanel({ results }: ScorePanelProps) {
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
              className="rounded-xl border border-border-subtle border-t-[3px] border-t-oxblood-muted bg-surface p-6"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-oxblood/20 font-heading text-sm font-semibold text-oxblood-muted">
                  {initial}
                </span>
                <h2 className="font-heading text-sm font-semibold tracking-tight text-ivory">
                  {persona}
                </h2>
              </div>
              <p className="mt-3 text-sm font-medium text-oxblood-muted">
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
            className={`rounded-xl border bg-surface p-6 transition-colors hover:bg-surface-elevated ${
              style?.border ?? "border-border-subtle"
            }`}
          >
            <div className="flex items-center gap-3">
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-heading text-sm font-semibold ${
                  style?.avatar ?? "bg-text-muted/15 text-text-muted"
                }`}
              >
                {style?.initial ?? initial}
              </span>
              <h2 className="font-heading text-sm font-semibold tracking-tight text-ivory">
                {persona}
              </h2>
            </div>
            <p
              className={`mt-4 font-mono text-4xl font-semibold tabular-nums tracking-tight ${
                scoreLow ? "text-oxblood-muted" : "text-ivory"
              }`}
            >
              {typeof result.score === "number" ? `${result.score}/10` : "—"}
            </p>
            {result.reasoning ? (
              <p className="mt-3 text-sm leading-relaxed text-text-muted">
                {result.reasoning}
              </p>
            ) : null}
            {weaknesses.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {weaknesses.map((weakness) => (
                  <span
                    key={weakness}
                    className="rounded-full border border-oxblood/30 bg-oxblood/10 px-2.5 py-1 text-xs font-medium text-oxblood-muted"
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
