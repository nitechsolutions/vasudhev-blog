// app/dashboard/posts/[id]/edit/page.tsx

import { createServerSupabaseClient } from "@/lib/supabase/server";
import EditPostForm from "./EditPostForm";

export default async function EditPostPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = await createServerSupabaseClient();

  const { data: post } = await supabase
    .from("posts")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!post) return <p>Post not found</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Edit Post</h1>
      <EditPostForm post={post} />
    </div>
  );
}