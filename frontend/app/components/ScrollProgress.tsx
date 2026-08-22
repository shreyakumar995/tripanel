"use client";

import { useEffect, useState, type RefObject } from "react";
import { usePrefersReducedMotion } from "../hooks/useMotion";

type ScrollProgressProps = {
  scrollRef: RefObject<HTMLElement | null>;
};

export default function ScrollProgress({ scrollRef }: ScrollProgressProps) {
  const [progress, setProgress] = useState(0);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const el = scrollRef.current;
    if (!el) return;

    const onScroll = () => {
      const max = el.scrollHeight - el.clientHeight;
      setProgress(max > 0 ? el.scrollTop / max : 0);
    };

    onScroll();
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [scrollRef, reduced]);

  if (reduced) return null;

  return (
    <div
      className="pointer-events-none absolute inset-x-0 top-0 z-[60] h-[2px] bg-transparent"
      aria-hidden
    >
      <div
        className="h-full origin-left bg-accent/80 transition-[width] duration-100 ease-out"
        style={{ width: `${progress * 100}%` }}
      />
    </div>
  );
}
