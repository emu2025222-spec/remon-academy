import { Link } from "react-router-dom";
import { GraduationCap } from "lucide-react";

export default function NotFound() {
  return (
    <div className="container-page flex min-h-[70vh] flex-col items-center justify-center text-center">
      <GraduationCap className="mb-4 h-16 w-16 text-brand-gold" />
      <h1 className="font-display text-6xl font-bold text-brand-navy dark:text-white">404</h1>
      <p className="mt-2 text-slate-500">The page you're looking for doesn't exist.</p>
      <Link to="/" className="btn-primary mt-6">Back to Home</Link>
    </div>
  );
}
