import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AQ.Ab8RN6JWguAnPhBR5IozT_63fmiy7o34Zh_RNg7Cd4xgmv-VAQ");

export async function POST(req: Request) {
  try {
    const { chapter, message, history } = await req.json();

    // Model update kiya: gemini-2.5-flash
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: `You are a warm, patient Indian tutor teaching "${chapter}".
Speak in simple English (or Hindi if student writes Hindi).

RULES:
- Max 2 short sentences, then ASK a question and WAIT
- Right answer → "Shabash! Exactly right" → go deeper
- Wrong answer → "No worries, common mistake" → simpler example
- Never lecture more than 30 seconds without asking something
- Use real-life Indian examples (chai, cricket, mirrors)`,
    });

    const chat = model.startChat({ history: history || [] });
    const result = await chat.sendMessage(message);
    const reply = result.response.text();

    return Response.json({ reply });

  } catch (error: any) {
    console.error("GEMINI ERROR:", error);
    return Response.json({ reply: "Error: " + error.message });
  }
}
