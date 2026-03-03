import AuthTopBar from "@/components/layout/AuthTopBar";
import AuthLayoutContent from "./AuthLayoutContent";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col relative overflow-hidden bg-surface">
      {/* Top navigation bar */}
      <AuthTopBar />

      {/* Decorative background circles */}
      <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-primary-500/10 blur-3xl" />
      <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-secondary-400/10 blur-3xl" />

      <div className="flex flex-1 items-center justify-center p-4 pt-20">
        <div className="relative w-full max-w-md">
          {/* Logo */}
          <AuthLayoutContent />
          {children}
        </div>
      </div>
    </div>
  );
}
