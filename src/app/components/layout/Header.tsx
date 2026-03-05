
import { createServerSupabaseClient } from "@/lib/supabase/server";
import HeaderClient from "./HeaderClient";

interface Category {
  slug: string;
  name: string;
}

interface Language {
  code: string;
  name: string;
  is_default: boolean;
}

interface Props {
  currentLang: string;
}

export default async function Header({ currentLang }: Props) {

  const supabase = await createServerSupabaseClient();
  console.log(supabase);
  
  /* Fetch in parallel */
  const [langRes, catRes] = await Promise.all([
    supabase
      .from("languages")
      .select("code, name, is_default")
      .order("id", { ascending: true }),

    supabase
      .from("categories")
      .select("slug, name")
      .eq("language_code", currentLang)
      .order("name", { ascending: true }),
  ]);

  const languages: Language[] = langRes.data ?? [];
  const categories: Category[] = catRes.data ?? [];

  console.log(languages);
  

  return (
    <HeaderClient
      currentLang={currentLang}
      languages={languages}
      categories={categories}
    />
  );
}