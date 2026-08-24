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
    <div className="landing-card p-4 sm:p-5">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm font-medium text-[#172018]">Camera</span>
        <button
          type="button"
          onClick={isOn ? stopCamera : startCamera}
          className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
            isOn
              ? "bg-[#B84A5A] text-white hover:bg-[#B84A5A]/90"
              : "landing-btn-primary py-1.5"
          }`}
        >
          {isOn ? "Turn Off" : "Turn On"}
        </button>
      </div>

      {error && <p className="mb-2 text-xs text-[#B84A5A]">{error}</p>}

      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        className={`aspect-video w-full rounded-xl border border-[#DCE4D8] bg-[#F1F7ED] object-cover ${isOn ? "" : "hidden"}`}
      />

      {!isOn && (
        <div className="flex aspect-video w-full items-center justify-center rounded-xl border border-dashed border-[#DCE4D8] bg-[#F8FAF5] text-sm text-[#667066]">
          Camera off — turn on to simulate a video interview
        </div>
      )}
    </div>
  );
}
