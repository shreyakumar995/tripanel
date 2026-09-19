"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type ChangeEvent } from "react";
import {
  TRACK_KEYS,
  TRACKS,
  type Track,
} from "../components/QuestionCard";
import { getSettings, type TrackOption } from "../lib/settings";

export default function TailorPage() {
  const [track, setTrack] = useState<Track>("SDE Technical");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [jdText, setJdText] = useState("");
  const [question, setQuestion] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTrack(getSettings().defaultTrack as TrackOption);
  }, []);

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    setError("");

    if (!file) {
      setResumeFile(null);
      return;
    }

    if (
      file.type !== "application/pdf" &&
      !file.name.toLowerCase().endsWith(".pdf")
    ) {
      setResumeFile(null);
      setError("Please upload a PDF resume only.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    setResumeFile(file);
  }

  async function handleGenerate() {
    if (!resumeFile) {
      setError("Upload a PDF resume to generate a tailored question.");
      return;
    }

    setIsGenerating(true);
    setError("");
    setQuestion("");
    setDifficulty("");

    try {
      const formData = new FormData();
      formData.append("resume", resumeFile);
      formData.append("track", TRACK_KEYS[track]);
      formData.append("jd_text", jdText.trim());

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/tailor`,
        {
          method: "POST",
          body: formData,
        },
      );

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as {
          error?: string;
        } | null;
        throw new Error(payload?.error ?? "The tailor request failed.");
      }

      const data = (await response.json()) as {
        question?: string;
        difficulty?: string;
      };
      const nextQuestion = data.question?.trim() ?? "";
      if (!nextQuestion) {
        throw new Error("No question was returned.");
      }

      setQuestion(nextQuestion);
      setDifficulty(data.difficulty?.trim() ?? "");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not generate a tailored question. Check that the backend is running.",
      );
    } finally {
      setIsGenerating(false);
    }
  }

  const practiceHref = question
    ? `/practice?question=${encodeURIComponent(question)}&track=${TRACK_KEYS[track]}`
    : "/practice";

  return (
    <div className="app-shell flex-1 overflow-y-auto bg-[#12141C] text-[#EDEDF2]">
      <div className="mx-auto w-full max-w-5xl px-6 py-10 sm:px-8 lg:px-10">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-[#EDEDF2] sm:text-4xl">
            Tailor Your Practice
          </h1>
          <p className="mt-2 text-base text-zinc-400">
            Upload your resume and optionally a job description to get a
            question aimed at your gaps.
          </p>
        </div>

        <section className="mt-8 rounded-xl border border-white/5 bg-[#1B1E29] p-6 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">
            Track
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {TRACKS.map((option) => {
              const isActive = track === option;
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => setTrack(option)}
                  disabled={isGenerating}
                  className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors disabled:opacity-50 ${
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

          <label className="mt-8 block">
            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">
              Resume (PDF)
            </span>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,application/pdf"
              onChange={handleFileChange}
              disabled={isGenerating}
              className="mt-3 block w-full text-sm text-zinc-300 file:mr-4 file:rounded-lg file:border-0 file:bg-[#72D13D] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-[#12141C] hover:file:opacity-90 disabled:opacity-50"
            />
            {resumeFile && (
              <p className="mt-2 text-sm text-zinc-400">
                Selected: {resumeFile.name}
              </p>
            )}
          </label>

          <label className="mt-8 block">
            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">
              Job description{" "}
              <span className="normal-case tracking-normal text-zinc-600">
                (optional)
              </span>
            </span>
            <textarea
              value={jdText}
              onChange={(event) => setJdText(event.target.value)}
              disabled={isGenerating}
              rows={6}
              placeholder="Paste a job description to focus the question on role-specific gaps..."
              className="mt-3 w-full resize-y rounded-xl border border-white/10 bg-[#12141C] px-4 py-3 text-sm leading-relaxed text-[#EDEDF2] placeholder:text-zinc-600 outline-none transition-colors focus:border-[#72D13D]/50 disabled:opacity-50"
            />
          </label>

          <button
            type="button"
            onClick={() => void handleGenerate()}
            disabled={isGenerating || !resumeFile}
            className="mt-8 inline-flex items-center justify-center gap-2 rounded-lg bg-[#72D13D] px-5 py-2.5 text-sm font-semibold text-[#12141C] transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isGenerating && (
              <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-[#12141C]/30 border-t-[#12141C]" />
            )}
            {isGenerating ? "Generating…" : "Generate Tailored Question"}
          </button>

          {error && (
            <p className="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {error}
            </p>
          )}
        </section>

        {(isGenerating || question) && (
          <section className="mt-6 rounded-xl border border-white/5 bg-[#1B1E29] p-6 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">
              Tailored question
            </p>

            {isGenerating && !question && (
              <p className="mt-4 flex items-center gap-2 text-sm text-zinc-400">
                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-zinc-600 border-t-[#72D13D]" />
                Uploading resume and generating question…
              </p>
            )}

            {question && (
              <>
                {difficulty && (
                  <span className="mt-4 inline-block rounded-full bg-white/5 px-2.5 py-0.5 text-xs font-medium capitalize text-zinc-400">
                    {difficulty}
                  </span>
                )}
                <p className="mt-4 text-base leading-relaxed text-[#EDEDF2] sm:text-lg">
                  {question}
                </p>
                <Link
                  href={practiceHref}
                  className="mt-6 inline-flex items-center justify-center rounded-lg bg-[#72D13D] px-5 py-2.5 text-sm font-semibold text-[#12141C] transition-opacity hover:opacity-90"
                >
                  Practice This Question →
                </Link>
              </>
            )}
          </section>
        )}
      </div>
    </div>
  );
}
