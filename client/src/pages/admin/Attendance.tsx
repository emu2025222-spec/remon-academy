import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  Search,
  Users,
  XCircle,
} from "lucide-react";

import { api, getErrorMessage } from "../../services/api";
import { Course, Student } from "../../types";
import { Button } from "../../components/Button";
import { Loader } from "../../components/Loader";
import { EmptyState } from "../../components/EmptyState";
import { useToast } from "../../components/Toast";

type AttendanceStatus = "PRESENT" | "ABSENT" | "LATE";

type StatusMap = Record<string, AttendanceStatus>;

interface AttendanceRecord {
  _id: string;
  date: string;
  status: AttendanceStatus;
  student:
    | {
        _id: string;
        fullName: string;
        studentId: string;
      }
    | string;
  course:
    | {
        _id: string;
        title: string;
        subject?: string;
        classLevel?: string;
      }
    | string;
}

function getStudentName(student: AttendanceRecord["student"]) {
  if (typeof student === "object" && student) {
    return student.fullName;
  }

  return "Unknown Student";
}

function getStudentId(student: AttendanceRecord["student"]) {
  if (typeof student === "object" && student) {
    return student.studentId;
  }

  return "-";
}

function getCourseName(course: AttendanceRecord["course"]) {
  if (typeof course === "object" && course) {
    return course.title;
  }

  return "Unknown Course";
}

