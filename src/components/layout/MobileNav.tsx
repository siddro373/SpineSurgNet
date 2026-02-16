"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { X, LayoutDashboard, Users, UserCircle, Settings, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/directory", label: "Surgeon Directory", icon: Users },
  { href: "/profile", label: "My Profile", icon: UserCircle },
  { href: "/settings", label: "Settings", icon: Settings },
];

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  isAdmin?: boolean;
}

export default function MobileNav({ isOpen, onClose, isAdmin }: MobileNavProps) {
  const pathname = usePathname();

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={onClose} />
      <div className="fixed left-0 top-0 bottom-0 z-50 w-72 bg-white shadow-xl lg:hidden">
        <div className="flex h-16 items-center justify-between border-b border-border px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-500">
              <span className="text-sm font-bold text-white">S</span>
            </div>
            <span className="text-lg font-bold text-text-primary">
              Spine<span className="text-primary-500">SurgNet</span>
            </span>
          </div>
          <button onClick={onClose} className="text-text-muted hover:text-text-primary">
            <X className="h-6 w-6" />
          </button>
        </div>
        <nav className="flex flex-col gap-1 p-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary-50 text-primary-600"
                    : "text-text-muted hover:bg-surface hover:text-text-primary"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
          {isAdmin && (
            <>
              <hr className="my-2 border-border" />
              <Link
                href="/admin"
                onClick={onClose}
                className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-text-muted hover:bg-surface hover:text-text-primary"
              >
                <BarChart3 className="h-5 w-5" /> Admin Panel
              </Link>
            </>
          )}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 border-t border-border p-4">
          <p className="text-xs text-text-light text-center">Powered by</p>
          <p className="text-xs font-semibold text-primary-500 text-center">Ulrich Medical USA</p>
        </div>
      </div>
    </>
  );
}
