"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { usePrefersReducedMotion } from "../../hooks/useMotion";

const WAVE = [40, 72, 56, 90, 48, 80, 62, 88, 44, 76];

export default function InterviewShowcase() {
  const [live, setLive] = useState(false);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const t = window.setTimeout(() => setLive(true), reduced ? 0 : 400);
    return () => window.clearTimeout(t);
  }, [reduced]);

  const active = live || reduced;

  return (
    <div className="landing-card overflow-hidden shadow-[0_24px_64px_rgba(23,32,24,0.08)]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#DCE4D8] bg-white px-5 py-3.5">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-2 w-2">
            {active && (
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#72D13D] opacity-25" />
            )}
            <span className="relative h-2 w-2 rounded-full bg-[#72D13D]" />
          </span>
          <span className="text-sm text-[#667066]">Practice studio · Live session</span>
        </div>
        <span className="font-mono text-sm tabular-nums text-[#172018]">12:04</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12">
        <div className="relative lg:col-span-7">
          <div className="relative aspect-[16/11] bg-[#F1F7ED]">
            <Image
              src="/images/interviewers/showcase.jpg"
              alt="Candidate participating in a professional video interview"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 60vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#172018]/20 to-transparent" />
            <div className="absolute bottom-4 left-4 flex items-end gap-1.5" aria-hidden>
              {WAVE.map((h, i) => (
                <span
                  key={i}
                  className={`w-[2.5px] rounded-full bg-white/90 ${active ? "landing-wave-bar" : ""}`}
                  style={{ height: `${h * 0.24}px`, animationDelay: `${i * 0.05}s` }}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col border-t border-[#DCE4D8] lg:col-span-5 lg:border-l lg:border-t-0">
          <div className="relative flex flex-1 items-center justify-center bg-[#F8FAF5] px-6 py-10">
            <div className="relative h-20 w-20 overflow-hidden rounded-full ring-2 ring-white shadow-md">
              <Image
                src="/images/interviewers/you.jpg"
                alt="Your camera feed"
                fill
                className="object-cover"
                sizes="80px"
              />
            </div>
            <span className="absolute left-4 top-4 text-xs text-[#667066]">You · mic on</span>
          </div>

          <div className="grid grid-cols-2 border-t border-[#DCE4D8]">
            {[
              { label: "Technical", value: "8.1", strong: true },
              { label: "Communication", value: "7.6", strong: true },
              { label: "Confidence", value: "7.9", strong: true },
              { label: "Structure", value: "6.4", strong: false },
            ].map((item, i) => (
              <div
                key={item.label}
                className={`px-4 py-3.5 ${i % 2 === 0 ? "border-r border-[#DCE4D8]" : ""} ${i >= 2 ? "border-t border-[#DCE4D8]" : ""}`}
              >
                <p className="text-xs text-[#667066]">{item.label}</p>
                <p
                  className={`mt-0.5 font-mono text-xl font-semibold tabular-nums ${
                    item.strong ? "text-[#48B536]" : "text-[#B84A5A]"
                  }`}
                >
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-4 border-t border-[#DCE4D8] bg-white px-5 py-5">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-[#667066]">
            Current question
          </p>
          <p className="mt-2 text-base leading-relaxed text-[#172018]">
            Walk through how you would design a rate limiter for an API — what
            assumptions would you state first?
          </p>
        </div>
        <div className="rounded-lg border-l-[3px] border-[#72D13D] bg-[#F8FAF5] px-4 py-3">
          <p className="text-xs font-medium uppercase tracking-wide text-[#667066]">
            Your response
          </p>
          <p className="mt-1.5 text-sm leading-relaxed text-[#667066]">
            <span className="text-[#172018]">You — </span>
            I&apos;d clarify whether we need a distributed limiter or single-node…
            {active && (
              <span className="ml-1 inline-block h-3.5 w-[2px] animate-pulse bg-[#72D13D] align-middle" />
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
