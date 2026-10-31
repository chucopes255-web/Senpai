import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://drgssikvsbhsfowjxhax.supabase.co",
  "sb_publishable_pIKEgDgPM3mzJhWL5ZCGUg_z3h1GBZp" 
);

export async function POST(req: Request) {
  try {
    const { chapter, script } = await req.json();

    // Agar video already bani hui hai, toh hum seedha save karenge
    const { data, error } = await supabase
      .from("chapters")
      .insert([
        { 
          title: chapter, 
          exam: "CBSE", 
          class: 10, 
          subject: "Science", 
          chapter_no: 1,
          script_json: script // Isme ab video_url hoga
        }
      ]);

    if (error) throw error;
    
    return Response.json({ success: true, data });

  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
