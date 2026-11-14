
import { AlertTriangle } from "lucide-react";

interface ErrorStateProps {
  message?: string;
}

export function ErrorState({
  message = "Something went wrong",
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center justify-center rounded-2xl border border-red-100 bg-white px-5 py-16 text-center"
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-red-100 bg-red-50">
        <AlertTriangle
          className="h-8 w-8 text-red-500"
          strokeWidth={1.7}
        />
      </div>

      <p className="mt-4 max-w-md text-sm font-medium leading-6 text-red-600">
        {message}
      </p>
    </div>
  );
}
