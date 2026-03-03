"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, Database, Download, BookOpen, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/components/providers/LanguageProvider";

export default function AdminSidebar({ className }: { className?: string }) {
  const pathname = usePathname();
  const { t } = useLanguage();

  const navItems = [
    { href: "/admin", label: t.admin.overview, icon: BarChart3, exact: true },
    { href: "/admin/surgeons", label: t.admin.allSurgeons, icon: Database },
    { href: "/admin/conferences", label: t.admin.conferences, icon: BookOpen },
    { href: "/admin/export", label: t.admin.exportData, icon: Download },
  ];

  return (
    <aside className={cn("fixed left-0 top-16 bottom-0 w-64 border-r border-border bg-surface-light overflow-y-auto", className)}>
      <div className="p-4">
        <div className="mb-4 rounded-xl bg-primary-500/15 px-3 py-2">
          <p className="text-xs font-bold text-primary-400 uppercase tracking-wider">{t.nav.adminPanel}</p>
        </div>
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => {
            const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-primary-500 text-secondary-700 shadow-sm font-bold"
                    : "text-text-muted hover:bg-surface-white hover:text-text-primary"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-4">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-text-muted hover:bg-surface-white hover:text-text-primary"
        >
          <ArrowLeft className="h-4 w-4" /> {t.admin.backToApp}
        </Link>
      </div>
    </aside>
  );
}
