"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";
import HeroVisual from "./components/landing/HeroVisual";
import InterviewShowcase from "./components/landing/InterviewShowcase";
import ScoreShowcase from "./components/landing/ScoreShowcase";
import ScrollProgress from "./components/ScrollProgress";
import {
  useCountUp,
  useInView,
  usePrefersReducedMotion,
} from "./hooks/useMotion";

const PANEL = [
  {
    id: "tech",
    number: "01",
    role: "Technical Reviewer",
    name: "Strict Technical Reviewer",
    evaluates: ["Technical depth", "Problem solving", "Code quality"],
    initial: "R",
    image:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&q=80&auto=format&fit=crop",
    tint: "from-[#EDF8E8] to-[#F8FAF5]",
    accent: "text-[#48B536]",
    avatar: "bg-[#72D13D]/15 text-[#48B536]",
  },
  {
    id: "hr",
    number: "02",
    role: "Behavioral Interviewer",
    name: "Friendly HR Interviewer",
    evaluates: ["Communication", "Confidence", "Decision making"],
    initial: "P",
    image:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a178?w=800&q=80&auto=format&fit=crop",
    tint: "from-[#F1F7ED] to-[#F8FAF5]",
    accent: "text-[#172018]",
    avatar: "bg-[#172018]/8 text-[#172018]",
  },
  {
    id: "system",
    number: "03",
    role: "System Design Specialist",
    name: "System Design Skeptic",
    evaluates: ["Architecture", "Scalability", "Tradeoffs"],
    initial: "A",
    image:
      "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&q=80&auto=format&fit=crop",
    tint: "from-[#F1F7ED] to-[#EDF8E8]",
    accent: "text-[#667066]",
    avatar: "bg-[#667066]/12 text-[#667066]",
  },
] as const;

const STEPS = [
  {
    number: "01",
    title: "Choose your role",
    body: "Pick a track — SDE Technical, GenAI, or HR Behavioral — and optionally paste a job description to tailor questions.",
  },
  {
    number: "02",
    title: "Face the panel",
    body: "Answer out loud or in text while three independent AI interviewers evaluate from different rubrics.",
  },
  {
    number: "03",
    title: "Understand your performance",
    body: "Review composite scores, dimension breakdowns, and consistency badges that surface where raters agree or diverge.",
  },
] as const;

const BLUEPRINTS = [
  {
    id: "technical",
    label: "Technical",
    title: "Technical Reasoning",
    description:
      "DS/A and coding reasoning — approach, edge cases, and complexity without a full code dump.",
    sample: "How would you detect a cycle in a linked list?",
    difficulty: "Medium",
    duration: "12 min",
    skills: ["Problem solving", "Complexity analysis", "Communication"],
  },
  {
    id: "behavioral",
    label: "Behavioral",
    title: "Behavioral & Fit",
    description:
      "Storytelling under pressure — teamwork, conflict, and ownership scored for structure and delivery.",
    sample:
      "Tell me about a time you disagreed with a teammate on a technical decision.",
    difficulty: "Moderate",
    duration: "10 min",
    skills: ["STAR structure", "Empathy", "Ownership"],
  },
  {
    id: "hr",
    label: "HR",
    title: "HR Screening",
    description:
      "Classic fresher HR prompts that surface communication habits before the deep technical round.",
    sample: "What motivates you to join an engineering role?",
    difficulty: "Easy",
    duration: "8 min",
    skills: ["Confidence", "Concision", "Tone"],
  },
  {
    id: "system",
    label: "System Design",
    title: "System Design Lite",
    description:
      "Assumption-first design — scale, failure, and concurrency without a whiteboard marathon.",
    sample:
      "How would you design a RAG pipeline for an internal knowledge base?",
    difficulty: "Hard",
    duration: "15 min",
    skills: ["Assumptions", "Scale", "Tradeoffs"],
  },
] as const;

