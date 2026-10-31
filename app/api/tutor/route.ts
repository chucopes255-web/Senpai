import { GoogleGenAI } from "@google/genai";

// Ab key code mein nahi, Vercel ke Environment Variable se aayegi
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: Request) {
  try {
    const { chapter, message, history } = await req.json();

    const systemInstruction = `You are a warm, patient Indian tutor teaching "${chapter}".
Speak in simple English (or Hindi if student writes Hindi).

RULES:
- Max 2 short sentences, then ASK a question and WAIT
- Right answer → "Shabash! Exactly right" → go deeper
- Wrong answer → "No worries, common mistake" → simpler example
- Use real-life Indian examples (chai, cricket, mirrors)`;

    const contents = [
      ...(history || []).map((h: any) => ({
        role: h.role === "user" ? "user" : "model",
        parts: [{ text: h.parts[0].text }],
      })),
      { role: "user", parts: [{ text: message }] },
    ];

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: contents,
      config: { systemInstruction: systemInstruction },
    });

    return Response.json({ reply: response.text });

  } catch (error: any) {
    console.error("GEMINI ERROR:", error);
    return Response.json({ reply: "Error: " + error.message });
  }
}
