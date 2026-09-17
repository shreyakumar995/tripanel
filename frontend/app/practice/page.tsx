"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import AnswerInput from "../components/AnswerInput";
import OnboardingTour from "../components/OnboardingTour";
import StageIndicator, { type Stage } from "../components/StageIndicator";
import AnswerComposer from "../components/practice/AnswerComposer";
import InterviewSetup from "../components/practice/InterviewSetup";
import LivePanel from "../components/practice/LivePanel";
import QuestionStage from "../components/practice/QuestionStage";
import SessionHeader, {
  type InterviewPhase,
} from "../components/practice/SessionHeader";
import SessionHistory, {
  type InterviewSession,
} from "../components/practice/SessionHistory";
import { TRACK_KEYS, trackFromKey, type Track } from "../components/practice/constants";
import { getSettings, type TrackOption } from "../lib/settings";
import type { ScoreResult } from "../components/ScorePanel";
import "./practice.css";

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

type FollowupData = {
  followup_question: string;
  asked_by: string;
};

const PERSONA_ACCENT: Record<string, string> = {
  "Strict Technical Reviewer": "#72D13D",
  "Friendly HR Interviewer": "#172018",
  "System Design Skeptic": "#667066",
};

function speakQuestion(text: string) {
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.95;
  utterance.pitch = 1;
  window.speechSynthesis.speak(utterance);
}

function toResults(payload: EvaluateResponse): ScoreResult[] {
  return Object.values(payload).map((item) => ({
    persona: item.persona ?? "Unknown persona",
    score: item.score,
    reasoning: item.reasoning,
    weaknesses: Array.isArray(item.weaknesses) ? item.weaknesses : [],
    failed: Boolean(item.failed),
  }));
}

