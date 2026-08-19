export type ScoreResult = {
  persona: string;
  score?: number;
  reasoning?: string;
  weaknesses?: string[];
  failed?: boolean;
};

const ACCENT_BY_PERSONA: Record<string, string> = {
  "Strict Technical Reviewer": "border-t-4 border-t-orange-500 border-zinc-200",
  "Friendly HR Interviewer": "border-t-4 border-t-blue-500 border-zinc-200",
  "System Design Skeptic": "border-t-4 border-t-purple-500 border-zinc-200",
};

type ScorePanelProps = {
  results: ScoreResult[];
};

export default function ScorePanel({ results }: ScorePanelProps) {
  return (
    <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {results.map((result, index) => {
        const persona = result.persona || "Unknown persona";

        if (result.failed) {
          return (
            <article
              key={persona || index}
              className="rounded-xl border border-red-200 bg-white p-6 shadow-sm border-t-4 border-t-red-500"
            >
              <h2 className="text-sm font-semibold tracking-tight text-zinc-900">
                {persona}
              </h2>
              <p className="mt-3 text-sm font-medium text-red-600">
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
            className={`rounded-xl border bg-white p-6 shadow-sm ${
              ACCENT_BY_PERSONA[persona] ?? "border-zinc-200"
            }`}
          >
            <h2 className="text-sm font-semibold tracking-tight text-zinc-900">
              {persona}
            </h2>
            <p className="mt-3 text-3xl font-semibold tabular-nums text-zinc-900">
              {typeof result.score === "number" ? `${result.score}/10` : "—"}
            </p>
            {result.reasoning ? (
              <p className="mt-3 text-sm leading-relaxed text-zinc-600">
                {result.reasoning}
              </p>
            ) : null}
            {weaknesses.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {weaknesses.map((weakness) => (
                  <span
                    key={weakness}
                    className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-600"
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
