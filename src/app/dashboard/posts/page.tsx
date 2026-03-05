// app/dashboard/posts/page.tsx

import Link from "next/link";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export default async function PostsPage() {
  const supabase = await createServerSupabaseClient();

  const { data: posts } = await supabase
    .from("posts")
    .select("id, status, published_at")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="flex justify-between mb-6 ">
        <h1 className="text-2xl font-bold">Posts</h1>
        <Link
          href="/dashboard/posts/create"
          className="bg-black text-white px-4 py-2"
        >
          Create Post
        </Link>
      </div>

      <div className="bg-white rounded shadow">
        {posts?.map((post) => (
          <div
            key={post.id}
            className="p-4 border-b flex justify-between"
          >
            <div>
              <p>Status: {post.status}</p>
              <p className="text-sm text-gray-500">
                {post.published_at
                  ? new Date(post.published_at).toLocaleDateString()
                  : "Draft"}
              </p>
            </div>

            <Link
              href={`/dashboard/posts/${post.id}/edit`}
              className="text-blue-600"
            >
              Edit
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}