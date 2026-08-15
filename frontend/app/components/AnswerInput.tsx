"use client";

import { useState } from "react";

export default function AnswerInput() {
  const [answer, setAnswer] = useState("");
  const isEmpty = answer.trim().length === 0;

  return (
    <section className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
      <textarea
        value={answer}
        onChange={(event) => setAnswer(event.target.value)}
        placeholder="Type your answer here..."
        rows={8}
        className="w-full resize-y rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm leading-relaxed text-zinc-800 placeholder:text-zinc-400 outline-none transition-colors focus:border-zinc-400 focus:bg-white"
      />

      <p className="mt-2 text-sm text-zinc-500">
        {answer.length} {answer.length === 1 ? "character" : "characters"}
      </p>

      <button
        type="button"
        disabled={isEmpty}
        className="mt-4 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-300 disabled:text-zinc-500 disabled:hover:bg-zinc-300"
      >
        Submit Answer
      </button>
    </section>
  );
}
