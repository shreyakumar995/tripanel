"use client";

import { useState } from "react";

const TRACKS = ["SDE Technical", "GenAI", "HR Behavioral"] as const;

type Track = (typeof TRACKS)[number];

const TRACK_KEYS: Record<Track, string> = {
  "SDE Technical": "sde_technical",
  GenAI: "genai",
  "HR Behavioral": "hr_behavioral",
};

function speakQuestion(text: string) {
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.95;
  utterance.pitch = 1;
  window.speechSynthesis.speak(utterance);
}

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
      speakQuestion(nextQuestion);
    } catch {
      setError("Could not generate a question. Check that the backend is running.");
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <section className="rounded-xl border border-border-subtle bg-surface p-6">
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
                  ? "bg-text-primary text-background"
                  : "bg-background text-text-muted hover:text-text-primary"
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
        className="mt-5 rounded-lg bg-text-primary px-4 py-2 text-sm font-medium text-background transition-colors hover:bg-white disabled:cursor-not-allowed disabled:bg-border-subtle disabled:text-text-muted"
      >
        {isGenerating ? "Generating..." : "Generate Question"}
      </button>

      <div
        className={`mt-5 min-h-28 rounded-lg border border-border-subtle bg-background px-4 py-3 text-sm leading-relaxed ${
          question ? "text-text-primary" : "text-text-muted"
        }`}
      >
        {isGenerating ? (
          <span className="inline-flex items-center gap-2 text-text-muted">
            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-border-subtle border-t-text-primary" />
            Generating question...
          </span>
        ) : (
          question || "Click Generate Question to start"
        )}
      </div>

      {error && <p className="mt-3 text-sm text-status-red">{error}</p>}
    </section>
  );
}
