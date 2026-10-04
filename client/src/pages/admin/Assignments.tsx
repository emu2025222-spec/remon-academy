import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { api, getErrorMessage } from "../../services/api";
import { Assignment, Course, PaginatedResponse } from "../../types";
import { Loader } from "../../components/Loader";
import { EmptyState } from "../../components/EmptyState";
import { Pagination } from "../../components/Pagination";
import { Modal } from "../../components/Modal";
import { ConfirmDialog } from "../../components/ConfirmDialog";
import { Input } from "../../components/Input";
import { Button } from "../../components/Button";
import { useToast } from "../../components/Toast";

interface FormState { title: string; description: string; course: string; subject: string; deadline: string }
const emptyForm: FormState = { title: "", description: "", course: "", subject: "", deadline: "" };

export default function AdminAssignments() {
  const [data, setData] = useState<PaginatedResponse<Assignment> | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Assignment | null>(null);
  const { show } = useToast();

  function load() {
    setLoading(true);
    api.get("/assignments", { params: { page } }).then((r) => setData(r.data.data)).finally(() => setLoading(false));
  }
  useEffect(load, [page]);
  useEffect(() => { api.get("/courses", { params: { limit: 100 } }).then((r) => setCourses(r.data.data.data)); }, []);

  async function handleSave() {
    setSaving(true);
    try {
      await api.post("/assignments", form);
      show("Assignment created", "success");
      setModalOpen(false);
      setForm(emptyForm);
      load();
    } catch (err) { show(getErrorMessage(err), "error"); } finally { setSaving(false); }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    try { await api.delete(`/assignments/${deleteTarget._id}`); show("Assignment deleted", "success"); setDeleteTarget(null); load(); }
    catch (err) { show(getErrorMessage(err), "error"); }
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white">Assignments</h2>
        <Button onClick={() => setModalOpen(true)}><Plus className="h-4 w-4" /> Add Assignment</Button>
      </div>

      {loading ? <Loader /> : !data || data.data.length === 0 ? <EmptyState message="No assignments yet." /> : (
        <div className="card overflow-x-auto p-0">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-left text-xs uppercase text-slate-400">
              <tr><th className="px-4 py-3">Title</th><th className="px-4 py-3">Course</th><th className="px-4 py-3">Deadline</th><th className="px-4 py-3">Actions</th></tr>
            </thead>
            <tbody>
              {data.data.map((a) => (
                <tr key={a._id} className="border-t border-slate-100 dark:border-slate-800">
                  <td className="px-4 py-3">{a.title}</td>
                  <td className="px-4 py-3">{typeof a.course === "object" ? (a.course as Course).title : "-"}</td>
                  <td className="px-4 py-3">{new Date(a.deadline).toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => setDeleteTarget(a)} className="rounded p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-950"><Trash2 className="h-4 w-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {data && <Pagination page={data.page} totalPages={data.totalPages} onChange={setPage} />}

      <Modal open={modalOpen} title="Add Assignment" onClose={() => setModalOpen(false)}>
        <div className="grid gap-3">
          <Input label="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <div>
            <label className="label-field">Description</label>
            <textarea className="input-field" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div>
            <label className="label-field">Course</label>
            <select className="input-field" value={form.course} onChange={(e) => setForm({ ...form, course: e.target.value })}>
              <option value="">Select course</option>
              {courses.map((c) => <option key={c._id} value={c._id}>{c.title}</option>)}
            </select>
          </div>
          <Input label="Subject" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
          <Input label="Deadline" type="datetime-local" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} />
          <Button onClick={handleSave} loading={saving}>Create Assignment</Button>
        </div>
      </Modal>

      <ConfirmDialog open={!!deleteTarget} title="Delete Assignment" message={`Delete "${deleteTarget?.title}"?`} onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} />
    </div>
  );
}
