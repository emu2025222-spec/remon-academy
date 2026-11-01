
import { useEffect, useState } from "react";
import {
  Plus,
  Search,
  ClipboardCheck,
  Clock,
  CalendarDays,
  BookOpen,
  Trash2,
  Eye,
  Edit,
  X,
  Loader2,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Send,
  FileQuestion,
  Award,
} from "lucide-react";
import { api, getErrorMessage } from "../../services/api";

interface Course {
  _id: string;
  title: string;
  classLevel?: string;
  subject?: string;
}

interface Question {
  question: string;
  options: string[];
  correctAnswer: number;
  marks: number;
  negativeMarks: number;
}

interface Exam {
  _id: string;
  title: string;
  description?: string;
  course: Course | string;
  subject: string;
  startTime: string;
  endTime: string;
  duration: number;
  totalMarks: number;
  passMarks: number;
  negativeMarking: boolean;
  questions: Question[];
  isPublished: boolean;
}

const emptyQuestion = (): Question => ({
  question: "",
  options: ["", "", "", ""],
  correctAnswer: 0,
  marks: 1,
  negativeMarks: 0,
});

const initialForm = {
  title: "",
  description: "",
  course: "",
  subject: "",
  startTime: "",
  endTime: "",
  duration: 30,
  passMarks: 0,
  negativeMarking: false,
  questions: [emptyQuestion()],
};

/**
 * Handles common API response formats:
 * [items]
 * { data: [items] }
 * { data: { courses: [items] } }
 * { courses: [items] }
 * { results: [items] }
 */
function extractArray<T>(response: any, keys: string[] = []): T[] {
  const candidates = [
    response?.data?.data,
    response?.data,
    response?.data?.data?.data,
    ...keys.map((key) => response?.data?.data?.[key]),
    ...keys.map((key) => response?.data?.[key]),
  ];

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) {
      return candidate as T[];
    }
  }

  return [];
}

function localDateTime(value: string) {
  const date = new Date(value);
  const offset = date.getTimezoneOffset() * 60000;

  return new Date(date.getTime() - offset)
    .toISOString()
    .slice(0, 16);
}

