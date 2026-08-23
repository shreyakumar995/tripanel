"use client";

import { useEffect, useState } from "react";
import { getSettings, type TrackOption } from "../lib/settings";

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

const DIFFICULTY_BADGE: Record<
  string,
  { label: string; className: string }
> = {
  beginner: {
    label: "Beginner",
    className: "bg-status-green/15 text-status-green",
  },
  intermediate: {
    label: "Intermediate",
    className: "bg-status-yellow/15 text-status-yellow",
  },
  advanced: {
    label: "Advanced",
    className: "bg-status-red/15 text-status-red",
  },
};

function difficultyBadge(difficulty: string) {
  const key = difficulty.toLowerCase();
  return (
    DIFFICULTY_BADGE[key] ?? {
      label: difficulty,
      className: "bg-border-subtle text-text-muted",
    }
  );
}

export default function QuestionCard({ onQuestionChange }: QuestionCardProps) {
  const [selectedTrack, setSelectedTrack] = useState<Track>("SDE Technical");
  const [question, setQuestion] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const settings = getSettings();
    setSelectedTrack(settings.defaultTrack as TrackOption);
  }, []);

  async function generateQuestion() {
    setIsGenerating(true);
    setError("");
    setDifficulty("");

    try {
      const response = await fetch("http://localhost:5000/question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ track: TRACK_KEYS[selectedTrack] }),
      });

      if (!response.ok) {
        throw new Error("The question request failed.");
      }

      const data = (await response.json()) as {
        question?: string;
        difficulty?: string;
      };
      const nextQuestion = data.question?.trim() ?? "";
      const nextDifficulty = data.difficulty?.trim() ?? "";

      if (!nextQuestion) {
        throw new Error("No question was returned.");
      }

      setQuestion(nextQuestion);
      setDifficulty(nextDifficulty);
      onQuestionChange(nextQuestion);
      if (getSettings().autoSpeakQuestions) {
        speakQuestion(nextQuestion);
      }
    } catch {
      setError("Could not generate a question. Check that the backend is running.");
    } finally {
      setIsGenerating(false);
    }
  }

  const badge = difficulty ? difficultyBadge(difficulty) : null;

  return (
    <section className="rounded-xl border border-border-subtle bg-surface p-6 sm:p-7">
      <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-text-muted">
        Question
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {TRACKS.map((option) => {
          const isActive = selectedTrack === option;
          return (
            <button
              key={option}
              type="button"
              onClick={() => setSelectedTrack(option)}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                isActive
                  ? "btn-lime text-background"
                  : "bg-background text-text-muted hover:text-ivory"
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
        className="btn-lime mt-5 rounded-md px-4 py-2 text-sm font-semibold text-background transition-all hover:-translate-y-px disabled:cursor-not-allowed disabled:bg-border-subtle disabled:text-text-muted disabled:bg-none"
      >
        {isGenerating ? "Generating..." : "Generate Question"}
      </button>

      <div
        className={`mt-5 min-h-28 rounded-lg border border-border-subtle bg-background px-4 py-3 text-sm leading-relaxed sm:text-base ${
          question ? "text-ivory" : "text-text-muted"
        }`}
      >
        {isGenerating ? (
          <span className="inline-flex items-center gap-2 text-text-muted">
            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-border-subtle border-t-accent" />
            Generating question...
          </span>
        ) : question ? (
          <div className="flex flex-wrap items-start gap-2">
            {badge && (
              <span
                className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${badge.className}`}
              >
                {badge.label}
              </span>
            )}
            <p className="min-w-0 flex-1 text-ivory">{question}</p>
          </div>
        ) : (
          "Click Generate Question to start"
        )}
      </div>

      {error && <p className="mt-3 text-sm text-status-red">{error}</p>}
    </section>
  );
}
