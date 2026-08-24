"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";

function BrandMark() {
  return (
    <span className="flex items-end gap-[3px]" aria-hidden>
      <span className="h-2.5 w-[3px] rounded-full bg-[#667066]/50 transition-all duration-300 group-hover:h-3" />
      <span className="h-4 w-[3px] rounded-full bg-[#72D13D]" />
      <span className="h-3 w-[3px] rounded-full bg-[#667066]/70 transition-all duration-300 group-hover:h-3.5" />
    </span>
  );
}

function NavLink({
  href,
  children,
  active = false,
}: {
  href: string;
  children: ReactNode;
  active?: boolean;
}) {
  const isExternal = href.startsWith("#") || href.startsWith("/#");

  const className = `landing-nav-link ${active ? "!text-[#172018] font-medium" : ""}`;

  if (isExternal) {
    return (
      <a href={href} className={className}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

export default function SiteNav() {
  const pathname = usePathname();
  const onPractice = pathname?.startsWith("/practice");
  const onProgress = pathname?.startsWith("/progress");
  const onSettings = pathname?.startsWith("/settings");
  const onLanding = pathname === "/";
  const onAppPage = onPractice || onProgress || onSettings;
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-[#DCE4D8] bg-white/90 shadow-[0_1px_8px_rgba(23,32,24,0.04)] backdrop-blur-md"
          : "border-b border-transparent bg-[#F8FAF5]/85 backdrop-blur-sm"
      }`}
    >
      <div className="mx-auto flex h-[4.25rem] max-w-[1280px] items-center justify-between gap-6 px-6 sm:px-8 lg:px-10">
        <Link href="/" className="group flex items-center gap-3">
          <BrandMark />
          <span className="font-display text-[1.0625rem] font-semibold tracking-[-0.02em] text-[#172018]">
            TriPanel
          </span>
        </Link>

        <nav className="hidden items-center gap-9 text-[0.9375rem] md:flex">
          {onLanding ? (
            <>
              <NavLink href="#interviewers">Interviewers</NavLink>
              <NavLink href="#how-it-works">How it works</NavLink>
              <NavLink href="#scoring">Scoring</NavLink>
              <NavLink href="/practice">Practice</NavLink>
            </>
          ) : (
            <>
              <NavLink href="/#interviewers">Interviewers</NavLink>
              <NavLink href="/#scoring">Scoring</NavLink>
              <NavLink href="/practice" active={onPractice}>
                Practice
              </NavLink>
              <NavLink href="/progress" active={onProgress}>
                Progress
              </NavLink>
              <NavLink href="/settings" active={onSettings}>
                Settings
              </NavLink>
            </>
          )}
        </nav>

        <div className="flex items-center gap-3 sm:gap-4">
          {onLanding ? (
            <Link href="/practice" className="landing-btn-primary text-sm">
              Start practicing
            </Link>
          ) : (
            <Link
              href="/"
              className="text-sm text-[#667066] transition-colors hover:text-[#172018]"
            >
              ← Home
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
