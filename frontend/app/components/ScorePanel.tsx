export type ScoreResult = {
  persona: string;
  score: number;
  reasoning: string;
  weaknesses: string[];
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
      {results.map((result) => (
        <article
          key={result.persona}
          className={`rounded-xl border bg-white p-6 shadow-sm ${
            ACCENT_BY_PERSONA[result.persona] ?? "border-zinc-200"
          }`}
        >
          <h2 className="text-sm font-semibold tracking-tight text-zinc-900">
            {result.persona}
          </h2>
          <p className="mt-3 text-3xl font-semibold tabular-nums text-zinc-900">
            {result.score}/10
          </p>
          <p className="mt-3 text-sm leading-relaxed text-zinc-600">
            {result.reasoning}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {result.weaknesses.map((weakness) => (
              <span
                key={weakness}
                className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-600"
              >
                {weakness}
              </span>
            ))}
          </div>
        </article>
      ))}
    </section>
  );
}
