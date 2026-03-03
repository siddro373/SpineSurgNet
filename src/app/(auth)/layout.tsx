export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center relative overflow-hidden p-4 bg-surface">
      {/* Decorative background circles */}
      <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-primary-500/10 blur-3xl" />
      <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-secondary-400/10 blur-3xl" />

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-primary-400 to-primary-600 shadow-lg">
            <span className="text-2xl font-black text-white">S</span>
          </div>
          <h1 className="mt-4 text-3xl font-black text-text-primary">
            Spine<span className="text-primary-500">SurgNet</span>
          </h1>
          <p className="mt-1 text-sm text-text-muted font-medium">
            The Professional Network for Spine Surgeons
          </p>
        </div>
        {children}
      </div>
    </div>
  );
}
