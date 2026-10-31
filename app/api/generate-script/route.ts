import { OpenAI } from "openai";

export async function POST(req: Request) {
  try {
    const groq = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || "missing_key",
      baseURL: "https://api.groq.com/openai/v1",
    });

    const { chapter } = await req.json();

    const prompt = `Generate a lesson for "${chapter}". Return ONLY valid JSON format. Do not add any extra text outside the JSON.
{
  "title": "string (topic name)",
  "slides": [
    { 
      "heading": "string (short title)", 
      "bullets": ["string (point 1)", "string (point 2)"], 
      "narration": "string (2 sentences explaining this slide like a teacher)" 
    }
  ]
}
Create exactly 4 slides. Max 3 bullets per slide. Keep language simple and easy to understand.`;

    const completion = await groq.chat.completions.create({
      model: "openai/gpt-oss-120b", // Naya model
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" }, // Force JSON output
      max_tokens: 1000,
    });

    const content = completion.choices[0]?.message?.content;
    
    if (!content) {
      throw new Error("AI ne kuch generate nahi kiya.");
    }

    return Response.json(JSON.parse(content));

  } catch (error: any) {
    return Response.json({ error: error.message });
  }
}
