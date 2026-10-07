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
import { Course, Fee } from "../../types";

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

interface MyFeesResponse {
  fees: FeeWithMonthly[];
  summary?: {
    totalFee?: number;
    totalPaid?: number;
    totalDue?: number;
  };
}

type PaymentRequestStatus = "PENDING" | "APPROVED" | "REJECTED";

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

type CourseLike =
  | Course
  | { _id?: string; name?: string }
  | string
  | null
  | undefined;

function getCourse(course?: CourseLike) {
  if (!course) return null;

  if (typeof course === "string") {
    return {
      _id: course,
      name: course,
    };
  }

  if (typeof course === "object" && "_id" in course) {
    const courseData = course as { _id?: string; name?: string };

    return {
      _id: courseData._id ?? "",
      name: courseData.name ?? "Course",
    };
  }

  return course;
}

function getCourseName(course?: CourseLike) {
  if (!course) return "Course";

  if (typeof course === "string") {
    return course;
  }

  if (typeof course === "object") {
    const courseData = course as { name?: string };

    if (typeof courseData.name === "string" && courseData.name.trim()) {
      return courseData.name;
    }
  }

  return "Course";
}

function formatCurrency(value: number) {
  return `৳${Number(value || 0).toLocaleString("en-BD")}`;
}

function formatMonth(value?: string) {
  if (!value) return "Unknown Month";

  const date = new Date(`${value}-01T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

function formatDate(value?: string) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatDateTime(value?: string) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getStatusLabel(status?: string) {
  switch (status) {
    case "PAID":
      return "Paid";
    case "PARTIAL":
      return "Partially Paid";
    case "PENDING":
      return "Pending";
    default:
      return status || "Pending";
  }
}

function getStatusClass(status?: string) {
  switch (status) {
    case "PAID":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "PARTIAL":
      return "bg-amber-50 text-amber-700 border-amber-200";
    case "PENDING":
    default:
      return "bg-rose-50 text-rose-700 border-rose-200";
  }
}

function getPaymentStatusLabel(status: PaymentRequestStatus) {
  switch (status) {
    case "APPROVED":
      return "Approved";
    case "REJECTED":
      return "Rejected";
    case "PENDING":
    default:
      return "Verification Pending";
  }
}

function getPaymentStatusClass(status: PaymentRequestStatus) {
  switch (status) {
    case "APPROVED":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "REJECTED":
      return "bg-rose-50 text-rose-700 border-rose-200";
    case "PENDING":
    default:
      return "bg-amber-50 text-amber-700 border-amber-200";
  }
}

export default function Fees() {
  const [fees, setFees] = useState<FeeWithMonthly[]>([]);
  const [summary, setSummary] = useState<
    MyFeesResponse["summary"] | null
  >(null);

  const [paymentInfo, setPaymentInfo] =
    useState<PaymentInfo | null>(null);

  const [paymentRequests, setPaymentRequests] = useState<
    PaymentRequestItem[]
  >([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentError, setPaymentError] = useState("");

  const [selectedMonth, setSelectedMonth] = useState("ALL");
  const [selectedCourse, setSelectedCourse] = useState("ALL");

  const [openMonths, setOpenMonths] = useState<
    Record<string, boolean>
  >({});

  const [selectedFee, setSelectedFee] =
    useState<FeeWithMonthly | null>(null);

  const [paymentAmount, setPaymentAmount] = useState("");
  const [senderNumber, setSenderNumber] = useState("");
  const [transactionId, setTransactionId] = useState("");

  const [submittingPayment, setSubmittingPayment] = useState(false);
  const [copied, setCopied] = useState(false);

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

      const payload = response.data?.data ?? response.data;

      const nextFees = Array.isArray(payload?.fees)
        ? payload.fees
        : [];

      setFees(nextFees);
      setSummary(payload?.summary ?? null);

      const months = Array.from(
        new Set(
          nextFees
            .map((fee: FeeWithMonthly) => fee.billingMonth)
            .filter(Boolean)
        )
      ) as string[];

      const initialOpenState: Record<string, boolean> = {};

      months.forEach((month) => {
        initialOpenState[month] = true;
      });

      setOpenMonths(initialOpenState);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  async function loadPaymentInfo() {
    try {
      const response = await api.get("/fees/payment-info");

      const payload = response.data?.data ?? response.data;

      setPaymentInfo(payload ?? null);
    } catch {
      setPaymentInfo(null);
    }
  }

  async function loadPaymentRequests() {
    try {
      setPaymentLoading(true);
      setPaymentError("");

      const response = await api.get("/fees/payment-requests/my");

      const payload = response.data?.data ?? response.data;

      const requests = Array.isArray(payload)
        ? payload
        : Array.isArray(payload?.data)
        ? payload.data
        : Array.isArray(payload?.paymentRequests)
        ? payload.paymentRequests
        : [];

      setPaymentRequests(requests);
    } catch (err) {
      setPaymentError(getErrorMessage(err));
    } finally {
      setPaymentLoading(false);
    }
  }

  async function copyBkashNumber() {
    if (!paymentInfo?.bkashNumber) return;

    try {
      await navigator.clipboard.writeText(
        paymentInfo.bkashNumber
      );

      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 1800);
    } catch {
      setCopied(false);
    }
  }

  function openPaymentModal(fee: FeeWithMonthly) {
    const amount = Number(fee.amount || 0);
    const paid = Number(fee.amountPaid || 0);
    const due = Math.max(amount - paid, 0);

    setSelectedFee(fee);
    setPaymentAmount(due > 0 ? String(due) : "");
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

    const amount = Number(paymentAmount);
    const feeAmount = Number(selectedFee.amount || 0);
    const paidAmount = Number(selectedFee.amountPaid || 0);
    const dueAmount = Math.max(feeAmount - paidAmount, 0);

    if (!amount || amount <= 0) {
      setPaymentError("Please enter a valid payment amount.");
      return;
    }

    if (amount > dueAmount) {
      setPaymentError(
        `Payment amount cannot exceed the due amount of ${formatCurrency(
          dueAmount
        )}.`
      );
      return;
    }

    const normalizedSenderNumber = senderNumber
      .trim()
      .replace(/\s+/g, "");

    if (!/^01[3-9]\d{8}$/.test(normalizedSenderNumber)) {
      setPaymentError(
        "Please enter a valid Bangladeshi bKash number."
      );
      return;
    }

    const normalizedTransactionId = transactionId
      .trim()
      .toUpperCase();

    if (!normalizedTransactionId) {
      setPaymentError("Please enter your bKash Transaction ID.");
      return;
    }

    try {
      setSubmittingPayment(true);
      setPaymentError("");

      await api.post("/fees/payment-requests", {
        feeId: selectedFee._id,
        amount,
        senderNumber: normalizedSenderNumber,
        transactionId: normalizedTransactionId,
      });

      closePaymentModal();

      await loadPaymentRequests();
      await loadFees();
    } catch (err) {
      setPaymentError(getErrorMessage(err));
    } finally {
      setSubmittingPayment(false);
    }
  }

  function getPendingRequestForFee(feeId: string) {
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
        map.set(course._id, getCourseName(course));
      }
    });

    return Array.from(map.entries()).map(
      ([_id, name]) => ({
        _id,
        name,
      })
    );
  }, [fees]);

  const monthOptions = useMemo(() => {
    return Array.from(
      new Set(
        fees
          .map((fee) => fee.billingMonth)
          .filter(Boolean)
      )
    ).sort((a, b) =>
      String(b).localeCompare(String(a))
    ) as string[];
  }, [fees]);

  const overallTotals = useMemo(() => {
    const totalFee = fees.reduce(
      (sum, fee) => sum + Number(fee.amount || 0),
      0
    );

    const totalPaid = fees.reduce(
      (sum, fee) => sum + Number(fee.amountPaid || 0),
      0
    );

    const totalDue = Math.max(totalFee - totalPaid, 0);

    return {
      totalFee:
        Number(summary?.totalFee ?? totalFee) || 0,
      totalPaid:
        Number(summary?.totalPaid ?? totalPaid) || 0,
      totalDue:
        Number(summary?.totalDue ?? totalDue) || 0,
    };
  }, [fees, summary]);

  const filteredFees = useMemo(() => {
    return fees.filter((fee) => {
      const monthMatch =
        selectedMonth === "ALL" ||
        fee.billingMonth === selectedMonth;

      const course = getCourse(fee.course);

      const courseMatch =
        selectedCourse === "ALL" ||
        course?._id === selectedCourse;

      return monthMatch && courseMatch;
    });
  }, [fees, selectedMonth, selectedCourse]);

  const monthlyGroups = useMemo<MonthlyGroup[]>(() => {
    const map = new Map<string, FeeWithMonthly[]>();

    filteredFees.forEach((fee) => {
      const month = fee.billingMonth || "UNKNOWN";

      if (!map.has(month)) {
        map.set(month, []);
      }

      map.get(month)!.push(fee);
    });

    return Array.from(map.entries())
      .sort(([a], [b]) => b.localeCompare(a))
      .map(([month, records]) => {
        const totalFee = records.reduce(
          (sum, fee) => sum + Number(fee.amount || 0),
          0
        );

        const totalPaid = records.reduce(
          (sum, fee) => sum + Number(fee.amountPaid || 0),
          0
        );

        return {
          month,
          label:
            month === "UNKNOWN"
              ? "Unknown Month"
              : formatMonth(month),
          records,
          totalFee,
          totalPaid,
          totalDue: Math.max(totalFee - totalPaid, 0),
        };
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

    const totalDue = Math.max(totalFee - totalPaid, 0);

    return {
      totalFee,
      totalPaid,
      totalDue,
    };
  }, [filteredFees]);

  const displayedTotals =
    selectedMonth === "ALL" && selectedCourse === "ALL"
      ? overallTotals
      : filteredTotals;

  const paidPercentage =
    displayedTotals.totalFee > 0
      ? Math.min(
          100,
          Math.round(
            (displayedTotals.totalPaid /
              displayedTotals.totalFee) *
              100
          )
        )
      : 0;

  const pendingPaymentCount = paymentRequests.filter(
    (request) => request.status === "PENDING"
  ).length;

  if (loading) {
    return (
      <div className="flex min-h-[420px] items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-rose-700">
        <div className="flex items-start gap-3">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />

          <div>
            <p className="font-semibold">
              Unable to load fee statement
            </p>

            <p className="mt-1 text-sm">{error}</p>

            <button
              type="button"
              onClick={loadFees}
              className="mt-4 rounded-xl bg-rose-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-800"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <section className="overflow-hidden rounded-3xl bg-gradient-to-br from-[#111827] via-[#182235] to-[#263449] p-6 text-white shadow-xl sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-white/80">
              <ReceiptText className="h-4 w-4" />
              Student Finance
            </div>

            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Fee Statement
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/70 sm:text-base">
              View your monthly fees, payment history,
              outstanding balance, and payment status in
              one place.
            </p>
          </div>

          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/10">
            <Wallet className="h-8 w-8 text-[#d7b56d]" />
          </div>
        </div>
      </section>

      {/* Overall Summary */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Total Fee
              </p>

              <p className="mt-2 text-2xl font-bold text-slate-900">
                {formatCurrency(displayedTotals.totalFee)}
              </p>
            </div>

            <div className="rounded-xl bg-slate-100 p-3 text-slate-700">
              <FileText className="h-5 w-5" />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-emerald-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Paid
              </p>

              <p className="mt-2 text-2xl font-bold text-emerald-700">
                {formatCurrency(displayedTotals.totalPaid)}
              </p>
            </div>

            <div className="rounded-xl bg-emerald-50 p-3 text-emerald-700">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-rose-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Due / Unpaid
              </p>

              <p className="mt-2 text-2xl font-bold text-rose-700">
                {formatCurrency(displayedTotals.totalDue)}
              </p>
            </div>

            <div className="rounded-xl bg-rose-50 p-3 text-rose-700">
              <CreditCard className="h-5 w-5" />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-[#d7b56d]/40 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-slate-500">
                Payment Progress
              </p>

              <p className="mt-2 text-2xl font-bold text-slate-900">
                {paidPercentage}%
              </p>

              <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-[#b8954f] transition-all"
                  style={{
                    width: `${paidPercentage}%`,
                  }}
                />
              </div>
            </div>

            <div className="rounded-xl bg-[#faf6eb] p-3 text-[#9b7838]">
              <Wallet className="h-5 w-5" />
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Fee Filters
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Filter your fee statement by month or course.
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">
              Billing Month
            </span>

            <select
              value={selectedMonth}
              onChange={(event) =>
                setSelectedMonth(event.target.value)
              }
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-[#b8954f] focus:ring-2 focus:ring-[#b8954f]/20"
            >
              <option value="ALL">All Months</option>

              {monthOptions.map((month) => (
                <option key={month} value={month}>
                  {formatMonth(month)}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">
              Course
            </span>

            <select
              value={selectedCourse}
              onChange={(event) =>
                setSelectedCourse(event.target.value)
              }
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-[#b8954f] focus:ring-2 focus:ring-[#b8954f]/20"
            >
              <option value="ALL">All Courses</option>

              {courseOptions.map((course) => (
                <option
                  key={course._id}
                  value={course._id}
                >
                  {course.name}
                </option>
              ))}
            </select>
          </label>
        </div>
      </section>

      {/* Monthly Statement */}
      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-5 sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Monthly Statement
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Detailed fee records grouped by billing month.
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700">
              {monthlyGroups.length}{" "}
              {monthlyGroups.length === 1
                ? "month"
                : "months"}
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-6">
          {monthlyGroups.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
              <div className="rounded-full bg-slate-100 p-3 text-slate-500">
                <FileText className="h-7 w-7" />
              </div>

              <div>
                <p className="text-lg font-semibold text-slate-800">
                  No fee records found
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  There are no fee records matching your selected filters.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {monthlyGroups.map((group) => {
                const isOpen =
                  openMonths[group.month] ?? true;

                return (
                  <div
                    key={group.month}
                    className="overflow-hidden rounded-2xl border border-slate-200"
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setOpenMonths((current) => ({
                          ...current,
                          [group.month]: !isOpen,
                        }))
                      }
                      className="flex w-full items-center justify-between gap-4 bg-slate-50 px-4 py-4 text-left transition hover:bg-slate-100 sm:px-5"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="rounded-xl bg-white p-2.5 text-slate-700 shadow-sm">
                          <CalendarDays className="h-5 w-5" />
                        </div>

                        <div className="min-w-0">
                          <p className="truncate font-bold text-slate-900">
                            {group.label}
                          </p>

                          <p className="mt-0.5 text-xs text-slate-500">
                            {group.records.length}{" "}
                            {group.records.length === 1
                              ? "fee record"
                              : "fee records"}
                          </p>
                        </div>
                      </div>

                      <div className="flex shrink-0 items-center gap-3">
                        <div className="hidden text-right sm:block">
                          <p className="text-xs text-slate-500">
                            Due
                          </p>

                          <p className="font-bold text-rose-700">
                            {formatCurrency(group.totalDue)}
                          </p>
                        </div>

                        {isOpen ? (
                          <ChevronUp className="h-5 w-5 text-slate-500" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-slate-500" />
                        )}
                      </div>
                    </button>

                    {isOpen && (
                      <div className="border-t border-slate-200">
                        {/* Desktop Table */}
                        <div className="hidden overflow-x-auto md:block">
                          <table className="min-w-full">
                            <thead>
                              <tr className="border-b border-slate-200 bg-white text-left">
                                <th className="px-5 py-3 text-xs font-bold uppercase tracking-wide text-slate-500">
                                  Course
                                </th>

                                <th className="px-5 py-3 text-xs font-bold uppercase tracking-wide text-slate-500">
                                  Billing Month
                                </th>

                                <th className="px-5 py-3 text-xs font-bold uppercase tracking-wide text-slate-500">
                                  Amount
                                </th>

                                <th className="px-5 py-3 text-xs font-bold uppercase tracking-wide text-slate-500">
                                  Paid
                                </th>

                                <th className="px-5 py-3 text-xs font-bold uppercase tracking-wide text-slate-500">
                                  Due
                                </th>

                                <th className="px-5 py-3 text-xs font-bold uppercase tracking-wide text-slate-500">
                                  Status
                                </th>

                                <th className="px-5 py-3 text-xs font-bold uppercase tracking-wide text-slate-500">
                                  Payment
                                </th>
                              </tr>
                            </thead>

                            <tbody>
                              {group.records.map((fee) => {
                                const course = getCourse(
                                  fee.course
                                );

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

                                const pendingRequest =
                                  getPendingRequestForFee(
                                    fee._id
                                  );

                                return (
                                  <tr
                                    key={fee._id}
                                    className="border-b border-slate-100 last:border-0"
                                  >
                                    <td className="px-5 py-4">
                                      <div className="font-semibold text-slate-900">
                                        {course?.name ||
                                          "Course"}
                                      </div>
                                    </td>

                                    <td className="px-5 py-4 text-sm text-slate-600">
                                      {formatMonth(
                                        fee.billingMonth
                                      )}
                                    </td>

                                    <td className="px-5 py-4 text-sm font-semibold text-slate-900">
                                      {formatCurrency(amount)}
                                    </td>

                                    <td className="px-5 py-4 text-sm font-semibold text-emerald-700">
                                      {formatCurrency(paid)}
                                    </td>

                                    <td className="px-5 py-4 text-sm font-semibold text-rose-700">
                                      {formatCurrency(due)}
                                    </td>

                                    <td className="px-5 py-4">
                                      <span
                                        className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${getStatusClass(
                                          fee.status
                                        )}`}
                                      >
                                        {getStatusLabel(
                                          fee.status
                                        )}
                                      </span>
                                    </td>

                                    <td className="px-5 py-4">
                                      {due <= 0 ? (
                                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
                                          <Check className="h-4 w-4" />
                                          Fully Paid
                                        </span>
                                      ) : pendingRequest ? (
                                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700">
                                          <Clock3 className="h-4 w-4" />
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
                                          className="rounded-lg bg-[#111827] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#263449]"
                                        >
                                          Pay via bKash
                                        </button>
                                      )}
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>

                        {/* Mobile Cards */}
                        <div className="divide-y divide-slate-100 md:hidden">
                          {group.records.map((fee) => {
                            const course = getCourse(
                              fee.course
                            );

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

                            const pendingRequest =
                              getPendingRequestForFee(
                                fee._id
                              );

                            return (
                              <div
                                key={fee._id}
                                className="space-y-4 p-4"
                              >
                                <div className="flex items-start justify-between gap-3">
                                  <div>
                                    <p className="font-bold text-slate-900">
                                      {course?.name ||
                                        "Course"}
                                    </p>

                                    <p className="mt-1 text-xs text-slate-500">
                                      {formatMonth(
                                        fee.billingMonth
                                      )}
                                    </p>
                                  </div>

                                  <span
                                    className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${getStatusClass(
                                      fee.status
                                    )}`}
                                  >
                                    {getStatusLabel(
                                      fee.status
                                    )}
                                  </span>
                                </div>

                                <div className="grid grid-cols-3 gap-3">
                                  <div className="rounded-xl bg-slate-50 p-3">
                                    <p className="text-[11px] font-medium text-slate-500">
                                      Amount
                                    </p>

                                    <p className="mt-1 text-sm font-bold text-slate-900">
                                      {formatCurrency(
                                        amount
                                      )}
                                    </p>
                                  </div>

                                  <div className="rounded-xl bg-emerald-50 p-3">
                                    <p className="text-[11px] font-medium text-emerald-600">
                                      Paid
                                    </p>

                                    <p className="mt-1 text-sm font-bold text-emerald-700">
                                      {formatCurrency(
                                        paid
                                      )}
                                    </p>
                                  </div>

                                  <div className="rounded-xl bg-rose-50 p-3">
                                    <p className="text-[11px] font-medium text-rose-600">
                                      Due
                                    </p>

                                    <p className="mt-1 text-sm font-bold text-rose-700">
                                      {formatCurrency(
                                        due
                                      )}
                                    </p>
                                  </div>
                                </div>

                                {due <= 0 ? (
                                  <div className="flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
                                    <CheckCircle2 className="h-4 w-4" />
                                    Fully Paid
                                  </div>
                                ) : pendingRequest ? (
                                  <div className="flex items-center gap-2 rounded-xl bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-700">
                                    <Clock3 className="h-4 w-4" />
                                    Payment verification is
                                    pending
                                  </div>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      openPaymentModal(
                                        fee
                                      )
                                    }
                                    className="w-full rounded-xl bg-[#111827] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#263449]"
                                  >
                                    Pay via bKash
                                  </button>
                                )}
                              </div>
                            );
                          })}
                        </div>

                        <div className="flex flex-col gap-2 border-t border-slate-200 bg-slate-50 px-4 py-4 text-sm sm:flex-row sm:items-center sm:justify-between sm:px-5">
                          <div className="text-slate-600">
                            Total:{" "}
                            <span className="font-bold text-slate-900">
                              {formatCurrency(
                                group.totalFee
                              )}
                            </span>
                          </div>

                          <div className="flex gap-4">
                            <span className="text-emerald-700">
                              Paid:{" "}
                              <strong>
                                {formatCurrency(
                                  group.totalPaid
                                )}
                              </strong>
                            </span>

                            <span className="text-rose-700">
                              Due:{" "}
                              <strong>
                                {formatCurrency(
                                  group.totalDue
                                )}
                              </strong>
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Course-wise Fee Summary */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-5">
          <h2 className="text-xl font-bold text-slate-900">
            Course-wise Fee Summary
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Your fee totals grouped by enrolled course.
          </p>
        </div>

        {courseOptions.length === 0 ? (
          <EmptyState
            message="No course fee records. Course-wise fee information is not available yet."
          />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {courseOptions.map((course) => {
              const courseFees = fees.filter((fee) => {
                const feeCourse = getCourse(fee.course);

                return feeCourse?._id === course._id;
              });

              const totalFee = courseFees.reduce(
                (sum, fee) =>
                  sum + Number(fee.amount || 0),
                0
              );

              const totalPaid = courseFees.reduce(
                (sum, fee) =>
                  sum + Number(fee.amountPaid || 0),
                0
              );

              const totalDue = Math.max(
                totalFee - totalPaid,
                0
              );

              return (
                <div
                  key={course._id}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
                >
                  <div className="flex items-start gap-3">
                    <div className="rounded-xl bg-white p-3 text-slate-700 shadow-sm">
                      <Wallet className="h-5 w-5" />
                    </div>

                    <div className="min-w-0">
                      <h3 className="truncate font-bold text-slate-900">
                        {course.name}
                      </h3>

                      <p className="mt-1 text-xs text-slate-500">
                        {courseFees.length}{" "}
                        {courseFees.length === 1
                          ? "record"
                          : "records"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 grid grid-cols-3 gap-2">
                    <div className="rounded-xl bg-white p-3">
                      <p className="text-[11px] text-slate-500">
                        Total
                      </p>

                      <p className="mt-1 text-sm font-bold text-slate-900">
                        {formatCurrency(totalFee)}
                      </p>
                    </div>

                    <div className="rounded-xl bg-emerald-50 p-3">
                      <p className="text-[11px] text-emerald-600">
                        Paid
                      </p>

                      <p className="mt-1 text-sm font-bold text-emerald-700">
                        {formatCurrency(totalPaid)}
                      </p>
                    </div>

                    <div className="rounded-xl bg-rose-50 p-3">
                      <p className="text-[11px] text-rose-600">
                        Due
                      </p>

                      <p className="mt-1 text-sm font-bold text-rose-700">
                        {formatCurrency(totalDue)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* =========================================================
          PAYMENT HISTORY
          Moved to the END as requested
      ========================================================= */}
      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-5 sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-[#faf6eb] p-2.5 text-[#9b7838]">
                  <ReceiptText className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Payment History
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Track your bKash payment verification
                    requests.
                  </p>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={loadPaymentRequests}
              disabled={paymentLoading}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Clock3
                className={`h-4 w-4 ${
                  paymentLoading ? "animate-spin" : ""
                }`}
              />

              Refresh
            </button>
          </div>
        </div>

        <div className="p-5 sm:p-6">
          {paymentError ? (
            <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
              {paymentError}
            </div>
          ) : paymentRequests.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center">
              <ReceiptText className="mx-auto h-8 w-8 text-slate-400" />

              <p className="mt-3 font-semibold text-slate-800">
                No payment requests yet
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Your submitted bKash payment requests will
                appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {paymentRequests.map((request) => (
                <div
                  key={request._id}
                  className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${getPaymentStatusClass(
                            request.status
                          )}`}
                        >
                          {getPaymentStatusLabel(
                            request.status
                          )}
                        </span>

                        <span className="text-xs text-slate-500">
                          {formatDateTime(
                            request.createdAt
                          )}
                        </span>
                      </div>

                      <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        <div>
                          <p className="text-xs text-slate-500">
                            Amount
                          </p>

                          <p className="mt-1 font-bold text-slate-900">
                            {formatCurrency(
                              request.amount
                            )}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-slate-500">
                            Sender Number
                          </p>

                          <p className="mt-1 font-semibold text-slate-800">
                            {request.senderNumber}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-slate-500">
                            Transaction ID
                          </p>

                          <p className="mt-1 break-all font-semibold text-slate-800">
                            {request.transactionId}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-slate-500">
                            Fee Month
                          </p>

                          <p className="mt-1 font-semibold text-slate-800">
                            {formatMonth(
                              request.fee?.billingMonth
                            )}
                          </p>
                        </div>
                      </div>

                      {request.reviewedAt && (
                        <p className="mt-3 text-xs text-slate-500">
                          Reviewed:{" "}
                          {formatDateTime(
                            request.reviewedAt
                          )}
                        </p>
                      )}

                      {request.status === "REJECTED" &&
                        request.rejectionReason && (
                          <div className="mt-3 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
                            <span className="font-semibold">
                              Rejection reason:
                            </span>{" "}
                            {request.rejectionReason}
                          </div>
                        )}
                    </div>

                    <div className="shrink-0">
                      {request.status === "PENDING" ? (
                        <div className="inline-flex items-center gap-2 rounded-xl bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-700">
                          <Clock3 className="h-4 w-4" />
                          Waiting for verification
                        </div>
                      ) : request.status ===
                        "APPROVED" ? (
                        <div className="inline-flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
                          <CheckCircle2 className="h-4 w-4" />
                          Payment approved
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-2 rounded-xl bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
                          <XCircle className="h-4 w-4" />
                          Payment rejected
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* =========================================================
          PAY VIA BKASH
          Moved to the END as requested
      ========================================================= */}
      <section className="overflow-hidden rounded-3xl border border-[#e6c8d3] bg-gradient-to-br from-[#fff8fb] via-white to-[#fff1f5] shadow-sm">
        <div className="p-5 sm:p-6 lg:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#e9c7d4] bg-white px-3 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-[#9b4d69]">
                <CreditCard className="h-4 w-4" />
                Manual Payment
              </div>

              <h2 className="mt-4 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Pay Your Fee via bKash
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-600 sm:text-base">
                Send your fee manually through bKash and
                submit the transaction details for
                verification.
              </p>
            </div>

            {pendingPaymentCount > 0 && (
              <div className="inline-flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-700">
                <Clock3 className="h-4 w-4" />
                {pendingPaymentCount} pending{" "}
                {pendingPaymentCount === 1
                  ? "request"
                  : "requests"}
              </div>
            )}
          </div>

          <div className="mt-7 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-2xl border border-[#ead7de] bg-white p-5 sm:p-6">
              <p className="text-sm font-semibold text-slate-500">
                Academy bKash Number
              </p>

              <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="flex-1 rounded-xl bg-[#fff7fa] px-4 py-4">
                  <p className="text-2xl font-bold tracking-wide text-[#9b4d69]">
                    {paymentInfo?.bkashNumber ||
                      "Number unavailable"}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={copyBkashNumber}
                  disabled={!paymentInfo?.bkashNumber}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#111827] px-5 py-4 text-sm font-semibold text-white transition hover:bg-[#263449] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      Copy Number
                    </>
                  )}
                </button>
              </div>

              <div className="mt-5 space-y-3">
                <div className="flex gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#f8e9ef] text-xs font-bold text-[#9b4d69]">
                    1
                  </span>

                  <p className="text-sm leading-6 text-slate-600">
                    Send the exact amount or your desired
                    partial amount to the academy bKash
                    number.
                  </p>
                </div>

                <div className="flex gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#f8e9ef] text-xs font-bold text-[#9b4d69]">
                    2
                  </span>

                  <p className="text-sm leading-6 text-slate-600">
                    Keep your bKash Transaction ID and
                    sender number safely.
                  </p>
                </div>

                <div className="flex gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#f8e9ef] text-xs font-bold text-[#9b4d69]">
                    3
                  </span>

                  <p className="text-sm leading-6 text-slate-600">
                    Select the fee record below and submit
                    your payment details for admin
                    verification.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-slate-100 p-3 text-slate-700">
                  <Wallet className="h-5 w-5" />
                </div>

                <div>
                  <p className="text-sm font-semibold text-slate-500">
                    Current Outstanding Balance
                  </p>

                  <p className="mt-1 text-3xl font-bold text-rose-700">
                    {formatCurrency(
                      overallTotals.totalDue
                    )}
                  </p>
                </div>
              </div>

              <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center justify-between gap-4 text-sm">
                  <span className="text-slate-500">
                    Total fee
                  </span>

                  <span className="font-semibold text-slate-900">
                    {formatCurrency(
                      overallTotals.totalFee
                    )}
                  </span>
                </div>

                <div className="mt-3 flex items-center justify-between gap-4 text-sm">
                  <span className="text-slate-500">
                    Paid
                  </span>

                  <span className="font-semibold text-emerald-700">
                    {formatCurrency(
                      overallTotals.totalPaid
                    )}
                  </span>
                </div>

                <div className="mt-3 flex items-center justify-between gap-4 border-t border-slate-200 pt-3 text-sm">
                  <span className="font-semibold text-slate-700">
                    Due
                  </span>

                  <span className="font-bold text-rose-700">
                    {formatCurrency(
                      overallTotals.totalDue
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Payment Modal */}
      {selectedFee && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
          <div className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white shadow-2xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4 sm:px-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Submit bKash Payment
                </h3>

                <p className="mt-0.5 text-xs text-slate-500">
                  Payment verification request
                </p>
              </div>

              <button
                type="button"
                onClick={closePaymentModal}
                disabled={submittingPayment}
                className="rounded-xl p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 disabled:opacity-50"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-5 p-5 sm:p-6">
              <div className="rounded-2xl border border-[#ead7de] bg-[#fff8fb] p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-[#9b4d69]">
                  Academy bKash Number
                </p>

                <div className="mt-2 flex items-center justify-between gap-3">
                  <p className="text-xl font-bold text-slate-900">
                    {paymentInfo?.bkashNumber ||
                      "Number unavailable"}
                  </p>

                  <button
                    type="button"
                    onClick={copyBkashNumber}
                    disabled={!paymentInfo?.bkashNumber}
                    className="rounded-lg border border-[#e6c8d3] bg-white p-2 text-[#9b4d69] transition hover:bg-[#fff0f5] disabled:opacity-50"
                  >
                    {copied ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-xl bg-slate-50 p-3">
                  <p className="text-[11px] text-slate-500">
                    Fee
                  </p>

                  <p className="mt-1 text-sm font-bold text-slate-900">
                    {formatCurrency(
                      Number(selectedFee.amount || 0)
                    )}
                  </p>
                </div>

                <div className="rounded-xl bg-emerald-50 p-3">
                  <p className="text-[11px] text-emerald-600">
                    Paid
                  </p>

                  <p className="mt-1 text-sm font-bold text-emerald-700">
                    {formatCurrency(
                      Number(selectedFee.amountPaid || 0)
                    )}
                  </p>
                </div>

                <div className="rounded-xl bg-rose-50 p-3">
                  <p className="text-[11px] text-rose-600">
                    Due
                  </p>

                  <p className="mt-1 text-sm font-bold text-rose-700">
                    {formatCurrency(
                      Math.max(
                        Number(selectedFee.amount || 0) -
                          Number(
                            selectedFee.amountPaid || 0
                          ),
                        0
                      )
                    )}
                  </p>
                </div>
              </div>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-700">
                  Payment Amount
                </span>

                <input
                  type="number"
                  min="1"
                  value={paymentAmount}
                  onChange={(event) =>
                    setPaymentAmount(event.target.value)
                  }
                  placeholder="Enter amount"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#b8954f] focus:ring-2 focus:ring-[#b8954f]/20"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-700">
                  Sender bKash Number
                </span>

                <input
                  type="text"
                  inputMode="numeric"
                  value={senderNumber}
                  onChange={(event) =>
                    setSenderNumber(event.target.value)
                  }
                  placeholder="01XXXXXXXXX"
                  maxLength={11}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#b8954f] focus:ring-2 focus:ring-[#b8954f]/20"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-700">
                  bKash Transaction ID
                </span>

                <input
                  type="text"
                  value={transactionId}
                  onChange={(event) =>
                    setTransactionId(
                      event.target.value.toUpperCase()
                    )
                  }
                  placeholder="Enter TrxID"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm uppercase text-slate-900 outline-none transition focus:border-[#b8954f] focus:ring-2 focus:ring-[#b8954f]/20"
                />
              </label>

              {paymentError && (
                <div className="flex gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />

                  <p>{paymentError}</p>
                </div>
              )}

              <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-800">
                After submitting, your payment will remain
                <strong> Pending </strong>
                until an admin verifies the bKash transaction.
              </div>

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
                  disabled={submittingPayment}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#111827] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#263449] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submittingPayment ? (
                    <>
                      <Clock3 className="h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-4 w-4" />
                      Submit Payment
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}