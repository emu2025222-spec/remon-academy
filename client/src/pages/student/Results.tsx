import { useEffect, useState } from "react";
import { api, getErrorMessage } from "../../services/api";
import { Result } from "../../types";
import { Loader } from "../../components/Loader";
import { EmptyState } from "../../components/EmptyState";
import { Badge } from "../../components/Badge";
import { useToast } from "../../components/Toast";

interface ExamSummary {
  examName: string;
  subjectCount: number;
  averageGpa: number;
  totalMarks: number;
  obtainedMarks: number;
}

export default function StudentResults() {
  const [results, setResults] = useState<Result[]>([]);
  const [averageGpa, setAverageGpa] = useState(0);
  const [exams, setExams] = useState<ExamSummary[]>([]);
  const [loading, setLoading] = useState(true);

  const { show } = useToast();

  useEffect(() => {
    api
      .get("/results/my")
      .then((r) => {
        const data = r.data.data;

        setResults(data.results || []);
        setAverageGpa(data.averageGpa || 0);
        setExams(data.exams || []);

        setLoading(false);
      })
      .catch((err) => {
        show(getErrorMessage(err), "error");
        setLoading(false);
      });
  }, [show]);

  if (loading) return <Loader />;

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white">
            My Results
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Your published examination results.
          </p>
        </div>

        <div className="rounded-xl bg-brand-navy/10 px-4 py-2 text-sm font-semibold text-brand-navy dark:bg-brand-gold/10 dark:text-brand-goldLight">
          Average GPA: {averageGpa}
        </div>
      </div>

      {results.length === 0 ? (
        <EmptyState message="No results published yet." />
      ) : (
        <>
          {/* Exam Summary */}
          {exams.length > 0 && (
            <div className="mb-6">
              <h3 className="mb-4 font-display text-lg font-semibold text-slate-900 dark:text-white">
                Exam Summary
              </h3>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {exams.map((exam) => (
                  <div
                    key={exam.examName}
                    className="card p-5"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-900 dark:text-white">
                          {exam.examName}
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          {exam.subjectCount}{" "}
                          {exam.subjectCount === 1
                            ? "Subject"
                            : "Subjects"}
                        </p>
                      </div>

                      <span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                        GPA {exam.averageGpa}
                      </span>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800/50">
                        <p className="text-xs text-slate-400">
                          Obtained
                        </p>

                        <p className="mt-1 font-semibold text-slate-900 dark:text-white">
                          {exam.obtainedMarks}
                        </p>
                      </div>

                      <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800/50">
                        <p className="text-xs text-slate-400">
                          Total
                        </p>

                        <p className="mt-1 font-semibold text-slate-900 dark:text-white">
                          {exam.totalMarks}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Result Records */}
          <div className="card overflow-x-auto p-0">
            <div className="border-b border-slate-100 px-6 py-4 dark:border-slate-800">
              <h3 className="font-display text-lg font-semibold text-slate-900 dark:text-white">
                Result Records
              </h3>

              <p className="mt-1 text-xs text-slate-400">
                All published subject-wise results.
              </p>
            </div>

            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-left text-xs uppercase text-slate-400 dark:bg-slate-800/50">
                <tr>
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
                </tr>
              </thead>

              <tbody>
                {results.map((result) => (
                  <tr
                    key={result._id}
                    className="border-t border-slate-100 dark:border-slate-800"
                  >
                    <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200">
                      {result.examName}
                    </td>

                    <td className="px-4 py-3">
                      {result.subject}
                    </td>

                    <td className="px-4 py-3">
                      {result.obtainedMarks}/
                      {result.totalMarks}
                    </td>

                    <td className="px-4 py-3">
                      <Badge
                        color={
                          result.gpa >= 4
                            ? "green"
                            : result.gpa >= 3
                            ? "gold"
                            : "red"
                        }
                      >
                        {result.grade}
                      </Badge>
                    </td>

                    <td className="px-4 py-3 font-semibold">
                      {result.gpa}
                    </td>

                    <td className="px-4 py-3">
                      {new Date(
                        result.examDate
                      ).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}