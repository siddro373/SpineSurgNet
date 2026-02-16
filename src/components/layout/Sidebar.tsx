"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, UserCircle, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/directory", label: "Surgeon Directory", icon: Users },
  { href: "/profile", label: "My Profile", icon: UserCircle },
  { href: "/settings", label: "Settings", icon: Settings },
];

interface SidebarProps {
  className?: string;
}

export default function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();

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
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "border-l-3 border-primary-500 bg-primary-50 text-primary-600"
                  : "text-text-muted hover:bg-surface hover:text-text-primary"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Ulrich Medical branding */}
      <div className="absolute bottom-0 left-0 right-0 border-t border-border p-4">
        <p className="text-xs text-text-light text-center">Powered by</p>
        <p className="text-xs font-semibold text-primary-500 text-center">Ulrich Medical USA</p>
      </div>
    </aside>
  );
}
