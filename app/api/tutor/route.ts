import { GoogleGenAI } from "@google/genai";

export async function POST(req: Request) {
  try {
    // Key ab Vercel se aayegi, code mein nahi likhi hai
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return Response.json({ reply: "SERVER_ERROR: API Key Vercel mein set nahi hai." });
    }

    const ai = new GoogleGenAI({ apiKey: apiKey });
    const { chapter, message, history } = await req.json();

    const formattedHistory = (history || []).map((h: any) => ({
      type: h.role === "user" ? "user_input" : "model_output",
      content: [{ type: "text", text: h.parts[0].text }]
    }));

    formattedHistory.push({
      type: "user_input",
      content: [{ type: "text", text: message }]
    });

    // Naya aur stable model
    const interaction = await ai.interactions.create({
      model: "gemini-3.8-flash",
      input: formattedHistory,
      system_instruction: "You are a warm Indian tutor. Max 2 sentences, ask a question and wait.",
    });

    return Response.json({ reply: interaction.output_text });

  } catch (error: any) {
    return Response.json({ reply: "SERVER_ERROR: " + error.message });
  }
}
