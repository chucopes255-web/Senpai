"use client";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function VideoPlayer() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const chapter = searchParams.get("chapter") || "General";
  
  const [loading, setLoading] = useState(true);
  const [script, setScript] = useState<any>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Script fetch karo
  useEffect(() => {
    async function fetchScript() {
      try {
        const res = await fetch("/api/generate-script", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ chapter })
        });
        const data = await res.json();
        setScript(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchScript();
  }, [chapter]);

  // Jab bhi slide change ho, awaz bolo
  useEffect(() => {
    if (script && script.slides && script.slides[currentSlide]) {
      // Browser ki speech API
      const textToSpeak = script.slides[currentSlide].narration;
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      
      // Indian English voice set karo
      utterance.lang = "en-IN"; 
      utterance.rate = 0.9; // Thoda slow taaki samajh aaye
      
      // Pehle wali awaz band karo
      window.speechSynthesis.cancel(); 
      // Nayi awaz shuru karo
      window.speechSynthesis.speak(utterance);
    }
    
    // Cleanup: Agar page chhoda toh awaz band ho jaye
    return () => window.speechSynthesis.cancel();
  }, [currentSlide, script]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-xl font-bold animate-pulse text-blue-600">🎬 AI Video aur Awaz Generate Ho Rahi Hai...</div>;
  }

  if (!script || !script.slides) {
    return <div className="min-h-screen flex items-center justify-center text-red-500">Error: Video nahi ban payi.</div>;
  }

  const slide = script.slides[currentSlide];

  return (
    <main className="min-h-screen bg-black text-white p-6 flex flex-col">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-xl font-bold text-gray-300">{script.title}</h2>
        <button onClick={() => { window.speechSynthesis.cancel(); router.push("/choose"); }} className="text-sm bg-gray-800 px-4 py-2 rounded">Close ❌</button>
      </div>

      <div className="flex-1 flex flex-col justify-center items-center text-center bg-gray-900 rounded-2xl p-8 border border-gray-800">
        <h1 className="text-4xl font-bold mb-8 text-blue-400">{slide.heading}</h1>
        <ul className="text-2xl space-y-4 text-left">
          {slide.bullets.map((b: string, i: number) => (
            <li key={i} className="flex items-center gap-3">
              <span className="text-green-400">✔</span> {b}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-8 flex justify-between items-center">
        <button 
          onClick={() => setCurrentSlide(c => Math.max(0, c - 1))}
          disabled={currentSlide === 0}
          className="bg-gray-700 px-6 py-3 rounded-lg disabled:opacity-50"
        >
          ◀ Previous
        </button>
        <span className="text-gray-500 font-mono">Slide {currentSlide + 1} / {script.slides.length}</span>
        <button 
          onClick={() => {
            if (currentSlide < script.slides.length - 1) setCurrentSlide(c => c + 1);
            else {
              window.speechSynthesis.cancel();
              alert("Video khatam! Ab Tutor se doubt pucho.");
            }
          }}
          className="bg-blue-600 px-6 py-3 rounded-lg font-bold"
        >
          {currentSlide === script.slides.length - 1 ? "Finish" : "Next ▶"}
        </button>
      </div>
    </main>
  );
}
