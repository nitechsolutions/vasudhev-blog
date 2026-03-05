import Link from "next/link";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export default async function CategoriesPage() {
  const supabase = await createServerSupabaseClient();

  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="flex justify-between mb-6 ">
        <h1 className="text-2xl font-bold">Categories</h1>
        <Link
          href="/dashboard/categories/create"
          className="bg-black text-white px-4 py-2"
        >
          Create Category
        </Link>
      </div>

      {categories?.map((cat) => (
        <div
          key={cat.id}
          className="bg-white p-4 mb-2 flex justify-between rounded shadow"
        >
          <p>{cat.name}</p>

          <Link
            href={`/dashboard/categories/${cat.id}/edit`}
            className="text-blue-600"
          >
            Edit
          </Link>
        </div>
      ))}
    </div>
  );
}