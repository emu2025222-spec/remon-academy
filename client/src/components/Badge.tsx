import { ReactNode } from "react";

export function Badge({ children, color = "navy" }: { children: ReactNode; color?: "navy" | "gold" | "green" | "red" | "gray" }) {
  const colors: Record<string, string> = {
    navy: "bg-brand-navy/10 text-brand-navy dark:text-brand-goldLight",
    gold: "bg-brand-gold/10 text-brand-gold",
    green: "bg-green-100 text-green-700",
    red: "bg-red-100 text-red-700",
    gray: "bg-slate-100 text-slate-600",
  };
  return <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${colors[color]}`}>{children}</span>;
}
