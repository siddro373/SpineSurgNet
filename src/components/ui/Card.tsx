import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: "default" | "compact" | "none";
}

export default function Card({ children, className, padding = "default" }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-border bg-white shadow-sm",
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
