"use client";
import { useState } from "react";

export default function AdminPanel() {
  const [chapter, setChapter] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  async function generateVideo() {
    if (!chapter) return;
    setLoading(true);
    setStatus("AI script bana raha hai...");

    try {
      // 1. Script generate karo
      const res = await fetch("/api/generate-script", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chapter })
      });
      const scriptData = await res.json();

      setStatus("Supabase mein save kar raha hai...");

      // 2. Supabase mein save karo
      const supabaseRes = await fetch("/api/save-video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chapter, script: scriptData })
      });

      if (supabaseRes.ok) {
        setStatus("✅ Video successfully save ho gayi!");
      } else {
        setStatus("❌ Save karne mein error aaya.");
      }
    } catch (error) {
      setStatus("❌ Error: " + error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="max-w-md mx-auto p-6 min-h-screen flex flex-col justify-center bg-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">👑 Admin Panel</h1>
      <p className="text-center text-gray-500 mb-6">Yahan se video banakar library mein save karein</p>

      <input
        type="text"
        value={chapter}
        onChange={(e) => setChapter(e.target.value)}
        placeholder="Chapter ka naam likhein..."
        className="w-full p-3 border rounded-lg text-black mb-4"
      />

      <button
        onClick={generateVideo}
        disabled={loading}
        className="w-full bg-purple-600 text-white p-3 rounded-lg font-bold disabled:opacity-50"
      >
        {loading ? "Generating..." : "🎬 Generate & Save Video"}
      </button>

      {status && <p className="mt-4 text-center font-semibold text-gray-700">{status}</p>}
    </main>
  );
}
