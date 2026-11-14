
import { Inbox } from "lucide-react";

interface EmptyStateProps {
  message?: string;
}

export function EmptyState({
  message = "No data found",
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#dcd7ca] bg-white/70 px-5 py-16 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-[#c9a24b]/20 bg-[#c9a24b]/10">
        <Inbox className="h-8 w-8 text-[#a17b2e]" strokeWidth={1.7} />
      </div>

      <p className="mt-4 max-w-md text-sm font-medium leading-6 text-slate-500">
        {message}
      </p>
    </div>
  );
}
