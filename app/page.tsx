"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  
  // Admin Login ke liye states
  const [clickCount, setClickCount] = useState(0);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [phone, setPhone] = useState("");
  const ADMIN_PHONE = "9811403424";

  const categories = [
    { name: "Physics", icon: "⚛️", color: "bg-blue-100 text-blue-600" },
    { name: "Chemistry", icon: "🧪", color: "bg-green-100 text-green-600" },
    { name: "Biology", icon: "🧬", color: "bg-pink-100 text-pink-600" },
    { name: "Maths", icon: "📐", color: "bg-orange-100 text-orange-600" },
  ];

  // Secret Admin Login Logic (Profile pe 3 baar click karo)
  function handleProfileClick() {
    setClickCount(prev => prev + 1);
    if (clickCount >= 2) { // 3rd click par open hoga
      setShowAdminLogin(true);
      setClickCount(0);
    }
  }

  function loginAdmin() {
    if (phone === ADMIN_PHONE) {
      router.push("/admin");
    } else {
      alert("Galat Number! Aap Admin nahi hain.");
    }
  }

  return (
    <main className="min-h-screen bg-[#F8F9FB] pb-24 font-sans relative">
      
      {/* 1. HEADER & SEARCH */}
      <div className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-b-[2.5rem] px-5 pt-12 pb-8 shadow-xl relative overflow-hidden">
        <div className="flex justify-between items-center mb-6">
          <div>
            <p className="text-purple-200 text-xs font-semibold">Welcome back 👋</p>
            <h1 className="text-white font-bold text-2xl">Senpai Learner</h1>
          </div>
          <button onClick={handleProfileClick} className="h-10 w-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/30">
            👤
          </button>
        </div>

        <div className="bg-white rounded-2xl flex items-center px-4 py-3 shadow-lg">
          <span className="text-gray-400 mr-2">🔍</span>
          <input
            type="text"
            placeholder="Search chapter..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && searchQuery && router.push(`/tutor?chapter=${encodeURIComponent(searchQuery)}`)}
            className="bg-transparent w-full outline-none text-sm text-gray-800"
          />
        </div>
      </div>

      {/* 2. CATEGORIES */}
      <div className="px-5 mt-6">
        <h3 className="font-bold text-gray-800 text-lg mb-4">Explore Subjects</h3>
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((cat, i) => (
            <div key={i} className="flex flex-col items-center gap-2 min-w-[70px]">
              <div className={`w-16 h-16 rounded-2xl ${cat.color} flex items-center justify-center text-3xl shadow-sm border border-white`}>
                {cat.icon}
              </div>
              <span className="text-xs font-semibold text-gray-600">{cat.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 3. PREMIUM BANNER (Image ke saath) */}
      <div className="px-5 mt-6">
        <div className="bg-gray-900 rounded-3xl p-6 relative overflow-hidden shadow-xl flex items-center">
          <div className="z-10 w-2/3">
            <span className="bg-yellow-400 text-yellow-900 text-[10px] font-extrabold px-2 py-1 rounded-md mb-2 inline-block uppercase">
              AI Powered
            </span>
            <h4 className="text-white text-xl font-bold leading-tight mb-1">Learn faster with AI Tutor</h4>
            <p className="text-gray-400 text-xs mb-4">Clear your doubts instantly with voice.</p>
            <button 
              onClick={() => router.push('/tutor?chapter=General')}
              className="bg-white text-gray-900 text-xs px-5 py-2.5 rounded-xl font-bold"
            >
              Start Learning
            </button>
          </div>
          {/* Student Image */}
          <img 
            src="https://img.freepik.com/free-photo/happy-young-female-student-holding-notebooks-from-courses-smiling-camera-standing-spring-clothes-against-blue-background_1258-70161.jpg" 
            alt="Student" 
            className="absolute right-[-10px] bottom-0 h-40 object-cover rounded-tl-full opacity-80"
          />
        </div>
      </div>

      {/* 4. POPULAR COURSES (With Images) */}
      <div className="px-5 mt-8">
        <h3 className="font-bold text-gray-800 text-lg mb-4">Popular Batches</h3>
        <div className="space-y-4">
          
          {/* Card 1 */}
          <div className="bg-white rounded-2xl p-3 shadow-sm border border-gray-100 flex gap-4">
            <img src="https://img.freepik.com/free-photo/physic-formulas-blackboard_23-2148105751.jpg" className="w-24 h-24 rounded-xl object-cover" alt="Physics" />
            <div className="flex flex-col justify-center flex-1">
              <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded w-max mb-1">PHYSICS</span>
              <h4 className="font-bold text-gray-800 text-sm">Light - Reflection & Refraction</h4>
              <button onClick={() => router.push('/video?chapter=Light')} className="mt-2 text-purple-600 text-xs font-bold text-left">▶ Watch Video</button>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-2xl p-3 shadow-sm border border-gray-100 flex gap-4">
            <img src="https://img.freepik.com/free-photo/dna-molecule-background_1150-19746.jpg" className="w-24 h-24 rounded-xl object-cover" alt="Biology" />
            <div className="flex flex-col justify-center flex-1">
              <span className="text-[10px] font-bold text-pink-600 bg-pink-50 px-2 py-0.5 rounded w-max mb-1">BIOLOGY</span>
              <h4 className="font-bold text-gray-800 text-sm">The Living World</h4>
              <button onClick={() => router.push('/video?chapter=Living World')} className="mt-2 text-purple-600 text-xs font-bold text-left">▶ Watch Video</button>
            </div>
          </div>

        </div>
      </div>

      {/* SECRET ADMIN LOGIN MODAL */}
      {showAdminLogin && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">👑 Admin Login</h2>
            <input 
              type="text" 
              placeholder="Enter Admin Phone Number" 
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full border border-gray-300 p-3 rounded-lg mb-4 text-black"
            />
            <div className="flex gap-2">
              <button onClick={() => setShowAdminLogin(false)} className="flex-1 bg-gray-100 text-gray-700 font-bold py-3 rounded-lg">Cancel</button>
              <button onClick={loginAdmin} className="flex-1 bg-purple-600 text-white font-bold py-3 rounded-lg">Login</button>
            </div>
          </div>
        </div>
      )}

      {/* BOTTOM NAV */}
      <nav className="fixed bottom-0 w-full bg-white border-t border-gray-100 flex justify-around py-3 pb-safe z-40">
        <button className="text-purple-600 flex flex-col items-center"><span className="text-xl">🏠</span><span className="text-[10px] font-bold mt-1">Home</span></button>
        <button onClick={() => router.push('/search')} className="text-gray-400 flex flex-col items-center"><span className="text-xl">🔍</span><span className="text-[10px] font-medium mt-1">Search</span></button>
        <button className="text-gray-400 flex flex-col items-center"><span className="text-xl">📚</span><span className="text-[10px] font-medium mt-1">Library</span></button>
      </nav>
    </main>
  );
}
