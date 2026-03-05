import { createServerSupabaseClient } from "../supabase/server";


export async function getPosts() {
     const supabase = await createServerSupabaseClient()
  
  const { data, error } = await supabase
    .from("posts")
    .select(`
      id,
      status,
      featured,
      created_at,
      post_translations(title, language)
    `)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  return data;
}

export async function createPost(payload: any) {
   const supabase = await createServerSupabaseClient()

  const { data, error } = await supabase
    .from("posts")
    .insert(payload)
    .select()
    .single();

  if (error) throw new Error(error.message);

  return data;
}