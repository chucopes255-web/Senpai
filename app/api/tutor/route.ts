import { OpenAI } from "openai";

// Groq OpenAI-compatible API use karta hai
const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

export async function POST(req: Request) {
  try {
    const { chapter, message, history } = await req.json();

    const systemInstruction = `You are a warm, patient Indian tutor teaching "${chapter}".
Speak in simple English (or Hindi if student writes Hindi).
- Max 2 short sentences, then ASK a question and WAIT
- Right answer → "Shabash! Exactly right" → go deeper
- Wrong answer → "No worries, common mistake" → simpler example
- Use real-life Indian examples (chai, cricket, mirrors)`;

    // Purani history ko OpenAI format mein convert karna
    const messages = [
      { role: "system", content: systemInstruction },
      ...(history || []).map((h: any) => ({
        role: h.role === "user" ? "user" : "assistant",
        content: h.parts[0].text,
      })),
      { role: "user", content: message },
    ];

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile", // Groq ka fast free model
      messages: messages,
      max_tokens: 200,
    });

    const reply = completion.choices[0]?.message?.content || "Sorry, try again.";

    return Response.json({ reply });

  } catch (error: any) {
    return Response.json({ reply: "SERVER_ERROR: " + error.message });
  }
}
