"use client";

import { useState } from "react";

const TRACKS = ["SDE Technical", "GenAI", "HR Behavioral"] as const;

type Track = (typeof TRACKS)[number];

export default function QuestionCard() {
  const [track, setTrack] = useState<Track>("SDE Technical");

  return (
    <section className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap gap-2">
        {TRACKS.map((option) => {
          const isActive = track === option;
          return (
            <button
              key={option}
              type="button"
              onClick={() => setTrack(option)}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-zinc-900 text-white"
                  : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
              }`}
            >
              {option}
            </button>
          );
        })}
      </div>

      <button
        type="button"
        className="mt-5 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800"
      >
        Generate Question
      </button>

      <div className="mt-5 min-h-28 rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm leading-relaxed text-zinc-500">
        Click Generate Question to start
      </div>
    </section>
  );
}
