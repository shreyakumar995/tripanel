"use client";

import {
  type RefObject,
  useEffect,
  useRef,
  useState,
} from "react";

export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return reduced;
}

export function useInView<T extends HTMLElement = HTMLDivElement>(
  options?: {
    root?: RefObject<Element | null>;
    rootMargin?: string;
    threshold?: number | number[];
    once?: boolean;
  },
) {
  const ref = useRef<T | null>(null);
  const [isInView, setIsInView] = useState(false);
  const once = options?.once ?? true;

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          if (once) observer.unobserve(node);
        } else if (!once) {
          setIsInView(false);
        }
      },
      {
        root: options?.root?.current ?? null,
        rootMargin: options?.rootMargin ?? "0px 0px -12% 0px",
        threshold: options?.threshold ?? 0.18,
      },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [options?.root, options?.rootMargin, options?.threshold, once]);

  return { ref, isInView };
}

export function useCountUp(
  target: number,
  active: boolean,
  options?: { duration?: number; decimals?: number },
) {
  const [value, setValue] = useState(0);
  const duration = options?.duration ?? 1100;
  const decimals = options?.decimals ?? 1;
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (!active) return;
    if (reduced) {
      setValue(target);
      return;
    }

    let frame = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Number((target * eased).toFixed(decimals)));
      if (t < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [active, target, duration, decimals, reduced]);

  return value;
}
