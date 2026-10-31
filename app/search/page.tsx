"use client";
import { useState } from "react";

export default function SearchVideo() {
  const [chapter, setChapter] = useState("");
  const [videoData, setVideoData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  async function searchVideo() {
    if (!chapter) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/get-video?chapter=${encodeURIComponent(chapter)}`);
      const data = await res.json();
      if (data.found) {
        setVideoData(data.script);
      } else {
        alert("Ye video abhi nahi bani hai. Admin se banwaayein.");
      }
    } catch (e) {
      alert("Error aaya");
    } finally {
      setLoading(false);
    }
  }

  if (videoData) {
    // Yahan tum apna purana VideoPlayer UI use kar sakte ho jo slides dikhata hai
    return (
      <main className="p-6 bg-black text-white min-h-screen">
        <button onClick={() => setVideoData(null)} className="mb-4 bg-gray-700 px-4 py-2 rounded">← Back</button>
        <h1 className="text-2xl font-bold text-blue-400 mb-4">{videoData.title}</h1>
        {videoData.slides.map((slide: any, i: number) => (
          <div key={i} className="mb-6 bg-gray-800 p-4 rounded">
            <h2 className="text-xl font-bold">{slide.heading}</h2>
            <ul className="list-disc ml-6 mt-2">
              {slide.bullets.map((b: string, j: number) => <li key={j}>{b}</li>)}
            </ul>
          </div>
        ))}
      </main>
    );
  }

  return (
    <main className="max-w-md mx-auto p-6 min-h-screen flex flex-col justify-center">
      <h1 className="text-2xl font-bold mb-4 text-center">🔍 Search Video</h1>
      <input
        type="text"
        value={chapter}
        onChange={(e) => setChapter(e.target.value)}
        placeholder="Chapter name likhein..."
        className="w-full p-3 border rounded-lg text-black mb-4"
      />
      <button onClick={searchVideo} disabled={loading} className="w-full bg-green-600 text-white p-3 rounded-lg font-bold">
        {loading ? "Searching..." : "Search"}
      </button>
    </main>
  );
}
