import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../services/api";
import { Course } from "../types";
import { Card } from "../components/Card";
import { Loader } from "../components/Loader";
import { EmptyState } from "../components/EmptyState";
import { ErrorState } from "../components/ErrorState";
import { getErrorMessage } from "../services/api";

export default function Courses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [classLevel, setClassLevel] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    api
      .get("/courses/public", { params: classLevel ? { classLevel } : {} })
      .then((r) => setCourses(r.data.data))
      .catch((e) => setError(getErrorMessage(e)))
      .finally(() => setLoading(false));
  }, [classLevel]);

  return (
    <div className="container-page py-16">
      <div className="mb-10 text-center">
        <h1 className="font-display text-4xl font-bold text-brand-navy dark:text-white">Our Courses</h1>
        <p className="mt-2 text-slate-500">Structured batches for SSC, HSC, and Admission candidates.</p>
      </div>

      <div className="mb-8 flex flex-wrap justify-center gap-2">
        {["", "SSC", "HSC", "Admission"].map((level) => (
          <button
            key={level || "all"}
            onClick={() => setClassLevel(level)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              classLevel === level ? "bg-brand-navy text-white" : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
            }`}
          >
            {level || "All"}
          </button>
        ))}
      </div>

      {loading ? (
        <Loader label="Loading courses..." />
      ) : error ? (
        <ErrorState message={error} />
      ) : courses.length === 0 ? (
        <EmptyState message="No courses available right now." />
      ) : (
        <div className="grid gap-6 md:grid-cols-3">
          {courses.map((c, i) => (
            <Card key={c._id} delay={i * 0.05} className="flex flex-col">
              <span className="mb-2 inline-block w-fit rounded-full bg-brand-navy/10 px-3 py-1 text-xs font-semibold text-brand-navy dark:text-brand-goldLight">
                {c.classLevel}
              </span>
              <h3 className="font-display text-lg font-semibold text-brand-navy dark:text-white">{c.title}</h3>
              <p className="mt-2 line-clamp-3 flex-1 text-sm text-slate-500">{c.description}</p>
              <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4 text-sm dark:border-slate-800">
                <span className="font-bold text-brand-gold">৳{c.fee}</span>
                <Link to={`/courses/${c.slug}`} className="font-semibold text-brand-navy hover:underline dark:text-brand-goldLight">
                  View Details →
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
