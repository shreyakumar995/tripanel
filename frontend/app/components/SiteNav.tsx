"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

function BrandMark() {
  return (
    <span className="flex items-end gap-[3px]" aria-hidden>
      <span className="h-2.5 w-[3px] rounded-full bg-ivory/40 transition-all duration-300 group-hover:h-3" />
      <span className="h-4 w-[3px] rounded-full bg-accent" />
      <span className="h-3 w-[3px] rounded-full bg-ivory/55 transition-all duration-300 group-hover:h-3.5" />
    </span>
  );
}

export default function SiteNav() {
  const pathname = usePathname();
  const onPractice = pathname?.startsWith("/practice");
  const onLanding = pathname === "/";

  return (
    <header
      className={`sticky top-0 z-50 border-b border-border-subtle/50 bg-background/70 backdrop-blur-xl ${
        onLanding ? "nav-enter" : ""
      }`}
    >
      <div className="mx-auto flex h-[4.5rem] max-w-[1480px] items-center justify-between px-6 sm:px-10 lg:px-16">
        <Link href="/" className="group flex items-center gap-3">
          <BrandMark />
          <span className="font-heading text-[1.0625rem] font-semibold tracking-[-0.02em] text-ivory">
            TriPanel
          </span>
        </Link>

        <nav className="hidden items-center gap-11 text-[0.9375rem] text-text-muted md:flex">
          <a
            href={onPractice ? "/#interviewers" : "#interviewers"}
            className="nav-link transition-colors duration-200 hover:text-ivory"
          >
            Interviewers
          </a>
          <a
            href={onPractice ? "/#scoring" : "#scoring"}
            className="nav-link transition-colors duration-200 hover:text-ivory"
          >
            Scoring
          </a>
          <Link
            href="/practice"
            className={`nav-link transition-colors duration-200 hover:text-ivory ${
              onPractice ? "text-ivory" : ""
            }`}
          >
            Practice
          </Link>
        </nav>

        {!onPractice ? (
          <Link
            href="/practice"
            className="btn-lime rounded-full px-5 py-2.5 text-sm font-semibold text-background transition-all duration-200 hover:-translate-y-px hover:shadow-[0_0_0_4px_rgba(199,244,58,0.14)]"
          >
            Start practicing
          </Link>
        ) : (
          <Link
            href="/"
            className="text-sm text-text-muted transition-colors duration-200 hover:text-ivory"
          >
            ← Home
          </Link>
        )}
      </div>
    </header>
  );
}
