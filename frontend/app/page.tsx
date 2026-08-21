import Link from "next/link";

const PERSONAS = [
  {
    initial: "R",
    name: "Strict Technical Reviewer",
    description:
      "Scores correctness, edge cases, and complexity awareness — no soft skills fluff.",
    avatarClass: "bg-persona-technical/15 text-persona-technical ring-persona-technical/40",
    accent: "border-t-persona-technical",
  },
  {
    initial: "P",
    name: "Friendly HR Interviewer",
    description:
      "Judges clarity, structure, and confidence in how you communicate your answer.",
    avatarClass: "bg-persona-hr/15 text-persona-hr ring-persona-hr/40",
    accent: "border-t-persona-hr",
  },
  {
    initial: "A",
    name: "System Design Skeptic",
    description:
      "Probes assumptions, scale, failure modes, and tradeoffs under real-world pressure.",
    avatarClass: "bg-persona-systemdesign/15 text-persona-systemdesign ring-persona-systemdesign/40",
    accent: "border-t-persona-systemdesign",
  },
] as const;

const DIMENSIONS = [
  { label: "Communication & Clarity", value: 86, barClass: "bg-persona-hr" },
  { label: "Technical Depth", value: 78, barClass: "bg-persona-technical" },
  { label: "Assumption Handling", value: 72, barClass: "bg-persona-systemdesign" },
] as const;

const TRACKS = [
  {
    title: "HR & Fit",
    description:
      "Behavioral prompts on teamwork, conflict, and motivation — scored for structure and delivery.",
  },
  {
    title: "GenAI Expert",
    description:
      "RAG, embeddings, and LLM fundamentals framed for fresher and early-career AI interviews.",
  },
  {
    title: "Tech Lead",
    description:
      "Data structures, algorithms, and coding reasoning without needing a full code write-up.",
  },
] as const;

function ScoreGauge() {
  const radius = 88;
  const stroke = 12;
  const circumference = 2 * Math.PI * radius;
  const progress = 0.82;
  const offset = circumference * (1 - progress);

  return (
    <div className="relative flex h-56 w-56 items-center justify-center">
      <svg
        viewBox="0 0 200 200"
        className="h-full w-full -rotate-90"
        aria-hidden="true"
      >
        <circle
          cx="100"
          cy="100"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={stroke}
          className="text-border-subtle"
        />
        <circle
          cx="100"
          cy="100"
          r={radius}
          fill="none"
          stroke="url(#scoreGradient)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
        <defs>
          <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#E8590C" />
            <stop offset="50%" stopColor="#4C8DFF" />
            <stop offset="100%" stopColor="#8B5CF6" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-mono text-4xl font-semibold tracking-tight text-text-primary">
          8.2
        </span>
        <span className="mt-1 text-sm text-text-muted">/10 composite</span>
      </div>
    </div>
  );
}

