
import { getDefaultLanguage } from "./services/getLanguage";
import { createServerSupabaseClient } from "./supabase/server";

interface HomeData {
  featured: any[];
  trending: any[];
  categoryData: any[];
  lang: string;
}

export async function getHomeData(
  lang?: string
): Promise<HomeData> {

const supabase = await createServerSupabaseClient();


  const languageCode = await getDefaultLanguage();

  /* ---------------- Fetch Categories ---------------- */

  const { data: categoryList } = await supabase
    .from("categories")
    .select(`
      id,
      slug,
      name,
      emoji
    `)
    .eq("language_code", languageCode);

  const categories = categoryList || [];

  /* ---------------- Parallel Queries ---------------- */

  const [featuredRes, trendingRes, ...categoryResults] =
    await Promise.all([
      supabase
        .from("posts")
        .select(`
          id,
          categories!inner(slug, name, emoji),
          post_translations!inner(
            title,
            slug,
            image,
            excerpt,
            language
          )
        `)
        .eq("featured", true)
        .eq("status", "published")
        .eq("post_translations.language", languageCode)
        .limit(4),

      supabase
        .from("posts")
        .select(`
          id,
          categories!inner(slug, name, emoji),
          post_translations!inner(
            title,
            slug,
            image,
            language
          )
        `)
        .eq("trending", true)
        .eq("status", "published")
        .eq("post_translations.language", languageCode)
        .limit(4),

      ...categories.map((cat) =>
        supabase
          .from("posts")
          .select(`
            id,
            categories!inner(slug, name, emoji),
            post_translations!inner(
              title,
              slug,
              image,
              language
            )
          `)
          .eq("status", "published")
          .eq("post_translations.language", languageCode)
          .eq("categories.slug", cat.slug)
          .limit(4)
      ),
    ]);

  /* ---------------- Formatter ---------------- */

  const format = (rows: any[] | null) =>
    (rows || []).map((post) => ({
      title: post.post_translations?.[0]?.title,
      slug: post.post_translations?.[0]?.slug,
      image: post.post_translations?.[0]?.image,
      excerpt: post.post_translations?.[0]?.excerpt,
      lang: post.post_translations?.[0]?.language,
      category: post.categories?.slug,
      emoji: post.categories?.emoji,
    }));

  const featured = format(featuredRes.data);
  const trending = format(trendingRes.data);

  const categoryData = categories.map((cat, i) => ({
    slug: cat.slug,
    name: cat.name,
    emoji: cat.emoji,
    posts: format(categoryResults[i]?.data),
  }));

  return {
    featured,
    trending,
    categoryData,
    lang: languageCode,
  };
}