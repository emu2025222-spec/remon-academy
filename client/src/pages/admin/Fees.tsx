import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  Filter,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  WalletCards,
  X,
} from "lucide-react";

import { api, getErrorMessage } from "../../services/api";
import {
  Fee,
  Student,
  Course,
  PaginatedResponse,
} from "../../types";

import { Loader } from "../../components/Loader";
import { EmptyState } from "../../components/EmptyState";
import { Pagination } from "../../components/Pagination";
import { Modal } from "../../components/Modal";
import { Input } from "../../components/Input";
import { Button } from "../../components/Button";
import { Badge } from "../../components/Badge";
import { useToast } from "../../components/Toast";

type FeeStatusValue = "PAID" | "PENDING" | "PARTIAL";

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

interface MonthlySummary {
  _id?: string;
  month?: string;
  totalFee: number;
  totalPaid: number;
  totalDue: number;
  totalRecords: number;
}

interface CourseSummary {
  _id?: string;
  courseId?: string;
  totalFee: number;
  totalPaid: number;
  totalDue: number;
  totalRecords: number;
  course?: {
    _id?: string;
    title?: string;
    subject?: string;
    classLevel?: string;
  };
}

interface FeeSummary {
  totalRecords: number;
  totalFee: number;
  totalPaid: number;
  totalDue: number;
  paidPercentage: number;
  duePercentage: number;
  monthlySummary: MonthlySummary[];
  courseSummary: CourseSummary[];
}

const getCurrentMonth = () => {
  return new Date().toISOString().slice(0, 7);
};

const getToday = () => {
  return new Date().toISOString().slice(0, 10);
};

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

const emptySummary: FeeSummary = {
  totalRecords: 0,
  totalFee: 0,
  totalPaid: 0,
  totalDue: 0,
  paidPercentage: 0,
  duePercentage: 0,
  monthlySummary: [],
  courseSummary: [],
};

