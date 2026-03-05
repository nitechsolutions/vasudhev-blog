import { createServerSupabaseClient } from "../supabase/server";



export async function getCategories(lang?: string) {
   const supabase = await createServerSupabaseClient()
  let query = supabase.from("categories").select("*");

  if (lang) {
    query = query.eq("language_code", lang);
  }

  const { data, error } = await query.order("created_at", {
    ascending: false,
  });

  if (error) throw new Error(error.message);

  return data;
}

export async function createCategory(payload: {
  slug: string;
  name: string;
  language_code: string;
  emoji?: string;
}) {
   const supabase = await createServerSupabaseClient()

  const { data, error } = await supabase
    .from("categories")
    .insert(payload)
    .select()
    .single();

  if (error) throw new Error(error.message);

  return data;
}

export async function updateCategory(id: string, payload: any) {
   const supabase = await createServerSupabaseClient()

  const { error } = await supabase
    .from("categories")
    .update(payload)
    .eq("id", id);

  if (error) throw new Error(error.message);
}

export async function deleteCategory(id: string) {
   const supabase = await createServerSupabaseClient()

  const { error } = await supabase
    .from("categories")
    .delete()
    .eq("id", id);

  if (error) throw new Error(error.message);
}