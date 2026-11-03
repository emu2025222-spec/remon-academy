
import { useState } from "react";
import { FileText, Download, Users, User } from "lucide-react";

import { api } from "../services/api";
import type { ResultPdfRecord } from "../utils/resultPdf";

import {
  downloadStudentMarksheetPdf,
  downloadAllStudentMarksheetsPdf,
} from "../utils/resultPdf";

import {
  downloadAdminCombinedReport,
} from "../utils/adminCombinedReportPdf";

interface Props {
  mode: "student" | "admin";
  results: ResultPdfRecord[];
}

export default function ResultsPdfActions({
  mode,
  results,
}: Props) {
  const [loading, setLoading] = useState(false);

  const [selectedStudent, setSelectedStudent] =
    useState("");

  const students = Array.from(
    new Map(
      results.map((result) => {
        const student = result.student as any;

        const id =
          typeof student === "object"
            ? student?._id || student?.studentId
            : student;

        const name =
          typeof student === "object"
            ? student?.fullName || "Unknown Student"
            : "Unknown Student";

        return [String(id || ""), { id: String(id || ""), name }];
      })
    ).values()
  );

  const selectedResults = selectedStudent
    ? results.filter((result) => {
        const student = result.student as any;

        const id =
          typeof student === "object"
            ? student?._id || student?.studentId
            : student;

        return String(id || "") === selectedStudent;
      })
    : [];

  async function handleCombinedReport() {
    if (loading) return;

    setLoading(true);

    try {
      const [feeResponse, paymentResponse] =
        await Promise.all([
          api.get("/fees", {
            params: {
              page: 1,
              limit: 1000,
            },
          }),
          api.get("/fees/payment-requests"),
        ]);

      const feePayload = feeResponse.data?.data;

      const fees = Array.isArray(feePayload)
        ? feePayload
        : Array.isArray(feePayload?.data)
        ? feePayload.data
        : [];

      const paymentPayload = paymentResponse.data?.data;

      const paymentRequests = Array.isArray(paymentPayload)
        ? paymentPayload
        : Array.isArray(paymentPayload?.data)
        ? paymentPayload.data
        : [];

      downloadAdminCombinedReport({
        results,
        fees,
        paymentRequests,
      });
    } catch (error) {
      console.error("Combined report error:", error);
      window.alert(
        "Could not load fee or payment information. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  // Student PDF: keep the existing individual marksheet action.
  if (mode === "student") {
    return (
      <button
        type="button"
        onClick={() => downloadStudentMarksheetPdf(results)}
        disabled={!results.length}
        className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-slate-950"
      >
        <Download className="h-4 w-4" />
        Download My Complete Marksheet
      </button>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => downloadAllStudentMarksheetsPdf(results)}
          disabled={!results.length}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
        >
          <Users className="h-4 w-4" />
          Download All Marksheets
        </button>

        <button
          type="button"
          onClick={handleCombinedReport}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-slate-950"
        >
          <FileText className="h-4 w-4" />
          {loading ? "Preparing Report..." : "Download Combined Report PDF"}
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <select
          value={selectedStudent}
          onChange={(event) =>
            setSelectedStudent(event.target.value)
          }
          className="min-w-[220px] rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
        >
          <option value="">Select a student for individual PDF</option>

          {students.map((student) => (
            <option key={student.id} value={student.id}>
              {student.name}
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={() =>
            downloadStudentMarksheetPdf(selectedResults)
          }
          disabled={!selectedResults.length}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
        >
          <User className="h-4 w-4" />
          Download Individual PDF
        </button>
      </div>
    </div>
  );
}
