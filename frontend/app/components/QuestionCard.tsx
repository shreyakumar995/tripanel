"use client";

import { useState } from "react";

const TRACKS = ["SDE Technical", "GenAI", "HR Behavioral"] as const;

type Track = (typeof TRACKS)[number];

const TRACK_KEYS: Record<Track, string> = {
  "SDE Technical": "sde_technical",
  GenAI: "genai",
  "HR Behavioral": "hr_behavioral",
};

type QuestionCardProps = {
  onQuestionChange: (question: string) => void;
};

export default function QuestionCard({ onQuestionChange }: QuestionCardProps) {
  const [selectedTrack, setSelectedTrack] = useState<Track>("SDE Technical");
  const [question, setQuestion] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");

  async function generateQuestion() {
    setIsGenerating(true);
    setError("");

    try {
      const response = await fetch("http://localhost:5000/question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ track: TRACK_KEYS[selectedTrack] }),
      });

      if (!response.ok) {
        throw new Error("The question request failed.");
      }

      const data = (await response.json()) as { question?: string };
      const nextQuestion = data.question?.trim() ?? "";

      if (!nextQuestion) {
        throw new Error("No question was returned.");
      }

      setQuestion(nextQuestion);
      onQuestionChange(nextQuestion);
    } catch {
      setError("Could not generate a question. Check that the backend is running.");
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <section className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap gap-2">
        {TRACKS.map((option) => {
          const isActive = selectedTrack === option;
          return (
            <button
              key={option}
              type="button"
              onClick={() => setSelectedTrack(option)}
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
        onClick={generateQuestion}
        disabled={isGenerating}
        className="mt-5 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-300 disabled:text-zinc-500 disabled:hover:bg-zinc-300"
      >
        {isGenerating ? "Generating..." : "Generate Question"}
      </button>

      <div
        className={`mt-5 min-h-28 rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm leading-relaxed ${
          question ? "text-zinc-800" : "text-zinc-500"
        }`}
      >
        {isGenerating ? (
          <span className="inline-flex items-center gap-2">
            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-800" />
            Generating question...
          </span>
        ) : (
          question || "Click Generate Question to start"
        )}
      </div>

      {error && (
        <p className="mt-3 text-sm text-red-600">{error}</p>
      )}
    </section>
  );
}
