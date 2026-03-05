import { notFound } from "next/navigation";
import CategorySection from "@/app/components/home/CategorySection";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";

interface Props {
  params: {
    lang: string;
    category: string;
  };
  searchParams: {
    page?: string;
  };
}

export const revalidate = 60;

const POSTS_PER_PAGE = 8;

const categoryConfig: Record<
  string,
  { emoji: string; color: string }
> = {
  tech: { emoji: "💻", color: "border-blue-500 text-blue-600" },
  auto: { emoji: "🚗", color: "border-orange-500 text-orange-600" },
  finance: { emoji: "💰", color: "border-green-500 text-green-600" },
  health: { emoji: "🏥", color: "border-pink-500 text-pink-600" },
};

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string; category: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { lang, category } = await params;
  const { page } = await searchParams;

  const currentPage = Number(page) || 1;
  const from = (currentPage - 1) * POSTS_PER_PAGE;
  const to = from + POSTS_PER_PAGE - 1;

  /* ---------------- CATEGORY POSTS ---------------- */

  const { data, count } = await supabase
    .from("posts")
    .select(
      `
      id,
      published_at,
      categories!inner(slug),
      post_translations!inner(
        title,
        slug,
        image,
        excerpt,
        language
      )
    `,
      { count: "exact" }
    )
    .eq("status", "published")
    .eq("categories.slug", category)
    .eq("post_translations.language", lang)
    .order("published_at", { ascending: false })
    .range(from, to);

  if (!data || data.length === 0) return notFound();

  const posts = data.map((p) => ({
    title: p.post_translations[0].title,
    slug: p.post_translations[0].slug,
    image: p.post_translations[0].image,
    excerpt: p.post_translations[0].excerpt,
    category: p.categories.slug,
  }));

  const totalPages = Math.ceil((count || 0) / POSTS_PER_PAGE);

  /* ---------------- TRENDING ---------------- */

  const { data: trendingData } = await supabase
    .from("posts")
    .select(`
      categories!inner(slug),
      post_translations!inner(
        title,
        slug,
        image,
        language
      )
    `)
    .eq("trending", true)
    .eq("status", "published")
    .eq("post_translations.language", lang)
    .limit(6);

  const trending =
    trendingData?.map((p) => ({
      title: p.post_translations[0].title,
      slug: p.post_translations[0].slug,
      image: p.post_translations[0].image,
      category: p.categories.slug,
    })) || [];

  const config =
    categoryConfig[category] || {
      emoji: "📰",
      color: "border-gray-400 text-gray-600",
    };

    if (!posts.length ) return <p>No data found</p>
    if (!trending.length ) return <p>No data found</p>


  return (
    <div className="max-w-6xl mx-auto px-4 py-6 mt-12">

      <div className="grid lg:grid-cols-3 gap-10">

        {/* MAIN CONTENT */}
        <div className="lg:col-span-2">

          {/* CATEGORY HEADER */}
          <h1
            className={`text-3xl font-bold mb-8 capitalize border-b-2 pb-3 flex items-center gap-3 ${config.color}`}
          >
            <span>{config.emoji}</span>
            {category} News
          </h1>

          {/* POSTS GRID */}
          <div className="grid md:grid-cols-3 gap-8">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/${lang}/${post.category}/${post.slug}`}
                className="group"
              >
                {post.image && (
                  <img
                    src={post.image}
                    className="w-full h-42 object-cover rounded mb-3 group-hover:opacity-90 transition"
                  />
                )}
                <h2 className="font-semibold text-lg group-hover:text-red-600 transition">
                  {post.title}
                </h2>
                {post.excerpt && (
                  <p className="text-gray-600 text-sm mt-2 line-clamp-2">
                    {post.excerpt}
                  </p>
                )}
              </Link>
            ))}
          </div>

          {/* PAGINATION */}
          <div className="flex justify-center gap-3 mt-10">

            {currentPage > 1 && (
              <Link
                href={`/${lang}/${category}?page=${currentPage - 1}`}
                className="px-4 py-2 border rounded hover:bg-gray-100"
              >
                Previous
              </Link>
            )}

            {Array.from({ length: totalPages }).map((_, i) => {
              const page = i + 1;
              return (
                <Link
                  key={page}
                  href={`/${lang}/${category}?page=${page}`}
                  className={`px-4 py-2 border rounded ${
                    page === currentPage
                      ? "bg-black text-white"
                      : "hover:bg-gray-100"
                  }`}
                >
                  {page}
                </Link>
              );
            })}

            {currentPage < totalPages && (
              <Link
                href={`/${lang}/${category}?page=${currentPage + 1}`}
                className="px-4 py-2 border rounded hover:bg-gray-100"
              >
                Next
              </Link>
            )}

          </div>
        </div>

        {/* SIDEBAR */}
        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <CategorySection
              title="Trending"
              posts={trending}
              lang={lang}
            />
          </div>
        </aside>

      </div>
    </div>
  );
}
