import { ChevronLeft, ChevronRight } from "lucide-react";

export function Pagination({ page, totalPages, onChange }: { page: number; totalPages: number; onChange: (p: number) => void }) {
  if (totalPages <= 1) return null;
  return (
    <div className="mt-4 flex items-center justify-center gap-2">
      <button
        onClick={() => onChange(Math.max(1, page - 1))}
        disabled={page === 1}
        className="rounded-lg border border-slate-200 dark:border-slate-700 p-2 disabled:opacity-40"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      <span className="text-sm text-slate-500">Page {page} of {totalPages}</span>
      <button
        onClick={() => onChange(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        className="rounded-lg border border-slate-200 dark:border-slate-700 p-2 disabled:opacity-40"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}
