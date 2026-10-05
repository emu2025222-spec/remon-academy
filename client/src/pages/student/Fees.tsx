import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  CreditCard,
  ReceiptText,
  Wallet,
  AlertCircle,
} from "lucide-react";

import { api, getErrorMessage } from "../../services/api";
import { Fee, Course } from "../../types";
import { Loader } from "../../components/Loader";
import { EmptyState } from "../../components/EmptyState";
import { Badge } from "../../components/Badge";
import { useToast } from "../../components/Toast";

export default function StudentFees() {
  const [fees, setFees] = useState<Fee[]>([]);
  const [pendingTotal, setPendingTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const { show } = useToast();

  useEffect(() => {
    api
      .get("/fees/my")
      .then((r) => {
        const data = r.data.data;

        setFees(data.fees || []);
        setPendingTotal(data.pendingTotal || 0);
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

  const totalAmount = fees.reduce(
    (sum, fee) => sum + Number(fee.amount || 0),
    0
  );

  const totalPaid = fees.reduce(
    (sum, fee) => sum + Number(fee.amountPaid || 0),
    0
  );

  const totalDue = Math.max(
    totalAmount - totalPaid,
    0
  );

  const paymentPercentage =
    totalAmount > 0
      ? Math.min(
          Math.round((totalPaid / totalAmount) * 100),
          100
        )
      : 0;

  return (
    <div className="space-y-8 pb-10">
      {/* =========================================================
          HEADER
      ========================================================= */}
      <section className="relative overflow-hidden rounded-3xl bg-brand-navyDark px-6 py-8 text-white shadow-sm sm:px-8 sm:py-10">
        <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full border border-brand-goldLight/10" />
        <div className="absolute -bottom-24 right-24 h-64 w-64 rounded-full border border-brand-goldLight/10" />

        <div className="relative z-10">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-brand-goldLight">
            <Wallet className="h-3.5 w-3.5" />
            Finance
          </div>

          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
                Fee Records
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-white/65">
                Review your course fees, payments, outstanding
                amounts and payment deadlines.
              </p>
            </div>

            <div className="w-fit rounded-2xl border border-red-400/20 bg-red-400/10 px-5 py-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-red-200/70">
                Outstanding
              </p>

              <p className="mt-1 font-display text-2xl font-semibold text-red-200">
                ৳{pendingTotal}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          SUMMARY
      ========================================================= */}
      {fees.length > 0 && (
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {/* Total */}
          <div className="card-premium relative overflow-hidden p-5">
            <div className="absolute right-0 top-0 h-20 w-20 rounded-bl-[60px] bg-brand-goldLight/10" />

            <div className="relative flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                  Total Fee
                </p>

                <p className="mt-2 font-display text-2xl font-semibold text-slate-900 dark:text-white">
                  ৳{totalAmount}
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Total assigned amount
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-goldLight/15 text-brand-gold">
                <ReceiptText className="h-5 w-5" />
              </div>
            </div>
          </div>

          {/* Paid */}
          <div className="card-premium relative overflow-hidden p-5">
            <div className="absolute right-0 top-0 h-20 w-20 rounded-bl-[60px] bg-emerald-500/5" />

            <div className="relative flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                  Total Paid
                </p>

                <p className="mt-2 font-display text-2xl font-semibold text-emerald-600 dark:text-emerald-400">
                  ৳{totalPaid}
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Successfully paid
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                <CheckCircle2 className="h-5 w-5" />
              </div>
            </div>
          </div>

          {/* Due */}
          <div className="card-premium relative overflow-hidden p-5">
            <div className="absolute right-0 top-0 h-20 w-20 rounded-bl-[60px] bg-red-500/5" />

            <div className="relative flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                  Total Due
                </p>

                <p className="mt-2 font-display text-2xl font-semibold text-red-600 dark:text-red-400">
                  ৳{totalDue}
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Remaining balance
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400">
                <AlertCircle className="h-5 w-5" />
              </div>
            </div>
          </div>

          {/* Progress */}
          <div className="card-premium relative overflow-hidden p-5">
            <div className="relative">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                    Payment Progress
                  </p>

                  <p className="mt-2 font-display text-2xl font-semibold text-slate-900 dark:text-white">
                    {paymentPercentage}%
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    Overall payment completion
                  </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                  <CreditCard className="h-5 w-5" />
                </div>
              </div>

              <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                <div
                  className="h-full rounded-full bg-brand-goldLight transition-all"
                  style={{
                    width: `${paymentPercentage}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* =========================================================
          FEE RECORDS
      ========================================================= */}
      <section className="card-premium overflow-hidden">
        <div className="border-b border-slate-200/80 px-6 py-6 dark:border-slate-800">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <div className="mb-2 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-brand-gold">
                <ReceiptText className="h-4 w-4" />
                Payment History
              </div>

              <h2 className="font-display text-xl font-semibold text-slate-900 dark:text-white">
                Fee Records
              </h2>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Detailed payment records for your assigned courses.
              </p>
            </div>

            <div className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
              {fees.length}{" "}
              {fees.length === 1 ? "record" : "records"}
            </div>
          </div>
        </div>

        {fees.length === 0 ? (
          <div className="p-6">
            <EmptyState message="No fee records found." />
          </div>
        ) : (
          <>
            {/* =====================================================
                DESKTOP TABLE
            ===================================================== */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-sm">
                <thead className="border-b border-slate-200 bg-slate-50/80 text-left dark:border-slate-800 dark:bg-slate-900/50">
                  <tr>
                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                      Course
                    </th>

                    <th className="px-4 py-4 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                      Amount
                    </th>

                    <th className="px-4 py-4 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                      Paid
                    </th>

                    <th className="px-4 py-4 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                      Due
                    </th>

                    <th className="px-4 py-4 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                      Due Date
                    </th>

                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {fees.map((fee) => {
                    const course =
                      typeof fee.course === "object" &&
                      fee.course !== null
                        ? (fee.course as Course)
                        : null;

                    const due = Math.max(
                      Number(fee.amount || 0) -
                        Number(fee.amountPaid || 0),
                      0
                    );

                    return (
                      <tr
                        key={fee._id}
                        className="border-b border-slate-100 transition hover:bg-slate-50/60 last:border-0 dark:border-slate-800 dark:hover:bg-slate-900/40"
                      >
                        {/* Course */}
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-goldLight/15 text-brand-gold">
                              <BookOpen className="h-4 w-4" />
                            </div>

                            <div className="min-w-0">
                              <p className="font-semibold text-slate-800 dark:text-slate-200">
                                {course?.title || "Course"}
                              </p>

                              {course?.subject && (
                                <p className="mt-0.5 text-xs text-slate-400">
                                  {course.subject}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Amount */}
                        <td className="px-4 py-5 font-medium text-slate-700 dark:text-slate-300">
                          ৳{fee.amount}
                        </td>

                        {/* Paid */}
                        <td className="px-4 py-5 font-semibold text-emerald-600 dark:text-emerald-400">
                          ৳{fee.amountPaid}
                        </td>

                        {/* Due */}
                        <td className="px-4 py-5 font-semibold text-red-600 dark:text-red-400">
                          ৳{due}
                        </td>

                        {/* Due Date */}
                        <td className="px-4 py-5">
                          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                            <CalendarDays className="h-3.5 w-3.5" />

                            {new Date(
                              fee.dueDate
                            ).toLocaleDateString("en-BD", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })}
                          </div>
                        </td>

                        {/* Status */}
                        <td className="px-6 py-5">
                          <Badge
                            color={
                              fee.status === "PAID"
                                ? "green"
                                : fee.status === "PARTIAL"
                                ? "gold"
                                : "red"
                            }
                          >
                            {fee.status}
                          </Badge>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* =====================================================
                MOBILE CARDS
            ===================================================== */}
            <div className="space-y-4 p-5 md:hidden">
              {fees.map((fee) => {
                const course =
                  typeof fee.course === "object" &&
                  fee.course !== null
                    ? (fee.course as Course)
                    : null;

                const due = Math.max(
                  Number(fee.amount || 0) -
                    Number(fee.amountPaid || 0),
                  0
                );

                return (
                  <div
                    key={fee._id}
                    className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900/40"
                  >
                    {/* Course header */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-goldLight/15 text-brand-gold">
                          <BookOpen className="h-4 w-4" />
                        </div>

                        <div className="min-w-0">
                          <p className="truncate font-semibold text-slate-800 dark:text-slate-200">
                            {course?.title || "Course"}
                          </p>

                          {course?.subject && (
                            <p className="mt-0.5 text-xs text-slate-400">
                              {course.subject}
                            </p>
                          )}
                        </div>
                      </div>

                      <Badge
                        color={
                          fee.status === "PAID"
                            ? "green"
                            : fee.status === "PARTIAL"
                            ? "gold"
                            : "red"
                        }
                      >
                        {fee.status}
                      </Badge>
                    </div>

                    {/* Amount grid */}
                    <div className="mt-5 grid grid-cols-3 gap-2">
                      <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/50">
                        <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                          Amount
                        </p>

                        <p className="mt-1 text-sm font-bold text-slate-700 dark:text-slate-200">
                          ৳{fee.amount}
                        </p>
                      </div>

                      <div className="rounded-xl bg-emerald-50 p-3 dark:bg-emerald-500/10">
                        <p className="text-[10px] font-semibold uppercase tracking-wide text-emerald-600/70 dark:text-emerald-400/70">
                          Paid
                        </p>

                        <p className="mt-1 text-sm font-bold text-emerald-600 dark:text-emerald-400">
                          ৳{fee.amountPaid}
                        </p>
                      </div>

                      <div className="rounded-xl bg-red-50 p-3 dark:bg-red-500/10">
                        <p className="text-[10px] font-semibold uppercase tracking-wide text-red-500/70 dark:text-red-400/70">
                          Due
                        </p>

                        <p className="mt-1 text-sm font-bold text-red-600 dark:text-red-400">
                          ৳{due}
                        </p>
                      </div>
                    </div>

                    {/* Due date */}
                    <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
                      <span className="flex items-center gap-2 text-xs text-slate-400">
                        <CalendarDays className="h-3.5 w-3.5" />
                        Due date
                      </span>

                      <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                        {new Date(
                          fee.dueDate
                        ).toLocaleDateString("en-BD", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </section>

      {/* =========================================================
          INFO STRIP
      ========================================================= */}
      <section className="rounded-3xl border border-slate-200 bg-slate-50/70 px-6 py-6 dark:border-slate-800 dark:bg-slate-900/30">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-navyDark text-brand-goldLight">
              <CreditCard className="h-5 w-5" />
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                Keep your payments up to date.
              </p>

              <p className="mt-1 max-w-xl text-xs leading-5 text-slate-400">
                If you have questions about a fee, payment or
                due date, please contact the academy office.
              </p>
            </div>
          </div>

          <div className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
            <CheckCircle2 className="h-4 w-4 text-brand-gold" />
            Payment records are managed by the academy
          </div>
        </div>
      </section>
    </div>
  );
}

