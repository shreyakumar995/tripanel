"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "tripanel_onboarding_seen";

const PERSONAS = [
  {
    name: "Strict Technical",
    initial: "R",
    description:
      "Grades correctness, edge cases, and complexity — no fluff, no hand-holding.",
    avatarClass: "bg-accent/15 text-accent",
  },
  {
    name: "Friendly HR",
    initial: "P",
    description:
      "Focuses on clarity, structure, and how confidently you communicate your thinking.",
    avatarClass: "bg-ivory/10 text-ivory",
  },
  {
    name: "System Design Skeptic",
    initial: "A",
    description:
      "Probes assumptions, scale, failure modes, and tradeoffs — always asks \"at scale?\"",
    avatarClass: "bg-text-muted/15 text-text-muted",
  },
] as const;

const STEPS = [
  {
    title: "Welcome to TriPanel",
    body: "Practice mock interviews with three independent AI interviewers. Submit one answer — each rater scores it from their own angle, so you get a fuller picture than a single judge.",
  },
  {
    title: "Meet your panel",
    body: null,
  },
  {
    title: "Watch for disagreement",
    body: "After each answer, TriPanel shows a consistency badge. When raters disagree, that's useful signal — it often means one dimension of your answer is strong while another needs work.",
  },
  {
    title: "You're ready",
    body: "Generate a question, answer out loud or in text, and review your panel scores. Your session history is saved so you can track improvement over time.",
  },
] as const;

function markOnboardingSeen() {
  window.localStorage.setItem(STORAGE_KEY, "true");
}

export default function OnboardingTour() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const seen = window.localStorage.getItem(STORAGE_KEY) === "true";
    if (!seen) {
      setIsOpen(true);
    }
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  function closeTour() {
    markOnboardingSeen();
    setIsOpen(false);
  }

  function goNext() {
    if (step >= STEPS.length - 1) {
      closeTour();
      return;
    }
    setStep((current) => current + 1);
  }

  function goBack() {
    setStep((current) => Math.max(0, current - 1));
  }

  if (!isOpen) {
    return null;
  }

  const current = STEPS[step];
  const isLastStep = step === STEPS.length - 1;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="onboarding-title"
    >
      <button
        type="button"
        aria-label="Close onboarding"
        className="absolute inset-0 bg-[#0b0d0e]/75 backdrop-blur-[2px]"
        onClick={closeTour}
      />

      <div
        className="relative w-full max-w-lg rounded-xl border border-[#2a3038] p-6 shadow-2xl sm:p-8"
        style={{ background: "#1B1E29", color: "#EDEDF2" }}
      >
        <div className="flex items-start justify-between gap-4">
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#92969b]">
            Step {step + 1} of {STEPS.length}
          </p>
          <button
            type="button"
            onClick={closeTour}
            className="shrink-0 text-sm text-[#92969b] transition-colors hover:text-[#EDEDF2]"
          >
            Skip
          </button>
        </div>

        <div className="mt-4 flex gap-1.5">
          {STEPS.map((_, index) => (
            <span
              key={index}
              className={`h-1 flex-1 rounded-full transition-colors ${
                index <= step ? "bg-accent" : "bg-[#2a3038]"
              }`}
            />
          ))}
        </div>

        <h2
          id="onboarding-title"
          className="font-heading mt-6 text-2xl font-semibold tracking-tight"
        >
          {current.title}
        </h2>

        {current.body && (
          <p className="mt-3 text-sm leading-relaxed text-[#92969b] sm:text-base">
            {current.body}
          </p>
        )}

        {step === 1 && (
          <ul className="mt-5 space-y-4">
            {PERSONAS.map((persona) => (
              <li key={persona.name} className="flex gap-3">
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-heading text-sm font-semibold ${persona.avatarClass}`}
                >
                  {persona.initial}
                </span>
                <div>
                  <p className="font-heading text-sm font-semibold text-[#EDEDF2]">
                    {persona.name}
                  </p>
                  <p className="mt-0.5 text-sm leading-relaxed text-[#92969b]">
                    {persona.description}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}

        {step === 2 && (
          <div className="mt-5 space-y-3">
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex rounded-full bg-accent/12 px-3 py-1.5 text-xs font-medium text-accent">
                High Agreement
              </span>
              <span className="inline-flex rounded-full bg-ivory/8 px-3 py-1.5 text-xs font-medium text-ivory">
                Mixed Signal
              </span>
              <span className="inline-flex rounded-full bg-oxblood/20 px-3 py-1.5 text-xs font-medium text-oxblood-muted">
                Low Agreement — Investigate
              </span>
            </div>
            <p className="text-sm leading-relaxed text-[#92969b]">
              A wide spread between scores means your answer landed differently
              with each interviewer — worth digging into before your real interview.
            </p>
          </div>
        )}

        <div className="mt-8 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={goBack}
            disabled={step === 0}
            className="rounded-md px-4 py-2 text-sm font-medium text-[#92969b] transition-colors hover:text-[#EDEDF2] disabled:invisible"
          >
            Back
          </button>

          {isLastStep ? (
            <button
              type="button"
              onClick={closeTour}
              className="btn-lime rounded-md px-5 py-2 text-sm font-semibold text-background transition-all hover:-translate-y-px"
            >
              Start Practicing
            </button>
          ) : (
            <button
              type="button"
              onClick={goNext}
              className="btn-lime rounded-md px-5 py-2 text-sm font-semibold text-background transition-all hover:-translate-y-px"
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
