"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import TopNav from "@/components/layout/TopNav";
import Sidebar from "@/components/layout/Sidebar";
import MobileNav from "@/components/layout/MobileNav";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const { data: session } = useSession();

  const user = session?.user
    ? {
        name: session.user.name || "User",
        email: session.user.email || "",
        role: (session.user as any).role || "surgeon",
      }
    : null;

  return (
    <div className="min-h-screen bg-surface">
      <TopNav user={user} onMenuClick={() => setMobileNavOpen(true)} />
      <Sidebar className="hidden lg:block" />
      <MobileNav
        isOpen={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
        isAdmin={user?.role === "admin"}
      />
      <main className="pt-16 lg:pl-64">
        <div className="mx-auto max-w-5xl p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
