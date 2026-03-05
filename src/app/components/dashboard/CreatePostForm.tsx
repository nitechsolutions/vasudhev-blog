"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import type { RichTextEditorHandle } from "../editor/RichTextEditor";
import { supabase } from "@/lib/supabase/client";

const RichTextEditor = dynamic(() => import("../editor/RichTextEditor"), {
  ssr: false,
});

interface Category {
  id: string;
  name: string;
}

export default function CreatePostForm() {
  const router = useRouter();
  const editorRef = useRef<RichTextEditorHandle>(null);

  const [status, setStatus] = useState<{
    type: "success" | "error" | "loading" | null;
    message: string;
  }>({ type: null, message: "" });

  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryId, setCategoryId] = useState("");
  const [language, setLanguage] = useState("en");

  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");

  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [metaKeywords, setMetaKeywords] = useState("");

  const [featured, setFeatured] = useState(false);
  const [trending, setTrending] = useState(false);

  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      const { data } = await supabase.from("categories").select("id, name");

      if (data) setCategories(data);
    };

    fetchCategories();
  }, []);

  const generateSlug = (text: string) =>
    text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

 const handleImageUpload = async (file: File) => {
  try {
    setUploading(true);

    alert("Uploading image...");

    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;

    const { error } = await supabase.storage
      .from("blog-images")
      .upload(fileName, file);

    if (error) {
      alert("Image Upload Failed: " + error.message);
      setUploading(false);
      return;
    }

    const { data } = supabase.storage
      .from("blog-images")
      .getPublicUrl(fileName);

    setImageUrl(data.publicUrl);

    alert("Image uploaded successfully!");
  } catch (err) {
    alert("Something went wrong while uploading image.");
  } finally {
    setUploading(false);
  }
};

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    setLoading(true);

    alert("Publishing post...");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("Not authenticated");
      setLoading(false);
      return;
    }

    const content = editorRef.current?.getContent() || "";

    if (!content) {
      alert("Content is empty");
      setLoading(false);
      return;
    }

    const { data: postData, error: postError } = await supabase
      .from("posts")
      .insert({
        category_id: categoryId,
        author_id: user.id,
        featured,
        trending,
        status: "published",
        published_at: new Date(),
      })
      .select()
      .single();

    if (postError) {
      alert("Post Insert Error: " + postError.message);
      setLoading(false);
      return;
    }

    const { error: translationError } = await supabase
      .from("post_translations")
      .insert({
        post_id: postData.id,
        language,
        title,
        slug: generateSlug(title),
        excerpt,
        content,
        image: imageUrl,
        meta_title: metaTitle,
        meta_description: metaDescription,
        meta_keywords: metaKeywords,
      });

    if (translationError) {
      alert("Translation Error: " + translationError.message);
      setLoading(false);
      return;
    }

    alert("Post published successfully!");

    router.push("/dashboard");
  } catch (err) {
    alert("Unexpected error occurred.");
  } finally {
    setLoading(false);
  }
};

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <select
        value={categoryId}
        onChange={(e) => setCategoryId(e.target.value)}
        className="border p-2 w-full"
        required
      >
        <option value="">Select Category</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.name}
          </option>
        ))}
      </select>

      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        className="border p-2 w-full"
        required
      >
        <option value="en">English</option>
        <option value="hi">Hindi</option>
      </select>

      <input
        type="text"
        placeholder="Post Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="border p-2 w-full"
        required
      />

      {/* ✅ Correct Editor Usage */}
      <RichTextEditor ref={editorRef} />

      <textarea
        placeholder="Short summary"
        value={excerpt}
        onChange={(e) => setExcerpt(e.target.value)}
        className="border p-2 w-full"
      />

      <input
        type="file"
        accept="image/*"
        onChange={(e) => e.target.files && handleImageUpload(e.target.files[0])}
      />

      {uploading && <p>Uploading image...</p>}
      {imageUrl && <img src={imageUrl} className="w-40 mt-2 rounded" />}

      <input
        type="text"
        placeholder="Meta Title"
        value={metaTitle}
        onChange={(e) => setMetaTitle(e.target.value)}
        className="border p-2 w-full"
      />

      <textarea
        placeholder="Meta Description"
        value={metaDescription}
        onChange={(e) => setMetaDescription(e.target.value)}
        className="border p-2 w-full"
      />

      <input
        type="text"
        placeholder="Meta Keywords"
        value={metaKeywords}
        onChange={(e) => setMetaKeywords(e.target.value)}
        className="border p-2 w-full"
      />

      <div className="flex gap-4">
        <label>
          <input
            type="checkbox"
            checked={featured}
            onChange={(e) => setFeatured(e.target.checked)}
          />{" "}
          Featured
        </label>

        <label>
          <input
            type="checkbox"
            checked={trending}
            onChange={(e) => setTrending(e.target.checked)}
          />{" "}
          Trending
        </label>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-black text-white px-6 py-2"
      >
        {loading ? "Publishing..." : "Publish Post"}
      </button>
    </form>
  );
}
