import { useState } from "react";
import {
  FileText,
  Download,
  Users,
  User,
} from "lucide-react";

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

function extractArray(
  payload: any,
  possibleKeys: string[],
  depth = 0
): any[] {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (!payload || typeof payload !== "object" || depth > 5) {
    return [];
  }

  for (const key of possibleKeys) {
    if (Array.isArray(payload[key])) {
      return payload[key];
    }
  }

  for (const key of ["data", "result", "results"]) {
    if (payload[key] && typeof payload[key] === "object") {
      const found = extractArray(
        payload[key],
        possibleKeys,
        depth + 1
      );

      if (found.length > 0) {
        return found;
      }
    }
  }

  return [];
}

function getStudentIdentifier(student: any): string {
  if (!student) return "";

  if (typeof student === "string") {
    return student;
  }

  return String(
    student._id ||
    student.id ||
    student.studentId ||
    ""
  );
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

        const id = getStudentIdentifier(student);

        const name =
          typeof student === "object"
            ? student?.fullName ||
              student?.name ||
              "Unknown Student"
            : "Unknown Student";

        return [
          id,
          {
            id,
            name,
          },
        ];
      })
    ).values()
  ).filter((student) => student.id);

  const selectedResults = selectedStudent
    ? results.filter((result) => {
        return (
          getStudentIdentifier(result.student) ===
          selectedStudent
        );
      })
    : [];

  async function handleCombinedReport() {
    if (loading) return;

    setLoading(true);

    try {
      // ==========================================
      // LOAD ALL FEE RECORDS
      // ==========================================

      const feeResponse = await api.get("/fees", {
        params: {
          page: 1,
          limit: 1000,
        },
      });

      const fees = extractArray(
        feeResponse.data,
        ["fees", "data", "items", "records"]
      );

      // ==========================================
      // LOAD PAYMENT REQUEST HISTORY
      // ==========================================

      const paymentResponse = await api.get(
        "/fees/payment-requests"
      );

      const paymentRequests = extractArray(
        paymentResponse.data,
        [
          "paymentRequests",
          "requests",
          "payments",
          "data",
          "items",
          "records",
        ]
      );

      // ==========================================
      // GENERATE COMBINED PDF
      // ==========================================

      downloadAdminCombinedReport({
        results,
        fees,
        paymentRequests,
      });
    } catch (error) {
      console.error(
        "Combined report error:",
        error
      );

      window.alert(
        "Could not load fee or payment information. Please check the API and try again."
      );
    } finally {
      setLoading(false);
    }
  }

  // ==========================================
  // STUDENT MODE
  // Keep the original individual PDF.
  // ==========================================

  if (mode === "student") {
    return (
      <button
        type="button"
        onClick={() =>
          downloadStudentMarksheetPdf(results)
        }
        disabled={!results.length}
        className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-slate-950"
      >
        <Download className="h-4 w-4" />
        Download My Complete Marksheet
      </button>
    );
  }

  // ==========================================
  // ADMIN MODE
  // ==========================================

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        {/* OLD ALL MARKSHEETS PDF */}

        <button
          type="button"
          onClick={() =>
            downloadAllStudentMarksheetsPdf(results)
          }
          disabled={!results.length}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
        >
          <Users className="h-4 w-4" />
          Download All Marksheets
        </button>

        {/* NEW COMBINED REPORT PDF */}

        <button
          type="button"
          onClick={handleCombinedReport}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-slate-950"
        >
          <FileText className="h-4 w-4" />

          {loading
            ? "Preparing Report..."
            : "Download Combined Report PDF"}
        </button>
      </div>

      {/* ====================================== */}
      {/* OLD INDIVIDUAL PDF */}
      {/* ====================================== */}

      <div className="flex flex-wrap items-center gap-2">
        <select
          value={selectedStudent}
          onChange={(event) =>
            setSelectedStudent(event.target.value)
          }
          className="min-w-[220px] rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
        >
          <option value="">
            Select a student for individual PDF
          </option>

          {students.map((student) => (
            <option
              key={student.id}
              value={student.id}
            >
              {student.name}
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={() =>
            downloadStudentMarksheetPdf(
              selectedResults
            )
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