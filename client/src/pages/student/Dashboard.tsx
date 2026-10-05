import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  Award,
  Bell,
  BookOpen,
  CalendarCheck,
  CheckCircle2,
  Clock3,
  GraduationCap,
  Wallet,
} from "lucide-react";

import { api } from "../../services/api";
import { Course, Notice } from "../../types";
import { Loader } from "../../components/Loader";

interface Summary {
  fullName: string;
  studentId: string;

  // Old single-course field
  course?: Course | string;

  // New multiple-course field
  courses?: (Course | string)[];
}

export default function StudentDashboard() {
  const [profile, setProfile] = useState<Summary | null>(null);
  const [attendancePct, setAttendancePct] = useState(0);
  const [latestGpa, setLatestGpa] = useState<number | null>(null);
  const [pendingFees, setPendingFees] = useState(0);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get("/students/me"),

      api
        .get("/attendance/my")
        .catch(() => ({
          data: {
            data: {
              stats: {
                percentage: 0,
              },
            },
          },
        })),

      api
        .get("/results/my")
        .catch(() => ({
          data: {
            data: {
              results: [],
            },
          },
        })),

      api
        .get("/fees/my")
        .catch(() => ({
          data: {
            data: {
              pendingTotal: 0,
            },
          },
        })),

      api
        .get("/notices/public")
        .catch(() => ({
          data: {
            data: [],
          },
        })),
    ])
      .then(([p, att, res, fees, notice]) => {
        setProfile(p.data.data);

        setAttendancePct(
          att.data.data.stats?.percentage || 0
        );

        const results = res.data.data.results || [];

        setLatestGpa(
          results.length ? results[0].gpa : null
        );

        setPendingFees(
          fees.data.data.pendingTotal || 0
        );

        setNotices(
          (notice.data.data || []).slice(0, 3)
        );

        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <Loader label="Loading your dashboard..." />;
  }

  /*
   * Build assigned courses.
   *
   * New students:
   *   profile.courses[]
   *
   * Old students:
   *   profile.course
   *
   * This keeps both old and new student data working.
   */
  const assignedCourses: Course[] = [];

  if (Array.isArray(profile?.courses)) {
    profile.courses.forEach((course) => {
      if (
        typeof course === "object" &&
        course !== null
      ) {
        assignedCourses.push(course as Course);
      }
    });
  }

  // Backward compatibility with old single-course data
  if (
    assignedCourses.length === 0 &&
    profile?.course &&
    typeof profile.course === "object"
  ) {
    assignedCourses.push(
      profile.course as Course
    );
  }

  const courseCount = assignedCourses.length;

  return (
    <div className="space-y-8 pb-10">
      {/* =========================================================
          HEADER
      ========================================================= */}
      <section className="relative overflow-hidden rounded-3xl bg-brand-navyDark px-6 py-8 text-white shadow-sm sm:px-8 sm:py-10">
        <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full border border-brand-goldLight/10" />
        <div className="absolute -bottom-24 right-20 h-56 w-56 rounded-full border border-brand-goldLight/10" />

        <div className="relative z-10">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-goldLight">
            <GraduationCap className="h-3.5 w-3.5" />
            Student Portal
          </div>

          <h1 className="max-w-3xl font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            Welcome back, {profile?.fullName}
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-white/65">
            Your academic overview, assigned courses,
            attendance, results and important academy
            updates — all in one place.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-white/70">
              Student ID:
              <span className="ml-1.5 font-semibold text-white">
                {profile?.studentId}
              </span>
            </div>

            <Link
              to="/student/profile"
              className="inline-flex items-center gap-2 rounded-full bg-brand-goldLight px-4 py-2 text-xs font-bold text-brand-navyDark no-underline transition hover:-translate-y-0.5"
            >
              View profile
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================
          SUMMARY STATS
      ========================================================= */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {/* Courses */}
        <div className="card-premium group relative overflow-hidden p-5">
          <div className="absolute right-0 top-0 h-20 w-20 rounded-bl-[60px] bg-brand-goldLight/10" />

          <div className="relative flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                Assigned Courses
              </p>

              <p className="mt-2 font-display text-2xl font-semibold text-slate-900 dark:text-white">
                {courseCount}
              </p>

              <p className="mt-1 text-xs text-slate-400">
                {courseCount === 1
                  ? "Active course"
                  : "Active courses"}
              </p>
            </div>

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-goldLight/15 text-brand-gold">
              <BookOpen className="h-5 w-5" />
            </div>
          </div>
        </div>

        {/* Attendance */}
        <div className="card-premium group relative overflow-hidden p-5">
          <div className="absolute right-0 top-0 h-20 w-20 rounded-bl-[60px] bg-emerald-500/5" />

          <div className="relative flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                Attendance
              </p>

              <p className="mt-2 font-display text-2xl font-semibold text-slate-900 dark:text-white">
                {attendancePct}%
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Overall attendance
              </p>
            </div>

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
              <CalendarCheck className="h-5 w-5" />
            </div>
          </div>
        </div>

        {/* GPA */}
        <div className="card-premium group relative overflow-hidden p-5">
          <div className="absolute right-0 top-0 h-20 w-20 rounded-bl-[60px] bg-blue-500/5" />

          <div className="relative flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                Latest GPA
              </p>

              <p className="mt-2 font-display text-2xl font-semibold text-slate-900 dark:text-white">
                {latestGpa ?? "N/A"}
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Most recent result
              </p>
            </div>

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
              <Award className="h-5 w-5" />
            </div>
          </div>
        </div>

        {/* Fees */}
        <div className="card-premium group relative overflow-hidden p-5">
          <div className="absolute right-0 top-0 h-20 w-20 rounded-bl-[60px] bg-amber-500/5" />

          <div className="relative flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                Pending Fees
              </p>

              <p className="mt-2 font-display text-2xl font-semibold text-slate-900 dark:text-white">
                ৳{pendingFees}
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Outstanding amount
              </p>
            </div>

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400">
              <Wallet className="h-5 w-5" />
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          MAIN CONTENT
      ========================================================= */}
      <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_360px]">
        {/* =======================================================
            COURSES
        ======================================================= */}
        <section className="card-premium overflow-hidden">
          <div className="border-b border-slate-200/80 px-6 py-6 dark:border-slate-800">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <div className="mb-2 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-brand-gold">
                  <BookOpen className="h-4 w-4" />
                  Academic
                </div>

                <h2 className="font-display text-xl font-semibold text-slate-900 dark:text-white">
                  My Courses
                </h2>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Courses currently assigned to your student account.
                </p>
              </div>

              <Link
                to="/student/profile"
                className="inline-flex items-center gap-2 text-sm font-semibold text-brand-navy no-underline transition hover:text-brand-gold dark:text-brand-goldLight"
              >
                View profile
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="p-6">
            {assignedCourses.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 p-8 text-center dark:border-slate-700 dark:bg-slate-900/30">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-goldLight/15 text-brand-gold">
                  <BookOpen className="h-6 w-6" />
                </div>

                <p className="mt-4 text-sm font-semibold text-slate-700 dark:text-slate-200">
                  No course has been assigned yet.
                </p>

                <p className="mx-auto mt-1 max-w-md text-xs leading-5 text-slate-400">
                  Your academy administration will assign
                  courses to your account. Please contact the
                  academy office if you believe this is an error.
                </p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {assignedCourses.map((course, index) => (
                  <div
                    key={
                      course._id ||
                      `assigned-course-${index}`
                    }
                    className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 transition duration-200 hover:-translate-y-0.5 hover:border-brand-goldLight/60 hover:shadow-sm dark:border-slate-800 dark:bg-slate-900/40"
                  >
                    <div className="absolute left-0 top-0 h-full w-1 bg-brand-goldLight opacity-70" />

                    <div className="pl-2">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="font-display text-base font-semibold text-slate-900 dark:text-white">
                            {course.title}
                          </p>

                          {course.subject && (
                            <p className="mt-1 text-xs text-slate-400">
                              {course.subject}
                            </p>
                          )}
                        </div>

                        <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-emerald-100 bg-emerald-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-500/10 dark:text-emerald-400">
                          <CheckCircle2 className="h-3 w-3" />
                          Active
                        </span>
                      </div>

                      <div className="mt-5 space-y-3">
                        {course.classLevel && (
                          <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-2.5 text-xs dark:border-slate-800">
                            <span className="text-slate-400">
                              Class
                            </span>

                            <span className="font-semibold text-slate-700 dark:text-slate-300">
                              {course.classLevel}
                            </span>
                          </div>
                        )}

                        {course.duration && (
                          <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-2.5 text-xs dark:border-slate-800">
                            <span className="text-slate-400">
                              Duration
                            </span>

                            <span className="font-semibold text-slate-700 dark:text-slate-300">
                              {course.duration}
                            </span>
                          </div>
                        )}

                        {course.fee !== undefined && (
                          <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-2.5 text-xs dark:border-slate-800">
                            <span className="text-slate-400">
                              Course Fee
                            </span>

                            <span className="font-semibold text-slate-700 dark:text-slate-300">
                              ৳{course.fee}
                            </span>
                          </div>
                        )}

                        {course.schedule && (
                          <div className="flex items-start justify-between gap-4 text-xs">
                            <span className="flex items-center gap-1.5 text-slate-400">
                              <Clock3 className="h-3.5 w-3.5" />
                              Schedule
                            </span>

                            <span className="max-w-[65%] text-right font-semibold text-slate-700 dark:text-slate-300">
                              {course.schedule}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-5 flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-900/40">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-gold" />

              <p className="text-xs leading-5 text-slate-500 dark:text-slate-400">
                Course enrollment can only be changed by
                the academy administration.
              </p>
            </div>
          </div>
        </section>

        {/* =======================================================
            NOTICES
        ======================================================= */}
        <section className="card-premium overflow-hidden">
          <div className="border-b border-slate-200/80 px-6 py-6 dark:border-slate-800">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="mb-2 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-brand-gold">
                  <Bell className="h-4 w-4" />
                  Updates
                </div>

                <h2 className="font-display text-xl font-semibold text-slate-900 dark:text-white">
                  Latest Notices
                </h2>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Important academy announcements.
                </p>
              </div>

              <Link
                to="/student/notices"
                className="inline-flex shrink-0 items-center gap-1.5 text-xs font-bold text-brand-navy no-underline hover:text-brand-gold dark:text-brand-goldLight"
              >
                View all
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          <div className="p-6">
            {notices.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-200 p-7 text-center dark:border-slate-700">
                <Bell className="mx-auto h-6 w-6 text-slate-300 dark:text-slate-600" />

                <p className="mt-3 text-sm font-medium text-slate-400">
                  No notices available.
                </p>
              </div>
            ) : (
              <div className="space-y-1">
                {notices.map((notice, index) => (
                  <div
                    key={notice._id}
                    className="group relative border-b border-slate-100 py-4 last:border-0 dark:border-slate-800"
                  >
                    <div className="flex gap-3">
                      <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-brand-goldLight/15 text-brand-gold">
                        <span className="font-display text-xs font-bold">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                      </div>

                      <div className="min-w-0">
                        <p className="text-sm font-semibold leading-5 text-slate-800 dark:text-slate-200">
                          {notice.title}
                        </p>

                        <p className="mt-1 text-[11px] text-slate-400">
                          {new Date(
                            notice.date
                          ).toLocaleDateString("en-BD", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>

      {/* =========================================================
          FOOTER INFO STRIP
      ========================================================= */}
      <section className="rounded-3xl border border-slate-200 bg-slate-50/70 px-6 py-6 dark:border-slate-800 dark:bg-slate-900/30">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-navyDark text-brand-goldLight">
              <GraduationCap className="h-5 w-5" />
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                Keep your academic profile updated.
              </p>

              <p className="mt-1 max-w-xl text-xs leading-5 text-slate-400">
                Check your attendance, results, fees and
                academy notices regularly to stay informed.
              </p>
            </div>
          </div>

          <Link
            to="/student/profile"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 no-underline transition hover:border-brand-goldLight hover:text-brand-navy dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
          >
            Account details
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </section>
    </div>
  );
}


