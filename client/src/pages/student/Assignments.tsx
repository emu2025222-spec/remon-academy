import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  CalendarDays,
  ClipboardCheck,
  FileText,
  Paperclip,
  Upload,
} from "lucide-react";

import { api, getErrorMessage } from "../../services/api";
import { Assignment } from "../../types";
import { Loader } from "../../components/Loader";
import { EmptyState } from "../../components/EmptyState";
import { useToast } from "../../components/Toast";

export default function StudentAssignments() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadingId, setUploadingId] = useState<string | null>(null);

  const { show } = useToast();

  function load() {
    setLoading(true);

    api
      .get("/assignments/my")
      .then((r) => setAssignments(r.data.data))
      .catch((err) => show(getErrorMessage(err), "error"))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
  }, []);

  async function handleSubmit(id: string, file: File) {
    setUploadingId(id);

    try {
      const formData = new FormData();
      formData.append("file", file);

      await api.post(`/assignments/${id}/submit`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      show("Assignment submitted successfully", "success");
    } catch (err) {
      show(getErrorMessage(err), "error");
    } finally {
      setUploadingId(null);
    }
  }

  if (loading) {
    return <Loader />;
  }

  if (assignments.length === 0) {
    return (
      <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_15px_50px_rgba(15,23,42,0.05)]">
        <EmptyState message="No assignments for your course yet." />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-3 flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-navyDark">
              <ClipboardCheck className="h-4 w-4 text-brand-goldLight" />
            </div>

            <span className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-gold">
              Academic Work
            </span>
          </div>

          <h1 className="font-display text-3xl font-semibold tracking-[-0.03em] text-brand-navyDark sm:text-4xl">
            Assignments
          </h1>

          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
            Review your assigned work, check deadlines and submit completed
            assignments from one place.
          </p>
        </div>

        <div className="flex w-fit items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
          <FileText className="h-4 w-4 text-brand-gold" />

          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">
              Total
            </p>
            <p className="text-sm font-semibold text-brand-navyDark">
              {assignments.length}{" "}
              {assignments.length === 1 ? "Assignment" : "Assignments"}
            </p>
          </div>
        </div>
      </div>

      {/* ASSIGNMENT LIST */}
      <div className="space-y-5">
        {assignments.map((assignment, index) => {
          const deadline = new Date(assignment.deadline);

          return (
            <div
              key={assignment._id}
              className="group overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_15px_50px_rgba(15,23,42,0.05)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_60px_rgba(15,23,42,0.08)]"
            >
              <div className="p-6 sm:p-7">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                  {/* CONTENT */}
                  <div className="min-w-0 flex-1">
                    <div className="mb-4 flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-navyDark">
                        <FileText className="h-5 w-5 text-brand-goldLight" />
                      </div>

                      <div className="min-w-0">
                        <div className="mb-1 flex flex-wrap items-center gap-2">
                          <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-gold">
                            Assignment {String(index + 1).padStart(2, "0")}
                          </span>
                        </div>

                        <h2 className="font-display text-xl font-semibold leading-tight text-brand-navyDark sm:text-2xl">
                          {assignment.title}
                        </h2>
                      </div>
                    </div>

                    {assignment.description && (
                      <p className="max-w-2xl text-sm leading-7 text-slate-500">
                        {assignment.description}
                      </p>
                    )}

                    <div className="mt-5 flex flex-wrap items-center gap-3">
                      <div className="inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-2 text-xs font-medium text-red-600">
                        <CalendarDays className="h-3.5 w-3.5" />
                        Deadline: {deadline.toLocaleString()}
                      </div>

                      {assignment.attachment && (
                        <a
                          href={assignment.attachment}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-brand-navyDark no-underline transition-colors hover:border-brand-gold/40 hover:bg-brand-gold/5"
                        >
                          <Paperclip className="h-3.5 w-3.5 text-brand-gold" />
                          View attachment
                          <ArrowUpRight className="h-3 w-3" />
                        </a>
                      )}
                    </div>
                  </div>

                  {/* SUBMIT */}
                  <div className="shrink-0 border-t border-slate-100 pt-5 lg:border-l lg:border-t-0 lg:pl-7 lg:pt-0">
                    <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                      Submission
                    </p>

                    <label className="block">
                      <input
                        type="file"
                        className="hidden"
                        disabled={uploadingId === assignment._id}
                        onChange={(e) => {
                          const file = e.target.files?.[0];

                          if (file) {
                            handleSubmit(assignment._id, file);
                          }

                          e.currentTarget.value = "";
                        }}
                      />

                      <span
                        className={`inline-flex min-w-[150px] cursor-pointer items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition-all duration-300 ${
                          uploadingId === assignment._id
                            ? "cursor-wait bg-slate-200 text-slate-500"
                            : "bg-brand-navyDark text-white hover:-translate-y-0.5 hover:bg-brand-navyDark/90"
                        }`}
                      >
                        <Upload className="h-4 w-4 text-brand-goldLight" />

                        {uploadingId === assignment._id
                          ? "Uploading..."
                          : "Submit Assignment"}
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              {/* BOTTOM ACCENT */}
              <div className="h-1 w-full bg-gradient-to-r from-brand-navyDark via-brand-gold to-brand-navyDark opacity-20 transition-opacity duration-300 group-hover:opacity-60" />
            </div>
          );
        })}
      </div>
    </div>
  );
}


