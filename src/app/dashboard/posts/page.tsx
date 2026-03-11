import Link from "next/link";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export default async function PostsPage() {
  const supabase = await createServerSupabaseClient();

  const { data: posts, error } = await supabase
    .from("posts")
    .select(`
      id,
      status,
      published_at,
      categories (
        name,
        slug
      ),
      post_translations (
        title,
        slug,
        image,
        language
      )
    `)
    .order("created_at", { ascending: false });

  if (error) {
    return <p>Error loading posts</p>;
  }

  return (
    <div>
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">Posts</h1>

        <Link
          href="/dashboard/posts/create"
          className="bg-black text-white px-4 py-2"
        >
          Create Post
        </Link>
      </div>

      <div className="bg-white rounded shadow">

        {posts?.map((post) => {
          const translation = post.post_translations?.[0];

          return (
            <div
              key={post.id}
              className="p-4 border-b flex items-center justify-between gap-4"
            >

              {/* LEFT SIDE */}
              <div className="flex items-center gap-4">

                {/* Image */}
                {translation?.image && (
                  <img
                    src={translation.image}
                    alt={translation.title}
                    width={60}
                    height={60}
                    className="object-cover rounded"
                  />
                )}

                <div>
                  {/* Title */}
                  <p className="font-semibold">
                    {translation?.title}
                  </p>

                  {/* Category */}
                  <p className="text-sm text-gray-500">
                    Category: {post.categories?.name}
                  </p>

                  {/* Status */}
                  <p className="text-sm text-gray-400">
                    {post.status}
                  </p>
                </div>
              </div>

              {/* RIGHT SIDE */}
              <div className="flex gap-4">

                <Link
                  href={`/dashboard/posts/${post.id}/edit`}
                  className="text-blue-600"
                >
                  Edit
                </Link>

              </div>

            </div>
          );
        })}

      </div>
    </div>
  );
}