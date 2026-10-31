"use client";
import { useState } from "react";

export default function Home() {
  const [messages, setMessages] = useState<{ role: string; text: string }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

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
          chapter: "Class 10 Science — Light: Reflection and Refraction",
          message: input,
          history: messages.map((m) => ({
            role: m.role === "user" ? "user" : "model",
            parts: [{ text: m.text }],
          })),
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.reply || "Server error aa gaya bhai");
      }

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
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-2xl font-bold text-black">🎓 Senpai Tutor</h1>
          <p className="text-sm text-gray-500">Class 10 Science — Light</p>
        </div>
        {/* Clear Chat Button */}
        <button 
          onClick={() => setMessages([])} 
          className="text-sm bg-red-100 text-red-600 px-3 py-1 rounded-md"
        >
          Clear Chat
        </button>
      </div>

      <div className="flex-1 space-y-3 mb-4">
        {messages.length === 0 && (
          <p className="text-gray-400">Ask me anything about Light 👇</p>
        )}
        {messages.map((m, i) => (
          <div key={i} className={m.role === "user" ? "text-right" : "text-left"}>
            <div
              className={`inline-block p-3 rounded-lg max-w-[80%] ${
                m.role === "user" ? "bg-blue-600 text-white" : "bg-white border border-gray-200 text-black shadow-sm"
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}
        {loading && <p className="text-gray-400">Tutor is thinking…</p>}
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
