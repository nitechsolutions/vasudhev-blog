// app/dashboard/posts/create/page.tsx

import CreatePostForm from "@/app/components/dashboard/CreatePostForm";


export default function CreatePostPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 ">Create Post</h1>
      <CreatePostForm />
    </div>
  );
}