"use client";
import { useState } from "react";

export default function AdminPanel() {
  const [chapter, setChapter] = useState("");
  const [scriptData, setScriptData] = useState<any>(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  async function generateScript() {
    if (!chapter) return;
    setLoading(true);
    setStatus("AI script bana raha hai...");

    try {
      const res = await fetch("/api/generate-script", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chapter })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      
      setScriptData(data);
      setStatus("✅ Script ready! Ab isko download karein ya video banakar link daalein.");
    } catch (error: any) {
      setStatus("❌ Error: " + error.message);
    } finally {
      setLoading(false);
    }
  }

  // Script ko TXT file ki tarah download karne ke liye
  function downloadScript() {
    if (!scriptData) return;
    const text = JSON.stringify(scriptData, null, 2);
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${chapter.replace(/\s+/g, "_")}_script.txt`;
    a.click();
  }

  // Video Link (YouTube/MP4) save karne ke liye
  async function saveVideoToDB() {
    if (!videoUrl) return alert("Video ka link daalein!");
    setLoading(true);
    setStatus("Database mein save ho raha hai...");

    try {
      const res = await fetch("/api/save-video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          chapter, 
          script: { 
            title: scriptData.title, 
            video_url: videoUrl, // YouTube link yahan save hoga
            slides: scriptData.slides 
          } 
        })
      });
      
      if (res.ok) {
        setStatus("✅ Video successfully save ho gayi!");
        setVideoUrl("");
        setScriptData(null);
        setChapter("");
      } else {
        const err = await res.json();
        throw new Error(err.error);
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
        <h1 className="text-2xl font-bold mb-4 text-center text-gray-800">👑 Admin Panel</h1>
        
        {/* Step 1: Chapter Input */}
        <input
          type="text"
          value={chapter}
          onChange={(e) => setChapter(e.target.value)}
          placeholder="Chapter name..."
          className="w-full p-3 border rounded-lg text-black mb-3"
        />
        <button
          onClick={generateScript}
          disabled={loading || !chapter}
          className="w-full bg-blue-600 text-white p-3 rounded-lg font-bold disabled:opacity-50 mb-4"
        >
          {loading ? "Wait..." : "1. Generate AI Script"}
        </button>

        {/* Step 2: Script Download & Video Link */}
        {scriptData && (
          <div className="border-t pt-4 mt-2">
            <button
              onClick={downloadScript}
              className="w-full bg-green-100 text-green-700 border border-green-300 p-3 rounded-lg font-bold mb-3"
            >
              ⬇️ Download Script (For Video Making)
            </button>
            
            <p className="text-xs text-gray-500 mb-2">
              Script download karke video banayein. Fir wo video YouTube par upload karke uska link yahan daalein:
            </p>
            <input
              type="text"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="YouTube Video Link (e.g. https://youtu.be/xyz)"
              className="w-full p-3 border rounded-lg text-black mb-3"
            />
            <button
              onClick={saveVideoToDB}
              disabled={loading || !videoUrl}
              className="w-full bg-purple-600 text-white p-3 rounded-lg font-bold disabled:opacity-50"
            >
              2. Save Video to App
            </button>
          </div>
        )}

        {status && <p className="mt-4 text-center text-sm font-semibold text-gray-700">{status}</p>}
      </div>
    </main>
  );
}
