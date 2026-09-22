import { ButtonHTMLAttributes, ReactNode } from "react";
import { Loader2 } from "lucide-react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  loading?: boolean;
  children: ReactNode;
}

export function Button({ variant = "primary", loading, children, className = "", disabled, ...rest }: ButtonProps) {
  const base = "inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 font-semibold transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none";
  const variants: Record<string, string> = {
    primary: "bg-brand-navy text-white hover:bg-brand-navyDark shadow-md hover:shadow-lg",
    secondary: "border-2 border-brand-gold text-brand-navy dark:text-brand-goldLight hover:bg-brand-gold hover:text-white",
    ghost: "text-brand-navy dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800",
    danger: "bg-red-600 text-white hover:bg-red-700 shadow-md",
  };

  return (
    <button className={`${base} ${variants[variant]} ${className}`} disabled={disabled || loading} {...rest}>
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
}
