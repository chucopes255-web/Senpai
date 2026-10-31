import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://drgssikvsbhsfowjxhax.supabase.co",
  "sb_publishable_pIKEgDgPM3mzJhWL5ZCGUg_z3h1GBZp"
);

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const chapter = searchParams.get("chapter");

  const { data, error } = await supabase
    .from("chapters")
    .select("*")
    .ilike("title", `%${chapter}%`)
    .limit(1)
    .single();

  if (error || !data) {
    return Response.json({ found: false });
  }

  return Response.json({ found: true, script: data.script_json });
}
