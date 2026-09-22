import { Loader2 } from "lucide-react";

export function Loader({ label = "Loading..." }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-slate-500">
      <Loader2 className="h-8 w-8 animate-spin text-brand-navy dark:text-brand-goldLight" />
      <p className="text-sm">{label}</p>
    </div>
  );
}

export function ButtonSpinner() {
  return <Loader2 className="h-4 w-4 animate-spin" />;
}
