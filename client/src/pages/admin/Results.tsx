import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  Trophy,
  Users,
  XCircle,
} from "lucide-react";

import { api, getErrorMessage } from "../../services/api";

import {
  Result,
  Student,
  Course,
  PaginatedResponse,
} from "../../types";

import { Loader } from "../../components/Loader";
import { EmptyState } from "../../components/EmptyState";
import { Pagination } from "../../components/Pagination";
import { Modal } from "../../components/Modal";
import { ConfirmDialog } from "../../components/ConfirmDialog";
import { Input } from "../../components/Input";
import { Button } from "../../components/Button";
import { useToast } from "../../components/Toast";

interface FormState {
  student: string;
  course: string;
  examName: string;
  subject: string;
  totalMarks: string;
  obtainedMarks: string;
  grade: string;
  gpa: string;
  examDate: string;
}

interface HistorySummary {
  totalRecords: number;
  totalMarks: number;
  obtainedMarks: number;
  averageGpa: number;
  passed: number;
  failed: number;
}

interface HistoryExamSummary {
  examName: string;
  examDate: string;
  resultCount: number;
  totalMarks: number;
  obtainedMarks: number;
  averageGpa: number;
}

interface HistoryResponse {
  results: Result[];
  summary: HistorySummary;
  exams: HistoryExamSummary[];
}

const getToday = (): string => {
  return new Date().toISOString().slice(0, 10);
};

const emptyForm: FormState = {
  student: "",
  course: "",
  examName: "",
  subject: "",
  totalMarks: "100",
  obtainedMarks: "",
  grade: "A",
  gpa: "5.0",
  examDate: getToday(),
};

