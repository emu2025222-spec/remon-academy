import { useEffect, useMemo, useState } from "react";
import {
  Users,
  GraduationCap,
  BookOpen,
  Wallet,
  CalendarCheck,
  Mail,
  TrendingUp,
  TrendingDown,
  CircleDollarSign,
  BarChart3,
  PieChart,
  Activity,
  ArrowUpRight,
  Sparkles,
  Bell,
  Clock3,
} from "lucide-react";

import { api } from "../../services/api";
import { Notice } from "../../types";
import { Loader } from "../../components/Loader";

interface StudentStatus {
  active: number;
  inactive: number;
}

interface FeeOverview {
  totalFee: number;
  totalPaid: number;
  totalDue: number;
  totalRecords: number;
}

interface MonthlyFee {
  month: string;
  totalFee: number;
  paid: number;
  due: number;
}

interface CourseStudents {
  courseId: string;
  courseName: string;
  students: number;
}

interface StudentGrowth {
  year: number;
  month: number;
  count: number;
}

interface Stats {
  totalStudents: number;
  activeStudents: number;
  totalCourses: number;
  totalTeachers: number;
  pendingFees: number;
  todayAttendance: number;
  newMessages: number;
  latestNotices: Notice[];

  studentStatus?: StudentStatus;
  feeOverview?: FeeOverview;
  monthlyFees?: MonthlyFee[];
  courseWiseStudents?: CourseStudents[];
  studentGrowth?: StudentGrowth[];
}

const formatMoney = (value: number) =>
  `৳${Number(value || 0).toLocaleString("en-BD")}`;

