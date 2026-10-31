"use client";
import { useState } from "react";

export default function AdminPanel() {
  const [chapter, setChapter] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  async function generateVideo() {
    if (!chapter) return;
    setLoading(true);
    setStatus("AI script bana raha hai (Hinglish mein)...");

    try {
      // 1. AI se script mangwao
      const res = await fetch("/api/generate-script", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chapter })
      });
      const scriptData = await res.json();

      setStatus("Supabase database mein save kar raha hai...");

      // 2. Database mein save karo
      const saveRes = await fetch("/api/save-video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chapter, script: scriptData })
      });

      if (saveRes.ok) {
        setStatus("✅ Video successfully save ho gayi! Ab students ise search kar sakte hain.");
        setChapter(""); // Clear input
      } else {
        setStatus("❌ Save karne mein error aaya.");
      }
    } catch (error: any) {
      setStatus("❌ Error: " + error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="max-w-md mx-auto p-6 min-h-screen flex flex-col justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold mb-2 text-center text-gray-800">👑 Admin Panel</h1>
        <p className="text-center text-gray-500 mb-6 text-sm">Yahan se nayi video banayein</p>

        <input
          type="text"
          value={chapter}
          onChange={(e) => setChapter(e.target.value)}
          placeholder="Chapter ka naam likhein (e.g. The Living World)"
          className="w-full p-3 border border-gray-300 rounded-lg text-black mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />

        <button
          onClick={generateVideo}
          disabled={loading}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-lg font-bold disabled:opacity-50 transition-all"
        >
          {loading ? "Generating..." : "🎬 Generate & Save Video"}
        </button>

        {status && (
          <p className="mt-4 text-center font-semibold text-gray-700 bg-gray-50 p-3 rounded">
            {status}
          </p>
        )}
      </div>
    </main>
  );
}
