
import { useCallback, useEffect, useState } from "react";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Clock,
  ClipboardCheck,
  Download,
  Loader2,
  RefreshCw,
  Send,
  Trophy,
  XCircle,
} from "lucide-react";
import { api, getErrorMessage } from "../../services/api";

interface Question {
  _id: string;
  question: string;
  options: string[];
  marks: number;
  negativeMarks?: number;
}

interface Exam {
  _id: string;
  title: string;
  description?: string;
  course: { title: string } | string;
  subject: string;
  startTime: string;
  endTime: string;
  duration: number;
  totalMarks: number;
  passMarks: number;
  questions: Question[];
  attempt?: {
    _id?: string;
    status: "IN_PROGRESS" | "SUBMITTED";
  } | null;
}

interface Answer {
  questionId: string;
  selectedAnswer: number;
}

interface Attempt {
  _id: string;
  expiresAt: string;
  answers?: Answer[];
  status: "IN_PROGRESS" | "SUBMITTED";
}

interface ReviewQuestion {
  questionId: string;
  question: string;
  options: string[];
  marks: number;
  negativeMarks?: number;
  selectedAnswer: number | null;
  correctAnswer: number;
  isCorrect: boolean;
}

interface Review {
  exam?: { title: string };
  obtainedMarks: number;
  totalMarks: number;
  percentage: number;
  passed: boolean;
  correctCount: number;
  wrongCount: number;
  unansweredCount: number;
  questions: ReviewQuestion[];
}

// Prevent question/option text from being interpreted as HTML.
function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;",
    };

    return entities[character];
  });
}

