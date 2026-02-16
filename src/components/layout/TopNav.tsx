"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Bell, Menu, LogOut, User, Settings } from "lucide-react";
import Avatar from "@/components/ui/Avatar";

interface TopNavProps {
  user?: {
    name: string;
    email: string;
    role: string;
  } | null;
  onMenuClick?: () => void;
}

export default function TopNav({ user, onMenuClick }: TopNavProps) {
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
    <header className="fixed top-0 left-0 right-0 z-40 flex h-16 items-center border-b border-border bg-white px-4 lg:px-6">
      {/* Left: Menu + Logo */}
      <div className="flex items-center gap-3">
        <button onClick={onMenuClick} className="lg:hidden text-text-muted hover:text-text-primary">
          <Menu className="h-6 w-6" />
        </button>
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-500">
            <span className="text-sm font-bold text-white">S</span>
          </div>
          <span className="hidden text-lg font-bold text-text-primary sm:block">
            Spine<span className="text-primary-500">SurgNet</span>
          </span>
        </Link>
      </div>

      {/* Center: Search */}
      <div className="mx-4 flex-1 max-w-xl hidden md:block">
        <form onSubmit={handleSearch} className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search surgeons..."
            className="h-9 w-full rounded-full border border-border bg-surface-light pl-9 pr-4 text-sm text-text-primary placeholder:text-text-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400"
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
        <button className="relative rounded-full p-2 text-text-muted hover:bg-surface hover:text-text-primary">
          <Bell className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-error" />
        </button>

        {/* User dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 rounded-full p-1 hover:bg-surface"
          >
            <Avatar name={user?.name || "User"} size="sm" />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-lg border border-border bg-white py-1 shadow-lg">
              <div className="border-b border-border px-4 py-3">
                <p className="text-sm font-medium text-text-primary">{user?.name}</p>
                <p className="text-xs text-text-muted">{user?.email}</p>
              </div>
              <Link href="/profile" className="flex items-center gap-2 px-4 py-2 text-sm text-text-secondary hover:bg-surface" onClick={() => setDropdownOpen(false)}>
                <User className="h-4 w-4" /> My Profile
              </Link>
              <Link href="/settings" className="flex items-center gap-2 px-4 py-2 text-sm text-text-secondary hover:bg-surface" onClick={() => setDropdownOpen(false)}>
                <Settings className="h-4 w-4" /> Settings
              </Link>
              {user?.role === "admin" && (
                <Link href="/admin" className="flex items-center gap-2 px-4 py-2 text-sm text-text-secondary hover:bg-surface" onClick={() => setDropdownOpen(false)}>
                  <Settings className="h-4 w-4" /> Admin Panel
                </Link>
              )}
              <hr className="my-1 border-border" />
              <button
                onClick={() => {
                  setDropdownOpen(false);
                  window.location.href = "/api/auth/signout";
                }}
                className="flex w-full items-center gap-2 px-4 py-2 text-sm text-error hover:bg-surface"
              >
                <LogOut className="h-4 w-4" /> Sign Out
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile search bar */}
      {searchOpen && (
        <div className="absolute top-16 left-0 right-0 border-b border-border bg-white p-4 md:hidden">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search surgeons..."
              autoFocus
              className="h-10 w-full rounded-md border border-border bg-surface-light pl-9 pr-4 text-sm"
            />
          </form>
        </div>
      )}
    </header>
  );
}