const formatMonth = (month: string) => {
  if (!month) return "-";

  const [year, monthNumber] = month.split("-");

  return new Date(
    Number(year),
    Number(monthNumber) - 1,
    1
  ).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    api
      .get("/dashboard/admin-stats")
      .then((r) => {
        if (mounted) {
          setStats(r.data.data);
        }
      })
      .catch((err) => {
        console.error("Admin dashboard error:", err);

        if (mounted) {
          setError("Unable to load dashboard analytics.");
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  const monthlyFees = useMemo(
    () => stats?.monthlyFees || [],
    [stats]
  );

  const courseWiseStudents = useMemo(
    () => stats?.courseWiseStudents || [],
    [stats]
  );

  const studentGrowth = useMemo(
    () => stats?.studentGrowth || [],
    [stats]
  );

  if (!stats) {
    return (
      <Loader
        label={error || "Loading dashboard..."}
      />
    );
  }

  const fee = stats.feeOverview || {
    totalFee: 0,
    totalPaid: 0,
    totalDue: 0,
    totalRecords: 0,
  };

  const activeStudents =
    stats.studentStatus?.active ??
    stats.activeStudents;

  const inactiveStudents =
    stats.studentStatus?.inactive ??
    Math.max(
      stats.totalStudents - activeStudents,
      0
    );

  const maxCourseStudents = Math.max(
    ...courseWiseStudents.map(
      (item) => item.students
    ),
    1
  );

  const maxMonthlyValue = Math.max(
    ...monthlyFees.map((item) =>
      Math.max(item.paid, item.due)
    ),
    1
  );

  const maxGrowth = Math.max(
    ...studentGrowth.map(
      (item) => item.count
    ),
    1
  );

  const paidPercentage =
    fee.totalFee > 0
      ? Math.round(
          (fee.totalPaid / fee.totalFee) * 100
        )
      : 0;

  const activePercentage =
    stats.totalStudents > 0
      ? Math.round(
          (activeStudents / stats.totalStudents) * 100
        )
      : 0;

  const cards = [
    {
      icon: Users,
      label: "Total Students",
      value: stats.totalStudents,
      description: "All registered learners",
      color: "bg-violet-50 text-violet-700",
    },
    {
      icon: GraduationCap,
      label: "Active Students",
      value: stats.activeStudents,
      description: "Currently enrolled",
      color: "bg-emerald-50 text-emerald-700",
    },
    {
      icon: BookOpen,
      label: "Academic Courses",
      value: stats.totalCourses,
      description: "Available programs",
      color: "bg-blue-50 text-blue-700",
    },
    {
      icon: Users,
      label: "Teaching Faculty",
      value: stats.totalTeachers,
      description: "Academy educators",
      color: "bg-amber-50 text-amber-700",
    },
    {
      icon: Wallet,
      label: "Pending Fees",
      value: stats.pendingFees,
      description: "Unpaid / partial records",
      color: "bg-rose-50 text-rose-700",
    },
    {
      icon: CalendarCheck,
      label: "Today's Attendance",
      value: stats.todayAttendance,
      description: "Attendance records today",
      color: "bg-cyan-50 text-cyan-700",
    },
    {
      icon: Mail,
      label: "New Messages",
      value: stats.newMessages,
      description: "Unread contact messages",
      color: "bg-slate-100 text-slate-700",
    },
  ];

  return (
    <div className="min-w-0 space-y-6 text-slate-800">

      {/* Dashboard Header */}

      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#101c3a] via-[#192c54] to-[#294779] p-6 text-white shadow-xl sm:p-8">

        <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full border border-white/10" />

        <div className="pointer-events-none absolute -right-5 -top-14 h-52 w-52 rounded-full border border-white/10" />

        <div className="relative flex flex-col justify-between gap-6 lg:flex-row lg:items-end">

          <div>
            <div className="mb-3 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.25em] text-blue-200">
              <Sparkles className="h-4 w-4" />
              REMON ACADEMY
              <span className="text-white/30">/</span>
              ACADEMIC CONTROL CENTER
            </div>

            <h2 className="font-display text-2xl font-bold sm:text-3xl">
              Welcome to your dashboard
            </h2>

            <p className="mt-2 max-w-xl text-sm leading-6 text-blue-100/75">
              Monitor student activity, academic programs,
              attendance and fee collection from one place.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-xs font-semibold text-blue-50 backdrop-blur sm:self-auto">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-300 opacity-60" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
            </span>

            Live academy overview
          </div>

        </div>

        <div className="relative mt-7 grid grid-cols-2 gap-4 border-t border-white/10 pt-5 sm:grid-cols-4">

          <div>
            <p className="text-[10px] uppercase tracking-wider text-blue-200/65">
              Total learners
            </p>
            <p className="mt-1 text-2xl font-bold">
              {stats.totalStudents.toLocaleString("en-BD")}
            </p>
          </div>

          <div>
            <p className="text-[10px] uppercase tracking-wider text-blue-200/65">
              Academic courses
            </p>
            <p className="mt-1 text-2xl font-bold">
              {stats.totalCourses.toLocaleString("en-BD")}
            </p>
          </div>

          <div>
            <p className="text-[10px] uppercase tracking-wider text-blue-200/65">
              Attendance today
            </p>
            <p className="mt-1 text-2xl font-bold">
              {stats.todayAttendance.toLocaleString("en-BD")}
            </p>
          </div>

          <div>
            <p className="text-[10px] uppercase tracking-wider text-blue-200/65">
              Fee collection
            </p>
            <p className="mt-1 text-2xl font-bold">
              {paidPercentage}%
            </p>
          </div>

        </div>
      </section>

      {/* Statistics Cards */}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.label}
              className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
            >

              <div className="flex items-start justify-between gap-3">

                <div className="min-w-0">

                  <p className="text-xs font-semibold text-slate-500">
                    {card.label}
                  </p>

                  <p className="mt-2 font-display text-3xl font-bold tracking-tight text-[#17233f]">
                    {card.value.toLocaleString("en-BD")}
                  </p>

                  <p className="mt-1 text-[11px] text-slate-400">
                    {card.description}
                  </p>

                </div>

                <div className={`rounded-xl p-3 ${card.color}`}>
                  <Icon className="h-5 w-5" />
                </div>

              </div>

              <div className="absolute inset-x-0 bottom-0 h-[3px] origin-left scale-x-0 bg-gradient-to-r from-blue-600 to-violet-500 transition-transform duration-300 group-hover:scale-x-100" />

            </div>
          );
        })}

      </section>

      {/* Financial Overview */}

      <section>

        <div className="mb-4 flex items-center justify-between gap-3">

          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-700">
              Academy finance
            </p>

            <h3 className="mt-1 font-display text-xl font-bold text-[#17233f]">
              Financial Overview
            </h3>
          </div>

          <div className="rounded-xl bg-blue-50 p-2.5 text-blue-700">
            <CircleDollarSign className="h-5 w-5" />
          </div>

        </div>

        <div className="grid gap-4 md:grid-cols-3">

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">
                Total Fee
              </span>

              <Wallet className="h-5 w-5 text-blue-600" />
            </div>

            <p className="mt-3 font-display text-2xl font-bold text-[#17233f]">
              {formatMoney(fee.totalFee)}
            </p>

            <p className="mt-1 text-[11px] text-slate-400">
              {fee.totalRecords} fee records
            </p>

          </div>

          <div className="rounded-2xl border border-emerald-100 bg-gradient-to-br from-white to-emerald-50/70 p-5 shadow-sm">

            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">
                Total Paid
              </span>

              <TrendingUp className="h-5 w-5 text-emerald-600" />
            </div>

            <p className="mt-3 font-display text-2xl font-bold text-emerald-700">
              {formatMoney(fee.totalPaid)}
            </p>

            <p className="mt-1 text-[11px] text-emerald-600">
              {paidPercentage}% collected
            </p>

          </div>

          <div className="rounded-2xl border border-rose-100 bg-gradient-to-br from-white to-rose-50/70 p-5 shadow-sm">

            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">
                Total Due
              </span>

              <TrendingDown className="h-5 w-5 text-rose-600" />
            </div>

            <p className="mt-3 font-display text-2xl font-bold text-rose-700">
              {formatMoney(fee.totalDue)}
            </p>

            <p className="mt-1 text-[11px] text-rose-500">
              Outstanding amount
            </p>

          </div>

        </div>

      </section>

      {/* Student Status and Fee Collection */}

      <div className="grid gap-5 xl:grid-cols-2">

        {/* Student Status */}

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">

          <div className="mb-6 flex items-center justify-between">

            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-blue-700">
                Enrollment
              </p>

              <h3 className="mt-1 font-display text-lg font-bold text-[#17233f]">
                Student Status
              </h3>
            </div>

            <PieChart className="h-5 w-5 text-slate-400" />

          </div>

          <div className="flex flex-col items-center gap-6 sm:flex-row">

            <div
              className="relative h-40 w-40 shrink-0 rounded-full"
              style={{
                background: `conic-gradient(
                  #2563eb 0% ${activePercentage}%,
                  #e8edf5 ${activePercentage}% 100%
                )`,
              }}
            >

              <div className="absolute inset-5 flex flex-col items-center justify-center rounded-full bg-white">

                <span className="font-display text-3xl font-bold text-[#17233f]">
                  {stats.totalStudents}
                </span>

                <span className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
                  Students
                </span>

              </div>

            </div>

            <div className="w-full space-y-3">

              <div className="flex items-center justify-between rounded-xl bg-blue-50/80 p-4">

                <div className="flex items-center gap-3">
                  <span className="h-3 w-3 rounded-full bg-blue-600" />
                  <span className="text-sm text-slate-600">
                    Active Students
                  </span>
                </div>

                <span className="font-bold text-[#17233f]">
                  {activeStudents}
                </span>

              </div>

              <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4">

                <div className="flex items-center gap-3">
                  <span className="h-3 w-3 rounded-full bg-slate-300" />
                  <span className="text-sm text-slate-600">
                    Inactive Students
                  </span>
                </div>

                <span className="font-bold text-[#17233f]">
                  {inactiveStudents}
                </span>

              </div>

              <p className="text-xs text-slate-400">
                {activePercentage}% of registered students are currently active.
              </p>

            </div>

          </div>

        </section>

        {/* Fee Paid vs Due */}

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">

          <div className="mb-6 flex items-center justify-between">

            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-blue-700">
                Collection Progress
              </p>

              <h3 className="mt-1 font-display text-lg font-bold text-[#17233f]">
                Paid vs Due
              </h3>
            </div>

            <BarChart3 className="h-5 w-5 text-slate-400" />

          </div>

          <div className="space-y-6">

            <div>

              <div className="mb-2 flex justify-between text-sm">

                <span className="font-medium text-slate-600">
                  Paid
                </span>

                <span className="font-bold text-emerald-700">
                  {formatMoney(fee.totalPaid)}
                </span>

              </div>

              <div className="h-3 overflow-hidden rounded-full bg-slate-100">

                <div
                  className="h-full rounded-full bg-emerald-500 transition-all duration-700"
                  style={{
                    width: `${Math.min(paidPercentage, 100)}%`,
                  }}
                />

              </div>

            </div>

            <div>

              <div className="mb-2 flex justify-between text-sm">

                <span className="font-medium text-slate-600">
                  Due
                </span>

                <span className="font-bold text-rose-700">
                  {formatMoney(fee.totalDue)}
                </span>

              </div>

              <div className="h-3 overflow-hidden rounded-full bg-slate-100">

                <div
                  className="h-full rounded-full bg-rose-500 transition-all duration-700"
                  style={{
                    width: `${
                      fee.totalFee > 0
                        ? Math.min(
                            (fee.totalDue / fee.totalFee) * 100,
                            100
                          )
                        : 0
                    }%`,
                  }}
                />

              </div>

            </div>

          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">

            <div className="rounded-xl border border-slate-200 p-4">
              <p className="text-[10px] uppercase tracking-wider text-slate-400">
                Collection Rate
              </p>

              <p className="mt-1 text-xl font-bold text-[#17233f]">
                {paidPercentage}%
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 p-4">
              <p className="text-[10px] uppercase tracking-wider text-slate-400">
                Outstanding
              </p>

              <p className="mt-1 text-lg font-bold text-rose-700">
                {formatMoney(fee.totalDue)}
              </p>
            </div>

          </div>

        </section>

      </div>

      {/* Monthly Fee Collection */}

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">

        <div className="mb-6 flex items-center justify-between">

          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-blue-700">
              Finance Trend
            </p>

            <h3 className="mt-1 font-display text-lg font-bold text-[#17233f]">
              Monthly Fee Collection
            </h3>

            <p className="mt-1 text-xs text-slate-400">
              Paid and due amounts across recent months.
            </p>
          </div>

          <TrendingUp className="h-5 w-5 text-slate-400" />

        </div>

        {monthlyFees.length === 0 ? (

          <div className="flex min-h-[180px] items-center justify-center text-sm text-slate-400">
            No monthly fee data available.
          </div>

        ) : (

          <div className="space-y-5">

            {monthlyFees.map((item) => {

              const paidWidth =
                (item.paid / maxMonthlyValue) * 100;

              const dueWidth =
                (item.due / maxMonthlyValue) * 100;

              return (

                <div key={item.month}>

                  <div className="mb-2 flex items-center justify-between gap-4">

                    <span className="text-sm font-semibold text-slate-700">
                      {formatMonth(item.month)}
                    </span>

                    <span className="text-xs text-slate-400">
                      Total {formatMoney(item.totalFee)}
                    </span>

                  </div>

                  <div className="space-y-2">

                    <div className="flex items-center gap-3">

                      <span className="w-9 text-[10px] font-bold text-emerald-700">
                        Paid
                      </span>

                      <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full bg-emerald-500 transition-all duration-700"
                          style={{
                            width: `${paidWidth}%`,
                          }}
                        />
                      </div>

                      <span className="w-24 text-right text-xs font-semibold text-slate-600">
                        {formatMoney(item.paid)}
                      </span>

                    </div>

                    <div className="flex items-center gap-3">

                      <span className="w-9 text-[10px] font-bold text-rose-700">
                        Due
                      </span>

                      <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full bg-rose-400 transition-all duration-700"
                          style={{
                            width: `${dueWidth}%`,
                          }}
                        />
                      </div>

                      <span className="w-24 text-right text-xs font-semibold text-slate-600">
                        {formatMoney(item.due)}
                      </span>

                    </div>

                  </div>

                </div>

              );

            })}

          </div>

        )}

      </section>

      {/* Course Wise Students */}

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">

        <div className="mb-6 flex items-center justify-between">

          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-blue-700">
              Academic Enrollment
            </p>

            <h3 className="mt-1 font-display text-lg font-bold text-[#17233f]">
              Students by Course
            </h3>
          </div>

          <BookOpen className="h-5 w-5 text-slate-400" />

        </div>

        {courseWiseStudents.length === 0 ? (

          <div className="flex min-h-[150px] items-center justify-center text-sm text-slate-400">
            No course enrollment data available.
          </div>

        ) : (

          <div className="space-y-5">

            {courseWiseStudents.map((course) => (

              <div key={course.courseId}>

                <div className="mb-2 flex items-center justify-between gap-4">

                  <span className="min-w-0 truncate text-sm font-semibold text-slate-700">
                    {course.courseName}
                  </span>

                  <span className="shrink-0 text-sm font-bold text-[#17233f]">
                    {course.students}
                  </span>

                </div>

                <div className="h-3 overflow-hidden rounded-full bg-slate-100">

                  <div
                    className="h-full rounded-full bg-gradient-to-r from-blue-700 to-violet-500 transition-all duration-700"
                    style={{
                      width: `${
                        (course.students / maxCourseStudents) * 100
                      }%`,
                    }}
                  />

                </div>

              </div>

            ))}

          </div>

        )}

      </section>

      {/* Student Growth */}

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">

        <div className="mb-6 flex items-center justify-between">

          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-blue-700">
              Growth
            </p>

            <h3 className="mt-1 font-display text-lg font-bold text-[#17233f]">
              Student Growth
            </h3>
          </div>

          <Activity className="h-5 w-5 text-slate-400" />

        </div>

        {studentGrowth.length === 0 ? (

          <div className="flex min-h-[180px] items-center justify-center text-sm text-slate-400">
            No student growth data available.
          </div>

        ) : (

          <div className="flex h-52 items-end gap-3 overflow-x-auto pb-7">

            {studentGrowth.map((item) => {

              const height = Math.max(
                (item.count / maxGrowth) * 100,
                5
              );

              const label = `${String(item.month).padStart(2, "0")}/${item.year}`;

              return (

                <div
                  key={`${item.year}-${item.month}`}
                  className="group flex h-full min-w-[42px] flex-1 flex-col justify-end"
                >

                  <div className="relative flex flex-1 items-end">

                    <div
                      className="mx-auto flex w-full max-w-[42px] items-start justify-center rounded-t-lg bg-gradient-to-t from-blue-700 to-violet-500 pt-2 text-[10px] font-bold text-white transition group-hover:brightness-110"
                      style={{
                        height: `${height}%`,
                      }}
                      title={`${item.count} students`}
                    >
                      {item.count}
                    </div>

                  </div>

                  <span className="mt-2 text-center text-[10px] text-slate-400">
                    {label}
                  </span>

                </div>

              );

            })}

          </div>

        )}

      </section>

      {/* Latest Notices */}

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">

        <div className="mb-5 flex items-center justify-between">

          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-blue-700">
              Academy Updates
            </p>

            <h3 className="mt-1 font-display text-lg font-bold text-[#17233f]">
              Latest Notices
            </h3>
          </div>

          <Bell className="h-5 w-5 text-slate-400" />

        </div>

        {stats.latestNotices.length === 0 ? (

          <p className="py-8 text-center text-sm text-slate-400">
            No notices available.
          </p>

        ) : (

          <ul className="space-y-3">

            {stats.latestNotices.map((notice) => (

              <li
                key={notice._id}
                className="flex items-center justify-between gap-4 rounded-xl border border-slate-100 p-4 transition hover:border-blue-200 hover:bg-blue-50/40"
              >

                <div className="min-w-0">

                  <p className="truncate text-sm font-semibold text-slate-800">
                    {notice.title}
                  </p>

                  <p className="mt-1 flex items-center gap-1.5 text-[11px] text-slate-400">

                    <Clock3 className="h-3 w-3" />

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

                <ArrowUpRight className="h-4 w-4 shrink-0 text-slate-300" />

              </li>

            ))}

          </ul>

        )}

      </section>

    </div>
  );
}