export default function AdminExams() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);

  const [loading, setLoading] = useState(true);
  const [coursesLoading, setCoursesLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [viewExam, setViewExam] = useState<Exam | null>(null);

  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const totalMarks = form.questions.reduce(
    (sum, question) => sum + Number(question.marks || 0),
    0
  );

  // ==========================================
  // FETCH DATA
  // ==========================================

  const fetchData = async () => {
    setLoading(true);
    setCoursesLoading(true);
    setError("");

    try {
      const [examResponse, courseResponse] = await Promise.all([
        api.get("/exams"),
        api.get("/courses"),
      ]);

      const examList = extractArray<Exam>(examResponse, [
        "exams",
        "results",
      ]);

      const courseList = extractArray<Course>(courseResponse, [
        "courses",
        "results",
      ]);

      setExams(examList);
      setCourses(courseList);

      if (courseList.length === 0) {
        setError(
          "No courses were returned by the Courses API. Please check your course data or API response."
        );
      }
    } catch (err) {
      setError(getErrorMessage(err));
      setExams([]);
      setCourses([]);
    } finally {
      setLoading(false);
      setCoursesLoading(false);
    }
  };

  useEffect(() => {
    void fetchData();
  }, []);

  // ==========================================
  // CREATE EXAM
  // ==========================================

  const openCreate = () => {
    if (courses.length === 0) {
      setError("No courses available. Please add a course first.");
      return;
    }

    setEditingId(null);
    setForm({
      ...initialForm,
      questions: [emptyQuestion()],
    });
    setError("");
    setMessage("");
    setShowModal(true);
  };

  // ==========================================
  // EDIT EXAM
  // ==========================================

  const openEdit = (exam: Exam) => {
    setEditingId(exam._id);

    setForm({
      title: exam.title,
      description: exam.description || "",
      course:
        typeof exam.course === "string"
          ? exam.course
          : exam.course?._id || "",
      subject: exam.subject,
      startTime: localDateTime(exam.startTime),
      endTime: localDateTime(exam.endTime),
      duration: exam.duration,
      passMarks: exam.passMarks,
      negativeMarking: exam.negativeMarking,
      questions: (exam.questions || []).map((question) => ({
        ...question,
        options: [...question.options],
      })),
    });

    setError("");
    setMessage("");
    setShowModal(true);
  };

  // ==========================================
  // QUESTION MANAGEMENT
  // ==========================================

  const updateQuestion = (
    index: number,
    updates: Partial<Question>
  ) => {
    setForm((previous) => ({
      ...previous,
      questions: previous.questions.map((question, i) =>
        i === index ? { ...question, ...updates } : question
      ),
    }));
  };

  const updateOption = (
    questionIndex: number,
    optionIndex: number,
    value: string
  ) => {
    setForm((previous) => ({
      ...previous,
      questions: previous.questions.map((question, i) =>
        i === questionIndex
          ? {
              ...question,
              options: question.options.map((option, j) =>
                j === optionIndex ? value : option
              ),
            }
          : question
      ),
    }));
  };

  const addQuestion = () => {
    setForm((previous) => ({
      ...previous,
      questions: [...previous.questions, emptyQuestion()],
    }));
  };

  const removeQuestion = (index: number) => {
    if (form.questions.length === 1) {
      setError("At least one question is required.");
      return;
    }

    setForm((previous) => ({
      ...previous,
      questions: previous.questions.filter((_, i) => i !== index),
    }));

    setError("");
  };

  // ==========================================
  // SAVE EXAM
  // ==========================================

  const saveExam = async () => {
    setError("");
    setMessage("");

    if (
      !form.title.trim() ||
      !form.course ||
      !form.subject.trim() ||
      !form.startTime ||
      !form.endTime
    ) {
      setError("Please fill in all required exam information.");
      return;
    }

    if (!courses.some((course) => course._id === form.course)) {
      setError("Please select a valid course.");
      return;
    }

    if (new Date(form.endTime) <= new Date(form.startTime)) {
      setError("Exam end time must be after start time.");
      return;
    }

    if (form.duration < 1) {
      setError("Exam duration must be at least 1 minute.");
      return;
    }

    if (form.passMarks < 0 || form.passMarks > totalMarks) {
      setError("Pass marks cannot exceed total marks.");
      return;
    }

    if (form.questions.length === 0) {
      setError("Please add at least one question.");
      return;
    }

    for (let i = 0; i < form.questions.length; i++) {
      const question = form.questions[i];

      if (!question.question.trim()) {
        setError(`Question ${i + 1} is empty.`);
        return;
      }

      if (
        question.options.length !== 4 ||
        question.options.some((option) => !option.trim())
      ) {
        setError(`Please complete all four options in Question ${i + 1}.`);
        return;
      }

      if (
        !Number.isInteger(question.correctAnswer) ||
        question.correctAnswer < 0 ||
        question.correctAnswer > 3
      ) {
        setError(`Select a correct answer for Question ${i + 1}.`);
        return;
      }

      if (!Number.isFinite(question.marks) || question.marks <= 0) {
        setError(`Question ${i + 1} must have positive marks.`);
        return;
      }

      if (
        !Number.isFinite(question.negativeMarks) ||
        question.negativeMarks < 0
      ) {
        setError(`Question ${i + 1} has invalid negative marks.`);
        return;
      }
    }

    const payload = {
      ...form,
      totalMarks,
      startTime: new Date(form.startTime).toISOString(),
      endTime: new Date(form.endTime).toISOString(),
    };

    setSaving(true);

    try {
      if (editingId) {
        await api.put(`/exams/${editingId}`, payload);
        setMessage("Exam updated successfully.");
      } else {
        await api.post("/exams", payload);
        setMessage("Exam created successfully.");
      }

      setShowModal(false);
      setForm({
        ...initialForm,
        questions: [emptyQuestion()],
      });
      setEditingId(null);

      await fetchData();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // PUBLISH / UNPUBLISH
  // ==========================================

  const togglePublish = async (id: string) => {
    setError("");
    setMessage("");

    try {
      await api.patch(`/exams/${id}/toggle-publish`);
      setMessage("Exam publication status updated.");
      await fetchData();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  // ==========================================
  // DELETE EXAM
  // ==========================================

  const deleteExam = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this exam?"
    );

    if (!confirmed) return;

    setError("");
    setMessage("");

    try {
      await api.delete(`/exams/${id}`);
      setMessage("Exam deleted successfully.");
      await fetchData();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  // ==========================================
  // HELPERS
  // ==========================================

  const getCourseName = (course: Course | string) => {
    if (typeof course === "string") {
      const found = courses.find((item) => item._id === course);
      return found?.title || course;
    }

    return course?.title || "Unknown course";
  };

  const filteredExams = exams.filter((exam) =>
    `${exam.title} ${exam.subject} ${getCourseName(exam.course)}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const stats = [
    {
      label: "Total Exams",
      value: exams.length,
      icon: ClipboardCheck,
    },
    {
      label: "Published",
      value: exams.filter((exam) => exam.isPublished).length,
      icon: CheckCircle2,
    },
    {
      label: "Drafts",
      value: exams.filter((exam) => !exam.isPublished).length,
      icon: FileQuestion,
    },
  ];

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="space-y-7 text-slate-800">
      {/* HEADER */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-blue-600">
            <ClipboardCheck size={17} />
            REMON ACADEMY / EXAMINATION
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Examination Management
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Create, organize and manage your academy examinations.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => void fetchData()}
            disabled={loading}
            className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold hover:bg-slate-50 disabled:opacity-50"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>

          <button
            onClick={openCreate}
            className="flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/10 hover:bg-blue-700"
          >
            <Plus size={18} />
            Create Exam
          </button>
        </div>
      </div>

      {/* NOTIFICATIONS */}

      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <AlertCircle size={18} className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {message && (
        <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
          <CheckCircle2 size={18} />
          {message}
        </div>
      )}

      {/* STATS */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.label}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">{stat.label}</p>
                  <h2 className="mt-2 text-3xl font-bold text-slate-900">
                    {stat.value}
                  </h2>
                </div>

                <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                  <Icon size={23} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* SEARCH */}

      <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
        <Search size={19} className="text-slate-400" />

        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search exams, courses or subjects..."
          className="w-full bg-transparent text-sm outline-none"
        />
      </div>

      {/* EXAM LIST */}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-5 py-4">
          <h2 className="font-bold text-slate-900">All Examinations</h2>
          <p className="mt-1 text-xs text-slate-500">
            Manage your examination schedule and questions.
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center gap-3 py-16 text-slate-500">
            <Loader2 className="animate-spin" />
            Loading examinations...
          </div>
        ) : filteredExams.length === 0 ? (
          <div className="py-16 text-center">
            <ClipboardCheck
              size={40}
              className="mx-auto mb-3 text-slate-300"
            />

            <p className="font-semibold text-slate-700">
              No examinations found
            </p>

            <p className="mt-1 text-sm text-slate-400">
              Create your first examination to get started.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredExams.map((exam) => (
              <div
                key={exam._id}
                className="flex flex-col gap-4 p-5 transition hover:bg-slate-50/70 lg:flex-row lg:items-center lg:justify-between"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-bold text-slate-900">
                      {exam.title}
                    </h3>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        exam.isPublished
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      {exam.isPublished ? "Published" : "Draft"}
                    </span>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-500">
                    <span className="flex items-center gap-1.5">
                      <BookOpen size={14} />
                      {getCourseName(exam.course)}
                    </span>

                    <span className="flex items-center gap-1.5">
                      <FileQuestion size={14} />
                      {exam.questions?.length || 0} Questions
                    </span>

                    <span className="flex items-center gap-1.5">
                      <Award size={14} />
                      {exam.totalMarks} Marks
                    </span>

                    <span className="flex items-center gap-1.5">
                      <Clock size={14} />
                      {exam.duration} Minutes
                    </span>

                    <span className="flex items-center gap-1.5">
                      <CalendarDays size={14} />
                      {new Date(exam.startTime).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => setViewExam(exam)}
                    className="rounded-lg border border-slate-200 p-2.5 text-slate-600 hover:bg-slate-100"
                    title="View"
                  >
                    <Eye size={17} />
                  </button>

                  <button
                    onClick={() => openEdit(exam)}
                    className="rounded-lg border border-slate-200 p-2.5 text-blue-600 hover:bg-blue-50"
                    title="Edit"
                  >
                    <Edit size={17} />
                  </button>

                  <button
                    onClick={() => void togglePublish(exam._id)}
                    className={`flex items-center gap-1.5 rounded-lg px-3 py-2.5 text-xs font-semibold ${
                      exam.isPublished
                        ? "bg-amber-50 text-amber-700 hover:bg-amber-100"
                        : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                    }`}
                  >
                    <Send size={14} />
                    {exam.isPublished ? "Unpublish" : "Publish"}
                  </button>

                  <button
                    onClick={() => void deleteExam(exam._id)}
                    className="rounded-lg border border-red-100 p-2.5 text-red-500 hover:bg-red-50"
                    title="Delete"
                  >
                    <Trash2 size={17} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CREATE / EDIT MODAL */}

      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 p-3 backdrop-blur-sm sm:p-6">
          <div className="mx-auto my-5 max-w-4xl overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  {editingId ? "Edit Examination" : "Create Examination"}
                </h2>

                <p className="text-xs text-slate-500">
                  Configure exam information and MCQ questions.
                </p>
              </div>

              <button
                onClick={() => setShowModal(false)}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-6 p-5 sm:p-7">
              {/* BASIC INFORMATION */}

              <section>
                <h3 className="mb-4 font-bold text-slate-900">
                  01. Basic Information
                </h3>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="sm:col-span-2">
                    <span className="mb-2 block text-sm font-semibold">
                      Exam Title *
                    </span>

                    <input
                      value={form.title}
                      onChange={(e) =>
                        setForm({ ...form, title: e.target.value })
                      }
                      placeholder="e.g. Physics Chapter 1 Examination"
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500"
                    />
                  </label>

                  <label>
                    <span className="mb-2 block text-sm font-semibold">
                      Course *
                    </span>

                    <select
                      value={form.course}
                      disabled={coursesLoading || courses.length === 0}
                      onChange={(e) =>
                        setForm({ ...form, course: e.target.value })
                      }
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 disabled:bg-slate-100"
                    >
                      <option value="">
                        {coursesLoading
                          ? "Loading courses..."
                          : courses.length === 0
                            ? "No courses available"
                            : "Select Course"}
                      </option>

                      {courses.map((course) => (
                        <option key={course._id} value={course._id}>
                          {course.title}
                        </option>
                      ))}
                    </select>

                    {!coursesLoading && courses.length === 0 && (
                      <span className="mt-2 block text-xs text-red-500">
                        No courses found. Add a course first.
                      </span>
                    )}
                  </label>

                  <label>
                    <span className="mb-2 block text-sm font-semibold">
                      Subject *
                    </span>

                    <input
                      value={form.subject}
                      onChange={(e) =>
                        setForm({ ...form, subject: e.target.value })
                      }
                      placeholder="e.g. Physics"
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500"
                    />
                  </label>

                  <label className="sm:col-span-2">
                    <span className="mb-2 block text-sm font-semibold">
                      Description
                    </span>

                    <textarea
                      value={form.description}
                      onChange={(e) =>
                        setForm({ ...form, description: e.target.value })
                      }
                      rows={3}
                      placeholder="Exam instructions..."
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500"
                    />
                  </label>
                </div>
              </section>

              {/* SCHEDULE */}

              <section className="border-t border-slate-100 pt-6">
                <h3 className="mb-4 font-bold text-slate-900">
                  02. Examination Schedule
                </h3>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label>
                    <span className="mb-2 block text-sm font-semibold">
                      Start Date & Time *
                    </span>

                    <input
                      type="datetime-local"
                      value={form.startTime}
                      onChange={(e) =>
                        setForm({ ...form, startTime: e.target.value })
                      }
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm"
                    />
                  </label>

                  <label>
                    <span className="mb-2 block text-sm font-semibold">
                      End Date & Time *
                    </span>

                    <input
                      type="datetime-local"
                      value={form.endTime}
                      onChange={(e) =>
                        setForm({ ...form, endTime: e.target.value })
                      }
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm"
                    />
                  </label>

                  <label>
                    <span className="mb-2 block text-sm font-semibold">
                      Duration (Minutes) *
                    </span>

                    <input
                      type="number"
                      min="1"
                      value={form.duration}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          duration: Number(e.target.value),
                        })
                      }
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm"
                    />
                  </label>

                  <label>
                    <span className="mb-2 block text-sm font-semibold">
                      Pass Marks
                    </span>

                    <input
                      type="number"
                      min="0"
                      max={totalMarks}
                      value={form.passMarks}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          passMarks: Number(e.target.value),
                        })
                      }
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm"
                    />
                  </label>
                </div>
              </section>

              {/* MARKS */}

              <section className="rounded-xl bg-blue-50 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-blue-900">
                      Total Examination Marks
                    </p>

                    <p className="mt-1 text-xs text-blue-600">
                      Automatically calculated from all questions.
                    </p>
                  </div>

                  <span className="text-3xl font-bold text-blue-800">
                    {totalMarks}
                  </span>
                </div>

                <label className="mt-4 flex items-center gap-3 text-sm font-medium text-blue-900">
                  <input
                    type="checkbox"
                    checked={form.negativeMarking}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        negativeMarking: e.target.checked,
                      })
                    }
                    className="h-4 w-4"
                  />
                  Enable Negative Marking
                </label>
              </section>

              {/* QUESTION BUILDER */}

              <section className="border-t border-slate-100 pt-6">
                <div className="mb-5 flex items-center justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-slate-900">
                      03. MCQ Question Builder
                    </h3>

                    <p className="mt-1 text-xs text-slate-500">
                      Select one correct answer for each question.
                    </p>
                  </div>

                  <button
                    onClick={addQuestion}
                    className="flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-xs font-bold text-white hover:bg-blue-700"
                  >
                    <Plus size={15} />
                    Add Question
                  </button>
                </div>

                <div className="space-y-5">
                  {form.questions.map((question, index) => (
                    <div
                      key={index}
                      className="rounded-xl border border-slate-200 p-4 sm:p-5"
                    >
                      <div className="mb-4 flex items-center justify-between">
                        <span className="font-bold text-slate-900">
                          Question {index + 1}
                        </span>

                        <button
                          onClick={() => removeQuestion(index)}
                          className="rounded-lg p-2 text-red-500 hover:bg-red-50"
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>

                      <textarea
                        value={question.question}
                        onChange={(e) =>
                          updateQuestion(index, {
                            question: e.target.value,
                          })
                        }
                        rows={2}
                        placeholder="Write your question here..."
                        className="mb-4 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500"
                      />

                      <div className="grid gap-3 sm:grid-cols-2">
                        {question.options.map((option, optionIndex) => (
                          <label
                            key={optionIndex}
                            className={`flex items-center gap-3 rounded-xl border p-3 ${
                              question.correctAnswer === optionIndex
                                ? "border-emerald-400 bg-emerald-50"
                                : "border-slate-200"
                            }`}
                          >
                            <input
                              type="radio"
                              name={`correct-${index}`}
                              checked={
                                question.correctAnswer === optionIndex
                              }
                              onChange={() =>
                                updateQuestion(index, {
                                  correctAnswer: optionIndex,
                                })
                              }
                              className="h-4 w-4 accent-emerald-600"
                            />

                            <input
                              value={option}
                              onChange={(e) =>
                                updateOption(
                                  index,
                                  optionIndex,
                                  e.target.value
                                )
                              }
                              placeholder={`Option ${String.fromCharCode(
                                65 + optionIndex
                              )}`}
                              className="w-full bg-transparent text-sm outline-none"
                            />
                          </label>
                        ))}
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-3">
                        <label>
                          <span className="mb-2 block text-xs font-semibold text-slate-600">
                            Question Marks
                          </span>

                          <input
                            type="number"
                            min="0.01"
                            step="0.01"
                            value={question.marks}
                            onChange={(e) =>
                              updateQuestion(index, {
                                marks: Number(e.target.value),
                              })
                            }
                            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                          />
                        </label>

                        <label>
                          <span className="mb-2 block text-xs font-semibold text-slate-600">
                            Negative Marks
                          </span>

                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={question.negativeMarks}
                            onChange={(e) =>
                              updateQuestion(index, {
                                negativeMarks: Number(e.target.value),
                              })
                            }
                            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                          />
                        </label>
                      </div>

                      <p className="mt-3 text-xs font-semibold text-emerald-700">
                        Correct answer: Option{" "}
                        {String.fromCharCode(65 + question.correctAnswer)}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              {/* FOOTER */}

              <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
                <button
                  onClick={() => setShowModal(false)}
                  className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  onClick={() => void saveExam()}
                  disabled={saving || courses.length === 0}
                  className="flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-60"
                >
                  {saving ? (
                    <Loader2 size={17} className="animate-spin" />
                  ) : (
                    <CheckCircle2 size={17} />
                  )}

                  {editingId ? "Update Examination" : "Create Examination"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW EXAM MODAL */}

      {viewExam && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 p-3 backdrop-blur-sm sm:p-6">
          <div className="mx-auto my-8 max-w-3xl rounded-2xl bg-white p-5 shadow-2xl sm:p-7">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  {viewExam.title}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {viewExam.subject} · {getCourseName(viewExam.course)}
                </p>
              </div>

              <button
                onClick={() => setViewExam(null)}
                className="rounded-lg p-2 hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                ["Questions", viewExam.questions?.length || 0],
                ["Total Marks", viewExam.totalMarks],
                ["Pass Marks", viewExam.passMarks],
                ["Duration", `${viewExam.duration} min`],
              ].map(([label, value]) => (
                <div
                  key={String(label)}
                  className="rounded-xl bg-slate-50 p-3"
                >
                  <p className="text-xs text-slate-500">{label}</p>
                  <p className="mt-1 font-bold text-slate-900">{value}</p>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              {(viewExam.questions || []).map((question, index) => (
                <div
                  key={index}
                  className="rounded-xl border border-slate-200 p-4"
                >
                  <p className="font-semibold text-slate-900">
                    {index + 1}. {question.question}
                  </p>

                  <div className="mt-3 grid gap-2 sm:grid-cols-2">
                    {question.options.map((option, optionIndex) => (
                      <div
                        key={optionIndex}
                        className={`rounded-lg p-3 text-sm ${
                          question.correctAnswer === optionIndex
                            ? "bg-emerald-50 font-semibold text-emerald-700"
                            : "bg-slate-50 text-slate-600"
                        }`}
                      >
                        {String.fromCharCode(65 + optionIndex)}. {option}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
