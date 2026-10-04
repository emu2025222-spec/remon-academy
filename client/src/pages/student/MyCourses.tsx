import { useEffect, useState } from "react";
import { api } from "../../services/api";
import { Course } from "../../types";
import { Loader } from "../../components/Loader";
import { EmptyState } from "../../components/EmptyState";

export default function MyCourses() {
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/students/me").then((r) => {
      const c = r.data.data.course;
      setCourse(typeof c === "object" ? c : null);
      setLoading(false);
    });
  }, []);

  if (loading) return <Loader />;
  if (!course) return <EmptyState message="You are not enrolled in any course yet. Contact the office to enroll." />;

  return (
    <div>
      <h2 className="mb-6 font-display text-2xl font-bold text-slate-900 dark:text-white">My Course</h2>
      <div className="card max-w-xl p-6">
        <span className="mb-2 inline-block rounded-full bg-brand-navy/10 px-3 py-1 text-xs font-semibold text-brand-navy dark:text-brand-goldLight">
          {course.classLevel} · {course.subject}
        </span>
        <h3 className="font-display text-xl font-semibold text-slate-900 dark:text-white">{course.title}</h3>
        <p className="mt-2 text-sm text-slate-500">{course.description}</p>
        <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <div><p className="text-slate-400">Fee</p><p className="font-semibold">৳{course.fee}</p></div>
          <div><p className="text-slate-400">Duration</p><p className="font-semibold">{course.duration}</p></div>
          <div><p className="text-slate-400">Schedule</p><p className="font-semibold">{course.schedule}</p></div>
        </div>
      </div>
    </div>
  );
}
