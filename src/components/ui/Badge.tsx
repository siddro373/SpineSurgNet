import { cn } from "@/lib/utils";

interface BadgeProps {
  variant?: "blue" | "green" | "gray" | "purple" | "amber" | "red";
  children: React.ReactNode;
  className?: string;
}

const variantStyles = {
  blue: "bg-primary-500/15 text-primary-400 border-primary-500/30",
  green: "bg-success-light text-success border-success/30",
  gray: "bg-surface-white text-text-muted border-border",
  purple: "bg-purple-500/15 text-purple-400 border-purple-500/30",
  amber: "bg-warning-light text-warning border-warning/30",
  red: "bg-error-light text-error border-error/30",
};

export default function Badge({ variant = "blue", children, className }: BadgeProps) {
  return (
    <span className={cn("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium", variantStyles[variant], className)}>
      {children}
    </span>
  );
}
