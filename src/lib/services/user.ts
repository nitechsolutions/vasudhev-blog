import { createServerSupabaseClient } from "../supabase/server";


export async function getUsers() {
     const supabase = await createServerSupabaseClient()
  
  const { data, error } = await supabase
    .from("profiles")
    .select("*");

  if (error) throw new Error(error.message);

  return data;
}

export async function updateUserRole(id: string, role: string) {
   const supabase = await createServerSupabaseClient()

  const { error } = await supabase
    .from("profiles")
    .update({ role })
    .eq("id", id);

  if (error) throw new Error(error.message);
}