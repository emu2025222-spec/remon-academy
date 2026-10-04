import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({ label, error, className = "", ...rest }, ref) => (
  <div>
    {label && <label className="label-field">{label}</label>}
    <input ref={ref} className={`input-field ${error ? "border-red-500 focus:ring-red-200" : ""} ${className}`} {...rest} />
    {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
  </div>
));
Input.displayName = "Input";
