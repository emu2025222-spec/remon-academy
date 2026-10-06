import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock3,
  CreditCard,
  FileText,
  ReceiptText,
  Wallet,
  AlertCircle,
} from "lucide-react";

import { api, getErrorMessage } from "../../services/api";
import { Course, Fee, MyFeesResponse } from "../../types";
import { Loader } from "../../components/Loader";
import { EmptyState } from "../../components/EmptyState";

interface FeeWithMonthly extends Fee {
  billingMonth?: string;
}

interface MonthlyGroup {
  month: string;
  label: string;
  records: FeeWithMonthly[];
  totalFee: number;
  totalPaid: number;
  totalDue: number;
}

function getCourse(course: Fee["course"]): Course | null {
  if (!course || typeof course === "string") return null;
  return course as Course;
}

function formatCurrency(value: number) {
  return `৳${Number(value || 0).toLocaleString("en-BD")}`;
}

function formatMonth(month?: string) {
  if (!month) return "Unassigned";

  const [year, monthNumber] = month.split("-");

  if (!year || !monthNumber) return month;

  const date = new Date(Number(year), Number(monthNumber) - 1, 1);

  return date.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

function formatDate(date?: string) {
  if (!date) return "—";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) return "—";

  return parsed.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getStatusLabel(status?: Fee["status"]) {
  if (status === "PAID") return "Paid";
  if (status === "PARTIAL") return "Partial";
  return "Pending";
}

function getStatusClass(status?: Fee["status"]) {
  if (status === "PAID") {
    return "bg-emerald-50 text-emerald-700 border-emerald-200";
  }

  if (status === "PARTIAL") {
    return "bg-amber-50 text-amber-700 border-amber-200";
  }

  return "bg-red-50 text-red-700 border-red-200";
}

export default function StudentFees() {
  const [fees, setFees] = useState<FeeWithMonthly[]>([]);
  const [summary, setSummary] = useState<MyFeesResponse | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedMonth, setSelectedMonth] = useState("ALL");
  const [selectedCourse, setSelectedCourse] = useState("ALL");

  const [openMonths, setOpenMonths] = useState<Record<string, boolean>>({});

  useEffect(() => {
    loadFees();
  }, []);

  async function loadFees() {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/fees/my");

      const payload = response.data?.data;

      const feeList = Array.isArray(payload?.fees) ? payload.fees : [];

      setFees(feeList as FeeWithMonthly[]);
      setSummary(payload as MyFeesResponse);

      const months = Array.from(
        new Set(
          feeList
            .map((fee: FeeWithMonthly) => fee.billingMonth)
            .filter(Boolean)
        )
      ) as string[];

      const initialOpen: Record<string, boolean> = {};

      months.forEach((month) => {
        initialOpen[month] = true;
      });

      setOpenMonths(initialOpen);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  const courseOptions = useMemo(() => {
    const map = new Map<string, string>();

    fees.forEach((fee) => {
      const course = getCourse(fee.course);

      if (course?._id) {
        map.set(
          course._id,
          course.title || course.subject || "Course"
        );
      }
    });

    return Array.from(map.entries()).map(([id, title]) => ({
      id,
      title,
    }));
  }, [fees]);

  const monthOptions = useMemo(() => {
    return Array.from(
      new Set(
        fees
          .map((fee) => fee.billingMonth)
          .filter(Boolean) as string[]
      )
    ).sort((a, b) => b.localeCompare(a));
  }, [fees]);

  const filteredFees = useMemo(() => {
    return fees.filter((fee) => {
      const monthMatch =
        selectedMonth === "ALL" ||
        (fee.billingMonth || "UNASSIGNED") === selectedMonth;

      const course = getCourse(fee.course);

      const courseMatch =
        selectedCourse === "ALL" ||
        course?._id === selectedCourse;

      return monthMatch && courseMatch;
    });
  }, [fees, selectedMonth, selectedCourse]);

  const monthlyGroups = useMemo<MonthlyGroup[]>(() => {
    const grouped = new Map<string, FeeWithMonthly[]>();

    filteredFees.forEach((fee) => {
      const month = fee.billingMonth || "UNASSIGNED";

      if (!grouped.has(month)) {
        grouped.set(month, []);
      }

      grouped.get(month)!.push(fee);
    });

    return Array.from(grouped.entries())
      .map(([month, records]) => {
        const totalFee = records.reduce(
          (sum, fee) => sum + Number(fee.amount || 0),
          0
        );

        const totalPaid = records.reduce(
          (sum, fee) => sum + Number(fee.amountPaid || 0),
          0
        );

        const totalDue = records.reduce(
          (sum, fee) =>
            sum +
            Math.max(
              Number(fee.amount || 0) -
                Number(fee.amountPaid || 0),
              0
            ),
          0
        );

        return {
          month,
          label:
            month === "UNASSIGNED"
              ? "Unassigned Fees"
              : formatMonth(month),
          records: records.sort((a, b) => {
            const courseA = getCourse(a.course)?.title || "";
            const courseB = getCourse(b.course)?.title || "";

            return courseA.localeCompare(courseB);
          }),
          totalFee,
          totalPaid,
          totalDue,
        };
      })
      .sort((a, b) => {
        if (a.month === "UNASSIGNED") return 1;
        if (b.month === "UNASSIGNED") return -1;

        return b.month.localeCompare(a.month);
      });
  }, [filteredFees]);

  const filteredTotals = useMemo(() => {
    const totalFee = filteredFees.reduce(
      (sum, fee) => sum + Number(fee.amount || 0),
      0
    );

    const totalPaid = filteredFees.reduce(
      (sum, fee) => sum + Number(fee.amountPaid || 0),
      0
    );

    const totalDue = filteredFees.reduce(
      (sum, fee) =>
        sum +
        Math.max(
          Number(fee.amount || 0) -
            Number(fee.amountPaid || 0),
          0
        ),
      0
    );

    return {
      totalFee,
      totalPaid,
      totalDue,
    };
  }, [filteredFees]);

  const paidPercentage =
    filteredTotals.totalFee > 0
      ? Math.round(
          (filteredTotals.totalPaid / filteredTotals.totalFee) * 100
        )
      : 0;

  function toggleMonth(month: string) {
    setOpenMonths((current) => ({
      ...current,
      [month]: !current[month],
    }));
  }

  if (loading) {
    return (
      <div className="container-page py-16">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-page py-16">
        <div className="mx-auto max-w-xl rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
          <AlertCircle className="mx-auto mb-3 h-8 w-8 text-red-600" />

          <h2 className="text-lg font-semibold text-red-900">
            Unable to load fees
          </h2>

          <p className="mt-2 text-sm text-red-700">
            {error}
          </p>

          <button
            type="button"
            onClick={loadFees}
            className="mt-5 rounded-xl bg-red-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-800"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!fees.length) {
    return (
      <div className="container-page py-16">
        <EmptyState message="No fee records found" />
        <p className="mt-3 text-center text-sm text-slate-500">
          Your monthly fee records will appear here once the administration adds them.
        </p>
      </div>
    );
  }

  return (
    <div className="container-page space-y-8 py-8 sm:py-10">
      {/* Header */}
      <section className="relative overflow-hidden rounded-[2rem] bg-brand-navyDark px-6 py-8 text-white shadow-[0_20px_60px_rgba(15,23,42,0.18)] sm:px-8 sm:py-10">
        <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-brand-gold/10 blur-3xl" />

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-brand-gold">
              <ReceiptText className="h-4 w-4" />
              Fee Statement
            </div>

            <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              Monthly Fees
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/70 sm:text-base">
              Track your tuition fee month by month with a clear
              breakdown of fee, payment and remaining due amount.
            </p>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
            <CalendarDays className="h-5 w-5 text-brand-gold" />

            <div>
              <p className="text-xs text-white/50">
                Fee Records
              </p>

              <p className="font-semibold">
                {fees.length} monthly record
                {fees.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Overall cards */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="card-premium p-5">
          <div className="flex items-center justify-between">
            <div className="rounded-xl bg-slate-100 p-3">
              <Wallet className="h-5 w-5 text-slate-700" />
            </div>

            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Total Fee
            </span>
          </div>

          <p className="mt-5 text-2xl font-bold text-slate-950">
            {formatCurrency(
              selectedMonth === "ALL" && selectedCourse === "ALL"
                ? Number(summary?.totalFee || 0)
                : filteredTotals.totalFee
            )}
          </p>

          <p className="mt-1 text-sm text-slate-500">
            Across monthly records
          </p>
        </div>

        <div className="card-premium p-5">
          <div className="flex items-center justify-between">
            <div className="rounded-xl bg-emerald-50 p-3">
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            </div>

            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Paid
            </span>
          </div>

          <p className="mt-5 text-2xl font-bold text-emerald-700">
            {formatCurrency(
              selectedMonth === "ALL" && selectedCourse === "ALL"
                ? Number(summary?.totalPaid || 0)
                : filteredTotals.totalPaid
            )}
          </p>

          <p className="mt-1 text-sm text-slate-500">
            {paidPercentage}% payment completed
          </p>
        </div>

        <div className="card-premium p-5">
          <div className="flex items-center justify-between">
            <div className="rounded-xl bg-red-50 p-3">
              <Clock3 className="h-5 w-5 text-red-600" />
            </div>

            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Due
            </span>
          </div>

          <p className="mt-5 text-2xl font-bold text-red-700">
            {formatCurrency(
              selectedMonth === "ALL" && selectedCourse === "ALL"
                ? Number(summary?.totalDue || 0)
                : filteredTotals.totalDue
            )}
          </p>

          <p className="mt-1 text-sm text-slate-500">
            Remaining payment
          </p>
        </div>

        <div className="card-premium p-5">
          <div className="flex items-center justify-between">
            <div className="rounded-xl bg-brand-gold/10 p-3">
              <CreditCard className="h-5 w-5 text-brand-gold" />
            </div>

            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Progress
            </span>
          </div>

          <p className="mt-5 text-2xl font-bold text-slate-950">
            {paidPercentage}%
          </p>

          <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-brand-gold transition-all duration-500"
              style={{
                width: `${Math.min(paidPercentage, 100)}%`,
              }}
            />
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="card-premium p-5 sm:p-6">
        <div className="mb-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-gold">
            Filter Statement
          </p>

          <h2 className="mt-1 text-xl font-semibold text-slate-950">
            View by month or course
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="label-field">
              Billing Month
            </label>

            <select
              value={selectedMonth}
              onChange={(event) =>
                setSelectedMonth(event.target.value)
              }
              className="input-field"
            >
              <option value="ALL">All Months</option>

              {monthOptions.map((month) => (
                <option key={month} value={month}>
                  {formatMonth(month)}
                </option>
              ))}

              {fees.some((fee) => !fee.billingMonth) && (
                <option value="UNASSIGNED">
                  Unassigned Fees
                </option>
              )}
            </select>
          </div>

          <div>
            <label className="label-field">
              Course
            </label>

            <select
              value={selectedCourse}
              onChange={(event) =>
                setSelectedCourse(event.target.value)
              }
              className="input-field"
            >
              <option value="ALL">All Courses</option>

              {courseOptions.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.title}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Monthly statement */}
      <section>
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-gold">
              Monthly Statement
            </p>

            <h2 className="mt-1 text-2xl font-semibold text-slate-950">
              Month → Course → Fee → Paid → Due
            </h2>
          </div>

          <p className="text-sm text-slate-500">
            {filteredFees.length} record
            {filteredFees.length !== 1 ? "s" : ""} shown
          </p>
        </div>

        {!monthlyGroups.length ? (
          <div className="card-premium p-10 text-center">
            <FileText className="mx-auto h-10 w-10 text-slate-300" />

            <h3 className="mt-4 text-lg font-semibold text-slate-900">
              No records for this filter
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Try selecting another month or course.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {monthlyGroups.map((group) => {
              const isOpen =
                openMonths[group.month] !== false;

              return (
                <div
                  key={group.month}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_10px_35px_rgba(15,23,42,0.05)]"
                >
                  {/* Month header */}
                  <button
                    type="button"
                    onClick={() => toggleMonth(group.month)}
                    className="flex w-full flex-col gap-5 p-5 text-left transition hover:bg-slate-50 sm:p-6"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-navyDark text-brand-gold">
                          <CalendarDays className="h-5 w-5" />
                        </div>

                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                            Billing Month
                          </p>

                          <h3 className="mt-1 text-xl font-bold text-slate-950">
                            {group.label}
                          </h3>
                        </div>
                      </div>

                      <div className="rounded-lg border border-slate-200 p-2 text-slate-500">
                        {isOpen ? (
                          <ChevronUp className="h-5 w-5" />
                        ) : (
                          <ChevronDown className="h-5 w-5" />
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3 border-t border-slate-100 pt-4">
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                          Fee
                        </p>

                        <p className="mt-1 text-sm font-bold text-slate-950 sm:text-base">
                          {formatCurrency(group.totalFee)}
                        </p>
                      </div>

                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                          Paid
                        </p>

                        <p className="mt-1 text-sm font-bold text-emerald-700 sm:text-base">
                          {formatCurrency(group.totalPaid)}
                        </p>
                      </div>

                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                          Due
                        </p>

                        <p className="mt-1 text-sm font-bold text-red-700 sm:text-base">
                          {formatCurrency(group.totalDue)}
                        </p>
                      </div>
                    </div>
                  </button>

                  {/* Month records */}
                  {isOpen && (
                    <div className="border-t border-slate-200">
                      {/* Desktop */}
                      <div className="hidden overflow-x-auto md:block">
                        <table className="w-full min-w-[760px]">
                          <thead>
                            <tr className="bg-slate-50 text-left">
                              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                                Course
                              </th>

                              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                                Fee
                              </th>

                              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                                Paid
                              </th>

                              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                                Due
                              </th>

                              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                                Due Date
                              </th>

                              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                                Status
                              </th>
                            </tr>
                          </thead>

                          <tbody className="divide-y divide-slate-100">
                            {group.records.map((fee) => {
                              const course = getCourse(fee.course);

                              const amount = Number(
                                fee.amount || 0
                              );

                              const paid = Number(
                                fee.amountPaid || 0
                              );

                              const due = Math.max(
                                amount - paid,
                                0
                              );

                              return (
                                <tr
                                  key={fee._id}
                                  className="transition hover:bg-slate-50/70"
                                >
                                  <td className="px-6 py-5">
                                    <div>
                                      <p className="font-semibold text-slate-900">
                                        {course?.title ||
                                          "Course"}
                                      </p>

                                      {course?.subject && (
                                        <p className="mt-1 text-xs text-slate-500">
                                          {course.subject}
                                        </p>
                                      )}
                                    </div>
                                  </td>

                                  <td className="px-6 py-5 font-semibold text-slate-900">
                                    {formatCurrency(amount)}
                                  </td>

                                  <td className="px-6 py-5 font-semibold text-emerald-700">
                                    {formatCurrency(paid)}
                                  </td>

                                  <td className="px-6 py-5 font-semibold text-red-700">
                                    {formatCurrency(due)}
                                  </td>

                                  <td className="px-6 py-5 text-sm text-slate-600">
                                    {formatDate(fee.dueDate)}
                                  </td>

                                  <td className="px-6 py-5">
                                    <span
                                      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${getStatusClass(
                                        fee.status
                                      )}`}
                                    >
                                      {getStatusLabel(
                                        fee.status
                                      )}
                                    </span>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>

                      {/* Mobile */}
                      <div className="divide-y divide-slate-100 md:hidden">
                        {group.records.map((fee) => {
                          const course = getCourse(fee.course);

                          const amount = Number(
                            fee.amount || 0
                          );

                          const paid = Number(
                            fee.amountPaid || 0
                          );

                          const due = Math.max(
                            amount - paid,
                            0
                          );

                          return (
                            <div
                              key={fee._id}
                              className="p-5"
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div>
                                  <p className="font-semibold text-slate-950">
                                    {course?.title ||
                                      "Course"}
                                  </p>

                                  {course?.subject && (
                                    <p className="mt-1 text-xs text-slate-500">
                                      {course.subject}
                                    </p>
                                  )}
                                </div>

                                <span
                                  className={`shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${getStatusClass(
                                    fee.status
                                  )}`}
                                >
                                  {getStatusLabel(
                                    fee.status
                                  )}
                                </span>
                              </div>

                              <div className="mt-5 grid grid-cols-3 gap-3">
                                <div className="rounded-xl bg-slate-50 p-3">
                                  <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                                    Fee
                                  </p>

                                  <p className="mt-1 text-sm font-bold text-slate-950">
                                    {formatCurrency(amount)}
                                  </p>
                                </div>

                                <div className="rounded-xl bg-emerald-50 p-3">
                                  <p className="text-[10px] font-semibold uppercase tracking-wider text-emerald-600">
                                    Paid
                                  </p>

                                  <p className="mt-1 text-sm font-bold text-emerald-700">
                                    {formatCurrency(paid)}
                                  </p>
                                </div>

                                <div className="rounded-xl bg-red-50 p-3">
                                  <p className="text-[10px] font-semibold uppercase tracking-wider text-red-600">
                                    Due
                                  </p>

                                  <p className="mt-1 text-sm font-bold text-red-700">
                                    {formatCurrency(due)}
                                  </p>
                                </div>
                              </div>

                              <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4 text-xs text-slate-500">
                                <span>
                                  Due date
                                </span>

                                <span className="font-medium text-slate-700">
                                  {formatDate(fee.dueDate)}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Course summary */}
      {summary?.courseSummary &&
        summary.courseSummary.length > 0 && (
          <section>
            <div className="mb-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-gold">
                Course Breakdown
              </p>

              <h2 className="mt-1 text-2xl font-semibold text-slate-950">
                Course-wise fee summary
              </h2>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {summary.courseSummary.map((item, index) => (
                <div
                  key={
                    item.courseId ||
                    item.course?._id ||
                    `course-${index}`
                  }
                  className="card-premium p-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                        Course
                      </p>

                      <h3 className="mt-1 font-semibold text-slate-950">
                        {item.course?.title ||
                          item.course?.subject ||
                          "Course"}
                      </h3>

                      {item.course?.classLevel && (
                        <p className="mt-1 text-xs text-slate-500">
                          {item.course.classLevel}
                        </p>
                      )}
                    </div>

                    <div className="rounded-xl bg-brand-gold/10 p-3">
                      <CreditCard className="h-5 w-5 text-brand-gold" />
                    </div>
                  </div>

                  <div className="mt-5 grid grid-cols-3 gap-3">
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                        Fee
                      </p>

                      <p className="mt-1 text-sm font-bold text-slate-950">
                        {formatCurrency(item.totalFee)}
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                        Paid
                      </p>

                      <p className="mt-1 text-sm font-bold text-emerald-700">
                        {formatCurrency(item.totalPaid)}
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                        Due
                      </p>

                      <p className="mt-1 text-sm font-bold text-red-700">
                        {formatCurrency(item.totalDue)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
    </div>
  );
}