
import { Loader2 } from "lucide-react";

interface LoaderProps {
  label?: string;
}

export function Loader({ label = "Loading..." }: LoaderProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex flex-col items-center justify-center gap-4 rounded-2xl py-16 text-center"
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-[#c9a24b]/20 bg-[#c9a24b]/10">
        <Loader2 className="h-8 w-8 animate-spin text-[#a17b2e]" />
      </div>

      <p className="text-sm font-medium text-[#0b1f4d]">
        {label}
      </p>
    </div>
  );
}

export function ButtonSpinner() {
  return (
    <Loader2
      className="h-4 w-4 animate-spin"
      aria-hidden="true"
    />
  );
}
