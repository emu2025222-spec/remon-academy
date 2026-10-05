import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";

import {
  api,
  getErrorMessage,
} from "../../services/api";

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
  const [data, setData] =
    useState<PaginatedResponse<Result> | null>(null);

  const [students, setStudents] =
    useState<Student[]>([]);

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

  const { show } = useToast();

  // =====================================================
  // LOAD RESULTS
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

    const courses: Course[] = [];

    if (Array.isArray(student.courses)) {
      student.courses.forEach(
        (course) => {
          if (
            typeof course === "object" &&
            course !== null
          ) {
            courses.push(course);
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
        courses.some(
          (course) =>
            course._id ===
            studentCourse._id
        );

      if (!exists) {
        courses.push(
          studentCourse
        );
      }
    }

    return courses;
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

    const courses =
      getStudentCourses(student);

    setForm({
      ...form,
      student: studentId,
      course:
        courses.length === 1
          ? courses[0]._id
          : "",
    });
  };

  // =====================================================
  // GET COURSE NAME
  // =====================================================

  const getCourseName = (
    result: Result
  ): string => {
    if (
      typeof result.student !==
        "object" ||
      result.student === null
    ) {
      return "—";
    }

    const student =
      result.student;

    const courses =
      getStudentCourses(student);

    if (courses.length === 1) {
      return courses[0].title;
    }

    return "—";
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

    setSaving(true);

    try {
      const payload = {
        student: form.student,
        course: form.course || undefined,
        examName:
          form.examName.trim(),
        subject:
          form.subject.trim(),
        totalMarks:
          Number(form.totalMarks),
        obtainedMarks:
          Number(form.obtainedMarks),
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
    <div>
      {/* HEADER */}

      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white">
            Results
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Manage student results
            and course-wise
            performance.
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

      {/* TABLE */}

      {loading ? (
        <Loader />
      ) : !data ||
        data.data.length === 0 ? (
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
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {data.data.map(
                (result) => (
                  <tr
                    key={result._id}
                    className="border-t border-slate-100 dark:border-slate-800"
                  >
                    <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">
                      {typeof result.student ===
                      "object"
                        ? result.student.fullName
                        : "-"}
                    </td>

                    <td className="px-4 py-3">
                      {getCourseName(
                        result
                      )}
                    </td>

                    <td className="px-4 py-3">
                      {result.examName}
                    </td>

                    <td className="px-4 py-3">
                      {result.subject}
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
                      {result.grade}
                    </td>

                    <td className="px-4 py-3 font-semibold">
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

      {/* PAGINATION */}

      {data && (
        <Pagination
          page={data.page}
          totalPages={
            data.totalPages
          }
          onChange={setPage}
        />
      )}

      {/* ADD RESULT */}

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
              value={form.student}
              onChange={(event) =>
                handleStudentChange(
                  event.target.value
                )
              }
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
                    {student.fullName} (
                    {student.studentId})
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
              value={form.course}
              disabled={!form.student}
              onChange={(event) =>
                setForm({
                  ...form,
                  course:
                    event.target.value,
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
                    key={course._id}
                    value={course._id}
                  >
                    {course.title}
                  </option>
                )
              )}
            </select>

            {form.student &&
              selectedCourses.length ===
                0 && (
                <p className="mt-1 text-xs text-amber-600">
                  This student has no
                  assigned course.
                </p>
              )}
          </div>

          {/* EXAM */}

          <Input
            label="Exam Name"
            value={form.examName}
            onChange={(event) =>
              setForm({
                ...form,
                examName:
                  event.target.value,
              })
            }
          />

          {/* SUBJECT */}

          <Input
            label="Subject"
            value={form.subject}
            onChange={(event) =>
              setForm({
                ...form,
                subject:
                  event.target.value,
              })
            }
          />

          {/* MARKS */}

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Total Marks"
              type="number"
              value={form.totalMarks}
              onChange={(event) =>
                setForm({
                  ...form,
                  totalMarks:
                    event.target.value,
                })
              }
            />

            <Input
              label="Obtained Marks"
              type="number"
              value={
                form.obtainedMarks
              }
              onChange={(event) =>
                setForm({
                  ...form,
                  obtainedMarks:
                    event.target.value,
                })
              }
            />
          </div>

          {/* GRADE + GPA */}

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Grade"
              value={form.grade}
              onChange={(event) =>
                setForm({
                  ...form,
                  grade:
                    event.target.value,
                })
              }
            />

            <Input
              label="GPA"
              type="number"
              step="0.01"
              min="0"
              max="5"
              value={form.gpa}
              onChange={(event) =>
                setForm({
                  ...form,
                  gpa:
                    event.target.value,
                })
              }
            />
          </div>

          {/* DATE */}

          <Input
            label="Exam Date"
            type="date"
            value={form.examDate}
            onChange={(event) =>
              setForm({
                ...form,
                examDate:
                  event.target.value,
              })
            }
          />

          {/* SAVE */}

          <Button
            onClick={handleSave}
            loading={saving}
          >
            Add Result
          </Button>
        </div>
      </Modal>

      {/* DELETE */}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Result"
        message="Are you sure you want to delete this result?"
        onConfirm={handleDelete}
        onCancel={() =>
          setDeleteTarget(null)
        }
      />
    </div>
  );
}

