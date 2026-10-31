import { GoogleGenAI } from "@google/genai";

// Naya SDK aur Nayi Key
const ai = new GoogleGenAI({ apiKey: "AQ.Ab8RN6JWguAnPhBR5IozT_63fmiy7o34Zh_RNg7Cd4xgmv-VAQ" });

export async function POST(req: Request) {
  try {
    const { chapter, message, history } = await req.json();

    const systemInstruction = `You are a warm, patient Indian tutor teaching "${chapter}".
Speak in simple English (or Hindi if student writes Hindi).

RULES:
- Max 2 short sentences, then ASK a question and WAIT
- Right answer → "Shabash! Exactly right" → go deeper
- Wrong answer → "No worries, common mistake" → simpler example
- Never lecture more than 30 seconds without asking something
- Use real-life Indian examples (chai, cricket, mirrors)`;

    // History ko naye format mein convert karna
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
      config: {
        systemInstruction: systemInstruction,
      },
    });

    return Response.json({ reply: response.text });

  } catch (error: any) {
    console.error("GEMINI ERROR:", error);
    return Response.json({ reply: "Error: " + error.message });
  }
}
