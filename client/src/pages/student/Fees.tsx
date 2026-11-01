
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Wallet,
  CheckCircle2,
  Clock,
  AlertCircle,
  RefreshCw,
  CalendarDays,
  BookOpen,
  CreditCard,
  TrendingUp,
  Receipt,
} from "lucide-react";
const getErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : "An unexpected error occurred.";

type Course = {
  _id?: string;
  title?: string;
  subject?: string;
  classLevel?: string | number;
  fee?: number;
};

type FeeRecord = {
  _id: string;
  course?: Course | string | null;
  billingMonth?: string;
  month?: string;
  fee?: number;
  feeAmount?: number;
  amount?: number;
  paid?: number;
  paidAmount?: number;
  due?: number;
  dueAmount?: number;
  status?: "PAID" | "PARTIAL" | "PENDING" | string;
  dueDate?: string;
  paymentDate?: string;
  paidAt?: string;
  paymentMethod?: string;
  createdAt?: string;
  updatedAt?: string;
};

type FeeData = {
  fees?: FeeRecord[];
  totalFee?: number;
  totalPaid?: number;
  totalDue?: number;
  monthlySummary?: unknown[];
  courseSummary?: unknown[];
  [key: string]: unknown;
};

const money = (value: number) =>
  `৳${Number(value || 0).toLocaleString("en-BD")}`;

