import { createServerSupabaseClient } from "../supabase/server";

export async function getCurrentUser() {
  const supabase = await createServerSupabaseClient(); 

  if (!supabase) {
    console.error("Supabase client not created");
    return null;
  }

  const {
    data: {user},
    error,
  } = await supabase.auth.getUser();

  console.log("user", user);

  if (error || !user) return null;

  

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, contact_no")
    .eq("id", user.id)
    .single();

  return {
    id: user.id,
    email: user.email,
    role: profile?.role,
    contact_no: profile?.contact_no,
  };
}