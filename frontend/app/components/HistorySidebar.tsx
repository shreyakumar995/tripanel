"use client";

import { useEffect, useState } from "react";

export type SessionResult = {
  persona: string;
  score: number;
  reasoning: string;
};

export type InterviewSession = {
  id: number;
  track: string;
  question: string;
  answer: string;
  created_at: string;
  results: SessionResult[];
};

const TRACK_LABELS: Record<string, string> = {
  sde_technical: "SDE Technical",
  genai: "GenAI",
  hr_behavioral: "HR Behavioral",
};

function trackLabel(track: string) {
  return TRACK_LABELS[track] ?? track;
}

function truncate(text: string, maxLength = 60) {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trimEnd()}…`;
}

function averageScore(results: SessionResult[]) {
  if (results.length === 0) return null;
  const total = results.reduce((sum, result) => sum + result.score, 0);
  return total / results.length;
}

function formatDate(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

type HistorySidebarProps = {
  onSelectSession: (session: InterviewSession) => void;
};

export default function HistorySidebar({ onSelectSession }: HistorySidebarProps) {
  const [sessions, setSessions] = useState<InterviewSession[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadSessions() {
      try {
        const response = await fetch("http://localhost:5000/sessions");
        if (!response.ok) {
          throw new Error("The sessions request failed.");
        }
        const data = (await response.json()) as InterviewSession[];
        setSessions(Array.isArray(data) ? data : []);
      } catch {
        setError("Could not load session history.");
      } finally {
        setIsLoading(false);
      }
    }

    void loadSessions();
  }, []);

  return (
    <aside className="flex w-72 shrink-0 flex-col border-r border-border-subtle bg-surface">
      <div className="border-b border-border-subtle px-5 py-4">
        <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-text-muted">
          Sessions
        </p>
        <h2 className="mt-1 font-heading text-sm font-semibold tracking-tight text-ivory">
          History
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {isLoading && (
          <p className="px-2 py-3 text-sm text-text-muted">Loading history...</p>
        )}

        {error && <p className="px-2 py-3 text-sm text-status-red">{error}</p>}

        {!isLoading && !error && sessions.length === 0 && (
          <p className="px-4 py-12 text-center text-sm leading-relaxed text-text-muted">
            No practice sessions yet — generate a question and submit an answer
            to get started.
          </p>
        )}

        <ul className="flex flex-col gap-1">
          {sessions.map((session) => {
            const avg = averageScore(session.results);
            const isSelected = selectedId === session.id;

            return (
              <li key={session.id}>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedId(session.id);
                    onSelectSession(session);
                  }}
                  className={`w-full rounded-md px-3 py-2.5 text-left transition-colors ${
                    isSelected
                      ? "bg-background text-ivory ring-1 ring-accent/30"
                      : "text-ivory hover:bg-background/70"
                  }`}
                >
                  <p className="text-xs font-medium text-ivory">
                    {trackLabel(session.track)}
                  </p>
                  <p className="mt-1 text-sm leading-snug text-text-muted">
                    {truncate(session.question)}
                  </p>
                  <div className="mt-2 flex items-center justify-between text-xs text-text-muted">
                    <span>{formatDate(session.created_at)}</span>
                    <span className="font-mono tabular-nums text-accent">
                      {avg === null ? "—" : `${avg.toFixed(1)} avg`}
                    </span>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
}
