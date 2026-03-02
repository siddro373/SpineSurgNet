"use client";

import { useSession } from "next-auth/react";
import TopNav from "@/components/layout/TopNav";
import Sidebar from "@/components/layout/Sidebar";
import BottomTabBar from "@/components/layout/MobileNav";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();

  const user = session?.user
    ? {
        name: session.user.name || "User",
        email: session.user.email || "",
        role: session.user.role || "surgeon",
      }
    : null;

  return (
    <div className="min-h-screen bg-surface">
      <TopNav user={user} />
      <Sidebar className="hidden lg:block" />
      <BottomTabBar />
      <main className="pt-16 pb-16 lg:pb-0 lg:pl-64">
        <div className="mx-auto max-w-5xl p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
