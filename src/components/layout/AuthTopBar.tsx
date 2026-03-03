"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/components/providers/LanguageProvider";

export default function AuthTopBar() {
  const pathname = usePathname();
  const { lang, setLang, t } = useLanguage();

  const isLoginPage = pathname === "/login";
  const isRegisterPage = pathname === "/register";

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex h-14 items-center justify-between px-4 sm:px-6 bg-surface/80 backdrop-blur-md border-b border-border">
      {/* Logo */}
      <Link href="/login" className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 shadow-sm">
          <span className="text-sm font-black text-white">S</span>
        </div>
        <span className="text-lg font-black text-text-primary">
          Spine<span className="text-primary-500">SurgNet</span>
        </span>
      </Link>

      {/* Right side: language toggle + CTA button */}
      <div className="flex items-center gap-3">
        {/* EN/DE Language toggle */}
        <div className="flex rounded-full border border-border overflow-hidden">
          <button
            onClick={() => setLang("en")}
            className={`px-2.5 py-1 text-xs font-bold transition-colors ${
              lang === "en"
                ? "bg-primary-500 text-secondary-700"
                : "text-text-muted hover:text-text-primary"
            }`}
          >
            EN
          </button>
          <button
            onClick={() => setLang("de")}
            className={`px-2.5 py-1 text-xs font-bold transition-colors ${
              lang === "de"
                ? "bg-primary-500 text-secondary-700"
                : "text-text-muted hover:text-text-primary"
            }`}
          >
            DE
          </button>
        </div>

        {/* CTA Button */}
        {isLoginPage && (
          <Link
            href="/register"
            className="inline-flex items-center justify-center rounded-full bg-primary-500 px-5 py-2 text-sm font-bold text-secondary-700 shadow-md shadow-primary-500/25 hover:bg-primary-600 hover:shadow-lg hover:shadow-primary-500/35 transition-all duration-200"
          >
            {t.auth.registerHere}
          </Link>
        )}
        {isRegisterPage && (
          <Link
            href="/login"
            className="inline-flex items-center justify-center rounded-full border-2 border-primary-500 bg-transparent px-5 py-2 text-sm font-bold text-primary-400 hover:bg-primary-500/10 transition-all duration-200"
          >
            {t.auth.signIn}
          </Link>
        )}
      </div>
    </div>
  );
}
