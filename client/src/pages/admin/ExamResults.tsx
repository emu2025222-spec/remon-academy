
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Download,
  Loader2,
  RefreshCw,
  Trophy,
  Users,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { api, getErrorMessage } from "../../services/api";

interface Exam {
  _id: string;
  title: string;
  subject: string;
  totalMarks: number;
  passMarks: number;
}

interface ExamResult {
  _id: string;
  student?: {
    fullName?: string;
    studentId?: string;
    user?: {
      email?: string;
    };
  };
  obtainedMarks?: number;
  totalMarks?: number;
  correctCount?: number;
  wrongCount?: number;
  unansweredCount?: number;
  status?: string;
  submittedAt?: string;
}

export default function ExamResults() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [selectedExam, setSelectedExam] = useState("");
  const [results, setResults] = useState<ExamResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchExams = async () => {
    setError("");
    setInitialLoading(true);

    try {
      const response = await api.get("/exams");
      const data = response.data.data;
      const list = Array.isArray(data) ? data : data?.exams || [];
      setExams(list);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setInitialLoading(false);
    }
  };

  const fetchResults = async (examId: string) => {
    if (!examId) return;

    setLoading(true);
    setError("");
    setResults([]);

    try {
      const response = await api.get(`/exams/${examId}/results`);
      const data = response.data.data;

      const list = Array.isArray(data)
        ? data
        : data?.results || data?.attempts || [];

      setResults(list);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchExams();
  }, []);

  useEffect(() => {
    if (selectedExam) {
      void fetchResults(selectedExam);
    } else {
      setResults([]);
    }
  }, [selectedExam]);

  const exam = exams.find((item) => item._id === selectedExam);

  const getStudentName = (result: ExamResult) =>
    result.student?.fullName || "Student";

  const getStudentId = (result: ExamResult) =>
    result.student?.studentId || "—";

  const getPercentage = (result: ExamResult) => {
    const total = result.totalMarks || exam?.totalMarks || 0;
    if (!total) return 0;
    return ((result.obtainedMarks || 0) / total) * 100;
  };

  const isPassed = (result: ExamResult) =>
    (result.obtainedMarks || 0) >= (exam?.passMarks || 0);

  const printResults = () => {
    window.print();
  };

  const passedCount = results.filter(isPassed).length;
  const failedCount = results.length - passedCount;
  const average =
    results.length > 0
      ? results.reduce((sum, item) => sum + getPercentage(item), 0) /
        results.length
      : 0;

  if (initialLoading) {
    return (
      <div className="flex justify-center gap-3 py-20 text-slate-500">
        <Loader2 className="animate-spin" />
        Loading exams...
      </div>
    );
  }

  return (
    <div className="space-y-6 text-slate-800">
      <style>
        {`
          @media print {
            body * {
              visibility: hidden !important;
            }
            #exam-results-print,
            #exam-results-print * {
              visibility: visible !important;
            }
            #exam-results-print {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              padding: 20px;
              color: #111 !important;
              background: white !important;
            }
            .no-print {
              display: none !important;
            }
            table {
              width: 100%;
              border-collapse: collapse;
            }
            th, td {
              border: 1px solid #999 !important;
              padding: 8px !important;
              color: #111 !important;
            }
          }
        `}
      </style>

      <div className="no-print flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-blue-600">
            <Trophy size={17} />
            REMON ACADEMY / RESULTS
          </p>
          <h1 className="text-3xl font-bold text-slate-900">
            Exam Results Dashboard
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            View student performance and download result sheets.
          </p>
        </div>

        <button
          onClick={() => void fetchResults(selectedExam)}
          disabled={!selectedExam || loading}
          className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold disabled:opacity-40"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      <div className="no-print rounded-2xl border border-slate-200 bg-white p-5">
        <label className="mb-2 block text-sm font-semibold">
          Select Examination
        </label>

        <select
          value={selectedExam}
          onChange={(event) => setSelectedExam(event.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-white p-3 outline-none focus:border-blue-500"
        >
          <option value="">Choose an examination</option>
          {exams.map((item) => (
            <option key={item._id} value={item._id}>
              {item.title} — {item.subject}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <div className="no-print rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {selectedExam && (
        <div id="exam-results-print" className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              REMON ACADEMY
            </h2>
            <p className="mt-1 text-lg font-semibold">
              {exam?.title || "Examination Results"}
            </p>
            <p className="text-sm text-slate-500">
              Subject: {exam?.subject} | Total Marks: {exam?.totalMarks} |
              Pass Marks: {exam?.passMarks}
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center gap-3 py-16 text-slate-500">
              <Loader2 className="animate-spin" />
              Loading results...
            </div>
          ) : (
            <>
              <div className="no-print grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div className="rounded-xl border border-slate-200 bg-white p-4">
                  <Users className="mb-2 text-blue-600" />
                  <p className="text-2xl font-bold">{results.length}</p>
                  <p className="text-xs text-slate-500">Total Students</p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-4">
                  <CheckCircle2 className="mb-2 text-emerald-600" />
                  <p className="text-2xl font-bold">{passedCount}</p>
                  <p className="text-xs text-slate-500">Passed</p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-4">
                  <XCircle className="mb-2 text-red-600" />
                  <p className="text-2xl font-bold">{failedCount}</p>
                  <p className="text-xs text-slate-500">Failed</p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-4">
                  <Trophy className="mb-2 text-amber-600" />
                  <p className="text-2xl font-bold">
                    {average.toFixed(1)}%
                  </p>
                  <p className="text-xs text-slate-500">Average</p>
                </div>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
                <table className="w-full min-w-[650px] text-left text-sm">
                  <thead className="bg-slate-100">
                    <tr>
                      <th className="p-4">#</th>
                      <th className="p-4">Student Name</th>
                      <th className="p-4">Student ID</th>
                      <th className="p-4">Marks</th>
                      <th className="p-4">Percentage</th>
                      <th className="p-4">Correct</th>
                      <th className="p-4">Wrong</th>
                      <th className="p-4">Result</th>
                    </tr>
                  </thead>

                  <tbody>
                    {results.map((result, index) => (
                      <tr key={result._id} className="border-t border-slate-100">
                        <td className="p-4">{index + 1}</td>
                        <td className="p-4 font-semibold">
                          {getStudentName(result)}
                        </td>
                        <td className="p-4">{getStudentId(result)}</td>
                        <td className="p-4 font-bold">
                          {result.obtainedMarks ?? 0}/
                          {result.totalMarks ?? exam?.totalMarks ?? 0}
                        </td>
                        <td className="p-4">
                          {getPercentage(result).toFixed(1)}%
                        </td>
                        <td className="p-4">{result.correctCount ?? "—"}</td>
                        <td className="p-4">{result.wrongCount ?? "—"}</td>
                        <td className="p-4">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-bold ${
                              isPassed(result)
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-red-50 text-red-700"
                            }`}
                          >
                            {isPassed(result) ? "PASS" : "FAIL"}
                          </span>
                        </td>
                      </tr>
                    ))}

                    {results.length === 0 && (
                      <tr>
                        <td
                          colSpan={8}
                          className="p-10 text-center text-slate-500"
                        >
                          No submitted results found for this examination.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <p className="text-xs text-slate-500">
                Generated from REMON Academy Examination System.
              </p>
            </>
          )}
        </div>
      )}

      {selectedExam && !loading && (
        <div className="no-print flex flex-wrap gap-3">
          <button
            onClick={printResults}
            disabled={results.length === 0}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white disabled:opacity-40"
          >
            <Download size={17} />
            Print / Save Result PDF
          </button>
        </div>
      )}
    </div>
  );
}