export default function LandingPage() {
  return (
    <div className="flex-1 overflow-y-auto bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden px-6 pb-20 pt-16 sm:pb-28 sm:pt-24">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(76,141,255,0.12),_transparent_55%),radial-gradient(ellipse_at_bottom_right,_rgba(139,92,246,0.1),_transparent_50%),radial-gradient(ellipse_at_bottom_left,_rgba(232,89,12,0.08),_transparent_45%)]"
        />
        <div className="relative mx-auto max-w-3xl text-center">
          <p className="font-heading text-sm font-medium tracking-wide text-text-muted">
            TriPanel
          </p>
          <h1 className="mt-4 font-heading text-4xl font-semibold leading-tight tracking-tight text-text-primary sm:text-5xl sm:leading-[1.1]">
            Ace Your Next Interview with{" "}
            <span className="bg-gradient-to-r from-persona-technical via-persona-hr to-persona-systemdesign bg-clip-text text-transparent">
              3 AI Recruiters
            </span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-text-muted sm:text-lg">
            Three independent AI interviewers score every answer. When they
            agree, you get a high-confidence signal. When they diverge, TriPanel
            flags the gap — so you practice until your performance holds up from
            every angle.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/practice"
              className="rounded-lg bg-text-primary px-5 py-2.5 text-sm font-medium text-background transition-colors hover:bg-white"
            >
              Start Practicing
            </Link>
            <a
              href="#how-it-works"
              className="rounded-lg border border-border-subtle bg-transparent px-5 py-2.5 text-sm font-medium text-text-primary transition-colors hover:border-text-muted hover:bg-surface"
            >
              How It Works
            </a>
          </div>
        </div>
      </section>

      {/* Meet the interviewers */}
      <section
        id="how-it-works"
        className="scroll-mt-8 border-t border-border-subtle px-6 py-20"
      >
        <div className="mx-auto max-w-5xl">
          <div className="max-w-2xl">
            <h2 className="font-heading text-2xl font-semibold tracking-tight text-text-primary sm:text-3xl">
              Meet Your 3 AI Interviewers
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-text-muted sm:text-base">
              Each persona grades a different dimension — then TriPanel compares
              their scores for consistency.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3">
            {PERSONAS.map((persona) => (
              <article
                key={persona.name}
                className={`rounded-xl border border-border-subtle border-t-[3px] bg-surface p-6 ${persona.accent}`}
              >
                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-full font-heading text-xl font-semibold ring-2 ${persona.avatarClass}`}
                  aria-hidden="true"
                >
                  {persona.initial}
                </div>
                <h3 className="mt-4 font-heading text-base font-semibold text-text-primary">
                  {persona.name}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-text-muted">
                  {persona.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Dynamic multi-scoring */}
      <section className="border-t border-border-subtle px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <div className="max-w-2xl">
            <h2 className="font-heading text-2xl font-semibold tracking-tight text-text-primary sm:text-3xl">
              Dynamic Multi-Scoring System
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-text-muted sm:text-base">
              Composite scores blend independent ratings. Wide spreads between
              raters surface as disagreement — so you know what to improve next.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 items-center gap-10 rounded-xl border border-border-subtle bg-surface p-8 lg:grid-cols-2 lg:gap-12 lg:p-10">
            <div className="flex flex-col items-center">
              <ScoreGauge />
              <p className="mt-4 text-center text-xs text-text-muted">
                Sample composite from a high-agreement session
              </p>
            </div>

            <div className="flex w-full flex-col gap-6">
              {DIMENSIONS.map((dimension) => (
                <div key={dimension.label}>
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <span className="text-sm font-medium text-text-primary">
                      {dimension.label}
                    </span>
                    <span className="font-mono text-sm tabular-nums text-text-muted">
                      {dimension.value}%
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-background">
                    <div
                      className={`h-full rounded-full ${dimension.barClass}`}
                      style={{ width: `${dimension.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Track blueprints */}
      <section className="border-t border-border-subtle px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <div className="max-w-2xl">
            <h2 className="font-heading text-2xl font-semibold tracking-tight text-text-primary sm:text-3xl">
              Tailored Question Blueprints
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-text-muted sm:text-base">
              Pick a track, generate a question, answer under pressure, and get
              scored by the full panel.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3">
            {TRACKS.map((track) => (
              <article
                key={track.title}
                className="flex flex-col rounded-xl border border-border-subtle bg-surface p-6"
              >
                <h3 className="font-heading text-base font-semibold text-text-primary">
                  {track.title}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-text-muted">
                  {track.description}
                </p>
                <Link
                  href="/practice"
                  className="mt-5 inline-flex w-fit rounded-lg border border-border-subtle px-4 py-2 text-sm font-medium text-text-primary transition-colors hover:border-text-muted hover:bg-background"
                >
                  Practice Now
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border-subtle px-6 py-10">
        <div className="mx-auto flex max-w-5xl flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-heading text-sm font-semibold text-text-primary">
              TriPanel
            </p>
            <p className="mt-1 text-xs text-text-muted">
              AI mock interviews with multi-rater scoring.
            </p>
          </div>
          <nav className="flex flex-wrap gap-5 text-sm text-text-muted">
            <Link href="/practice" className="transition-colors hover:text-text-primary">
              Practice
            </Link>
            <a href="#how-it-works" className="transition-colors hover:text-text-primary">
              How It Works
            </a>
            <span className="cursor-default opacity-60">Privacy</span>
            <span className="cursor-default opacity-60">Contact</span>
          </nav>
        </div>
      </footer>
    </div>
  );
}