function formatMonth(month?: string) {
  if (!month || month === "UNASSIGNED") {
    return "Unassigned";
  }

  const [year, monthNumber] = month.split("-");

  if (!year || !monthNumber) {
    return month;
  }

  const date = new Date(
    Number(year),
    Number(monthNumber) - 1,
    1
  );

  if (Number.isNaN(date.getTime())) {
    return month;
  }

  return date.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

function formatDate(value?: string | Date) {
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

function getFeeStatus(
  amount: number,
  amountPaid: number
): FeeStatusValue {
  if (amount > 0 && amountPaid >= amount) {
    return "PAID";
  }

  if (amountPaid > 0) {
    return "PARTIAL";
  }

  return "PENDING";
}

function statusColor(status?: string) {
  if (status === "PAID") return "green";
  if (status === "PARTIAL") return "gold";
  return "red";
}

function getStudentName(student: Fee["student"]) {
  if (typeof student === "object" && student) {
    return student.fullName || "-";
  }

  return "-";
}

function getStudentId(student: Fee["student"]) {
  if (typeof student === "object" && student) {
    return student.studentId || "";
  }

  return "";
}

function getCourseTitle(course: Fee["course"]) {
  if (typeof course === "object" && course) {
    return course.title || "-";
  }

  return "-";
}

function getCourseSubject(course: Fee["course"]) {
  if (typeof course === "object" && course) {
    return course.subject || "";
  }

  return "";
}

export default function AdminFees() {
  const [data, setData] =
    useState<PaginatedResponse<Fee> | null>(null);

  const [summary, setSummary] =
    useState<FeeSummary>(emptySummary);

  const [students, setStudents] =
    useState<Student[]>([]);

  const [courses, setCourses] =
    useState<Course[]>([]);

  const [page, setPage] = useState(1);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [createOpen, setCreateOpen] =
    useState(false);

  const [editTarget, setEditTarget] =
    useState<Fee | null>(null);

  const [createForm, setCreateForm] =
    useState<CreateForm>(emptyCreate);

  const [updateForm, setUpdateForm] =
    useState<UpdateForm>(emptyUpdate);

  const [search, setSearch] =
    useState("");

  const [courseFilter, setCourseFilter] =
    useState("");

  const [monthFilter, setMonthFilter] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("");

  const [studentFilter, setStudentFilter] =
    useState("");

  const { show } = useToast();

  async function load() {
    setLoading(true);

    try {
      const params: Record<string, string | number> = {
        page,
      };

      if (courseFilter) {
        params.course = courseFilter;
      }

      if (monthFilter) {
        params.billingMonth = monthFilter;
      }

      if (statusFilter) {
        params.status = statusFilter;
      }

      if (studentFilter) {
        params.student = studentFilter;
      }

      const [
        feesResponse,
        summaryResponse,
      ] = await Promise.all([
        api.get("/fees", {
          params,
        }),

        api.get("/fees/summary"),
      ]);

      setData(feesResponse.data.data);

      setSummary({
        ...emptySummary,
        ...(summaryResponse.data.data || {}),
        monthlySummary:
          summaryResponse.data.data?.monthlySummary ||
          [],
        courseSummary:
          summaryResponse.data.data?.courseSummary ||
          [],
      });
    } catch (err) {
      show(getErrorMessage(err), "error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [
    page,
    courseFilter,
    monthFilter,
    statusFilter,
    studentFilter,
  ]);

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

        setStudents(
          studentsResponse.data.data.data || []
        );

        setCourses(
          coursesResponse.data.data.data || []
        );
      } catch (err) {
        show(getErrorMessage(err), "error");
      }
    }

    loadOptions();
  }, []);

  const visibleFees = useMemo(() => {
    const records = data?.data || [];

    const query = search.trim().toLowerCase();

    if (!query) {
      return records;
    }

    return records.filter((fee) => {
      const studentName =
        getStudentName(fee.student);

      const studentId =
        getStudentId(fee.student);

      const courseTitle =
        getCourseTitle(fee.course);

      const courseSubject =
        getCourseSubject(fee.course);

      const month =
        fee.billingMonth || "";

      return [
        studentName,
        studentId,
        courseTitle,
        courseSubject,
        month,
      ]
        .join(" ")
        .toLowerCase()
        .includes(query);
    });
  }, [data, search]);

  async function handleCreate() {
    if (!createForm.student) {
      show("Please select a student", "error");
      return;
    }

    if (!createForm.course) {
      show("Please select a course", "error");
      return;
    }

    if (!createForm.billingMonth) {
      show(
        "Please select a billing month",
        "error"
      );
      return;
    }

    if (!createForm.amount) {
      show(
        "Please enter the fee amount",
        "error"
      );
      return;
    }

    if (!createForm.dueDate) {
      show(
        "Please select the due date",
        "error"
      );
      return;
    }

    const amount =
      Number(createForm.amount);

    const amountPaid =
      Number(createForm.amountPaid || 0);

    if (!Number.isFinite(amount) || amount <= 0) {
      show(
        "Fee amount must be greater than 0",
        "error"
      );
      return;
    }

    if (
      !Number.isFinite(amountPaid) ||
      amountPaid < 0
    ) {
      show(
        "Paid amount cannot be negative",
        "error"
      );
      return;
    }

    if (amountPaid > amount) {
      show(
        "Paid amount cannot be greater than the fee amount",
        "error"
      );
      return;
    }

    setSaving(true);

    try {
      await api.post("/fees", {
        student: createForm.student,
        course: createForm.course,
        billingMonth:
          createForm.billingMonth,
        amount,
        amountPaid,
        dueDate: createForm.dueDate,
        paymentDate:
          createForm.paymentDate || undefined,
        paymentMethod:
          createForm.paymentMethod || undefined,
        transactionId:
          createForm.transactionId || undefined,
        note:
          createForm.note || undefined,
      });

      show(
        "Monthly fee record created successfully",
        "success"
      );

      setCreateOpen(false);

      setCreateForm({
        ...emptyCreate,
        billingMonth: getCurrentMonth(),
        dueDate: getToday(),
      });

      await load();
    } catch (err) {
      show(getErrorMessage(err), "error");
    } finally {
      setSaving(false);
    }
  }

  function openEdit(fee: Fee) {
    setEditTarget(fee);

    setUpdateForm({
      billingMonth:
        fee.billingMonth || "",

      amount: String(fee.amount || 0),

      amountPaid: String(
        fee.amountPaid || 0
      ),

      dueDate: fee.dueDate
        ? String(fee.dueDate).slice(0, 10)
        : "",

      paymentDate:
        fee.paymentDate
          ? String(fee.paymentDate).slice(0, 10)
          : "",

      paymentMethod:
        fee.paymentMethod || "",

      transactionId:
        fee.transactionId || "",

      note: fee.note || "",
    });
  }

  async function handleUpdate() {
    if (!editTarget) return;

    const amount =
      Number(updateForm.amount);

    const amountPaid =
      Number(updateForm.amountPaid || 0);

    if (!updateForm.dueDate) {
      show(
        "Please select the due date",
        "error"
      );
      return;
    }

    if (!Number.isFinite(amount) || amount <= 0) {
      show(
        "Fee amount must be greater than 0",
        "error"
      );
      return;
    }

    if (
      !Number.isFinite(amountPaid) ||
      amountPaid < 0
    ) {
      show(
        "Paid amount cannot be negative",
        "error"
      );
      return;
    }

    if (amountPaid > amount) {
      show(
        "Paid amount cannot be greater than the fee amount",
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
            updateForm.dueDate,

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
        "Monthly fee record updated successfully",
        "success"
      );

      setEditTarget(null);

      await load();
    } catch (err) {
      show(getErrorMessage(err), "error");
    } finally {
      setSaving(false);
    }
  }

  function clearFilters() {
    setSearch("");
    setCourseFilter("");
    setMonthFilter("");
    setStatusFilter("");
    setStudentFilter("");
    setPage(1);
  }

  const hasFilters = Boolean(
    search ||
      courseFilter ||
      monthFilter ||
      statusFilter ||
      studentFilter
  );

  const currentEditStatus = getFeeStatus(
    Number(updateForm.amount || 0),
    Number(updateForm.amountPaid || 0)
  );

  const currentEditDue = Math.max(
    Number(updateForm.amount || 0) -
      Number(updateForm.amountPaid || 0),
    0
  );

  return (
    <div className="space-y-6">
      {/* HEADER */}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-brand-gold/10 text-brand-gold">
              <WalletCards className="h-4 w-4" />
            </span>

            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              Finance
            </span>
          </div>

          <h2 className="font-display text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Fees Management
          </h2>

          <p className="mt-1 max-w-2xl text-sm text-slate-500 dark:text-slate-400">
            Manage monthly student fees, payments,
            pending balances and course-wise
            collections from one place.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            variant="secondary"
            onClick={load}
            disabled={loading}
          >
            <RefreshCw
              className={`h-4 w-4 ${
                loading ? "animate-spin" : ""
              }`}
            />

            Refresh
          </Button>

          <Button
            onClick={() => {
              setCreateForm({
                ...emptyCreate,
                billingMonth: getCurrentMonth(),
                dueDate: getToday(),
              });

              setCreateOpen(true);
            }}
          >
            <Plus className="h-4 w-4" />

            Add Monthly Fee
          </Button>
        </div>
      </div>

      {/* SUMMARY CARDS */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="card-premium p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-400">
            Total Records
          </p>

          <p className="mt-3 text-2xl font-bold text-slate-900 dark:text-white">
            {Number(
              summary.totalRecords || 0
            ).toLocaleString()}
          </p>

          <p className="mt-1 text-xs text-slate-500">
            Monthly fee entries
          </p>
        </div>

        <div className="card-premium p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-400">
            Total Fees
          </p>

          <p className="mt-3 text-2xl font-bold text-slate-900 dark:text-white">
            ৳
            {Number(
              summary.totalFee || 0
            ).toLocaleString()}
          </p>

          <p className="mt-1 text-xs text-slate-500">
            Overall billed amount
          </p>
        </div>

        <div className="card-premium p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-400">
            Total Paid
          </p>

          <p className="mt-3 text-2xl font-bold text-emerald-600">
            ৳
            {Number(
              summary.totalPaid || 0
            ).toLocaleString()}
          </p>

          <p className="mt-1 text-xs text-slate-500">
            Collected so far
          </p>
        </div>

        <div className="card-premium p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-400">
            Total Due
          </p>

          <p className="mt-3 text-2xl font-bold text-red-600">
            ৳
            {Number(
              summary.totalDue || 0
            ).toLocaleString()}
          </p>

          <p className="mt-1 text-xs text-slate-500">
            Remaining balance
          </p>
        </div>
      </div>

      {/* COLLECTION PROGRESS */}

      <div className="card-premium p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-white">
              Collection Progress
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Paid vs total billed amount
            </p>
          </div>

          <div className="text-left sm:text-right">
            <p className="text-2xl font-bold text-emerald-600">
              {Math.min(
                Math.max(
                  Number(
                    summary.paidPercentage || 0
                  ),
                  0
                ),
                100
              )}
              %
            </p>

            <p className="text-xs text-slate-400">
              collected
            </p>
          </div>
        </div>

        <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
          <div
            className="h-full rounded-full bg-emerald-500 transition-all duration-500"
            style={{
              width: `${Math.min(
                Math.max(
                  Number(
                    summary.paidPercentage || 0
                  ),
                  0
                ),
                100
              )}%`,
            }}
          />
        </div>
      </div>

      {/* FILTERS */}

      <div className="card-premium p-5">
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-brand-gold" />

            <h3 className="font-semibold text-slate-900 dark:text-white">
              Fee Filters
            </h3>
          </div>

          {hasFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 transition hover:text-slate-900 dark:hover:text-white"
            >
              <X className="h-3.5 w-3.5" />

              Clear filters
            </button>
          )}
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search student..."
              className="input-field pl-9"
            />
          </div>

          <div>
            <select
              value={studentFilter}
              onChange={(e) => {
                setStudentFilter(e.target.value);
                setPage(1);
              }}
              className="input-field"
            >
              <option value="">
                All Students
              </option>

              {students.map((student) => (
                <option
                  key={student._id}
                  value={student._id}
                >
                  {student.fullName} (
                  {student.studentId})
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={courseFilter}
              onChange={(e) => {
                setCourseFilter(e.target.value);
                setPage(1);
              }}
              className="input-field"
            >
              <option value="">
                All Courses
              </option>

              {courses.map((course) => (
                <option
                  key={course._id}
                  value={course._id}
                >
                  {course.title}
                </option>
              ))}
            </select>
          </div>

          <div className="relative">
            <CalendarDays className="pointer-events-none absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <input
              type="month"
              value={monthFilter}
              onChange={(e) => {
                setMonthFilter(e.target.value);
                setPage(1);
              }}
              className="input-field pl-9"
            />
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
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
        </div>
      </div>

      {/* MONTHLY + COURSE SUMMARY */}

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="card-premium overflow-hidden">
          <div className="border-b border-slate-100 p-5 dark:border-slate-800">
            <h3 className="font-semibold text-slate-900 dark:text-white">
              Monthly Collection
            </h3>

            <p className="mt-1 text-xs text-slate-500">
              Overall fee position by month
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] text-sm">
              <thead className="bg-slate-50 text-left text-[11px] uppercase tracking-wider text-slate-400 dark:bg-slate-800/50">
                <tr>
                  <th className="px-4 py-3">
                    Month
                  </th>

                  <th className="px-4 py-3">
                    Records
                  </th>

                  <th className="px-4 py-3">
                    Fee
                  </th>

                  <th className="px-4 py-3">
                    Paid
                  </th>

                  <th className="px-4 py-3">
                    Due
                  </th>
                </tr>
              </thead>

              <tbody>
                {summary.monthlySummary
                  ?.slice(0, 8)
                  .map((item, index) => {
                    const month =
                      item.month ||
                      item._id;

                    return (
                      <tr
                        key={
                          month ||
                          `month-${index}`
                        }
                        className="border-t border-slate-100 dark:border-slate-800"
                      >
                        <td className="px-4 py-3 font-medium text-slate-700 dark:text-slate-200">
                          {formatMonth(month)}
                        </td>

                        <td className="px-4 py-3 text-slate-500">
                          {Number(
                            item.totalRecords ||
                              0
                          ).toLocaleString()}
                        </td>

                        <td className="px-4 py-3 font-semibold text-slate-700 dark:text-slate-200">
                          ৳
                          {Number(
                            item.totalFee || 0
                          ).toLocaleString()}
                        </td>

                        <td className="px-4 py-3 font-semibold text-emerald-600">
                          ৳
                          {Number(
                            item.totalPaid || 0
                          ).toLocaleString()}
                        </td>

                        <td className="px-4 py-3 font-semibold text-red-600">
                          ৳
                          {Number(
                            item.totalDue || 0
                          ).toLocaleString()}
                        </td>
                      </tr>
                    );
                  })}

                {!summary.monthlySummary?.length && (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-4 py-8 text-center text-sm text-slate-400"
                    >
                      No monthly summary yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card-premium overflow-hidden">
          <div className="border-b border-slate-100 p-5 dark:border-slate-800">
            <h3 className="font-semibold text-slate-900 dark:text-white">
              Course-wise Collection
            </h3>

            <p className="mt-1 text-xs text-slate-500">
              Overall fee position by course
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[480px] text-sm">
              <thead className="bg-slate-50 text-left text-[11px] uppercase tracking-wider text-slate-400 dark:bg-slate-800/50">
                <tr>
                  <th className="px-4 py-3">
                    Course
                  </th>

                  <th className="px-4 py-3">
                    Records
                  </th>

                  <th className="px-4 py-3">
                    Fee
                  </th>

                  <th className="px-4 py-3">
                    Paid
                  </th>

                  <th className="px-4 py-3">
                    Due
                  </th>
                </tr>
              </thead>

              <tbody>
                {summary.courseSummary
                  ?.slice(0, 8)
                  .map((item, index) => (
                    <tr
                      key={
                        item._id ||
                        item.courseId ||
                        `course-${index}`
                      }
                      className="border-t border-slate-100 dark:border-slate-800"
                    >
                      <td className="max-w-[220px] px-4 py-3">
                        <p className="truncate font-medium text-slate-700 dark:text-slate-200">
                          {item.course?.title ||
                            "Unknown course"}
                        </p>

                        {item.course
                          ?.subject && (
                          <p className="mt-0.5 text-xs text-slate-400">
                            {item.course.subject}
                          </p>
                        )}
                      </td>

                      <td className="px-4 py-3 text-slate-500">
                        {Number(
                          item.totalRecords ||
                            0
                        ).toLocaleString()}
                      </td>

                      <td className="px-4 py-3 font-semibold text-slate-700 dark:text-slate-200">
                        ৳
                        {Number(
                          item.totalFee || 0
                        ).toLocaleString()}
                      </td>

                      <td className="px-4 py-3 font-semibold text-emerald-600">
                        ৳
                        {Number(
                          item.totalPaid || 0
                        ).toLocaleString()}
                      </td>

                      <td className="px-4 py-3 font-semibold text-red-600">
                        ৳
                        {Number(
                          item.totalDue || 0
                        ).toLocaleString()}
                      </td>
                    </tr>
                  ))}

                {!summary.courseSummary?.length && (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-4 py-8 text-center text-sm text-slate-400"
                    >
                      No course summary yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* FEE TABLE */}

      {loading ? (
        <div className="card-premium p-10">
          <Loader />
        </div>
      ) : visibleFees.length === 0 ? (
        <div className="card-premium p-4">
          <EmptyState message="No fee records found for the selected filters." />
        </div>
      ) : (
        <div className="card-premium overflow-hidden p-0">
          <div className="flex flex-col gap-2 border-b border-slate-100 p-5 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white">
                Monthly Fee Ledger
              </h3>

              <p className="mt-1 text-xs text-slate-500">
                Each row represents one student's
                fee for a specific month.
              </p>
            </div>

            <span className="text-xs font-medium text-slate-400">
              {visibleFees.length} visible record
              {visibleFees.length !== 1
                ? "s"
                : ""}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px] text-sm">
              <thead className="bg-slate-50 text-left text-[11px] uppercase tracking-wider text-slate-400 dark:bg-slate-800/50">
                <tr>
                  <th className="px-4 py-3">
                    Student
                  </th>

                  <th className="px-4 py-3">
                    Course
                  </th>

                  <th className="px-4 py-3">
                    Month
                  </th>

                  <th className="px-4 py-3">
                    Fee
                  </th>

                  <th className="px-4 py-3">
                    Paid
                  </th>

                  <th className="px-4 py-3">
                    Due
                  </th>

                  <th className="px-4 py-3">
                    Status
                  </th>

                  <th className="px-4 py-3">
                    Due Date
                  </th>

                  <th className="px-4 py-3 text-right">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {visibleFees.map((fee) => {
                  const amount =
                    Number(fee.amount || 0);

                  const paid =
                    Number(
                      fee.amountPaid || 0
                    );

                  const due = Math.max(
                    amount - paid,
                    0
                  );

                  return (
                    <tr
                      key={fee._id}
                      className="border-t border-slate-100 transition hover:bg-slate-50/70 dark:border-slate-800 dark:hover:bg-slate-800/30"
                    >
                      <td className="px-4 py-4">
                        <div>
                          <p className="font-semibold text-slate-800 dark:text-white">
                            {getStudentName(
                              fee.student
                            )}
                          </p>

                          <p className="mt-0.5 text-xs text-slate-400">
                            {getStudentId(
                              fee.student
                            )}
                          </p>
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        <p className="max-w-[180px] truncate font-medium text-slate-700 dark:text-slate-200">
                          {getCourseTitle(
                            fee.course
                          )}
                        </p>

                        {getCourseSubject(
                          fee.course
                        ) && (
                          <p className="mt-0.5 text-xs text-slate-400">
                            {getCourseSubject(
                              fee.course
                            )}
                          </p>
                        )}
                      </td>

                      <td className="px-4 py-4">
                        <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                          <CalendarDays className="h-3.5 w-3.5 text-brand-gold" />

                          {formatMonth(
                            fee.billingMonth
                          )}
                        </span>
                      </td>

                      <td className="px-4 py-4 font-semibold text-slate-800 dark:text-white">
                        ৳
                        {amount.toLocaleString()}
                      </td>

                      <td className="px-4 py-4 font-semibold text-emerald-600">
                        ৳
                        {paid.toLocaleString()}
                      </td>

                      <td className="px-4 py-4 font-semibold text-red-600">
                        ৳
                        {due.toLocaleString()}
                      </td>

                      <td className="px-4 py-4">
                        <Badge
                          color={statusColor(
                            fee.status
                          )}
                        >
                          {fee.status}
                        </Badge>
                      </td>

                      <td className="px-4 py-4 text-slate-500 dark:text-slate-400">
                        {formatDate(
                          fee.dueDate
                        )}
                      </td>

                      <td className="px-4 py-4 text-right">
                        <button
                          type="button"
                          onClick={() =>
                            openEdit(fee)
                          }
                          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-brand-gold/30 hover:bg-brand-gold/10 hover:text-brand-gold dark:border-slate-700"
                          title="Edit fee"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* PAGINATION */}

      {data && data.totalPages > 1 && (
        <Pagination
          page={data.page}
          totalPages={data.totalPages}
          onChange={setPage}
        />
      )}

      {/* CREATE MONTHLY FEE MODAL */}

      <Modal
        open={createOpen}
        title="Add Monthly Fee"
        onClose={() => {
          if (!saving) {
            setCreateOpen(false);
          }
        }}
      >
        <div className="max-h-[75vh] space-y-5 overflow-y-auto pr-1">
          <div className="rounded-xl border border-brand-gold/20 bg-brand-gold/5 p-4">
            <p className="text-sm font-semibold text-slate-900 dark:text-white">
              Monthly fee entry
            </p>

            <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
              Select the student, course and billing
              month. This creates one separate fee
              record for that month.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label-field">
                Student
              </label>

              <select
                className="input-field"
                value={createForm.student}
                onChange={(e) =>
                  setCreateForm({
                    ...createForm,
                    student: e.target.value,
                  })
                }
              >
                <option value="">
                  Select student
                </option>

                {students.map((student) => (
                  <option
                    key={student._id}
                    value={student._id}
                  >
                    {student.fullName} (
                    {student.studentId})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="label-field">
                Course
              </label>

              <select
                className="input-field"
                value={createForm.course}
                onChange={(e) =>
                  setCreateForm({
                    ...createForm,
                    course: e.target.value,
                  })
                }
              >
                <option value="">
                  Select course
                </option>

                {courses.map((course) => (
                  <option
                    key={course._id}
                    value={course._id}
                  >
                    {course.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label-field">
                Billing Month
              </label>

              <input
                type="month"
                className="input-field"
                value={createForm.billingMonth}
                onChange={(e) =>
                  setCreateForm({
                    ...createForm,
                    billingMonth:
                      e.target.value,
                  })
                }
              />
            </div>

            <Input
              label="Monthly Fee (৳)"
              type="number"
              min="0"
              value={createForm.amount}
              onChange={(e) =>
                setCreateForm({
                  ...createForm,
                  amount: e.target.value,
                })
              }
              placeholder="1000"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Amount Paid (৳)"
              type="number"
              min="0"
              value={createForm.amountPaid}
              onChange={(e) =>
                setCreateForm({
                  ...createForm,
                  amountPaid:
                    e.target.value,
                })
              }
              placeholder="0"
            />

            <Input
              label="Due Date"
              type="date"
              value={createForm.dueDate}
              onChange={(e) =>
                setCreateForm({
                  ...createForm,
                  dueDate:
                    e.target.value,
                })
              }
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Payment Date"
              type="date"
              value={createForm.paymentDate}
              onChange={(e) =>
                setCreateForm({
                  ...createForm,
                  paymentDate:
                    e.target.value,
                })
              }
            />

            <Input
              label="Payment Method"
              value={createForm.paymentMethod}
              onChange={(e) =>
                setCreateForm({
                  ...createForm,
                  paymentMethod:
                    e.target.value,
                })
              }
              placeholder="Cash / bKash / Bank"
            />
          </div>

          <Input
            label="Transaction ID"
            value={createForm.transactionId}
            onChange={(e) =>
              setCreateForm({
                ...createForm,
                transactionId:
                  e.target.value,
              })
            }
            placeholder="Optional"
          />

          <div>
            <label className="label-field">
              Note
            </label>

            <textarea
              className="input-field min-h-[90px] resize-none"
              value={createForm.note}
              onChange={(e) =>
                setCreateForm({
                  ...createForm,
                  note: e.target.value,
                })
              }
              placeholder="Optional note about this monthly fee..."
            />
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/50">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">
                Estimated due
              </span>

              <span className="font-bold text-red-600">
                ৳
                {Math.max(
                  Number(
                    createForm.amount || 0
                  ) -
                    Number(
                      createForm.amountPaid ||
                        0
                    ),
                  0
                ).toLocaleString()}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-2 border-t border-slate-100 pt-4 dark:border-slate-800 sm:flex-row sm:justify-end">
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
              loading={saving}
            >
              <Plus className="h-4 w-4" />

              Create Monthly Fee
            </Button>
          </div>
        </div>
      </Modal>

      {/* EDIT MONTHLY FEE MODAL */}

      <Modal
        open={!!editTarget}
        title="Edit Monthly Fee"
        onClose={() => {
          if (!saving) {
            setEditTarget(null);
          }
        }}
      >
        <div className="max-h-[75vh] space-y-5 overflow-y-auto pr-1">
          {editTarget && (
            <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800/50">
              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                {getStudentName(
                  editTarget.student
                )}
              </p>

              <p className="mt-1 text-xs text-slate-500">
                {getStudentId(
                  editTarget.student
                )}
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-lg bg-white px-2.5 py-1.5 text-xs font-medium text-slate-600 shadow-sm dark:bg-slate-900 dark:text-slate-300">
                  {getCourseTitle(
                    editTarget.course
                  )}
                </span>

                <span className="inline-flex items-center gap-1.5 rounded-lg bg-white px-2.5 py-1.5 text-xs font-medium text-slate-600 shadow-sm dark:bg-slate-900 dark:text-slate-300">
                  <CalendarDays className="h-3.5 w-3.5 text-brand-gold" />

                  {formatMonth(
                    editTarget.billingMonth
                  )}
                </span>
              </div>
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label-field">
                Billing Month
              </label>

              <input
                type="month"
                className="input-field"
                value={updateForm.billingMonth}
                onChange={(e) =>
                  setUpdateForm({
                    ...updateForm,
                    billingMonth:
                      e.target.value,
                  })
                }
              />
            </div>

            <Input
              label="Monthly Fee (৳)"
              type="number"
              min="0"
              value={updateForm.amount}
              onChange={(e) =>
                setUpdateForm({
                  ...updateForm,
                  amount: e.target.value,
                })
              }
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Amount Paid (৳)"
              type="number"
              min="0"
              value={updateForm.amountPaid}
              onChange={(e) =>
                setUpdateForm({
                  ...updateForm,
                  amountPaid:
                    e.target.value,
                })
              }
            />

            <Input
              label="Due Date"
              type="date"
              value={updateForm.dueDate}
              onChange={(e) =>
                setUpdateForm({
                  ...updateForm,
                  dueDate:
                    e.target.value,
                })
              }
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Payment Date"
              type="date"
              value={updateForm.paymentDate}
              onChange={(e) =>
                setUpdateForm({
                  ...updateForm,
                  paymentDate:
                    e.target.value,
                })
              }
            />

            <Input
              label="Payment Method"
              value={updateForm.paymentMethod}
              onChange={(e) =>
                setUpdateForm({
                  ...updateForm,
                  paymentMethod:
                    e.target.value,
                })
              }
              placeholder="Cash / bKash / Bank"
            />
          </div>

          <Input
            label="Transaction ID"
            value={updateForm.transactionId}
            onChange={(e) =>
              setUpdateForm({
                ...updateForm,
                transactionId:
                  e.target.value,
              })
            }
            placeholder="Optional"
          />

          <div>
            <label className="label-field">
              Note
            </label>

            <textarea
              className="input-field min-h-[90px] resize-none"
              value={updateForm.note}
              onChange={(e) =>
                setUpdateForm({
                  ...updateForm,
                  note: e.target.value,
                })
              }
              placeholder="Optional note..."
            />
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/50">
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm text-slate-500">
                Current status
              </span>

              <Badge
                color={statusColor(
                  currentEditStatus
                )}
              >
                {currentEditStatus}
              </Badge>
            </div>

            <div className="mt-3 flex items-center justify-between border-t border-slate-200 pt-3 dark:border-slate-700">
              <span className="text-sm text-slate-500">
                Remaining due
              </span>

              <span className="font-bold text-red-600">
                ৳
                {currentEditDue.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-2 border-t border-slate-100 pt-4 dark:border-slate-800 sm:flex-row sm:justify-end">
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
              loading={saving}
            >
              <Pencil className="h-4 w-4" />

              Save Changes
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}