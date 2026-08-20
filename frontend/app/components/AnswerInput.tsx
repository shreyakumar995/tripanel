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
  const[isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const isEmpty=answer.trim().length===0;
  
  function startListening() {
    const SpeechRecognition=(window as any).SpeechRecognition||(window as any).webkitSpeechRecognition;
    if(!SpeechRecognition){
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    const recognition=new SpeechRecognition();
    recognition.continuous=true;
    recognition.interimResults=true;
    recognition.lang="en-US";
    let finalTranscript="";
    recognition.onresult=(event:any)=>{
      let interim="";
      for(let i=event.resultIndex;i<event.results.length;i++){
        const transcript=event.results[i][0].transcript;
        if(event.results[i].isFinal){
          finalTranscript+=transcript + " ";
        }else{
          interim+=transcript;
        }
      }
      setAnswer(finalTranscript + interim);
    };
    recognition.onend=()=>
      setIsListening(false);
    
    recognition.start();
    recognitionRef.current=recognition;
    setIsListening(true);
}
function stopListening() {
  recognitionRef.current?.stop();
  setIsListening(false);
}
    
  return (
    <section className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
      <textarea
        value={answer}
        onChange={(event) => setAnswer(event.target.value)}
        placeholder="Type your answer here,or use the mic below..."
        rows={8}
        className="w-full resize-y rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm leading-relaxed text-zinc-800 placeholder:text-zinc-400 outline-none transition-colors focus:border-zinc-400 focus:bg-white"
      />

      <p className="mt-2 text-sm text-zinc-500">
        {answer.length} {answer.length === 1 ? "character" : "characters"}
      </p>

      <div className="mt-4 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={isListening ? stopListening : startListening}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            isListening
              ? "bg-red-600 text-white hover:bg-red-700"
              : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
          }`}
        >
          {isListening ? "● Stop Recording" : "🎤 Speak Answer"}
        </button>

      
      <button
        type="button"
        disabled={isEmpty || isSubmitting}
        onClick={() => onSubmit(answer)}
        className="mt-4 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-300 disabled:text-zinc-500 disabled:hover:bg-zinc-300"
      >
        {isSubmitting ? "Submitting..." : "Submit Answer"}
      </button>
      </div>
    </section>
  );
}
