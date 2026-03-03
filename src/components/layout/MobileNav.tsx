"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, UserCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/components/providers/LanguageProvider";

export default function BottomTabBar() {
  const pathname = usePathname();
  const { t } = useLanguage();

  const navItems = [
    { href: "/dashboard", label: t.nav.home, icon: LayoutDashboard },
    { href: "/directory", label: t.nav.directoryShort, icon: Users },
    { href: "/profile", label: t.nav.accountShort, icon: UserCircle },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 flex h-16 bg-surface/95 backdrop-blur-sm border-t border-border lg:hidden" style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
      {navItems.map((item) => {
        const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
        return (
          <Link
            key={item.href}
            href={item.href}
            className="flex flex-1 flex-col items-center justify-center gap-0.5 transition-colors"
          >
            <item.icon className={cn("h-5 w-5", isActive ? "text-primary-500" : "text-text-muted")} />
            <span className={cn("text-[10px] font-semibold", isActive ? "text-primary-500" : "text-text-muted")}>
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
