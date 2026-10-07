import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock3,
  Copy,
  CreditCard,
  FileText,
  ReceiptText,
  Wallet,
  XCircle,
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

type PaymentRequestStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED";

interface PaymentRequestFee {
  _id: string;
  amount?: number;
  amountPaid?: number;
  billingMonth?: string;
  dueDate?: string;
  status?: string;
}

interface PaymentRequestItem {
  _id: string;
  amount: number;
  senderNumber: string;
  transactionId: string;
  status: PaymentRequestStatus;
  createdAt: string;
  reviewedAt?: string;
  rejectionReason?: string;
  fee?: PaymentRequestFee;
}

interface PaymentInfo {
  bkashNumber: string;
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

function formatDateTime(date?: string) {
  if (!date) return "—";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) return "—";

  return parsed.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
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

function getPaymentStatusLabel(
  status: PaymentRequestStatus
) {
  if (status === "APPROVED") return "Approved";
  if (status === "REJECTED") return "Rejected";

  return "Pending Verification";
}

function getPaymentStatusClass(
  status: PaymentRequestStatus
) {
  if (status === "APPROVED") {
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }

  if (status === "REJECTED") {
    return "border-red-200 bg-red-50 text-red-700";
  }

  return "border-amber-200 bg-amber-50 text-amber-700";
}

export default function StudentFees() {
  const [fees, setFees] = useState<FeeWithMonthly[]>([]);
  const [summary, setSummary] =
    useState<MyFeesResponse | null>(null);

  const [paymentInfo, setPaymentInfo] =
    useState<PaymentInfo>({
      bkashNumber: "",
    });

  const [paymentRequests, setPaymentRequests] =
    useState<PaymentRequestItem[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [paymentLoading, setPaymentLoading] =
    useState(false);

  const [paymentError, setPaymentError] =
    useState("");

  const [selectedMonth, setSelectedMonth] =
    useState("ALL");

  const [selectedCourse, setSelectedCourse] =
    useState("ALL");

  const [openMonths, setOpenMonths] =
    useState<Record<string, boolean>>({});

  const [selectedFee, setSelectedFee] =
    useState<FeeWithMonthly | null>(null);

  const [paymentAmount, setPaymentAmount] =
    useState("");

  const [senderNumber, setSenderNumber] =
    useState("");

  const [transactionId, setTransactionId] =
    useState("");

  const [submittingPayment, setSubmittingPayment] =
    useState(false);

  const [copied, setCopied] =
    useState(false);

  useEffect(() => {
    loadFees();
    loadPaymentInfo();
    loadPaymentRequests();
  }, []);

  async function loadFees() {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/fees/my");

      const payload = response.data?.data;

      const feeList = Array.isArray(payload?.fees)
        ? payload.fees
        : [];

      setFees(feeList as FeeWithMonthly[]);
      setSummary(payload as MyFeesResponse);

      const months = Array.from(
        new Set(
          feeList
            .map(
              (fee: FeeWithMonthly) =>
                fee.billingMonth
            )
            .filter(Boolean)
        )
      ) as string[];

      const initialOpen: Record<string, boolean> =
        {};

      months.forEach((month) => {
        initialOpen[month] = true;
      });

      if (
        feeList.some(
          (fee: FeeWithMonthly) =>
            !fee.billingMonth
        )
      ) {
        initialOpen.UNASSIGNED = true;
      }

      setOpenMonths(initialOpen);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  async function loadPaymentInfo() {
    try {
      const response =
        await api.get("/fees/payment-info");

      const payload = response.data?.data;

      setPaymentInfo({
        bkashNumber:
          typeof payload?.bkashNumber === "string"
            ? payload.bkashNumber
            : "",
      });
    } catch {
      setPaymentInfo({
        bkashNumber: "",
      });
    }
  }

  async function loadPaymentRequests() {
    try {
      setPaymentLoading(true);

      const response = await api.get(
        "/fees/payment-requests/my"
      );

      const payload = response.data?.data;

      const list = Array.isArray(payload)
        ? payload
        : Array.isArray(payload?.data)
        ? payload.data
        : [];

      setPaymentRequests(
        list as PaymentRequestItem[]
      );
    } catch {
      setPaymentRequests([]);
    } finally {
      setPaymentLoading(false);
    }
  }

  async function copyBkashNumber() {
    if (!paymentInfo.bkashNumber) return;

    try {
      await navigator.clipboard.writeText(
        paymentInfo.bkashNumber
      );

      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      setCopied(false);
    }
  }

  function openPaymentModal(
    fee: FeeWithMonthly
  ) {
    const amount = Math.max(
      Number(fee.amount || 0) -
        Number(fee.amountPaid || 0),
      0
    );

    setSelectedFee(fee);
    setPaymentAmount(
      amount > 0 ? String(amount) : ""
    );
    setSenderNumber("");
    setTransactionId("");
    setPaymentError("");
  }

  function closePaymentModal() {
    if (submittingPayment) return;

    setSelectedFee(null);
    setPaymentAmount("");
    setSenderNumber("");
    setTransactionId("");
    setPaymentError("");
  }

  async function handleSubmitPayment() {
    if (!selectedFee) return;

    try {
      setSubmittingPayment(true);
      setPaymentError("");

      const amount = Number(paymentAmount);

      if (
        !Number.isFinite(amount) ||
        amount <= 0
      ) {
        setPaymentError(
          "Enter a valid payment amount."
        );
        return;
      }

      const feeAmount = Number(
        selectedFee.amount || 0
      );

      const alreadyPaid = Number(
        selectedFee.amountPaid || 0
      );

      const due = Math.max(
        feeAmount - alreadyPaid,
        0
      );

      if (amount > due) {
        setPaymentError(
          `Payment amount cannot be greater than the current due amount of ${formatCurrency(
            due
          )}.`
        );
        return;
      }

      if (!senderNumber.trim()) {
        setPaymentError(
          "Enter the bKash number you used to send the money."
        );
        return;
      }

      if (!/^01[3-9]\d{8}$/.test(
        senderNumber
          .trim()
          .replace(/\s+/g, "")
      )) {
        setPaymentError(
          "Enter a valid Bangladeshi mobile number."
        );
        return;
      }

      if (!transactionId.trim()) {
        setPaymentError(
          "Enter your bKash Transaction ID."
        );
        return;
      }

      await api.post(
        "/fees/payment-requests",
        {
          feeId: selectedFee._id,
          amount,
          senderNumber:
            senderNumber
              .trim()
              .replace(/\s+/g, ""),
          transactionId:
            transactionId.trim().toUpperCase(),
        }
      );

      closePaymentModal();

      await Promise.all([
        loadFees(),
        loadPaymentRequests(),
      ]);
    } catch (err) {
      setPaymentError(
        getErrorMessage(err)
      );
    } finally {
      setSubmittingPayment(false);
    }
  }

  function getPendingRequestForFee(
    feeId: string
  ) {
    return paymentRequests.find(
      (request) =>
        request.fee?._id === feeId &&
        request.status === "PENDING"
    );
  }

  const courseOptions = useMemo(() => {
    const map = new Map<string, string>();

    fees.forEach((fee) => {
      const course = getCourse(fee.course);

      if (course?._id) {
        map.set(
          course._id,
          course.title ||
            course.subject ||
            "Course"
        );
      }
    });

    return Array.from(map.entries()).map(
      ([id, title]) => ({
        id,
        title,
      })
    );
  }, [fees]);

  const monthOptions = useMemo(() => {
    return Array.from(
      new Set(
        fees
          .map(
            (fee) => fee.billingMonth
          )
          .filter(Boolean) as string[]
      )
    ).sort((a, b) =>
      b.localeCompare(a)
    );
  }, [fees]);

  const overallTotals = useMemo(() => {
    const totalFee = fees.reduce(
      (sum, fee) =>
        sum + Number(fee.amount || 0),
      0
    );

    const totalPaid = fees.reduce(
      (sum, fee) =>
        sum + Number(fee.amountPaid || 0),
      0
    );

    const totalDue = fees.reduce(
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
  }, [fees]);

  const filteredFees = useMemo(() => {
    return fees.filter((fee) => {
      const monthMatch =
        selectedMonth === "ALL" ||
        (fee.billingMonth ||
          "UNASSIGNED") === selectedMonth;

      const course = getCourse(
        fee.course
      );

      const courseMatch =
        selectedCourse === "ALL" ||
        course?._id === selectedCourse;

      return monthMatch && courseMatch;
    });
  }, [
    fees,
    selectedMonth,
    selectedCourse,
  ]);

  const monthlyGroups =
    useMemo<MonthlyGroup[]>(() => {
      const grouped = new Map<
        string,
        FeeWithMonthly[]
      >();

      filteredFees.forEach((fee) => {
        const month =
          fee.billingMonth ||
          "UNASSIGNED";

        if (!grouped.has(month)) {
          grouped.set(month, []);
        }

        grouped
          .get(month)!
          .push(fee);
      });

      return Array.from(
        grouped.entries()
      )
        .map(([month, records]) => {
          const totalFee =
            records.reduce(
              (sum, fee) =>
                sum +
                Number(
                  fee.amount || 0
                ),
              0
            );

          const totalPaid =
            records.reduce(
              (sum, fee) =>
                sum +
                Number(
                  fee.amountPaid || 0
                ),
              0
            );

          const totalDue =
            records.reduce(
              (sum, fee) =>
                sum +
                Math.max(
                  Number(
                    fee.amount || 0
                  ) -
                    Number(
                      fee.amountPaid ||
                        0
                    ),
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
            records: records.sort(
              (a, b) => {
                const courseA =
                  getCourse(a.course)
                    ?.title || "";

                const courseB =
                  getCourse(b.course)
                    ?.title || "";

                return courseA.localeCompare(
                  courseB
                );
              }
            ),
            totalFee,
            totalPaid,
            totalDue,
          };
        })
        .sort((a, b) => {
          if (
            a.month === "UNASSIGNED"
          )
            return 1;

          if (
            b.month === "UNASSIGNED"
          )
            return -1;

          return b.month.localeCompare(
            a.month
          );
        });
    }, [filteredFees]);

  const filteredTotals = useMemo(() => {
    const totalFee =
      filteredFees.reduce(
        (sum, fee) =>
          sum +
          Number(fee.amount || 0),
        0
      );

    const totalPaid =
      filteredFees.reduce(
        (sum, fee) =>
          sum +
          Number(
            fee.amountPaid || 0
          ),
        0
      );

    const totalDue =
      filteredFees.reduce(
        (sum, fee) =>
          sum +
          Math.max(
            Number(fee.amount || 0) -
              Number(
                fee.amountPaid || 0
              ),
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

  const displayedTotals =
    selectedMonth === "ALL" &&
    selectedCourse === "ALL"
      ? overallTotals
      : filteredTotals;

  const paidPercentage =
    displayedTotals.totalFee > 0
      ? Math.round(
          (displayedTotals.totalPaid /
            displayedTotals.totalFee) *
            100
        )
      : 0;

  const pendingPaymentCount =
    paymentRequests.filter(
      (request) =>
        request.status === "PENDING"
    ).length;

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
          Your monthly fee records will appear here once the
          administration adds them.
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

      {/* bKash Payment */}
      <section className="overflow-hidden rounded-[2rem] border border-pink-100 bg-white shadow-[0_15px_50px_rgba(15,23,42,0.06)]">
        <div className="bg-gradient-to-r from-pink-600 to-pink-500 px-6 py-6 text-white sm:px-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/80">
                <Wallet className="h-4 w-4" />
                Manual Payment
              </div>

              <h2 className="text-2xl font-bold">
                Pay Your Fee via bKash
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-white/80">
                Send your fee to the academy bKash number, then
                submit your payment details for verification.
              </p>
            </div>

            {pendingPaymentCount > 0 && (
              <div className="rounded-2xl border border-white/20 bg-white/10 px-4 py-3">
                <p className="text-xs text-white/70">
                  Pending verification
                </p>

                <p className="mt-1 text-lg font-bold">
                  {pendingPaymentCount}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
              Academy bKash Number
            </p>

            <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="rounded-2xl border border-pink-100 bg-pink-50 px-5 py-4">
                <p className="text-2xl font-bold tracking-wide text-pink-700">
                  {paymentInfo.bkashNumber ||
                    "Not configured"}
                </p>
              </div>

              {paymentInfo.bkashNumber && (
                <button
                  type="button"
                  onClick={copyBkashNumber}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4 text-emerald-600" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      Copy Number
                    </>
                  )}
                </button>
              )}
            </div>

            <div className="mt-5 rounded-2xl border border-amber-100 bg-amber-50 p-4">
              <p className="text-sm font-semibold text-amber-900">
                Payment instructions
              </p>

              <ol className="mt-2 space-y-1 text-sm leading-6 text-amber-800">
                <li>
                  1. Send the exact amount to the academy bKash number.
                </li>
                <li>
                  2. Keep your sender bKash number and TrxID.
                </li>
                <li>
                  3. Submit the payment request below.
                </li>
                <li>
                  4. Admin will verify the transaction before approving it.
                </li>
              </ol>
            </div>
          </div>

          <div className="rounded-2xl bg-slate-50 p-5 lg:min-w-[230px]">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Current Due
            </p>

            <p className="mt-2 text-3xl font-bold text-red-700">
              {formatCurrency(overallTotals.totalDue)}
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Across all fee records
            </p>
          </div>
        </div>
      </section>

      {/* Payment History */}
      <section>
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-gold">
              Payment Verification
            </p>

            <h2 className="mt-1 text-2xl font-semibold text-slate-950">
              bKash Payment History
            </h2>
          </div>

          <button
            type="button"
            onClick={() =>
              Promise.all([
                loadFees(),
                loadPaymentRequests(),
              ])
            }
            disabled={paymentLoading}
            className="self-start rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Refresh
          </button>
        </div>

        {paymentRequests.length === 0 ? (
          <div className="card-premium p-7 text-center">
            <CreditCard className="mx-auto h-9 w-9 text-slate-300" />

            <p className="mt-3 text-sm font-medium text-slate-700">
              No bKash payment requests yet.
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Your submitted payment requests will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {paymentRequests.map((request) => (
              <div
                key={request._id}
                className="card-premium p-5 sm:p-6"
              >
                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${getPaymentStatusClass(
                          request.status
                        )}`}
                      >
                        {request.status === "APPROVED" && (
                          <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />
                        )}

                        {request.status === "REJECTED" && (
                          <XCircle className="mr-1.5 h-3.5 w-3.5" />
                        )}

                        {request.status === "PENDING" && (
                          <Clock3 className="mr-1.5 h-3.5 w-3.5" />
                        )}

                        {getPaymentStatusLabel(
                          request.status
                        )}
                      </span>

                      {request.fee?.billingMonth && (
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                          {formatMonth(
                            request.fee.billingMonth
                          )}
                        </span>
                      )}
                    </div>

                    <h3 className="mt-3 text-lg font-bold text-slate-950">
                      {formatCurrency(
                        request.amount
                      )}
                    </h3>

                    <p className="mt-1 text-xs text-slate-500">
                      Submitted{" "}
                      {formatDateTime(
                        request.createdAt
                      )}
                    </p>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-3 lg:min-w-[500px]">
                    <div className="rounded-xl bg-slate-50 p-3">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                        Sender
                      </p>

                      <p className="mt-1 text-sm font-bold text-slate-800">
                        {request.senderNumber}
                      </p>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-3">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                        TrxID
                      </p>

                      <p className="mt-1 break-all text-sm font-bold text-slate-800">
                        {request.transactionId}
                      </p>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-3">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                        Fee Due
                      </p>

                      <p className="mt-1 text-sm font-bold text-red-700">
                        {formatCurrency(
                          Math.max(
                            Number(
                              request.fee?.amount ||
                                0
                            ) -
                              Number(
                                request.fee
                                  ?.amountPaid ||
                                  0
                              ),
                            0
                          )
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                {request.status ===
                  "REJECTED" &&
                  request.rejectionReason && (
                    <div className="mt-5 rounded-xl border border-red-100 bg-red-50 p-4">
                      <p className="text-xs font-semibold uppercase tracking-wider text-red-600">
                        Rejection Reason
                      </p>

                      <p className="mt-1 text-sm text-red-800">
                        {request.rejectionReason}
                      </p>
                    </div>
                  )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Overall cards */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {/* Total Fee */}
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
              displayedTotals.totalFee
            )}
          </p>

          <p className="mt-1 text-sm text-slate-500">
            Across monthly records
          </p>
        </div>

        {/* Paid */}
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
              displayedTotals.totalPaid
            )}
          </p>

          <p className="mt-1 text-sm text-slate-500">
            {paidPercentage}% payment completed
          </p>
        </div>

        {/* Due / Unpaid */}
        <div className="card-premium p-5">
          <div className="flex items-center justify-between">
            <div className="rounded-xl bg-red-50 p-3">
              <Clock3 className="h-5 w-5 text-red-600" />
            </div>

            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Due / Unpaid
            </span>
          </div>

          <p className="mt-5 text-2xl font-bold text-red-700">
            {formatCurrency(
              displayedTotals.totalDue
            )}
          </p>

          <p className="mt-1 text-sm text-slate-500">
            Remaining payment
          </p>
        </div>

        {/* Progress */}
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
                width: `${Math.min(
                  paidPercentage,
                  100
                )}%`,
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
                setSelectedMonth(
                  event.target.value
                )
              }
              className="input-field"
            >
              <option value="ALL">
                All Months
              </option>

              {monthOptions.map(
                (month) => (
                  <option
                    key={month}
                    value={month}
                  >
                    {formatMonth(month)}
                  </option>
                )
              )}

              {fees.some(
                (fee) =>
                  !fee.billingMonth
              ) && (
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
                setSelectedCourse(
                  event.target.value
                )
              }
              className="input-field"
            >
              <option value="ALL">
                All Courses
              </option>

              {courseOptions.map(
                (course) => (
                  <option
                    key={course.id}
                    value={course.id}
                  >
                    {course.title}
                  </option>
                )
              )}
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
            {filteredFees.length !== 1
              ? "s"
              : ""}{" "}
            shown
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
            {monthlyGroups.map(
              (group) => {
                const isOpen =
                  openMonths[
                    group.month
                  ] !== false;

                return (
                  <div
                    key={group.month}
                    className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_10px_35px_rgba(15,23,42,0.05)]"
                  >
                    {/* Month header */}
                    <button
                      type="button"
                      onClick={() =>
                        toggleMonth(
                          group.month
                        )
                      }
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
                            {formatCurrency(
                              group.totalFee
                            )}
                          </p>
                        </div>

                        <div>
                          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                            Paid
                          </p>

                          <p className="mt-1 text-sm font-bold text-emerald-700 sm:text-base">
                            {formatCurrency(
                              group.totalPaid
                            )}
                          </p>
                        </div>

                        <div>
                          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                            Due
                          </p>

                          <p className="mt-1 text-sm font-bold text-red-700 sm:text-base">
                            {formatCurrency(
                              group.totalDue
                            )}
                          </p>
                        </div>
                      </div>
                    </button>

                    {/* Month records */}
                    {isOpen && (
                      <div className="border-t border-slate-200">
                        {/* Desktop */}
                        <div className="hidden overflow-x-auto md:block">
                          <table className="w-full min-w-[980px]">
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

                                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                                  Payment
                                </th>
                              </tr>
                            </thead>

                            <tbody className="divide-y divide-slate-100">
                              {group.records.map(
                                (fee) => {
                                  const course =
                                    getCourse(
                                      fee.course
                                    );

                                  const amount =
                                    Number(
                                      fee.amount ||
                                        0
                                    );

                                  const paid =
                                    Number(
                                      fee.amountPaid ||
                                        0
                                    );

                                  const due =
                                    Math.max(
                                      amount -
                                        paid,
                                      0
                                    );

                                  const pendingRequest =
                                    getPendingRequestForFee(
                                      fee._id
                                    );

                                  return (
                                    <tr
                                      key={
                                        fee._id
                                      }
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
                                              {
                                                course.subject
                                              }
                                            </p>
                                          )}
                                        </div>
                                      </td>

                                      <td className="px-6 py-5 font-semibold text-slate-900">
                                        {formatCurrency(
                                          amount
                                        )}
                                      </td>

                                      <td className="px-6 py-5 font-semibold text-emerald-700">
                                        {formatCurrency(
                                          paid
                                        )}
                                      </td>

                                      <td className="px-6 py-5 font-semibold text-red-700">
                                        {formatCurrency(
                                          due
                                        )}
                                      </td>

                                      <td className="px-6 py-5 text-sm text-slate-600">
                                        {formatDate(
                                          fee.dueDate
                                        )}
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

                                      <td className="px-6 py-5">
                                        {due <=
                                        0 ? (
                                          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
                                            <CheckCircle2 className="h-4 w-4" />
                                            Fully Paid
                                          </span>
                                        ) : pendingRequest ? (
                                          <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700">
                                            <Clock3 className="h-3.5 w-3.5" />
                                            Verification Pending
                                          </span>
                                        ) : (
                                          <button
                                            type="button"
                                            onClick={() =>
                                              openPaymentModal(
                                                fee
                                              )
                                            }
                                            className="inline-flex items-center gap-2 rounded-xl bg-pink-600 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-pink-700"
                                          >
                                            <CreditCard className="h-4 w-4" />
                                            Pay via bKash
                                          </button>
                                        )}
                                      </td>
                                    </tr>
                                  );
                                }
                              )}
                            </tbody>
                          </table>
                        </div>

                        {/* Mobile */}
                        <div className="divide-y divide-slate-100 md:hidden">
                          {group.records.map(
                            (fee) => {
                              const course =
                                getCourse(
                                  fee.course
                                );

                              const amount =
                                Number(
                                  fee.amount ||
                                    0
                                );

                              const paid =
                                Number(
                                  fee.amountPaid ||
                                    0
                                );

                              const due =
                                Math.max(
                                  amount -
                                    paid,
                                  0
                                );

                              const pendingRequest =
                                getPendingRequestForFee(
                                  fee._id
                                );

                              return (
                                <div
                                  key={
                                    fee._id
                                  }
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
                                          {
                                            course.subject
                                          }
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
                                        {formatCurrency(
                                          amount
                                        )}
                                      </p>
                                    </div>

                                    <div className="rounded-xl bg-emerald-50 p-3">
                                      <p className="text-[10px] font-semibold uppercase tracking-wider text-emerald-600">
                                        Paid
                                      </p>

                                      <p className="mt-1 text-sm font-bold text-emerald-700">
                                        {formatCurrency(
                                          paid
                                        )}
                                      </p>
                                    </div>

                                    <div className="rounded-xl bg-red-50 p-3">
                                      <p className="text-[10px] font-semibold uppercase tracking-wider text-red-600">
                                        Due
                                      </p>

                                      <p className="mt-1 text-sm font-bold text-red-700">
                                        {formatCurrency(
                                          due
                                        )}
                                      </p>
                                    </div>
                                  </div>

                                  <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4 text-xs text-slate-500">
                                    <span>
                                      Due date
                                    </span>

                                    <span className="font-medium text-slate-700">
                                      {formatDate(
                                        fee.dueDate
                                      )}
                                    </span>
                                  </div>

                                  <div className="mt-4">
                                    {due <=
                                    0 ? (
                                      <div className="flex items-center justify-center gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
                                        <CheckCircle2 className="h-4 w-4" />
                                        Fully Paid
                                      </div>
                                    ) : pendingRequest ? (
                                      <div className="flex items-center justify-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-700">
                                        <Clock3 className="h-4 w-4" />
                                        Payment Verification Pending
                                      </div>
                                    ) : (
                                      <button
                                        type="button"
                                        onClick={() =>
                                          openPaymentModal(
                                            fee
                                          )
                                        }
                                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-pink-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-pink-700"
                                      >
                                        <CreditCard className="h-4 w-4" />
                                        Pay via bKash
                                      </button>
                                    )}
                                  </div>
                                </div>
                              );
                            }
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              }
            )}
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
              {summary.courseSummary.map(
                (item, index) => (
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

                        {item.course
                          ?.classLevel && (
                          <p className="mt-1 text-xs text-slate-500">
                            {
                              item.course
                                .classLevel
                            }
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
                          {formatCurrency(
                            item.totalFee
                          )}
                        </p>
                      </div>

                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                          Paid
                        </p>

                        <p className="mt-1 text-sm font-bold text-emerald-700">
                          {formatCurrency(
                            item.totalPaid
                          )}
                        </p>
                      </div>

                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                          Due
                        </p>

                        <p className="mt-1 text-sm font-bold text-red-700">
                          {formatCurrency(
                            item.totalDue
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          </section>
        )}

      {/* Payment Modal */}
      {selectedFee && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
          <div className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-[2rem] bg-white shadow-2xl">
            <div className="border-b border-slate-100 px-6 py-5 sm:px-7">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-pink-600">
                    bKash Payment
                  </p>

                  <h2 className="mt-1 text-2xl font-bold text-slate-950">
                    Submit Payment
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    {getCourse(
                      selectedFee.course
                    )?.title ||
                      "Fee Payment"}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={closePaymentModal}
                  disabled={submittingPayment}
                  className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>
            </div>

            <div className="space-y-5 px-6 py-6 sm:px-7">
              {/* bKash number */}
              <div className="rounded-2xl border border-pink-100 bg-pink-50 p-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-pink-600">
                  Send Money To
                </p>

                <div className="mt-2 flex items-center justify-between gap-3">
                  <p className="text-2xl font-bold tracking-wide text-pink-700">
                    {paymentInfo.bkashNumber ||
                      "Not configured"}
                  </p>

                  {paymentInfo.bkashNumber && (
                    <button
                      type="button"
                      onClick={copyBkashNumber}
                      className="rounded-xl bg-white p-2.5 text-pink-600 shadow-sm"
                    >
                      {copied ? (
                        <Check className="h-5 w-5" />
                      ) : (
                        <Copy className="h-5 w-5" />
                      )}
                    </button>
                  )}
                </div>
              </div>

              {/* Fee information */}
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-xl bg-slate-50 p-3">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    Fee
                  </p>

                  <p className="mt-1 text-sm font-bold text-slate-900">
                    {formatCurrency(
                      Number(
                        selectedFee.amount ||
                          0
                      )
                    )}
                  </p>
                </div>

                <div className="rounded-xl bg-emerald-50 p-3">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-emerald-600">
                    Paid
                  </p>

                  <p className="mt-1 text-sm font-bold text-emerald-700">
                    {formatCurrency(
                      Number(
                        selectedFee.amountPaid ||
                          0
                      )
                    )}
                  </p>
                </div>

                <div className="rounded-xl bg-red-50 p-3">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-red-600">
                    Due
                  </p>

                  <p className="mt-1 text-sm font-bold text-red-700">
                    {formatCurrency(
                      Math.max(
                        Number(
                          selectedFee.amount ||
                            0
                        ) -
                          Number(
                            selectedFee.amountPaid ||
                              0
                          ),
                        0
                      )
                    )}
                  </p>
                </div>
              </div>

              {/* Amount */}
              <div>
                <label className="label-field">
                  Payment Amount
                </label>

                <input
                  type="number"
                  min="1"
                  step="1"
                  value={paymentAmount}
                  onChange={(event) =>
                    setPaymentAmount(
                      event.target.value
                    )
                  }
                  className="input-field"
                  placeholder="Enter amount"
                  disabled={
                    submittingPayment
                  }
                />

                <p className="mt-1.5 text-xs text-slate-500">
                  Maximum payable now:{" "}
                  {formatCurrency(
                    Math.max(
                      Number(
                        selectedFee.amount ||
                          0
                      ) -
                        Number(
                          selectedFee.amountPaid ||
                            0
                        ),
                      0
                    )
                  )}
                </p>
              </div>

              {/* Sender number */}
              <div>
                <label className="label-field">
                  Sender bKash Number
                </label>

                <input
                  type="tel"
                  inputMode="numeric"
                  value={senderNumber}
                  onChange={(event) =>
                    setSenderNumber(
                      event.target.value
                    )
                  }
                  className="input-field"
                  placeholder="01XXXXXXXXX"
                  maxLength={11}
                  disabled={
                    submittingPayment
                  }
                />
              </div>

              {/* Transaction ID */}
              <div>
                <label className="label-field">
                  bKash Transaction ID
                </label>

                <input
                  type="text"
                  value={transactionId}
                  onChange={(event) =>
                    setTransactionId(
                      event.target.value.toUpperCase()
                    )
                  }
                  className="input-field uppercase"
                  placeholder="Example: 8N7A6B5C4D"
                  disabled={
                    submittingPayment
                  }
                />
              </div>

              {/* Error */}
              {paymentError && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4">
                  <div className="flex gap-3">
                    <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />

                    <p className="text-sm leading-6 text-red-700">
                      {paymentError}
                    </p>
                  </div>
                </div>
              )}

              {/* Warning */}
              <div className="rounded-xl border border-amber-100 bg-amber-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-amber-700">
                  Important
                </p>

                <p className="mt-1 text-sm leading-6 text-amber-800">
                  Make sure the amount, sender number and
                  Transaction ID exactly match your bKash
                  transaction. Your payment will remain
                  pending until an administrator verifies it.
                </p>
              </div>

              {/* Actions */}
              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closePaymentModal}
                  disabled={submittingPayment}
                  className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleSubmitPayment}
                  disabled={
                    submittingPayment ||
                    !paymentInfo.bkashNumber
                  }
                  className="rounded-xl bg-pink-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-pink-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {submittingPayment
                    ? "Submitting..."
                    : "Submit Payment"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}