function downloadResultPDF(review: Review) {
  const examTitle = review.exam?.title || "Examination Result";

  const questionHTML = (review.questions || [])
    .map((question, index) => {
      const optionsHTML = question.options
        .map((option, optionIndex) => {
          const isCorrect = optionIndex === question.correctAnswer;
          const isSelected = optionIndex === question.selectedAnswer;

          let status = "";
          let className = "";

          if (isCorrect) {
            status = " — Correct Answer";
            className = "correct";
          } else if (isSelected) {
            status = " — Your Answer";
            className = "incorrect";
          }

          return `
            <div class="option ${className}">
              <strong>${String.fromCharCode(65 + optionIndex)}.</strong>
              ${escapeHtml(option)}
              <strong>${status}</strong>
            </div>
          `;
        })
        .join("");

      const selectedText =
        question.selectedAnswer === null
          ? "Not Answered"
          : question.options[question.selectedAnswer] || "Not Answered";

      const correctText =
        question.options[question.correctAnswer] || "Not Available";

      return `
        <section class="question">
          <div class="question-heading">
            <strong>Question ${index + 1}</strong>
            <span>${question.marks} Marks</span>
          </div>

          <p class="question-text">${escapeHtml(question.question)}</p>

          <div class="options">${optionsHTML}</div>

          <div class="answer-summary">
            <p><strong>Your Answer:</strong> ${escapeHtml(selectedText)}</p>
            <p><strong>Correct Answer:</strong> ${escapeHtml(correctText)}</p>
            <p><strong>Status:</strong>
              ${question.isCorrect ? "Correct" : question.selectedAnswer === null ? "Not Answered" : "Incorrect"}
            </p>
          </div>
        </section>
      `;
    })
    .join("");

  const printWindow = window.open("", "_blank");

  if (!printWindow) {
    alert("PDF window blocked. Please allow pop-ups for this website and try again.");
    return;
  }

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <title>${escapeHtml(examTitle)} - Result</title>

        <style>
          * {
            box-sizing: border-box;
          }

          body {
            font-family: Arial, sans-serif;
            color: #1e293b;
            margin: 0;
            padding: 28px;
            line-height: 1.5;
          }

          .header {
            text-align: center;
            border-bottom: 2px solid #1e3a8a;
            padding-bottom: 18px;
            margin-bottom: 22px;
          }

          .academy {
            color: #1e3a8a;
            font-size: 25px;
            font-weight: 800;
            letter-spacing: 1px;
          }

          .subtitle {
            color: #64748b;
            font-size: 12px;
          }

          h1 {
            font-size: 21px;
            margin: 12px 0 4px;
          }

          .summary {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 10px;
            margin: 20px 0;
          }

          .summary-card {
            border: 1px solid #cbd5e1;
            border-radius: 8px;
            padding: 12px 8px;
            text-align: center;
          }

          .summary-card strong {
            display: block;
            font-size: 20px;
          }

          .summary-card span {
            color: #64748b;
            font-size: 11px;
          }

          .status {
            text-align: center;
            font-weight: bold;
            padding: 10px;
            border: 1px solid #cbd5e1;
            margin-bottom: 22px;
          }

          .question {
            border: 1px solid #cbd5e1;
            border-radius: 8px;
            padding: 15px;
            margin-bottom: 16px;
            page-break-inside: avoid;
          }

          .question-heading {
            display: flex;
            justify-content: space-between;
            border-bottom: 1px solid #e2e8f0;
            padding-bottom: 8px;
          }

          .question-text {
            font-weight: bold;
            white-space: pre-wrap;
            margin: 14px 0;
          }

          .option {
            padding: 8px 10px;
            margin: 6px 0;
            border: 1px solid #e2e8f0;
            border-radius: 5px;
            font-size: 13px;
            white-space: pre-wrap;
          }

          .correct {
            border-color: #16a34a;
            background: #f0fdf4;
            color: #166534;
          }

          .incorrect {
            border-color: #dc2626;
            background: #fef2f2;
            color: #991b1b;
          }

          .answer-summary {
            background: #f8fafc;
            padding: 8px 12px;
            margin-top: 12px;
            font-size: 12px;
          }

          .answer-summary p {
            margin: 4px 0;
          }

          .footer {
            text-align: center;
            color: #64748b;
            font-size: 11px;
            margin-top: 25px;
            border-top: 1px solid #cbd5e1;
            padding-top: 12px;
          }

          @media print {
            body {
              padding: 0;
            }

            .question {
              break-inside: avoid;
            }
          }

          @page {
            size: A4;
            margin: 15mm;
          }
        </style>
      </head>

      <body>
        <div class="header">
          <div class="academy">REMON ACADEMY</div>
          <div class="subtitle">Learn. Grow. Achieve.</div>
          <h1>${escapeHtml(examTitle)}</h1>
          <div class="subtitle">Examination Result & Answer Sheet</div>
        </div>

        <div class="summary">
          <div class="summary-card">
            <strong>${review.obtainedMarks}</strong>
            <span>Obtained Marks</span>
          </div>

          <div class="summary-card">
            <strong>${review.totalMarks}</strong>
            <span>Total Marks</span>
          </div>

          <div class="summary-card">
            <strong>${Number(review.percentage || 0).toFixed(2)}%</strong>
            <span>Percentage</span>
          </div>

          <div class="summary-card">
            <strong>${review.correctCount}</strong>
            <span>Correct Answers</span>
          </div>
        </div>

        <div class="status">
          RESULT: ${review.passed ? "PASSED" : "FAILED"}
          |
          Wrong: ${review.wrongCount}
          |
          Unanswered: ${review.unansweredCount}
        </div>

        <h2>Detailed Answer Review</h2>

        ${questionHTML}

        <div class="footer">
          REMON ACADEMY — Learn. Grow. Achieve.<br />
          Generated examination result sheet.
        </div>

        <script>
          window.onload = function () {
            window.setTimeout(function () {
              window.print();
            }, 500);
          };
        </script>
      </body>
    </html>
  `;

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
}

export default function StudentExams() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [attempt, setAttempt] = useState<Attempt | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [review, setReview] = useState<Review | null>(null);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const fetchExams = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await api.get("/exams/my");
      setExams(response.data.data || []);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchExams();
  }, []);

  const getCourseName = (course: Exam["course"]) =>
    typeof course === "string" ? course : course?.title || "Course";

  const getStatus = (exam: Exam) => {
    const now = Date.now();

    if (now < new Date(exam.startTime).getTime()) return "Upcoming";
    if (now > new Date(exam.endTime).getTime()) return "Ended";
    return "Available";
  };

  const loadReview = async (examId: string) => {
    setError("");

    try {
      const response = await api.get(`/exams/my/${examId}/review`);
      setReview(response.data.data);
      setSelectedExam(null);
      setAttempt(null);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const startExam = async (exam: Exam) => {
    setStarting(true);
    setError("");

    try {
      const response = await api.post(`/exams/my/${exam._id}/start`);
      const data = response.data.data;

      setSelectedExam(data.exam);
      setAttempt(data.attempt);
      setAnswers(data.attempt.answers || []);
      setReview(null);
      setCurrentQuestion(0);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setStarting(false);
    }
  };

  const saveAnswers = async (updatedAnswers: Answer[]) => {
    if (!attempt) return;

    setSaving(true);

    try {
      await api.put(`/exams/attempts/${attempt._id}/answers`, {
        answers: updatedAnswers,
      });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const submitExam = useCallback(async () => {
    if (!attempt || !selectedExam || submitting) return;

    setSubmitting(true);
    setError("");

    try {
      await api.post(`/exams/attempts/${attempt._id}/submit`, {
        answers,
      });

      await loadReview(selectedExam._id);
      await fetchExams();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }, [attempt, selectedExam, submitting, answers]);

  useEffect(() => {
    if (!attempt || !selectedExam) return;

    const updateTimer = () => {
      const remaining = Math.max(
        0,
        Math.ceil(
          (new Date(attempt.expiresAt).getTime() - Date.now()) / 1000
        )
      );

      setSecondsLeft(remaining);

      if (remaining <= 0) {
        void submitExam();
      }
    };

    updateTimer();
    const timer = window.setInterval(updateTimer, 1000);

    return () => window.clearInterval(timer);
  }, [attempt, selectedExam, submitExam]);

  const selectAnswer = (questionId: string, selectedAnswer: number) => {
    if (!attempt || attempt.status === "SUBMITTED") return;

    const updated = [
      ...answers.filter((answer) => answer.questionId !== questionId),
      { questionId, selectedAnswer },
    ];

    setAnswers(updated);
    void saveAnswers(updated);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
  };

  const resetToList = () => {
    setSelectedExam(null);
    setAttempt(null);
    setReview(null);
    setAnswers([]);
    setError("");
    void fetchExams();
  };

  const getSelectedAnswer = (questionId: string) =>
    answers.find((answer) => answer.questionId === questionId)
      ?.selectedAnswer;

  if (loading && !selectedExam && !review) {
    return (
      <div className="flex justify-center gap-3 py-20 text-slate-500">
        <Loader2 className="animate-spin" />
        Loading examinations...
      </div>
    );
  }

  return (
    <div className="space-y-6 text-slate-800">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-blue-600">
            <ClipboardCheck size={17} />
            REMON ACADEMY / EXAMINATION
          </div>

          <h1 className="text-3xl font-bold text-slate-900">
            {review
              ? "Exam Result"
              : selectedExam
                ? selectedExam.title
                : "My Examinations"}
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            {review
              ? "Your examination performance and answer review."
              : selectedExam
                ? "Read each question carefully and submit your answers."
                : "View and participate in your course examinations."}
          </p>
        </div>

        {(selectedExam || review) && (
          <button
            onClick={resetToList}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold"
          >
            <ArrowLeft size={16} />
            Back to Exams
          </button>
        )}

        {!selectedExam && !review && (
          <button
            onClick={() => void fetchExams()}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      {/* Exam List */}
      {!selectedExam && !review && (
        <>
          {exams.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white py-16 text-center">
              <ClipboardCheck
                size={40}
                className="mx-auto mb-3 text-slate-300"
              />
              <h2 className="font-bold">No examinations available</h2>
              <p className="mt-2 text-sm text-slate-500">
                Published examinations for your courses will appear here.
              </p>
            </div>
          ) : (
            <div className="grid gap-5 lg:grid-cols-2">
              {exams.map((exam) => {
                const status = getStatus(exam);
                const submitted = exam.attempt?.status === "SUBMITTED";

                return (
                  <div
                    key={exam._id}
                    className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="flex items-center gap-2 text-xs font-semibold text-blue-600">
                          <BookOpen size={14} />
                          {getCourseName(exam.course)}
                        </p>

                        <h2 className="mt-3 text-lg font-bold text-slate-900">
                          {exam.title}
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                          {exam.subject}
                        </p>
                      </div>

                      <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
                        {submitted ? "Submitted" : status}
                      </span>
                    </div>

                    {exam.description && (
                      <p className="mt-3 text-sm text-slate-500">
                        {exam.description}
                      </p>
                    )}

                    <div className="mt-5 grid grid-cols-2 gap-4 border-t border-slate-100 pt-4 sm:grid-cols-4">
                      <div>
                        <Clock size={16} className="mb-2 text-purple-600" />
                        <p className="font-bold">{exam.duration} min</p>
                        <p className="text-xs text-slate-500">Duration</p>
                      </div>

                      <div>
                        <ClipboardCheck
                          size={16}
                          className="mb-2 text-blue-600"
                        />
                        <p className="font-bold">{exam.totalMarks}</p>
                        <p className="text-xs text-slate-500">Total Marks</p>
                      </div>

                      <div>
                        <CheckCircle2
                          size={16}
                          className="mb-2 text-emerald-600"
                        />
                        <p className="font-bold">{exam.passMarks}</p>
                        <p className="text-xs text-slate-500">Pass Marks</p>
                      </div>

                      <div>
                        <CalendarDays
                          size={16}
                          className="mb-2 text-amber-600"
                        />
                        <p className="font-bold text-sm">
                          {new Date(exam.startTime).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-slate-500">Exam Date</p>
                      </div>
                    </div>

                    <div className="mt-4 border-t border-slate-100 pt-4 text-xs text-slate-500">
                      Starts: {new Date(exam.startTime).toLocaleString()}
                    </div>

                    <div className="mt-5">
                      {submitted ? (
                        <button
                          onClick={() => void loadReview(exam._id)}
                          className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 font-semibold text-white hover:bg-emerald-700"
                        >
                          <Trophy size={17} />
                          View Result & Answers
                        </button>
                      ) : (
                        <button
                          disabled={status !== "Available" || starting}
                          onClick={() => void startExam(exam)}
                          className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                        >
                          {starting ? (
                            <Loader2 className="animate-spin" size={17} />
                          ) : (
                            <ClipboardCheck size={17} />
                          )}

                          {status === "Upcoming"
                            ? "Not Started Yet"
                            : status === "Ended"
                              ? "Exam Ended"
                              : "Start Examination"}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* Active Exam */}
      {selectedExam && attempt && (
        <div className="space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5">
            <div>
              <p className="text-sm text-slate-500">Time Remaining</p>
              <p
                className={`mt-1 text-3xl font-black tabular-nums ${
                  secondsLeft <= 60 ? "text-red-600" : "text-blue-700"
                }`}
              >
                {formatTime(secondsLeft)}
              </p>
            </div>

            <div className="text-right">
              <p className="text-sm text-slate-500">Answered</p>
              <p className="mt-1 text-2xl font-bold">
                {answers.length}/{selectedExam.questions.length}
              </p>
              <p className="mt-1 text-xs text-slate-400">
                {saving ? "Saving answers..." : "Answers saved"}
              </p>
            </div>
          </div>

          <div className="grid gap-5 lg:grid-cols-[1fr_260px]">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7">
              {selectedExam.questions[currentQuestion] && (
                <>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <span className="rounded-lg bg-blue-50 px-3 py-2 text-sm font-bold text-blue-700">
                      Question {currentQuestion + 1} of{" "}
                      {selectedExam.questions.length}
                    </span>

                    <span className="text-sm font-semibold text-slate-500">
                      {selectedExam.questions[currentQuestion].marks} Marks
                    </span>
                  </div>

                  <h2 className="mt-7 whitespace-pre-wrap text-lg font-bold leading-relaxed text-slate-900">
                    {selectedExam.questions[currentQuestion].question}
                  </h2>

                  <div className="mt-6 space-y-3">
                    {selectedExam.questions[currentQuestion].options.map(
                      (option, index) => {
                        const selected =
                          getSelectedAnswer(
                            selectedExam.questions[currentQuestion]._id
                          ) === index;

                        return (
                          <button
                            key={index}
                            onClick={() =>
                              selectAnswer(
                                selectedExam.questions[currentQuestion]._id,
                                index
                              )
                            }
                            className={`flex w-full items-center gap-3 rounded-xl border p-4 text-left transition ${
                              selected
                                ? "border-blue-500 bg-blue-50 text-blue-800"
                                : "border-slate-200 hover:border-blue-300 hover:bg-slate-50"
                            }`}
                          >
                            <span
                              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                                selected
                                  ? "bg-blue-600 text-white"
                                  : "bg-slate-100 text-slate-600"
                              }`}
                            >
                              {String.fromCharCode(65 + index)}
                            </span>

                            <span className="font-medium">{option}</span>
                          </button>
                        );
                      }
                    )}
                  </div>

                  <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-5">
                    <button
                      disabled={currentQuestion === 0}
                      onClick={() =>
                        setCurrentQuestion((value) => value - 1)
                      }
                      className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold disabled:opacity-40"
                    >
                      <ArrowLeft size={16} />
                      Previous
                    </button>

                    <button
                      disabled={
                        currentQuestion === selectedExam.questions.length - 1
                      }
                      onClick={() =>
                        setCurrentQuestion((value) => value + 1)
                      }
                      className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white disabled:opacity-40"
                    >
                      Next
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </>
              )}
            </div>

            <div className="space-y-5">
              <div className="rounded-2xl border border-slate-200 bg-white p-5">
                <h3 className="font-bold text-slate-900">
                  Question Navigator
                </h3>

                <div className="mt-4 grid grid-cols-5 gap-2">
                  {selectedExam.questions.map((question, index) => {
                    const answered =
                      getSelectedAnswer(question._id) !== undefined;

                    return (
                      <button
                        key={question._id}
                        onClick={() => setCurrentQuestion(index)}
                        className={`h-10 rounded-lg text-sm font-bold ${
                          currentQuestion === index
                            ? "bg-blue-600 text-white"
                            : answered
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {index + 1}
                      </button>
                    );
                  })}
                </div>

                <div className="mt-4 space-y-2 text-xs text-slate-500">
                  <p>Blue: Current question</p>
                  <p>Green: Answered</p>
                  <p>Grey: Not answered</p>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5">
                <h3 className="font-bold">Submit Examination</h3>

                <p className="mt-2 text-sm text-slate-500">
                  Once submitted, you cannot change your answers.
                </p>

                <button
                  disabled={submitting}
                  onClick={() => {
                    if (
                      window.confirm(
                        "Are you sure you want to submit your examination?"
                      )
                    ) {
                      void submitExam();
                    }
                  }}
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 font-bold text-white hover:bg-emerald-700 disabled:opacity-50"
                >
                  {submitting ? (
                    <Loader2 className="animate-spin" size={17} />
                  ) : (
                    <Send size={17} />
                  )}
                  Submit Exam
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Result and Answer Review */}
      {review && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <div className="flex flex-wrap items-center justify-between gap-5">
              <div>
                <p className="text-sm font-semibold text-slate-500">
                  Your Score
                </p>

                <h2 className="mt-2 text-4xl font-black text-slate-900">
                  {review.obtainedMarks} / {review.totalMarks}
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  {Number(review.percentage || 0).toFixed(2)}% obtained
                </p>
              </div>

              <div
                className={`rounded-2xl px-6 py-4 text-center ${
                  review.passed
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-red-50 text-red-700"
                }`}
              >
                {review.passed ? (
                  <CheckCircle2 size={30} className="mx-auto" />
                ) : (
                  <XCircle size={30} className="mx-auto" />
                )}

                <p className="mt-2 font-black">
                  {review.passed ? "PASSED" : "FAILED"}
                </p>
              </div>
            </div>

            <div className="mt-7 grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-2xl font-bold">{review.correctCount}</p>
                <p className="text-xs text-slate-500">Correct</p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-2xl font-bold">{review.wrongCount}</p>
                <p className="text-xs text-slate-500">Wrong</p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-2xl font-bold">
                  {review.unansweredCount}
                </p>
                <p className="text-xs text-slate-500">Unanswered</p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-2xl font-bold">
                  {Number(review.percentage || 0).toFixed(0)}%
                </p>
                <p className="text-xs text-slate-500">Percentage</p>
              </div>
            </div>

            {/* Download PDF */}
            <button
              onClick={() => downloadResultPDF(review)}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-bold text-white transition hover:bg-blue-700 sm:w-auto"
            >
              <Download size={18} />
              Download Result PDF
            </button>
          </div>

          <div>
            <h2 className="mb-4 text-xl font-bold text-slate-900">
              Answer Review
            </h2>

            <div className="space-y-4">
              {review.questions?.map((question, index) => (
                <div
                  key={question.questionId}
                  className="rounded-2xl border border-slate-200 bg-white p-5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="font-bold">Question {index + 1}</p>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${
                        question.isCorrect
                          ? "bg-emerald-50 text-emerald-700"
                          : question.selectedAnswer === null
                            ? "bg-slate-100 text-slate-600"
                            : "bg-red-50 text-red-700"
                      }`}
                    >
                      {question.isCorrect
                        ? "Correct"
                        : question.selectedAnswer === null
                          ? "Not Answered"
                          : "Incorrect"}
                    </span>
                  </div>

                  <p className="mt-4 whitespace-pre-wrap font-semibold text-slate-900">
                    {question.question}
                  </p>

                  <div className="mt-4 space-y-2">
                    {question.options.map((option, optionIndex) => {
                      const isCorrect =
                        optionIndex === question.correctAnswer;

                      const isSelected =
                        optionIndex === question.selectedAnswer;

                      return (
                        <div
                          key={optionIndex}
                          className={`rounded-lg border p-3 text-sm ${
                            isCorrect
                              ? "border-emerald-300 bg-emerald-50 text-emerald-800"
                              : isSelected
                                ? "border-red-300 bg-red-50 text-red-800"
                                : "border-slate-100 text-slate-600"
                          }`}
                        >
                          <span className="mr-2 font-bold">
                            {String.fromCharCode(65 + optionIndex)}.
                          </span>

                          {option}

                          {isCorrect && (
                            <span className="ml-2 font-bold">
                              (Correct Answer)
                            </span>
                          )}

                          {isSelected && !isCorrect && (
                            <span className="ml-2 font-bold">
                              (Your Answer)
                            </span>
                          )}
                        </div>
                      );
                    })}
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
