"use client";

import { useEffect, useMemo, useState } from "react";
import AnswerInput from "../components/AnswerInput";
import ConsistencyBadge from "../components/ConsistencyBadge";
import {
  TRACK_KEYS,
  TRACKS,
  type Track,
} from "../components/QuestionCard";
import ScorePanel, { type ScoreResult } from "../components/ScorePanel";
import { getSettings, type TrackOption } from "../lib/settings";

const TOTAL_QUESTIONS = 3;

type Phase = "selecting-track" | "answering" | "round-complete";

type EvaluateResponse = Record<
  string,
  {
    persona?: string;
    score?: number;
    reasoning?: string;
    weaknesses?: string[];
    failed?: boolean;
  }
>;

type CompletedRound = {
  question: string;
  answer: string;
  results: ScoreResult[];
};

function toResults(payload: EvaluateResponse): ScoreResult[] {
  return Object.values(payload).map((item) => ({
    persona: item.persona ?? "Unknown persona",
    score: item.score,
    reasoning: item.reasoning,
    weaknesses: Array.isArray(item.weaknesses) ? item.weaknesses : [],
    failed: Boolean(item.failed),
  }));
}

function numericScores(results: ScoreResult[]) {
  return results
    .filter((r) => !r.failed && typeof r.score === "number")
    .map((r) => r.score as number);
}

function averageOf(scores: number[]) {
  if (scores.length === 0) return null;
  return scores.reduce((sum, score) => sum + score, 0) / scores.length;
}

function speakQuestion(text: string) {
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.95;
  utterance.pitch = 1;
  window.speechSynthesis.speak(utterance);
}

