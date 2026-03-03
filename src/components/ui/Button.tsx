"use client";

import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", isLoading, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          "inline-flex items-center justify-center rounded-full font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          {
            "bg-primary-500 text-secondary-700 hover:bg-primary-600 active:bg-primary-700 shadow-md shadow-primary-500/25 hover:shadow-lg hover:shadow-primary-500/35 active:shadow-sm font-bold": variant === "primary",
            "border-2 border-primary-500 bg-transparent text-primary-400 hover:bg-primary-500/10 active:bg-primary-500/20": variant === "secondary",
            "text-text-secondary hover:bg-surface-white hover:text-text-primary": variant === "ghost",
            "bg-error text-white hover:bg-red-600 active:bg-red-700 shadow-md": variant === "danger",
          },
          {
            "h-8 px-4 text-sm": size === "sm",
            "h-11 px-6 text-sm": size === "md",
            "h-13 px-8 text-base": size === "lg",
          },
          className
        )}
        {...props}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
export default Button;
