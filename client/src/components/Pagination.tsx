
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  page: number;
  totalPages: number;
  onChange: (p: number) => void;
}

export function Pagination({
  page,
  totalPages,
  onChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="mt-6 flex items-center justify-center gap-4">
      <button
        type="button"
        onClick={() => onChange(Math.max(1, page - 1))}
        disabled={page <= 1}
        aria-label="Previous page"
        className="
          flex h-10 w-10 items-center justify-center rounded-xl
          border border-[#dedbd3] bg-white text-[#0b1f4d]
          transition-all duration-200
          hover:border-[#c9a24b] hover:bg-[#c9a24b]/10
          focus-visible:outline-none focus-visible:ring-2
          focus-visible:ring-[#c9a24b] focus-visible:ring-offset-2
          disabled:cursor-not-allowed disabled:opacity-40
          disabled:hover:border-[#dedbd3] disabled:hover:bg-white
        "
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      <span className="min-w-[110px] text-center text-sm font-medium text-slate-600">
        Page{" "}
        <span className="font-bold text-[#0b1f4d]">{page}</span>
        {" "}of{" "}
        <span className="font-bold text-[#0b1f4d]">{totalPages}</span>
      </span>

      <button
        type="button"
        onClick={() => onChange(Math.min(totalPages, page + 1))}
        disabled={page >= totalPages}
        aria-label="Next page"
        className="
          flex h-10 w-10 items-center justify-center rounded-xl
          border border-[#dedbd3] bg-white text-[#0b1f4d]
          transition-all duration-200
          hover:border-[#c9a24b] hover:bg-[#c9a24b]/10
          focus-visible:outline-none focus-visible:ring-2
          focus-visible:ring-[#c9a24b] focus-visible:ring-offset-2
          disabled:cursor-not-allowed disabled:opacity-40
          disabled:hover:border-[#dedbd3] disabled:hover:bg-white
        "
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
}