export default function InterviewPage() {
  const [phase, setPhase] = useState<Phase>("selecting-track");
  const [track, setTrack] = useState<Track>("SDE Technical");
  const [questionNumber, setQuestionNumber] = useState(1);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [completedRounds, setCompletedRounds] = useState<CompletedRound[]>([]);
  const [currentResults, setCurrentResults] = useState<ScoreResult[] | null>(
    null,
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [answerInputKey, setAnswerInputKey] = useState(0);
  const [roundId, setRoundId] = useState(() => Date.now().toString());

  useEffect(() => {
    setTrack(getSettings().defaultTrack as TrackOption);
  }, []);

  const progressLabel =
    phase === "round-complete"
      ? "Round complete"
      : phase === "selecting-track"
        ? `Question 1 of ${TOTAL_QUESTIONS}`
        : `Question ${questionNumber} of ${TOTAL_QUESTIONS}`;

  const currentScores = useMemo(
    () => (currentResults ? numericScores(currentResults) : []),
    [currentResults],
  );

  const overallAverage = useMemo(() => {
    const roundAverages = completedRounds
      .map((round) => averageOf(numericScores(round.results)))
      .filter((value): value is number => value !== null);
    return averageOf(roundAverages);
  }, [completedRounds]);

  async function fetchQuestion() {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/question`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ track: TRACK_KEYS[track] }),
      },
    );

    if (!response.ok) {
      const payload = (await response.json().catch(() => null)) as {
        error?: string;
      } | null;
      throw new Error(payload?.error ?? "The question request failed.");
    }

    const data = (await response.json()) as { question?: string };
    const nextQuestion = data.question?.trim() ?? "";
    if (!nextQuestion) {
      throw new Error("No question was returned.");
    }
    return nextQuestion;
  }

  async function startRound() {
    setError("");
    setIsGenerating(true);
    setCompletedRounds([]);
    setCurrentResults(null);
    setQuestionNumber(1);
    setRoundId(Date.now().toString());

    try {
      const nextQuestion = await fetchQuestion();
      setCurrentQuestion(nextQuestion);
      setPhase("answering");
      setAnswerInputKey((key) => key + 1);
      if (getSettings().autoSpeakQuestions) {
        speakQuestion(nextQuestion);
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not start the interview round. Check that the backend is running.",
      );
    } finally {
      setIsGenerating(false);
    }
  }

  async function handleAnswerSubmit(answer: string) {
    if (!currentQuestion.trim() || !answer.trim()) return;

    setIsSubmitting(true);
    setError("");
    setCurrentResults(null);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/evaluate`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            track: TRACK_KEYS[track],
            question: currentQuestion,
            answer,
            round_id: roundId,
          }),
        },
      );

      if (!response.ok) {
        throw new Error("The evaluation request failed.");
      }

      const data = (await response.json()) as EvaluateResponse;
      const results = toResults(data);
      setCurrentResults(results);
      setCompletedRounds((prev) => [
        ...prev,
        { question: currentQuestion, answer, results },
      ]);
    } catch {
      setError(
        "Could not evaluate the answer. Check that the backend is running.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function goToNextQuestion() {
    if (questionNumber >= TOTAL_QUESTIONS) {
      setPhase("round-complete");
      setCurrentResults(null);
      setCurrentQuestion("");
      return;
    }

    setError("");
    setIsGenerating(true);
    setCurrentResults(null);

    try {
      const nextQuestion = await fetchQuestion();
      setQuestionNumber((n) => n + 1);
      setCurrentQuestion(nextQuestion);
      setAnswerInputKey((key) => key + 1);
      if (getSettings().autoSpeakQuestions) {
        speakQuestion(nextQuestion);
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not generate the next question.",
      );
    } finally {
      setIsGenerating(false);
    }
  }

  function restartRound() {
    setPhase("selecting-track");
    setQuestionNumber(1);
    setCurrentQuestion("");
    setCompletedRounds([]);
    setCurrentResults(null);
    setError("");
    setAnswerInputKey((key) => key + 1);
  }

  const scoredThisQuestion = currentResults !== null;
  const isLastQuestion = questionNumber >= TOTAL_QUESTIONS;

  return (
    <div className="app-shell flex-1 overflow-y-auto bg-[#12141C] text-[#EDEDF2]">
      <div className="mx-auto w-full max-w-5xl px-6 py-10 sm:px-8 lg:px-10">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-semibold tracking-tight text-[#EDEDF2] sm:text-4xl">
              Full Interview Round
            </h1>
            <p className="mt-2 text-base text-zinc-400">
              Three questions. One track. Full panel scoring each round.
            </p>
          </div>
          <div className="rounded-full border border-white/10 bg-[#1B1E29] px-4 py-2 text-sm font-medium text-[#EDEDF2]">
            {progressLabel}
          </div>
        </div>

        <div className="mt-6 flex items-center gap-2">
          {Array.from({ length: TOTAL_QUESTIONS }, (_, index) => {
            const step = index + 1;
            const done = completedRounds.length >= step;
            const active =
              phase === "answering" && questionNumber === step && !done;
            return (
              <div
                key={step}
                className={`h-1.5 flex-1 rounded-full transition-colors ${
                  done
                    ? "bg-[#72D13D]"
                    : active
                      ? "bg-[#72D13D]/50"
                      : "bg-white/10"
                }`}
              />
            );
          })}
        </div>

        {error && (
          <p className="mt-6 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </p>
        )}

        {phase === "selecting-track" && (
          <section className="mt-8 rounded-xl border border-white/5 bg-[#1B1E29] p-6 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">
              Choose track
            </p>
            <p className="mt-1 text-sm text-zinc-400">
              Same tracks as practice — pick one for the whole round.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {TRACKS.map((option) => {
                const isActive = track === option;
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setTrack(option)}
                    className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-[#72D13D] text-[#12141C]"
                        : "bg-white/5 text-zinc-300 hover:bg-white/10"
                    }`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => void startRound()}
              disabled={isGenerating}
              className="mt-8 inline-flex items-center justify-center rounded-lg bg-[#72D13D] px-5 py-2.5 text-sm font-semibold text-[#12141C] transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isGenerating ? "Starting…" : "Start Interview Round"}
            </button>
          </section>
        )}

        {phase === "answering" && (
          <div className="mt-8 space-y-6">
            <section className="rounded-xl border border-white/5 bg-[#1B1E29] p-6 sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">
                Question {questionNumber}
              </p>
              {isGenerating ? (
                <p className="mt-4 flex items-center gap-2 text-sm text-zinc-400">
                  <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-zinc-600 border-t-[#72D13D]" />
                  Generating question…
                </p>
              ) : (
                <p className="mt-4 text-base leading-relaxed text-[#EDEDF2] sm:text-lg">
                  {currentQuestion}
                </p>
              )}
              <p className="mt-3 text-sm text-zinc-500">{track}</p>
            </section>

            {!scoredThisQuestion && !isGenerating && (
              <AnswerInput
                key={answerInputKey}
                isSubmitting={isSubmitting}
                onSubmit={(answer) => void handleAnswerSubmit(answer)}
              />
            )}

            {isSubmitting && (
              <div>
                <p className="mb-3 text-sm text-zinc-400">Scoring your answer…</p>
                <ScorePanel isPending />
              </div>
            )}

            {scoredThisQuestion && currentResults && (
              <div className="space-y-4">
                {currentScores.length > 0 && (
                  <div className="flex flex-wrap items-center gap-3">
                    <ConsistencyBadge scores={currentScores} />
                    <p className="text-sm text-zinc-400">
                      Round avg{" "}
                      <span className="font-mono text-[#EDEDF2]">
                        {averageOf(currentScores)?.toFixed(1) ?? "—"}
                      </span>
                      /10
                    </p>
                  </div>
                )}
                <ScorePanel results={currentResults} />
                <button
                  type="button"
                  onClick={() => void goToNextQuestion()}
                  disabled={isGenerating}
                  className="inline-flex items-center justify-center rounded-lg bg-[#72D13D] px-5 py-2.5 text-sm font-semibold text-[#12141C] transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isGenerating
                    ? "Loading…"
                    : isLastQuestion
                      ? "View Round Summary →"
                      : "Next Question →"}
                </button>
              </div>
            )}
          </div>
        )}

        {phase === "round-complete" && (
          <section className="mt-8 space-y-6">
            <div className="rounded-xl border border-white/5 bg-[#1B1E29] p-6 sm:p-8">
              <h2 className="font-display text-2xl font-semibold tracking-tight text-[#EDEDF2]">
                Round Complete
              </h2>
              <p className="mt-2 text-sm text-zinc-400">
                {track} · {TOTAL_QUESTIONS} questions scored
              </p>
              <div className="mt-6 flex flex-wrap items-end gap-3">
                <span className="font-display text-5xl font-semibold tabular-nums text-[#EDEDF2]">
                  {overallAverage !== null ? overallAverage.toFixed(1) : "—"}
                </span>
                <span className="mb-1 text-lg text-zinc-500">/10 overall</span>
              </div>
            </div>

            <ul className="space-y-4">
              {completedRounds.map((round, index) => {
                const scores = numericScores(round.results);
                const avg = averageOf(scores);
                return (
                  <li
                    key={`${index}-${round.question.slice(0, 24)}`}
                    className="rounded-xl border border-white/5 bg-[#1B1E29] p-5 sm:p-6"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold uppercase tracking-wide text-[#72D13D]">
                          Question {index + 1}
                        </p>
                        <p className="mt-2 text-base text-[#EDEDF2]">
                          {round.question}
                        </p>
                        <p className="mt-3 text-sm text-zinc-500">
                          Your answer:{" "}
                          <span className="text-zinc-400">
                            {round.answer.length > 160
                              ? `${round.answer.slice(0, 160).trimEnd()}…`
                              : round.answer}
                          </span>
                        </p>
                      </div>
                      <div className="shrink-0 text-right">
                        <p className="font-display text-2xl font-semibold tabular-nums text-[#EDEDF2]">
                          {avg !== null ? avg.toFixed(1) : "—"}
                        </p>
                        <p className="text-xs text-zinc-500">avg score</p>
                        {scores.length > 0 && (
                          <div className="mt-2">
                            <ConsistencyBadge scores={scores} />
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="mt-4">
                      <ScorePanel results={round.results} />
                    </div>
                  </li>
                );
              })}
            </ul>

            <button
              type="button"
              onClick={restartRound}
              className="inline-flex items-center justify-center rounded-lg bg-[#72D13D] px-5 py-2.5 text-sm font-semibold text-[#12141C] transition-opacity hover:opacity-90"
            >
              Start another round
            </button>
          </section>
        )}
      </div>
    </div>
  );
}
