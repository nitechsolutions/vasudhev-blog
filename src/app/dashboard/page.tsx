// app/dashboard/page.tsx

import { createServerSupabaseClient } from "@/lib/supabase/server";

export default async function DashboardOverview() {
  const supabase = await createServerSupabaseClient();

  const { count: postCount } = await supabase
    .from("posts")
    .select("*", { count: "exact", head: true });

  const { count: categoryCount } = await supabase
    .from("categories")
    .select("*", { count: "exact", head: true });

  const { count: userCount } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 ">Dashboard Overview</h1>

      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded shadow">
          <p className="text-gray-500">Total Posts</p>
          <p className="text-2xl font-bold">{postCount ?? 0}</p>
        </div>

        <div className="bg-white p-6 rounded shadow">
          <p className="text-gray-500">Total Categories</p>
          <p className="text-2xl font-bold">{categoryCount ?? 0}</p>
        </div>

        <div className="bg-white p-6 rounded shadow">
          <p className="text-gray-500">Total Users</p>
          <p className="text-2xl font-bold">{userCount ?? 0}</p>
        </div>
      </div>
    </div>
  );
}