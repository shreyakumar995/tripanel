"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SiteNav() {
  const pathname = usePathname();
  const onPractice = pathname?.startsWith("/practice");

  return (
    <header className="sticky top-0 z-50 border-b border-border-subtle/60 bg-background/75 backdrop-blur-xl">
      <div className="mx-auto flex h-[4.25rem] max-w-[1440px] items-center justify-between px-6 sm:px-10 lg:px-14">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="h-2 w-2 rounded-full bg-accent" aria-hidden />
          <span className="font-heading text-[1.05rem] font-semibold tracking-[-0.02em] text-ivory">
            TriPanel
          </span>
        </Link>

        <nav className="hidden items-center gap-10 text-[0.9375rem] text-text-muted md:flex">
          <a
            href={onPractice ? "/#interviewers" : "#interviewers"}
            className="transition-colors duration-200 hover:text-ivory"
          >
            Interviewers
          </a>
          <a
            href={onPractice ? "/#scoring" : "#scoring"}
            className="transition-colors duration-200 hover:text-ivory"
          >
            Scoring
          </a>
          <Link
            href="/practice"
            className={`transition-colors duration-200 hover:text-ivory ${
              onPractice ? "text-ivory" : ""
            }`}
          >
            Practice
          </Link>
        </nav>

        {!onPractice ? (
          <Link
            href="/practice"
            className="rounded-full bg-accent px-5 py-2 text-sm font-semibold text-background transition-all duration-200 hover:bg-accent-dim hover:shadow-[0_0_0_4px_rgba(200,245,66,0.12)]"
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
