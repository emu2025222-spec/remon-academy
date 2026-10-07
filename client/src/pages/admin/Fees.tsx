import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  Check,
  ChevronDown,
  ChevronUp,
  CircleDollarSign,
  Edit3,
  FileText,
  Plus,
  RefreshCw,
  Search,
  UserRound,
  Wallet,
  X,
  CreditCard,
} from "lucide-react";

import { api, getErrorMessage } from "../../services/api";
import {
  Course,
  Fee,
  PaginatedResponse,
  Student,
} from "../../types";

import { Loader } from "../../components/Loader";
import { EmptyState } from "../../components/EmptyState";
import { Modal } from "../../components/Modal";
import { Input } from "../../components/Input";
import { Button } from "../../components/Button";
import { Badge } from "../../components/Badge";
import { useToast } from "../../components/Toast";

interface FeeWithMonthly extends Fee {
  billingMonth?: string;
}

interface CreateForm {
  student: string;
  course: string;
  billingMonth: string;
  amount: string;
  amountPaid: string;
  dueDate: string;
  paymentDate: string;
  paymentMethod: string;
  transactionId: string;
  note: string;
}

interface UpdateForm {
  billingMonth: string;
  amount: string;
  amountPaid: string;
  dueDate: string;
  paymentDate: string;
  paymentMethod: string;
  transactionId: string;
  note: string;
}

interface FeeSummary {
  totalRecords: number;
  totalFee: number;
  totalPaid: number;
  totalDue: number;
  paidPercentage: number;
  duePercentage: number;
}

interface PaymentRequestStudent {
  _id: string;
  fullName?: string;
  studentId?: string;
  phone?: string;
  class?: string;
  group?: string;
}

interface PaymentRequestFee {
  _id: string;
  amount: number;
  amountPaid: number;
  billingMonth?: string;
  dueDate?: string;
  status?: string;
}

type PaymentRequestStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED";

interface PaymentRequest {
  _id: string;
  amount: number;
  senderNumber: string;
  transactionId: string;
  status: PaymentRequestStatus;
  rejectionReason?: string;
  createdAt: string;
  reviewedAt?: string;
  student?: PaymentRequestStudent;
  fee?: PaymentRequestFee;
  reviewedBy?: {
    _id: string;
    email?: string;
  };
}

const emptySummary: FeeSummary = {
  totalRecords: 0,
  totalFee: 0,
  totalPaid: 0,
  totalDue: 0,
  paidPercentage: 0,
  duePercentage: 0,
};

function getCurrentMonth() {
  return new Date().toISOString().slice(0, 7);
}

function getToday() {
  return new Date().toISOString().slice(0, 10);
}

const emptyCreate: CreateForm = {
  student: "",
  course: "",
  billingMonth: getCurrentMonth(),
  amount: "",
  amountPaid: "0",
  dueDate: getToday(),
  paymentDate: "",
  paymentMethod: "",
  transactionId: "",
  note: "",
};

const emptyUpdate: UpdateForm = {
  billingMonth: "",
  amount: "",
  amountPaid: "0",
  dueDate: "",
  paymentDate: "",
  paymentMethod: "",
  transactionId: "",
  note: "",
};

function money(value: number) {
  return `৳${Number(value || 0).toLocaleString("en-BD")}`;
}