function formatDate(date: string) {
  const value = new Date(date);

  if (Number.isNaN(value.getTime())) {
    return date;
  }

  return value.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getStatusClasses(status: AttendanceStatus) {
  if (status === "PRESENT") {
    return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
  }

  if (status === "LATE") {
    return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
  }

  return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
}

export default function AdminAttendance() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [courseId, setCourseId] = useState("");

  const [date, setDate] = useState(
    new Date().toISOString().slice(0, 10)
  );

  const [students, setStudents] = useState<Student[]>([]);
  const [statusMap, setStatusMap] = useState<StatusMap>({});

  const [history, setHistory] = useState<AttendanceRecord[]>([]);

  const [historyCourseId, setHistoryCourseId] = useState("");
  const [historyDate, setHistoryDate] = useState("");
  const [historyStudent, setHistoryStudent] = useState("");

  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [activeSection, setActiveSection] = useState<
    "MARK" | "HISTORY"
  >("MARK");

  const { show } = useToast();

  /*
   * Load courses
   */
  useEffect(() => {
    async function loadCourses() {
      try {
        const response = await api.get("/courses", {
          params: { limit: 100 },
        });

        setCourses(response.data.data.data || []);
      } catch (err) {
        show(getErrorMessage(err), "error");
      }
    }

    loadCourses();
  }, [show]);

  /*
   * Load students for selected course
   */
  useEffect(() => {
    async function loadStudents() {
      if (!courseId) {
        setStudents([]);
        setStatusMap({});
        return;
      }

      setLoading(true);

      try {
        const response = await api.get("/students", {
          params: {
            course: courseId,
            limit: 100,
          },
        });

        const studentList: Student[] =
          response.data.data.data || [];

        setStudents(studentList);

        /*
         * Default everyone to PRESENT.
         */
        const initial: StatusMap = {};

        studentList.forEach((student) => {
          initial[student._id] = "PRESENT";
        });

        setStatusMap(initial);

        /*
         * Try loading existing attendance for this
         * course + selected date.
         */
        try {
          const attendanceResponse = await api.get(
            "/attendance",
            {
              params: {
                course: courseId,
                date,
              },
            }
          );

          const existingRecords: AttendanceRecord[] =
            attendanceResponse.data.data || [];

          if (existingRecords.length > 0) {
            const existingMap: StatusMap = {
              ...initial,
            };

            existingRecords.forEach((record) => {
              const studentId =
                typeof record.student === "object"
                  ? record.student._id
                  : record.student;

              existingMap[studentId] = record.status;
            });

            setStatusMap(existingMap);
          }
        } catch {
          /*
           * If existing attendance cannot be loaded,
           * keep default PRESENT state.
           */
        }
      } catch (err) {
        show(getErrorMessage(err), "error");
      } finally {
        setLoading(false);
      }
    }

    loadStudents();
  }, [courseId, date, show]);

  /*
   * Load complete attendance history
   */
  async function loadHistory() {
    setHistoryLoading(true);

    try {
      const params: Record<string, string> = {};

      if (historyCourseId) {
        params.course = historyCourseId;
      }

      if (historyDate) {
        params.date = historyDate;
      }

      if (historyStudent.trim()) {
        params.student = historyStudent.trim();
      }

      const response = await api.get("/attendance", {
        params,
      });

      setHistory(response.data.data || []);
    } catch (err) {
      show(getErrorMessage(err), "error");
    } finally {
      setHistoryLoading(false);
    }
  }

  useEffect(() => {
    loadHistory();
  }, [historyCourseId, historyDate]);

  /*
   * Save attendance
   */
  async function handleSubmit() {
    if (!courseId) {
      show("Select a course first", "error");
      return;
    }

    if (!date) {
      show("Select a date first", "error");
      return;
    }

    if (students.length === 0) {
      show("No students found for this course", "error");
      return;
    }

    setSaving(true);

    try {
      const records = students.map((student) => ({
        student: student._id,
        status: statusMap[student._id] || "PRESENT",
      }));

      await api.post("/attendance/bulk", {
        course: courseId,
        date,
        records,
      });

      show("Attendance saved successfully", "success");

      await loadHistory();
    } catch (err) {
      show(getErrorMessage(err), "error");
    } finally {
      setSaving(false);
    }
  }

  /*
   * Search history by student name / ID
   */
  const filteredHistory = useMemo(() => {
    const search = historyStudent.trim().toLowerCase();

    if (!search) {
      return history;
    }

    return history.filter((record) => {
      const name = getStudentName(record.student).toLowerCase();
      const studentId =
        getStudentId(record.student).toLowerCase();

      return (
        name.includes(search) ||
        studentId.includes(search)
      );
    });
  }, [history, historyStudent]);

  /*
   * History statistics
   */
  const historyStats = useMemo(() => {
    const total = filteredHistory.length;

    const present = filteredHistory.filter(
      (record) => record.status === "PRESENT"
    ).length;

    const absent = filteredHistory.filter(
      (record) => record.status === "ABSENT"
    ).length;

    const late = filteredHistory.filter(
      (record) => record.status === "LATE"
    ).length;

    const percentage = total
      ? Math.round(
          ((present + late * 0.5) / total) * 100
        )
      : 0;

    return {
      total,
      present,
      absent,
      late,
      percentage,
    };
  }, [filteredHistory]);

  /*
   * Current marking statistics
   */
  const currentStats = useMemo(() => {
    const values = Object.values(statusMap);

    return {
      total: values.length,
      present: values.filter(
        (value) => value === "PRESENT"
      ).length,
      absent: values.filter(
        (value) => value === "ABSENT"
      ).length,
      late: values.filter(
        (value) => value === "LATE"
      ).length,
    };
  }, [statusMap]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white">
          Attendance Management
        </h2>

        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Mark attendance and view batch-wise attendance history.
        </p>
      </div>

      {/* Section Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3 dark:border-slate-800">
        <button
          type="button"
          onClick={() => setActiveSection("MARK")}
          className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
            activeSection === "MARK"
              ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
              : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          Mark Attendance
        </button>

        <button
          type="button"
          onClick={() => setActiveSection("HISTORY")}
          className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
            activeSection === "HISTORY"
              ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
              : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          Attendance History
        </button>
      </div>

      {/* ========================================================= */}
      {/* MARK ATTENDANCE */}
      {/* ========================================================= */}

      {activeSection === "MARK" && (
        <>
          <div className="card p-5">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="label-field">
                  Batch / Course
                </label>

                <select
                  className="input-field w-full"
                  value={courseId}
                  onChange={(event) =>
                    setCourseId(event.target.value)
                  }
                >
                  <option value="">
                    Select batch / course
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

              <div>
                <label className="label-field">
                  Attendance Date
                </label>

                <input
                  type="date"
                  className="input-field w-full"
                  value={date}
                  onChange={(event) =>
                    setDate(event.target.value)
                  }
                />
              </div>
            </div>
          </div>

          {!courseId ? (
            <EmptyState message="Select a batch/course to load its students." />
          ) : loading ? (
            <Loader />
          ) : students.length === 0 ? (
            <EmptyState message="No students enrolled in this batch/course." />
          ) : (
            <>
              {/* Current Summary */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="card p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Total
                      </p>
                      <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
                        {currentStats.total}
                      </p>
                    </div>

                    <Users className="h-6 w-6 text-slate-400" />
                  </div>
                </div>

                <div className="card p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-green-600">
                        Present
                      </p>
                      <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
                        {currentStats.present}
                      </p>
                    </div>

                    <CheckCircle2 className="h-6 w-6 text-green-500" />
                  </div>
                </div>

                <div className="card p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-red-600">
                        Absent
                      </p>
                      <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
                        {currentStats.absent}
                      </p>
                    </div>

                    <XCircle className="h-6 w-6 text-red-500" />
                  </div>
                </div>

                <div className="card p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-yellow-600">
                        Late
                      </p>
                      <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
                        {currentStats.late}
                      </p>
                    </div>

                    <Clock3 className="h-6 w-6 text-yellow-500" />
                  </div>
                </div>
              </div>

              {/* Student Table */}
              <div className="card overflow-hidden p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-50 text-left text-xs uppercase text-slate-400 dark:bg-slate-800/50">
                      <tr>
                        <th className="px-4 py-3">
                          Student ID
                        </th>

                        <th className="px-4 py-3">
                          Student
                        </th>

                        <th className="px-4 py-3">
                          Attendance
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {students.map((student) => (
                        <tr
                          key={student._id}
                          className="border-t border-slate-100 dark:border-slate-800"
                        >
                          <td className="px-4 py-3 font-mono text-xs">
                            {student.studentId}
                          </td>

                          <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200">
                            {student.fullName}
                          </td>

                          <td className="px-4 py-3">
                            <div className="flex flex-wrap gap-2">
                              {(
                                [
                                  "PRESENT",
                                  "ABSENT",
                                  "LATE",
                                ] as const
                              ).map((status) => {
                                const active =
                                  statusMap[
                                    student._id
                                  ] === status;

                                return (
                                  <button
                                    key={status}
                                    type="button"
                                    onClick={() =>
                                      setStatusMap({
                                        ...statusMap,
                                        [student._id]:
                                          status,
                                      })
                                    }
                                    className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                                      active
                                        ? status ===
                                          "PRESENT"
                                          ? "bg-green-600 text-white"
                                          : status ===
                                            "LATE"
                                          ? "bg-yellow-500 text-white"
                                          : "bg-red-600 text-white"
                                        : "bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
                                    }`}
                                  >
                                    {status}
                                  </button>
                                );
                              })}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={handleSubmit}
                  loading={saving}
                >
                  Save Attendance
                </Button>
              </div>
            </>
          )}
        </>
      )}

      {/* ========================================================= */}
      {/* ATTENDANCE HISTORY */}
      {/* ========================================================= */}

      {activeSection === "HISTORY" && (
        <>
          {/* Filters */}
          <div className="card p-5">
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <label className="label-field">
                  Batch / Course
                </label>

                <select
                  className="input-field w-full"
                  value={historyCourseId}
                  onChange={(event) =>
                    setHistoryCourseId(
                      event.target.value
                    )
                  }
                >
                  <option value="">
                    All batches / courses
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

              <div>
                <label className="label-field">
                  Date
                </label>

                <input
                  type="date"
                  className="input-field w-full"
                  value={historyDate}
                  onChange={(event) =>
                    setHistoryDate(event.target.value)
                  }
                />
              </div>

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
                    value={historyStudent}
                    onChange={(event) =>
                      setHistoryStudent(
                        event.target.value
                      )
                    }
                  />
                </div>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => {
                  setHistoryCourseId("");
                  setHistoryDate("");
                  setHistoryStudent("");
                }}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Clear Filters
              </button>

              <button
                type="button"
                onClick={loadHistory}
                className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-900"
              >
                Refresh
              </button>
            </div>
          </div>

          {/* History Summary */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <div className="card p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Records
              </p>

              <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
                {historyStats.total}
              </p>
            </div>

            <div className="card p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-green-600">
                Present
              </p>

              <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
                {historyStats.present}
              </p>
            </div>

            <div className="card p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-red-600">
                Absent
              </p>

              <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
                {historyStats.absent}
              </p>
            </div>

            <div className="card p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-yellow-600">
                Late
              </p>

              <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
                {historyStats.late}
              </p>
            </div>

            <div className="card p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Attendance
              </p>

              <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
                {historyStats.percentage}%
              </p>
            </div>
          </div>

          {/* History Table */}
          {historyLoading ? (
            <Loader />
          ) : filteredHistory.length === 0 ? (
            <EmptyState message="No attendance records found." />
          ) : (
            <div className="card overflow-hidden p-0">
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
                        Student ID
                      </th>

                      <th className="px-4 py-3">
                        Student
                      </th>

                      <th className="px-4 py-3">
                        Status
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredHistory.map(
                      (record) => (
                        <tr
                          key={record._id}
                          className="border-t border-slate-100 dark:border-slate-800"
                        >
                          <td className="whitespace-nowrap px-4 py-3">
                            <div className="flex items-center gap-2">
                              <CalendarDays className="h-4 w-4 text-slate-400" />

                              {formatDate(
                                record.date
                              )}
                            </div>
                          </td>

                          <td className="px-4 py-3 font-medium">
                            {getCourseName(
                              record.course
                            )}
                          </td>

                          <td className="px-4 py-3 font-mono text-xs">
                            {getStudentId(
                              record.student
                            )}
                          </td>

                          <td className="px-4 py-3 font-medium">
                            {getStudentName(
                              record.student
                            )}
                          </td>

                          <td className="px-4 py-3">
                            <span
                              className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${getStatusClasses(
                                record.status
                              )}`}
                            >
                              {record.status}
                            </span>
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
    </div>
  );
}