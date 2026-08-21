"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const INTERVIEWERS = [
  {
    id: "hr",
    initial: "P",
    role: "Behavioral / HR",
    name: "Friendly HR Interviewer",
    evaluates: "Clarity, STAR structure, and confidence in delivery.",
    difficulty: "Moderate",
  },
  {
    id: "tech",
    initial: "R",
    role: "Technical",
    name: "Strict Technical Reviewer",
    evaluates: "Correctness, edge cases, and complexity awareness.",
    difficulty: "Hard",
    featured: true,
  },
  {
    id: "system",
    initial: "A",
    role: "System Design",
    name: "System Design Skeptic",
    evaluates: "Assumptions, failure modes, concurrency, and scale.",
    difficulty: "Hard",
  },
] as const;

const DIMENSIONS = [
  { label: "Communication & Clarity", value: 86, tone: "accent" as const },
  { label: "Technical Depth", value: 78, tone: "ivory" as const },
  { label: "Confidence", value: 81, tone: "silver" as const },
  { label: "Answer Structure", value: 74, tone: "ivory" as const },
] as const;

const BLUEPRINTS = [
  {
    id: "behavioral",
    number: "01",
    label: "Behavioral",
    title: "Behavioral & Fit",
    description:
      "Storytelling under pressure — teamwork, conflict, and ownership scored for structure and delivery.",
    sample:
      "Tell me about a time you disagreed with a teammate on a technical decision. How did you handle it?",
    difficulty: "Moderate",
    duration: "8–12 min",
    skills: ["STAR structure", "Empathy", "Ownership"],
  },
  {
    id: "technical",
    number: "02",
    label: "Technical",
    title: "Technical Reasoning",
    description:
      "DS/A and coding reasoning without a full code dump — focus on approach, edge cases, and tradeoffs.",
    sample:
      "Walk through how you’d find the first non-repeating character in a string, including edge cases and complexity.",
    difficulty: "Hard",
    duration: "10–15 min",
    skills: ["Edge cases", "Complexity", "Clarity"],
  },
  {
    id: "hr",
    number: "03",
    label: "HR",
    title: "HR Screening",
    description:
      "Classic fresher HR prompts that surface communication habits before the deep technical round.",
    sample:
      "What motivates you to join an engineering role, and how do you handle feedback?",
    difficulty: "Easy",
    duration: "6–10 min",
    skills: ["Confidence", "Concision", "Tone"],
  },
  {
    id: "system",
    number: "04",
    label: "System Design",
    title: "System Design Lite",
    description:
      "Assumption-first design for early careers — scale, failure, and concurrency without a whiteboard marathon.",
    sample:
      "How would you design a RAG pipeline for an internal knowledge base? What retrieval tradeoffs matter?",
    difficulty: "Hard",
    duration: "12–18 min",
    skills: ["Assumptions", "Scale", "Tradeoffs"],
  },
] as const;

function Waveform() {
  const bars = [36, 68, 52, 88, 42, 76, 58, 92, 48, 70, 62, 84, 44, 74, 56, 80];
  return (
    <div className="flex h-7 items-end gap-[2px]" aria-hidden="true">
      {bars.map((h, i) => (
        <span
          key={i}
          className="animate-waveform w-[2.5px] rounded-full bg-ivory/70"
          style={{ height: `${h}%`, animationDelay: `${i * 0.06}s` }}
        />
      ))}
    </div>
  );
}

