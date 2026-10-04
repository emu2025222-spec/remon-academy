import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { CheckCircle2, Clock, Users, Calendar } from "lucide-react";
import { api, getErrorMessage } from "../services/api";
import { Course, Teacher } from "../types";
import { Loader } from "../components/Loader";
import { ErrorState } from "../components/ErrorState";

export default function CourseDetails() {
  const { id } = useParams();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    api
      .get(`/courses/public/${id}`)
      .then((r) => setCourse(r.data.data))
      .catch((e) => setError(getErrorMessage(e)))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Loader label="Loading course..." />;
  if (error || !course) return <ErrorState message={error || "Course not found"} />;

  const teacher = course.teacher as Teacher | undefined;

  return (
    <div className="container-page py-16">
      <div className="grid gap-10 md:grid-cols-3">
        <div className="md:col-span-2">
          <span className="mb-2 inline-block rounded-full bg-brand-navy/10 px-3 py-1 text-xs font-semibold text-brand-navy dark:text-brand-goldLight">
            {course.classLevel} · {course.subject}
          </span>
          <h1 className="font-display text-3xl font-bold text-brand-navy dark:text-white">{course.title}</h1>
          <p className="mt-4 text-slate-500">{course.description}</p>

          {course.features?.length > 0 && (
            <div className="mt-8">
              <h2 className="mb-3 font-display text-lg font-semibold text-brand-navy dark:text-white">Course Features</h2>
              <ul className="space-y-2">
                {course.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                    <CheckCircle2 className="h-4 w-4 text-brand-gold" /> {f}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {typeof course.teacher === "object" && teacher && (
            <div className="mt-8 card p-6">
              <h2 className="mb-2 font-display text-lg font-semibold text-brand-navy dark:text-white">Instructor</h2>
              <p className="font-semibold">{teacher.name}</p>
              <p className="text-sm text-slate-500">{teacher.designation}</p>
            </div>
          )}
        </div>

        <div className="card h-fit p-6">
          <p className="mb-4 text-center font-display text-3xl font-bold text-brand-gold">৳{course.fee}</p>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-2 text-slate-600 dark:text-slate-300"><Clock className="h-4 w-4 text-brand-navy dark:text-brand-goldLight" /> Duration: {course.duration}</li>
            <li className="flex items-center gap-2 text-slate-600 dark:text-slate-300"><Calendar className="h-4 w-4 text-brand-navy dark:text-brand-goldLight" /> Schedule: {course.schedule || "TBA"}</li>
            <li className="flex items-center gap-2 text-slate-600 dark:text-slate-300"><Users className="h-4 w-4 text-brand-navy dark:text-brand-goldLight" /> Seats: {course.seatCapacity}</li>
          </ul>
          <Link to="/register" className="btn-primary mt-6 w-full">Enroll Now</Link>
        </div>
      </div>
    </div>
  );
}
