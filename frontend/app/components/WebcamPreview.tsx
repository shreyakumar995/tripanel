"use client";

import { useEffect, useRef, useState } from "react";

export default function WebcamPreview() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState("");
  const [isOn, setIsOn] = useState(false);
  const streamRef = useRef<MediaStream | null>(null);

  async function startCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsOn(true);
      setError("");
    } catch {
      setError("Failed to access webcam. Please check your browser permissions.");
    }
  }

  function stopCamera() {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    setIsOn(false);
  }

  useEffect(() => {
    return () => stopCamera();
  }, []);

  return (
    <div className="rounded-xl border border-border-subtle bg-surface p-4 sm:p-5">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm font-medium text-ivory">Camera</span>
        <button
          type="button"
          onClick={isOn ? stopCamera : startCamera}
          className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
            isOn
              ? "bg-status-red text-white hover:bg-status-red/90"
              : "bg-accent text-background hover:bg-accent-dim"
          }`}
        >
          {isOn ? "Turn Off" : "Turn On"}
        </button>
      </div>

      {error && <p className="mb-2 text-xs text-status-red">{error}</p>}

      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        className={`aspect-video w-full rounded-lg bg-background ${isOn ? "" : "hidden"}`}
      />

      {!isOn && (
        <div className="flex aspect-video w-full items-center justify-center rounded-lg bg-background text-sm text-text-muted">
          Camera off
        </div>
      )}
    </div>
  );
}
