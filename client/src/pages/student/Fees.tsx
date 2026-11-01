import { useCallback, useEffect, useMemo, useState } from "react";
import {
  RefreshCw,
  Wallet,
  CheckCircle2,
  Clock,
  AlertCircle,
  BookOpen,
  CalendarDays,
  CreditCard,
} from "lucide-react";

const api = {
  async get(path: string) {
    const response = await fetch(`/api${path}`, { credentials: "include" });
    const data = await response.json().catch(() => null);

    if (!response.ok) {
      throw Object.assign(new Error(data?.message || response.statusText), {
        response: { data },
      });
    }

    return { data };
  },
};

const getErrorMessage = (error: any) =>
  error?.response?.data?.message || error?.message || "An unexpected error occurred.";

type Course = {
  _id?: string;
  title?: string;
  subject?: string;
  classLevel?: string;
  fee?: number;
};

type FeeRecord = {
  _id: string;
  billingMonth?: string;
  month?: string;

  course?: Course | string;

  feeAmount?: number;
  fee?: number;
  amount?: number;

  paidAmount?: number;
  paid?: number;

  dueAmount?: number;
  due?: number;

  status?: string;
  paymentDate?: string;
  paidAt?: string;
  createdAt?: string;
};

type FeeData = {
  fees?: FeeRecord[];
  totalFee?: number;
  totalPaid?: number;
  totalDue?: number;
  paidPercentage?: number;
  monthlySummary?: unknown[];
  courseSummary?: unknown[];
};

const money = (value: number) =>
  `৳${Number(value || 0).toLocaleString("en-BD")}`;

const getMonthLabel = (value?: string) => {
  if (!value) return "Unknown Month";

  const date = new Date(
    value.length === 7 ? `${value}-01` : value
  );

  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
};

const getCourseName = (course?: Course | string) => {
  if (!course) return "Course";

  if (typeof course === "string") return "Course";

  return (
    course.title ||
    course.subject ||
    "Course"
  );
};

const extractFeeData = (response: any): FeeData => {
  const data = response?.data ?? response;

  if (data?.data) {
    return data.data;
  }

  return data || {};
};