export default function AdminResults() {
  // =====================================================
  // RESULT MANAGEMENT
  // =====================================================

  const [data, setData] =
    useState<PaginatedResponse<Result> | null>(null);

  const [students, setStudents] =
    useState<Student[]>([]);

  const [courses, setCourses] =
    useState<Course[]>([]);

  const [page, setPage] =
    useState(1);

  const [loading, setLoading] =
    useState(true);

  const [modalOpen, setModalOpen] =
    useState(false);

  const [form, setForm] =
    useState<FormState>(emptyForm);

  const [saving, setSaving] =
    useState(false);

  const [deleteTarget, setDeleteTarget] =
    useState<Result | null>(null);

  // =====================================================
  // HISTORY
  // =====================================================

  const [historyResults, setHistoryResults] =
    useState<Result[]>([]);

  const [historySummary, setHistorySummary] =
    useState<HistorySummary>({
      totalRecords: 0,
      totalMarks: 0,
      obtainedMarks: 0,
      averageGpa: 0,
      passed: 0,
      failed: 0,
    });

  const [historyExams, setHistoryExams] =
    useState<HistoryExamSummary[]>([]);

  const [historyLoading, setHistoryLoading] =
    useState(false);

  const [historyCourse, setHistoryCourse] =
    useState("");

  const [historyExam, setHistoryExam] =
    useState("");

  const [historySubject, setHistorySubject] =
    useState("");

  const [historyStudent, setHistoryStudent] =
    useState("");

  const [historyDate, setHistoryDate] =
    useState("");

  const [activeSection, setActiveSection] =
    useState<"MANAGE" | "HISTORY">("MANAGE");

  const { show } = useToast();

  // =====================================================
  // LOAD PAGINATED RESULTS
  // =====================================================

  const loadResults = async () => {
    setLoading(true);

    try {
      const response = await api.get(
        "/results",
        {
          params: {
            page,
          },
        }
      );

      setData(response.data.data);
    } catch (error) {
      show(
        getErrorMessage(error),
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // LOAD ALL RESULT HISTORY
  // =====================================================

  const loadHistory = async () => {
    setHistoryLoading(true);

    try {
      const params: Record<string, string> = {};

      if (historyCourse) {
        params.course =
          historyCourse;
      }

      if (historyExam.trim()) {
        params.examName =
          historyExam.trim();
      }

      if (historySubject.trim()) {
        params.subject =
          historySubject.trim();
      }

      if (historyDate) {
        params.examDate =
          historyDate;
      }

      /*
       * Student search is handled below because the
       * history endpoint accepts a student ID, while
       * the Admin UI also allows searching by name.
       *
       * We therefore fetch all matching history records
       * when no exact student ID is selected.
       */
      const response = await api.get(
        "/results/history",
        {
          params,
        }
      );

      const responseData =
        response.data.data as HistoryResponse;

      setHistoryResults(
        responseData.results || []
      );

      setHistorySummary(
        responseData.summary || {
          totalRecords: 0,
          totalMarks: 0,
          obtainedMarks: 0,
          averageGpa: 0,
          passed: 0,
          failed: 0,
        }
      );

      setHistoryExams(
        responseData.exams || []
      );
    } catch (error) {
      show(
        getErrorMessage(error),
        "error"
      );
    } finally {
      setHistoryLoading(false);
    }
  };

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    loadResults();
  }, [page]);

  // =====================================================
  // LOAD STUDENTS
  // =====================================================

  useEffect(() => {
    const loadStudents = async () => {
      try {
        const response = await api.get(
          "/students",
          {
            params: {
              limit: 200,
            },
          }
        );

        setStudents(
          response.data.data.data || []
        );
      } catch (error) {
        show(
          getErrorMessage(error),
          "error"
        );
      }
    };

    loadStudents();
  }, []);

  // =====================================================
  // LOAD COURSES
  // =====================================================

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const response = await api.get(
          "/courses",
          {
            params: {
              limit: 100,
            },
          }
        );

        setCourses(
          response.data.data.data || []
        );
      } catch (error) {
        show(
          getErrorMessage(error),
          "error"
        );
      }
    };

    loadCourses();
  }, []);

  // =====================================================
  // LOAD HISTORY WHEN HISTORY TAB OPENS
  // =====================================================

  useEffect(() => {
    if (activeSection === "HISTORY") {
      loadHistory();
    }
  }, [activeSection]);

  // =====================================================
  // SELECTED STUDENT
  // =====================================================

  const selectedStudent =
    students.find(
      (student) =>
        student._id === form.student
    );

  // =====================================================
  // GET STUDENT COURSES
  // =====================================================

  const getStudentCourses = (
    student?: Student
  ): Course[] => {
    if (!student) {
      return [];
    }

    const result: Course[] = [];

    if (Array.isArray(student.courses)) {
      student.courses.forEach(
        (course) => {
          if (
            typeof course === "object" &&
            course !== null
          ) {
            result.push(course);
          }
        }
      );
    }

    if (
      student.course &&
      typeof student.course === "object" &&
      student.course !== null
    ) {
      const studentCourse =
        student.course;

      const exists =
        result.some(
          (course) =>
            course._id ===
            studentCourse._id
        );

      if (!exists) {
        result.push(
          studentCourse
        );
      }
    }

    return result;
  };

  const selectedCourses =
    getStudentCourses(
      selectedStudent
    );

  // =====================================================
  // STUDENT CHANGE
  // =====================================================

  const handleStudentChange = (
    studentId: string
  ) => {
    const student =
      students.find(
        (item) =>
          item._id === studentId
      );

    const studentCourses =
      getStudentCourses(student);

    setForm({
      ...form,
      student: studentId,
      course:
        studentCourses.length === 1
          ? studentCourses[0]._id
          : "",
    });
  };

  // =====================================================
  // RESULT COURSE NAME
  // IMPORTANT:
  // Always use result.course first.
  // =====================================================

  const getResultCourseName = (
    result: Result
  ): string => {
    if (
      result.course &&
      typeof result.course === "object"
    ) {
      return (
        result.course.title ||
        result.course.subject ||
        "—"
      );
    }

    if (
      typeof result.course === "string"
    ) {
      const course =
        courses.find(
          (item) =>
            item._id ===
            result.course
        );

      return (
        course?.title ||
        course?.subject ||
        "—"
      );
    }

    return "—";
  };

  // =====================================================
  // RESULT STUDENT NAME
  // =====================================================

  const getResultStudentName = (
    result: Result
  ): string => {
    if (
      result.student &&
      typeof result.student === "object"
    ) {
      return (
        result.student.fullName ||
        "—"
      );
    }

    if (
      typeof result.student === "string"
    ) {
      const student =
        students.find(
          (item) =>
            item._id ===
            result.student
        );

      return (
        student?.fullName ||
        "—"
      );
    }

    return "—";
  };

  // =====================================================
  // RESULT STUDENT ID
  // =====================================================

  const getResultStudentId = (
    result: Result
  ): string => {
    if (
      result.student &&
      typeof result.student === "object"
    ) {
      return (
        result.student.studentId ||
        "—"
      );
    }

    if (
      typeof result.student === "string"
    ) {
      const student =
        students.find(
          (item) =>
            item._id ===
            result.student
        );

      return (
        student?.studentId ||
        "—"
      );
    }

    return "—";
  };

  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (
    value?: string
  ) => {
    if (!value) {
      return "—";
    }

    const date =
      new Date(value);

    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return "—";
    }

    return date.toLocaleDateString(
      "en-GB",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  // =====================================================
  // FRONTEND STUDENT SEARCH
  // Supports BOTH:
  // Student Name + Student ID
  // =====================================================

  const filteredHistoryResults =
    useMemo(() => {
      const search =
        historyStudent
          .trim()
          .toLowerCase();

      if (!search) {
        return historyResults;
      }

      return historyResults.filter(
        (result) => {
          const studentName =
            getResultStudentName(
              result
            ).toLowerCase();

          const studentId =
            getResultStudentId(
              result
            ).toLowerCase();

          return (
            studentName.includes(
              search
            ) ||
            studentId.includes(
              search
            )
          );
        }
      );
    }, [
      historyResults,
      historyStudent,
      students,
    ]);

  // =====================================================
  // DISPLAY SUMMARY
  // Recalculate if student search is applied.
  // =====================================================

  const displayHistorySummary =
    useMemo(() => {
      if (!historyStudent.trim()) {
        return historySummary;
      }

      const totalRecords =
        filteredHistoryResults.length;

      const totalMarks =
        filteredHistoryResults.reduce(
          (sum, result) =>
            sum +
            Number(
              result.totalMarks || 0
            ),
          0
        );

      const obtainedMarks =
        filteredHistoryResults.reduce(
          (sum, result) =>
            sum +
            Number(
              result.obtainedMarks || 0
            ),
          0
        );

      const gpas =
        filteredHistoryResults
          .map((result) =>
            Number(result.gpa)
          )
          .filter(
            (gpa) =>
              !Number.isNaN(gpa)
          );

      const averageGpa =
        gpas.length
          ? gpas.reduce(
              (sum, gpa) =>
                sum + gpa,
              0
            ) / gpas.length
          : 0;

      const passed =
        filteredHistoryResults.filter(
          (result) => {
            const grade =
              String(
                result.grade || ""
              ).toUpperCase();

            return (
              grade !== "F" &&
              Number(
                result.gpa || 0
              ) > 0
            );
          }
        ).length;

      const failed =
        totalRecords - passed;

      return {
        totalRecords,
        totalMarks,
        obtainedMarks,
        averageGpa:
          Number(
            averageGpa.toFixed(2)
          ),
        passed,
        failed,
      };
    }, [
      historySummary,
      filteredHistoryResults,
      historyStudent,
    ]);

  // =====================================================
  // CLEAR HISTORY FILTERS
  // =====================================================

  const clearHistoryFilters = () => {
    setHistoryCourse("");
    setHistoryExam("");
    setHistorySubject("");
    setHistoryStudent("");
    setHistoryDate("");
  };

  // =====================================================
  // SAVE RESULT
  // =====================================================

  const handleSave = async () => {
    if (!form.student) {
      show(
        "Please select a student.",
        "error"
      );
      return;
    }

    if (
      selectedCourses.length > 0 &&
      !form.course
    ) {
      show(
        "Please select a course.",
        "error"
      );
      return;
    }

    if (!form.examName.trim()) {
      show(
        "Please enter exam name.",
        "error"
      );
      return;
    }

    if (!form.subject.trim()) {
      show(
        "Please enter subject.",
        "error"
      );
      return;
    }

    if (!form.obtainedMarks) {
      show(
        "Please enter obtained marks.",
        "error"
      );
      return;
    }

    if (
      Number(form.obtainedMarks) >
      Number(form.totalMarks)
    ) {
      show(
        "Obtained marks cannot be greater than total marks.",
        "error"
      );
      return;
    }

    setSaving(true);

    try {
      const payload = {
        student:
          form.student,

        course:
          form.course ||
          undefined,

        examName:
          form.examName.trim(),

        subject:
          form.subject.trim(),

        totalMarks:
          Number(
            form.totalMarks
          ),

        obtainedMarks:
          Number(
            form.obtainedMarks
          ),

        grade:
          form.grade.trim(),

        gpa:
          Number(form.gpa),

        examDate:
          form.examDate,
      };

      await api.post(
        "/results",
        payload
      );

      show(
        "Result added successfully.",
        "success"
      );

      setModalOpen(false);

      setForm({
        ...emptyForm,
        examDate: getToday(),
      });

      await loadResults();

      if (
        activeSection ===
        "HISTORY"
      ) {
        await loadHistory();
      }
    } catch (error) {
      show(
        getErrorMessage(error),
        "error"
      );
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // DELETE RESULT
  // =====================================================

  const handleDelete = async () => {
    if (!deleteTarget) {
      return;
    }

    try {
      await api.delete(
        `/results/${deleteTarget._id}`
      );

      show(
        "Result deleted successfully.",
        "success"
      );

      setDeleteTarget(null);

      await loadResults();

      if (
        activeSection ===
        "HISTORY"
      ) {
        await loadHistory();
      }
    } catch (error) {
      show(
        getErrorMessage(error),
        "error"
      );
    }
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="space-y-6">
      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white">
            Results
          </h2>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Manage student results and view complete academic history.
          </p>
        </div>

        <Button
          onClick={() => {
            setForm({
              ...emptyForm,
              examDate: getToday(),
            });

            setModalOpen(true);
          }}
        >
          <Plus className="h-4 w-4" />
          Add Result
        </Button>
      </div>

      {/* ================================================= */}
      {/* TABS */}
      {/* ================================================= */}

      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3 dark:border-slate-800">
        <button
          type="button"
          onClick={() =>
            setActiveSection(
              "MANAGE"
            )
          }
          className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
            activeSection ===
            "MANAGE"
              ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
              : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          Manage Results
        </button>

        <button
          type="button"
          onClick={() =>
            setActiveSection(
              "HISTORY"
            )
          }
          className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
            activeSection ===
            "HISTORY"
              ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
              : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          Result History
        </button>
      </div>

      {/* ================================================= */}
      {/* MANAGE RESULTS */}
      {/* ================================================= */}

      {activeSection ===
        "MANAGE" && (
        <>
          {loading ? (
            <Loader />
          ) : !data ||
            data.data.length ===
              0 ? (
            <EmptyState
              message="No results yet."
            />
          ) : (
            <div className="card overflow-x-auto p-0">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-left text-xs uppercase text-slate-400 dark:bg-slate-800/50">
                  <tr>
                    <th className="px-4 py-3">
                      Student
                    </th>

                    <th className="px-4 py-3">
                      Course
                    </th>

                    <th className="px-4 py-3">
                      Exam
                    </th>

                    <th className="px-4 py-3">
                      Subject
                    </th>

                    <th className="px-4 py-3">
                      Marks
                    </th>

                    <th className="px-4 py-3">
                      Grade
                    </th>

                    <th className="px-4 py-3">
                      GPA
                    </th>

                    <th className="px-4 py-3">
                      Date
                    </th>

                    <th className="px-4 py-3">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {data.data.map(
                    (result) => (
                      <tr
                        key={
                          result._id
                        }
                        className="border-t border-slate-100 dark:border-slate-800"
                      >
                        <td className="px-4 py-3">
                          <div className="font-medium text-slate-900 dark:text-white">
                            {getResultStudentName(
                              result
                            )}
                          </div>

                          <div className="mt-0.5 font-mono text-xs text-slate-400">
                            {getResultStudentId(
                              result
                            )}
                          </div>
                        </td>

                        <td className="px-4 py-3 font-medium">
                          {getResultCourseName(
                            result
                          )}
                        </td>

                        <td className="px-4 py-3">
                          {
                            result.examName
                          }
                        </td>

                        <td className="px-4 py-3">
                          {
                            result.subject
                          }
                        </td>

                        <td className="px-4 py-3">
                          <span className="font-semibold">
                            {
                              result.obtainedMarks
                            }
                          </span>

                          <span className="text-slate-400">
                            /
                            {
                              result.totalMarks
                            }
                          </span>
                        </td>

                        <td className="px-4 py-3 font-semibold">
                          {
                            result.grade
                          }
                        </td>

                        <td className="px-4 py-3 font-semibold">
                          {result.gpa}
                        </td>

                        <td className="whitespace-nowrap px-4 py-3 text-slate-500">
                          {formatDate(
                            result.examDate
                          )}
                        </td>

                        <td className="px-4 py-3">
                          <button
                            type="button"
                            onClick={() =>
                              setDeleteTarget(
                                result
                              )
                            }
                            className="rounded p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-950"
                            title="Delete result"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          )}

          {data && (
            <Pagination
              page={data.page}
              totalPages={
                data.totalPages
              }
              onChange={setPage}
            />
          )}
        </>
      )}

      {/* ================================================= */}
      {/* RESULT HISTORY */}
      {/* ================================================= */}

      {activeSection ===
        "HISTORY" && (
        <>
          {/* FILTER PANEL */}

          <div className="card p-5">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white">
                  Complete Result History
                </h3>

                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Search results by batch, exam, subject, student or date.
                </p>
              </div>

              <button
                type="button"
                onClick={
                  loadHistory
                }
                disabled={
                  historyLoading
                }
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                <RefreshCw
                  className={`h-4 w-4 ${
                    historyLoading
                      ? "animate-spin"
                      : ""
                  }`}
                />

                Refresh
              </button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
              {/* COURSE */}

              <div>
                <label className="label-field">
                  Batch / Course
                </label>

                <select
                  className="input-field w-full"
                  value={
                    historyCourse
                  }
                  onChange={(
                    event
                  ) =>
                    setHistoryCourse(
                      event.target
                        .value
                    )
                  }
                >
                  <option value="">
                    All batches / courses
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
                        {
                          course.title
                        }
                      </option>
                    )
                  )}
                </select>
              </div>

              {/* EXAM */}

              <div>
                <label className="label-field">
                  Exam
                </label>

                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                  <input
                    type="text"
                    className="input-field w-full pl-9"
                    placeholder="Exam name"
                    value={
                      historyExam
                    }
                    onChange={(
                      event
                    ) =>
                      setHistoryExam(
                        event.target
                          .value
                      )
                    }
                  />
                </div>
              </div>

              {/* SUBJECT */}

              <div>
                <label className="label-field">
                  Subject
                </label>

                <input
                  type="text"
                  className="input-field w-full"
                  placeholder="Subject"
                  value={
                    historySubject
                  }
                  onChange={(
                    event
                  ) =>
                    setHistorySubject(
                      event.target
                        .value
                    )
                  }
                />
              </div>

              {/* STUDENT */}

              <div>
                <label className="label-field">
                  Student
                </label>

                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                  <input
                    type="text"
                    className="input-field w-full pl-9"
                    placeholder="Name or Student ID"
                    value={
                      historyStudent
                    }
                    onChange={(
                      event
                    ) =>
                      setHistoryStudent(
                        event.target
                          .value
                      )
                    }
                  />
                </div>
              </div>

              {/* DATE */}

              <div>
                <label className="label-field">
                  Exam Date
                </label>

                <input
                  type="date"
                  className="input-field w-full"
                  value={
                    historyDate
                  }
                  onChange={(
                    event
                  ) =>
                    setHistoryDate(
                      event.target
                        .value
                    )
                  }
                />
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  clearHistoryFilters();
                }}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                <XCircle className="h-4 w-4" />
                Clear Filters
              </button>

              <button
                type="button"
                onClick={
                  loadHistory
                }
                className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-900"
              >
                <Search className="h-4 w-4" />
                Apply Filters
              </button>
            </div>
          </div>

          {/* SUMMARY CARDS */}

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {/* TOTAL */}

            <div className="card p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Results
                  </p>

                  <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
                    {
                      displayHistorySummary.totalRecords
                    }
                  </p>
                </div>

                <Users className="h-6 w-6 text-slate-400" />
              </div>
            </div>

            {/* TOTAL MARKS */}

            <div className="card p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Total Marks
                  </p>

                  <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
                    {
                      displayHistorySummary.totalMarks
                    }
                  </p>
                </div>

                <Trophy className="h-6 w-6 text-slate-400" />
              </div>
            </div>

            {/* OBTAINED */}

            <div className="card p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Obtained
                  </p>

                  <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
                    {
                      displayHistorySummary.obtainedMarks
                    }
                  </p>
                </div>

                <CheckCircle2 className="h-6 w-6 text-green-500" />
              </div>
            </div>

            {/* GPA */}

            <div className="card p-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Average GPA
                </p>

                <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
                  {
                    displayHistorySummary.averageGpa
                  }
                </p>
              </div>
            </div>

            {/* PASSED */}

            <div className="card p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Passed
                  </p>

                  <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
                    {
                      displayHistorySummary.passed
                    }
                  </p>
                </div>

                <CheckCircle2 className="h-6 w-6 text-green-500" />
              </div>
            </div>

            {/* FAILED */}

            <div className="card p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Failed
                  </p>

                  <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
                    {
                      displayHistorySummary.failed
                    }
                  </p>
                </div>

                <XCircle className="h-6 w-6 text-red-500" />
              </div>
            </div>
          </div>

          {/* ================================================= */}
          {/* EXAM SUMMARY */}
          {/* ================================================= */}

          {!historyLoading &&
            historyExams.length >
              0 && (
              <div className="card overflow-hidden p-0">
                <div className="border-b border-slate-200 p-5 dark:border-slate-800">
                  <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white">
                    Exam Summary
                  </h3>

                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    Exam-wise result overview.
                  </p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-50 text-left text-xs uppercase text-slate-400 dark:bg-slate-800/50">
                      <tr>
                        <th className="px-5 py-3">
                          Exam
                        </th>

                        <th className="px-5 py-3">
                          Date
                        </th>

                        <th className="px-5 py-3">
                          Results
                        </th>

                        <th className="px-5 py-3">
                          Total Marks
                        </th>

                        <th className="px-5 py-3">
                          Obtained
                        </th>

                        <th className="px-5 py-3">
                          Avg. GPA
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {historyExams.map(
                        (
                          exam,
                          index
                        ) => (
                          <tr
                            key={`${exam.examName}-${exam.examDate}-${index}`}
                            className="border-t border-slate-100 dark:border-slate-800"
                          >
                            <td className="px-5 py-3 font-semibold text-slate-900 dark:text-white">
                              {
                                exam.examName
                              }
                            </td>

                            <td className="px-5 py-3 text-slate-500">
                              {formatDate(
                                exam.examDate
                              )}
                            </td>

                            <td className="px-5 py-3">
                              {
                                exam.resultCount
                              }
                            </td>

                            <td className="px-5 py-3">
                              {
                                exam.totalMarks
                              }
                            </td>

                            <td className="px-5 py-3 font-semibold">
                              {
                                exam.obtainedMarks
                              }
                            </td>

                            <td className="px-5 py-3 font-semibold">
                              {
                                exam.averageGpa
                              }
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

          {/* ================================================= */}
          {/* FULL HISTORY TABLE */}
          {/* ================================================= */}

          {historyLoading ? (
            <Loader />
          ) : filteredHistoryResults.length ===
            0 ? (
            <EmptyState
              message="No results found for the selected filters."
            />
          ) : (
            <div className="card overflow-hidden p-0">
              <div className="border-b border-slate-200 p-5 dark:border-slate-800">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white">
                      Result Records
                    </h3>

                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      Showing{" "}
                      {
                        filteredHistoryResults.length
                      }{" "}
                      matching result records.
                    </p>
                  </div>

                  <div className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                    Complete History
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 text-left text-xs uppercase text-slate-400 dark:bg-slate-800/50">
                    <tr>
                      <th className="px-4 py-3">
                        Date
                      </th>

                      <th className="px-4 py-3">
                        Batch / Course
                      </th>

                      <th className="px-4 py-3">
                        Student
                      </th>

                      <th className="px-4 py-3">
                        Exam
                      </th>

                      <th className="px-4 py-3">
                        Subject
                      </th>

                      <th className="px-4 py-3">
                        Marks
                      </th>

                      <th className="px-4 py-3">
                        Grade
                      </th>

                      <th className="px-4 py-3">
                        GPA
                      </th>

                      <th className="px-4 py-3">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredHistoryResults.map(
                      (result) => (
                        <tr
                          key={
                            result._id
                          }
                          className="border-t border-slate-100 dark:border-slate-800"
                        >
                          <td className="whitespace-nowrap px-4 py-3">
                            <div className="flex items-center gap-2 text-slate-500">
                              <CalendarDays className="h-4 w-4 text-slate-400" />

                              {formatDate(
                                result.examDate
                              )}
                            </div>
                          </td>

                          <td className="px-4 py-3">
                            <span className="font-semibold text-slate-900 dark:text-white">
                              {getResultCourseName(
                                result
                              )}
                            </span>
                          </td>

                          <td className="px-4 py-3">
                            <div className="font-medium text-slate-900 dark:text-white">
                              {getResultStudentName(
                                result
                              )}
                            </div>

                            <div className="mt-0.5 font-mono text-xs text-slate-400">
                              {getResultStudentId(
                                result
                              )}
                            </div>
                          </td>

                          <td className="px-4 py-3 font-medium">
                            {
                              result.examName
                            }
                          </td>

                          <td className="px-4 py-3">
                            {
                              result.subject
                            }
                          </td>

                          <td className="px-4 py-3">
                            <span className="font-semibold">
                              {
                                result.obtainedMarks
                              }
                            </span>

                            <span className="text-slate-400">
                              /
                              {
                                result.totalMarks
                              }
                            </span>
                          </td>

                          <td className="px-4 py-3">
                            <span
                              className={`font-bold ${
                                String(
                                  result.grade ||
                                    ""
                                ).toUpperCase() ===
                                "F"
                                  ? "text-red-600"
                                  : "text-slate-900 dark:text-white"
                              }`}
                            >
                              {
                                result.grade
                              }
                            </span>
                          </td>

                          <td className="px-4 py-3 font-bold">
                            {result.gpa}
                          </td>

                          <td className="px-4 py-3">
                            <button
                              type="button"
                              onClick={() =>
                                setDeleteTarget(
                                  result
                                )
                              }
                              className="rounded-lg p-2 text-red-500 transition hover:bg-red-50 dark:hover:bg-red-950"
                              title="Delete result"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {/* ================================================= */}
      {/* ADD RESULT MODAL */}
      {/* ================================================= */}

      <Modal
        open={modalOpen}
        title="Add Result"
        onClose={() => {
          if (!saving) {
            setModalOpen(false);
          }
        }}
      >
        <div className="grid gap-4">
          {/* STUDENT */}

          <div>
            <label className="label-field">
              Student
            </label>

            <select
              className="input-field"
              value={
                form.student
              }
              onChange={(event) =>
                handleStudentChange(
                  event.target
                    .value
                )
              }
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
                    {
                      student.fullName
                    }{" "}
                    (
                    {
                      student.studentId
                    }
                    )
                  </option>
                )
              )}
            </select>
          </div>

          {/* COURSE */}

          <div>
            <label className="label-field">
              Course
            </label>

            <select
              className="input-field"
              value={
                form.course
              }
              disabled={
                !form.student
              }
              onChange={(event) =>
                setForm({
                  ...form,
                  course:
                    event.target
                      .value,
                })
              }
            >
              <option value="">
                {!form.student
                  ? "Select student first"
                  : selectedCourses.length ===
                      0
                    ? "No course assigned"
                    : "Select course"}
              </option>

              {selectedCourses.map(
                (course) => (
                  <option
                    key={
                      course._id
                    }
                    value={
                      course._id
                    }
                  >
                    {
                      course.title
                    }
                  </option>
                )
              )}
            </select>

            {form.student &&
              selectedCourses.length ===
                0 && (
                <p className="mt-1 text-xs text-amber-600">
                  This student has no assigned course.
                </p>
              )}
          </div>

          {/* EXAM */}

          <Input
            label="Exam Name"
            value={
              form.examName
            }
            onChange={(event) =>
              setForm({
                ...form,
                examName:
                  event.target
                    .value,
              })
            }
          />

          {/* SUBJECT */}

          <Input
            label="Subject"
            value={
              form.subject
            }
            onChange={(event) =>
              setForm({
                ...form,
                subject:
                  event.target
                    .value,
              })
            }
          />

          {/* MARKS */}

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Total Marks"
              type="number"
              min="0"
              value={
                form.totalMarks
              }
              onChange={(event) =>
                setForm({
                  ...form,
                  totalMarks:
                    event.target
                      .value,
                })
              }
            />

            <Input
              label="Obtained Marks"
              type="number"
              min="0"
              value={
                form.obtainedMarks
              }
              onChange={(event) =>
                setForm({
                  ...form,
                  obtainedMarks:
                    event.target
                      .value,
                })
              }
            />
          </div>

          {/* GRADE + GPA */}

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Grade"
              value={
                form.grade
              }
              onChange={(event) =>
                setForm({
                  ...form,
                  grade:
                    event.target
                      .value,
                })
              }
            />

            <Input
              label="GPA"
              type="number"
              step="0.01"
              min="0"
              max="5"
              value={
                form.gpa
              }
              onChange={(event) =>
                setForm({
                  ...form,
                  gpa:
                    event.target
                      .value,
                })
              }
            />
          </div>

          {/* EXAM DATE */}

          <Input
            label="Exam Date"
            type="date"
            value={
              form.examDate
            }
            onChange={(event) =>
              setForm({
                ...form,
                examDate:
                  event.target
                    .value,
              })
            }
          />

          {/* SAVE */}

          <Button
            onClick={
              handleSave
            }
            loading={saving}
          >
            Add Result
          </Button>
        </div>
      </Modal>

      {/* ================================================= */}
      {/* DELETE CONFIRMATION */}
      {/* ================================================= */}

      <ConfirmDialog
        open={
          !!deleteTarget
        }
        title="Delete Result"
        message="Are you sure you want to delete this result?"
        onConfirm={
          handleDelete
        }
        onCancel={() =>
          setDeleteTarget(null)
        }
      />
    </div>
  );
}