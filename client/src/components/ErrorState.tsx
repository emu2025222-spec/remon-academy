import { AlertTriangle } from "lucide-react";

export function ErrorState({ message = "Something went wrong" }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-red-500">
      <AlertTriangle className="h-10 w-10" />
      <p className="text-sm">{message}</p>
    </div>
  );
}
