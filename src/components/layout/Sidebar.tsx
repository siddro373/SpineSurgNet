"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, UserCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/components/providers/LanguageProvider";

interface SidebarProps {
  className?: string;
}

export default function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();
  const { t } = useLanguage();

  const navItems = [
    { href: "/dashboard", label: t.nav.dashboard, icon: LayoutDashboard },
    { href: "/directory", label: t.nav.directory, icon: Users },
    { href: "/profile", label: t.nav.account, icon: UserCircle },
  ];

  return (
    <aside className={cn("fixed left-0 top-16 bottom-0 w-64 border-r border-border bg-surface-light overflow-y-auto", className)}>
      <nav className="flex flex-col gap-1 p-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-primary-500/15 text-primary-400 font-semibold"
                  : "text-text-muted hover:bg-surface-white hover:text-text-primary"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="absolute bottom-0 left-0 right-0 border-t border-border p-4">
        <p className="text-xs text-text-light text-center">{t.nav.poweredBy}</p>
        <p className="text-xs font-semibold text-primary-400 text-center">{t.nav.ulrichMedical}</p>
      </div>
    </aside>
  );
}
