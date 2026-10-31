import { OpenAI } from "openai";

export async function POST(req: Request) {
  try {
    // Groq ke liye API key Vercel se aa rahi hai
    const groq = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || "missing_key",
      baseURL: "https://api.groq.com/openai/v1",
    });

    const { chapter, message, history } = await req.json();

    const systemInstruction = `You are a warm, patient Indian tutor teaching "${chapter}".
Speak in simple English (or Hindi if student writes Hindi).
- Max 2 short sentences, then ASK a question and WAIT
- Right answer → "Shabash! Exactly right" → go deeper
- Wrong answer → "No worries, common mistake" → simpler example
- Use real-life Indian examples (chai, cricket, mirrors)`;

    // History ko format karna
    const messages = [
      { role: "system", content: systemInstruction },
      ...(history || []).map((h: any) => ({
        role: h.role === "user" ? "user" : "assistant",
        content: h.parts[0].text,
      })),
      { role: "user", content: message },
    ];

    const completion = await groq.chat.completions.create({
      model: "openai/gpt-oss-120b", // Naya aur fast model
      messages: messages,
      max_tokens: 250,
    });

    const reply = completion.choices[0]?.message?.content || "Sorry, try again.";

    return Response.json({ reply });

  } catch (error: any) {
    return Response.json({ reply: "SERVER_ERROR: " + error.message });
  }
}
