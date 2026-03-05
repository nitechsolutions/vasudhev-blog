
import { createServerSupabaseClient } from "../supabase/server";


export async function getDefaultLanguage(): Promise<string> {
  const supabase = await createServerSupabaseClient()
  const { data, error } = await supabase
    .from("languages")
    .select("code")
    .eq("is_default", true)
    .single();

    console.log(data);
    

  if (error) {
    console.error("Default language fetch error:", error);
  }

  return data?.code || "hi"; // fallback safety
}