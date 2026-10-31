"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SearchPage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSearch() {
    if (!query) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/get-video?chapter=${encodeURIComponent(query)}`);
      const data = await res.json();

      if (data.found) {
        router.push(`/video?chapter=${encodeURIComponent(query)}`);
      } else {
        setError("Video nahi mili. Chapter name check karein.");
      }
    } catch (err) {
      setError("Error aa gaya.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="max-w-md mx-auto p-6 min-h-screen flex flex-col justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">🔍 Search Video</h1>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          placeholder="Chapter ka naam likhein..."
          className="w-full p-3 border rounded-lg text-black mb-4"
        />
        <button onClick={handleSearch} disabled={loading} className="w-full bg-blue-600 text-white p-3 rounded-lg font-bold">
          {loading ? "Searching..." : "Search"}
        </button>
        {error && <p className="mt-4 text-center text-red-500 font-semibold">{error}</p>}
        
        <button onClick={() => router.push("/")} className="mt-6 text-sm text-gray-500 w-full text-center">← Back to Home</button>
      </div>
    </main>
  );
}