export default function Fees() {
  const [fees, setFees] = useState<FeeRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const [selectedMonth, setSelectedMonth] = useState("all");

  const loadFees = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const response = await api.get("/fees/my");
      const data = extractFeeData(response);

      setFees(Array.isArray(data.fees) ? data.fees : []);
    } catch (err) {
      setError(getErrorMessage(err));
      setFees([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadFees();
  }, [loadFees]);

  const totalFee = useMemo(
    () =>
      fees.reduce(
        (sum, item) =>
          sum +
          Number(
            item.feeAmount ?? item.fee ?? item.amount ?? 0
          ),
        0
      ),
    [fees]
  );

  const totalPaid = useMemo(
    () =>
      fees.reduce(
        (sum, item) =>
          sum +
          Number(item.paidAmount ?? item.paid ?? 0),
        0
      ),
    [fees]
  );

  const totalDue = Math.max(0, totalFee - totalPaid);

  const paidPercentage =
    totalFee > 0
      ? Math.min(100, (totalPaid / totalFee) * 100)
      : 0;

  const months = useMemo(() => {
    const values = fees.map(
      (item) => item.billingMonth || item.month || ""
    );

    return [...new Set(values)]
      .filter(Boolean)
      .sort()
      .reverse();
  }, [fees]);

  const filteredFees = useMemo(() => {
    if (selectedMonth === "all") return fees;

    return fees.filter(
      (item) =>
        (item.billingMonth || item.month) === selectedMonth
    );
  }, [fees, selectedMonth]);

  const getAmounts = (item: FeeRecord) => {
    const fee = Number(
      item.feeAmount ?? item.fee ?? item.amount ?? 0
    );

    const paid = Number(
      item.paidAmount ?? item.paid ?? 0
    );

    const due = Math.max(
      0,
      Number(item.dueAmount ?? item.due ?? fee - paid)
    );

    return { fee, paid, due };
  };

  const getStatus = (item: FeeRecord) => {
    const { fee, paid, due } = getAmounts(item);

    if (due <= 0 && paid > 0) return "PAID";
    if (paid > 0 && due > 0) return "PARTIAL";
    if (fee > 0 && paid <= 0) return "PENDING";

    return item.status?.toUpperCase() || "PENDING";
  };

  const filteredTotal = filteredFees.reduce(
    (sum, item) => sum + getAmounts(item).fee,
    0
  );

  const filteredPaid = filteredFees.reduce(
    (sum, item) => sum + getAmounts(item).paid,
    0
  );

  const filteredDue = filteredFees.reduce(
    (sum, item) => sum + getAmounts(item).due,
    0
  );

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-indigo-500">
            <Wallet size={17} />
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
          onClick={() => loadFees(true)}
          disabled={loading || refreshing}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700"
        >
          <RefreshCw
            size={16}
            className={refreshing ? "animate-spin" : ""}
          />
          Refresh
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950/30">
          <div className="flex items-center gap-2 font-semibold text-red-600 dark:text-red-400">
            <AlertCircle size={18} />
            Unable to load fees
          </div>

          <p className="mt-2 break-words text-sm text-red-600 dark:text-red-400">
            {error}
          </p>

          <button
            onClick={() => loadFees()}
            className="mt-3 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
          >
            Try again
          </button>
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="flex min-h-52 items-center justify-center">
          <div className="text-center">
            <RefreshCw
              size={28}
              className="mx-auto animate-spin text-indigo-500"
            />
            <p className="mt-3 text-sm text-slate-500">
              Loading your fees...
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Total Fees
                  </p>
                  <h2 className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
                    {money(totalFee)}
                  </h2>
                </div>

                <div className="rounded-xl bg-indigo-100 p-3 text-indigo-600 dark:bg-indigo-950">
                  <Wallet size={23} />
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Total Paid
                  </p>
                  <h2 className="mt-2 text-2xl font-bold text-green-600">
                    {money(totalPaid)}
                  </h2>
                </div>

                <div className="rounded-xl bg-green-100 p-3 text-green-600 dark:bg-green-950">
                  <CheckCircle2 size={23} />
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Outstanding Due
                  </p>
                  <h2 className="mt-2 text-2xl font-bold text-red-600">
                    {money(totalDue)}
                  </h2>
                </div>

                <div className="rounded-xl bg-red-100 p-3 text-red-600 dark:bg-red-950">
                  <Clock size={23} />
                </div>
              </div>
            </div>
          </div>

          {/* Payment Progress */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white">
                  Payment Progress
                </h3>
                <p className="mt-1 text-xs text-slate-500">
                  Your overall fee payment status
                </p>
              </div>

              <span className="text-lg font-bold text-indigo-600">
                {paidPercentage.toFixed(0)}%
              </span>
            </div>

            <div className="h-3 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
              <div
                className="h-full rounded-full bg-indigo-600 transition-all"
                style={{ width: `${paidPercentage}%` }}
              />
            </div>

            <div className="mt-3 flex justify-between text-xs text-slate-500">
              <span>Paid: {money(totalPaid)}</span>
              <span>Total: {money(totalFee)}</span>
            </div>
          </div>

          {/* Monthly Fees */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <div className="flex flex-col gap-4 border-b border-slate-200 p-5 dark:border-slate-700 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Monthly Fee History
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  Course-wise payment details
                </p>
              </div>

              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              >
                <option value="all">All Months</option>

                {months.map((month) => (
                  <option key={month} value={month}>
                    {getMonthLabel(month)}
                  </option>
                ))}
              </select>
            </div>

            {filteredFees.length === 0 ? (
              <div className="px-5 py-16 text-center">
                <BookOpen
                  size={36}
                  className="mx-auto text-slate-300"
                />

                <h4 className="mt-4 font-semibold text-slate-800 dark:text-white">
                  No fee records found
                </h4>

                <p className="mt-2 text-sm text-slate-500">
                  Your monthly fee records will appear here when added by the admin.
                </p>
              </div>
            ) : (
              <>
                {/* Filter Summary */}
                <div className="grid grid-cols-3 gap-3 border-b border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/40">
                  <div>
                    <p className="text-xs text-slate-500">Fee</p>
                    <p className="mt-1 font-bold text-slate-900 dark:text-white">
                      {money(filteredTotal)}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-500">Paid</p>
                    <p className="mt-1 font-bold text-green-600">
                      {money(filteredPaid)}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-500">Due</p>
                    <p className="mt-1 font-bold text-red-600">
                      {money(filteredDue)}
                    </p>
                  </div>
                </div>

                {/* Mobile Cards */}
                <div className="space-y-3 p-4 md:hidden">
                  {filteredFees.map((item) => {
                    const amounts = getAmounts(item);
                    const status = getStatus(item);

                    return (
                      <div
                        key={item._id}
                        className="rounded-xl border border-slate-200 p-4 dark:border-slate-700"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h4 className="font-semibold text-slate-900 dark:text-white">
                              {getCourseName(item.course)}
                            </h4>

                            <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                              <CalendarDays size={13} />
                              {getMonthLabel(
                                item.billingMonth || item.month
                              )}
                            </p>
                          </div>

                          <span
                            className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                              status === "PAID"
                                ? "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400"
                                : status === "PARTIAL"
                                  ? "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400"
                                  : "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400"
                            }`}
                          >
                            {status}
                          </span>
                        </div>

                        <div className="mt-4 grid grid-cols-3 gap-2 border-t border-slate-100 pt-3 dark:border-slate-700">
                          <div>
                            <p className="text-xs text-slate-500">Fee</p>
                            <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">
                              {money(amounts.fee)}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs text-slate-500">Paid</p>
                            <p className="mt-1 text-sm font-semibold text-green-600">
                              {money(amounts.paid)}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs text-slate-500">Due</p>
                            <p className="mt-1 text-sm font-semibold text-red-600">
                              {money(amounts.due)}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Desktop Table */}
                <div className="hidden overflow-x-auto md:block">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-xs uppercase text-slate-500 dark:bg-slate-950/40">
                      <tr>
                        <th className="px-5 py-4">Month</th>
                        <th className="px-5 py-4">Course</th>
                        <th className="px-5 py-4">Fee</th>
                        <th className="px-5 py-4">Paid</th>
                        <th className="px-5 py-4">Due</th>
                        <th className="px-5 py-4">Status</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {filteredFees.map((item) => {
                        const amounts = getAmounts(item);
                        const status = getStatus(item);

                        return (
                          <tr
                            key={item._id}
                            className="transition hover:bg-slate-50 dark:hover:bg-slate-800/50"
                          >
                            <td className="whitespace-nowrap px-5 py-4 font-medium text-slate-700 dark:text-slate-200">
                              {getMonthLabel(
                                item.billingMonth || item.month
                              )}
                            </td>

                            <td className="px-5 py-4 font-medium text-slate-900 dark:text-white">
                              {getCourseName(item.course)}
                            </td>

                            <td className="whitespace-nowrap px-5 py-4">
                              {money(amounts.fee)}
                            </td>

                            <td className="whitespace-nowrap px-5 py-4 font-semibold text-green-600">
                              {money(amounts.paid)}
                            </td>

                            <td className="whitespace-nowrap px-5 py-4 font-semibold text-red-600">
                              {money(amounts.due)}
                            </td>

                            <td className="px-5 py-4">
                              <span
                                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                  status === "PAID"
                                    ? "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400"
                                    : status === "PARTIAL"
                                      ? "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400"
                                      : "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400"
                                }`}
                              >
                                {status}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>

          {/* Payment Information */}
          <div className="flex items-start gap-3 rounded-2xl border border-indigo-100 bg-indigo-50 p-4 dark:border-indigo-900 dark:bg-indigo-950/30">
            <CreditCard
              size={20}
              className="mt-0.5 shrink-0 text-indigo-600"
            />

            <div>
              <h4 className="font-semibold text-indigo-900 dark:text-indigo-300">
                Payment Information
              </h4>

              <p className="mt-1 text-sm text-indigo-800 dark:text-indigo-400">
                For fee payment and payment confirmation, please contact the academy administration.
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}