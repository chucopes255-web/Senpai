import { GoogleGenerativeAI } from "@google/generative-ai";

// Key ko seedha yahan daalo, bina tode
const genAI = new GoogleGenerativeAI("AQ.Ab8RN6JeRXatOwWxqrGB3MtzjLuy0dPrfPpxgGy4lOvhbw1dKQ");

export async function POST(req: Request) {
  try { // <-- ERROR PAKADNE KE LIYE TRY-CATCH LAGAYA HAI
    const { chapter, message, history } = await req.json();

    const model = genAI.getGenerativeModel({
      model: "gemini-1.0-pro", // <-- MODEL CHANGE KIYA HAI
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
    // Agar error aaye toh frontend ko batao
    return Response.json({ reply: "Bhai, AI se connect nahi ho pa raha. Check Vercel logs!" });
  }
}
