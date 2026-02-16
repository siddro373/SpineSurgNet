"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import TopNav from "@/components/layout/TopNav";
import AdminSidebar from "@/components/layout/AdminSidebar";
import MobileNav from "@/components/layout/MobileNav";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const { data: session } = useSession();

  const user = session?.user
    ? {
        name: session.user.name || "Admin",
        email: session.user.email || "",
        role: (session.user as any).role || "admin",
      }
    : null;

  return (
    <div className="min-h-screen bg-surface">
      <TopNav user={user} onMenuClick={() => setMobileNavOpen(true)} />
      <AdminSidebar className="hidden lg:block" />
      <MobileNav
        isOpen={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
        isAdmin={true}
      />
      <main className="pt-16 lg:pl-64">
        <div className="mx-auto max-w-6xl p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
