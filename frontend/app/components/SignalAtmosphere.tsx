"use client";

import { usePrefersReducedMotion } from "../hooks/useMotion";

/** Extremely faint tri-signal motif for atmospheric backgrounds. */
export default function SignalAtmosphere({
  className = "",
}: {
  className?: string;
}) {
  const reduced = usePrefersReducedMotion();

  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      <svg
        className="absolute inset-0 h-full w-full opacity-[0.14]"
        viewBox="0 0 1200 800"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
      >
        <path
          className={reduced ? undefined : "signal-path"}
          d="M80 220 C 280 180, 420 320, 600 300 S 920 180, 1120 240"
          stroke="#C7F43A"
          strokeWidth="1"
          opacity="0.35"
        />
        <path
          className={reduced ? undefined : "signal-path"}
          style={{ animationDelay: "-6s" }}
          d="M60 420 C 260 460, 400 380, 600 400 S 900 480, 1140 420"
          stroke="#E8E6E1"
          strokeWidth="1"
          opacity="0.22"
        />
        <path
          className={reduced ? undefined : "signal-path"}
          style={{ animationDelay: "-11s" }}
          d="M100 580 C 300 540, 450 620, 600 600 S 880 520, 1100 560"
          stroke="#B84A5A"
          strokeWidth="1"
          opacity="0.2"
        />
        <circle
          className={reduced ? undefined : "signal-node"}
          cx="600"
          cy="400"
          r="3"
          fill="#C7F43A"
          opacity="0.5"
        />
      </svg>
    </div>
  );
}
