import { useEffect, useState } from "react";
import { api, getErrorMessage } from "../../services/api";
import { Assignment } from "../../types";
import { Loader } from "../../components/Loader";
import { EmptyState } from "../../components/EmptyState";
import { Button } from "../../components/Button";
import { useToast } from "../../components/Toast";
import { Paperclip, Upload } from "lucide-react";

export default function StudentAssignments() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const { show } = useToast();

  function load() {
    api.get("/assignments/my").then((r) => setAssignments(r.data.data)).finally(() => setLoading(false));
  }

  useEffect(load, []);

  async function handleSubmit(id: string, file: File) {
    setUploadingId(id);
    try {
      const formData = new FormData();
      formData.append("file", file);
      await api.post(`/assignments/${id}/submit`, formData, { headers: { "Content-Type": "multipart/form-data" } });
      show("Assignment submitted successfully", "success");
    } catch (err) {
      show(getErrorMessage(err), "error");
    } finally {
      setUploadingId(null);
    }
  }

  if (loading) return <Loader />;
  if (assignments.length === 0) return <EmptyState message="No assignments for your course yet." />;

  return (
    <div>
      <h2 className="mb-6 font-display text-2xl font-bold text-slate-900 dark:text-white">Assignments</h2>
      <div className="space-y-4">
        {assignments.map((a) => (
          <div key={a._id} className="card flex flex-col gap-3 p-5 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white">{a.title}</h3>
              <p className="text-sm text-slate-500">{a.description}</p>
              <p className="mt-1 text-xs text-red-500">Deadline: {new Date(a.deadline).toLocaleString()}</p>
              {a.attachment && (
                <a href={a.attachment} target="_blank" rel="noreferrer" className="mt-1 inline-flex items-center gap-1 text-xs text-brand-navy hover:underline dark:text-brand-goldLight">
                  <Paperclip className="h-3 w-3" /> View attachment
                </a>
              )}
            </div>
            <label className="shrink-0">
              <input
                type="file"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleSubmit(a._id, e.target.files[0])}
              />
              <span className="btn-secondary cursor-pointer !px-4 !py-2 text-sm">
                <Upload className="h-4 w-4" /> {uploadingId === a._id ? "Uploading..." : "Submit"}
              </span>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}
