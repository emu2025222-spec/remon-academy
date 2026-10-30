import { useMemo, useState } from "react";
import { Download, FileDown, Users } from "lucide-react";

import {
  ResultPdfRecord,
  downloadAllStudentMarksheetsPdf,
  downloadStudentMarksheetPdf,
  getResultStudentGroups,
} from "../utils/resultPdf";

interface Props {
  mode: "student" | "admin";
  results: ResultPdfRecord[];
}

export function ResultsPdfActions({
  mode,
  results,
}: Props) {
  const [selectedStudent, setSelectedStudent] =
    useState("");

  const students = useMemo(
    () => getResultStudentGroups(results),
    [results]
  );

  if (mode === "student") {
    if (!results.length) {
      return null;
    }

    return (
      <div className="flex flex-wrap items-center justify-end gap-3">
        <button
          type="button"
          onClick={() =>
            downloadStudentMarksheetPdf(results)
          }
          className="inline-flex items-center gap-2 rounded-xl bg-brand-navyDark px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-slate-800"
        >
          <FileDown className="h-4 w-4 text-brand-goldLight" />
          Download My Complete Marksheet
        </button>
      </div>
    );
  }

  if (!results.length) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-900/40">
        No result records available for PDF generation.
      </div>
    );
  }

  const selectedGroup = students.find(
    (student) => student.id === selectedStudent
  );

  return (
    <section className="card space-y-4 p-5">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-goldLight/15 text-brand-gold">
          <FileDown className="h-5 w-5" />
        </div>

        <div>
          <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white">
            PDF Marksheet Center
          </h3>

          <p className="text-xs text-slate-500 dark:text-slate-400">
            {students.length} students · {results.length} result records
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <button
          type="button"
          onClick={() =>
            downloadAllStudentMarksheetsPdf(results)
          }
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-navyDark px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800"
        >
          <Users className="h-4 w-4 text-brand-goldLight" />
          Download All Students PDF
        </button>

        <div className="flex min-w-0 flex-1 flex-col gap-2 sm:flex-row">
          <select
            value={selectedStudent}
            onChange={(event) =>
              setSelectedStudent(event.target.value)
            }
            className="input-field min-w-0 flex-1"
          >
            <option value="">
              Select a student
            </option>

            {students.map((student) => (
              <option
                key={student.id}
                value={student.id}
              >
                {student.name} ({student.studentId})
              </option>
            ))}
          </select>

          <button
            type="button"
            disabled={!selectedGroup}
            onClick={() => {
              if (selectedGroup) {
                downloadStudentMarksheetPdf(
                  selectedGroup.records
                );
              }
            }}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <Download className="h-4 w-4" />
            Individual PDF
          </button>
        </div>
      </div>

      <p className="text-xs leading-5 text-slate-500 dark:text-slate-400">
        Combined PDF contains a separate marksheet for each student.
        Current Result History filters will apply to these downloads.
        Clear filters to include every student's result.
      </p>
    </section>
  );
}