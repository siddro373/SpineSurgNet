import { cn } from "@/lib/utils";

interface BadgeProps {
  variant?: "blue" | "green" | "gray" | "purple" | "amber" | "red";
  children: React.ReactNode;
  className?: string;
}

const variantStyles = {
  blue: "bg-primary-50 text-primary-600 border-primary-200",
  green: "bg-success-light text-green-700 border-green-200",
  gray: "bg-gray-100 text-gray-600 border-gray-200",
  purple: "bg-purple-50 text-purple-600 border-purple-200",
  amber: "bg-warning-light text-amber-700 border-amber-200",
  red: "bg-error-light text-red-700 border-red-200",
};

export default function Badge({ variant = "blue", children, className }: BadgeProps) {
  return (
    <span className={cn("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium", variantStyles[variant], className)}>
      {children}
    </span>
  );
}
