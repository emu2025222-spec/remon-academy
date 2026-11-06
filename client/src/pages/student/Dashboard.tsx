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
  Sparkles,
  UserRound,
  ChevronRight,
  Megaphone,
} from "lucide-react";

import { api } from "../../services/api";
import { Course, Notice } from "../../types";
import { Loader } from "../../components/Loader";

interface Summary {
  fullName: string;
  studentId: string;
  course?: Course | string;
  courses?: (Course | string)[];
}

interface FeeSummaryResponse {
  totals?: {
    amount?: number;
    paid?: number;
    due?: number;
    count?: number;
  };
  pendingTotal?: number;
}

export default function StudentDashboard() {
  const [profile, setProfile] = useState<Summary | null>(null);
  const [attendancePct, setAttendancePct] = useState(0);
  const [latestGpa, setLatestGpa] = useState<number | null>(null);
  const [pendingFees, setPendingFees] = useState(0);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    Promise.all([
      api.get("/students/me"),

      api.get("/attendance/my").catch(() => ({
        data: {
          data: {
            stats: {
              percentage: 0,
            },
          },
        },
      })),

      api.get("/results/my").catch(() => ({
        data: {
          data: {
            results: [],
          },
        },
      })),

      api.get("/fees/my").catch(() => ({
        data: {
          data: {
            totals: {
              amount: 0,
              paid: 0,
              due: 0,
              count: 0,
            },
            pendingTotal: 0,
            fees: [],
          },
        },
      })),

      api.get("/notices/public").catch(() => ({
        data: {
          data: [],
        },
      })),
    ])
      .then(
        ([
          profileResponse,
          attendanceResponse,
          resultsResponse,
          feesResponse,
          noticeResponse,
        ]) => {
          if (!mounted) return;

          setProfile(profileResponse.data.data);

          setAttendancePct(
            Number(
              attendanceResponse.data.data.stats?.percentage || 0
            )
          );

          const results =
            resultsResponse.data.data.results || [];

          setLatestGpa(
            results.length ? results[0].gpa : null
          );

          const feeData = feesResponse.data.data as FeeSummaryResponse;

          setPendingFees(
            Number(
              feeData.totals?.due ??
                feeData.pendingTotal ??
                0
            )
          );

          const noticeData =
            noticeResponse.data.data || [];

          setNotices(noticeData.slice(0, 3));
        }
      )
      .catch((error) => {
        console.error("Student dashboard error:", error);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return <Loader label="Loading your dashboard..." />;
  }

  const assignedCourses: Course[] = [];

  if (profile?.courses?.length) {
    profile.courses.forEach((course) => {
      if (course && typeof course === "object") {
        assignedCourses.push(course as Course);
      }
    });
  }

  if (
    assignedCourses.length === 0 &&
    profile?.course &&
    typeof profile.course === "object"
  ) {
    assignedCourses.push(profile.course as Course);
  }

  const courseCount = assignedCourses.length;

  const stats = [
    {
      title: "Assigned Courses",
      value: courseCount,
      subtitle: courseCount === 1 ? "Active course" : "Active courses",
      icon: BookOpen,
      iconStyle:
        "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400",
      accent: "bg-amber-400",
    },
    {
      title: "Attendance",
      value: `${attendancePct}%`,
      subtitle: "Overall attendance",
      icon: CalendarCheck,
      iconStyle:
        "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
      accent: "bg-emerald-500",
    },
    {
      title: "Latest GPA",
      value: latestGpa ?? "N/A",
      subtitle: "Most recent result",
      icon: Award,
      iconStyle:
        "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400",
      accent: "bg-blue-500",
    },
    {
      title: "Pending Fees",
      value: `৳${pendingFees.toLocaleString("en-BD")}`,
      subtitle: "Outstanding amount",
      icon: Wallet,
      iconStyle:
        "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400",
      accent: "bg-rose-500",
    },
  ];

  return (
    <div className="space-y-7 pb-10">
      {/* Welcome Header */}

      <section className="relative isolate overflow-hidden rounded-[28px] bg-gradient-to-br from-[#07172f] via-[#102d53] to-[#174477] px-6 py-8 text-white shadow-xl shadow-blue-950/10 sm:px-9 sm:py-10">
        <div className="pointer-events-none absolute -right-16 -top-24 h-72 w-72 rounded-full border border-white/10" />
        <div className="pointer-events-none absolute -right-5 -top-12 h-52 w-52 rounded-full border border-white/10" />
        <div className="pointer-events-none absolute -bottom-36 left-1/3 h-64 w-64 rounded-full border border-white/10" />

        <div className="absolute right-8 top-8 hidden h-24 w-24 items-center justify-center rounded-3xl border border-white/10 bg-white/5 text-white/20 sm:flex">
          <GraduationCap className="h-14 w-14" />
        </div>

        <div className="relative z-10 max-w-3xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-amber-300/20 bg-amber-300/10 px-3.5 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-amber-200">
            <Sparkles className="h-3.5 w-3.5" />
            REMON Academy · Student Portal
          </div>

          <p className="mb-2 text-sm font-medium text-blue-100/70">
            Welcome back,
          </p>

          <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            {profile?.fullName || "Student"}
            <span className="text-amber-300">.</span>
          </h1>

          <p className="mt-4 max-w-xl text-sm leading-7 text-blue-100/70 sm:text-base">
            Your learning journey, academic progress and important
            academy updates — everything you need in one place.
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-4 py-2.5 text-xs text-white/80 backdrop-blur-sm">
              <UserRound className="h-4 w-4 text-amber-300" />
              <span className="text-white/60">Student ID</span>
              <span className="font-bold text-white">
                {profile?.studentId || "N/A"}
              </span>
            </div>

            <Link
              to="/student/profile"
              className="inline-flex items-center gap-2 rounded-xl bg-amber-300 px-5 py-2.5 text-xs font-bold text-[#102442] no-underline shadow-lg shadow-amber-950/10 transition hover:-translate-y-0.5 hover:bg-amber-200"
            >
              View My Profile
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Dashboard Statistics */}

      <section>
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-gold">
              Overview
            </p>
            <h2 className="mt-1 font-display text-xl font-bold text-slate-900 dark:text-white">
              Your Academic Summary
            </h2>
          </div>

          <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[10px] font-semibold text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
            Live Overview
          </span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.title}
                className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-slate-900/5 dark:border-slate-800 dark:bg-slate-900"
              >
                <div
                  className={`absolute left-0 top-0 h-1 w-full ${stat.accent} opacity-80`}
                />

                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">
                      {stat.title}
                    </p>

                    <p className="mt-3 break-words font-display text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
                      {stat.value}
                    </p>

                    <p className="mt-1.5 text-xs text-slate-400">
                      {stat.subtitle}
                    </p>
                  </div>

                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl transition duration-300 group-hover:scale-110 ${stat.iconStyle}`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Main Dashboard Content */}

      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_350px]">
        {/* Courses */}

        <section className="overflow-hidden rounded-[24px] border border-slate-200/80 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-col justify-between gap-4 border-b border-slate-100 px-5 py-6 dark:border-slate-800 sm:flex-row sm:items-center sm:px-7">
            <div>
              <div className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-brand-gold">
                <BookOpen className="h-4 w-4" />
                Academic
              </div>

              <h2 className="font-display text-xl font-bold text-slate-900 dark:text-white">
                My Courses
              </h2>

              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Your currently assigned courses.
              </p>
            </div>

            <Link
              to="/student/profile"
              className="inline-flex items-center gap-2 text-xs font-bold text-brand-navy no-underline transition hover:text-brand-gold dark:text-amber-300"
            >
              Account Details
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="p-5 sm:p-7">
            {assignedCourses.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/70 px-5 py-12 text-center dark:border-slate-700 dark:bg-slate-950/30">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300">
                  <BookOpen className="h-7 w-7" />
                </div>

                <h3 className="mt-5 text-sm font-bold text-slate-800 dark:text-slate-200">
                  No course assigned yet
                </h3>

                <p className="mx-auto mt-2 max-w-sm text-xs leading-6 text-slate-500 dark:text-slate-400">
                  Your academy administration will assign courses
                  to your student account. Please contact the
                  academy office if you believe this is an error.
                </p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {assignedCourses.map((course, index) => (
                  <article
                    key={course._id || `assigned-course-${index}`}
                    className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 transition duration-300 hover:-translate-y-1 hover:border-amber-300 hover:shadow-lg hover:shadow-slate-900/5 dark:border-slate-800 dark:bg-slate-950/40 dark:hover:border-amber-500/40"
                  >
                    <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-amber-300 to-amber-600" />

                    <div className="pl-2">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="mb-2 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300">
                            <GraduationCap className="h-5 w-5" />
                          </div>

                          <h3 className="break-words font-display text-base font-bold text-slate-900 dark:text-white">
                            {course.title}
                          </h3>

                          {course.subject && (
                            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                              {course.subject}
                            </p>
                          )}
                        </div>

                        <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wide text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-500/10 dark:text-emerald-400">
                          <CheckCircle2 className="h-3 w-3" />
                          Active
                        </span>
                      </div>

                      <div className="mt-5 space-y-3">
                        {course.classLevel && (
                          <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-2.5 text-xs dark:border-slate-800">
                            <span className="text-slate-400">
                              Class
                            </span>
                            <span className="text-right font-semibold text-slate-700 dark:text-slate-300">
                              {course.classLevel}
                            </span>
                          </div>
                        )}

                        {course.duration && (
                          <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-2.5 text-xs dark:border-slate-800">
                            <span className="text-slate-400">
                              Duration
                            </span>
                            <span className="text-right font-semibold text-slate-700 dark:text-slate-300">
                              {course.duration}
                            </span>
                          </div>
                        )}

                        {course.fee !== undefined && (
                          <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-2.5 text-xs dark:border-slate-800">
                            <span className="text-slate-400">
                              Course Fee
                            </span>
                            <span className="text-right font-bold text-slate-800 dark:text-slate-200">
                              ৳{course.fee}
                            </span>
                          </div>
                        )}

                        {course.schedule && (
                          <div className="flex items-start justify-between gap-3 text-xs">
                            <span className="flex shrink-0 items-center gap-1.5 text-slate-400">
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
                  </article>
                ))}
              </div>
            )}

            <div className="mt-5 flex items-start gap-3 rounded-2xl border border-blue-100 bg-blue-50/70 p-4 dark:border-blue-900/30 dark:bg-blue-500/5">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-blue-600 dark:text-blue-400" />

              <p className="text-xs leading-5 text-slate-600 dark:text-slate-400">
                Course enrollment can only be changed by the
                academy administration.
              </p>
            </div>
          </div>
        </section>

        {/* Latest Notices */}

        <section className="overflow-hidden rounded-[24px] border border-slate-200/80 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-start justify-between gap-3 border-b border-slate-100 px-5 py-6 dark:border-slate-800 sm:px-6">
            <div>
              <div className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-brand-gold">
                <Megaphone className="h-4 w-4" />
                Academy Updates
              </div>

              <h2 className="font-display text-xl font-bold text-slate-900 dark:text-white">
                Latest Notices
              </h2>

              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Important announcements.
              </p>
            </div>

            <Link
              to="/student/notices"
              className="inline-flex shrink-0 items-center gap-1 text-[11px] font-bold text-brand-navy no-underline transition hover:text-brand-gold dark:text-amber-300"
            >
              View All
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="p-5 sm:p-6">
            {notices.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-10 text-center dark:border-slate-700">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-400 dark:bg-slate-800">
                  <Bell className="h-5 w-5" />
                </div>

                <p className="mt-3 text-sm font-semibold text-slate-500 dark:text-slate-400">
                  No notices available
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  New announcements will appear here.
                </p>
              </div>
            ) : (
              <div className="space-y-1">
                {notices.map((notice, index) => (
                  <article
                    key={notice._id}
                    className="group border-b border-slate-100 py-4 last:border-0 dark:border-slate-800"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-xs font-bold text-amber-700 dark:bg-amber-500/10 dark:text-amber-300">
                        {String(index + 1).padStart(2, "0")}
                      </div>

                      <div className="min-w-0 flex-1">
                        <h3 className="text-sm font-semibold leading-5 text-slate-800 transition group-hover:text-blue-700 dark:text-slate-200 dark:group-hover:text-blue-300">
                          {notice.title}
                        </h3>

                        <p className="mt-2 flex items-center gap-1.5 text-[10px] font-medium text-slate-400">
                          <CalendarCheck className="h-3 w-3" />
                          {new Date(notice.date).toLocaleDateString(
                            "en-BD",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            }
                          )}
                        </p>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}

            <Link
              to="/student/notices"
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-bold text-slate-600 no-underline transition hover:border-amber-300 hover:bg-amber-50 hover:text-amber-800 dark:border-slate-700 dark:bg-slate-950/40 dark:text-slate-300 dark:hover:bg-amber-500/10"
            >
              Explore All Notices
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </section>
      </div>

      {/* Bottom Information Section */}

      <section className="relative overflow-hidden rounded-[24px] border border-slate-200 bg-gradient-to-r from-slate-50 to-blue-50/70 px-5 py-6 dark:border-slate-800 dark:from-slate-900 dark:to-blue-950/20 sm:px-7">
        <div className="pointer-events-none absolute -right-10 -top-16 h-40 w-40 rounded-full border border-blue-200/50 dark:border-blue-500/10" />

        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#102d53] text-amber-300 shadow-lg shadow-blue-950/10">
              <GraduationCap className="h-6 w-6" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-amber-600 dark:text-amber-300">
                  Keep Growing
                </p>
              </div>

              <h3 className="mt-1 text-sm font-bold text-slate-800 dark:text-slate-200">
                Keep your academic profile updated.
              </h3>

              <p className="mt-1 max-w-xl text-xs leading-5 text-slate-500 dark:text-slate-400">
                Check your attendance, results, fees and academy
                notices regularly to stay informed and make the
                most of your learning journey.
              </p>
            </div>
          </div>

          <Link
            to="/student/profile"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-xs font-bold text-slate-700 no-underline shadow-sm transition hover:-translate-y-0.5 hover:border-amber-300 hover:text-amber-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
          >
            <UserRound className="h-4 w-4" />
            Account Details
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </section>

      {/* Dashboard Footer */}

      <div className="flex flex-col items-center justify-between gap-2 border-t border-slate-200/70 pt-5 text-center dark:border-slate-800 sm:flex-row sm:text-left">
        <p className="text-[10px] font-medium tracking-wide text-slate-400">
          REMON ACADEMY
        </p>

        <p className="text-[10px] text-slate-400">
          Learn. Grow. Achieve.
        </p>
      </div>
    </div>
  );
}