import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  Clock,
  CreditCard,
  FileText,
  RefreshCw,
  Wallet,
  BookOpen,
} from "lucide-react";

import { api, getErrorMessage } from "../../services/api";

interface CourseInfo {
  _id?: string;
  title?: string;
  subject?: string;
  classLevel?: string;
  fee?: number;
}

interface FeeRecord {
  _id: string;
  student: string | {
    _id?: string;
    fullName?: string;
    studentId?: string;
  };
  course?: CourseInfo | string | null;

  billingMonth?: string;
  amount: number;
  amountPaid: number;
  dueDate?: string;
  status?: "PAID" | "PARTIAL" | "PENDING" | string;

  paymentDate?: string;
  paymentMethod?: string;
  transactionId?: string;
  note?: string;

  createdAt?: string;
  updatedAt?: string;
}

interface MonthlySummary {
  month: string;
  totalFee: number;
  totalPaid: number;
  totalDue: number;
  records: number;
}

interface CourseSummary {
  courseId: string;
  course?: CourseInfo | null;
  totalFee: number;
  totalPaid: number;
  totalDue: number;
  records: number;
}

interface StudentFeeResponse {
  fees: FeeRecord[];
  totalFee: number;
  totalPaid: number;
  totalDue: number;
  pendingTotal: number;
  totalRecords: number;
  paidPercentage: number;
  duePercentage: number;
  monthlySummary: MonthlySummary[];
  courseSummary: CourseSummary[];
}

const emptyData: StudentFeeResponse = {
  fees: [],
  totalFee: 0,
  totalPaid: 0,
  totalDue: 0,
  pendingTotal: 0,
  totalRecords: 0,
  paidPercentage: 0,
  duePercentage: 0,
  monthlySummary: [],
  courseSummary: [],
};

function money(value: number) {
  return `৳${Number(value || 0).toLocaleString("en-BD")}`;
}

