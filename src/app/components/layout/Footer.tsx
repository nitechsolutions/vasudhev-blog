
import { supabase } from "@/lib/supabase/client";
import FooterClient from "./FooterClient";

interface Category {
  slug: string;
  name: string;
}

interface Props {
  currentLang: string;
}

export default async function Footer({ currentLang }: Props) {
  const { data: categories } = await supabase
    .from("categories")
    .select("slug, name")
    .eq("language_code", currentLang)
    .order("name", { ascending: true });

  return (
    <FooterClient
      currentLang={currentLang}
      categories={categories ?? []}
    />
  );
}