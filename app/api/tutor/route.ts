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

    let replyText = "";

    // Fallback System: Pehle naya model try karega, fail hone par stable model
    try {
      const interaction = await ai.interactions.create({
        model: "gemini-3.8-flash", 
        input: formattedHistory,
        system_instruction: systemInstruction,
      });
      replyText = interaction.output_text || "";
    } catch (error: any) {
      console.log("3.8-flash fail hua, ab dusre model se try kar rahe hain...");
      
      // Agar 3.8 fail ho jaye, toh 2.5 use karo (jo zyada stable hai)
      const fallbackInteraction = await ai.interactions.create({
        model: "gemini-2.5-flash",
        input: formattedHistory,
        system_instruction: systemInstruction,
      });
      replyText = fallbackInteraction.output_text || "";
    }

    return Response.json({ reply: replyText || "Sorry, AI is busy. Please try again." });

  } catch (error: any) {
    console.error("GEMINI ERROR:", error);
    return Response.json({ reply: "Error: " + error.message });
  }
}
