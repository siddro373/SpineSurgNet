import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: "default" | "compact" | "none";
  variant?: "default" | "warm";
}

export default function Card({ children, className, padding = "default", variant = "default" }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border shadow-sm transition-shadow",
        {
          "border-border bg-white": variant === "default",
          "border-primary-100 bg-surface-warm": variant === "warm",
        },
        {
          "p-6": padding === "default",
          "p-4": padding === "compact",
          "p-0": padding === "none",
        },
        className
      )}
    >
      {children}
    </div>
  );
}
