"use client";

import { useRef, useState } from "react";

type AnswerInputProps = {
  isSubmitting?: boolean;
  onSubmit: (answer: string) => void;
};

export default function AnswerInput({
  isSubmitting = false,
  onSubmit,
}: AnswerInputProps) {
  const [answer, setAnswer] = useState("");
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const isEmpty = answer.trim().length === 0;

  function startListening() {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";
    let finalTranscript = "";
    recognition.onresult = (event: any) => {
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript + " ";
        } else {
          interim += transcript;
        }
      }
      setAnswer(finalTranscript + interim);
    };
    recognition.onend = () => setIsListening(false);

    recognition.start();
    recognitionRef.current = recognition;
    setIsListening(true);
  }

  function stopListening() {
    recognitionRef.current?.stop();
    setIsListening(false);
  }

  return (
    <section className="rounded-xl border border-border-subtle bg-surface p-6 sm:p-7">
      <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.18em] text-text-muted">
        Your answer
      </p>
      <textarea
        value={answer}
        onChange={(event) => setAnswer(event.target.value)}
        placeholder="Type your answer here, or use the mic below..."
        rows={8}
        className="w-full resize-y rounded-lg border border-border-subtle bg-background px-4 py-3 text-sm leading-relaxed text-ivory placeholder:text-text-muted outline-none transition-colors focus:border-accent/40"
      />

      <p className="mt-2 text-sm text-text-muted">
        {answer.length} {answer.length === 1 ? "character" : "characters"}
      </p>

      <div className="mt-4 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={isListening ? stopListening : startListening}
          className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
            isListening
              ? "bg-status-red text-white hover:bg-status-red/90"
              : "border border-border-subtle bg-background text-text-muted hover:text-ivory"
          }`}
        >
          {isListening ? "● Stop Recording" : "🎤 Speak Answer"}
        </button>

        <button
          type="button"
          disabled={isEmpty || isSubmitting}
          onClick={() => onSubmit(answer)}
          className="btn-lime rounded-md px-4 py-2 text-sm font-semibold text-background transition-all hover:-translate-y-px disabled:cursor-not-allowed disabled:bg-border-subtle disabled:text-text-muted disabled:bg-none"
        >
          {isSubmitting ? "Submitting..." : "Submit Answer"}
        </button>
      </div>
    </section>
  );
}