function monthLabel(month?: string) {
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

function formatDate(value?: string) {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatDateTime(value?: string) {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getStatus(amount: number, paid: number) {
  if (paid >= amount && amount > 0) {
    return "PAID";
  }

  if (paid > 0) {
    return "PARTIAL";
  }

  return "PENDING";
}

function getStatusColor(status: string) {
  if (status === "PAID") return "green";
  if (status === "PARTIAL") return "gold";
  return "red";
}

function getStudentName(student: Fee["student"]) {
  if (typeof student === "object" && student) {
    return (
      (student as Student).fullName ||
      "Unknown Student"
    );
  }

  return "Unknown Student";
}

function getStudentId(student: Fee["student"]) {
  if (typeof student === "object" && student) {
    return (
      (student as Student).studentId || "-"
    );
  }

  return "-";
}

function getCourseName(course: Fee["course"]) {
  if (typeof course === "object" && course) {
    return (
      (course as Course).title ||
      "Unknown Course"
    );
  }

  return "Unknown Course";
}

function getCourseSubject(course: Fee["course"]) {
  if (typeof course === "object" && course) {
    const c = course as Course;

    return [c.classLevel, c.subject]
      .filter(Boolean)
      .join(" • ");
  }

  return "";
}

function getAssignedCourseIds(
  student: Student
): string[] {
  const ids = new Set<string>();

  if (Array.isArray(student.courses)) {
    student.courses.forEach((course) => {
      if (!course) return;

      if (typeof course === "string") {
        ids.add(course);
        return;
      }

      if (
        typeof course === "object" &&
        course._id
      ) {
        ids.add(course._id);
      }
    });
  }

  if (student.course) {
    if (typeof student.course === "string") {
      ids.add(student.course);
    } else if (
      typeof student.course === "object" &&
      student.course._id
    ) {
      ids.add(student.course._id);
    }
  }

  return Array.from(ids);
}

function getPaymentStatusColor(
  status: PaymentRequestStatus
) {
  if (status === "APPROVED") return "green";
  if (status === "REJECTED") return "red";
  return "gold";
}

export default function AdminFees() {
  const [fees, setFees] = useState<
    FeeWithMonthly[]
  >([]);

  const [students, setStudents] = useState<
    Student[]
  >([]);

  const [courses, setCourses] = useState<
    Course[]
  >([]);

  const [summary, setSummary] =
    useState<FeeSummary>(emptySummary);

  const [paymentRequests, setPaymentRequests] =
    useState<PaymentRequest[]>([]);

  const [
    paymentRequestLoading,
    setPaymentRequestLoading,
  ] = useState(true);

  const [
    paymentRequestStatus,
    setPaymentRequestStatus,
  ] = useState("");

  const [
    paymentActionId,
    setPaymentActionId,
  ] = useState<string | null>(null);

  const [
    rejectTarget,
    setRejectTarget,
  ] = useState<PaymentRequest | null>(null);

  const [
    rejectionReason,
    setRejectionReason,
  ] = useState("");

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [createOpen, setCreateOpen] =
    useState(false);

  const [editTarget, setEditTarget] =
    useState<FeeWithMonthly | null>(null);

  const [createForm, setCreateForm] =
    useState<CreateForm>(emptyCreate);

  const [updateForm, setUpdateForm] =
    useState<UpdateForm>(emptyUpdate);

  const [search, setSearch] = useState("");
  const [monthFilter, setMonthFilter] =
    useState("");
  const [studentFilter, setStudentFilter] =
    useState("");
  const [courseFilter, setCourseFilter] =
    useState("");
  const [statusFilter, setStatusFilter] =
    useState("");

  const [openMonths, setOpenMonths] =
    useState<Record<string, boolean>>({});

  const { show } = useToast();

  /*
   * =======================================================
   * LOAD ALL FEES
   * =======================================================
   */
  async function loadAllFees() {
    const response = await api.get("/fees", {
      params: {
        page: 1,
        limit: 1000,
      },
    });

    const payload =
      response.data?.data as
        | PaginatedResponse<Fee>
        | Fee[]
        | undefined;

    if (Array.isArray(payload)) {
      return payload as FeeWithMonthly[];
    }

    const pageData = Array.isArray(
      payload?.data
    )
      ? payload.data
      : [];

    return pageData as FeeWithMonthly[];
  }

  /*
   * =======================================================
   * LOAD PAYMENT REQUESTS
   * =======================================================
   */
  async function loadPaymentRequests() {
    setPaymentRequestLoading(true);

    try {
      const response = await api.get(
        "/fees/payment-requests",
        {
          params: paymentRequestStatus
            ? {
                status:
                  paymentRequestStatus,
              }
            : undefined,
        }
      );

      const payload =
        response.data?.data;

      const list = Array.isArray(
        payload
      )
        ? payload
        : Array.isArray(payload?.data)
        ? payload.data
        : [];

      setPaymentRequests(list);
    } catch (err) {
      show(
        getErrorMessage(err),
        "error"
      );
    } finally {
      setPaymentRequestLoading(false);
    }
  }

  /*
   * =======================================================
   * LOAD FEES + SUMMARY
   * =======================================================
   */
  async function load() {
    setLoading(true);

    try {
      const [
        allFees,
        summaryResponse,
      ] = await Promise.all([
        loadAllFees(),
        api.get("/fees/summary"),
      ]);

      setFees(allFees);

      const backendTotals =
        summaryResponse.data?.data
          ?.totals || {};

      const totalAmount = Number(
        backendTotals.amount || 0
      );

      const totalPaid = Number(
        backendTotals.paid || 0
      );

      const totalDue = Number(
        backendTotals.due || 0
      );

      const totalRecords = Number(
        backendTotals.count || 0
      );

      setSummary({
        totalRecords,
        totalFee: totalAmount,
        totalPaid,
        totalDue,
        paidPercentage:
          totalAmount > 0
            ? (totalPaid /
                totalAmount) *
              100
            : 0,
        duePercentage:
          totalAmount > 0
            ? (totalDue /
                totalAmount) *
              100
            : 0,
      });

      const monthState: Record<
        string,
        boolean
      > = {};

      allFees.forEach((fee) => {
        const month =
          fee.billingMonth ||
          "UNASSIGNED";

        monthState[month] = true;
      });

      setOpenMonths(monthState);
    } catch (err) {
      show(
        getErrorMessage(err),
        "error"
      );
    } finally {
      setLoading(false);
    }
  }

  /*
   * =======================================================
   * LOAD STUDENTS + COURSES
   * =======================================================
   */
  useEffect(() => {
    async function loadOptions() {
      try {
        const [
          studentsResponse,
          coursesResponse,
        ] = await Promise.all([
          api.get("/students", {
            params: {
              limit: 200,
            },
          }),

          api.get("/courses", {
            params: {
              limit: 100,
            },
          }),
        ]);

        const studentsPayload =
          studentsResponse.data?.data;

        const coursesPayload =
          coursesResponse.data?.data;

        const studentList =
          Array.isArray(
            studentsPayload?.data
          )
            ? studentsPayload.data
            : Array.isArray(
                studentsPayload
              )
            ? studentsPayload
            : [];

        const courseList =
          Array.isArray(
            coursesPayload?.data
          )
            ? coursesPayload.data
            : Array.isArray(
                coursesPayload
              )
            ? coursesPayload
            : [];

        setStudents(studentList);
        setCourses(courseList);
      } catch (err) {
        show(
          getErrorMessage(err),
          "error"
        );
      }
    }

    loadOptions();
  }, []);

  useEffect(() => {
    load();
    loadPaymentRequests();
  }, []);

  useEffect(() => {
    loadPaymentRequests();
  }, [paymentRequestStatus]);

  /*
   * =======================================================
   * PAYMENT REQUEST ACTIONS
   * =======================================================
   */
  async function handleApprovePayment(
    request: PaymentRequest
  ) {
    if (
      !window.confirm(
        `Approve ${money(
          Number(request.amount || 0)
        )} payment from ${
          request.student?.fullName ||
          "this student"
        }?`
      )
    ) {
      return;
    }

    setPaymentActionId(request._id);

    try {
      await api.post(
        `/fees/payment-requests/${request._id}/approve`
      );

      show(
        "Payment approved and fee updated successfully.",
        "success"
      );

      await Promise.all([
        load(),
        loadPaymentRequests(),
      ]);
    } catch (err) {
      show(
        getErrorMessage(err),
        "error"
      );
    } finally {
      setPaymentActionId(null);
    }
  }

  async function handleRejectPayment() {
    if (!rejectTarget) return;

    setPaymentActionId(
      rejectTarget._id
    );

    try {
      await api.post(
        `/fees/payment-requests/${rejectTarget._id}/reject`,
        {
          reason:
            rejectionReason.trim() ||
            undefined,
        }
      );

      show(
        "Payment request rejected.",
        "success"
      );

      setRejectTarget(null);
      setRejectionReason("");

      await loadPaymentRequests();
    } catch (err) {
      show(
        getErrorMessage(err),
        "error"
      );
    } finally {
      setPaymentActionId(null);
    }
  }

  /*
   * =======================================================
   * SELECTED STUDENT
   * =======================================================
   */
  const selectedCreateStudent =
    useMemo(() => {
      if (!createForm.student) {
        return null;
      }

      return (
        students.find(
          (student) =>
            student._id ===
            createForm.student
        ) || null
      );
    }, [
      students,
      createForm.student,
    ]);

  /*
   * =======================================================
   * AVAILABLE COURSES
   * =======================================================
   */
  const createAvailableCourses =
    useMemo(() => {
      if (!selectedCreateStudent) {
        return [];
      }

      const assignedIds = new Set(
        getAssignedCourseIds(
          selectedCreateStudent
        )
      );

      return courses.filter((course) =>
        assignedIds.has(course._id)
      );
    }, [
      selectedCreateStudent,
      courses,
    ]);

  /*
   * =======================================================
   * FILTER FEES
   * =======================================================
   */
  const filteredFees = useMemo(() => {
    const query =
      search.trim().toLowerCase();

    return fees.filter((fee) => {
      const studentName =
        getStudentName(fee.student);

      const studentId =
        getStudentId(fee.student);

      const courseName =
        getCourseName(fee.course);

      const billingMonth =
        fee.billingMonth ||
        "UNASSIGNED";

      const status =
        fee.status ||
        getStatus(
          Number(fee.amount || 0),
          Number(
            fee.amountPaid || 0
          )
        );

      const matchesSearch =
        !query ||
        [
          studentName,
          studentId,
          courseName,
          billingMonth,
        ]
          .join(" ")
          .toLowerCase()
          .includes(query);

      const matchesMonth =
        !monthFilter ||
        billingMonth === monthFilter;

      const matchesStudent =
        !studentFilter ||
        (typeof fee.student ===
          "object" &&
          fee.student?._id ===
            studentFilter);

      const matchesCourse =
        !courseFilter ||
        (typeof fee.course ===
          "object" &&
          fee.course?._id ===
            courseFilter);

      const matchesStatus =
        !statusFilter ||
        status === statusFilter;

      return (
        matchesSearch &&
        matchesMonth &&
        matchesStudent &&
        matchesCourse &&
        matchesStatus
      );
    });
  }, [
    fees,
    search,
    monthFilter,
    studentFilter,
    courseFilter,
    statusFilter,
  ]);

  /*
   * =======================================================
   * MONTH GROUPS
   * =======================================================
   */
  const monthGroups = useMemo(() => {
    const groups: Record<
      string,
      FeeWithMonthly[]
    > = {};

    filteredFees.forEach((fee) => {
      const month =
        fee.billingMonth ||
        "UNASSIGNED";

      if (!groups[month]) {
        groups[month] = [];
      }

      groups[month].push(fee);
    });

    return Object.entries(groups).sort(
      ([a], [b]) => {
        if (a === "UNASSIGNED")
          return 1;

        if (b === "UNASSIGNED")
          return -1;

        return b.localeCompare(a);
      }
    );
  }, [filteredFees]);

  /*
   * =======================================================
   * FILTERED TOTALS
   * =======================================================
   */
  const filteredTotals = useMemo(() => {
    return filteredFees.reduce(
      (acc, fee) => {
        acc.fee += Number(
          fee.amount || 0
        );

        acc.paid += Number(
          fee.amountPaid || 0
        );

        return acc;
      },
      {
        fee: 0,
        paid: 0,
      }
    );
  }, [filteredFees]);

  const filteredDue = Math.max(
    0,
    filteredTotals.fee -
      filteredTotals.paid
  );

  /*
   * =======================================================
   * CREATE
   * =======================================================
   */
  async function handleCreate() {
    const amount = Number(
      createForm.amount || 0
    );

    const amountPaid = Number(
      createForm.amountPaid || 0
    );

    if (!createForm.student) {
      show(
        "Please select a student",
        "error"
      );
      return;
    }

    if (!createForm.course) {
      show(
        "Please select a course",
        "error"
      );
      return;
    }

    if (!createForm.billingMonth) {
      show(
        "Please select a billing month",
        "error"
      );
      return;
    }

    if (amount <= 0) {
      show(
        "Fee amount must be greater than 0",
        "error"
      );
      return;
    }

    if (amountPaid < 0) {
      show(
        "Paid amount cannot be negative",
        "error"
      );
      return;
    }

    if (amountPaid > amount) {
      show(
        "Paid amount cannot be greater than fee",
        "error"
      );
      return;
    }

    if (selectedCreateStudent) {
      const assignedIds =
        getAssignedCourseIds(
          selectedCreateStudent
        );

      if (
        !assignedIds.includes(
          createForm.course
        )
      ) {
        show(
          "This course is not assigned to the selected student.",
          "error"
        );
        return;
      }
    }

    setSaving(true);

    try {
      await api.post("/fees", {
        student:
          createForm.student,

        course:
          createForm.course,

        billingMonth:
          createForm.billingMonth,

        amount,

        amountPaid,

        dueDate:
          createForm.dueDate,

        paymentDate:
          createForm.paymentDate ||
          undefined,

        paymentMethod:
          createForm.paymentMethod ||
          undefined,

        transactionId:
          createForm.transactionId ||
          undefined,

        note:
          createForm.note ||
          undefined,
      });

      show(
        "Monthly fee record created successfully",
        "success"
      );

      setCreateOpen(false);

      setCreateForm({
        ...emptyCreate,
        billingMonth:
          getCurrentMonth(),
        dueDate: getToday(),
      });

      await load();
    } catch (err) {
      show(
        getErrorMessage(err),
        "error"
      );
    } finally {
      setSaving(false);
    }
  }

  /*
   * =======================================================
   * OPEN EDIT
   * =======================================================
   */
  function openEdit(
    fee: FeeWithMonthly
  ) {
    setEditTarget(fee);

    setUpdateForm({
      billingMonth:
        fee.billingMonth || "",

      amount:
        String(fee.amount || 0),

      amountPaid:
        String(fee.amountPaid || 0),

      dueDate:
        fee.dueDate
          ? fee.dueDate.slice(0, 10)
          : "",

      paymentDate:
        fee.paymentDate
          ? fee.paymentDate.slice(0, 10)
          : "",

      paymentMethod:
        fee.paymentMethod || "",

      transactionId:
        fee.transactionId || "",

      note:
        fee.note || "",
    });
  }

  /*
   * =======================================================
   * UPDATE
   * =======================================================
   */
  async function handleUpdate() {
    if (!editTarget) return;

    const amount = Number(
      updateForm.amount || 0
    );

    const amountPaid = Number(
      updateForm.amountPaid || 0
    );

    if (amount <= 0) {
      show(
        "Fee amount must be greater than 0",
        "error"
      );
      return;
    }

    if (amountPaid < 0) {
      show(
        "Paid amount cannot be negative",
        "error"
      );
      return;
    }

    if (amountPaid > amount) {
      show(
        "Paid amount cannot be greater than fee",
        "error"
      );
      return;
    }

    setSaving(true);

    try {
      await api.put(
        `/fees/${editTarget._id}`,
        {
          billingMonth:
            updateForm.billingMonth ||
            undefined,

          amount,

          amountPaid,

          dueDate:
            updateForm.dueDate ||
            undefined,

          paymentDate:
            updateForm.paymentDate ||
            undefined,

          paymentMethod:
            updateForm.paymentMethod ||
            undefined,

          transactionId:
            updateForm.transactionId ||
            undefined,

          note:
            updateForm.note ||
            undefined,
        }
      );

      show(
        "Monthly fee record updated",
        "success"
      );

      setEditTarget(null);

      await load();
    } catch (err) {
      show(
        getErrorMessage(err),
        "error"
      );
    } finally {
      setSaving(false);
    }
  }

  /*
   * =======================================================
   * MONTH TOGGLE
   * =======================================================
   */
  function toggleMonth(
    month: string
  ) {
    setOpenMonths((prev) => ({
      ...prev,
      [month]: !prev[month],
    }));
  }

  const createDue = Math.max(
    0,
    Number(createForm.amount || 0) -
      Number(
        createForm.amountPaid || 0
      )
  );

  const updateDue = Math.max(
    0,
    Number(updateForm.amount || 0) -
      Number(
        updateForm.amountPaid || 0
      )
  );

  /*
   * =======================================================
   * PENDING COUNT
   * =======================================================
   */
  const pendingPaymentCount =
    paymentRequests.filter(
      (request) =>
        request.status === "PENDING"
    ).length;

  /*
   * =======================================================
   * UI
   * =======================================================
   */
  return (
    <div className="space-y-6">
      {/* ===================================================
          HEADER
      =================================================== */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-brand-gold">
            Finance Management
          </p>

          <h1 className="font-display text-3xl font-bold tracking-tight text-slate-950 dark:text-white">
            Monthly Fees
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
            Manage every student fee month by month:
            Student → Course → Fee → Paid → Due.
          </p>
        </div>

        <Button
          onClick={() => {
            setCreateForm({
              ...emptyCreate,
              billingMonth:
                getCurrentMonth(),
              dueDate: getToday(),
            });

            setCreateOpen(true);
          }}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Monthly Fee
        </Button>
      </div>

      {/* ===================================================
          MAIN TOTALS
      =================================================== */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <div className="card-premium p-5">
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
            <FileText className="h-5 w-5" />
          </div>

          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Total Records
          </p>

          <p className="mt-2 text-2xl font-bold text-slate-950 dark:text-white">
            {summary.totalRecords}
          </p>
        </div>

        <div className="card-premium p-5">
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-300">
            <CircleDollarSign className="h-5 w-5" />
          </div>

          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Total Fee
          </p>

          <p className="mt-2 text-2xl font-bold text-slate-950 dark:text-white">
            {money(summary.totalFee)}
          </p>
        </div>

        <div className="card-premium p-5">
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300">
            <Wallet className="h-5 w-5" />
          </div>

          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Total Paid
          </p>

          <p className="mt-2 text-2xl font-bold text-emerald-700 dark:text-emerald-300">
            {money(summary.totalPaid)}
          </p>
        </div>

        <div className="card-premium p-5">
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-300">
            <CalendarDays className="h-5 w-5" />
          </div>

          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Total Due
          </p>

          <p className="mt-2 text-2xl font-bold text-red-700 dark:text-red-300">
            {money(summary.totalDue)}
          </p>
        </div>
      </div>

      {/* ===================================================
          BKASH PAYMENT VERIFICATION
      =================================================== */}
      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.06)] dark:border-slate-800 dark:bg-slate-950">
        <div className="border-b border-slate-200 bg-slate-50/80 p-5 dark:border-slate-800 dark:bg-slate-900/70">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#e2136e]/10 text-[#e2136e]">
                <CreditCard className="h-5 w-5" />
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-display text-xl font-bold text-slate-950 dark:text-white">
                    bKash Payment Verification
                  </h2>

                  {pendingPaymentCount > 0 && (
                    <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-bold text-amber-800 dark:bg-amber-950/40 dark:text-amber-300">
                      {pendingPaymentCount} Pending
                    </span>
                  )}
                </div>

                <p className="mt-1 text-sm text-slate-500">
                  Verify student-submitted bKash payments before adding them to the fee record.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={loadPaymentRequests}
              disabled={paymentRequestLoading}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900"
            >
              <RefreshCw
                className={`h-4 w-4 ${
                  paymentRequestLoading
                    ? "animate-spin"
                    : ""
                }`}
              />
              Refresh
            </button>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {[
              {
                value: "",
                label: "All",
              },
              {
                value: "PENDING",
                label: "Pending",
              },
              {
                value: "APPROVED",
                label: "Approved",
              },
              {
                value: "REJECTED",
                label: "Rejected",
              },
            ].map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() =>
                  setPaymentRequestStatus(
                    item.value
                  )
                }
                className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                  paymentRequestStatus ===
                  item.value
                    ? "bg-slate-950 text-white dark:bg-white dark:text-slate-950"
                    : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-slate-900"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {paymentRequestLoading ? (
          <div className="flex min-h-[180px] items-center justify-center">
            <Loader />
          </div>
        ) : paymentRequests.length === 0 ? (
          <div className="p-8">
            <EmptyState message="No bKash payment requests found." />
          </div>
        ) : (
          <>
            {/* Desktop payment requests */}
            <div className="hidden overflow-x-auto lg:block">
              <table className="w-full min-w-[1100px]">
                <thead>
                  <tr className="border-b border-slate-200 text-left dark:border-slate-800">
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                      Student
                    </th>

                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                      Fee
                    </th>

                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                      Payment
                    </th>

                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                      Submitted
                    </th>

                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                      Status
                    </th>

                    <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-slate-500">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {paymentRequests.map(
                    (request) => (
                      <tr
                        key={request._id}
                        className="border-b border-slate-100 last:border-0 dark:border-slate-800/80"
                      >
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                              <UserRound className="h-4 w-4" />
                            </div>

                            <div>
                              <p className="font-semibold text-slate-950 dark:text-white">
                                {request.student
                                  ?.fullName ||
                                  "Unknown Student"}
                              </p>

                              <p className="mt-0.5 text-xs text-slate-500">
                                ID:{" "}
                                {request.student
                                  ?.studentId ||
                                  "-"}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-5">
                          <p className="font-semibold text-slate-950 dark:text-white">
                            {request.fee
                              ?.billingMonth
                              ? monthLabel(
                                  request.fee
                                    .billingMonth
                                )
                              : "Fee"}
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            Fee:{" "}
                            {money(
                              Number(
                                request.fee
                                  ?.amount ||
                                  0
                              )
                            )}
                            {" • "}
                            Due:{" "}
                            {money(
                              Math.max(
                                0,
                                Number(
                                  request
                                    .fee
                                    ?.amount ||
                                    0
                                ) -
                                  Number(
                                    request
                                      .fee
                                      ?.amountPaid ||
                                      0
                                  )
                              )
                            )}
                          </p>
                        </td>

                        <td className="px-6 py-5">
                          <p className="font-bold text-[#e2136e]">
                            {money(
                              Number(
                                request.amount ||
                                  0
                              )
                            )}
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            bKash:{" "}
                            {request.senderNumber}
                          </p>

                          <p className="mt-1 text-xs font-semibold text-slate-700 dark:text-slate-300">
                            TrxID:{" "}
                            {request.transactionId}
                          </p>
                        </td>

                        <td className="px-6 py-5 text-sm text-slate-500">
                          {formatDateTime(
                            request.createdAt
                          )}
                        </td>

                        <td className="px-6 py-5">
                          <Badge
                            color={getPaymentStatusColor(
                              request.status
                            )}
                          >
                            {request.status}
                          </Badge>

                          {request.rejectionReason && (
                            <p className="mt-2 max-w-[180px] text-xs text-red-600 dark:text-red-400">
                              {request.rejectionReason}
                            </p>
                          )}
                        </td>

                        <td className="px-6 py-5 text-right">
                          {request.status ===
                          "PENDING" ? (
                            <div className="flex justify-end gap-2">
                              <button
                                type="button"
                                disabled={
                                  paymentActionId ===
                                  request._id
                                }
                                onClick={() =>
                                  handleApprovePayment(
                                    request
                                  )
                                }
                                className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-2 text-xs font-bold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                              >
                                <Check className="h-4 w-4" />

                                {paymentActionId ===
                                request._id
                                  ? "..."
                                  : "Approve"}
                              </button>

                              <button
                                type="button"
                                disabled={
                                  paymentActionId ===
                                  request._id
                                }
                                onClick={() => {
                                  setRejectTarget(
                                    request
                                  );
                                  setRejectionReason(
                                    ""
                                  );
                                }}
                                className="inline-flex items-center gap-1.5 rounded-xl bg-red-600 px-3 py-2 text-xs font-bold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                              >
                                <X className="h-4 w-4" />
                                Reject
                              </button>
                            </div>
                          ) : (
                            <span className="text-xs text-slate-400">
                              Reviewed
                            </span>
                          )}
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile payment requests */}
            <div className="divide-y divide-slate-200 dark:divide-slate-800 lg:hidden">
              {paymentRequests.map(
                (request) => (
                  <div
                    key={request._id}
                    className="p-5"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                          <UserRound className="h-4 w-4" />
                        </div>

                        <div className="min-w-0">
                          <p className="truncate font-semibold text-slate-950 dark:text-white">
                            {request.student
                              ?.fullName ||
                              "Unknown Student"}
                          </p>

                          <p className="text-xs text-slate-500">
                            {request.student
                              ?.studentId ||
                              "-"}
                          </p>
                        </div>
                      </div>

                      <Badge
                        color={getPaymentStatusColor(
                          request.status
                        )}
                      >
                        {request.status}
                      </Badge>
                    </div>

                    <div className="mt-4 rounded-2xl bg-slate-50 p-4 dark:bg-slate-900">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-xs text-slate-500">
                            Requested Amount
                          </p>

                          <p className="mt-1 text-xl font-bold text-[#e2136e]">
                            {money(
                              Number(
                                request.amount ||
                                  0
                              )
                            )}
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="text-xs text-slate-500">
                            Billing Month
                          </p>

                          <p className="mt-1 text-sm font-semibold text-slate-800 dark:text-slate-200">
                            {monthLabel(
                              request.fee
                                ?.billingMonth
                            )}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 grid gap-3 sm:grid-cols-2">
                        <div>
                          <p className="text-xs text-slate-500">
                            Sender bKash
                          </p>

                          <p className="mt-1 font-semibold text-slate-900 dark:text-white">
                            {request.senderNumber}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-slate-500">
                            Transaction ID
                          </p>

                          <p className="mt-1 break-all font-semibold text-slate-900 dark:text-white">
                            {request.transactionId}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 border-t border-slate-200 pt-3 dark:border-slate-800">
                        <p className="text-xs text-slate-500">
                          Submitted
                        </p>

                        <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">
                          {formatDateTime(
                            request.createdAt
                          )}
                        </p>
                      </div>
                    </div>

                    {request.rejectionReason && (
                      <div className="mt-3 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700 dark:border-red-900/40 dark:bg-red-950/20 dark:text-red-300">
                        <strong>
                          Rejection reason:
                        </strong>{" "}
                        {request.rejectionReason}
                      </div>
                    )}

                    {request.status ===
                      "PENDING" && (
                      <div className="mt-4 grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          disabled={
                            paymentActionId ===
                            request._id
                          }
                          onClick={() =>
                            handleApprovePayment(
                              request
                            )
                          }
                          className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-2.5 text-xs font-bold text-white transition hover:bg-emerald-700 disabled:opacity-60"
                        >
                          <Check className="h-4 w-4" />
                          Approve
                        </button>

                        <button
                          type="button"
                          disabled={
                            paymentActionId ===
                            request._id
                          }
                          onClick={() => {
                            setRejectTarget(
                              request
                            );
                            setRejectionReason(
                              ""
                            );
                          }}
                          className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-red-600 px-3 py-2.5 text-xs font-bold text-white transition hover:bg-red-700 disabled:opacity-60"
                        >
                          <X className="h-4 w-4" />
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                )
              )}
            </div>
          </>
        )}
      </section>

      {/* ===================================================
          FEE FILTERS
      =================================================== */}
      <div className="card-premium p-4">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <input
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search student, ID, course..."
              className="input-field pl-10"
            />
          </div>

          <input
            type="month"
            value={monthFilter}
            onChange={(e) =>
              setMonthFilter(
                e.target.value
              )
            }
            className="input-field"
          />

          <select
            value={studentFilter}
            onChange={(e) =>
              setStudentFilter(
                e.target.value
              )
            }
            className="input-field"
          >
            <option value="">
              All Students
            </option>

            {students.map(
              (student) => (
                <option
                  key={student._id}
                  value={student._id}
                >
                  {student.fullName} —{" "}
                  {student.studentId}
                </option>
              )
            )}
          </select>

          <select
            value={courseFilter}
            onChange={(e) =>
              setCourseFilter(
                e.target.value
              )
            }
            className="input-field"
          >
            <option value="">
              All Courses
            </option>

            {courses.map(
              (course) => (
                <option
                  key={course._id}
                  value={course._id}
                >
                  {course.title}
                </option>
              )
            )}
          </select>

          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(
                e.target.value
              )
            }
            className="input-field"
          >
            <option value="">
              All Status
            </option>

            <option value="PAID">
              Paid
            </option>

            <option value="PARTIAL">
              Partial
            </option>

            <option value="PENDING">
              Pending
            </option>
          </select>
        </div>

        {(search ||
          monthFilter ||
          studentFilter ||
          courseFilter ||
          statusFilter) && (
          <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-4 dark:border-slate-800">
            <p className="text-sm text-slate-500">
              Showing{" "}
              <span className="font-semibold text-slate-900 dark:text-white">
                {filteredFees.length}
              </span>{" "}
              fee records
            </p>

            <button
              type="button"
              onClick={() => {
                setSearch("");
                setMonthFilter("");
                setStudentFilter("");
                setCourseFilter("");
                setStatusFilter("");
              }}
              className="text-sm font-semibold text-brand-gold hover:underline"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      {/* ===================================================
          FILTERED TOTALS
      =================================================== */}
      {(search ||
        monthFilter ||
        studentFilter ||
        courseFilter ||
        statusFilter) && (
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
            <p className="text-xs text-slate-500">
              Filtered Fee
            </p>

            <p className="mt-1 font-display text-xl font-bold text-slate-950 dark:text-white">
              {money(
                filteredTotals.fee
              )}
            </p>
          </div>

          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-4 dark:border-emerald-900/40 dark:bg-emerald-950/20">
            <p className="text-xs text-emerald-700 dark:text-emerald-300">
              Filtered Paid
            </p>

            <p className="mt-1 font-display text-xl font-bold text-emerald-700 dark:text-emerald-300">
              {money(
                filteredTotals.paid
              )}
            </p>
          </div>

          <div className="rounded-2xl border border-red-200 bg-red-50/50 p-4 dark:border-red-900/40 dark:bg-red-950/20">
            <p className="text-xs text-red-700 dark:text-red-300">
              Filtered Due
            </p>

            <p className="mt-1 font-display text-xl font-bold text-red-700 dark:text-red-300">
              {money(filteredDue)}
            </p>
          </div>
        </div>
      )}

      {/* ===================================================
          FEE HISTORY
      =================================================== */}
      {loading ? (
        <div className="card-premium flex min-h-[300px] items-center justify-center">
          <Loader />
        </div>
      ) : monthGroups.length === 0 ? (
        <div className="card-premium p-8">
          <EmptyState message="No fee records found. There are no fee records matching the current filters." />
        </div>
      ) : (
        <div className="space-y-5">
          {monthGroups.map(
            ([month, monthFees]) => {
              const monthFee =
                monthFees.reduce(
                  (sum, fee) =>
                    sum +
                    Number(
                      fee.amount || 0
                    ),
                  0
                );

              const monthPaid =
                monthFees.reduce(
                  (sum, fee) =>
                    sum +
                    Number(
                      fee.amountPaid ||
                        0
                    ),
                  0
                );

              const monthDue =
                Math.max(
                  0,
                  monthFee -
                    monthPaid
                );

              const isOpen =
                openMonths[month] !==
                false;

              return (
                <section
                  key={month}
                  className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.06)] dark:border-slate-800 dark:bg-slate-950"
                >
                  <button
                    type="button"
                    onClick={() =>
                      toggleMonth(month)
                    }
                    className="w-full border-b border-slate-200 bg-slate-50/80 p-5 text-left transition hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900/70 dark:hover:bg-slate-900"
                  >
                    <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-white dark:bg-white dark:text-slate-950">
                          <CalendarDays className="h-5 w-5" />
                        </div>

                        <div>
                          <p className="font-display text-xl font-bold text-slate-950 dark:text-white">
                            {monthLabel(month)}
                          </p>

                          <p className="mt-1 text-sm text-slate-500">
                            {monthFees.length} fee{" "}
                            {monthFees.length ===
                            1
                              ? "record"
                              : "records"}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-3">
                        <div className="rounded-xl border border-slate-200 bg-white px-4 py-2 dark:border-slate-700 dark:bg-slate-950">
                          <span className="text-xs text-slate-500">
                            Fee
                          </span>

                          <p className="font-bold text-slate-950 dark:text-white">
                            {money(monthFee)}
                          </p>
                        </div>

                        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2 dark:border-emerald-900/50 dark:bg-emerald-950/30">
                          <span className="text-xs text-emerald-700 dark:text-emerald-300">
                            Paid
                          </span>

                          <p className="font-bold text-emerald-700 dark:text-emerald-300">
                            {money(monthPaid)}
                          </p>
                        </div>

                        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-2 dark:border-red-900/50 dark:bg-red-950/30">
                          <span className="text-xs text-red-700 dark:text-red-300">
                            Due
                          </span>

                          <p className="font-bold text-red-700 dark:text-red-300">
                            {money(monthDue)}
                          </p>
                        </div>

                        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-950">
                          {isOpen ? (
                            <ChevronUp className="h-5 w-5" />
                          ) : (
                            <ChevronDown className="h-5 w-5" />
                          )}
                        </div>
                      </div>
                    </div>
                  </button>

                  {isOpen && (
                    <>
                      {/* Desktop */}
                      <div className="hidden overflow-x-auto lg:block">
                        <table className="w-full min-w-[1000px]">
                          <thead>
                            <tr className="border-b border-slate-200 text-left dark:border-slate-800">
                              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                                Student
                              </th>

                              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                                Course
                              </th>

                              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                                Fee
                              </th>

                              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-emerald-600">
                                Paid
                              </th>

                              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-red-600">
                                Due
                              </th>

                              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                                Status
                              </th>

                              <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-slate-500">
                                Action
                              </th>
                            </tr>
                          </thead>

                          <tbody>
                            {monthFees.map(
                              (fee) => {
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
                                    0,
                                    amount -
                                      paid
                                  );

                                const status =
                                  fee.status ||
                                  getStatus(
                                    amount,
                                    paid
                                  );

                                return (
                                  <tr
                                    key={
                                      fee._id
                                    }
                                    className="border-b border-slate-100 last:border-0 hover:bg-slate-50/70 dark:border-slate-800/80 dark:hover:bg-slate-900/50"
                                  >
                                    <td className="px-6 py-5">
                                      <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                                          <UserRound className="h-4 w-4" />
                                        </div>

                                        <div>
                                          <p className="font-semibold text-slate-950 dark:text-white">
                                            {getStudentName(
                                              fee.student
                                            )}
                                          </p>

                                          <p className="mt-0.5 text-xs text-slate-500">
                                            ID:{" "}
                                            {getStudentId(
                                              fee.student
                                            )}
                                          </p>
                                        </div>
                                      </div>
                                    </td>

                                    <td className="px-6 py-5">
                                      <p className="font-medium text-slate-800 dark:text-slate-200">
                                        {getCourseName(
                                          fee.course
                                        )}
                                      </p>

                                      <p className="mt-1 text-xs text-slate-500">
                                        {getCourseSubject(
                                          fee.course
                                        )}
                                      </p>
                                    </td>

                                    <td className="px-6 py-5 font-semibold text-slate-950 dark:text-white">
                                      {money(amount)}
                                    </td>

                                    <td className="px-6 py-5 font-semibold text-emerald-700 dark:text-emerald-300">
                                      {money(paid)}
                                    </td>

                                    <td className="px-6 py-5 font-semibold text-red-700 dark:text-red-300">
                                      {money(due)}
                                    </td>

                                    <td className="px-6 py-5">
                                      <Badge
                                        color={getStatusColor(
                                          status
                                        )}
                                      >
                                        {status}
                                      </Badge>
                                    </td>

                                    <td className="px-6 py-5 text-right">
                                      <button
                                        type="button"
                                        onClick={() =>
                                          openEdit(
                                            fee
                                          )
                                        }
                                        className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:border-slate-400 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                                        title="Edit fee"
                                      >
                                        <Edit3 className="h-4 w-4" />
                                      </button>
                                    </td>
                                  </tr>
                                );
                              }
                            )}
                          </tbody>
                        </table>
                      </div>

                      {/* Mobile */}
                      <div className="divide-y divide-slate-200 dark:divide-slate-800 lg:hidden">
                        {monthFees.map(
                          (fee) => {
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
                                0,
                                amount -
                                  paid
                              );

                            const status =
                              fee.status ||
                              getStatus(
                                amount,
                                paid
                              );

                            return (
                              <div
                                key={
                                  fee._id
                                }
                                className="p-5"
                              >
                                <div className="flex items-start justify-between gap-3">
                                  <div className="flex min-w-0 items-center gap-3">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                                      <UserRound className="h-4 w-4" />
                                    </div>

                                    <div className="min-w-0">
                                      <p className="truncate font-semibold text-slate-950 dark:text-white">
                                        {getStudentName(
                                          fee.student
                                        )}
                                      </p>

                                      <p className="text-xs text-slate-500">
                                        {getStudentId(
                                          fee.student
                                        )}
                                      </p>
                                    </div>
                                  </div>

                                  <button
                                    type="button"
                                    onClick={() =>
                                      openEdit(
                                        fee
                                      )
                                    }
                                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700"
                                  >
                                    <Edit3 className="h-4 w-4" />
                                  </button>
                                </div>

                                <div className="mt-4 rounded-2xl bg-slate-50 p-4 dark:bg-slate-900">
                                  <p className="font-medium text-slate-800 dark:text-slate-200">
                                    {getCourseName(
                                      fee.course
                                    )}
                                  </p>

                                  <p className="mt-1 text-xs text-slate-500">
                                    {getCourseSubject(
                                      fee.course
                                    )}
                                  </p>
                                </div>

                                <div className="mt-4 grid grid-cols-3 gap-2">
                                  <div className="rounded-xl border border-slate-200 p-3 dark:border-slate-800">
                                    <p className="text-[10px] font-semibold uppercase text-slate-500">
                                      Fee
                                    </p>

                                    <p className="mt-1 font-bold text-slate-950 dark:text-white">
                                      {money(amount)}
                                    </p>
                                  </div>

                                  <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-3 dark:border-emerald-900/40 dark:bg-emerald-950/20">
                                    <p className="text-[10px] font-semibold uppercase text-emerald-600">
                                      Paid
                                    </p>

                                    <p className="mt-1 font-bold text-emerald-700 dark:text-emerald-300">
                                      {money(paid)}
                                    </p>
                                  </div>

                                  <div className="rounded-xl border border-red-200 bg-red-50/50 p-3 dark:border-red-900/40 dark:bg-red-950/20">
                                    <p className="text-[10px] font-semibold uppercase text-red-600">
                                      Due
                                    </p>

                                    <p className="mt-1 font-bold text-red-700 dark:text-red-300">
                                      {money(due)}
                                    </p>
                                  </div>
                                </div>

                                <div className="mt-4 flex items-center justify-between">
                                  <Badge
                                    color={getStatusColor(
                                      status
                                    )}
                                  >
                                    {status}
                                  </Badge>

                                  <p className="text-xs text-slate-500">
                                    Due:{" "}
                                    {formatDate(
                                      fee.dueDate
                                    )}
                                  </p>
                                </div>
                              </div>
                            );
                          }
                        )}
                      </div>
                    </>
                  )}
                </section>
              );
            }
          )}
        </div>
      )}

      {/* ===================================================
          CREATE MODAL
      =================================================== */}
      <Modal
        open={createOpen}
        onClose={() => {
          if (!saving) {
            setCreateOpen(false);
          }
        }}
        title="Add Monthly Fee"
      >
        <div className="space-y-5">
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900/40 dark:bg-amber-950/20">
            <p className="text-sm font-semibold text-amber-900 dark:text-amber-200">
              Monthly Accounting
            </p>

            <p className="mt-1 text-xs leading-5 text-amber-800/80 dark:text-amber-300/80">
              Each student + course + month is a
              separate fee record.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label-field">
                Billing Month
              </label>

              <input
                type="month"
                value={
                  createForm.billingMonth
                }
                onChange={(e) =>
                  setCreateForm(
                    (prev) => ({
                      ...prev,
                      billingMonth:
                        e.target.value,
                    })
                  )
                }
                className="input-field"
              />
            </div>

            <div>
              <label className="label-field">
                Due Date
              </label>

              <input
                type="date"
                value={
                  createForm.dueDate
                }
                onChange={(e) =>
                  setCreateForm(
                    (prev) => ({
                      ...prev,
                      dueDate:
                        e.target.value,
                    })
                  )
                }
                className="input-field"
              />
            </div>
          </div>

          <div>
            <label className="label-field">
              Student
            </label>

            <select
              value={createForm.student}
              onChange={(e) => {
                const studentId =
                  e.target.value;

                setCreateForm(
                  (prev) => ({
                    ...prev,
                    student:
                      studentId,
                    course: "",
                  })
                );
              }}
              className="input-field"
            >
              <option value="">
                Select student
              </option>

              {students.map(
                (student) => (
                  <option
                    key={student._id}
                    value={student._id}
                  >
                    {student.fullName} —{" "}
                    {student.studentId}
                  </option>
                )
              )}
            </select>
          </div>

          <div>
            <label className="label-field">
              Course
            </label>

            <select
              value={createForm.course}
              onChange={(e) =>
                setCreateForm(
                  (prev) => ({
                    ...prev,
                    course:
                      e.target.value,
                  })
                )
              }
              disabled={
                !createForm.student
              }
              className="input-field disabled:cursor-not-allowed disabled:opacity-60"
            >
              <option value="">
                {!createForm.student
                  ? "Select student first"
                  : createAvailableCourses.length ===
                    0
                  ? "No assigned course"
                  : "Select course"}
              </option>

              {createAvailableCourses.map(
                (course) => (
                  <option
                    key={course._id}
                    value={course._id}
                  >
                    {course.title}
                    {course.classLevel
                      ? ` — ${course.classLevel}`
                      : ""}
                    {course.subject
                      ? ` • ${course.subject}`
                      : ""}
                  </option>
                )
              )}
            </select>

            {createForm.student &&
              createAvailableCourses.length ===
                0 && (
                <p className="mt-2 text-xs text-red-600 dark:text-red-400">
                  No course is assigned to this
                  student. Assign a course from
                  the Student management page
                  first.
                </p>
              )}
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <Input
              label="Monthly Fee"
              type="number"
              min="0"
              value={createForm.amount}
              onChange={(e) =>
                setCreateForm(
                  (prev) => ({
                    ...prev,
                    amount:
                      e.target.value,
                  })
                )
              }
              placeholder="1000"
            />

            <Input
              label="Paid Amount"
              type="number"
              min="0"
              value={
                createForm.amountPaid
              }
              onChange={(e) =>
                setCreateForm(
                  (prev) => ({
                    ...prev,
                    amountPaid:
                      e.target.value,
                  })
                )
              }
              placeholder="500"
            />

            <div>
              <label className="label-field">
                Due
              </label>

              <div className="input-field flex items-center bg-red-50 font-bold text-red-700 dark:bg-red-950/20 dark:text-red-300">
                {money(createDue)}
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Payment Date"
              type="date"
              value={
                createForm.paymentDate
              }
              onChange={(e) =>
                setCreateForm(
                  (prev) => ({
                    ...prev,
                    paymentDate:
                      e.target.value,
                  })
                )
              }
            />

            <Input
              label="Payment Method"
              value={
                createForm.paymentMethod
              }
              onChange={(e) =>
                setCreateForm(
                  (prev) => ({
                    ...prev,
                    paymentMethod:
                      e.target.value,
                  })
                )
              }
              placeholder="Cash / bKash / Bank"
            />
          </div>

          <Input
            label="Transaction ID"
            value={
              createForm.transactionId
            }
            onChange={(e) =>
              setCreateForm(
                (prev) => ({
                  ...prev,
                  transactionId:
                    e.target.value,
                })
              )
            }
            placeholder="Optional"
          />

          <div>
            <label className="label-field">
              Note
            </label>

            <textarea
              value={createForm.note}
              onChange={(e) =>
                setCreateForm(
                  (prev) => ({
                    ...prev,
                    note: e.target.value,
                  })
                )
              }
              rows={3}
              className="input-field resize-none"
              placeholder="Optional note..."
            />
          </div>

          <div className="flex justify-end gap-3 border-t border-slate-200 pt-5 dark:border-slate-800">
            <Button
              variant="secondary"
              onClick={() =>
                setCreateOpen(false)
              }
              disabled={saving}
            >
              Cancel
            </Button>

            <Button
              onClick={handleCreate}
              disabled={
                saving ||
                !createForm.student ||
                !createForm.course
              }
              className="gap-2"
            >
              <Plus className="h-4 w-4" />

              {saving
                ? "Saving..."
                : "Create Fee"}
            </Button>
          </div>
        </div>
      </Modal>

      {/* ===================================================
          EDIT MODAL
      =================================================== */}
      <Modal
        open={!!editTarget}
        onClose={() => {
          if (!saving) {
            setEditTarget(null);
          }
        }}
        title="Edit Monthly Fee"
      >
        <div className="space-y-5">
          <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-900">
            <p className="text-sm font-semibold text-slate-950 dark:text-white">
              {editTarget
                ? getStudentName(
                    editTarget.student
                  )
                : ""}
            </p>

            <p className="mt-1 text-xs text-slate-500">
              {editTarget
                ? getCourseName(
                    editTarget.course
                  )
                : ""}
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label-field">
                Billing Month
              </label>

              <input
                type="month"
                value={
                  updateForm.billingMonth
                }
                onChange={(e) =>
                  setUpdateForm(
                    (prev) => ({
                      ...prev,
                      billingMonth:
                        e.target.value,
                    })
                  )
                }
                className="input-field"
              />
            </div>

            <Input
              label="Due Date"
              type="date"
              value={
                updateForm.dueDate
              }
              onChange={(e) =>
                setUpdateForm(
                  (prev) => ({
                    ...prev,
                    dueDate:
                      e.target.value,
                  })
                )
              }
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <Input
              label="Fee"
              type="number"
              min="0"
              value={
                updateForm.amount
              }
              onChange={(e) =>
                setUpdateForm(
                  (prev) => ({
                    ...prev,
                    amount:
                      e.target.value,
                  })
                )
              }
            />

            <Input
              label="Paid"
              type="number"
              min="0"
              value={
                updateForm.amountPaid
              }
              onChange={(e) =>
                setUpdateForm(
                  (prev) => ({
                    ...prev,
                    amountPaid:
                      e.target.value,
                  })
                )
              }
            />

            <div>
              <label className="label-field">
                Due
              </label>

              <div className="input-field flex items-center bg-red-50 font-bold text-red-700 dark:bg-red-950/20 dark:text-red-300">
                {money(updateDue)}
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Payment Date"
              type="date"
              value={
                updateForm.paymentDate
              }
              onChange={(e) =>
                setUpdateForm(
                  (prev) => ({
                    ...prev,
                    paymentDate:
                      e.target.value,
                  })
                )
              }
            />

            <Input
              label="Payment Method"
              value={
                updateForm.paymentMethod
              }
              onChange={(e) =>
                setUpdateForm(
                  (prev) => ({
                    ...prev,
                    paymentMethod:
                      e.target.value,
                  })
                )
              }
            />
          </div>

          <Input
            label="Transaction ID"
            value={
              updateForm.transactionId
            }
            onChange={(e) =>
              setUpdateForm(
                (prev) => ({
                  ...prev,
                  transactionId:
                    e.target.value,
                })
              )
            }
          />

          <div>
            <label className="label-field">
              Note
            </label>

            <textarea
              value={updateForm.note}
              onChange={(e) =>
                setUpdateForm(
                  (prev) => ({
                    ...prev,
                    note: e.target.value,
                  })
                )
              }
              rows={3}
              className="input-field resize-none"
            />
          </div>

          <div className="flex justify-end gap-3 border-t border-slate-200 pt-5 dark:border-slate-800">
            <Button
              variant="secondary"
              onClick={() =>
                setEditTarget(null)
              }
              disabled={saving}
            >
              Cancel
            </Button>

            <Button
              onClick={handleUpdate}
              disabled={saving}
            >
              {saving
                ? "Updating..."
                : "Update Fee"}
            </Button>
          </div>
        </div>
      </Modal>

      {/* ===================================================
          REJECT PAYMENT MODAL
      =================================================== */}
      <Modal
        open={!!rejectTarget}
        onClose={() => {
          if (!paymentActionId) {
            setRejectTarget(null);
            setRejectionReason("");
          }
        }}
        title="Reject bKash Payment"
      >
        <div className="space-y-5">
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 dark:border-red-900/40 dark:bg-red-950/20">
            <p className="text-sm font-semibold text-red-900 dark:text-red-200">
              Reject this payment request?
            </p>

            {rejectTarget && (
              <div className="mt-3 space-y-1 text-xs text-red-800/80 dark:text-red-300/80">
                <p>
                  Student:{" "}
                  <strong>
                    {rejectTarget.student
                      ?.fullName ||
                      "-"}
                  </strong>
                </p>

                <p>
                  Amount:{" "}
                  <strong>
                    {money(
                      Number(
                        rejectTarget.amount ||
                          0
                      )
                    )}
                  </strong>
                </p>

                <p>
                  TrxID:{" "}
                  <strong>
                    {
                      rejectTarget.transactionId
                    }
                  </strong>
                </p>
              </div>
            )}
          </div>

          <div>
            <label className="label-field">
              Rejection Reason
            </label>

            <textarea
              value={rejectionReason}
              onChange={(e) =>
                setRejectionReason(
                  e.target.value
                )
              }
              rows={4}
              className="input-field resize-none"
              placeholder="Optional reason, e.g. Transaction could not be verified."
            />
          </div>

          <div className="flex justify-end gap-3 border-t border-slate-200 pt-5 dark:border-slate-800">
            <Button
              variant="secondary"
              onClick={() => {
                setRejectTarget(null);
                setRejectionReason("");
              }}
              disabled={!!paymentActionId}
            >
              Cancel
            </Button>

            <Button
              onClick={handleRejectPayment}
              disabled={!!paymentActionId}
              className="gap-2 bg-red-600 hover:bg-red-700"
            >
              <X className="h-4 w-4" />

              {paymentActionId
                ? "Rejecting..."
                : "Reject Payment"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}