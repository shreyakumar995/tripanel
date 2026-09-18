"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import ConsistencyBadge from "../../components/ConsistencyBadge";
import { trackFromKey } from "../../components/practice/constants";
import ScorePanel, { type ScoreResult } from "../../components/ScorePanel";

type SessionResult = {
  persona: string;
  score: number;
  reasoning: string;
};

type SessionDetail = {
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
  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function averageScore(results: SessionResult[]) {
  if (!results.length) return null;
  const total = results.reduce((sum, result) => sum + result.score, 0);
  return total / results.length;
}

export default function ReportPage() {
  const params = useParams<{ sessionId: string }>();
  const sessionId = params?.sessionId;

  const [session, setSession] = useState<SessionDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [idealAnswer, setIdealAnswer] = useState("");
  const [isIdealLoading, setIsIdealLoading] = useState(false);
  const [idealError, setIdealError] = useState("");

  useEffect(() => {
    if (!sessionId) return;

    async function loadSession() {
      setIsLoading(true);
      setError("");
      setIdealAnswer("");
      setIdealError("");

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/sessions`,
        );
        if (!response.ok) {
          throw new Error("Failed to load sessions.");
        }

        const payload = (await response.json()) as SessionDetail[];
        const found = (Array.isArray(payload) ? payload : []).find(
          (item) => String(item.id) === String(sessionId),
        );

        if (!found) {
          setError("Session not found.");
          setSession(null);
          return;
        }

        setSession(found);

        setIsIdealLoading(true);
        try {
          const idealResponse = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/ideal-answer`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ question: found.question }),
            },
          );

          if (!idealResponse.ok) {
            throw new Error("The ideal-answer request failed.");
          }

          const idealPayload = (await idealResponse.json()) as {
            ideal_answer?: string;
          };
          const text = idealPayload.ideal_answer?.trim() ?? "";
          if (!text) {
            throw new Error("No ideal answer was returned.");
          }
          setIdealAnswer(text);
        } catch {
          setIdealError(
            "Could not generate a model answer. Check that the backend is running.",
          );
        } finally {
          setIsIdealLoading(false);
        }
      } catch {
        setError("Could not load this session. Check that the backend is running.");
        setSession(null);
      } finally {
        setIsLoading(false);
      }
    }

    void loadSession();
  }, [sessionId]);

  const scoreResults: ScoreResult[] = useMemo(
    () =>
      (session?.results ?? []).map((result) => ({
        persona: result.persona,
        score: result.score,
        reasoning: result.reasoning,
        weaknesses: [],
      })),
    [session],
  );

  const scores = useMemo(
    () => scoreResults.map((r) => r.score).filter((s): s is number => typeof s === "number"),
    [scoreResults],
  );

  const avg = session ? averageScore(session.results) : null;

  return (
    <div className="app-shell flex-1 overflow-y-auto bg-[#12141C] text-[#EDEDF2]">
      <div className="mx-auto w-full max-w-5xl px-6 py-10 sm:px-8 lg:px-10">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-semibold tracking-tight text-[#EDEDF2] sm:text-4xl">
              Session Report
            </h1>
            <p className="mt-2 text-base text-zinc-400">
              {session
                ? `${trackFromKey(session.track)} · ${formatSessionDate(session.created_at)}`
                : `Report for session: ${sessionId ?? "—"}`}
            </p>
          </div>
          <Link
            href="/dashboard"
            className="text-sm text-zinc-400 transition-colors hover:text-[#EDEDF2]"
          >
            ← Dashboard
          </Link>
        </div>

        {isLoading && (
          <p className="mt-10 flex items-center gap-2 text-sm text-zinc-400">
            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-zinc-600 border-t-[#72D13D]" />
            Loading session...
          </p>
        )}

        {error && !isLoading && (
          <p className="mt-10 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </p>
        )}

        {!isLoading && !error && session && (
          <div className="mt-8 space-y-6">
            <section className="rounded-xl border border-white/5 bg-[#1B1E29] p-6 sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">
                Question
              </p>
              <p className="mt-3 text-base leading-relaxed text-[#EDEDF2] sm:text-lg">
                {session.question}
              </p>
            </section>

            <section className="rounded-xl border border-white/5 bg-[#1B1E29] p-6 sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">
                Your answer
              </p>
              <p className="mt-3 whitespace-pre-wrap text-base leading-relaxed text-zinc-300">
                {session.answer}
              </p>
            </section>

            <section className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="font-display text-xl font-semibold tracking-tight text-[#EDEDF2]">
                  Panel scores
                </h2>
                <div className="flex flex-wrap items-center gap-3">
                  {scores.length > 0 && <ConsistencyBadge scores={scores} />}
                  {avg !== null && (
                    <p className="text-sm text-zinc-400">
                      Avg{" "}
                      <span className="font-mono text-[#EDEDF2]">
                        {avg.toFixed(1)}
                      </span>
                      /10
                    </p>
                  )}
                </div>
              </div>
              <ScorePanel results={scoreResults} />
            </section>

            <section
              className="rounded-xl border-2 border-[#3B82F6]/40 bg-[#1B1E29] p-6 sm:p-8"
              aria-label="Model answer"
            >
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#60A5FA]">
                  Model Answer
                </p>
                <span className="rounded-full border border-[#3B82F6]/35 bg-[#3B82F6]/10 px-2.5 py-0.5 text-[11px] font-medium text-[#93C5FD]">
                  Suggested strong answer
                </span>
              </div>
              <p className="mt-1 text-sm text-zinc-500">
                Not what you said — an example of a stronger response to compare against.
              </p>

              {isIdealLoading && (
                <p className="mt-5 flex items-center gap-2 text-sm text-zinc-400">
                  <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-zinc-600 border-t-[#60A5FA]" />
                  Generating model answer...
                </p>
              )}

              {idealError && !isIdealLoading && (
                <p className="mt-5 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-300">
                  {idealError}
                </p>
              )}

              {idealAnswer && !isIdealLoading && (
                <p className="mt-5 whitespace-pre-wrap text-base leading-relaxed text-[#EDEDF2]">
                  {idealAnswer}
                </p>
              )}
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