const ROLES = [
  { label: "Software Engineer", track: "SDE Technical" },
  { label: "Frontend Developer", track: "SDE Technical" },
  { label: "Backend Developer", track: "SDE Technical" },
  { label: "Data Analyst", track: "SDE Technical" },
  { label: "Product Engineer", track: "GenAI" },
  { label: "System Design", track: "SDE Technical" },
] as const;

const JOURNEY = [
  {
    session: "01",
    label: "First interview",
    scores: { "Technical depth": 58, Communication: 62, Confidence: 55, Structure: 48 },
  },
  {
    session: "04",
    label: "Feedback applied",
    scores: { "Technical depth": 71, Communication: 74, Confidence: 68, Structure: 61 },
  },
  {
    session: "08",
    label: "Clear improvement",
    scores: { "Technical depth": 84, Communication: 86, Confidence: 82, Structure: 78 },
  },
] as const;

const TRUST_STATS = [
  { value: 3, suffix: "", label: "AI interview perspectives" },
  { value: 4, suffix: "+", label: "Question categories" },
  { value: 3, suffix: "", label: "Independent scoring rubrics" },
] as const;

function Reveal({
  children,
  className = "",
  variant = "landing-reveal",
  delayMs = 0,
  root,
}: {
  children: ReactNode;
  className?: string;
  variant?: string;
  delayMs?: number;
  root?: RefObject<Element | null>;
}) {
  const { ref, isInView } = useInView<HTMLDivElement>({ root, once: true });

  return (
    <div
      ref={ref}
      className={`${variant} ${isInView ? "is-visible" : ""} ${className}`}
      style={{ transitionDelay: `${delayMs}ms` }}
    >
      {children}
    </div>
  );
}

function TrustMetric({
  value,
  suffix,
  label,
  active,
}: {
  value: number;
  suffix: string;
  label: string;
  active: boolean;
}) {
  const count = useCountUp(value, active, { duration: 1400, decimals: 0 });

  return (
    <div className="text-center sm:text-left">
      <p className="font-display text-3xl font-semibold tracking-tight text-[#172018] sm:text-4xl">
        {Math.round(count)}
        {suffix}
      </p>
      <p className="mt-1 text-sm text-[#667066]">{label}</p>
    </div>
  );
}

