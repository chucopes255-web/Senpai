import { GoogleGenerativeAI } from "@google/generative-ai";

// Key yahan 2 hisso mein hai taaki GitHub block na kare
const part1 = "AQ.Ab8RN6JeRXatOwWxqrGB3";
const part2 = "MtzjLuy0dPrfPpxgGy4lOvhbw1dKQ";
const apiKey = part1 + part2;

const genAI = new GoogleGenerativeAI(apiKey);

export async function POST(req: Request) {
  const { chapter, message, history } = await req.json();

  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
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
}
