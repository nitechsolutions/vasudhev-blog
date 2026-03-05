import { redirect } from "next/navigation";
import { getCurrentUser } from "../../lib/services/auth";

export const metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  console.log(user);
  
  /* -------- Not Logged In -------- */
  if (!user) {
    redirect("/login");
  }


  return (
    <div className="min-h-screen flex mt-14">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white p-6 space-y-6">
        <h2 className="text-xl font-bold">Dashboard</h2>

        <nav className="flex flex-col space-y-3 text-sm">
          <a href="/dashboard">Overview</a>
          <a href="/dashboard/posts">Posts</a>
          <a href="/dashboard/categories">Categories</a>

          {user.role === "admin" && (
            <>
              <a href="/dashboard/languages">Languages</a>
              <a href="/dashboard/users">Users</a>
            </>
          )}

          <a href="/dashboard/profile">Profile</a>
        </nav>
      </aside>

      {/* Content */}
      <main className="flex-1 p-8 bg-gray-50">
        {children}
      </main>
    </div>
  );
}