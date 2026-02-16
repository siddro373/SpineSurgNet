export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary-500">
            <span className="text-xl font-bold text-white">S</span>
          </div>
          <h1 className="mt-4 text-2xl font-bold text-text-primary">
            Spine<span className="text-primary-500">SurgNet</span>
          </h1>
          <p className="mt-1 text-sm text-text-muted">
            The Professional Network for Spine Surgeons
          </p>
        </div>
        {children}
      </div>
    </div>
  );
}
