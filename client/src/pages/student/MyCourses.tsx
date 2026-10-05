import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Clock3,
  GraduationCap,
  Wallet,
} from "lucide-react";

import { api, getErrorMessage } from "../../services/api";
import { Course } from "../../types";
import { Loader } from "../../components/Loader";
import { EmptyState } from "../../components/EmptyState";
import { useToast } from "../../components/Toast";

interface StudentProfile {
  course?: Course | string;
  courses?: (Course | string)[];
}

export default function MyCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  const { show } = useToast();

  useEffect(() => {
    api
      .get("/students/me")
      .then((r) => {
        const data: StudentProfile = r.data.data;

        const assignedCourses: Course[] = [];

        /*
         * New multiple-course structure
         */
        if (Array.isArray(data.courses)) {
          data.courses.forEach((course) => {
            if (
              typeof course === "object" &&
              course !== null
            ) {
              assignedCourses.push(course as Course);
            }
          });
        }

        /*
         * Old single-course structure
         * Keeps existing student accounts working.
         */
        if (
          assignedCourses.length === 0 &&
          data.course &&
          typeof data.course === "object"
        ) {
          assignedCourses.push(data.course as Course);
        }

        setCourses(assignedCourses);
        setLoading(false);
      })
      .catch((err) => {
        show(getErrorMessage(err), "error");
        setLoading(false);
      });
  }, [show]);

  if (loading) {
    return <Loader />;
  }

  if (courses.length === 0) {
    return (
      <div className="space-y-8 pb-10">
        <section className="relative overflow-hidden rounded-3xl bg-brand-navyDark px-6 py-8 text-white sm:px-8 sm:py-10">
          <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full border border-brand-goldLight/10" />

          <div className="relative z-10">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-brand-goldLight">
              <GraduationCap className="h-3.5 w-3.5" />
              Academic
            </div>

            <h1 className="font-display text-3xl font-semibold sm:text-4xl">
              My Courses
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/65">
              View all courses currently assigned to your
              student account.
            </p>
          </div>
        </section>

        <div className="card-premium p-8">
          <EmptyState message="You are not enrolled in any course yet. Contact the office to enroll." />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      {/* =========================================================
          HEADER
      ========================================================= */}
      <section className="relative overflow-hidden rounded-3xl bg-brand-navyDark px-6 py-8 text-white sm:px-8 sm:py-10">
        <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full border border-brand-goldLight/10" />

        <div className="absolute -bottom-24 right-24 h-64 w-64 rounded-full border border-brand-goldLight/10" />

        <div className="relative z-10">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-brand-goldLight">
            <BookOpen className="h-3.5 w-3.5" />
            Academic
          </div>

          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
                My Courses
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-white/65">
                All courses currently assigned to your
                student account.
              </p>
            </div>

            <div className="flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-white/75">
              <CheckCircle2 className="h-4 w-4 text-brand-goldLight" />

              {courses.length}{" "}
              {courses.length === 1
                ? "Active Course"
                : "Active Courses"}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          COURSE GRID
      ========================================================= */}
      <section>
        <div className="mb-5">
          <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-brand-gold">
            <GraduationCap className="h-4 w-4" />
            Enrolled Programs
          </div>

          <h2 className="mt-2 font-display text-xl font-semibold text-slate-900 dark:text-white">
            Your assigned courses
          </h2>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Course enrollment is managed by the academy administration.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {courses.map((course, index) => (
            <div
              key={
                course._id ||
                `student-course-${index}`
              }
              className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-brand-goldLight/60 hover:shadow-md dark:border-slate-800 dark:bg-slate-900/40"
            >
              {/* Gold accent */}
              <div className="absolute left-0 top-0 h-full w-1 bg-brand-goldLight opacity-80" />

              <div className="pl-2">
                {/* Top */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-goldLight/15 text-brand-gold">
                    <BookOpen className="h-5 w-5" />
                  </div>

                  <span className="inline-flex items-center gap-1 rounded-full border border-emerald-100 bg-emerald-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-500/10 dark:text-emerald-400">
                    <CheckCircle2 className="h-3 w-3" />
                    Active
                  </span>
                </div>

                {/* Course title */}
                <div className="mt-5">
                  <div className="flex flex-wrap gap-2">
                    {course.classLevel && (
                      <span className="rounded-full bg-brand-navy/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-brand-navy dark:bg-brand-goldLight/10 dark:text-brand-goldLight">
                        {course.classLevel}
                      </span>
                    )}

                    {course.subject && (
                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                        {course.subject}
                      </span>
                    )}
                  </div>

                  <h3 className="mt-4 font-display text-xl font-semibold leading-tight text-slate-900 dark:text-white">
                    {course.title}
                  </h3>

                  {course.description && (
                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
                      {course.description}
                    </p>
                  )}
                </div>

                {/* Course details */}
                <div className="mt-6 space-y-3 border-t border-slate-100 pt-5 dark:border-slate-800">
                  {course.fee !== undefined && (
                    <div className="flex items-center justify-between gap-4">
                      <span className="flex items-center gap-2 text-xs text-slate-400">
                        <Wallet className="h-3.5 w-3.5" />
                        Course Fee
                      </span>

                      <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                        ৳{course.fee}
                      </span>
                    </div>
                  )}

                  {course.duration && (
                    <div className="flex items-center justify-between gap-4">
                      <span className="flex items-center gap-2 text-xs text-slate-400">
                        <Clock3 className="h-3.5 w-3.5" />
                        Duration
                      </span>

                      <span className="max-w-[60%] text-right text-sm font-semibold text-slate-700 dark:text-slate-300">
                        {course.duration}
                      </span>
                    </div>
                  )}

                  {course.schedule && (
                    <div className="flex items-start justify-between gap-4">
                      <span className="flex items-center gap-2 text-xs text-slate-400">
                        <CalendarDays className="h-3.5 w-3.5" />
                        Schedule
                      </span>

                      <span className="max-w-[60%] text-right text-sm font-semibold text-slate-700 dark:text-slate-300">
                        {course.schedule}
                      </span>
                    </div>
                  )}
                </div>

                {/* Bottom */}
                <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
                  <span className="text-[11px] text-slate-400">
                    Academy assigned course
                  </span>

                  <span className="flex items-center gap-1 text-xs font-semibold text-brand-navy dark:text-brand-goldLight">
                    Enrolled
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================
          INFO
      ========================================================= */}
      <section className="rounded-3xl border border-slate-200 bg-slate-50/70 px-6 py-6 dark:border-slate-800 dark:bg-slate-900/30">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-navyDark text-brand-goldLight">
              <GraduationCap className="h-5 w-5" />
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                Need to change your enrollment?
              </p>

              <p className="mt-1 max-w-xl text-xs leading-5 text-slate-400">
                Course enrollment can only be changed by the
                academy administration. Please contact the
                academy office for assistance.
              </p>
            </div>
          </div>

          <Link
            to="/student/profile"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 no-underline transition hover:border-brand-goldLight hover:text-brand-navy dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
          >
            My profile
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </section>
    </div>
  );
}


