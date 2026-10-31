import { OpenAI } from "openai";

export async function POST(req: Request) {
  try {
    const groq = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || "missing_key",
      baseURL: "https://api.groq.com/openai/v1",
    });

    const { chapter } = await req.json();

    // AI ko ekdum strict instruction diya hai
    const prompt = `You are a JSON generator. Do not write any text, markdown, or explanations. 
Generate a 4-slide lesson for "${chapter}" strictly in Hinglish.
Return ONLY a JSON object. Use this exact structure:
{
  "title": "Topic name",
  "slides": [
    { "heading": "Title", "bullets": ["Point 1", "Point 2"], "narration": "2 sentences explanation" }
  ]
}`;

    const completion = await groq.chat.completions.create({
      model: "openai/gpt-oss-120b", 
      messages: [
        { role: "system", content: "You only output valid JSON. Nothing else." },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" }, 
      temperature: 0.1, // Temperature kam kar diya taaki AI boring aur strict rahe
      max_tokens: 1000,
    });

    const content = completion.choices[0]?.message?.content;
    
    if (!content) {
      throw new Error("AI ne kuch generate nahi kiya.");
    }

    // JSON parse karke return karo
    return Response.json(JSON.parse(content));

  } catch (error: any) {
    return Response.json({ error: "AI JSON Error: " + error.message }, { status: 500 });
  }
}