export default function PracticePage() {
  const [track, setTrack] = useState<Track>("SDE Technical");
  const [question, setQuestion] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [jdText, setJdText] = useState("");
  const [isJdOpen, setIsJdOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [genError, setGenError] = useState("");

  const [answer, setAnswer] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [results, setResults] = useState<ScoreResult[] | null>(null);
  const [submitError, setSubmitError] = useState("");

  const [followup, setFollowup] = useState<FollowupData | null>(null);
  const [isFollowupLoading, setIsFollowupLoading] = useState(false);
  const [followupError, setFollowupError] = useState("");
  const [followupAnswer, setFollowupAnswer] = useState<string | null>(null);

  const [cameraOn, setCameraOn] = useState(false);
  const [cameraError, setCameraError] = useState("");

  const [setupCollapsed, setSetupCollapsed] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [selectedSessionId, setSelectedSessionId] = useState<number | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [sessionNumber, setSessionNumber] = useState(1);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [stage, setStage] = useState<Stage>("idle");
  const startCameraRef = useRef<(() => Promise<boolean>) | null>(null);

  const ensureCamera = useCallback(async () => {
    if (cameraOn) return true;
    const start = startCameraRef.current;
    if (!start) return false;
    return start();
  }, [cameraOn]);

  useEffect(() => {
    setTrack(getSettings().defaultTrack as TrackOption);
  }, []);

  useEffect(() => {
    if (!timerActive) return;
    const id = window.setInterval(() => setElapsedSeconds((s) => s + 1), 1000);
    return () => window.clearInterval(id);
  }, [timerActive]);

  useEffect(() => {
    if (question && !isSubmitted) {
      setSetupCollapsed(true);
    }
  }, [question, isSubmitted]);

  const phase: InterviewPhase = useMemo(() => {
    if (isSubmitting) return "submitting";
    if (isSubmitted && results) return "submitted";
    if (isListening) return "recording";
    if (answer.trim()) return "responding";
    if (question) return "question-ready";
    return "idle";
  }, [isSubmitting, isSubmitted, results, isListening, answer, question]);

  const generateQuestion = useCallback(async () => {
    setIsGenerating(true);
    setGenError("");
    setDifficulty("");
    setIsSubmitted(false);
    setResults(null);
    setSubmitError("");
    setFollowup(null);
    setIsFollowupLoading(false);
    setFollowupError("");
    setFollowupAnswer(null);
    setStage("idle");

    try {
      const body: { track: string; jd_text?: string } = {
        track: TRACK_KEYS[track],
      };
      const trimmedJd = jdText.trim();
      if (trimmedJd) body.jd_text = trimmedJd;

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/question`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as {
          error?: string;
        } | null;
        throw new Error(
          payload?.error ?? "The question request failed.",
        );
      }

      const data = (await response.json()) as {
        question?: string;
        difficulty?: string;
      };
      const nextQuestion = data.question?.trim() ?? "";
      const nextDifficulty = data.difficulty?.trim() ?? "";

      if (!nextQuestion) throw new Error("No question was returned.");

      setQuestion(nextQuestion);
      setDifficulty(nextDifficulty);
      setAnswer("");
      setElapsedSeconds(0);
      setTimerActive(true);
      setSetupCollapsed(true);
      setSelectedSessionId(null);
      setStage("question_ready");

      if (getSettings().autoSpeakQuestions) {
        speakQuestion(nextQuestion);
      }
    } catch (err) {
      setGenError(
        err instanceof Error
          ? err.message
          : "Could not generate a question. Check that the backend is running.",
      );
    } finally {
      setIsGenerating(false);
    }
  }, [track, jdText]);

  function markAnswering() {
    setStage((current) =>
      current === "question_ready" || current === "idle"
        ? "answering"
        : current,
    );
  }

  async function handleSubmit() {
    if (!question.trim()) {
      setSubmitError("Generate a question before submitting an answer.");
      return;
    }
    if (!answer.trim()) return;

    setIsSubmitting(true);
    setStage("reviewing");
    setSubmitError("");
    setFollowup(null);
    setIsFollowupLoading(false);
    setFollowupError("");
    setFollowupAnswer(null);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/evaluate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, answer }),
      });

      if (!response.ok) throw new Error("The evaluation request failed.");

      const data = (await response.json()) as EvaluateResponse;
      setResults(toResults(data));
      setIsSubmitted(true);
      setStage("feedback_ready");
      setTimerActive(false);
      setRefreshKey((k) => k + 1);

      setIsFollowupLoading(true);
      try {
        const followupResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/followup`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ question, answer, results: data }),
          },
        );

        if (!followupResponse.ok) {
          throw new Error("The follow-up request failed.");
        }

        const followupData = (await followupResponse.json()) as FollowupData;
        if (!followupData.followup_question?.trim()) {
          throw new Error("No follow-up question was returned.");
        }

        setFollowup({
          followup_question: followupData.followup_question.trim(),
          asked_by: followupData.asked_by?.trim() || "Interviewer",
        });
      } catch {
        setFollowupError(
          "Could not generate a follow-up question. You can still continue.",
        );
      } finally {
        setIsFollowupLoading(false);
      }
    } catch {
      setSubmitError("Could not evaluate the answer. Check that the backend is running.");
      setResults(null);
      setIsSubmitted(false);
      setStage("answering");
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleSelectSession(session: InterviewSession) {
    setSelectedSessionId(session.id);
    setQuestion(session.question);
    setAnswer(session.answer);
    setTrack(trackFromKey(session.track));
    setDifficulty("");
    setResults(
      session.results.map((r) => ({
        persona: r.persona,
        score: r.score,
        reasoning: r.reasoning,
        weaknesses: [],
      })),
    );
    setIsSubmitted(true);
    setStage("feedback_ready");
    setSubmitError("");
    setFollowup(null);
    setIsFollowupLoading(false);
    setFollowupError("");
    setFollowupAnswer(null);
    setSetupCollapsed(true);
    setTimerActive(false);
  }

  function handleNextQuestion() {
    setSessionNumber((n) => n + 1);
    setIsSubmitted(false);
    setResults(null);
    setAnswer("");
    setQuestion("");
    setDifficulty("");
    setFollowup(null);
    setIsFollowupLoading(false);
    setFollowupError("");
    setFollowupAnswer(null);
    setSelectedSessionId(null);
    setSetupCollapsed(false);
    setStage("idle");
    void generateQuestion();
  }

  function handleFollowupSubmit(nextAnswer: string) {
    setFollowupAnswer(nextAnswer.trim());
  }

  const followupAccent =
    followup && PERSONA_ACCENT[followup.asked_by]
      ? PERSONA_ACCENT[followup.asked_by]
      : "#72D13D";

  return (
    <div className="practice-workspace practice-workspace-bg flex h-full min-h-0 flex-1 flex-col">
      <OnboardingTour />

      <div className="relative flex min-h-0 flex-1">
        <div
          aria-hidden
          className="practice-grid-faint pointer-events-none absolute inset-0 opacity-30"
        />

        <SessionHistory
          refreshKey={refreshKey}
          selectedId={selectedSessionId}
          onSelectSession={handleSelectSession}
          mobileOpen={historyOpen}
          onMobileClose={() => setHistoryOpen(false)}
        />

        <div className="flex min-h-0 min-w-0 flex-1 flex-col">
          <SessionHeader
            track={track}
            phase={phase}
            sessionNumber={sessionNumber}
            elapsedSeconds={elapsedSeconds}
            cameraOn={cameraOn}
            micActive={isListening}
            onOpenHistory={() => setHistoryOpen(true)}
          />

          <StageIndicator stage={stage} />

          <InterviewSetup
            track={track}
            onTrackChange={setTrack}
            jdText={jdText}
            onJdChange={setJdText}
            isJdOpen={isJdOpen}
            onJdOpenChange={setIsJdOpen}
            isGenerating={isGenerating}
            onGenerate={() => void generateQuestion()}
            collapsed={setupCollapsed}
            onCollapsedChange={setSetupCollapsed}
            hasQuestion={Boolean(question)}
            error={genError}
          />

          <div className="flex min-h-0 flex-1 flex-col xl:flex-row">
            <main className="min-h-0 min-w-0 flex-1 overflow-y-auto pb-6">
              <QuestionStage
                question={question}
                difficulty={difficulty}
                track={track}
                isGenerating={isGenerating}
                isSubmitted={isSubmitted}
              />

              {(question || isSubmitted) && (
                <AnswerComposer
                  answer={answer}
                  onAnswerChange={setAnswer}
                  isListening={isListening}
                  onListeningChange={setIsListening}
                  isSubmitting={isSubmitting}
                  isSubmitted={isSubmitted}
                  onSubmit={() => void handleSubmit()}
                  disabled={!question || isGenerating}
                  onAnsweringStart={markAnswering}
                  onEnsureCamera={ensureCamera}
                />
              )}

              {submitError && (
                <p className="studio-error mx-4 rounded-xl px-4 py-3 text-sm sm:mx-6">
                  {submitError}
                </p>
              )}

              {isSubmitted && results && (
                <div className="mx-4 mb-6 flex flex-wrap gap-3 sm:mx-6">
                  <button
                    type="button"
                    onClick={handleNextQuestion}
                    className="landing-btn-primary text-sm"
                  >
                    Next question →
                  </button>
                  <button
                    type="button"
                    onClick={() => setSetupCollapsed(false)}
                    className="landing-btn-secondary text-sm"
                  >
                    Change interview mode
                  </button>
                </div>
              )}
            </main>

            <LivePanel
              cameraOn={cameraOn}
              cameraError={cameraError}
              onCameraChange={setCameraOn}
              onCameraError={setCameraError}
              results={results}
              isSubmitted={isSubmitted}
              isSubmitting={isSubmitting}
              cameraLocked={isListening}
              onRegisterStartCamera={(start) => {
                startCameraRef.current = start;
              }}
              afterScores={
                isSubmitted && results ? (
                  <div className="mt-5 space-y-3">
                    {isFollowupLoading && (
                      <div className="rounded-xl border border-[#DCE4D8] bg-[#F7FAF5] px-4 py-5">
                        <p className="flex items-center gap-2 text-sm text-[#667066]">
                          <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-[#DCE4D8] border-t-[#72D13D]" />
                          Generating follow-up question...
                        </p>
                      </div>
                    )}

                    {followupError && !isFollowupLoading && (
                      <p className="rounded-xl border border-[#B84A5A]/20 bg-[#FCE8EB] px-4 py-3 text-sm text-[#B84A5A]">
                        {followupError}
                      </p>
                    )}

                    {followup && !isFollowupLoading && (
                      <div
                        className="rounded-xl border border-[#DCE4D8] bg-white p-4"
                        style={{ borderLeftWidth: 4, borderLeftColor: followupAccent }}
                      >
                        <p
                          className="text-xs font-semibold uppercase tracking-wide"
                          style={{ color: followupAccent }}
                        >
                          Follow-up from {followup.asked_by}:
                        </p>
                        <p className="mt-2 text-sm leading-relaxed text-[#172018]">
                          {followup.followup_question}
                        </p>

                        {followupAnswer !== null ? (
                          <div className="mt-4 rounded-lg border border-[#DCE4D8] bg-[#F7FAF5] px-3 py-3">
                            <p className="text-[10px] font-semibold uppercase tracking-wide text-[#667066]">
                              Your follow-up answer
                            </p>
                            <p className="mt-1.5 text-sm leading-relaxed text-[#172018]">
                              {followupAnswer || "(No speech detected)"}
                            </p>
                          </div>
                        ) : (
                          <div className="mt-4 [&_section]:border-[#DCE4D8]">
                            <AnswerInput onSubmit={handleFollowupSubmit} />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ) : null
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}
