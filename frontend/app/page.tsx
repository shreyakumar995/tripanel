"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const PANEL = [
  {
    id: "tech",
    number: "01",
    role: "Technical Reviewer",
    name: "Strict Technical Reviewer",
    evaluates: ["Problem solving", "Technical depth", "Code quality"],
    identity: "Precise. Structured. Analytical.",
    initial: "R",
  },
  {
    id: "hr",
    number: "02",
    role: "Behavioral Interviewer",
    name: "Friendly HR Interviewer",
    evaluates: ["Communication", "Confidence", "Decision-making", "Clarity"],
    identity: "Conversational. Balanced. Human-focused.",
    initial: "P",
  },
  {
    id: "system",
    number: "03",
    role: "System Design Specialist",
    name: "System Design Skeptic",
    evaluates: ["Architecture", "Scalability", "Tradeoffs", "Structured thinking"],
    identity: "Strategic. Systems-focused. Skeptical.",
    initial: "A",
  },
] as const;

const DIMENSIONS = [
  { label: "Communication & Clarity", value: 86, signal: "strong" as const },
  { label: "Technical Depth", value: 78, signal: "strong" as const },
  { label: "Confidence", value: 81, signal: "strong" as const },
  { label: "Answer Structure", value: 62, signal: "weak" as const },
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

const JOURNEY = [
  {
    session: "01",
    label: "Baseline",
    scores: { Confidence: 58, Communication: 62, Technical: 70, Structure: 48 },
  },
  {
    session: "04",
    label: "Midpoint",
    scores: { Confidence: 71, Communication: 74, Technical: 76, Structure: 61 },
  },
  {
    session: "08",
    label: "Current",
    scores: { Confidence: 84, Communication: 86, Technical: 82, Structure: 78 },
  },
] as const;

function SectionLabel({
  index,
  children,
}: {
  index: string;
  children: string;
}) {
  return (
    <p className="flex items-center gap-3 text-sm font-medium uppercase tracking-[0.2em] text-text-muted">
      <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden />
      <span>
        {index} / {children}
      </span>
    </p>
  );
}

function Waveform() {
  const bars = [36, 68, 52, 88, 42, 76, 58, 92, 48, 70, 62, 84, 44, 74, 56, 80];
  return (
    <div className="flex h-7 items-end gap-[2px]" aria-hidden>
      {bars.map((h, i) => (
        <span
          key={i}
          className="animate-waveform w-[2.5px] rounded-full bg-accent/80"
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
        className="pointer-events-none absolute -inset-8 bg-[radial-gradient(ellipse_at_center,_rgba(199,244,58,0.12),_transparent_68%)] blur-2xl"
      />

      <div className="relative overflow-hidden rounded-xl bg-surface-elevated ring-1 ring-border-subtle">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border-subtle/80 px-5 py-3.5">
          <div className="flex items-center gap-3">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-35" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
            </span>
            <span className="text-sm text-text-muted">Panel room · Technical</span>
          </div>
          <div className="flex items-center gap-5 text-sm">
            <span className="text-text-muted">
              Raters <span className="text-ivory">3/3</span>
            </span>
            <span className="font-mono tabular-nums text-ivory">
              {mm}:{ss}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12">
          <div className="relative lg:col-span-7">
            <div className="relative aspect-[16/11] bg-[linear-gradient(165deg,#1e2329_0%,#12161a_55%,#0e1114_100%)]">
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                <div className="flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-full bg-background/50 font-heading text-3xl font-semibold text-accent ring-1 ring-accent/30">
                  R
                </div>
                <div className="text-center">
                  <p className="font-heading text-base font-medium text-ivory">
                    Strict Technical Reviewer
                  </p>
                  <p className="mt-1 text-sm text-text-muted">
                    Speaking · evaluating approach
                  </p>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between bg-gradient-to-t from-background/90 to-transparent px-5 pb-4 pt-12">
                <span className="text-sm text-text-muted">AI interviewer</span>
                <Waveform />
              </div>
            </div>
          </div>

          <div className="flex flex-col border-t border-border-subtle/80 lg:col-span-5 lg:border-l lg:border-t-0">
            <div className="relative flex flex-1 items-center justify-center bg-[linear-gradient(180deg,#1a1f25_0%,#12161a_100%)] px-4 py-8">
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
              <div className="border-r border-t border-border-subtle/80 px-4 py-4">
                <p className="text-sm text-text-muted">Technical</p>
                <p className="mt-1 font-mono text-2xl font-semibold text-accent">
                  8.1
                </p>
              </div>
              <div className="border-t border-border-subtle/80 px-4 py-4">
                <p className="text-sm text-text-muted">Structure</p>
                <p className="mt-1 font-mono text-2xl font-semibold text-oxblood-muted">
                  6.2
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-5 border-t border-border-subtle/80 px-5 py-5 sm:px-6 sm:py-6">
          <div>
            <p className="text-sm text-text-muted">Live question</p>
            <p className="mt-2 text-base leading-relaxed text-ivory sm:text-lg">
              How would you detect a cycle in a linked list, and what is the
              space–time tradeoff of your approach?
            </p>
          </div>
          <div className="border-l-2 border-accent/60 pl-4">
            <p className="text-sm text-text-muted">Live transcript</p>
            <p className="mt-1.5 font-mono text-sm leading-relaxed text-text-muted">
              <span className="text-ivory">You — </span>
              I’d use Floyd’s tortoise-and-hare… if pointers meet, there’s a
              cycle…
              <span className="animate-cursor ml-1 inline-block h-3.5 w-[2px] bg-accent align-middle" />
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
  const c = 2 * Math.PI * radius;
  // Strong arc ~82%, small oxblood segment for weakness (~8% of ring)
  const strong = c * 0.74;
  const weak = c * 0.08;
  const gap = c - strong - weak;

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
          strokeDasharray={`${strong} ${c - strong}`}
          className="text-accent"
        />
        <circle
          cx="110"
          cy="110"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${weak} ${c - weak}`}
          strokeDashoffset={-(strong + gap * 0.15)}
          className="text-oxblood-muted"
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

function AgreementViz() {
  const states = [
    {
      id: "high",
      title: "High agreement",
      body: "Three signals align. Trust the composite.",
      dots: ["lime", "lime", "lime"] as const,
      active: true,
    },
    {
      id: "mixed",
      title: "Mixed signal",
      body: "Two agree. One flags a weakness.",
      dots: ["lime", "lime", "oxblood"] as const,
      active: false,
    },
    {
      id: "low",
      title: "Low agreement",
      body: "Perspectives diverge — investigate the gap.",
      dots: ["oxblood", "neutral", "oxblood"] as const,
      active: false,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-0 md:grid-cols-3">
      {states.map((state, i) => (
        <div
          key={state.id}
          className={`border-border-subtle px-6 py-8 md:px-8 ${
            i < states.length - 1 ? "border-b md:border-b-0 md:border-r" : ""
          } ${state.active ? "bg-surface/80" : ""}`}
        >
          <div className="flex items-center gap-2" aria-hidden>
            {state.dots.map((dot, di) => (
              <span
                key={di}
                className={`h-2.5 w-2.5 rounded-full ${
                  dot === "lime"
                    ? "bg-accent"
                    : dot === "oxblood"
                      ? "bg-oxblood-muted"
                      : "bg-border-subtle"
                }`}
              />
            ))}
          </div>
          <h3 className="mt-5 font-heading text-xl font-semibold text-ivory">
            {state.title}
          </h3>
          <p className="mt-2 text-base leading-relaxed text-text-muted">
            {state.body}
          </p>
        </div>
      ))}
    </div>
  );
}

export default function LandingPage() {
  const [activeBlueprint, setActiveBlueprint] = useState(1);
  const blueprint = BLUEPRINTS[activeBlueprint];

  return (
    <div className="flex-1 overflow-y-auto bg-background">
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_12%_20%,_rgba(199,244,58,0.08),_transparent_55%),radial-gradient(ellipse_45%_40%_at_92%_70%,_rgba(143,38,56,0.1),_transparent_55%),linear-gradient(180deg,#0b0d0e_0%,#141015_45%,#0b0d0e_100%)]"
        />

        <div className="relative mx-auto grid max-w-[1480px] items-center gap-14 px-6 pb-20 pt-14 sm:px-10 sm:pb-28 sm:pt-16 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16 lg:px-16 lg:pb-32 lg:pt-20">
          <div className="animate-fade-up max-w-[36rem]">
            <h1 className="font-heading text-[3.4rem] font-semibold leading-[0.96] tracking-[-0.035em] text-ivory sm:text-6xl md:text-7xl lg:text-[5.15rem]">
              Train for the
              <br />
              interview.
              <br />
              <span className="text-lime-gradient">Not the surprise.</span>
            </h1>
            <p className="mt-8 max-w-md text-lg leading-relaxed text-text-muted sm:text-xl">
              Three independent AI interviewers. When they agree, you trust the
              signal. When they diverge, you know exactly what to improve.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-5">
              <Link
                href="/practice"
                className="btn-lime rounded-full px-7 py-3.5 text-base font-semibold text-background transition-all duration-200 hover:-translate-y-px hover:shadow-[0_0_0_4px_rgba(199,244,58,0.14)]"
              >
                Start practicing
              </Link>
              <a
                href="#interviewers"
                className="group inline-flex items-center gap-2 py-3.5 text-base text-text-muted transition-colors duration-200 hover:text-ivory"
              >
                See how it works
                <span className="transition-transform duration-200 group-hover:translate-x-1">
                  →
                </span>
              </a>
            </div>
            <p className="mt-12 text-sm tracking-wide text-text-muted">
              Three perspectives.{" "}
              <span className="text-ivory">One clearer signal.</span>
            </p>
          </div>

          <div className="animate-fade-up" style={{ animationDelay: "0.1s" }}>
            <HeroInterviewMock />
          </div>
        </div>
      </section>

      {/* 01 THE PANEL */}
      <section
        id="how-it-works"
        className="scroll-mt-24 border-t border-border-subtle"
      >
        <div
          id="interviewers"
          className="mx-auto max-w-[1480px] scroll-mt-24 px-6 py-24 sm:px-10 sm:py-32 lg:px-16"
        >
          <div className="max-w-2xl">
            <SectionLabel index="01">The panel</SectionLabel>
            <h2 className="mt-5 font-heading text-4xl font-semibold tracking-[-0.025em] text-ivory sm:text-5xl">
              Three interviewers.
              <br />
              Three lenses.
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-text-muted">
              Independent rubrics. No averaged mush — TriPanel compares their
              scores so feedback stays honest.
            </p>
          </div>

          <div className="mt-16 space-y-0 border-t border-border-subtle">
            {PANEL.map((person, i) => (
              <article
                key={person.id}
                className={`group grid grid-cols-1 gap-8 border-b border-border-subtle py-10 transition-colors duration-300 hover:bg-secondary/60 md:grid-cols-12 md:gap-6 md:py-12 ${
                  i === 0 ? "" : ""
                }`}
              >
                <div className="flex items-start gap-5 md:col-span-4">
                  <span className="font-mono text-sm text-text-muted">
                    {person.number}
                  </span>
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-surface-elevated font-heading text-xl font-semibold text-ivory ring-1 ring-border-subtle transition-all duration-300 group-hover:ring-accent/35 group-hover:text-accent">
                    {person.initial}
                  </div>
                  <div>
                    <p className="text-sm text-text-muted">{person.role}</p>
                    <h3 className="mt-1 font-heading text-xl font-semibold text-ivory md:text-2xl">
                      {person.name}
                    </h3>
                  </div>
                </div>
                <div className="md:col-span-4 md:pt-1">
                  <p className="text-base italic leading-relaxed text-text-muted">
                    {person.identity}
                  </p>
                </div>
                <div className="md:col-span-4 md:pt-1">
                  <p className="text-sm text-text-muted">Evaluates</p>
                  <ul className="mt-2 space-y-1">
                    {person.evaluates.map((item) => (
                      <li key={item} className="text-base text-ivory">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 02 MULTI-SIGNAL SCORING */}
      <section
        id="scoring"
        className="scroll-mt-24 border-t border-border-subtle bg-secondary/50"
      >
        <div className="mx-auto max-w-[1480px] px-6 py-24 sm:px-10 sm:py-32 lg:px-16">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-5">
              <SectionLabel index="02">Multi-signal scoring</SectionLabel>
              <h2 className="mt-5 font-heading text-4xl font-semibold tracking-[-0.025em] text-ivory sm:text-5xl">
                Performance that holds up under a panel
              </h2>
              <p className="mt-5 max-w-md text-lg leading-relaxed text-text-muted">
                Lime marks strength. Oxblood marks pressure points. Neutral
                graphite keeps the rest clear.
              </p>

              <dl className="mt-12 space-y-8 border-t border-border-subtle pt-10">
                <div>
                  <dt className="text-sm uppercase tracking-[0.16em] text-text-muted">
                    Strongest area
                  </dt>
                  <dd className="mt-2 font-heading text-xl text-ivory">
                    Clear technical explanation
                  </dd>
                </div>
                <div>
                  <dt className="text-sm uppercase tracking-[0.16em] text-text-muted">
                    Needs improvement
                  </dt>
                  <dd className="mt-2 font-heading text-xl text-oxblood-muted">
                    Answer structure under pressure
                  </dd>
                </div>
                <div>
                  <dt className="text-sm uppercase tracking-[0.16em] text-text-muted">
                    AI recommendation
                  </dt>
                  <dd className="mt-2 font-heading text-xl text-accent">
                    Context → Approach → Result
                  </dd>
                </div>
              </dl>
            </div>

            <div className="flex flex-col gap-14 lg:col-span-7 lg:pl-6">
              <div className="flex justify-center lg:justify-start">
                <ScoreGauge />
              </div>
              <div className="w-full space-y-7">
                {DIMENSIONS.map((dim) => (
                  <div key={dim.label}>
                    <div className="mb-2.5 flex items-baseline justify-between gap-3">
                      <span className="text-base text-ivory">{dim.label}</span>
                      <span
                        className={`font-mono text-base tabular-nums ${
                          dim.signal === "weak"
                            ? "text-oxblood-muted"
                            : "text-text-muted"
                        }`}
                      >
                        {dim.value}%
                      </span>
                    </div>
                    <div className="h-1 overflow-hidden rounded-full bg-background">
                      <div
                        className={`h-full rounded-full ${
                          dim.signal === "weak" ? "bg-oxblood-muted" : "bg-accent"
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

      {/* 03 INTERVIEW AGREEMENT */}
      <section
        id="agreement"
        className="scroll-mt-24 border-t border-border-subtle"
      >
        <div className="mx-auto max-w-[1480px] px-6 py-24 sm:px-10 sm:py-32 lg:px-16">
          <div className="max-w-2xl">
            <SectionLabel index="03">Interview agreement</SectionLabel>
            <h2 className="mt-5 font-heading text-4xl font-semibold tracking-[-0.025em] text-ivory sm:text-5xl">
              Agreement is the product
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-text-muted">
              When raters align, confidence rises. When they diverge, TriPanel
              turns disagreement into a clear improvement target.
            </p>
          </div>
          <div className="mt-14 overflow-hidden rounded-xl ring-1 ring-border-subtle">
            <AgreementViz />
          </div>
        </div>
      </section>

      {/* 04 QUESTION BLUEPRINTS */}
      <section className="relative border-t border-border-subtle bg-secondary/40">
        <div className="pointer-events-none absolute inset-0 bg-grid-faint opacity-50" />
        <div className="relative mx-auto max-w-[1480px] px-6 py-24 sm:px-10 sm:py-32 lg:px-16">
          <div className="max-w-2xl">
            <SectionLabel index="04">Question blueprints</SectionLabel>
            <h2 className="mt-5 font-heading text-4xl font-semibold tracking-[-0.025em] text-ivory sm:text-5xl">
              Pick a track. Get a real prompt.
            </h2>
          </div>

          <div className="mt-14">
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
                    className={`relative shrink-0 px-5 py-5 text-left transition-colors duration-200 sm:px-8 ${
                      active ? "text-ivory" : "text-text-muted hover:text-ivory"
                    }`}
                  >
                    <span className="font-mono text-sm">{item.number}</span>
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
                <div className="mt-8 flex flex-wrap gap-x-10 gap-y-3 text-base">
                  <p>
                    <span className="text-text-muted">Difficulty </span>
                    <span className="text-ivory">{blueprint.difficulty}</span>
                  </p>
                  <p>
                    <span className="text-text-muted">Duration </span>
                    <span className="text-ivory">{blueprint.duration}</span>
                  </p>
                </div>
                <p className="mt-5 text-base text-text-muted">
                  Skills ·{" "}
                  <span className="text-ivory">
                    {blueprint.skills.join(" · ")}
                  </span>
                </p>
                <Link
                  href="/practice"
                  className="btn-lime mt-10 inline-flex rounded-full px-6 py-3 text-sm font-semibold text-background transition-all duration-200 hover:-translate-y-px"
                >
                  Practice now
                </Link>
              </div>
              <div className="lg:col-span-7">
                <p className="text-sm text-text-muted">Sample question</p>
                <blockquote className="mt-4 border-l-2 border-accent pl-6 font-heading text-2xl leading-snug tracking-tight text-ivory sm:text-3xl">
                  {blueprint.sample}
                </blockquote>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 05 IMPROVEMENT JOURNEY */}
      <section className="border-t border-border-subtle">
        <div className="mx-auto max-w-[1480px] px-6 py-24 sm:px-10 sm:py-32 lg:px-16">
          <div className="max-w-2xl">
            <SectionLabel index="05">Improve with every session</SectionLabel>
            <h2 className="mt-5 font-heading text-4xl font-semibold tracking-[-0.025em] text-ivory sm:text-5xl">
              Practice → Feedback → Adjustment
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-text-muted">
              Lime tracks measurable gains. Oxblood marks weaknesses that
              shrink across sessions.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-0">
            {JOURNEY.map((step, i) => (
              <div
                key={step.session}
                className={`relative ${
                  i < JOURNEY.length - 1
                    ? "md:border-r md:border-border-subtle md:pr-10"
                    : "md:pl-10"
                } ${i > 0 ? "md:pl-10" : ""}`}
              >
                {i < JOURNEY.length - 1 && (
                  <span
                    className="absolute right-0 top-3 hidden translate-x-1/2 text-text-muted md:block"
                    aria-hidden
                  >
                    →
                  </span>
                )}
                <p className="font-mono text-sm text-text-muted">
                  Session {step.session}
                </p>
                <h3 className="mt-2 font-heading text-2xl font-semibold text-ivory">
                  {step.label}
                </h3>
                <ul className="mt-6 space-y-3">
                  {Object.entries(step.scores).map(([key, value]) => {
                    const isWeak =
                      (step.session === "01" && key === "Structure") ||
                      (step.session === "04" && key === "Structure" && value < 70);
                    return (
                      <li
                        key={key}
                        className="flex items-center justify-between text-base"
                      >
                        <span className="text-text-muted">{key}</span>
                        <span
                          className={`font-mono tabular-nums ${
                            isWeak ? "text-oxblood-muted" : "text-accent"
                          }`}
                        >
                          {value}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-border-subtle">
        <div className="mx-auto flex max-w-[1480px] flex-col gap-6 px-6 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-10 lg:px-16">
          <div className="flex items-center gap-3">
            <span className="flex items-end gap-[3px]" aria-hidden>
              <span className="h-2 w-[3px] rounded-full bg-ivory/40" />
              <span className="h-3.5 w-[3px] rounded-full bg-accent" />
              <span className="h-2.5 w-[3px] rounded-full bg-ivory/55" />
            </span>
            <p className="font-heading text-base font-semibold text-ivory">
              TriPanel
            </p>
          </div>
          <nav className="flex flex-wrap gap-8 text-base text-text-muted">
            <Link href="/practice" className="hover:text-ivory">
              Practice
            </Link>
            <a href="#interviewers" className="hover:text-ivory">
              Interviewers
            </a>
            <a href="#scoring" className="hover:text-ivory">
              Scoring
            </a>
            <a href="#agreement" className="hover:text-ivory">
              Agreement
            </a>
          </nav>
        </div>
      </footer>
    </div>
  );
}
