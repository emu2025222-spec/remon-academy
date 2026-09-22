import { GraduationCap, LogIn } from "lucide-react";
import { Link } from "react-router-dom";

export default function Results() {
  return (
    <div className="container-page py-20 text-center">
      <GraduationCap className="mx-auto mb-4 h-14 w-14 text-brand-gold" />
      <h1 className="font-display text-3xl font-bold text-brand-navy dark:text-white">Student Results</h1>
      <p className="mx-auto mt-3 max-w-lg text-slate-500">
        Individual results, subject-wise marks, and GPA are private to each student. Please log in to your student
        dashboard to view your results and performance charts.
      </p>
      <Link to="/login" className="btn-primary mt-6 inline-flex">
        <LogIn className="h-4 w-4" /> Student Login
      </Link>
    </div>
  );
}
