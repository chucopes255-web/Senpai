"use client";
import { useState } from "react";

export default function AdminPanel() {
  const [chapter, setChapter] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  async function saveVideo() {
    if (!chapter || !videoUrl) return alert("Chapter name aur Video link dono daalein!");
    
    setLoading(true);
    setStatus("Database mein save ho raha hai...");

    try {
      const res = await fetch("/api/save-video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          chapter, 
          // Hum script ki jagah ek dummy object bhej rahe hain jisme video_url hai
          script: { 
            title: chapter, 
            video_url: videoUrl, 
            slides: [] 
          } 
        })
      });
      
      if (res.ok) {
        setStatus("✅ Video successfully save ho gayi!");
        setVideoUrl("");
        setChapter("");
      } else {
        const err = await res.json();
        throw new Error(err.error || "Save fail ho gaya");
      }
    } catch (error: any) {
      setStatus("❌ Error: " + error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="max-w-md mx-auto p-6 min-h-screen flex flex-col justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">👑 Admin Video Upload</h1>
        
        <div className="mb-4">
          <label className="block text-sm font-bold text-gray-700 mb-1">Chapter Name</label>
          <input
            type="text"
            value={chapter}
            onChange={(e) => setChapter(e.target.value)}
            placeholder="e.g. The Living World"
            className="w-full p-3 border rounded-lg text-black"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-bold text-gray-700 mb-1">Video Link (Drive/YouTube)</label>
          <input
            type="text"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            placeholder="https://drive.google.com/..."
            className="w-full p-3 border rounded-lg text-black"
          />
        </div>

        <button
          onClick={saveVideo}
          disabled={loading || !chapter || !videoUrl}
          className="w-full bg-purple-600 text-white p-3 rounded-lg font-bold disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save Video to App"}
        </button>

        {status && <p className="mt-4 text-center text-sm font-semibold text-green-600 bg-green-50 p-2 rounded">{status}</p>}
      </div>
    </main>
  );
}