function HeroInterviewMock() {
  const [seconds, setSeconds] = useState(742);

  useEffect(() => {
    const id = window.setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => window.clearInterval(id);
  }, []);

  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");

  return (
    <div className="relative w-full">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-10 top-1/4 h-64 w-64 rounded-full bg-[radial-gradient(circle,_rgba(200,245,66,0.14),_transparent_70%)] blur-2xl"
      />

      <div className="relative overflow-hidden rounded-xl bg-surface-elevated ring-1 ring-border-subtle">
        {/* Title bar */}
        <div className="flex items-center justify-between gap-4 border-b border-border-subtle/80 px-5 py-3.5">
          <div className="flex items-center gap-3">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-40" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
            </span>
            <span className="text-sm text-text-muted">Panel room · Technical</span>
          </div>
          <div className="flex items-center gap-5">
            <span className="hidden text-sm text-text-muted sm:inline">
              Raters online <span className="text-ivory">3/3</span>
            </span>
            <span className="font-mono text-sm tabular-nums text-ivory">
              {mm}:{ss}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-0 lg:grid-cols-12">
          {/* Main interviewer stage */}
          <div className="relative lg:col-span-7">
            <div className="relative aspect-[16/11] bg-[linear-gradient(165deg,#1e2229_0%,#12151a_50%,#0e1013_100%)]">
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                <div className="flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-full bg-background/40 font-heading text-3xl font-semibold text-accent ring-1 ring-accent/25">
                  R
                </div>
                <div className="text-center">
                  <p className="font-heading text-base font-medium text-ivory">
                    Strict Technical Reviewer
                  </p>
                  <p className="mt-1 text-sm text-text-muted">Speaking · evaluating approach</p>
                </div>
              </div>

              <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between gap-4 bg-gradient-to-t from-background/90 to-transparent px-5 pb-4 pt-10">
                <span className="text-sm text-text-muted">AI interviewer</span>
                <Waveform />
              </div>
            </div>
          </div>

          {/* Side stack */}
          <div className="flex flex-col border-t border-border-subtle/80 lg:col-span-5 lg:border-l lg:border-t-0">
            <div className="relative flex flex-1 items-center justify-center bg-[linear-gradient(180deg,#1a1e24_0%,#12151a_100%)] px-4 py-8">
              <div className="text-center">
                <div className="mx-auto h-12 w-12 rounded-full bg-ivory/10 ring-1 ring-ivory/15" />
                <p className="mt-3 text-sm text-ivory">You</p>
                <p className="mt-0.5 text-sm text-text-muted">Camera · mic on</p>
              </div>
              <span className="absolute left-4 top-4 text-sm text-text-muted">
                Candidate
              </span>
            </div>

            <div className="grid grid-cols-2 border-t border-border-subtle/80">
              <div className="border-r border-border-subtle/80 px-4 py-4">
                <p className="text-sm text-text-muted">Confidence</p>
                <p className="mt-1 font-mono text-2xl font-semibold text-accent">
                  82%
                </p>
              </div>
              <div className="px-4 py-4">
                <p className="text-sm text-text-muted">Clarity</p>
                <p className="mt-1 font-mono text-2xl font-semibold text-ivory">
                  7.8
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Question + transcript — open, not nested cards */}
        <div className="space-y-5 border-t border-border-subtle/80 px-5 py-5 sm:px-6 sm:py-6">
          <div>
            <p className="text-sm text-text-muted">Live question</p>
            <p className="mt-2 text-base leading-relaxed text-ivory sm:text-lg">
              How would you detect a cycle in a linked list, and what is the
              space–time tradeoff of your approach?
            </p>
          </div>
          <div className="border-l-2 border-accent/50 pl-4">
            <p className="text-sm text-text-muted">Live transcript</p>
            <p className="mt-1.5 font-mono text-sm leading-relaxed text-text-muted">
              <span className="text-ivory">You — </span>
              I’d use Floyd’s tortoise-and-hare… if pointers meet, there’s a
              cycle…
              <span className="ml-1 inline-block h-3.5 w-[2px] animate-pulse bg-accent align-middle" />
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ScoreGauge() {
  const radius = 100;
  const stroke = 8;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - 0.82);

  return (
    <div className="relative flex h-60 w-60 items-center justify-center sm:h-72 sm:w-72">
      <svg viewBox="0 0 220 220" className="h-full w-full -rotate-90" aria-hidden>
        <circle
          cx="110"
          cy="110"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={stroke}
          className="text-border-subtle"
        />
        <circle
          cx="110"
          cy="110"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="text-accent"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-mono text-6xl font-semibold tracking-tight text-ivory sm:text-7xl">
          8.2
        </span>
        <span className="mt-2 text-base text-text-muted">Composite /10</span>
      </div>
    </div>
  );
}

