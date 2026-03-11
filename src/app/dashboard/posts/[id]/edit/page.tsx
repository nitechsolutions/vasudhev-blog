"use client";

import { useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { RichTextEditorHandle } from "@/app/components/editor/RichTextEditor";

const RichTextEditor = dynamic(() => import("@/app/components/editor/RichTextEditor"), {
  ssr: false,
});

interface Category {
  id: string;
  name: string;
}

export default function EditPostForm({ post }: any) {
  const router = useRouter();
  const editorRef = useRef<RichTextEditorHandle>(null);

  const translation = post.post_translations?.[0];

  const [categories, setCategories] = useState<Category[]>([]);

  const [categoryId, setCategoryId] = useState(post.category_id);
  const [language, setLanguage] = useState(translation?.language);

  const [title, setTitle] = useState(translation?.title);
  const [excerpt, setExcerpt] = useState(translation?.excerpt);

  const [metaTitle, setMetaTitle] = useState(translation?.meta_title);
  const [metaDescription, setMetaDescription] = useState(
    translation?.meta_description
  );
  const [metaKeywords, setMetaKeywords] = useState(
    translation?.meta_keywords
  );

  const [featured, setFeatured] = useState(post.featured);
  const [trending, setTrending] = useState(post.trending);

  const [imageUrl, setImageUrl] = useState(translation?.image);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      const { data } = await supabase.from("categories").select("id,name");
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
    setUploading(true);

    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;

    const { error } = await supabase.storage
      .from("blog-images")
      .upload(fileName, file);

    if (error) {
      alert(error.message);
      setUploading(false);
      return;
    }

    const { data } = supabase.storage
      .from("blog-images")
      .getPublicUrl(fileName);

    setImageUrl(data.publicUrl);

    setUploading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);

    const content = editorRef.current?.getContent() || "";

    try {
      /* UPDATE POSTS TABLE */

      const { error: postError } = await supabase
        .from("posts")
        .update({
          category_id: categoryId,
          featured,
          trending,
        })
        .eq("id", post.id);

      if (postError) throw postError;

      /* UPDATE TRANSLATION TABLE */

      const { error: translationError } = await supabase
        .from("post_translations")
        .update({
          title,
          slug: generateSlug(title),
          excerpt,
          content,
          image: imageUrl,
          meta_title: metaTitle,
          meta_description: metaDescription,
          meta_keywords: metaKeywords,
        })
        .eq("post_id", post.id)
        .eq("language", language);

      if (translationError) throw translationError;

      alert("Post updated successfully");

      router.push("/dashboard/posts");
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>

      <select
        value={categoryId}
        onChange={(e) => setCategoryId(e.target.value)}
      >
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.name}
          </option>
        ))}
      </select>

      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <RichTextEditor
        ref={editorRef}
        initialContent={translation?.content}
      />

      <textarea
        value={excerpt}
        onChange={(e) => setExcerpt(e.target.value)}
      />

      <input
        type="file"
        onChange={(e) =>
          e.target.files && handleImageUpload(e.target.files[0])
        }
      />

      {imageUrl && <img src={imageUrl} width={120} />}

      <input
        value={metaTitle}
        onChange={(e) => setMetaTitle(e.target.value)}
      />

      <textarea
        value={metaDescription}
        onChange={(e) => setMetaDescription(e.target.value)}
      />

      <input
        value={metaKeywords}
        onChange={(e) => setMetaKeywords(e.target.value)}
      />

      <label>
        <input
          type="checkbox"
          checked={featured}
          onChange={(e) => setFeatured(e.target.checked)}
        />
        Featured
      </label>

      <label>
        <input
          type="checkbox"
          checked={trending}
          onChange={(e) => setTrending(e.target.checked)}
        />
        Trending
      </label>

      <button disabled={loading}>
        {loading ? "Updating..." : "Update Post"}
      </button>

    </form>
  );
}