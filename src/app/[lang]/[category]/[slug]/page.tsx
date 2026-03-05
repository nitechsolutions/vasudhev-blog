import { notFound } from "next/navigation";
import CategorySection from "@/app/components/home/CategorySection";
import Image from "next/image";
import verifiedIcon from "@/assets/verified.png";
import { supabase } from "@/lib/supabase/client";

interface Props {
  params: {
    lang: string;
    category: string;
    slug: string;
  };
}

export const revalidate = 60;

/* ---------------- METADATA ---------------- */

export async function generateMetadata({ params }: Props) {
  const { slug, lang } = await params;

  const { data } = await supabase
    .from("post_translations")
    .select("meta_title, meta_description")
    .eq("slug", slug)
    .eq("language", lang)
    .single();

  return {
    title: data?.meta_title || "Blog",
    description: data?.meta_description || "",
  };
}

/* ---------------- PAGE ---------------- */

export default async function BlogPage({ params }: Props) {
  const { slug, lang, category } = await params;

  /* -------- MAIN POST -------- */

  const { data, error } = await supabase
    .from("posts")
    .select(`
      id,
      published_at,
      profiles!inner(full_name, profile_url, role),
      categories!inner(name, slug),
      post_translations!inner(
        title,
        content,
        image,
        excerpt,
        slug,
        language
      )
    `)
    .eq("status", "published")
    .eq("post_translations.slug", slug)
    .eq("post_translations.language", lang)
    .single();

  if (error || !data) return notFound();

  const post = data.post_translations[0];
  const author = data.profiles;

  if (data.categories.slug !== category) {
    return notFound();
  }

  /* -------- RELATED POSTS -------- */

  const { data: relatedData } = await supabase
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
    .eq("status", "published")
    .eq("categories.slug", category)
    .eq("post_translations.language", lang)
    .neq("post_translations.slug", slug)
    .limit(4);

  const related =
    relatedData?.map((p) => ({
      title: p.post_translations[0].title,
      slug: p.post_translations[0].slug,
      image: p.post_translations[0].image,
      category: p.categories.slug,
    })) || [];

  /* -------- TRENDING -------- */

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

  const siteUrl = "https://yoursite.com";
  const postUrl = `${siteUrl}/${lang}/${category}/${slug}`;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 mt-12">
      <div className="grid lg:grid-cols-3 gap-10">
        {/* MAIN CONTENT */}
        <div className="lg:col-span-2">

          {/* BREADCRUMB */}
          <nav className="text-sm text-gray-500 mb-4">
            <a href={`/${lang}`} className="hover:underline">
              Home
            </a>{" / "}
            <a href={`/${lang}/${category}`} className="hover:underline">
              {category}
            </a>{" / "}
            <span className="text-black">{post.title}</span>
          </nav>

          {/* TITLE */}
          <h1 className="text-3xl font-bold mb-4">{post.title}</h1>

          {/* AUTHOR SECTION */}
          <div className="flex items-center gap-4 mb-6 ">
            <img
              src={author?.profile_url || "/default-avatar.png"}
              alt={author?.full_name}
              className="h-12 w-12 rounded-full object-cover"
            />

            <div>
              <div className="flex items-center gap-2">
                <p className="font-semibold text-sm">
                  {author?.full_name}
                </p>

                {author?.role === "author" && (
                  <Image
                    src={verifiedIcon}
                    alt="verified"
                    width={18}
                    height={18}
                  />
                )}
              </div>

              <p className="text-xs text-gray-500">
                Published on{" "}
                {new Date(data.published_at).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>

          {/* SHARE */}
          <div className="flex gap-3 mb-6">
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`}
              target="_blank"
              className="px-3 py-1 bg-blue-600 text-white rounded text-sm"
            >
              Facebook
            </a>
            <a
              href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(postUrl)}`}
              target="_blank"
              className="px-3 py-1 bg-black text-white rounded text-sm"
            >
              Twitter
            </a>
            <a
              href={`https://wa.me/?text=${encodeURIComponent(postUrl)}`}
              target="_blank"
              className="px-3 py-1 bg-green-600 text-white rounded text-sm"
            >
              WhatsApp
            </a>
          </div>

          {/* FEATURED IMAGE */}
          {post.image && (
            <img
              src={post.image}
              alt={post.title}
              className="w-full rounded mb-6"
            />
          )}

          {/* CONTENT */}
          <div
            className="prose lg:prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>

        {/* SIDEBAR */}
        <aside className="hidden lg:block">
          <div className="sticky top-18">
            <CategorySection emoji="🔥" title="Trending" posts={trending} lang={lang} />
          </div>
        </aside>
      </div>

      {/* RELATED POSTS */}
      {related.length > 0 && (
        <>
          <h3 className="mt-12 text-xl font-bold border-b border-gray-300">Related Posts</h3>

          <div className="grid md:grid-cols-4 gap-6 mt-4">
            {related.map((p) => (
              <a
                key={p.slug}
                href={`/${lang}/${p.category}/${p.slug}`}
                className="rounded hover:shadow p-2"
              >
                {p.image && (
                  <img src={p.image} className="w-full mb-2 rounded" />
                )}
                <h4 className="font-semibold">{p.title}</h4>
              </a>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
