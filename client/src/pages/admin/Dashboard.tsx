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

  const [year, monthNumber] =
    month.split("-");

  const date = new Date(
    Number(year),
    Number(monthNumber) - 1,
    1
  );

  return date.toLocaleDateString(
    "en-US",
    {
      month: "short",
      year: "numeric",
    }
  );
};

export default function AdminDashboard() {
  const [stats, setStats] =
    useState<Stats | null>(null);

  const [error, setError] =
    useState("");

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
        console.error(
          "Admin dashboard error:",
          err
        );

        if (mounted) {
          setError(
            "Unable to load dashboard analytics."
          );
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
    () =>
      stats?.courseWiseStudents || [],
    [stats]
  );

  const studentGrowth = useMemo(
    () => stats?.studentGrowth || [],
    [stats]
  );

  if (!stats) {
    return (
      <Loader
        label={
          error ||
          "Loading dashboard..."
        }
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
      stats.totalStudents -
        activeStudents,
      0
    );

  const maxCourseStudents =
    Math.max(
      ...courseWiseStudents.map(
        (item) => item.students
      ),
      1
    );

  const maxMonthlyValue =
    Math.max(
      ...monthlyFees.map(
        (item) =>
          Math.max(
            item.paid,
            item.due
          )
      ),
      1
    );

  const maxGrowth =
    Math.max(
      ...studentGrowth.map(
        (item) => item.count
      ),
      1
    );

  const paidPercentage =
    fee.totalFee > 0
      ? Math.round(
          (fee.totalPaid /
            fee.totalFee) *
            100
        )
      : 0;

  const cards = [
    {
      icon: Users,
      label: "Total Students",
      value: stats.totalStudents.toLocaleString(
        "en-BD"
      ),
      description: "All registered students",
    },
    {
      icon: Users,
      label: "Active Students",
      value: stats.activeStudents.toLocaleString(
        "en-BD"
      ),
      description: "Currently active",
    },
    {
      icon: BookOpen,
      label: "Total Courses",
      value: stats.totalCourses.toLocaleString(
        "en-BD"
      ),
      description: "Available courses",
    },
    {
      icon: GraduationCap,
      label: "Total Teachers",
      value: stats.totalTeachers.toLocaleString(
        "en-BD"
      ),
      description: "Active teaching team",
    },
    {
      icon: Wallet,
      label: "Pending Fees",
      value: stats.pendingFees.toLocaleString(
        "en-BD"
      ),
      description: "Unpaid / partial records",
    },
    {
      icon: CalendarCheck,
      label: "Today's Attendance",
      value: stats.todayAttendance.toLocaleString(
        "en-BD"
      ),
      description: "Attendance records today",
    },
    {
      icon: Mail,
      label: "New Messages",
      value: stats.newMessages.toLocaleString(
        "en-BD"
      ),
      description: "Unread contact messages",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-brand-gold">
              REMON ACADEMY
            </p>

            <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
              Admin Dashboard
            </h2>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Overall academy performance and
              financial overview.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-slate-600 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
            <Activity className="h-4 w-4 text-brand-gold" />
            Live Analytics
          </div>
        </div>
      </div>

      {/* Main stats */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.label}
              className="card group relative overflow-hidden p-5 transition duration-300 hover:-translate-y-1"
            >
              <div className="absolute right-0 top-0 h-20 w-20 rounded-full bg-brand-gold/5 blur-2xl" />

              <div className="relative flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    {card.label}
                  </p>

                  <p className="mt-2 font-display text-2xl font-bold text-slate-900 dark:text-white">
                    {card.value}
                  </p>

                  <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                    {card.description}
                  </p>
                </div>

                <div className="rounded-2xl bg-brand-navy/10 p-3 dark:bg-brand-gold/10">
                  <Icon className="h-5 w-5 text-brand-navy dark:text-brand-goldLight" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Financial overview */}
      <section>
        <div className="mb-4 flex items-center gap-2">
          <CircleDollarSign className="h-5 w-5 text-brand-gold" />

          <h3 className="font-display text-lg font-semibold text-slate-900 dark:text-white">
            Financial Overview
          </h3>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="card p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">
                Total Fee
              </span>

              <Wallet className="h-5 w-5 text-slate-400" />
            </div>

            <p className="mt-3 font-display text-2xl font-bold text-slate-900 dark:text-white">
              {formatMoney(
                fee.totalFee
              )}
            </p>

            <p className="mt-1 text-xs text-slate-400">
              {fee.totalRecords} fee records
            </p>
          </div>

          <div className="card p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">
                Total Paid
              </span>

              <TrendingUp className="h-5 w-5 text-emerald-500" />
            </div>

            <p className="mt-3 font-display text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              {formatMoney(
                fee.totalPaid
              )}
            </p>

            <p className="mt-1 text-xs text-slate-400">
              {paidPercentage}% collected
            </p>
          </div>

          <div className="card p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">
                Total Due
              </span>

              <TrendingDown className="h-5 w-5 text-rose-500" />
            </div>

            <p className="mt-3 font-display text-2xl font-bold text-rose-600 dark:text-rose-400">
              {formatMoney(
                fee.totalDue
              )}
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Outstanding amount
            </p>
          </div>
        </div>
      </section>

      {/* Student + Fee charts */}
      <div className="grid gap-6 xl:grid-cols-2">
        {/* Student status */}
        <section className="card p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-brand-gold">
                Students
              </p>

              <h3 className="mt-1 font-display text-lg font-semibold text-slate-900 dark:text-white">
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
                  #b08d57 0% ${stats.totalStudents > 0
                    ? (activeStudents /
                        stats.totalStudents) *
                      100
                    : 0}%,
                  #e2e8f0 ${
                    stats.totalStudents > 0
                      ? (activeStudents /
                          stats.totalStudents) *
                        100
                      : 0
                  }% 100%
                )`,
              }}
            >
              <div className="absolute inset-5 flex flex-col items-center justify-center rounded-full bg-white dark:bg-slate-900">
                <span className="font-display text-2xl font-bold text-slate-900 dark:text-white">
                  {stats.totalStudents}
                </span>

                <span className="text-xs text-slate-400">
                  Students
                </span>
              </div>
            </div>

            <div className="w-full space-y-4">
              <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4 dark:bg-slate-800/50">
                <div className="flex items-center gap-3">
                  <span className="h-3 w-3 rounded-full bg-brand-gold" />
                  <span className="text-sm text-slate-600 dark:text-slate-300">
                    Active
                  </span>
                </div>

                <span className="font-semibold text-slate-900 dark:text-white">
                  {activeStudents}
                </span>
              </div>

              <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4 dark:bg-slate-800/50">
                <div className="flex items-center gap-3">
                  <span className="h-3 w-3 rounded-full bg-slate-300" />
                  <span className="text-sm text-slate-600 dark:text-slate-300">
                    Inactive
                  </span>
                </div>

                <span className="font-semibold text-slate-900 dark:text-white">
                  {inactiveStudents}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Fee paid vs due */}
        <section className="card p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-brand-gold">
                Finance
              </p>

              <h3 className="mt-1 font-display text-lg font-semibold text-slate-900 dark:text-white">
                Paid vs Due
              </h3>
            </div>

            <BarChart3 className="h-5 w-5 text-slate-400" />
          </div>

          <div className="space-y-6">
            <div>
              <div className="mb-2 flex justify-between text-sm">
                <span className="text-slate-500">
                  Paid
                </span>

                <span className="font-semibold text-emerald-600">
                  {formatMoney(
                    fee.totalPaid
                  )}
                </span>
              </div>

              <div className="h-3 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                <div
                  className="h-full rounded-full bg-emerald-500 transition-all duration-700"
                  style={{
                    width: `${Math.min(
                      paidPercentage,
                      100
                    )}%`,
                  }}
                />
              </div>
            </div>

            <div>
              <div className="mb-2 flex justify-between text-sm">
                <span className="text-slate-500">
                  Due
                </span>

                <span className="font-semibold text-rose-600">
                  {formatMoney(
                    fee.totalDue
                  )}
                </span>
              </div>

              <div className="h-3 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                <div
                  className="h-full rounded-full bg-rose-500 transition-all duration-700"
                  style={{
                    width: `${
                      fee.totalFee > 0
                        ? Math.min(
                            (fee.totalDue /
                              fee.totalFee) *
                              100,
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
            <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-800">
              <p className="text-xs text-slate-400">
                Collection
              </p>

              <p className="mt-1 text-lg font-bold text-slate-900 dark:text-white">
                {paidPercentage}%
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-800">
              <p className="text-xs text-slate-400">
                Outstanding
              </p>

              <p className="mt-1 text-lg font-bold text-slate-900 dark:text-white">
                {formatMoney(
                  fee.totalDue
                )}
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* Monthly fee collection */}
      <section className="card p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-gold">
              Finance Trend
            </p>

            <h3 className="mt-1 font-display text-lg font-semibold text-slate-900 dark:text-white">
              Monthly Fee Collection
            </h3>

            <p className="mt-1 text-sm text-slate-400">
              Paid and due amount over the latest months.
            </p>
          </div>

          <TrendingUp className="h-5 w-5 text-slate-400" />
        </div>

        {monthlyFees.length === 0 ? (
          <div className="flex min-h-[220px] items-center justify-center text-sm text-slate-400">
            No monthly fee data available.
          </div>
        ) : (
          <div className="space-y-5">
            {monthlyFees.map((item) => {
              const paidWidth =
                (item.paid /
                  maxMonthlyValue) *
                100;

              const dueWidth =
                (item.due /
                  maxMonthlyValue) *
                100;

              return (
                <div key={item.month}>
                  <div className="mb-2 flex items-center justify-between gap-4">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {formatMonth(
                        item.month
                      )}
                    </span>

                    <span className="text-xs text-slate-400">
                      {formatMoney(
                        item.totalFee
                      )}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="w-10 text-[11px] font-medium text-emerald-600">
                        Paid
                      </span>

                      <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                        <div
                          className="h-full rounded-full bg-emerald-500 transition-all duration-700"
                          style={{
                            width: `${paidWidth}%`,
                          }}
                        />
                      </div>

                      <span className="w-24 text-right text-xs font-medium text-slate-600 dark:text-slate-300">
                        {formatMoney(
                          item.paid
                        )}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="w-10 text-[11px] font-medium text-rose-600">
                        Due
                      </span>

                      <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                        <div
                          className="h-full rounded-full bg-rose-500 transition-all duration-700"
                          style={{
                            width: `${dueWidth}%`,
                          }}
                        />
                      </div>

                      <span className="w-24 text-right text-xs font-medium text-slate-600 dark:text-slate-300">
                        {formatMoney(
                          item.due
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Course-wise students */}
      <section className="card p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-gold">
              Enrollment
            </p>

            <h3 className="mt-1 font-display text-lg font-semibold text-slate-900 dark:text-white">
              Students by Course
            </h3>
          </div>

          <BarChart3 className="h-5 w-5 text-slate-400" />
        </div>

        {courseWiseStudents.length === 0 ? (
          <div className="flex min-h-[180px] items-center justify-center text-sm text-slate-400">
            No course enrollment data available.
          </div>
        ) : (
          <div className="space-y-5">
            {courseWiseStudents.map(
              (course) => (
                <div key={course.courseId}>
                  <div className="mb-2 flex items-center justify-between gap-4">
                    <span className="min-w-0 truncate text-sm font-medium text-slate-700 dark:text-slate-300">
                      {course.courseName}
                    </span>

                    <span className="shrink-0 text-sm font-bold text-slate-900 dark:text-white">
                      {course.students}
                    </span>
                  </div>

                  <div className="h-3 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                    <div
                      className="h-full rounded-full bg-brand-navy transition-all duration-700 dark:bg-brand-gold"
                      style={{
                        width: `${
                          (course.students /
                            maxCourseStudents) *
                          100
                        }%`,
                      }}
                    />
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </section>

      {/* Student growth */}
      <section className="card p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-gold">
              Growth
            </p>

            <h3 className="mt-1 font-display text-lg font-semibold text-slate-900 dark:text-white">
              Student Growth
            </h3>
          </div>

          <TrendingUp className="h-5 w-5 text-slate-400" />
        </div>

        {studentGrowth.length === 0 ? (
          <div className="flex min-h-[180px] items-center justify-center text-sm text-slate-400">
            No student growth data available.
          </div>
        ) : (
          <div className="flex h-52 items-end gap-3 overflow-x-auto pb-7">
            {studentGrowth.map(
              (item) => {
                const height =
                  Math.max(
                    (item.count /
                      maxGrowth) *
                      100,
                    5
                  );

                const label = `${String(
                  item.month
                ).padStart(
                  2,
                  "0"
                )}/${item.year}`;

                return (
                  <div
                    key={`${item.year}-${item.month}`}
                    className="group flex h-full min-w-[42px] flex-1 flex-col justify-end"
                  >
                    <div className="relative flex flex-1 items-end">
                      <div
                        className="mx-auto w-full max-w-[42px] rounded-t-xl bg-brand-navy transition-all duration-700 group-hover:opacity-80 dark:bg-brand-gold"
                        style={{
                          height: `${height}%`,
                        }}
                        title={`${item.count} students`}
                      >
                        <div className="flex h-full items-start justify-center pt-2 text-[10px] font-bold text-white dark:text-slate-950">
                          {item.count}
                        </div>
                      </div>
                    </div>

                    <span className="mt-2 text-center text-[10px] text-slate-400">
                      {label}
                    </span>
                  </div>
                );
              }
            )}
          </div>
        )}
      </section>

      {/* Latest notices */}
      <section className="card p-6">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-gold">
              Updates
            </p>

            <h3 className="mt-1 font-display text-lg font-semibold text-slate-900 dark:text-white">
              Latest Notices
            </h3>
          </div>

          <Activity className="h-5 w-5 text-slate-400" />
        </div>

        {stats.latestNotices.length ===
        0 ? (
          <p className="py-8 text-center text-sm text-slate-400">
            No notices available.
          </p>
        ) : (
          <ul className="space-y-3">
            {stats.latestNotices.map(
              (notice) => (
                <li
                  key={notice._id}
                  className="flex items-center justify-between gap-4 rounded-xl border border-slate-100 p-4 transition hover:border-slate-200 dark:border-slate-800 dark:hover:border-slate-700"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium text-slate-800 dark:text-slate-200">
                      {notice.title}
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      {new Date(
                        notice.date
                      ).toLocaleDateString(
                        "en-BD",
                        {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        }
                      )}
                    </p>
                  </div>

                  <div className="h-2 w-2 shrink-0 rounded-full bg-brand-gold" />
                </li>
              )
            )}
          </ul>
        )}
      </section>
    </div>
  );
}