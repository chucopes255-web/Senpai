"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  // Ye humare dummy batches hain (baad mein inhe database se laa sakte hain)
  const popularBatches = [
    { title: "Class 10 Science - Light", tag: "Physics", color: "bg-blue-100 text-blue-600" },
    { title: "The Living World", tag: "Biology", color: "bg-green-100 text-green-600" },
    { title: "Chemical Reactions", tag: "Chemistry", color: "bg-purple-100 text-purple-600" },
    { title: "Quadratic Equations", tag: "Maths", color: "bg-orange-100 text-orange-600" },
  ];

  function handleSearch() {
    if (searchQuery.trim()) {
      // Direct Tutor page par bhej do
      router.push(`/tutor?chapter=${encodeURIComponent(searchQuery)}`);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      {/* Top Header */}
      <header className="bg-white px-4 py-3 flex justify-between items-center sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <button className="text-2xl text-gray-600">☰</button>
          <div className="bg-gray-100 px-3 py-1 rounded-full text-xs font-semibold text-gray-700 flex items-center gap-1">
            🎓 Senpai AI <span className="text-gray-400">▼</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="text-xl">🔔</button>
          <div className="h-8 w-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">
            S
          </div>
        </div>
      </header>

      {/* Search Bar Section */}
      <div className="bg-white p-4 pb-6 rounded-b-3xl shadow-sm">
        <h2 className="text-lg font-bold text-gray-800 mb-3">Kya padhna hai aaj?</h2>
        <div className="flex gap-2">
          <div className="flex-1 bg-gray-100 rounded-xl flex items-center px-3 py-2 border border-gray-200">
            <span className="text-gray-400 mr-2">🔍</span>
            <input
              type="text"
              placeholder="Search for chapters..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="bg-transparent w-full outline-none text-sm text-black"
            />
          </div>
          <button 
            onClick={handleSearch}
            className="bg-purple-500 text-white px-5 py-2 rounded-xl font-semibold text-sm shadow-md"
          >
            Study
          </button>
        </div>
      </div>

      {/* Promo Banner (PW style) */}
      <div className="px-4 mt-4">
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl p-5 relative overflow-hidden flex items-center shadow-lg">
          <div className="z-10 w-2/3">
            <p className="text-white text-lg font-bold leading-tight mb-1">Learn with AI Tutor</p>
            <p className="text-gray-300 text-xs mb-3">Instant doubts solving, videos, aur notes — sab kuch ek jagah.</p>
            <button 
              onClick={() => router.push('/admin')}
              className="bg-blue-500 text-white text-xs px-4 py-2 rounded-lg font-semibold"
            >
              Create Video (Admin)
            </button>
          </div>
          <div className="absolute right-[-10px] bottom-[-10px] text-6xl opacity-30">
            🤖
          </div>
        </div>
      </div>

      {/* Filters (Dummy) */}
      <div className="flex gap-3 px-4 mt-6 overflow-x-auto pb-2 scrollbar-hide">
        <span className="bg-purple-100 text-purple-700 px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap border border-purple-200">Trending</span>
        <span className="bg-white text-gray-600 px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap border border-gray-200">JEE</span>
        <span className="bg-white text-gray-600 px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap border border-gray-200">NEET</span>
        <span className="bg-white text-gray-600 px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap border border-gray-200">Class 10</span>
      </div>

      {/* Chapters / Batches List */}
      <div className="px-4 mt-4 space-y-4">
        <h3 className="font-bold text-gray-800 text-lg">Popular Chapters</h3>
        
        {popularBatches.map((batch, i) => (
          <div key={i} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="flex justify-between items-start mb-3">
              <div>
                <span className={`text-[10px] font-bold px-2 py-1 rounded-md mb-2 inline-block ${batch.color}`}>
                  {batch.tag}
                </span>
                <h4 className="font-bold text-gray-800 text-md leading-tight">{batch.title}</h4>
              </div>
              <span className="bg-yellow-100 text-yellow-700 text-[10px] font-bold px-2 py-1 rounded">New</span>
            </div>
            
            <div className="flex gap-2 text-xs text-gray-500 mb-4">
              <span>📹 Video Lessons</span>
              <span>•</span>
              <span>🎙️ Voice Tutor</span>
            </div>

            <div className="flex gap-2">
              <button 
                onClick={() => router.push(`/video?chapter=${encodeURIComponent(batch.title)}`)}
                className="flex-1 bg-purple-50 text-purple-700 font-bold py-2 rounded-lg text-sm border border-purple-100"
              >
                Watch Video
              </button>
              <button 
                onClick={() => router.push(`/tutor?chapter=${encodeURIComponent(batch.title)}`)}
                className="flex-1 bg-purple-600 text-white font-bold py-2 rounded-lg text-sm shadow-md"
              >
                Ask Tutor
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 w-full bg-white border-t border-gray-200 flex justify-around py-3 pb-safe z-20">
        <button className="flex flex-col items-center text-purple-600">
          <span className="text-xl">🏠</span>
          <span className="text-[10px] font-bold mt-1">Home</span>
        </button>
        <button onClick={() => router.push('/search')} className="flex flex-col items-center text-gray-400">
          <span className="text-xl">🔍</span>
          <span className="text-[10px] font-medium mt-1">Search</span>
        </button>
        <button className="flex flex-col items-center text-gray-400">
          <span className="text-xl">📚</span>
          <span className="text-[10px] font-medium mt-1">Library</span>
        </button>
        <button className="flex flex-col items-center text-gray-400">
          <span className="text-xl">👤</span>
          <span className="text-[10px] font-medium mt-1">Profile</span>
        </button>
      </nav>
    </main>
  );
}
