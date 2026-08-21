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
    avatar: "bg-accent/15 text-accent",
    initial: "R",
  },
  "Friendly HR Interviewer": {
    border: "border-t-[3px] border-t-ivory border-border-subtle",
    avatar: "bg-ivory/10 text-ivory",
    initial: "P",
  },
  "System Design Skeptic": {
    border: "border-t-[3px] border-t-silver border-border-subtle",
    avatar: "bg-silver/15 text-silver",
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
              className="rounded-xl border border-border-subtle border-t-[3px] border-t-status-red bg-surface p-6"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-status-red/15 font-heading text-sm font-semibold text-status-red">
                  {initial}
                </span>
                <h2 className="font-heading text-sm font-semibold tracking-tight text-ivory">
                  {persona}
                </h2>
              </div>
              <p className="mt-3 text-sm font-medium text-status-red">
                Failed to load
              </p>
            </article>
          );
        }

        const weaknesses = Array.isArray(result.weaknesses)
          ? result.weaknesses
          : [];

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
            <p className="mt-4 font-mono text-4xl font-semibold tabular-nums tracking-tight text-ivory">
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
                    className="rounded-full border border-border-subtle px-2.5 py-1 text-xs font-medium text-text-muted"
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
