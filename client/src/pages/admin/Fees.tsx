import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  CircleDollarSign,
  Edit3,
  FileText,
  Plus,
  Search,
  UserRound,
  Wallet,
  X,
} from "lucide-react";

import { api, getErrorMessage } from "../../services/api";
import {
  Course,
  Fee,
  Student,
} from "../../types";

import { Loader } from "../../components/Loader";
import { EmptyState } from "../../components/EmptyState";
import { Badge } from "../../components/Badge";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";
import { useToast } from "../../components/Toast";

interface FeeForm {
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

interface MonthlyGroup {
  month: string;
  records: Fee[];
  totalFee: number;
  totalPaid: number;
  totalDue: number;
}

const emptyForm: FeeForm = {
  student: "",
  course: "",
  billingMonth: "",
  amount: "",
  amountPaid: "0",
  dueDate: "",
  paymentDate: "",
  paymentMethod: "",
  transactionId: "",
  note: "",
};

function formatMonth(month?: string) {
  if (!month) return "No Month";

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

function formatDate(value?: string) {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleDateString("en-BD", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function money(value: number) {
  return `৳${Number(value || 0).toLocaleString()}`;
}

function getStudentName(
  student: Fee["student"],
  students: Student[]
) {
  if (
    typeof student === "object" &&
    student !== null
  ) {
    return student.fullName;
  }

  const found = students.find(
    (item) => item._id === student
  );

  return found?.fullName || "Unknown Student";
}

function getStudentId(
  student: Fee["student"],
  students: Student[]
) {
  if (
    typeof student === "object" &&
    student !== null
  ) {
    return student.studentId;
  }

  const found = students.find(
    (item) => item._id === student
  );

  return found?.studentId || "";
}

function getCourseName(
  course: Fee["course"],
  courses: Course[]
) {
  if (
    typeof course === "object" &&
    course !== null
  ) {
    return course.title;
  }

  const found = courses.find(
    (item) => item._id === course
  );

  return found?.title || "Unknown Course";
}

function getStatus(amount: number, paid: number) {
  if (amount <= 0) return "PENDING";
  if (paid >= amount) return "PAID";
  if (paid > 0) return "PARTIAL";
  return "PENDING";
}

function statusColor(status: string) {
  if (status === "PAID") return "green";
  if (status === "PARTIAL") return "gold";
  return "red";
}

export default function AdminFees() {
  const [fees, setFees] = useState<Fee[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [search, setSearch] = useState("");
  const [selectedMonth, setSelectedMonth] =
    useState("");

  const [expandedMonth, setExpandedMonth] =
    useState<string | null>(null);

  const [showModal, setShowModal] =
    useState(false);

  const [editingFee, setEditingFee] =
    useState<Fee | null>(null);

  const [form, setForm] =
    useState<FeeForm>(emptyForm);

  const { show } = useToast();

  /*
   * =========================================================
   * LOAD DATA
   * =========================================================
   */

  async function loadData() {
    setLoading(true);

    try {
      const [
        feesResponse,
        studentsResponse,
        coursesResponse,
      ] = await Promise.all([
        api.get("/fees"),
        api.get("/students"),
        api.get("/courses"),
      ]);

      const feeData =
        feesResponse.data.data;

      const studentData =
        studentsResponse.data.data;

      const courseData =
        coursesResponse.data.data;

      setFees(
        Array.isArray(feeData)
          ? feeData
          : feeData?.data || []
      );

      setStudents(
        Array.isArray(studentData)
          ? studentData
          : studentData?.data || []
      );

      setCourses(
        Array.isArray(courseData)
          ? courseData
          : courseData?.data || []
      );
    } catch (error) {
      show(
        getErrorMessage(error),
        "error"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  /*
   * =========================================================
   * MONTHLY GROUPING
   *
   * Month
   *   -> Student
   *      -> Course
   *         -> Fee
   *         -> Paid
   *         -> Due
   * =========================================================
   */

  const monthlyGroups =
    useMemo<MonthlyGroup[]>(() => {
      const groups: Record<
        string,
        Fee[]
      > = {};

      fees.forEach((fee) => {
        const month =
          fee.billingMonth ||
          "UNASSIGNED";

        if (!groups[month]) {
          groups[month] = [];
        }

        groups[month].push(fee);
      });

      return Object.entries(groups)
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

          return {
            month,
            records,
            totalFee,
            totalPaid,
            totalDue: Math.max(
              totalFee - totalPaid,
              0
            ),
          };
        })
        .sort((a, b) => {
          if (
            a.month ===
            "UNASSIGNED"
          )
            return 1;

          if (
            b.month ===
            "UNASSIGNED"
          )
            return -1;

          return b.month.localeCompare(
            a.month
          );
        });
    }, [fees]);

  /*
   * =========================================================
   * SEARCH + MONTH FILTER
   * =========================================================
   */

  const filteredGroups =
    useMemo(() => {
      const keyword =
        search.trim().toLowerCase();

      return monthlyGroups
        .filter((group) => {
          if (
            selectedMonth &&
            group.month !==
              selectedMonth
          ) {
            return false;
          }

          return true;
        })
        .map((group) => {
          if (!keyword) {
            return group;
          }

          const records =
            group.records.filter(
              (fee) => {
                const studentName =
                  getStudentName(
                    fee.student,
                    students
                  ).toLowerCase();

                const studentId =
                  getStudentId(
                    fee.student,
                    students
                  ).toLowerCase();

                const courseName =
                  getCourseName(
                    fee.course,
                    courses
                  ).toLowerCase();

                return (
                  studentName.includes(
                    keyword
                  ) ||
                  studentId.includes(
                    keyword
                  ) ||
                  courseName.includes(
                    keyword
                  )
                );
              }
            );

          return {
            ...group,
            records,
            totalFee:
              records.reduce(
                (sum, fee) =>
                  sum +
                  Number(
                    fee.amount || 0
                  ),
                0
              ),
            totalPaid:
              records.reduce(
                (sum, fee) =>
                  sum +
                  Number(
                    fee.amountPaid ||
                      0
                  ),
                0
              ),
            totalDue:
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
              ),
          };
        })
        .filter(
          (group) =>
            group.records.length > 0
        );
    }, [
      monthlyGroups,
      search,
      selectedMonth,
      students,
      courses,
    ]);

  /*
   * =========================================================
   * OVERALL TOTALS
   * =========================================================
   */

  const overall = useMemo(() => {
    const totalFee =
      fees.reduce(
        (sum, fee) =>
          sum +
          Number(fee.amount || 0),
        0
      );

    const totalPaid =
      fees.reduce(
        (sum, fee) =>
          sum +
          Number(
            fee.amountPaid || 0
          ),
        0
      );

    const totalDue = Math.max(
      totalFee - totalPaid,
      0
    );

    const percentage =
      totalFee > 0
        ? Math.round(
            (totalPaid / totalFee) *
              100
          )
        : 0;

    return {
      totalFee,
      totalPaid,
      totalDue,
      percentage,
    };
  }, [fees]);

  /*
   * =========================================================
   * FORM HELPERS
   * =========================================================
   */

  function openCreateModal(
    month = selectedMonth
  ) {
    setEditingFee(null);

    setForm({
      ...emptyForm,
      billingMonth:
        month &&
        month !== "UNASSIGNED"
          ? month
          : "",
    });

    setShowModal(true);
  }

  function openEditModal(
    fee: Fee
  ) {
    setEditingFee(fee);

    setForm({
      student:
        typeof fee.student ===
        "object"
          ? fee.student._id
          : fee.student,
      course:
        typeof fee.course ===
        "object"
          ? fee.course._id
          : fee.course,
      billingMonth:
        fee.billingMonth || "",
      amount: String(
        fee.amount || 0
      ),
      amountPaid: String(
        fee.amountPaid || 0
      ),
      dueDate: fee.dueDate
        ? new Date(
            fee.dueDate
          )
            .toISOString()
            .slice(0, 10)
        : "",
      paymentDate:
        fee.paymentDate
          ? new Date(
              fee.paymentDate
            )
              .toISOString()
              .slice(0, 10)
          : "",
      paymentMethod:
        fee.paymentMethod || "",
      transactionId:
        fee.transactionId || "",
      note: fee.note || "",
    });

    setShowModal(true);
  }

  function closeModal() {
    if (saving) return;

    setShowModal(false);
    setEditingFee(null);
    setForm(emptyForm);
  }

  function updateForm(
    key: keyof FeeForm,
    value: string
  ) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  }

  /*
   * =========================================================
   * SUBMIT FEE
   * =========================================================
   */

  async function handleSubmit(
    event: React.FormEvent
  ) {
    event.preventDefault();

    if (!form.student) {
      show(
        "Please select a student.",
        "error"
      );
      return;
    }

    if (!form.course) {
      show(
        "Please select a course.",
        "error"
      );
      return;
    }

    if (!form.billingMonth) {
      show(
        "Please select a billing month.",
        "error"
      );
      return;
    }

    const amount =
      Number(form.amount);

    const amountPaid =
      Number(form.amountPaid);

    if (
      !Number.isFinite(amount) ||
      amount < 0
    ) {
      show(
        "Please enter a valid fee amount.",
        "error"
      );
      return;
    }

    if (
      !Number.isFinite(amountPaid) ||
      amountPaid < 0
    ) {
      show(
        "Please enter a valid paid amount.",
        "error"
      );
      return;
    }

    if (amountPaid > amount) {
      show(
        "Paid amount cannot be greater than the fee amount.",
        "error"
      );
      return;
    }

    if (!form.dueDate) {
      show(
        "Please select a due date.",
        "error"
      );
      return;
    }

    const status =
      getStatus(
        amount,
        amountPaid
      );

    const payload = {
      student: form.student,
      course: form.course,
      billingMonth:
        form.billingMonth,
      amount,
      amountPaid,
      dueDate:
        form.dueDate,
      status,
      paymentDate:
        form.paymentDate ||
        undefined,
      paymentMethod:
        form.paymentMethod ||
        undefined,
      transactionId:
        form.transactionId ||
        undefined,
      note:
        form.note || undefined,
    };

    setSaving(true);

    try {
      if (editingFee) {
        await api.put(
          `/fees/${editingFee._id}`,
          payload
        );

        show(
          "Monthly fee updated successfully.",
          "success"
        );
      } else {
        await api.post(
          "/fees",
          payload
        );

        show(
          "Monthly fee added successfully.",
          "success"
        );
      }

      closeModal();
      await loadData();
    } catch (error) {
      show(
        getErrorMessage(error),
        "error"
      );
    } finally {
      setSaving(false);
    }
  }

  /*
   * =========================================================
   * FILTER MONTH OPTIONS
   * =========================================================
   */

  const monthOptions =
    useMemo(() => {
      return monthlyGroups.map(
        (group) => group.month
      );
    }, [monthlyGroups]);

  /*
   * =========================================================
   * LOADING
   * =========================================================
   */

  if (loading) {
    return (
      <div className="card-premium p-10">
        <Loader />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      {/* =======================================================
          HEADER
      ======================================================= */}

      <section className="relative overflow-hidden rounded-3xl bg-brand-navyDark px-6 py-8 text-white shadow-sm sm:px-8 sm:py-10">
        <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full border border-brand-goldLight/10" />

        <div className="absolute -bottom-24 right-20 h-64 w-64 rounded-full border border-brand-goldLight/10" />

        <div className="relative z-10">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-brand-goldLight">
            <Wallet className="h-3.5 w-3.5" />
            Monthly Accounts
          </div>

          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
                Fee Management
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-white/65">
                Manage fees month by month —
                Student → Course → Fee → Paid → Due.
              </p>
            </div>

            <Button
              type="button"
              onClick={() =>
                openCreateModal()
              }
              className="w-full sm:w-auto"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Monthly Fee
            </Button>
          </div>
        </div>
      </section>

      {/* =======================================================
          OVERALL SUMMARY
      ======================================================= */}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="card-premium p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
                Total Fee
              </p>

              <p className="mt-2 font-display text-2xl font-semibold text-slate-900 dark:text-white">
                {money(
                  overall.totalFee
                )}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-goldLight/15 text-brand-gold">
              <CircleDollarSign className="h-5 w-5" />
            </div>
          </div>
        </div>

        <div className="card-premium p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
                Total Paid
              </p>

              <p className="mt-2 font-display text-2xl font-semibold text-emerald-600 dark:text-emerald-400">
                {money(
                  overall.totalPaid
                )}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </div>
        </div>

        <div className="card-premium p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
                Total Due
              </p>

              <p className="mt-2 font-display text-2xl font-semibold text-red-600 dark:text-red-400">
                {money(
                  overall.totalDue
                )}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400">
              <FileText className="h-5 w-5" />
            </div>
          </div>
        </div>

        <div className="card-premium p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="w-full">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
                Collection
              </p>

              <p className="mt-2 font-display text-2xl font-semibold text-slate-900 dark:text-white">
                {overall.percentage}%
              </p>

              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                <div
                  className="h-full rounded-full bg-brand-goldLight"
                  style={{
                    width: `${overall.percentage}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =======================================================
          FILTER BAR
      ======================================================= */}

      <section className="card-premium p-5">
        <div className="grid gap-4 lg:grid-cols-[1fr_220px_auto]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <input
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
              placeholder="Search student, student ID or course..."
              className="input-field pl-10"
            />
          </div>

          <select
            value={selectedMonth}
            onChange={(event) =>
              setSelectedMonth(
                event.target.value
              )
            }
            className="input-field"
          >
            <option value="">
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
          </select>

          <Button
            type="button"
            onClick={() =>
              openCreateModal(
                selectedMonth
              )
            }
            className="w-full lg:w-auto"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Fee
          </Button>
        </div>
      </section>

      {/* =======================================================
          MONTHLY LEDGER
      ======================================================= */}

      {filteredGroups.length === 0 ? (
        <div className="card-premium p-8">
          <EmptyState message="No monthly fee records found." />
        </div>
      ) : (
        <div className="space-y-5">
          {filteredGroups.map(
            (group) => {
              const isOpen =
                expandedMonth ===
                  group.month ||
                expandedMonth ===
                  null;

              return (
                <section
                  key={group.month}
                  className="card-premium overflow-hidden"
                >
                  {/* Month header */}

                  <button
                    type="button"
                    onClick={() =>
                      setExpandedMonth(
                        isOpen
                          ? group.month
                          : null
                      )
                    }
                    className="flex w-full items-center justify-between gap-5 px-5 py-5 text-left transition hover:bg-slate-50/60 dark:hover:bg-slate-900/40 sm:px-6"
                  >
                    <div className="flex min-w-0 items-center gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-goldLight/15 text-brand-gold">
                        <CalendarDays className="h-5 w-5" />
                      </div>

                      <div className="min-w-0">
                        <p className="font-display text-xl font-semibold text-slate-900 dark:text-white">
                          {formatMonth(
                            group.month
                          )}
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          {group.records.length}{" "}
                          fee records
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-5">
                      <div className="hidden text-right sm:block">
                        <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
                          Fee / Paid / Due
                        </p>

                        <p className="mt-1 text-sm font-semibold">
                          <span className="text-slate-700 dark:text-slate-200">
                            {money(
                              group.totalFee
                            )}
                          </span>

                          <span className="mx-1 text-slate-300">
                            /
                          </span>

                          <span className="text-emerald-600">
                            {money(
                              group.totalPaid
                            )}
                          </span>

                          <span className="mx-1 text-slate-300">
                            /
                          </span>

                          <span className="text-red-600">
                            {money(
                              group.totalDue
                            )}
                          </span>
                        </p>
                      </div>

                      <ChevronDown
                        className={`h-5 w-5 text-slate-400 transition-transform ${
                          isOpen
                            ? "rotate-180"
                            : ""
                        }`}
                      />
                    </div>
                  </button>

                  {/* Mobile monthly summary */}

                  <div className="grid grid-cols-3 gap-2 border-t border-slate-100 px-5 py-4 dark:border-slate-800 sm:hidden">
                    <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-900/50">
                      <p className="text-[9px] font-bold uppercase tracking-wide text-slate-400">
                        Fee
                      </p>

                      <p className="mt-1 text-sm font-bold text-slate-700 dark:text-slate-200">
                        {money(
                          group.totalFee
                        )}
                      </p>
                    </div>

                    <div className="rounded-xl bg-emerald-50 p-3 dark:bg-emerald-500/10">
                      <p className="text-[9px] font-bold uppercase tracking-wide text-emerald-600/70">
                        Paid
                      </p>

                      <p className="mt-1 text-sm font-bold text-emerald-600 dark:text-emerald-400">
                        {money(
                          group.totalPaid
                        )}
                      </p>
                    </div>

                    <div className="rounded-xl bg-red-50 p-3 dark:bg-red-500/10">
                      <p className="text-[9px] font-bold uppercase tracking-wide text-red-500/70">
                        Due
                      </p>

                      <p className="mt-1 text-sm font-bold text-red-600 dark:text-red-400">
                        {money(
                          group.totalDue
                        )}
                      </p>
                    </div>
                  </div>

                  {/* =================================================
                      MONTH RECORDS
                  ================================================= */}

                  {isOpen && (
                    <div className="border-t border-slate-100 dark:border-slate-800">
                      {/* Desktop */}

                      <div className="hidden overflow-x-auto md:block">
                        <table className="w-full text-sm">
                          <thead className="bg-slate-50/80 dark:bg-slate-900/40">
                            <tr>
                              <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                                Student
                              </th>

                              <th className="px-4 py-4 text-left text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                                Course
                              </th>

                              <th className="px-4 py-4 text-right text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                                Fee
                              </th>

                              <th className="px-4 py-4 text-right text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                                Paid
                              </th>

                              <th className="px-4 py-4 text-right text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                                Due
                              </th>

                              <th className="px-4 py-4 text-left text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                                Status
                              </th>

                              <th className="px-6 py-4 text-right text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                                Action
                              </th>
                            </tr>
                          </thead>

                          <tbody>
                            {group.records.map(
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
                                    amount -
                                      paid,
                                    0
                                  );

                                const status =
                                  getStatus(
                                    amount,
                                    paid
                                  );

                                return (
                                  <tr
                                    key={
                                      fee._id
                                    }
                                    className="border-t border-slate-100 dark:border-slate-800"
                                  >
                                    {/* Student */}

                                    <td className="px-6 py-5">
                                      <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-navyDark text-brand-goldLight">
                                          <UserRound className="h-4 w-4" />
                                        </div>

                                        <div>
                                          <p className="font-semibold text-slate-800 dark:text-slate-200">
                                            {getStudentName(
                                              fee.student,
                                              students
                                            )}
                                          </p>

                                          <p className="mt-0.5 text-xs text-slate-400">
                                            {getStudentId(
                                              fee.student,
                                              students
                                            )}
                                          </p>
                                        </div>
                                      </div>
                                    </td>

                                    {/* Course */}

                                    <td className="px-4 py-5">
                                      <p className="font-medium text-slate-700 dark:text-slate-300">
                                        {getCourseName(
                                          fee.course,
                                          courses
                                        )}
                                      </p>
                                    </td>

                                    {/* Fee */}

                                    <td className="px-4 py-5 text-right font-semibold text-slate-700 dark:text-slate-200">
                                      {money(
                                        amount
                                      )}
                                    </td>

                                    {/* Paid */}

                                    <td className="px-4 py-5 text-right font-semibold text-emerald-600 dark:text-emerald-400">
                                      {money(
                                        paid
                                      )}
                                    </td>

                                    {/* Due */}

                                    <td className="px-4 py-5 text-right font-semibold text-red-600 dark:text-red-400">
                                      {money(
                                        due
                                      )}
                                    </td>

                                    {/* Status */}

                                    <td className="px-4 py-5">
                                      <Badge
                                        color={statusColor(
                                          status
                                        )}
                                      >
                                        {
                                          status
                                        }
                                      </Badge>
                                    </td>

                                    {/* Action */}

                                    <td className="px-6 py-5 text-right">
                                      <button
                                        type="button"
                                        onClick={() =>
                                          openEditModal(
                                            fee
                                          )
                                        }
                                        className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:border-brand-gold/30 hover:text-brand-gold dark:border-slate-700"
                                        title="Edit monthly fee"
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

                      <div className="space-y-3 p-5 md:hidden">
                        {group.records.map(
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
                                amount -
                                  paid,
                                0
                              );

                            const status =
                              getStatus(
                                amount,
                                paid
                              );

                            return (
                              <div
                                key={
                                  fee._id
                                }
                                className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900/50"
                              >
                                <div className="flex items-start justify-between gap-3">
                                  <div className="flex min-w-0 items-center gap-3">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-navyDark text-brand-goldLight">
                                      <UserRound className="h-4 w-4" />
                                    </div>

                                    <div className="min-w-0">
                                      <p className="truncate font-semibold text-slate-800 dark:text-slate-200">
                                        {getStudentName(
                                          fee.student,
                                          students
                                        )}
                                      </p>

                                      <p className="mt-0.5 text-xs text-slate-400">
                                        {getStudentId(
                                          fee.student,
                                          students
                                        )}
                                      </p>
                                    </div>
                                  </div>

                                  <button
                                    type="button"
                                    onClick={() =>
                                      openEditModal(
                                        fee
                                      )
                                    }
                                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-500 dark:border-slate-700"
                                  >
                                    <Edit3 className="h-4 w-4" />
                                  </button>
                                </div>

                                <div className="mt-4 rounded-xl bg-slate-50 p-3 dark:bg-slate-800/50">
                                  <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                                    Course
                                  </p>

                                  <p className="mt-1 text-sm font-semibold text-slate-700 dark:text-slate-200">
                                    {getCourseName(
                                      fee.course,
                                      courses
                                    )}
                                  </p>
                                </div>

                                <div className="mt-3 grid grid-cols-3 gap-2">
                                  <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/50">
                                    <p className="text-[9px] font-bold uppercase tracking-wide text-slate-400">
                                      Fee
                                    </p>

                                    <p className="mt-1 text-sm font-bold text-slate-700 dark:text-slate-200">
                                      {money(
                                        amount
                                      )}
                                    </p>
                                  </div>

                                  <div className="rounded-xl bg-emerald-50 p-3 dark:bg-emerald-500/10">
                                    <p className="text-[9px] font-bold uppercase tracking-wide text-emerald-600/70">
                                      Paid
                                    </p>

                                    <p className="mt-1 text-sm font-bold text-emerald-600 dark:text-emerald-400">
                                      {money(
                                        paid
                                      )}
                                    </p>
                                  </div>

                                  <div className="rounded-xl bg-red-50 p-3 dark:bg-red-500/10">
                                    <p className="text-[9px] font-bold uppercase tracking-wide text-red-500/70">
                                      Due
                                    </p>

                                    <p className="mt-1 text-sm font-bold text-red-600 dark:text-red-400">
                                      {money(
                                        due
                                      )}
                                    </p>
                                  </div>
                                </div>

                                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
                                  <div className="flex items-center gap-2 text-xs text-slate-400">
                                    <CalendarDays className="h-3.5 w-3.5" />
                                    {formatDate(
                                      fee.dueDate
                                    )}
                                  </div>

                                  <Badge
                                    color={statusColor(
                                      status
                                    )}
                                  >
                                    {
                                      status
                                    }
                                  </Badge>
                                </div>
                              </div>
                            );
                          }
                        )}
                      </div>
                    </div>
                  )}
                </section>
              );
            }
          )}
        </div>
      )}

      {/* =======================================================
          ADD / EDIT MODAL
      ======================================================= */}

      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
          <div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white shadow-2xl dark:bg-slate-950">
            {/* Modal header */}

            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-5 dark:border-slate-800 dark:bg-slate-950">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-brand-gold">
                  {editingFee
                    ? "Edit Record"
                    : "New Record"}
                </p>

                <h2 className="mt-1 font-display text-xl font-semibold text-slate-900 dark:text-white">
                  {editingFee
                    ? "Edit Monthly Fee"
                    : "Add Monthly Fee"}
                </h2>
              </div>

              <button
                type="button"
                onClick={closeModal}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:text-slate-900 dark:border-slate-700 dark:hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-6 p-6"
            >
              {/* Month */}

              <div className="rounded-2xl border border-brand-gold/20 bg-brand-goldLight/5 p-5">
                <div className="mb-4 flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-brand-gold" />

                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-brand-gold">
                    Billing Month
                  </p>
                </div>

                <Input
                  type="month"
                  value={
                    form.billingMonth
                  }
                  onChange={(event) =>
                    updateForm(
                      "billingMonth",
                      event.target.value
                    )
                  }
                  required
                />
              </div>

              {/* Student + Course */}

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="label-field">
                    Student
                  </label>

                  <select
                    value={
                      form.student
                    }
                    onChange={(event) =>
                      updateForm(
                        "student",
                        event.target.value
                      )
                    }
                    className="input-field"
                    required
                  >
                    <option value="">
                      Select student
                    </option>

                    {students.map(
                      (student) => (
                        <option
                          key={
                            student._id
                          }
                          value={
                            student._id
                          }
                        >
                          {student.fullName} —{" "}
                          {
                            student.studentId
                          }
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
                    value={
                      form.course
                    }
                    onChange={(event) =>
                      updateForm(
                        "course",
                        event.target.value
                      )
                    }
                    className="input-field"
                    required
                  >
                    <option value="">
                      Select course
                    </option>

                    {courses.map(
                      (course) => (
                        <option
                          key={
                            course._id
                          }
                          value={
                            course._id
                          }
                        >
                          {course.title}
                        </option>
                      )
                    )}
                  </select>
                </div>
              </div>

              {/* Fee / Paid / Due */}

              <div className="rounded-2xl border border-slate-200 p-5 dark:border-slate-800">
                <div className="mb-4 flex items-center gap-2">
                  <CircleDollarSign className="h-4 w-4 text-brand-gold" />

                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
                    Monthly Calculation
                  </p>
                </div>

                <div className="grid gap-5 md:grid-cols-3">
                  <div>
                    <label className="label-field">
                      Monthly Fee
                    </label>

                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={
                        form.amount
                      }
                      onChange={(event) =>
                        updateForm(
                          "amount",
                          event.target.value
                        )
                      }
                      placeholder="1000"
                      required
                    />
                  </div>

                  <div>
                    <label className="label-field">
                      Paid Amount
                    </label>

                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={
                        form.amountPaid
                      }
                      onChange={(event) =>
                        updateForm(
                          "amountPaid",
                          event.target.value
                        )
                      }
                      placeholder="0"
                      required
                    />
                  </div>

                  <div>
                    <label className="label-field">
                      Due Amount
                    </label>

                    <div className="flex h-11 items-center rounded-xl border border-red-100 bg-red-50 px-4 font-semibold text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400">
                      {money(
                        Math.max(
                          Number(
                            form.amount ||
                              0
                          ) -
                            Number(
                              form.amountPaid ||
                                0
                            ),
                          0
                        )
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <Badge
                    color={statusColor(
                      getStatus(
                        Number(
                          form.amount ||
                            0
                        ),
                        Number(
                          form.amountPaid ||
                            0
                        )
                      )
                    )}
                  >
                    {getStatus(
                      Number(
                        form.amount ||
                          0
                      ),
                      Number(
                        form.amountPaid ||
                          0
                      )
                    )}
                  </Badge>

                  <span className="text-xs text-slate-400">
                    Status is calculated automatically.
                  </span>
                </div>
              </div>

              {/* Dates */}

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="label-field">
                    Due Date
                  </label>

                  <Input
                    type="date"
                    value={
                      form.dueDate
                    }
                    onChange={(event) =>
                      updateForm(
                        "dueDate",
                        event.target.value
                      )
                    }
                    required
                  />
                </div>

                <div>
                  <label className="label-field">
                    Payment Date
                  </label>

                  <Input
                    type="date"
                    value={
                      form.paymentDate
                    }
                    onChange={(event) =>
                      updateForm(
                        "paymentDate",
                        event.target.value
                      )
                    }
                  />
                </div>
              </div>

              {/* Payment information */}

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="label-field">
                    Payment Method
                  </label>

                  <select
                    value={
                      form.paymentMethod
                    }
                    onChange={(event) =>
                      updateForm(
                        "paymentMethod",
                        event.target.value
                      )
                    }
                    className="input-field"
                  >
                    <option value="">
                      Select method
                    </option>

                    <option value="CASH">
                      Cash
                    </option>

                    <option value="BKASH">
                      bKash
                    </option>

                    <option value="NAGAD">
                      Nagad
                    </option>

                    <option value="BANK">
                      Bank
                    </option>

                    <option value="OTHER">
                      Other
                    </option>
                  </select>
                </div>

                <div>
                  <label className="label-field">
                    Transaction ID
                  </label>

                  <Input
                    value={
                      form.transactionId
                    }
                    onChange={(event) =>
                      updateForm(
                        "transactionId",
                        event.target.value
                      )
                    }
                    placeholder="Optional"
                  />
                </div>
              </div>

              {/* Note */}

              <div>
                <label className="label-field">
                  Note
                </label>

                <textarea
                  value={form.note}
                  onChange={(event) =>
                    updateForm(
                      "note",
                      event.target.value
                    )
                  }
                  rows={3}
                  placeholder="Optional note about this month's payment..."
                  className="input-field resize-none"
                />
              </div>

              {/* Actions */}

              <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 dark:border-slate-800 sm:flex-row sm:justify-end">
                <Button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  variant="secondary"
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  disabled={saving}
                >
                  {saving
                    ? "Saving..."
                    : editingFee
                    ? "Update Monthly Fee"
                    : "Save Monthly Fee"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}