"use client";
import { useRef,useState,useEffect } from "react";
export default function WebcamPreview() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const[error,setError] = useState("");
    const[isOn,setIsOn] = useState(false);
    const streamRef = useRef<MediaStream | null>(null);

    async function startCamera() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            streamRef.current = stream;
            if(videoRef.current){
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
        return () => stopCamera(); // cleanup: stop camera if component unmounts
      }, []);
    
      return (
        <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-zinc-700">Camera</span>
            <button
              type="button"
              onClick={isOn ? stopCamera : startCamera}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                isOn ? "bg-red-600 text-white hover:bg-red-700" : "bg-zinc-900 text-white hover:bg-zinc-800"
              }`}
            >
              {isOn ? "Turn Off" : "Turn On"}
            </button>
          </div>
    
          {error && <p className="text-xs text-red-600 mb-2">{error}</p>}
    
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className={`w-full rounded-lg bg-zinc-900 aspect-video ${isOn ? "" : "hidden"}`}
          />
    
          {!isOn && (
            <div className="w-full aspect-video rounded-lg bg-zinc-100 flex items-center justify-center text-sm text-zinc-400">
              Camera off
            </div>
          )}
        </div>
      );
    } 