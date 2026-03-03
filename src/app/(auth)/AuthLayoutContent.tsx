"use client";

import { useLanguage } from "@/components/providers/LanguageProvider";

export default function AuthLayoutContent() {
  const { t } = useLanguage();

  return (
    <div className="mb-8 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-primary-400 to-primary-600 shadow-lg">
        <span className="text-2xl font-black text-white">S</span>
      </div>
      <h1 className="mt-4 text-3xl font-black text-text-primary">
        Spine<span className="text-primary-500">SurgNet</span>
      </h1>
      <p className="mt-1 text-sm text-text-muted font-medium">
        {t.auth.tagline}
      </p>
    </div>
  );
}