export default function LandingPage() {
  const [activeBlueprint, setActiveBlueprint] = useState(1);
  const blueprint = BLUEPRINTS[activeBlueprint];
  const featured = INTERVIEWERS.find((p) => "featured" in p && p.featured)!;
  const others = INTERVIEWERS.filter((p) => !("featured" in p && p.featured));

  return (
    <div className="flex-1 overflow-y-auto bg-background">
      {/* HERO — cinematic, large */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_15%_10%,_rgba(200,245,66,0.07),_transparent_55%),radial-gradient(ellipse_50%_40%_at_85%_30%,_rgba(242,237,228,0.04),_transparent_50%)]"
        />

        <div className="relative mx-auto grid max-w-[1440px] items-center gap-14 px-6 pb-20 pt-16 sm:px-10 sm:pb-28 sm:pt-20 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-20 lg:px-14 lg:pb-32 lg:pt-24">
          <div className="animate-fade-up max-w-[34rem]">
            <h1 className="font-heading text-[3.25rem] font-semibold leading-[0.98] tracking-[-0.03em] text-ivory sm:text-6xl md:text-7xl lg:text-[5rem]">
              Train for the interview.
              <br />
              <span className="text-accent">Not the surprise.</span>
            </h1>
            <p className="mt-8 max-w-md text-lg leading-relaxed text-text-muted sm:text-xl">
              Three independent AI interviewers. When they agree, you trust the
              signal. When they diverge, you know exactly what to fix.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link
                href="/practice"
                className="rounded-full bg-accent px-7 py-3.5 text-base font-semibold text-background transition-all duration-200 hover:bg-accent-dim hover:shadow-[0_0_0_4px_rgba(200,245,66,0.12)]"
              >
                Start practicing
              </Link>
              <a
                href="#interviewers"
                className="group inline-flex items-center gap-2 px-2 py-3.5 text-base text-text-muted transition-colors duration-200 hover:text-ivory"
              >
                See how it works
                <span className="transition-transform duration-200 group-hover:translate-x-0.5">
                  →
                </span>
              </a>
            </div>
          </div>

          <div className="animate-fade-up" style={{ animationDelay: "0.1s" }}>
            <HeroInterviewMock />
          </div>
        </div>
      </section>

      {/* INTERVIEWERS — featured + list, not 3 equal cards */}
      <section
        id="how-it-works"
        className="scroll-mt-24 border-t border-border-subtle"
      >
        <div
          id="interviewers"
          className="mx-auto max-w-[1440px] scroll-mt-24 px-6 py-24 sm:px-10 sm:py-32 lg:px-14"
        >
          <div className="max-w-2xl">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-text-muted">
              01 — Interview panel
            </p>
            <h2 className="mt-4 font-heading text-4xl font-semibold tracking-[-0.02em] text-ivory sm:text-5xl">
              Meet the room
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-text-muted">
              Each rater owns one lens. TriPanel compares their scores so
              feedback stays honest — not averaged into mush.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
            {/* Featured technical interviewer */}
            <article className="group relative lg:col-span-7">
              <div className="overflow-hidden rounded-xl bg-surface ring-1 ring-border-subtle transition-colors duration-300 group-hover:ring-accent/25">
                <div className="relative aspect-[16/9] bg-[linear-gradient(145deg,#1c2027_0%,#111418_100%)]">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex h-24 w-24 items-center justify-center rounded-full bg-accent/10 font-heading text-4xl font-semibold text-accent ring-1 ring-accent/20">
                      {featured.initial}
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background/95 via-background/40 to-transparent px-7 pb-7 pt-16">
                    <p className="text-sm text-accent">{featured.role}</p>
                    <h3 className="mt-1 font-heading text-2xl font-semibold text-ivory sm:text-3xl">
                      {featured.name}
                    </h3>
                  </div>
                </div>
                <div className="flex flex-col gap-6 px-7 py-7 sm:flex-row sm:items-end sm:justify-between">
                  <p className="max-w-md text-base leading-relaxed text-text-muted">
                    {featured.evaluates}
                  </p>
                  <p className="shrink-0 text-sm text-text-muted">
                    Difficulty{" "}
                    <span className="text-ivory">{featured.difficulty}</span>
                  </p>
                </div>
              </div>
            </article>

            {/* Secondary list — open rows, not cards */}
            <div className="flex flex-col justify-center gap-0 lg:col-span-5">
              {others.map((person, i) => (
                <article
                  key={person.id}
                  className={`group flex gap-5 py-8 transition-colors duration-200 ${
                    i === 0 ? "border-b border-border-subtle" : ""
                  }`}
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-surface font-heading text-lg font-semibold text-ivory ring-1 ring-border-subtle transition-colors duration-200 group-hover:ring-ivory/30">
                    {person.initial}
                  </div>
                  <div>
                    <p className="text-sm text-text-muted">{person.role}</p>
                    <h3 className="mt-1 font-heading text-xl font-semibold text-ivory">
                      {person.name}
                    </h3>
                    <p className="mt-2 text-base leading-relaxed text-text-muted">
                      {person.evaluates}
                    </p>
                    <p className="mt-3 text-sm text-text-muted">
                      Difficulty{" "}
                      <span className="text-ivory">{person.difficulty}</span>
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SCORING — open analytics composition */}
      <section
        id="scoring"
        className="scroll-mt-24 border-t border-border-subtle bg-surface/40"
      >
        <div className="mx-auto max-w-[1440px] px-6 py-24 sm:px-10 sm:py-32 lg:px-14">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-5">
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-text-muted">
                02 — Performance analysis
              </p>
              <h2 className="mt-4 font-heading text-4xl font-semibold tracking-[-0.02em] text-ivory sm:text-5xl">
                Multi-scoring that holds up
              </h2>
              <p className="mt-5 max-w-md text-lg leading-relaxed text-text-muted">
                Independent ratings. Clear spreads. Feedback you can act on —
                not a single vanity average.
              </p>

              <dl className="mt-12 space-y-6 border-t border-border-subtle pt-10">
                <div>
                  <dt className="text-sm text-text-muted">Strongest skill</dt>
                  <dd className="mt-1 font-heading text-xl text-ivory">
                    Communication & Clarity
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-text-muted">Needs work</dt>
                  <dd className="mt-1 font-heading text-xl text-ivory">
                    Answer Structure
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-text-muted">Next move</dt>
                  <dd className="mt-1 font-heading text-xl text-accent">
                    Lead with assumptions
                  </dd>
                </div>
              </dl>
            </div>

            <div className="flex flex-col items-center gap-14 lg:col-span-7 lg:items-stretch lg:pl-8">
              <div className="flex justify-center lg:justify-start">
                <ScoreGauge />
              </div>
              <div className="w-full max-w-xl space-y-7 self-center lg:self-stretch lg:max-w-none">
                {DIMENSIONS.map((dim) => (
                  <div key={dim.label}>
                    <div className="mb-2.5 flex items-baseline justify-between gap-3">
                      <span className="text-base text-ivory">{dim.label}</span>
                      <span className="font-mono text-base tabular-nums text-text-muted">
                        {dim.value}%
                      </span>
                    </div>
                    <div className="h-1 overflow-hidden rounded-full bg-background">
                      <div
                        className={`h-full rounded-full ${
                          dim.tone === "accent"
                            ? "bg-accent"
                            : dim.tone === "silver"
                              ? "bg-silver"
                              : "bg-ivory/70"
                        }`}
                        style={{ width: `${dim.value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BLUEPRINTS — tab + open panel */}
      <section className="border-t border-border-subtle">
        <div className="mx-auto max-w-[1440px] px-6 py-24 sm:px-10 sm:py-32 lg:px-14">
          <div className="max-w-2xl">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-text-muted">
              03 — Question blueprints
            </p>
            <h2 className="mt-4 font-heading text-4xl font-semibold tracking-[-0.02em] text-ivory sm:text-5xl">
              Pick a track. Get a real prompt.
            </h2>
          </div>

          <div className="mt-14 border-t border-border-subtle">
            <div
              role="tablist"
              className="flex gap-0 overflow-x-auto border-b border-border-subtle"
            >
              {BLUEPRINTS.map((item, index) => {
                const active = index === activeBlueprint;
                return (
                  <button
                    key={item.id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setActiveBlueprint(index)}
                    className={`relative shrink-0 px-5 py-5 text-left transition-colors duration-200 sm:px-7 ${
                      active
                        ? "text-ivory"
                        : "text-text-muted hover:text-ivory"
                    }`}
                  >
                    <span className="font-mono text-sm">
                      {item.number}
                    </span>
                    <span className="ml-3 text-base font-medium">
                      {item.label}
                    </span>
                    {active && (
                      <span className="absolute inset-x-0 bottom-0 h-0.5 bg-accent" />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="grid grid-cols-1 gap-12 py-12 lg:grid-cols-12 lg:gap-16 lg:py-16">
              <div className="lg:col-span-5">
                <h3 className="font-heading text-3xl font-semibold text-ivory">
                  {blueprint.title}
                </h3>
                <p className="mt-4 text-lg leading-relaxed text-text-muted">
                  {blueprint.description}
                </p>
                <div className="mt-8 flex flex-wrap gap-x-10 gap-y-4 text-base">
                  <p>
                    <span className="text-text-muted">Difficulty </span>
                    <span className="text-ivory">{blueprint.difficulty}</span>
                  </p>
                  <p>
                    <span className="text-text-muted">Duration </span>
                    <span className="text-ivory">{blueprint.duration}</span>
                  </p>
                </div>
                <p className="mt-6 text-base text-text-muted">
                  Skills ·{" "}
                  <span className="text-ivory">
                    {blueprint.skills.join(" · ")}
                  </span>
                </p>
                <Link
                  href="/practice"
                  className="mt-10 inline-flex rounded-full bg-accent px-6 py-3 text-sm font-semibold text-background transition-all duration-200 hover:bg-accent-dim"
                >
                  Practice now
                </Link>
              </div>

              <div className="lg:col-span-7">
                <p className="text-sm text-text-muted">Sample question</p>
                <blockquote className="mt-4 border-l-2 border-accent pl-6 font-heading text-2xl leading-snug tracking-tight text-ivory sm:text-3xl sm:leading-snug">
                  {blueprint.sample}
                </blockquote>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-border-subtle">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-6 px-6 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-10 lg:px-14">
          <p className="font-heading text-base font-semibold text-ivory">
            TriPanel
          </p>
          <nav className="flex gap-8 text-base text-text-muted">
            <Link href="/practice" className="transition-colors hover:text-ivory">
              Practice
            </Link>
            <a href="#interviewers" className="transition-colors hover:text-ivory">
              Interviewers
            </a>
            <a href="#scoring" className="transition-colors hover:text-ivory">
              Scoring
            </a>
          </nav>
        </div>
      </footer>
    </div>
  );
}
