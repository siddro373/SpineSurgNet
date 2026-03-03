"use client";

import Card from "@/components/ui/Card";
import Link from "next/link";
import { useLanguage } from "@/components/providers/LanguageProvider";

export default function VerifyPage() {
  const { t } = useLanguage();

  return (
    <Card className="text-center">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary-500/15">
        <svg className="h-8 w-8 text-primary-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
        </svg>
      </div>
      <h2 className="text-xl font-semibold text-text-primary mb-2">{t.verify.checkEmail}</h2>
      <p className="text-sm text-text-muted mb-6">
        {t.verify.verifyMessage}
      </p>
      <Link href="/login" className="text-sm font-medium text-primary-500 hover:text-primary-600">
        {t.verify.backToSignIn}
      </Link>
    </Card>
  );
}
