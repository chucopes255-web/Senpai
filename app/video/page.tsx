"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";

function VideoContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const chapter = searchParams.get("chapter") || "General";
  
  const [loading, setLoading] = useState(true);
  const [videoData, setVideoData] = useState<any>(null);

  useEffect(() => {
    async function fetchVideo() {
      try {
        const res = await fetch(`/api/get-video?chapter=${encodeURIComponent(chapter)}`);
        const data = await res.json();
        if (data.found) {
          setVideoData(data.script);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchVideo();
  }, [chapter]);

  // Google Drive link ko preview link mein badalne ka function (Bina ads ke chalega)
  function getEmbedUrl(url: string) {
    if (!url) return "";
    // Agar link Google Drive ka hai (jaise /file/d/VIDEO_ID/view)
    const driveRegex = /\/file\/d\/([a-zA-Z0-9_-]+)/;
    const match = url.match(driveRegex);
    if (match && match[1]) {
      return `https://drive.google.com/file/d/${match[1]}/preview`;
    }
    // Agar normal YouTube link hai toh fallback
    if (url.includes("youtu.be/")) return url.replace("youtu.be/", "www.youtube.com/embed/");
    if (url.includes("watch?v=")) return url.replace("watch?v=", "www.youtube.com/embed/");
    return url;
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-xl font-bold text-purple-600">Loading Video...</div>;
  }

  if (!videoData || !videoData.video_url) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-xl font-bold text-red-500 mb-2">Video Nahi Mili!</h2>
        <p className="text-gray-500 mb-4">Is chapter ki video abhi upload nahi hui hai.</p>
        <button onClick={() => router.back()} className="bg-purple-600 text-white px-6 py-2 rounded-lg">Wapas Jayein</button>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 pb-10">
      {/* Top Bar */}
      <div className="bg-white px-4 py-3 flex items-center gap-3 shadow-sm sticky top-0 z-10">
        <button onClick={() => router.back()} className="text-2xl text-gray-600">←</button>
        <h1 className="text-lg font-bold text-gray-800 truncate">{videoData.title}</h1>
      </div>

      {/* Video Player (No Ads, Clean View) */}
      <div className="w-full aspect-video bg-black relative">
        <iframe
          src={getEmbedUrl(videoData.video_url)}
          className="w-full h-full border-none"
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>

      {/* Video Details / Notes */}
      <div className="p-4">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-2">About this lesson</h2>
          <p className="text-gray-600 text-sm mb-4">
            Ye video {videoData.title} ke baare mein hai. Video dekhne ke baad aap AI Tutor se sawal bhi puch sakte hain.
          </p>
          
          <button 
            onClick={() => router.push(`/tutor?chapter=${encodeURIComponent(chapter)}`)}
            className="w-full bg-purple-50 text-purple-700 font-bold py-3 rounded-xl border border-purple-100 flex items-center justify-center gap-2"
          >
            🎙️ Ask AI Tutor about this chapter
          </button>
        </div>
      </div>
    </main>
  );
}

export default function VideoPlayer() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <VideoContent />
    </Suspense>
  );
}
