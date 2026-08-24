"use client";

import { useRef, useState } from "react";

type AnswerInputProps = {
  isSubmitting?: boolean;
  onSubmit: (answer: string) => void;
};

export default function AnswerInput({ isSubmitting = false, onSubmit }: AnswerInputProps) {
  const [phase, setPhase] = useState<"idle" | "recording" | "review">("idle");
  const [transcript, setTranscript] = useState("");
  const [audioLevel, setAudioLevel] = useState(0);
  const [cameraError, setCameraError] = useState("");

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const recognitionRef = useRef<any>(null);

  async function startAnswering() {
    setCameraError("");
    setTranscript("");

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch {
      setCameraError("Camera/mic access denied.");
      return;
    }

    // Audio visualizer
    const audioContext = new AudioContext();
    audioContextRef.current = audioContext;
    const analyser = audioContext.createAnalyser();
    const source = audioContext.createMediaStreamSource(streamRef.current);
    source.connect(analyser);
    analyser.fftSize = 256;
    const dataArray = new Uint8Array(analyser.frequencyBinCount);

    function updateLevel() {
      analyser.getByteFrequencyData(dataArray);
      const avg = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
      setAudioLevel(avg);
      animationFrameRef.current = requestAnimationFrame(updateLevel);
    }
    updateLevel();

    // Speech recognition
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setCameraError("Voice input isn't supported in this browser — try Chrome or Edge.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-IN";

    let finalTranscript = "";
    recognition.onresult = (event: any) => {
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const t = event.results[i][0].transcript;
        if (event.results[i].isFinal) finalTranscript += t + " ";
        else interim += t;
      }
      setTranscript(finalTranscript + interim);
    };

    recognition.start();
    recognitionRef.current = recognition;
    setPhase("recording");
  }

  function stopAnswering() {
    recognitionRef.current?.stop();
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    audioContextRef.current?.close();
    streamRef.current?.getTracks().forEach((t) => t.stop());
    setPhase("review");
  }

  function reRecord() {
    setPhase("idle");
    setTranscript("");
  }

  return (
    <section className="rounded-xl border border-zinc-200 bg-[#1B1E29] p-8 flex flex-col items-center text-center">
      {phase === "idle" && (
        <button
          onClick={startAnswering}
          className="rounded-lg bg-[#E8590C] px-6 py-3 text-sm font-medium text-white hover:opacity-90"
        >
          🎤 Start Answering
        </button>
      )}

      {cameraError && <p className="mt-3 text-sm text-red-400">{cameraError}</p>}

      {phase !== "idle" && (
        <div className="w-full flex flex-col items-center">
          <video ref={videoRef} autoPlay muted playsInline className="w-48 rounded-lg mb-6 bg-black" />

          {phase === "recording" && (
            <>
              <div className="flex items-end gap-2 h-16 mb-4">
                {[...Array(7)].map((_, i) => (
                  <div
                    key={i}
                    className="w-2 bg-[#E8590C] rounded-full transition-all"
                    style={{ height: `${Math.max(6, Math.min(64, (audioLevel / 255) * 64 * (1 + Math.abs(3 - i) * 0.15)))}px` }}
                  />
                ))}
              </div>
              <p className="text-sm text-[#8B8FA3] mb-4 min-h-[2rem] max-w-md">{transcript || "Listening..."}</p>
              <button onClick={stopAnswering} className="rounded-lg bg-red-600 px-5 py-2 text-sm text-white hover:bg-red-700">
                ● Done Answering
              </button>
            </>
          )}

          {phase === "review" && (
            <>
              <p className="text-sm text-[#EDEDF2] mb-4 max-w-md">{transcript || "(No speech detected)"}</p>
              <div className="flex gap-3">
                <button onClick={reRecord} className="rounded-lg bg-zinc-700 px-4 py-2 text-sm text-white hover:bg-zinc-600">
                  Re-record
                </button>
                <button
                  disabled={!transcript.trim() || isSubmitting}
                  onClick={() => onSubmit(transcript)}
                  className="rounded-lg bg-[#E8590C] px-5 py-2 text-sm font-medium text-white disabled:bg-zinc-600"
                >
                  {isSubmitting ? "Submitting..." : "Submit Answer"}
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </section>
  );
}