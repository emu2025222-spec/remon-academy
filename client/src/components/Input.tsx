
import { InputHTMLAttributes, forwardRef, useId } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = "", id, ...rest }, ref) => {
    const generatedId = useId();
    const inputId = id || generatedId;
    const errorId = `${inputId}-error`;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="mb-2 block text-sm font-semibold text-[#0b1f4d]"
          >
            {label}
          </label>
        )}

        <input
          ref={ref}
          id={inputId}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          className={`
            w-full rounded-xl border bg-white px-4 py-3
            text-sm text-slate-800 placeholder:text-slate-400
            outline-none transition-all duration-200
            disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500
            ${
              error
                ? "border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                : "border-[#dedbd3] hover:border-[#b9b4a8] focus:border-[#c9a24b] focus:ring-4 focus:ring-[#c9a24b]/15"
            }
            ${className}
          `}
          {...rest}
        />

        {error && (
          <p
            id={errorId}
            role="alert"
            className="mt-1.5 text-xs font-medium text-red-600"
          >
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
