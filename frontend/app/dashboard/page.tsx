"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { trackFromKey } from "../components/practice/constants";

type StreakData = {
  current_streak: number;
  total_sessions: number;
};

type SessionResult = {
  persona: string;
  score: number;
  reasoning: string;
};

type SessionSummary = {
  id: number;
  track: string;
  question: string;
  answer: string;
  created_at: string;
  results: SessionResult[];
};

function formatSessionDate(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function averageScore(results: SessionResult[]) {
  if (!results.length) return null;
  const total = results.reduce((sum, result) => sum + result.score, 0);
  return total / results.length;
}

function previewQuestion(question: string, max = 100) {
  const trimmed = question.trim();
  if (trimmed.length <= max) return trimmed;
  return `${trimmed.slice(0, max).trimEnd()}…`;
}

export default function DashboardPage() {
  const [streak, setStreak] = useState<StreakData | null>(null);
  const [sessions, setSessions] = useState<SessionSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDashboard() {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const [streakRes, sessionsRes] = await Promise.all([
          fetch(`${apiUrl}/streak`),
          fetch(`${apiUrl}/sessions`),
        ]);

        if (!streakRes.ok || !sessionsRes.ok) {
          throw new Error("Failed to load dashboard.");
        }

        const streakPayload = (await streakRes.json()) as StreakData;
        const sessionsPayload = (await sessionsRes.json()) as SessionSummary[];

        setStreak(streakPayload);
        setSessions(Array.isArray(sessionsPayload) ? sessionsPayload : []);
      } catch {
        setError("Could not load dashboard. Check that the backend is running.");
      } finally {
        setIsLoading(false);
      }
    }

    void loadDashboard();
  }, []);

  const recentSessions = sessions.slice(0, 3);

  return (
    <div className="app-shell flex-1 overflow-y-auto bg-[#12141C] text-[#EDEDF2]">
      <div className="mx-auto w-full max-w-5xl px-6 py-10 sm:px-8 lg:px-10">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-semibold tracking-tight text-[#EDEDF2] sm:text-4xl">
              Dashboard
            </h1>
            <p className="mt-2 text-base text-zinc-400">
              Your streak and recent practice at a glance.
            </p>
          </div>
          <Link
            href="/practice"
            className="inline-flex items-center justify-center rounded-lg bg-[#72D13D] px-5 py-2.5 text-sm font-semibold text-[#12141C] transition-opacity hover:opacity-90"
          >
            Start Practicing
          </Link>
        </div>

        {isLoading && (
          <p className="mt-10 flex items-center gap-2 text-sm text-zinc-400">
            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-zinc-600 border-t-[#72D13D]" />
            Loading dashboard...
          </p>
        )}

        {error && !isLoading && (
          <p className="mt-10 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </p>
        )}

        {!isLoading && !error && streak && (
          <>
            <div className="mt-8 rounded-xl border border-white/5 bg-[#1B1E29] p-8 sm:p-10">
              {streak.current_streak === 0 ? (
                <div>
                  <p className="text-lg leading-relaxed text-[#EDEDF2]">
                    🔥 Start your streak today — complete a practice session!
                  </p>
                  <p className="mt-4 text-sm text-zinc-400">
                    {streak.total_sessions} practice session
                    {streak.total_sessions === 1 ? "" : "s"} completed
                  </p>
                </div>
              ) : (
                <div>
                  <div className="flex items-end gap-3">
                    <span className="font-display text-6xl font-semibold tracking-tight text-[#EDEDF2] sm:text-7xl">
                      {streak.current_streak}
                    </span>
                    <span className="mb-2 text-3xl" aria-hidden>
                      🔥
                    </span>
                  </div>
                  <p className="mt-2 text-lg font-medium text-zinc-300">
                    Day Streak
                  </p>
                  <p className="mt-4 text-sm text-zinc-400">
                    {streak.total_sessions} practice session
                    {streak.total_sessions === 1 ? "" : "s"} completed
                  </p>
                </div>
              )}
            </div>

            <section className="mt-10">
              <h2 className="font-display text-xl font-semibold tracking-tight text-[#EDEDF2]">
                Recent sessions
              </h2>

              {recentSessions.length === 0 ? (
                <div className="mt-4 rounded-xl border border-white/5 bg-[#1B1E29] p-6 text-sm text-zinc-400">
                  No sessions yet. Start practicing to see them here.
                </div>
              ) : (
                <ul className="mt-4 space-y-3">
                  {recentSessions.map((session) => {
                    const avg = averageScore(session.results);
                    return (
                      <li key={session.id}>
                        <Link
                          href={`/report/${session.id}`}
                          className="block rounded-xl border border-white/5 bg-[#1B1E29] p-5 transition-colors hover:border-white/10 hover:bg-[#222633]"
                        >
                          <div className="flex flex-wrap items-start justify-between gap-3">
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-medium text-[#72D13D]">
                                {trackFromKey(session.track)}
                              </p>
                              <p className="mt-1 text-base text-[#EDEDF2]">
                                {previewQuestion(session.question)}
                              </p>
                              <p className="mt-2 text-sm text-zinc-500">
                                {formatSessionDate(session.created_at)}
                              </p>
                            </div>
                            <div className="shrink-0 text-right">
                              <p className="font-display text-2xl font-semibold text-[#EDEDF2]">
                                {avg !== null ? avg.toFixed(1) : "—"}
                              </p>
                              <p className="text-xs text-zinc-500">avg score</p>
                            </div>
                          </div>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </section>
          </>
        )}
      </div>
    </div>
  );
}
