"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useLanguage } from "@/components/providers/LanguageProvider";

export default function LoginPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(t.login.invalidCredentials);
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch {
      setError(t.login.somethingWrong);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <h2 className="mb-1 text-2xl font-bold text-text-primary text-center">
        {t.login.welcomeBack}
      </h2>
      <p className="mb-6 text-sm text-text-muted text-center">{t.login.signInSubtitle}</p>

      {error && (
        <div className="mb-4 rounded-md bg-error-light p-3 text-sm text-error">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label={t.login.emailAddress}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t.login.emailPlaceholder}
          required
        />
        <Input
          label={t.login.password}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={t.login.passwordPlaceholder}
          required
        />
        <Button type="submit" isLoading={loading} className="w-full">
          {t.login.signIn}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-text-muted">
        {t.login.noAccount}{" "}
        <Link href="/register" className="font-medium text-primary-500 hover:text-primary-600">
          {t.login.registerHere}
        </Link>
      </p>
    </Card>
  );
}
