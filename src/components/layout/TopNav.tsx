"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Bell, LogOut, User, Settings, Shield } from "lucide-react";
import { signOut } from "next-auth/react";
import Avatar from "@/components/ui/Avatar";

interface TopNavProps {
  user?: {
    name: string;
    email: string;
    role: string;
  } | null;
  onMenuClick?: () => void;
}

export default function TopNav({ user }: TopNavProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/directory?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setSearchOpen(false);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 flex h-16 items-center bg-surface/95 backdrop-blur-sm px-4 lg:px-6 border-b border-border">
      {/* Left: Logo */}
      <div className="flex items-center gap-3">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 shadow-sm">
            <span className="text-sm font-black text-white">S</span>
          </div>
          <span className="hidden text-lg font-bold text-text-primary sm:block">
            Spine<span className="text-primary-500">SurgNet</span>
          </span>
        </Link>
      </div>

      {/* Center: Search */}
      <div className="mx-4 flex-1 max-w-xl hidden md:block">
        <form onSubmit={handleSearch} className="relative">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search surgeons..."
            className="h-10 w-full rounded-full border border-border bg-surface-white pl-10 pr-4 text-sm text-text-primary placeholder:text-text-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 transition-colors hover:border-border-dark"
          />
        </form>
      </div>

      {/* Mobile search toggle */}
      <button
        onClick={() => setSearchOpen(!searchOpen)}
        className="ml-auto mr-2 md:hidden text-text-muted hover:text-text-primary"
      >
        <Search className="h-5 w-5" />
      </button>

      {/* Right: Notifications + User */}
      <div className="flex items-center gap-2 ml-auto md:ml-0">
        <button className="relative rounded-full p-2 text-text-muted hover:bg-surface hover:text-text-primary transition-colors">
          <Bell className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-primary-500" />
        </button>

        {/* User dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 rounded-full p-1 hover:bg-surface transition-colors"
          >
            <Avatar name={user?.name || "User"} size="sm" />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-60 rounded-2xl border border-border bg-surface-light py-2 shadow-xl">
              <div className="border-b border-border px-4 py-3">
                <p className="text-sm font-semibold text-text-primary">{user?.name}</p>
                <p className="text-xs text-text-muted">{user?.email}</p>
              </div>
              <Link href="/profile" className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-text-secondary hover:bg-surface rounded-lg mx-1" onClick={() => setDropdownOpen(false)}>
                <User className="h-4 w-4" /> My Account
              </Link>
              <Link href="/profile?tab=security" className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-text-secondary hover:bg-surface rounded-lg mx-1" onClick={() => setDropdownOpen(false)}>
                <Settings className="h-4 w-4" /> Security
              </Link>
              {user?.role === "admin" && (
                <Link href="/admin" className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-text-secondary hover:bg-surface rounded-lg mx-1" onClick={() => setDropdownOpen(false)}>
                  <Shield className="h-4 w-4" /> Admin Panel
                </Link>
              )}
              <hr className="my-1 border-border" />
              <button
                onClick={() => {
                  setDropdownOpen(false);
                  signOut({ callbackUrl: "/login" });
                }}
                className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-error hover:bg-surface rounded-lg mx-1"
              >
                <LogOut className="h-4 w-4" /> Sign Out
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile search bar */}
      {searchOpen && (
        <div className="absolute top-16 left-0 right-0 bg-surface/95 backdrop-blur-sm p-4 border-b border-border md:hidden">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search surgeons..."
              autoFocus
              className="h-11 w-full rounded-full border border-border bg-surface-white pl-10 pr-4 text-sm text-text-primary transition-colors hover:border-border-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400"
            />
          </form>
        </div>
      )}
    </header>
  );
}
