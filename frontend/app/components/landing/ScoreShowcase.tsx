"use client";

import { useCountUp, usePrefersReducedMotion } from "../../hooks/useMotion";

const DIMENSIONS = [
  { label: "Technical Depth", value: 88, strong: true },
  { label: "Communication", value: 82, strong: true },
  { label: "Confidence", value: 76, strong: true },
  { label: "Answer Structure", value: 91, strong: true },
  { label: "Edge case awareness", value: 58, strong: false },
] as const;

type ScoreShowcaseProps = {
  active: boolean;
};

export default function ScoreShowcase({ active }: ScoreShowcaseProps) {
  const display = useCountUp(8.2, active, { duration: 1200, decimals: 1 });
  const reduced = usePrefersReducedMotion();
  const drawn = active || reduced;

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
      <div className="flex flex-col items-center lg:col-span-5 lg:items-start">
        <div className="relative flex h-56 w-56 items-center justify-center sm:h-64 sm:w-64">
          <svg viewBox="0 0 220 220" className="h-full w-full -rotate-90" aria-hidden>
            <circle
              cx="110"
              cy="110"
              r="100"
              fill="none"
              stroke="#DCE4D8"
              strokeWidth="10"
            />
            <circle
              cx="110"
              cy="110"
              r="100"
              fill="none"
              stroke="#72D13D"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={628}
              strokeDashoffset={drawn ? 628 - 628 * 0.82 : 628}
              className="transition-[stroke-dashoffset] duration-[1400ms] ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="font-display text-6xl font-semibold tracking-tight text-[#172018]">
              {display.toFixed(1)}
            </span>
            <span className="mt-1 text-sm text-[#667066]">Composite / 10</span>
          </div>
        </div>

        <div className="mt-8 w-full max-w-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-[#667066]">
            Panel consensus
          </p>
          <div className="mt-4 flex items-center justify-between gap-4">
            {[
              { initial: "R", color: "#72D13D" },
              { initial: "P", color: "#172018" },
              { initial: "A", color: "#667066" },
            ].map((p, i) => (
              <div key={p.initial} className="flex flex-col items-center gap-2">
                <span
                  className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold text-white"
                  style={{ background: p.color }}
                >
                  {p.initial}
                </span>
                {i < 2 && (
                  <span
                    className="hidden h-px w-8 bg-[#DCE4D8] sm:block"
                    aria-hidden
                  />
                )}
              </div>
            ))}
            <span className="text-[#667066]" aria-hidden>
              →
            </span>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E1F3D6] font-display text-lg font-semibold text-[#48B536]">
              8.2
            </div>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-[#667066]">
            Three independent scores converge into one composite — with a
            consistency badge when raters disagree.
          </p>
        </div>
      </div>

      <div className="space-y-5 lg:col-span-7">
        {DIMENSIONS.map((dim, i) => (
          <div key={dim.label}>
            <div className="mb-2 flex items-baseline justify-between gap-3">
              <span className="text-sm text-[#172018]">{dim.label}</span>
              <span
                className={`font-mono text-sm tabular-nums ${
                  dim.strong ? "text-[#667066]" : "text-[#B84A5A]"
                }`}
              >
                {dim.value}%
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-[#F1F7ED]">
              <div
                className={`landing-metric-bar h-full rounded-full ${
                  dim.strong ? "bg-[#72D13D]" : "bg-[#B84A5A]/70"
                } ${active || reduced ? "is-visible" : ""}`}
                style={{
                  width: `${dim.value}%`,
                  transitionDelay: `${i * 120}ms`,
                }}
              />
            </div>
          </div>
        ))}

        <div className="mt-6 flex flex-wrap gap-2">
          <span className="inline-flex rounded-full bg-[#E1F3D6] px-3 py-1.5 text-xs font-medium text-[#48B536]">
            High Agreement
          </span>
          <span className="inline-flex rounded-full bg-[#F1F7ED] px-3 py-1.5 text-xs font-medium text-[#667066]">
            Mixed Signal
          </span>
          <span className="inline-flex rounded-full bg-[#FCE8EB] px-3 py-1.5 text-xs font-medium text-[#B84A5A]">
            Low Agreement — Investigate
          </span>
        </div>
      </div>
    </div>
  );
}
