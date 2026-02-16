"use client";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface p-6">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-error">500</h1>
        <h2 className="mt-4 text-2xl font-semibold text-text-primary">Something went wrong</h2>
        <p className="mt-2 text-text-muted max-w-md mx-auto">
          An unexpected error occurred. Please try again.
        </p>
        <div className="mt-6 flex gap-3 justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center rounded-lg bg-primary-500 px-4 py-2 text-sm font-medium text-white hover:bg-primary-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
}
