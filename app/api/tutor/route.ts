import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: Request) {
  try {
    const { chapter, message, history } = await req.json();

    const systemInstruction = `You are a warm, patient Indian tutor teaching "${chapter}".
Speak in simple English (or Hindi if student writes Hindi).
- Max 2 short sentences, then ASK a question and WAIT
- Right answer → "Shabash! Exactly right" → go deeper
- Wrong answer → "No worries, common mistake" → simpler example
- Use real-life Indian examples (chai, cricket, mirrors)`;

    const formattedHistory = (history || []).map((h: any) => ({
      type: h.role === "user" ? "user_input" : "model_output",
      content: [{ type: "text", text: h.parts[0].text }]
    }));

    formattedHistory.push({
      type: "user_input",
      content: [{ type: "text", text: message }]
    });

    // Yahan underscore (_) laga diya hai
    const interaction = await ai.interactions.create({
      model: "gemini-3.8-flash",
      input: formattedHistory,
      system_instruction: systemInstruction, 
    });

    return Response.json({ reply: interaction.output_text });

  } catch (error: any) {
    console.error("GEMINI ERROR:", error);
    return Response.json({ reply: "Error: " + error.message });
  }
}
