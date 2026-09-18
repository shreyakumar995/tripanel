"use client";

import { useEffect, useState } from "react";
import { getSettings, type TrackOption } from "../lib/settings";

export const TRACKS = ["SDE Technical", "GenAI", "HR Behavioral"] as const;

export type Track = (typeof TRACKS)[number];

export const TRACK_KEYS: Record<Track, string> = {
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

const DIFFICULTY_BADGE: Record<string, { label: string; className: string }> = {
  beginner: { label: "Beginner", className: "studio-chip-beginner" },
  intermediate: { label: "Intermediate", className: "studio-chip-intermediate" },
  advanced: { label: "Advanced", className: "studio-chip-advanced" },
};

function difficultyBadge(difficulty: string) {
  const key = difficulty.toLowerCase();
  return (
    DIFFICULTY_BADGE[key] ?? {
      label: difficulty,
      className: "bg-[#F1F7ED] text-[#667066]",
    }
  );
}

export default function QuestionCard({ onQuestionChange }: QuestionCardProps) {
  const [selectedTrack, setSelectedTrack] = useState<Track>("SDE Technical");
  const [question, setQuestion] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [jdText, setJdText] = useState("");
  const [isJdOpen, setIsJdOpen] = useState(false);
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
      const body: { track: string; jd_text?: string } = {
        track: TRACK_KEYS[selectedTrack],
      };
      const trimmedJd = jdText.trim();
      if (trimmedJd) {
        body.jd_text = trimmedJd;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/question`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
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
    <section className="landing-card p-6 sm:p-7">
      <p className="studio-label">Question</p>

      <div className="mt-4 flex flex-wrap gap-2">
        {TRACKS.map((option) => {
          const isActive = selectedTrack === option;
          return (
            <button
              key={option}
              type="button"
              onClick={() => setSelectedTrack(option)}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                isActive ? "studio-track-active" : "studio-track-inactive"
              }`}
            >
              {option}
            </button>
          );
        })}
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-[#DCE4D8] bg-[#F8FAF5]">
        <button
          type="button"
          onClick={() => setIsJdOpen((open) => !open)}
          aria-expanded={isJdOpen}
          className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm text-[#667066] transition-colors hover:text-[#172018]"
        >
          <span>Tailor to a job description (optional)</span>
          <span
            className={`shrink-0 text-xs transition-transform ${
              isJdOpen ? "rotate-180" : ""
            }`}
            aria-hidden
          >
            ▼
          </span>
        </button>
        {isJdOpen && (
          <div className="border-t border-[#DCE4D8] bg-white px-4 pb-4 pt-3">
            <textarea
              value={jdText}
              onChange={(event) => setJdText(event.target.value)}
              placeholder="Paste a job description to tailor generated questions..."
              rows={5}
              className="studio-input w-full resize-y px-3 py-2.5 text-sm leading-relaxed"
            />
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={generateQuestion}
        disabled={isGenerating}
        className="landing-btn-primary mt-5 text-sm disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isGenerating ? "Generating..." : "Generate Question"}
      </button>

      <div
        className={`mt-5 min-h-28 rounded-xl border border-[#DCE4D8] bg-[#F8FAF5] px-4 py-3 text-sm leading-relaxed sm:text-base ${
          question ? "text-[#172018]" : "text-[#667066]"
        }`}
      >
        {isGenerating ? (
          <span className="inline-flex items-center gap-2 text-[#667066]">
            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-[#DCE4D8] border-t-[#72D13D]" />
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
            <p className="min-w-0 flex-1">{question}</p>
          </div>
        ) : (
          "Click Generate Question to start"
        )}
      </div>

      {error && <p className="mt-3 text-sm text-[#B84A5A]">{error}</p>}
    </section>
  );
}