const getMonthLabel = (value?: string) => {
  if (!value) return "Month not specified";

  const date = new Date(`${value}-01T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
};

const getCourseName = (course?: Course | string | null) => {
  if (!course) return "Course";
  if (typeof course === "string") return course;
  return course.title || course.subject || "Course";
};

const getStatus = (fee: number, paid: number) => {
  if (paid >= fee && fee > 0) return "PAID";
  if (paid > 0) return "PARTIAL";
  return "PENDING";
};

const statusStyle: Record<string, string> = {
  PAID: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  PARTIAL: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  PENDING: "bg-rose-500/10 text-rose-400 border-rose-500/20",
};

function extractFeeData(response: unknown): FeeData {
  let current = response as Record<string, unknown> | null;

  for (let i = 0; i < 4 && current; i++) {
    if (Array.isArray(current.fees)) {
      return current as FeeData;
    }

    const next =
      current.data && typeof current.data === "object"
        ? (current.data as Record<string, unknown>)
        : null;

    if (!next) break;
    current = next;
  }

  return current && typeof current === "object"
    ? (current as FeeData)
    : {};
}

export default function StudentFees() {
  const [fees, setFees] = useState<FeeRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterMonth, setFilterMonth] = useState("ALL");

  const fetchFees = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/fees/my", {
        credentials: "include",
      });
      const responseData: unknown = await response.json();

      if (!response.ok) {
        const message =
          responseData &&
          typeof responseData === "object" &&
          "message" in responseData
            ? String(responseData.message)
            : `Unable to load fees (${response.status}).`;
        throw new Error(message);
      }

      const data = extractFeeData(responseData);

      setFees(Array.isArray(data.fees) ? data.fees : []);
    } catch (err) {
      setError(getErrorMessage(err));
      setFees([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchFees();
  }, [fetchFees]);

  const normalizedFees = useMemo(() => {
    return fees.map((item) => {
      const fee = Number(
        item.feeAmount ?? item.fee ?? item.amount ?? 0
      );

      const paid = Number(item.paidAmount ?? item.paid ?? 0);
      const due = Math.max(0, Number(item.dueAmount ?? item.due ?? fee - paid));

      const month = item.billingMonth || item.month || "";

      return {
        ...item,
        feeValue: fee,
        paidValue: paid,
        dueValue: due,
        monthValue: month,
        statusValue: getStatus(fee, paid),
      };
    });
  }, [fees]);

  const totals = useMemo(() => {
    return normalizedFees.reduce(
      (acc, item) => ({
        fee: acc.fee + item.feeValue,
        paid: acc.paid + item.paidValue,
        due: acc.due + item.dueValue,
      }),
      { fee: 0, paid: 0, due: 0 }
    );
  }, [normalizedFees]);

  const months = useMemo(() => {
    return Array.from(
      new Set(normalizedFees.map((item) => item.monthValue).filter(Boolean))
    ).sort((a, b) => b.localeCompare(a));
  }, [normalizedFees]);

  const filteredFees = useMemo(() => {
    if (filterMonth === "ALL") return normalizedFees;

    return normalizedFees.filter(
      (item) => item.monthValue === filterMonth
    );
  }, [normalizedFees, filterMonth]);

  const paidPercentage =
    totals.fee > 0
      ? Math.min(100, Math.round((totals.paid / totals.fee) * 100))
      : 0;

  return (
    <div className="min-h-screen space-y-6 bg-slate-950 p-4 text-slate-100 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm font-medium text-emerald-400">
            <Wallet size={17} />
            STUDENT PORTAL
          </div>

          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            My Fees
          </h1>

          <p className="mt-1 text-sm text-slate-400">
            View your monthly course fees, payments and outstanding dues.
          </p>
        </div>

        <button
          onClick={fetchFees}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm font-semibold transition hover:border-emerald-500/50 hover:bg-slate-800 disabled:opacity-50"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex min-h-52 items-center justify-center rounded-2xl border border-slate-800 bg-slate-900/60">
          <div className="text-center">
            <RefreshCw className="mx-auto mb-3 animate-spin text-emerald-400" size={30} />
            <p className="text-sm text-slate-400">Loading your fee records...</p>
          </div>
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 p-5">
          <div className="flex items-center gap-2 font-semibold text-rose-400">
            <AlertCircle size={19} />
            Unable to load fees
          </div>
          <p className="mt-2 text-sm text-slate-300">{error}</p>
          <button
            onClick={fetchFees}
            className="mt-4 rounded-lg bg-rose-500 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-600"
          >
            Try again
          </button>
        </div>
      )}

      {!loading && !error && (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">Total Fee</span>
                <div className="rounded-xl bg-blue-500/10 p-2.5 text-blue-400">
                  <Receipt size={20} />
                </div>
              </div>
              <p className="mt-4 text-2xl font-bold">{money(totals.fee)}</p>
              <p className="mt-1 text-xs text-slate-500">All monthly records</p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">Total Paid</span>
                <div className="rounded-xl bg-emerald-500/10 p-2.5 text-emerald-400">
                  <CheckCircle2 size={20} />
                </div>
              </div>
              <p className="mt-4 text-2xl font-bold text-emerald-400">
                {money(totals.paid)}
              </p>
              <p className="mt-1 text-xs text-slate-500">Successfully paid</p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">Total Due</span>
                <div className="rounded-xl bg-rose-500/10 p-2.5 text-rose-400">
                  <Clock size={20} />
                </div>
              </div>
              <p className="mt-4 text-2xl font-bold text-rose-400">
                {money(totals.due)}
              </p>
              <p className="mt-1 text-xs text-slate-500">Outstanding amount</p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">Payment Progress</span>
                <div className="rounded-xl bg-violet-500/10 p-2.5 text-violet-400">
                  <TrendingUp size={20} />
                </div>
              </div>
              <p className="mt-4 text-2xl font-bold">{paidPercentage}%</p>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-800">
                <div
                  className="h-full rounded-full bg-emerald-500 transition-all"
                  style={{ width: `${paidPercentage}%` }}
                />
              </div>
            </div>
          </div>

          {/* Fee Records */}
          <section className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
            <div className="flex flex-col justify-between gap-3 border-b border-slate-800 p-5 sm:flex-row sm:items-center">
              <div>
                <h2 className="flex items-center gap-2 text-lg font-bold">
                  <CalendarDays className="text-emerald-400" size={20} />
                  Monthly Fee History
                </h2>
                <p className="mt-1 text-sm text-slate-400">
                  Your course-wise monthly payment records.
                </p>
              </div>

              <select
                value={filterMonth}
                onChange={(e) => setFilterMonth(e.target.value)}
                className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm text-slate-200 outline-none focus:border-emerald-500"
              >
                <option value="ALL">All Months</option>
                {months.map((month) => (
                  <option key={month} value={month}>
                    {getMonthLabel(month)}
                  </option>
                ))}
              </select>
            </div>

            {filteredFees.length === 0 ? (
              <div className="px-5 py-16 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-800 text-slate-400">
                  <Wallet size={26} />
                </div>
                <h3 className="font-semibold">No fee records found</h3>
                <p className="mt-2 text-sm text-slate-500">
                  Your monthly fee records will appear here when added by the administration.
                </p>
              </div>
            ) : (
              <>
                {/* Mobile Cards */}
                <div className="divide-y divide-slate-800 md:hidden">
                  {filteredFees.map((item) => (
                    <div key={item._id} className="space-y-3 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold">
                            {getCourseName(item.course)}
                          </p>
                          <p className="mt-1 text-xs text-slate-400">
                            {getMonthLabel(item.monthValue)}
                          </p>
                        </div>

                        <span
                          className={`rounded-full border px-2.5 py-1 text-[10px] font-bold ${statusStyle[item.statusValue]}`}
                        >
                          {item.statusValue}
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        <div className="rounded-lg bg-slate-950 p-2.5">
                          <p className="text-[10px] text-slate-500">Fee</p>
                          <p className="mt-1 text-sm font-semibold">
                            {money(item.feeValue)}
                          </p>
                        </div>
                        <div className="rounded-lg bg-slate-950 p-2.5">
                          <p className="text-[10px] text-slate-500">Paid</p>
                          <p className="mt-1 text-sm font-semibold text-emerald-400">
                            {money(item.paidValue)}
                          </p>
                        </div>
                        <div className="rounded-lg bg-slate-950 p-2.5">
                          <p className="text-[10px] text-slate-500">Due</p>
                          <p className="mt-1 text-sm font-semibold text-rose-400">
                            {money(item.dueValue)}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap justify-between gap-2 text-xs text-slate-500">
                        <span>
                          Payment: {item.paymentMethod || "Not specified"}
                        </span>
                        <span>
                          {item.paymentDate || item.paidAt
                            ? `Paid: ${new Date(item.paymentDate || item.paidAt!).toLocaleDateString()}`
                            : "Payment date: —"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Desktop Table */}
                <div className="hidden overflow-x-auto md:block">
                  <table className="w-full min-w-[850px] text-left text-sm">
                    <thead className="bg-slate-950/70 text-xs uppercase tracking-wider text-slate-400">
                      <tr>
                        <th className="px-5 py-4">Month</th>
                        <th className="px-5 py-4">Course</th>
                        <th className="px-5 py-4">Total Fee</th>
                        <th className="px-5 py-4">Paid</th>
                        <th className="px-5 py-4">Due</th>
                        <th className="px-5 py-4">Status</th>
                        <th className="px-5 py-4">Payment Details</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-800">
                      {filteredFees.map((item) => (
                        <tr key={item._id} className="transition hover:bg-slate-800/40">
                          <td className="whitespace-nowrap px-5 py-4 font-medium">
                            {getMonthLabel(item.monthValue)}
                          </td>

                          <td className="px-5 py-4">
                            <div className="flex items-center gap-2">
                              <BookOpen size={16} className="shrink-0 text-emerald-400" />
                              <span>{getCourseName(item.course)}</span>
                            </div>
                          </td>

                          <td className="whitespace-nowrap px-5 py-4 font-semibold">
                            {money(item.feeValue)}
                          </td>

                          <td className="whitespace-nowrap px-5 py-4 font-semibold text-emerald-400">
                            {money(item.paidValue)}
                          </td>

                          <td className="whitespace-nowrap px-5 py-4 font-semibold text-rose-400">
                            {money(item.dueValue)}
                          </td>

                          <td className="px-5 py-4">
                            <span
                              className={`rounded-full border px-3 py-1 text-[10px] font-bold ${statusStyle[item.statusValue]}`}
                            >
                              {item.statusValue}
                            </span>
                          </td>

                          <td className="px-5 py-4 text-xs text-slate-400">
                            <div>{item.paymentMethod || "—"}</div>
                            <div className="mt-1">
                              {item.paymentDate || item.paidAt
                                ? new Date(item.paymentDate || item.paidAt!).toLocaleDateString()
                                : "No payment date"}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </section>

          {/* Payment Note */}
          <div className="flex gap-3 rounded-2xl border border-blue-500/20 bg-blue-500/5 p-4">
            <CreditCard className="mt-0.5 shrink-0 text-blue-400" size={20} />
            <div>
              <h3 className="text-sm font-semibold text-blue-300">
                Payment Information
              </h3>
              <p className="mt-1 text-sm leading-relaxed text-slate-400">
                Your fee records and payment status are managed by the academy
                administration. If a payment is missing or the amount looks
                incorrect, please contact the administration.
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