export default function LandingPage() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [heroReady, setHeroReady] = useState(false);
  const [activeBlueprint, setActiveBlueprint] = useState(0);
  const [blueprintKey, setBlueprintKey] = useState(0);
  const reduced = usePrefersReducedMotion();
  const blueprint = BLUEPRINTS[activeBlueprint];

  const trust = useInView<HTMLDivElement>({ root: scrollRef, once: true });
  const scoring = useInView<HTMLDivElement>({
    root: scrollRef,
    once: true,
    threshold: 0.15,
  });
  const steps = useInView<HTMLDivElement>({
    root: scrollRef,
    once: true,
    threshold: 0.2,
  });
  const journey = useInView<HTMLDivElement>({
    root: scrollRef,
    once: true,
    threshold: 0.15,
  });

  useEffect(() => {
    const t = window.setTimeout(() => setHeroReady(true), reduced ? 0 : 600);
    return () => window.clearTimeout(t);
  }, [reduced]);

  return (
    <div
      ref={scrollRef}
      className="landing-page relative flex-1 overflow-y-auto"
    >
      <ScrollProgress scrollRef={scrollRef} barClassName="landing-progress-bar" />

      {/* HERO */}
      <section className="landing-gradient-hero relative overflow-hidden">
        <div
          aria-hidden
          className="landing-dot-grid pointer-events-none absolute inset-0 opacity-40"
        />
        <div className="relative mx-auto grid max-w-[1280px] items-center gap-12 px-6 pb-16 pt-12 sm:px-8 sm:pb-20 sm:pt-16 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-16 lg:px-10 lg:pb-24 lg:pt-20">
          <div className="max-w-xl">
            <p
              className="landing-eyebrow landing-hero-line"
              style={{ animationDelay: reduced ? "0ms" : "80ms" }}
            >
              AI mock interview platform
            </p>
            <h1 className="landing-heading-xl mt-5 text-[#172018]">
              <span
                className="landing-hero-line block"
                style={{ animationDelay: reduced ? "0ms" : "160ms" }}
              >
                Practice the interview.
              </span>
              <span
                className="landing-hero-line block text-[#48B536]"
                style={{ animationDelay: reduced ? "0ms" : "280ms" }}
              >
                Build the confidence.
              </span>
            </h1>
            <p
              className="landing-body landing-hero-line mt-6 max-w-md"
              style={{ animationDelay: reduced ? "0ms" : "400ms" }}
            >
              Practice realistic interviews with three AI interviewers who
              evaluate your technical depth, communication, and problem-solving
              from different perspectives.
            </p>
            <div
              className="landing-hero-line mt-8 flex flex-wrap items-center gap-4"
              style={{ animationDelay: reduced ? "0ms" : "520ms" }}
            >
              <Link href="/practice" className="landing-btn-primary">
                Start a mock interview
                <span aria-hidden>→</span>
              </Link>
              <a href="#how-it-works" className="landing-btn-secondary">
                See how TriPanel works
              </a>
            </div>
            <p
              className="landing-hero-line mt-8 text-sm text-[#667066]"
              style={{ animationDelay: reduced ? "0ms" : "620ms" }}
            >
              Three perspectives.{" "}
              <span className="font-medium text-[#172018]">
                One clearer signal.
              </span>
            </p>
          </div>

          <HeroVisual active={heroReady} />
        </div>
      </section>

      {/* TRUST */}
      <section className="border-y border-[#DCE4D8] bg-white">
        <div
          ref={trust.ref}
          className="mx-auto max-w-[1280px] px-6 py-10 sm:px-8 lg:px-10"
        >
          <p className="text-center text-sm font-medium text-[#667066] sm:text-left">
            Built for serious interview preparation
          </p>
          <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-3 sm:gap-6">
            {TRUST_STATS.map((stat, i) => (
              <TrustMetric
                key={stat.label}
                value={stat.value}
                suffix={stat.suffix}
                label={stat.label}
                active={trust.isInView}
              />
            ))}
          </div>
        </div>
      </section>

      {/* INTERVIEWERS */}
      <section id="interviewers" className="scroll-mt-24 bg-[#F8FAF5] py-20 sm:py-28">
        <div className="mx-auto max-w-[1280px] px-6 sm:px-8 lg:px-10">
          <Reveal root={scrollRef} variant="landing-reveal-scale" className="max-w-2xl">
            <p className="landing-eyebrow">Meet your panel</p>
            <h2 className="landing-heading-lg mt-4 text-[#172018]">
              Three interviewers.
              <br />
              Three lenses on one answer.
            </h2>
            <p className="landing-body mt-4">
              Independent rubrics — no averaged mush. TriPanel compares their
              scores so feedback stays honest and actionable.
            </p>
          </Reveal>

          <div className="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-5">
            {PANEL.map((person, i) => (
              <Reveal
                key={person.id}
                root={scrollRef}
                delayMs={reduced ? 0 : i * 120}
                variant="landing-reveal"
              >
                <article className="landing-interviewer-panel landing-card group overflow-hidden">
                  <div className={`relative h-48 bg-gradient-to-b ${person.tint}`}>
                    <Image
                      src={person.image}
                      alt={person.role}
                      fill
                      className="landing-panel-image object-cover object-top"
                      sizes="(max-width: 1024px) 100vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#172018]/30 to-transparent" />
                    <span className="absolute left-4 top-4 font-mono text-sm text-white/90">
                      {person.number}
                    </span>
                    <span
                      className={`absolute bottom-4 left-4 flex h-10 w-10 items-center justify-center rounded-full font-display text-sm font-semibold ${person.avatar} ring-2 ring-white`}
                    >
                      {person.initial}
                    </span>
                  </div>
                  <div className="p-6">
                    <p className="text-sm text-[#667066]">{person.role}</p>
                    <h3 className={`font-display mt-1 text-xl font-semibold ${person.accent}`}>
                      {person.name}
                    </h3>
                    <p className="mt-4 text-xs font-medium uppercase tracking-wide text-[#667066]">
                      Evaluates
                    </p>
                    <ul className="mt-2 space-y-1">
                      {person.evaluates.map((item) => (
                        <li key={item} className="text-sm text-[#172018]">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section
        id="how-it-works"
        className="scroll-mt-24 border-t border-[#DCE4D8] bg-white py-20 sm:py-28"
      >
        <div className="mx-auto max-w-[1280px] px-6 sm:px-8 lg:px-10">
          <Reveal root={scrollRef} className="max-w-2xl">
            <p className="landing-eyebrow">How TriPanel works</p>
            <h2 className="landing-heading-lg mt-4 text-[#172018]">
              From question to clarity in three steps
            </h2>
          </Reveal>

          <div ref={steps.ref} className="relative mt-16">
            <div
              className={`landing-step-line absolute left-0 right-0 top-8 hidden h-px bg-[#72D13D]/40 md:block ${
                steps.isInView || reduced ? "is-visible" : ""
              }`}
              aria-hidden
            />
            <div className="grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-8">
              {STEPS.map((step, i) => (
                <Reveal
                  key={step.number}
                  root={scrollRef}
                  variant="landing-reveal-left"
                  delayMs={reduced ? 0 : i * 150}
                >
                  <div className="relative">
                    <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#EDF8E8] font-display text-2xl font-semibold text-[#48B536]">
                      {step.number}
                    </span>
                    <h3 className="font-display mt-6 text-xl font-semibold text-[#172018]">
                      {step.title}
                    </h3>
                    <p className="landing-body mt-3">{step.body}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* LIVE EXPERIENCE */}
      <section className="landing-gradient-section py-20 sm:py-28">
        <div className="mx-auto max-w-[1280px] px-6 sm:px-8 lg:px-10">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <Reveal root={scrollRef} variant="landing-reveal-left">
              <p className="landing-eyebrow">Live interview experience</p>
              <h2 className="landing-heading-lg mt-4 text-[#172018]">
                An interview that actually feels like one
              </h2>
              <p className="landing-body mt-4">
                Practice under real interview pressure — with live questions,
                speech input, webcam preview, and instant multi-rater feedback
                when you submit.
              </p>
              <ul className="mt-6 space-y-3 text-sm text-[#172018]">
                {[
                  "AI interviewer with track-specific questions",
                  "Live transcript and speech recognition",
                  "Timer and session history",
                  "Three independent scores on every answer",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#72D13D]" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/practice" className="landing-btn-primary mt-8">
                Open practice studio
                <span aria-hidden>→</span>
              </Link>
            </Reveal>
            <Reveal root={scrollRef} variant="landing-reveal-right">
              <InterviewShowcase />
            </Reveal>
          </div>
        </div>
      </section>

      {/* SCORING */}
      <section id="scoring" className="scroll-mt-24 bg-white py-20 sm:py-28">
        <div className="mx-auto max-w-[1280px] px-6 sm:px-8 lg:px-10">
          <Reveal root={scrollRef} className="mx-auto max-w-2xl text-center">
            <p className="landing-eyebrow">Multi-panel scoring</p>
            <h2 className="landing-heading-lg mt-4 text-[#172018]">
              One interview.
              <br />
              Three perspectives. Clearer feedback.
            </h2>
            <p className="landing-body mt-4">
              Green marks strength. Soft red highlights improvement areas.
              Consistency badges tell you when raters align — or when to dig
              deeper.
            </p>
          </Reveal>

          <div ref={scoring.ref} className="mt-14">
            <ScoreShowcase active={scoring.isInView} />
          </div>

          <Reveal root={scrollRef} className="mt-16" delayMs={200}>
            <div id="agreement" className="scroll-mt-24 landing-card overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-3">
                {[
                  {
                    title: "High agreement",
                    body: "Three signals align. Trust the composite score.",
                    dots: ["#72D13D", "#72D13D", "#72D13D"],
                    featured: true,
                  },
                  {
                    title: "Mixed signal",
                    body: "Two agree. One flags a specific weakness.",
                    dots: ["#72D13D", "#72D13D", "#B84A5A"],
                    featured: false,
                  },
                  {
                    title: "Low agreement",
                    body: "Perspectives diverge — investigate the gap.",
                    dots: ["#B84A5A", "#667066", "#B84A5A"],
                    featured: false,
                  },
                ].map((state, i) => (
                  <div
                    key={state.title}
                    className={`p-6 sm:p-8 ${
                      i < 2 ? "border-b border-[#DCE4D8] md:border-b-0 md:border-r" : ""
                    } ${state.featured ? "bg-[#F8FAF5]" : ""}`}
                  >
                    <div className="flex h-6 items-center gap-2">
                      {state.dots.map((color, di) => (
                        <span
                          key={di}
                          className="h-2.5 w-2.5 rounded-full"
                          style={{ background: color }}
                        />
                      ))}
                    </div>
                    <h3 className="font-display mt-4 text-lg font-semibold text-[#172018]">
                      {state.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-[#667066]">
                      {state.body}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* QUESTION BLUEPRINTS */}
      <section className="border-t border-[#DCE4D8] bg-[#F8FAF5] py-20 sm:py-28">
        <div className="mx-auto max-w-[1280px] px-6 sm:px-8 lg:px-10">
          <Reveal root={scrollRef} className="max-w-2xl">
            <p className="landing-eyebrow">Question blueprints</p>
            <h2 className="landing-heading-lg mt-4 text-[#172018]">
              Prepare for the questions that actually matter
            </h2>
          </Reveal>

          <div className="mt-12">
            <div
              role="tablist"
              className="landing-scroll-x flex gap-1 overflow-x-auto border-b border-[#DCE4D8] pb-px"
            >
              {BLUEPRINTS.map((item, index) => {
                const active = index === activeBlueprint;
                return (
                  <button
                    key={item.id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => {
                      setActiveBlueprint(index);
                      setBlueprintKey((k) => k + 1);
                    }}
                    className={`relative shrink-0 px-5 py-4 text-left transition-colors sm:px-6 ${
                      active ? "text-[#172018]" : "text-[#667066] hover:text-[#172018]"
                    }`}
                  >
                    <span className="text-sm font-medium">{item.label}</span>
                    <span
                      className={`landing-tab-indicator absolute inset-x-0 bottom-0 h-0.5 bg-[#72D13D] ${
                        active ? "is-active" : ""
                      }`}
                    />
                  </button>
                );
              })}
            </div>

            <div
              key={blueprintKey}
              className="grid grid-cols-1 gap-10 py-10 lg:grid-cols-12 lg:gap-14 lg:py-14"
            >
              <div className="lg:col-span-5">
                <h3 className="font-display text-2xl font-semibold text-[#172018]">
                  {blueprint.title}
                </h3>
                <p className="landing-body mt-3">{blueprint.description}</p>
                <dl className="mt-6 grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <dt className="text-[#667066]">Difficulty</dt>
                    <dd className="mt-0.5 font-medium text-[#172018]">
                      {blueprint.difficulty}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[#667066]">Duration</dt>
                    <dd className="mt-0.5 font-medium text-[#172018]">
                      {blueprint.duration}
                    </dd>
                  </div>
                </dl>
                <p className="mt-4 text-sm text-[#667066]">
                  Evaluates ·{" "}
                  <span className="text-[#172018]">
                    {blueprint.skills.join(" · ")}
                  </span>
                </p>
                <Link href="/practice" className="landing-btn-primary mt-8">
                  Practice now
                </Link>
              </div>
              <div className="lg:col-span-7">
                <p className="text-xs font-medium uppercase tracking-wide text-[#667066]">
                  Sample question
                </p>
                <blockquote className="font-display mt-3 text-2xl leading-snug tracking-tight text-[#172018] sm:text-[1.75rem]">
                  &ldquo;{blueprint.sample}&rdquo;
                </blockquote>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ROLE PREPARATION */}
      <section className="border-t border-[#DCE4D8] bg-white py-20 sm:py-28">
        <div className="mx-auto max-w-[1280px] px-6 sm:px-8 lg:px-10">
          <Reveal root={scrollRef} className="max-w-2xl">
            <p className="landing-eyebrow">Interview preparation</p>
            <h2 className="landing-heading-lg mt-4 text-[#172018]">
              Scenarios for the roles you&apos;re targeting
            </h2>
            <p className="landing-body mt-4">
              Choose a track aligned with your interview — from SDE technical
              rounds to GenAI and HR behavioral screens.
            </p>
          </Reveal>

          <div className="landing-scroll-x mt-10 flex gap-4 overflow-x-auto pb-2">
            {ROLES.map((role, i) => (
              <Link
                key={role.label}
                href="/practice"
                className="group min-w-[200px] shrink-0 rounded-2xl border border-[#DCE4D8] bg-[#F8FAF5] p-5 transition-all hover:-translate-y-1 hover:border-[#72D13D]/40 hover:shadow-md sm:min-w-[220px]"
              >
                <span className="font-mono text-xs text-[#667066]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="font-display mt-3 text-lg font-semibold text-[#172018] transition-colors group-hover:text-[#48B536]">
                  {role.label}
                </p>
                <p className="mt-1 text-sm text-[#667066]">{role.track}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* PROGRESS JOURNEY */}
      <section className="landing-gradient-section py-20 sm:py-28">
        <div className="mx-auto max-w-[1280px] px-6 sm:px-8 lg:px-10">
          <Reveal root={scrollRef} className="max-w-2xl">
            <p className="landing-eyebrow">Improve with every session</p>
            <h2 className="landing-heading-lg mt-4 text-[#172018]">
              First interview → feedback → real improvement
            </h2>
            <p className="landing-body mt-4">
              Track progress across sessions on your Progress page — see
              technical, communication, and structure scores improve over time.
            </p>
          </Reveal>

          <div ref={journey.ref} className="relative mt-14">
            <div
              className={`landing-step-line absolute left-0 right-0 top-5 hidden h-px bg-[#72D13D]/35 md:block ${
                journey.isInView || reduced ? "is-visible" : ""
              }`}
              aria-hidden
            />
            <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
              {JOURNEY.map((step, i) => (
                <Reveal
                  key={step.session}
                  root={scrollRef}
                  delayMs={reduced ? 0 : i * 140}
                  variant="landing-reveal-scale"
                >
                  <div className="landing-card p-6 sm:p-7">
                    <p className="font-mono text-xs text-[#667066]">
                      Session {step.session}
                    </p>
                    <h3 className="font-display mt-2 text-xl font-semibold text-[#172018]">
                      {step.label}
                    </h3>
                    <ul className="mt-5 space-y-2.5">
                      {Object.entries(step.scores).map(([key, value]) => {
                        const isWeak = step.session === "01" && key === "Structure";
                        return (
                          <li
                            key={key}
                            className="flex items-center justify-between text-sm"
                          >
                            <span className="text-[#667066]">{key}</span>
                            <span
                              className={`font-mono tabular-nums font-medium ${
                                isWeak ? "text-[#B84A5A]" : "text-[#48B536]"
                              }`}
                            >
                              {value}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </Reveal>
              ))}
            </div>
            <div className="mt-10 text-center">
              <Link href="/progress" className="landing-btn-secondary">
                View your progress chart
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CAPABILITIES (no fake testimonials) */}
      <section className="border-t border-[#DCE4D8] bg-white py-20 sm:py-28">
        <div className="mx-auto max-w-[1280px] px-6 sm:px-8 lg:px-10">
          <Reveal root={scrollRef} className="mx-auto max-w-2xl text-center">
            <p className="landing-eyebrow">Built for better preparation</p>
            <h2 className="landing-heading-lg mt-4 text-[#172018]">
              Everything you need for deliberate practice
            </h2>
          </Reveal>
          <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Adaptive difficulty",
                body: "Questions scale from beginner to advanced based on your session history.",
              },
              {
                title: "Job description tailoring",
                body: "Paste a JD to generate questions aligned with the role you're applying for.",
              },
              {
                title: "Consistency scoring",
                body: "See when your three raters agree — and when disagreement reveals a blind spot.",
              },
              {
                title: "Speech & text input",
                body: "Answer the way you would in a real interview — out loud or typed.",
              },
              {
                title: "Session history",
                body: "Review past questions, answers, and persona feedback anytime.",
              },
              {
                title: "Progress tracking",
                body: "Visualize score trends across technical, HR, and system design dimensions.",
              },
            ].map((item, i) => (
              <Reveal key={item.title} root={scrollRef} delayMs={i * 80}>
                <div className="landing-card h-full p-6">
                  <h3 className="font-display text-lg font-semibold text-[#172018]">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#667066]">
                    {item.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="landing-gradient-cta py-20 sm:py-28">
        <div className="mx-auto max-w-[720px] px-6 text-center sm:px-8">
          <Reveal root={scrollRef} variant="landing-reveal-scale">
            <h2 className="landing-heading-lg text-[#172018]">
              Your next interview
              <br />
              can feel different
            </h2>
            <p className="landing-body mx-auto mt-5 max-w-lg">
              Practice with realistic AI interviewers, understand your weak
              points, and walk into your next interview prepared.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link href="/practice" className="landing-btn-primary">
                Start practicing
                <span aria-hidden>→</span>
              </Link>
              <a href="#how-it-works" className="landing-btn-secondary">
                Explore how it works
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-[#DCE4D8] bg-white">
        <div className="mx-auto max-w-[1280px] px-6 py-14 sm:px-8 lg:px-10">
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
            <div className="lg:col-span-1">
              <div className="flex items-center gap-3">
                <span className="flex items-end gap-[3px]" aria-hidden>
                  <span className="h-2 w-[3px] rounded-full bg-[#667066]/50" />
                  <span className="h-3.5 w-[3px] rounded-full bg-[#72D13D]" />
                  <span className="h-2.5 w-[3px] rounded-full bg-[#667066]/70" />
                </span>
                <span className="font-display text-base font-semibold text-[#172018]">
                  TriPanel
                </span>
              </div>
              <p className="mt-4 max-w-xs text-sm leading-relaxed text-[#667066]">
                AI-powered mock interviews with three independent raters — so
                you get clearer, more honest feedback.
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[#667066]">
                Product
              </p>
              <nav className="mt-4 flex flex-col gap-3 text-sm">
                <a href="#interviewers" className="text-[#172018] hover:text-[#48B536]">
                  Interviewers
                </a>
                <a href="#scoring" className="text-[#172018] hover:text-[#48B536]">
                  Scoring
                </a>
                <Link href="/practice" className="text-[#172018] hover:text-[#48B536]">
                  Practice
                </Link>
              </nav>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[#667066]">
                Resources
              </p>
              <nav className="mt-4 flex flex-col gap-3 text-sm">
                <a href="#how-it-works" className="text-[#172018] hover:text-[#48B536]">
                  How it works
                </a>
                <a href="#scoring" className="text-[#172018] hover:text-[#48B536]">
                  Interview tips
                </a>
                <Link href="/progress" className="text-[#172018] hover:text-[#48B536]">
                  Progress
                </Link>
              </nav>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[#667066]">
                Account
              </p>
              <nav className="mt-4 flex flex-col gap-3 text-sm">
                <Link href="/settings" className="text-[#172018] hover:text-[#48B536]">
                  Sign in
                </Link>
                <Link href="/practice" className="text-[#172018] hover:text-[#48B536]">
                  Start practicing
                </Link>
                <Link href="/settings" className="text-[#172018] hover:text-[#48B536]">
                  Settings
                </Link>
              </nav>
            </div>
          </div>

          <p className="mt-12 border-t border-[#DCE4D8] pt-8 text-center text-xs text-[#667066] sm:text-left">
            © {new Date().getFullYear()} TriPanel. Three perspectives. One clearer signal.
          </p>
        </div>
      </footer>
    </div>
  );
}
