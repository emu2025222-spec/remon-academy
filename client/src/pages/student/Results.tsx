import { useEffect, useState } from "react";
import {
  Award,
  BarChart3,
  CalendarDays,
  CheckCircle2,
  GraduationCap,
  TrendingUp,
  Trophy,
} from "lucide-react";

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

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="space-y-8 pb-10">
      {/* =====================================================
          HEADER
      ===================================================== */}
      <section className="relative overflow-hidden rounded-3xl bg-brand-navyDark px-6 py-8 text-white sm:px-8 sm:py-10">
        <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full border border-brand-goldLight/10" />

        <div className="absolute -bottom-24 right-24 h-64 w-64 rounded-full border border-brand-goldLight/10" />

        <div className="relative z-10">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-brand-goldLight">
            <Award className="h-3.5 w-3.5" />
            Academic Performance
          </div>

          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
                My Results
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-white/65">
                Review your published examination results,
                grades and academic performance.
              </p>
            </div>

            <div className="w-fit rounded-2xl border border-white/10 bg-white/5 px-5 py-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/45">
                Average GPA
              </p>

              <div className="mt-1 flex items-center gap-2">
                <Trophy className="h-4 w-4 text-brand-goldLight" />

                <span className="font-display text-2xl font-semibold text-brand-goldLight">
                  {averageGpa}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {results.length === 0 ? (
        <div className="card-premium p-8">
          <EmptyState message="No results published yet." />
        </div>
      ) : (
        <>
          {/* =================================================
              PERFORMANCE OVERVIEW
          ================================================= */}
          <section>
            <div className="mb-5">
              <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-brand-gold">
                <BarChart3 className="h-4 w-4" />
                Performance Overview
              </div>

              <h2 className="mt-2 font-display text-xl font-semibold text-slate-900 dark:text-white">
                Your academic performance
              </h2>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                A summary of your published examination results.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {/* GPA */}
              <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/40">
                <div className="absolute right-0 top-0 h-24 w-24 rounded-bl-full bg-brand-goldLight/10" />

                <div className="relative">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-goldLight/15 text-brand-gold">
                    <Trophy className="h-5 w-5" />
                  </div>

                  <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                    Average GPA
                  </p>

                  <p className="mt-1 font-display text-3xl font-semibold text-slate-900 dark:text-white">
                    {averageGpa}
                  </p>

                  <p className="mt-2 text-xs text-slate-400">
                    Across published results
                  </p>
                </div>
              </div>

              {/* Exams */}
              <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/40">
                <div className="absolute right-0 top-0 h-24 w-24 rounded-bl-full bg-brand-navy/5 dark:bg-brand-goldLight/5" />

                <div className="relative">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-navy/10 text-brand-navy dark:bg-brand-goldLight/10 dark:text-brand-goldLight">
                    <GraduationCap className="h-5 w-5" />
                  </div>

                  <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                    Exams
                  </p>

                  <p className="mt-1 font-display text-3xl font-semibold text-slate-900 dark:text-white">
                    {exams.length}
                  </p>

                  <p className="mt-2 text-xs text-slate-400">
                    Published examinations
                  </p>
                </div>
              </div>

              {/* Subjects */}
              <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/40">
                <div className="absolute right-0 top-0 h-24 w-24 rounded-bl-full bg-emerald-500/5" />

                <div className="relative">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                    <TrendingUp className="h-5 w-5" />
                  </div>

                  <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                    Subjects
                  </p>

                  <p className="mt-1 font-display text-3xl font-semibold text-slate-900 dark:text-white">
                    {results.length}
                  </p>

                  <p className="mt-2 text-xs text-slate-400">
                    Published subject results
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* =================================================
              EXAM SUMMARY
          ================================================= */}
          {exams.length > 0 && (
            <section>
              <div className="mb-5">
                <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-brand-gold">
                  <Award className="h-4 w-4" />
                  Examination Summary
                </div>

                <h2 className="mt-2 font-display text-xl font-semibold text-slate-900 dark:text-white">
                  Exam performance
                </h2>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Performance breakdown for each published examination.
                </p>
              </div>

              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {exams.map((exam) => {
                  const percentage =
                    exam.totalMarks > 0
                      ? Math.round(
                          (exam.obtainedMarks /
                            exam.totalMarks) *
                            100
                        )
                      : 0;

                  return (
                    <div
                      key={exam.examName}
                      className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-brand-goldLight/60 hover:shadow-md dark:border-slate-800 dark:bg-slate-900/40"
                    >
                      <div className="absolute left-0 top-0 h-full w-1 bg-brand-goldLight" />

                      <div className="pl-2">
                        <div className="flex items-start justify-between gap-4">
                          <div className="min-w-0">
                            <h3 className="font-display text-lg font-semibold text-slate-900 dark:text-white">
                              {exam.examName}
                            </h3>

                            <p className="mt-1 text-xs text-slate-400">
                              {exam.subjectCount}{" "}
                              {exam.subjectCount === 1
                                ? "Subject"
                                : "Subjects"}
                            </p>
                          </div>

                          <div className="shrink-0 rounded-full bg-brand-goldLight/15 px-3 py-1 text-xs font-bold text-brand-gold">
                            GPA {exam.averageGpa}
                          </div>
                        </div>

                        <div className="mt-6">
                          <div className="mb-2 flex items-center justify-between">
                            <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
                              Score
                            </span>

                            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                              {percentage}%
                            </span>
                          </div>

                          <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                            <div
                              className="h-full rounded-full bg-brand-goldLight transition-all"
                              style={{
                                width: `${Math.min(
                                  percentage,
                                  100
                                )}%`,
                              }}
                            />
                          </div>
                        </div>

                        <div className="mt-5 grid grid-cols-2 gap-3">
                          <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/50">
                            <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400">
                              Obtained
                            </p>

                            <p className="mt-1 font-display text-lg font-semibold text-slate-900 dark:text-white">
                              {exam.obtainedMarks}
                            </p>
                          </div>

                          <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/50">
                            <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400">
                              Total
                            </p>

                            <p className="mt-1 font-display text-lg font-semibold text-slate-900 dark:text-white">
                              {exam.totalMarks}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* =================================================
              RESULT RECORDS
          ================================================= */}
          <section>
            <div className="mb-5">
              <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-brand-gold">
                <CheckCircle2 className="h-4 w-4" />
                Published Results
              </div>

              <h2 className="mt-2 font-display text-xl font-semibold text-slate-900 dark:text-white">
                Result Records
              </h2>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                All published subject-wise examination results.
              </p>
            </div>

            {/* Desktop Table */}
            <div className="hidden overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900/40 md:block">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 dark:bg-slate-800/60">
                    <tr className="text-left text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
                      <th className="px-5 py-4">
                        Exam
                      </th>

                      <th className="px-5 py-4">
                        Subject
                      </th>

                      <th className="px-5 py-4">
                        Marks
                      </th>

                      <th className="px-5 py-4">
                        Grade
                      </th>

                      <th className="px-5 py-4">
                        GPA
                      </th>

                      <th className="px-5 py-4">
                        Date
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {results.map((result) => (
                      <tr
                        key={result._id}
                        className="border-t border-slate-100 transition hover:bg-slate-50/70 dark:border-slate-800 dark:hover:bg-slate-800/30"
                      >
                        <td className="px-5 py-4 font-semibold text-slate-800 dark:text-slate-200">
                          {result.examName}
                        </td>

                        <td className="px-5 py-4 text-slate-600 dark:text-slate-400">
                          {result.subject}
                        </td>

                        <td className="px-5 py-4">
                          <span className="font-semibold text-slate-800 dark:text-slate-200">
                            {result.obtainedMarks}
                          </span>

                          <span className="text-slate-400">
                            /
                          </span>

                          <span className="text-slate-500 dark:text-slate-400">
                            {result.totalMarks}
                          </span>
                        </td>

                        <td className="px-5 py-4">
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

                        <td className="px-5 py-4 font-bold text-slate-800 dark:text-slate-200">
                          {result.gpa}
                        </td>

                        <td className="px-5 py-4 text-slate-500 dark:text-slate-400">
                          <span className="inline-flex items-center gap-1.5">
                            <CalendarDays className="h-3.5 w-3.5 text-slate-400" />

                            {new Date(
                              result.examDate
                            ).toLocaleDateString("en-BD", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile Cards */}
            <div className="space-y-4 md:hidden">
              {results.map((result, index) => (
                <div
                  key={result._id}
                  className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/40"
                >
                  <div className="absolute left-0 top-0 h-full w-1 bg-brand-goldLight" />

                  <div className="pl-2">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex min-w-0 gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-goldLight/15 text-brand-gold">
                          <span className="font-display text-xs font-bold">
                            {String(index + 1).padStart(
                              2,
                              "0"
                            )}
                          </span>
                        </div>

                        <div className="min-w-0">
                          <h3 className="truncate font-display text-base font-semibold text-slate-900 dark:text-white">
                            {result.subject}
                          </h3>

                          <p className="mt-1 text-xs text-slate-400">
                            {result.examName}
                          </p>
                        </div>
                      </div>

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
                    </div>

                    <div className="mt-5 grid grid-cols-2 gap-3">
                      <div className="rounded-2xl bg-slate-50 p-3 dark:bg-slate-800/50">
                        <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400">
                          Marks
                        </p>

                        <p className="mt-1 font-semibold text-slate-900 dark:text-white">
                          {result.obtainedMarks}/
                          {result.totalMarks}
                        </p>
                      </div>

                      <div className="rounded-2xl bg-slate-50 p-3 dark:bg-slate-800/50">
                        <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400">
                          GPA
                        </p>

                        <p className="mt-1 font-semibold text-slate-900 dark:text-white">
                          {result.gpa}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center gap-2 border-t border-slate-100 pt-4 text-xs text-slate-400 dark:border-slate-800">
                      <CalendarDays className="h-3.5 w-3.5" />

                      {new Date(
                        result.examDate
                      ).toLocaleDateString("en-BD", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* =================================================
              FOOTER INFO
          ================================================= */}
          <section className="rounded-3xl border border-slate-200 bg-slate-50/70 px-6 py-6 dark:border-slate-800 dark:bg-slate-900/30">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-navyDark text-brand-goldLight">
                <Award className="h-5 w-5" />
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  Keep improving.
                </p>

                <p className="mt-1 max-w-2xl text-xs leading-5 text-slate-400">
                  Results shown here are published by the academy.
                  If you find any discrepancy in your result,
                  please contact the academy administration.
                </p>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
}

