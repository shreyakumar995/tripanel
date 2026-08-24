"use client";

import { useEffect, useMemo, useState } from "react";
import { trackFromKey } from "./constants";

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

function truncate(text: string, maxLength = 52) {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trimEnd()}…`;
}

function averageScore(results: SessionResult[]) {
  if (results.length === 0) return null;
  return results.reduce((sum, r) => sum + r.score, 0) / results.length;
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

type SessionHistoryProps = {
  refreshKey: number;
  selectedId: number | null;
  onSelectSession: (session: InterviewSession) => void;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
};

export default function SessionHistory({
  refreshKey,
  selectedId,
  onSelectSession,
  mobileOpen = false,
  onMobileClose,
}: SessionHistoryProps) {
  const [sessions, setSessions] = useState<InterviewSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");

  useEffect(() => {
    async function loadSessions() {
      try {
        const response = await fetch("http://localhost:5000/sessions");
        if (!response.ok) throw new Error("The sessions request failed.");
        const data = (await response.json()) as InterviewSession[];
        setSessions(Array.isArray(data) ? data : []);
      } catch {
        setError("Could not load session history.");
      } finally {
        setIsLoading(false);
      }
    }
    void loadSessions();
  }, [refreshKey]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return sessions;
    return sessions.filter(
      (s) =>
        s.question.toLowerCase().includes(q) ||
        trackFromKey(s.track).toLowerCase().includes(q),
    );
  }, [sessions, query]);

  const panel = (
    <>
      <div className="border-b border-[#DCE5D8] px-4 py-4">
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#687268]">
          Sessions
        </p>
        <h2 className="font-display mt-0.5 text-sm font-semibold text-[#172018]">
          History
        </h2>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Filter sessions..."
          className="studio-input mt-3 w-full px-3 py-2 text-xs"
        />
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {isLoading && (
          <p className="px-2 py-3 text-xs text-[#687268]">Loading history...</p>
        )}
        {error && <p className="px-2 py-3 text-xs text-[#B84A5A]">{error}</p>}
        {!isLoading && !error && filtered.length === 0 && (
          <p className="px-3 py-10 text-center text-xs leading-relaxed text-[#687268]">
            {sessions.length === 0
              ? "No sessions yet. Complete an interview to see history here."
              : "No sessions match your filter."}
          </p>
        )}
        <ul className="flex flex-col gap-0.5">
          {filtered.map((session) => {
            const avg = averageScore(session.results);
            const isSelected = selectedId === session.id;
            return (
              <li key={session.id}>
                <button
                  type="button"
                  onClick={() => {
                    onSelectSession(session);
                    onMobileClose?.();
                  }}
                  className={`practice-history-item w-full rounded-r-lg px-3 py-2.5 text-left ${
                    isSelected ? "is-selected" : ""
                  }`}
                >
                  <p className="text-[11px] font-semibold text-[#172018]">
                    {trackFromKey(session.track)}
                  </p>
                  <p className="mt-0.5 text-xs leading-snug text-[#687268]">
                    &ldquo;{truncate(session.question)}&rdquo;
                  </p>
                  <div className="mt-1.5 flex items-center justify-between text-[10px] text-[#687268]">
                    <span>{formatDate(session.created_at)}</span>
                    <span className="font-mono font-medium tabular-nums text-[#4FB832]">
                      {avg === null ? "—" : `${avg.toFixed(1)} avg`}
                    </span>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden h-full w-[270px] shrink-0 flex-col border-r border-[#DCE5D8] bg-white lg:flex">
        {panel}
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            type="button"
            aria-label="Close history"
            className="absolute inset-0 bg-[#172018]/30"
            onClick={onMobileClose}
          />
          <aside className="absolute bottom-0 left-0 top-0 flex w-[min(88vw,300px)] flex-col bg-white shadow-xl">
            {panel}
          </aside>
        </div>
      )}
    </>
  );
}