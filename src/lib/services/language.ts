import { createServerSupabaseClient } from "../supabase/server";



export async function getLanguages() {
     const supabase = await createServerSupabaseClient()
  
  const { data, error } = await supabase
    .from("languages")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  return data;
}

export async function createLanguage(payload: {
  code: string;
  name: string;
  is_default: boolean;
  is_active: boolean;
}) {
  const supabase = await createServerSupabaseClient()
  if (payload.is_default) {

    // remove previous default
    await supabase
      .from("languages")
      .update({ is_default: false })
      .eq("is_default", true);
  }

  const { data, error } = await supabase
    .from("languages")
    .insert(payload)
    .select()
    .single();

  if (error) throw new Error(error.message);

  return data;
}