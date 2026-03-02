"use client";

import { useSession } from "next-auth/react";
import TopNav from "@/components/layout/TopNav";
import AdminSidebar from "@/components/layout/AdminSidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();

  const user = session?.user
    ? {
        name: session.user.name || "Admin",
        email: session.user.email || "",
        role: session.user.role || "admin",
      }
    : null;

  return (
    <div className="min-h-screen bg-surface">
      <TopNav user={user} />
      <AdminSidebar className="hidden lg:block" />
      <main className="pt-16 lg:pl-64">
        <div className="mx-auto max-w-6xl p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