function formatMonth(month?: string) {
  if (!month || month === "UNASSIGNED") {
    return "Previous / Unassigned";
  }

  const [year, monthNumber] = month.split("-");

  if (!year || !monthNumber) return month;

  const date = new Date(
    Number(year),
    Number(monthNumber) - 1,
    1
  );

  return date.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

function formatDate(value?: string) {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "-";

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getCourseName(course?: FeeRecord["course"]) {
  if (!course) return "Course information unavailable";

  if (typeof course === "string") {
    return "Course";
  }

  return course.title || course.subject || "Course";
}

function getCourseDetails(course?: FeeRecord["course"]) {
  if (!course || typeof course === "string") return "";

  return [course.classLevel, course.subject]
    .filter(Boolean)
    .join(" • ");
}

function getStatus(fee: FeeRecord) {
  const amount = Number(fee.amount || 0);
  const paid = Number(fee.amountPaid || 0);

  // Use the same status logic as Admin Fees.
  if (paid >= amount && amount > 0) return "PAID";
  if (paid > 0) return "PARTIAL";

  return "PENDING";
}

function statusClass(status: string) {
  if (status === "PAID") {
    return "bg-green-100 text-green-700 dark:bg-green-950/50 dark:text-green-400";
  }

  if (status === "PARTIAL") {
    return "bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400";
  }

  return "bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-400";
}

function getStudentFeeData(response: any): StudentFeeResponse {
  // API success response: response.data.data
  const payload = response?.data?.data;

  if (!payload || !Array.isArray(payload.fees)) {
    throw new Error("Invalid fee data received from server.");
  }

  return {
    ...emptyData,
    ...payload,
    fees: payload.fees,
    monthlySummary: Array.isArray(payload.monthlySummary)
      ? payload.monthlySummary
      : [],
    courseSummary: Array.isArray(payload.courseSummary)
      ? payload.courseSummary
      : [],
  };
}

export default function StudentFees() {
  const [data, setData] = useState<StudentFeeResponse>(emptyData);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("ALL");
  const [selectedStatus, setSelectedStatus] = useState("ALL");

  const loadFees = useCallback(async (refresh = false) => {
    try {
      if (refresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      // Backend automatically resolves the logged-in student's ID.
      // Do not send a manually selected student ID.
      const response = await api.get("/fees/my");

      const result = getStudentFeeData(response);

      // Keep every original fee record and its database ID.
      setData(result);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void loadFees();
  }, [loadFees]);

  const months = useMemo(() => {
    return Array.from(
      new Set(
        data.fees.map((fee) => fee.billingMonth || "UNASSIGNED")
      )
    ).sort((a, b) => {
      if (a === "UNASSIGNED") return 1;
      if (b === "UNASSIGNED") return -1;
      return b.localeCompare(a);
    });
  }, [data.fees]);

  const filteredFees = useMemo(() => {
    return data.fees.filter((fee) => {
      const month = fee.billingMonth || "UNASSIGNED";
      const status = getStatus(fee);

      const matchesMonth =
        selectedMonth === "ALL" || month === selectedMonth;

      const matchesStatus =
        selectedStatus === "ALL" || status === selectedStatus;

      return matchesMonth && matchesStatus;
    });
  }, [data.fees, selectedMonth, selectedStatus]);

  const filteredTotals = useMemo(() => {
    return filteredFees.reduce(
      (total, fee) => {
        const amount = Number(fee.amount || 0);
        const paid = Number(fee.amountPaid || 0);

        total.fee += amount;
        total.paid += paid;
        total.due += Math.max(amount - paid, 0);

        return total;
      },
      { fee: 0, paid: 0, due: 0 }
    );
  }, [filteredFees]);

  const paidPercentage =
    data.totalFee > 0
      ? Math.min(100, (data.totalPaid / data.totalFee) * 100)
      : 0;

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      {/* HEADER */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs font-bold tracking-widest text-indigo-500">
            <Wallet size={16} />
            STUDENT PORTAL
          </div>

          <h1 className="text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
            My Fees
          </h1>

          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            View your monthly course fees, payments and outstanding dues.
          </p>
        </div>

        <button
          type="button"
          onClick={() => void loadFees(true)}
          disabled={loading || refreshing}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:hover:bg-slate-800"
        >
          <RefreshCw
            size={16}
            className={refreshing ? "animate-spin" : ""}
          />
          Refresh
        </button>
      </div>

      {/* ERROR */}
      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-5 dark:border-red-900 dark:bg-red-950/30">
          <div className="flex items-center gap-2 font-bold text-red-700 dark:text-red-400">
            <AlertCircle size={19} />
            Unable to load fees
          </div>

          <p className="mt-2 break-words text-sm text-red-600 dark:text-red-400">
            {error}
          </p>

          <button
            type="button"
            onClick={() => void loadFees()}
            className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
          >
            Try again
          </button>
        </div>
      )}

      {/* LOADING */}
      {loading ? (
        <div className="flex min-h-64 items-center justify-center">
          <div className="text-center">
            <RefreshCw
              size={30}
              className="mx-auto animate-spin text-indigo-500"
            />
            <p className="mt-3 text-sm text-slate-500">
              Loading your fee history...
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* OVERALL SUMMARY */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <SummaryCard
              title="Total Fees"
              amount={money(data.totalFee)}
              icon={<Wallet size={22} />}
              color="indigo"
            />

            <SummaryCard
              title="Total Paid"
              amount={money(data.totalPaid)}
              icon={<CheckCircle2 size={22} />}
              color="green"
            />

            <SummaryCard
              title="Total Due"
              amount={money(data.totalDue)}
              icon={<Clock size={22} />}
              color="red"
            />
          </div>

          {/* PAYMENT PROGRESS */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h2 className="font-bold text-slate-900 dark:text-white">
                  Payment Progress
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  Overall payment completion
                </p>
              </div>

              <span className="text-xl font-bold text-indigo-600">
                {paidPercentage.toFixed(0)}%
              </span>
            </div>

            <div className="h-3 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
              <div
                className="h-full rounded-full bg-indigo-600 transition-all duration-500"
                style={{ width: `${paidPercentage}%` }}
              />
            </div>

            <div className="mt-3 flex justify-between text-xs text-slate-500">
              <span>Paid: {money(data.totalPaid)}</span>
              <span>Total: {money(data.totalFee)}</span>
            </div>
          </section>

          {/* COURSE SUMMARY */}
          {data.courseSummary.length > 0 && (
            <section className="space-y-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Course-wise Fees
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Your fee summary for each enrolled course
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                {data.courseSummary.map((item) => (
                  <div
                    key={item.courseId}
                    className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900"
                  >
                    <div className="flex items-start gap-3">
                      <div className="rounded-xl bg-indigo-100 p-3 text-indigo-600 dark:bg-indigo-950">
                        <BookOpen size={20} />
                      </div>

                      <div className="min-w-0">
                        <h3 className="font-bold text-slate-900 dark:text-white">
                          {item.course?.title ||
                            item.course?.subject ||
                            "Course"}
                        </h3>

                        <p className="mt-1 text-xs text-slate-500">
                          {[
                            item.course?.classLevel,
                            item.course?.subject,
                          ]
                            .filter(Boolean)
                            .join(" • ") || "Course fee details"}
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 grid grid-cols-3 gap-2 border-t border-slate-100 pt-4 dark:border-slate-800">
                      <Amount label="Fee" value={item.totalFee} />
                      <Amount
                        label="Paid"
                        value={item.totalPaid}
                        color="green"
                      />
                      <Amount
                        label="Due"
                        value={item.totalDue}
                        color="red"
                      />
                    </div>

                    <p className="mt-3 text-xs text-slate-500">
                      {item.records} fee record(s)
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* MONTHLY SUMMARY */}
          {data.monthlySummary.length > 0 && (
            <section className="space-y-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Monthly Summary
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Previous and current monthly fee history
                </p>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
                <table className="w-full min-w-[580px] text-left text-sm">
                  <thead className="bg-slate-50 text-xs uppercase text-slate-500 dark:bg-slate-950/50">
                    <tr>
                      <th className="px-5 py-4">Month</th>
                      <th className="px-5 py-4">Records</th>
                      <th className="px-5 py-4">Total Fee</th>
                      <th className="px-5 py-4">Paid</th>
                      <th className="px-5 py-4">Due</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {data.monthlySummary.map((month) => (
                      <tr key={month.month}>
                        <td className="px-5 py-4 font-semibold text-slate-800 dark:text-white">
                          {formatMonth(month.month)}
                        </td>
                        <td className="px-5 py-4 text-slate-500">
                          {month.records}
                        </td>
                        <td className="px-5 py-4 font-medium">
                          {money(month.totalFee)}
                        </td>
                        <td className="px-5 py-4 font-semibold text-green-600">
                          {money(month.totalPaid)}
                        </td>
                        <td className="px-5 py-4 font-semibold text-red-600">
                          {money(month.totalDue)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* INDIVIDUAL RECORDS */}
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <div className="flex flex-col gap-4 border-b border-slate-200 p-5 dark:border-slate-700 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Complete Fee History
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  All fee records assigned to your student account
                </p>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row">
                <select
                  value={selectedMonth}
                  onChange={(event) =>
                    setSelectedMonth(event.target.value)
                  }
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                >
                  <option value="ALL">All Months</option>
                  {months.map((month) => (
                    <option key={month} value={month}>
                      {formatMonth(month)}
                    </option>
                  ))}
                </select>

                <select
                  value={selectedStatus}
                  onChange={(event) =>
                    setSelectedStatus(event.target.value)
                  }
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                >
                  <option value="ALL">All Status</option>
                  <option value="PAID">Paid</option>
                  <option value="PARTIAL">Partial</option>
                  <option value="PENDING">Pending</option>
                </select>
              </div>
            </div>

            {/* FILTERED TOTALS */}
            <div className="grid grid-cols-3 gap-3 border-b border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/40">
              <Amount label="Filtered Fee" value={filteredTotals.fee} />
              <Amount
                label="Filtered Paid"
                value={filteredTotals.paid}
                color="green"
              />
              <Amount
                label="Filtered Due"
                value={filteredTotals.due}
                color="red"
              />
            </div>

            {filteredFees.length === 0 ? (
              <div className="px-5 py-16 text-center">
                <FileText
                  size={38}
                  className="mx-auto text-slate-300"
                />
                <h3 className="mt-4 font-bold text-slate-800 dark:text-white">
                  No fee records found
                </h3>
                <p className="mt-2 text-sm text-slate-500">
                  There are no fee records for the selected filters.
                </p>
              </div>
            ) : (
              <>
                {/* MOBILE RECORDS */}
                <div className="space-y-3 p-4 md:hidden">
                  {filteredFees.map((fee) => (
                    <FeeMobileCard key={fee._id} fee={fee} />
                  ))}
                </div>

                {/* DESKTOP TABLE */}
                <div className="hidden overflow-x-auto md:block">
                  <table className="w-full min-w-[1050px] text-left text-sm">
                    <thead className="bg-slate-50 text-xs uppercase text-slate-500 dark:bg-slate-950/50">
                      <tr>
                        <th className="px-5 py-4">Month</th>
                        <th className="px-5 py-4">Course</th>
                        <th className="px-5 py-4">Fee</th>
                        <th className="px-5 py-4">Paid</th>
                        <th className="px-5 py-4">Due</th>
                        <th className="px-5 py-4">Due Date</th>
                        <th className="px-5 py-4">Payment Date</th>
                        <th className="px-5 py-4">Method</th>
                        <th className="px-5 py-4">Status</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {filteredFees.map((fee) => {
                        const amount = Number(fee.amount || 0);
                        const paid = Number(fee.amountPaid || 0);
                        const due = Math.max(amount - paid, 0);
                        const status = getStatus(fee);

                        return (
                          <tr
                            key={fee._id}
                            className="transition hover:bg-slate-50 dark:hover:bg-slate-800/40"
                          >
                            <td className="whitespace-nowrap px-5 py-4 font-semibold text-slate-800 dark:text-white">
                              {formatMonth(fee.billingMonth)}
                            </td>

                            <td className="px-5 py-4">
                              <p className="font-semibold text-slate-800 dark:text-white">
                                {getCourseName(fee.course)}
                              </p>
                              <p className="mt-1 text-xs text-slate-500">
                                {getCourseDetails(fee.course)}
                              </p>
                            </td>

                            <td className="whitespace-nowrap px-5 py-4">
                              {money(amount)}
                            </td>

                            <td className="whitespace-nowrap px-5 py-4 font-semibold text-green-600">
                              {money(paid)}
                            </td>

                            <td className="whitespace-nowrap px-5 py-4 font-semibold text-red-600">
                              {money(due)}
                            </td>

                            <td className="whitespace-nowrap px-5 py-4 text-slate-500">
                              {formatDate(fee.dueDate)}
                            </td>

                            <td className="whitespace-nowrap px-5 py-4 text-slate-500">
                              {formatDate(fee.paymentDate)}
                            </td>

                            <td className="whitespace-nowrap px-5 py-4 text-slate-500">
                              {fee.paymentMethod || "-"}
                            </td>

                            <td className="px-5 py-4">
                              <StatusBadge status={status} />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </section>

          {/* PAYMENT DETAILS */}
          {filteredFees.some(
            (fee) =>
              fee.transactionId ||
              fee.note ||
              fee.paymentMethod
          ) && (
            <section className="space-y-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Payment Details
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Additional information saved by the administration
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
                {filteredFees
                  .filter(
                    (fee) =>
                      fee.transactionId ||
                      fee.note ||
                      fee.paymentMethod
                  )
                  .map((fee) => (
                    <div
                      key={fee._id}
                      className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900"
                    >
                      <div className="flex items-center gap-2">
                        <CreditCard
                          size={17}
                          className="text-indigo-500"
                        />
                        <h3 className="font-bold text-slate-900 dark:text-white">
                          {getCourseName(fee.course)}
                        </h3>
                      </div>

                      <p className="mt-1 text-xs text-slate-500">
                        {formatMonth(fee.billingMonth)}
                      </p>

                      {fee.paymentMethod && (
                        <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
                          Payment method: {fee.paymentMethod}
                        </p>
                      )}

                      {fee.transactionId && (
                        <p className="mt-2 break-all text-sm text-slate-600 dark:text-slate-300">
                          Transaction ID: {fee.transactionId}
                        </p>
                      )}

                      {fee.note && (
                        <p className="mt-2 whitespace-pre-wrap text-sm text-slate-500">
                          Note: {fee.note}
                        </p>
                      )}
                    </div>
                  ))}
              </div>
            </section>
          )}

          {/* INFO */}
          <div className="flex items-start gap-3 rounded-2xl border border-indigo-100 bg-indigo-50 p-4 dark:border-indigo-900 dark:bg-indigo-950/30">
            <CreditCard
              size={20}
              className="mt-0.5 shrink-0 text-indigo-600"
            />

            <div>
              <h3 className="font-bold text-indigo-900 dark:text-indigo-300">
                Payment Information
              </h3>
              <p className="mt-1 text-sm text-indigo-800 dark:text-indigo-400">
                Your fee records are managed by the academy administration.
                If any payment information is incorrect, please contact the
                administration.
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function SummaryCard({
  title,
  amount,
  icon,
  color,
}: {
  title: string;
  amount: string;
  icon: React.ReactNode;
  color: "indigo" | "green" | "red";
}) {
  const styles = {
    indigo: {
      icon: "bg-indigo-100 text-indigo-600 dark:bg-indigo-950",
      amount: "text-slate-900 dark:text-white",
    },
    green: {
      icon: "bg-green-100 text-green-600 dark:bg-green-950",
      amount: "text-green-600",
    },
    red: {
      icon: "bg-red-100 text-red-600 dark:bg-red-950",
      amount: "text-red-600",
    },
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {title}
          </p>
          <h2 className={`mt-2 text-2xl font-bold ${styles[color].amount}`}>
            {amount}
          </h2>
        </div>

        <div className={`rounded-xl p-3 ${styles[color].icon}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

function Amount({
  label,
  value,
  color = "default",
}: {
  label: string;
  value: number;
  color?: "default" | "green" | "red";
}) {
  const colorClass =
    color === "green"
      ? "text-green-600"
      : color === "red"
        ? "text-red-600"
        : "text-slate-900 dark:text-white";

  return (
    <div className="min-w-0">
      <p className="text-xs text-slate-500">{label}</p>
      <p className={`mt-1 break-words text-sm font-bold sm:text-base ${colorClass}`}>
        {money(value)}
      </p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex whitespace-nowrap rounded-full px-3 py-1 text-xs font-bold ${statusClass(status)}`}
    >
      {status}
    </span>
  );
}

function FeeMobileCard({ fee }: { fee: FeeRecord }) {
  const amount = Number(fee.amount || 0);
  const paid = Number(fee.amountPaid || 0);
  const due = Math.max(amount - paid, 0);
  const status = getStatus(fee);

  return (
    <article className="rounded-xl border border-slate-200 p-4 dark:border-slate-700">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-bold text-slate-900 dark:text-white">
            {getCourseName(fee.course)}
          </h3>
          <p className="mt-1 text-xs text-slate-500">
            {getCourseDetails(fee.course)}
          </p>
          <p className="mt-2 flex items-center gap-1 text-xs text-slate-500">
            <CalendarDays size={13} />
            {formatMonth(fee.billingMonth)}
          </p>
        </div>

        <StatusBadge status={status} />
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 border-t border-slate-100 pt-3 dark:border-slate-700">
        <Amount label="Fee" value={amount} />
        <Amount label="Paid" value={paid} color="green" />
        <Amount label="Due" value={due} color="red" />
      </div>

      <div className="mt-4 space-y-2 border-t border-slate-100 pt-3 text-xs dark:border-slate-700">
        <p className="text-slate-500">
          Due date: <span className="font-semibold text-slate-700 dark:text-slate-200">{formatDate(fee.dueDate)}</span>
        </p>
        <p className="text-slate-500">
          Payment date: <span className="font-semibold text-slate-700 dark:text-slate-200">{formatDate(fee.paymentDate)}</span>
        </p>
        {fee.paymentMethod && (
          <p className="text-slate-500">
            Method: <span className="font-semibold text-slate-700 dark:text-slate-200">{fee.paymentMethod}</span>
          </p>
        )}
        {fee.transactionId && (
          <p className="break-all text-slate-500">
            Transaction ID: <span className="font-semibold text-slate-700 dark:text-slate-200">{fee.transactionId}</span>
          </p>
        )}
        {fee.note && (
          <p className="whitespace-pre-wrap text-slate-500">
            Note: {fee.note}
          </p>
        )}
      </div>
    </article>
  );
}