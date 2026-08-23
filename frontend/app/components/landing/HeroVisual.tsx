"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { usePrefersReducedMotion } from "../../hooks/useMotion";

const WAVE_HEIGHTS = [36, 68, 52, 88, 42, 76, 58, 92, 48, 70, 62, 84];

export default function HeroVisual({ active }: { active: boolean }) {
  const [seconds, setSeconds] = useState(412);
  const reduced = usePrefersReducedMotion();
  const live = active || reduced;

  useEffect(() => {
    if (!live) return;
    const id = window.setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => window.clearInterval(id);
  }, [live]);

  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");

  return (
    <div className="landing-hero-visual relative mx-auto w-full max-w-[680px] lg:max-w-none">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-8 top-8 h-48 w-48 rounded-full bg-[#E1F3D6]/60 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-6 bottom-16 h-40 w-40 rounded-full bg-[#EDF8E8]/80 blur-3xl"
      />

      <div
        className="landing-float-item absolute -left-2 top-8 z-20 hidden w-[148px] sm:block lg:-left-10"
        style={{ animationDelay: "0.65s" }}
      >
        <div className="landing-float-card p-3">
          <p className="text-[10px] font-medium uppercase tracking-wide text-[#667066]">
            Panel
          </p>
          <div className="mt-2 flex -space-x-2">
            {[
              { initial: "R", bg: "bg-[#72D13D]/15 text-[#48B536]" },
              { initial: "P", bg: "bg-[#172018]/8 text-[#172018]" },
              { initial: "A", bg: "bg-[#667066]/15 text-[#667066]" },
            ].map((p) => (
              <span
                key={p.initial}
                className={`flex h-7 w-7 items-center justify-center rounded-full border-2 border-white text-xs font-semibold ${p.bg}`}
              >
                {p.initial}
              </span>
            ))}
          </div>
          <p className="mt-2 text-xs text-[#667066]">3 raters active</p>
        </div>
      </div>

      <div
        className="landing-float-item absolute -right-1 top-20 z-20 w-[132px] sm:-right-4 lg:-right-8"
        style={{ animationDelay: "0.85s" }}
      >
        <div className="landing-float-card p-3">
          <p className="text-[10px] font-medium uppercase tracking-wide text-[#667066]">
            Timer
          </p>
          <p className="mt-1 font-mono text-xl font-semibold tabular-nums text-[#172018]">
            {mm}:{ss}
          </p>
        </div>
      </div>

      <div
        className="landing-float-item absolute -right-2 bottom-28 z-20 hidden w-[156px] sm:block lg:-right-6"
        style={{ animationDelay: "1.05s" }}
      >
        <div className="landing-float-card p-3">
          <p className="text-[10px] font-medium uppercase tracking-wide text-[#667066]">
            Technical score
          </p>
          <p className="mt-1 text-2xl font-semibold text-[#48B536]">8.4</p>
        </div>
      </div>

      <div
        className="landing-float-item absolute -left-3 bottom-12 z-20 hidden w-[168px] sm:block lg:-left-8"
        style={{ animationDelay: "1.2s" }}
      >
        <div className="landing-float-card p-3">
          <p className="text-[10px] font-medium uppercase tracking-wide text-[#667066]">
            Live transcript
          </p>
          <p className="mt-1.5 text-xs leading-relaxed text-[#667066]">
            <span className="text-[#172018]">You — </span>
            I&apos;d start with Floyd&apos;s algorithm…
            {live && (
              <span className="ml-0.5 inline-block h-3 w-[2px] animate-pulse bg-[#72D13D]" />
            )}
          </p>
        </div>
      </div>

      <div className="landing-card relative overflow-hidden">
        <div className="flex items-center justify-between border-b border-[#DCE4D8] px-4 py-3 sm:px-5">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              {live && (
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#72D13D] opacity-30" />
              )}
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#72D13D]" />
            </span>
            <span className="text-sm text-[#667066]">Mock interview · SDE Technical</span>
          </div>
          <div className="flex items-center gap-1.5" aria-hidden>
            {WAVE_HEIGHTS.map((h, i) => (
              <span
                key={i}
                className={`w-[2px] rounded-full bg-[#72D13D]/70 ${live ? "landing-wave-bar" : ""}`}
                style={{ height: `${h * 0.22}px`, animationDelay: `${i * 0.06}s` }}
              />
            ))}
          </div>
        </div>

        <div className="relative aspect-[16/10] bg-[#F1F7ED]">
          <Image
            src="https://images.unsplash.com/photo-1573497019940-598903f87561?w=1200&q=80&auto=format&fit=crop"
            alt="Professional interviewer in a video call setting"
            fill
            className="object-cover object-top"
            sizes="(max-width: 768px) 100vw, 680px"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#172018]/25 via-transparent to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
            <div>
              <p className="text-sm font-medium text-white">Strict Technical Reviewer</p>
              <p className="text-xs text-white/80">Evaluating your approach</p>
            </div>
            <span className="rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wide text-[#48B536]">
              AI analysis
            </span>
          </div>
        </div>

        <div className="space-y-3 px-4 py-4 sm:px-5 sm:py-5">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-[#667066]">
              Current question
            </p>
            <p className="mt-1.5 text-sm leading-relaxed text-[#172018] sm:text-base">
              How would you detect a cycle in a linked list, and what tradeoffs
              does your approach involve?
            </p>
          </div>
          <div className="grid grid-cols-3 gap-2 border-t border-[#DCE4D8] pt-3">
            {[
              { label: "Confidence", value: "82%" },
              { label: "Clarity", value: "7.8" },
              { label: "Structure", value: "6.9" },
            ].map((metric) => (
              <div key={metric.label} className="rounded-lg bg-[#F8FAF5] px-2.5 py-2">
                <p className="text-[10px] text-[#667066]">{metric.label}</p>
                <p className="mt-0.5 text-sm font-semibold text-[#172018]">{metric.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
