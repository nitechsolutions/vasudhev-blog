// import { MetadataRoute } from "next";
// import { supabaseServer } from "@/app/lib/supabaseServer";

// export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
//   const siteUrl = "https://yoursite.com"; // 🔥 change in production

//   // Fetch all published posts
//   const { data: posts } = await supabaseServer
//     .from("post_translations")
//     .select(`
//       slug,
//       language,
//       posts(
//         published_at,
//         categories(slug)
//       )
//     `);

//   const postUrls =
//     posts?.map((post) => ({
//       url: `${siteUrl}/${post.language}/${post.posts.categories.slug}/${post.slug}`,
//       lastModified: post.posts.published_at
//         ? new Date(post.posts.published_at)
//         : new Date(),
//       changeFrequency: "daily" as const,
//       priority: 0.8,
//     })) || [];

//   return [
//     {
//       url: siteUrl,
//       lastModified: new Date(),
//       changeFrequency: "daily",
//       priority: 1,
//     },

//     {
//       url: `${siteUrl}/en`,
//       lastModified: new Date(),
//       changeFrequency: "daily",
//       priority: 0.9,
//     },

//     {
//       url: `${siteUrl}/hi`,
//       lastModified: new Date(),
//       changeFrequency: "daily",
//       priority: 0.9,
//     },

//     ...postUrls,
//   ];
// }
