import { Inbox } from "lucide-react";

export function EmptyState({ message = "No data found" }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-slate-400">
      <Inbox className="h-10 w-10" />
      <p className="text-sm">{message}</p>
    </div>
  );
}
