"use client";

import { useState } from "react";
import AnswerInput from "./components/AnswerInput";
import ConsistencyBadge from "./components/ConsistencyBadge";
import HistorySidebar, {
  type InterviewSession,
} from "./components/HistorySidebar";
import QuestionCard from "./components/QuestionCard";
import ScorePanel, { type ScoreResult } from "./components/ScorePanel";

type EvaluateResponse = Record<
  string,
  {
    persona?: string;
    score?: number;
    reasoning?: string;
    weaknesses?: string[];
  }
>;

function toResults(payload: EvaluateResponse): ScoreResult[] {
  return Object.values(payload).map((item) => ({
    persona: item.persona ?? "Unknown persona",
    score: typeof item.score === "number" ? item.score : 0,
    reasoning: item.reasoning ?? "",
    weaknesses: Array.isArray(item.weaknesses) ? item.weaknesses : [],
  }));
}

export default function Home() {
  const [question, setQuestion] = useState("");
  const [results, setResults] = useState<ScoreResult[] | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  function handleSelectSession(session: InterviewSession) {
    setQuestion(session.question);
    setResults(
      session.results.map((result) => ({
        persona: result.persona,
        score: result.score,
        reasoning: result.reasoning,
        weaknesses: [],
      })),
    );
    setError("");
  }

  async function handleSubmit(answer: string) {
    if (!question.trim()) {
      setError("Generate a question before submitting an answer.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("http://localhost:5000/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, answer }),
      });

      if (!response.ok) {
        throw new Error("The evaluation request failed.");
      }

      const data = (await response.json()) as EvaluateResponse;
      setResults(toResults(data));
    } catch {
      setError("Could not evaluate the answer. Check that the backend is running.");
      setResults(null);
    } finally {
      setIsSubmitting(false);
    }
  }
  
  return (
    <div className="flex flex-1 min-h-0 bg-zinc-100">
      <HistorySidebar onSelectSession={handleSelectSession} />
      <div className="flex-1 overflow-y-auto px-6 py-8">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
          <QuestionCard onQuestionChange={setQuestion} />
          <AnswerInput isSubmitting={isSubmitting} onSubmit={handleSubmit} />

          {isSubmitting && (
            <p className="flex items-center gap-2 text-sm text-zinc-600">
              <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-800" />
              Evaluating your answer...
            </p>
          )}

          {error && (
            <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </p>
          )}

          {results && results.length > 0 && (
            <div className="flex flex-col gap-3">
              <ConsistencyBadge scores={results.map((result) => result.score)} />
              <ScorePanel results={results} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
