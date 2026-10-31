"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const router = useRouter();
  // Default chapter (tum ise change kar sakte ho)
  const [chapter, setChapter] = useState("The Living World (Biology)");

  return (
    <main className="max-w-md mx-auto p-6 min-h-screen flex flex-col justify-center bg-gray-50">
      <h1 className="text-3xl font-bold text-center mb-2 text-gray-800">📚 Senpai AI</h1>
      <p className="text-center text-gray-500 mb-8">Tumhara AI Teacher</p>

      <div className="mb-8">
        <label className="block text-sm font-medium text-gray-700 mb-2">Konsa chapter padhna hai?</label>
        <input
          type="text"
          value={chapter}
          onChange={(e) => setChapter(e.target.value)}
          className="w-full p-3 border rounded-lg text-black bg-white shadow-sm"
          placeholder="Chapter ka naam likho..."
        />
      </div>

      <div className="space-y-4">
        {/* VIDEO OPTION */}
        <button
          onClick={() => router.push(`/video?chapter=${encodeURIComponent(chapter)}`)}
          className="w-full bg-white p-4 rounded-xl shadow border-2 border-transparent hover:border-blue-500 flex items-center gap-4 transition-all text-left"
        >
          <div className="text-4xl">🎬</div>
          <div>
            <h3 className="font-bold text-gray-800 text-lg">Watch Video</h3>
            <p className="text-sm text-gray-500">AI 10 second mein video banayega</p>
          </div>
        </button>

        {/* TUTOR OPTION */}
        <button
          onClick={() => router.push(`/tutor?chapter=${encodeURIComponent(chapter)}`)}
          className="w-full bg-white p-4 rounded-xl shadow border-2 border-transparent hover:border-green-500 flex items-center gap-4 transition-all text-left"
        >
          <div className="text-4xl">🎙️</div>
          <div>
            <h3 className="font-bold text-gray-800 text-lg">Explain like a Tutor</h3>
            <p className="text-sm text-gray-500">AI se baat karo step-by-step</p>
          </div>
        </button>
      </div>
    </main>
  );
}
