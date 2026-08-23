"use client";



import Link from "next/link";

import { usePathname } from "next/navigation";

import { useEffect, useState } from "react";



function BrandMark({ light = false }: { light?: boolean }) {

  return (

    <span className="flex items-end gap-[3px]" aria-hidden>

      <span

        className={`h-2.5 w-[3px] rounded-full transition-all duration-300 group-hover:h-3 ${

          light ? "bg-[#667066]/50" : "bg-ivory/40"

        }`}

      />

      <span

        className={`h-4 w-[3px] rounded-full ${

          light ? "bg-[#72D13D]" : "bg-accent"

        }`}

      />

      <span

        className={`h-3 w-[3px] rounded-full transition-all duration-300 group-hover:h-3.5 ${

          light ? "bg-[#667066]/70" : "bg-ivory/55"

        }`}

      />

    </span>

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

    if (!onLanding) return;



    const onScroll = () => setScrolled(window.scrollY > 12);

    onScroll();

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);

  }, [onLanding]);



  if (onLanding) {

    return (

      <header

        className={`sticky top-0 z-50 transition-all duration-300 ${

          scrolled

            ? "border-b border-[#DCE4D8] bg-white/90 shadow-[0_1px_8px_rgba(23,32,24,0.04)] backdrop-blur-md"

            : "border-b border-transparent bg-[#F8FAF5]/80 backdrop-blur-sm"

        }`}

      >

        <div className="mx-auto flex h-[4.25rem] max-w-[1280px] items-center justify-between gap-6 px-6 sm:px-8 lg:px-10">

          <Link href="/" className="group flex items-center gap-3">

            <BrandMark light />

            <span className="font-display text-[1.0625rem] font-semibold tracking-[-0.02em] text-[#172018]">

              TriPanel

            </span>

          </Link>



          <nav className="hidden items-center gap-9 text-[0.9375rem] md:flex">

            <a href="#interviewers" className="landing-nav-link">

              Interviewers

            </a>

            <a href="#how-it-works" className="landing-nav-link">

              How it works

            </a>

            <a href="#scoring" className="landing-nav-link">

              Scoring

            </a>

            <Link href="/practice" className="landing-nav-link">

              Practice

            </Link>

          </nav>



          <div className="flex items-center gap-3 sm:gap-4">

            

            <Link href="/practice" className="landing-btn-primary text-sm">

              Start practicing

            </Link>

          </div>

        </div>

      </header>

    );

  }



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

            href={onAppPage ? "/#interviewers" : "#interviewers"}

            className="nav-link transition-colors duration-200 hover:text-ivory"

          >

            Interviewers

          </a>

          <a

            href={onAppPage ? "/#scoring" : "#scoring"}

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

          <Link

            href="/progress"

            className={`nav-link transition-colors duration-200 hover:text-ivory ${

              onProgress ? "text-ivory" : ""

            }`}

          >

            Progress

          </Link>

          <Link

            href="/settings"

            className={`nav-link transition-colors duration-200 hover:text-ivory ${

              onSettings ? "text-ivory" : ""

            }`}

          >

            Settings

          </Link>

        </nav>



        {!onAppPage ? (

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

