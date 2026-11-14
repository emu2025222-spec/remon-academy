
import { ButtonHTMLAttributes, ReactNode } from "react";
import { Loader2 } from "lucide-react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  loading?: boolean;
  children: ReactNode;
}

export function Button({
  variant = "primary",
  loading = false,
  children,
  className = "",
  disabled,
  type = "button",
  ...rest
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all duration-200 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a24b] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

  const variants: Record<NonNullable<ButtonProps["variant"]>, string> = {
    primary:
      "bg-[#0b1f4d] text-white shadow-md shadow-[#0b1f4d]/10 hover:-translate-y-0.5 hover:bg-[#071535] hover:shadow-lg",

    secondary:
      "border border-[#c9a24b] bg-white text-[#0b1f4d] hover:bg-[#c9a24b] hover:text-[#071535]",

    ghost:
      "bg-transparent text-[#0b1f4d] hover:bg-[#0b1f4d]/[0.06]",

    danger:
      "bg-red-600 text-white shadow-md shadow-red-600/10 hover:bg-red-700 hover:shadow-lg",
  };

  return (
    <button
      type={type}
      className={`${base} ${variants[variant]} ${className}`}
      disabled={disabled || loading}
      aria-busy={loading}
      {...rest}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
}
