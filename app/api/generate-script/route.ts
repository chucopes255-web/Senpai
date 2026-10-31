import { OpenAI } from "openai";

export async function POST(req: Request) {
  try {
    const groq = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || "missing_key",
      baseURL: "https://api.groq.com/openai/v1",
    });

    const { chapter } = await req.json();

    const prompt = `Generate a lesson for "${chapter}". 
IMPORTANT: All text (title, heading, bullets, narration) MUST be strictly in Hinglish (Hindi + English mixed, written in English script). For example: "Aao aaj Light ka reflection samajhte hain".
Return ONLY a valid JSON object. Do not add any markdown or extra text outside the JSON.
Use this exact structure:
{
  "title": "Topic name in Hinglish",
  "slides": [
    { 
      "heading": "Slide title in Hinglish", 
      "bullets": ["Point 1 in Hinglish", "Point 2 in Hinglish"], 
      "narration": "A 2-sentence explanation in Hinglish like a friendly teacher" 
    }
  ]
}
Create exactly 4 slides. Max 3 bullets per slide.`;

    const completion = await groq.chat.completions.create({
      model: "openai/gpt-oss-120b", // Naya aur fast Groq model
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" }, // Force JSON output
      max_tokens: 1500,
    });

    const content = completion.choices[0]?.message?.content;
    
    if (!content) {
      throw new Error("AI ne kuch generate nahi kiya.");
    }

    // JSON parse karke return karo
    return Response.json(JSON.parse(content));

  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
