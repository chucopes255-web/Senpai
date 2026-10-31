import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://drgssikvsbhsfowjxhax.supabase.co",
  "sb_publishable_pIKEgDgPM3mzJhWL5ZCGUg_z3h1GBZp" 
);

export async function POST(req: Request) {
  try {
    const { chapter, script } = await req.json();

    const { data, error } = await supabase
      .from("chapters")
      .insert([
        { 
          title: chapter, 
          exam: "CBSE", 
          class: 10, 
          subject: "Science", 
          chapter_no: 1,
          script_json: script // Poora script yahan save hoga
        }
      ]);

    if (error) throw error;
    return Response.json({ success: true, data });

  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
