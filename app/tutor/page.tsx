"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";

function TutorContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const chapter = searchParams.get("chapter") || "General Topic";
  
  const [messages, setMessages] = useState<{ role: string; text: string }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // Jab naya tutor ka message aaye, toh bolo
  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && lastMessage.role === "tutor" && !lastMessage.text.startsWith("⚠️")) {
      const utterance = new SpeechSynthesisUtterance(lastMessage.text);
      utterance.lang = "en-IN"; 
      utterance.rate = 0.95;
      
      window.speechSynthesis.cancel(); 
      window.speechSynthesis.speak(utterance); 
    }
  }, [messages]);

  async function send() {
    if (!input.trim()) return;
    const userMsg = { role: "user", text: input };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chapter: chapter,
          message: input,
          history: messages.map((m) => ({
            role: m.role === "user" ? "user" : "model",
            parts: [{ text: m.text }],
          })),
        }),
      });

      if (!res.ok) throw new Error("Network error");

      const data = await res.json();
      setMessages((m) => [...m, { role: "tutor", text: data.reply }]);
    } catch (err: any) {
      setMessages((m) => [...m, { role: "tutor", text: "⚠️ " + err.message }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="max-w-2xl mx-auto p-4 min-h-screen flex flex-col bg-gray-50">
      <div className="flex items-center gap-2 mb-4">
        <button onClick={() => { window.speechSynthesis.cancel(); router.push("/"); }} className="text-blue-600 font-bold">← Back</button>
        <h1 className="text-lg font-bold text-gray-800 truncate">{chapter}</h1>
      </div>

      <div className="flex-1 space-y-3 mb-4 overflow-y-auto">
        {messages.length === 0 && (
          <div className="text-center mt-10">
            <p className="text-gray-500 mb-2">Tutor ready hai! Kuch pucho 👇</p>
            <p className="text-xs text-gray-400">(Awaz mein jawab milega)</p>
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={m.role === "user" ? "text-right" : "text-left"}>
            <div
              className={`inline-block p-3 rounded-lg max-w-[85%] ${
                m.role === "user" ? "bg-blue-600 text-white" : "bg-white border border-gray-200 text-black shadow-sm"
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}
        {loading && <p className="text-gray-500 text-sm animate-pulse">Tutor is speaking...</p>}
      </div>

      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Type your doubt…"
          className="flex-1 border rounded-lg p-3 text-black shadow-sm"
        />
        <button onClick={send} className="bg-blue-600 text-white px-6 rounded-lg font-semibold shadow-sm">
          Send
        </button>
      </div>
    </main>
  );
}

export default function TutorChat() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-gray-500">Loading Tutor...</div>}>
      <TutorContent />
    </Suspense>
  );
}
