import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import { api, getErrorMessage } from "../../services/api";
import { Course, Teacher, PaginatedResponse } from "../../types";
import { Loader } from "../../components/Loader";
import { EmptyState } from "../../components/EmptyState";
import { Pagination } from "../../components/Pagination";
import { Modal } from "../../components/Modal";
import { ConfirmDialog } from "../../components/ConfirmDialog";
import { Input } from "../../components/Input";
import { Button } from "../../components/Button";
import { Badge } from "../../components/Badge";
import { useToast } from "../../components/Toast";

interface FormState {
  title: string; description: string; classLevel: string; subject: string; duration: string;
  fee: string; teacher: string; schedule: string; seatCapacity: string; features: string;
}
const emptyForm: FormState = { title: "", description: "", classLevel: "SSC", subject: "", duration: "", fee: "", teacher: "", schedule: "", seatCapacity: "30", features: "" };

export default function AdminCourses() {
  const [data, setData] = useState<PaginatedResponse<Course> | null>(null);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Course | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Course | null>(null);
  const { show } = useToast();

  function load() {
    setLoading(true);
    api.get("/courses", { params: { page } }).then((r) => setData(r.data.data)).finally(() => setLoading(false));
  }
  useEffect(load, [page]);
  useEffect(() => { api.get("/teachers", { params: { limit: 100 } }).then((r) => setTeachers(r.data.data.data)); }, []);

  function openCreate() { setEditing(null); setForm(emptyForm); setModalOpen(true); }
  function openEdit(c: Course) {
    setEditing(c);
    setForm({
      title: c.title, description: c.description, classLevel: c.classLevel, subject: c.subject, duration: c.duration,
      fee: String(c.fee), teacher: typeof c.teacher === "object" ? (c.teacher as Teacher)._id : (c.teacher as string) || "",
      schedule: c.schedule || "", seatCapacity: String(c.seatCapacity), features: c.features.join(", "),
    });
    setModalOpen(true);
  }

  async function handleSave() {
    setSaving(true);
    try {
      const payload = { ...form, fee: Number(form.fee), seatCapacity: Number(form.seatCapacity), features: form.features.split(",").map((f) => f.trim()).filter(Boolean), teacher: form.teacher || undefined };
      if (editing) { await api.put(`/courses/${editing._id}`, payload); show("Course updated", "success"); }
      else { await api.post("/courses", payload); show("Course created", "success"); }
      setModalOpen(false);
      load();
    } catch (err) { show(getErrorMessage(err), "error"); } finally { setSaving(false); }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    try { await api.delete(`/courses/${deleteTarget._id}`); show("Course deleted", "success"); setDeleteTarget(null); load(); }
    catch (err) { show(getErrorMessage(err), "error"); }
  }

  async function togglePublish(c: Course) {
    try { await api.patch(`/courses/${c._id}/toggle-publish`); load(); } catch (err) { show(getErrorMessage(err), "error"); }
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white">Courses</h2>
        <Button onClick={openCreate}><Plus className="h-4 w-4" /> Add Course</Button>
      </div>

      {loading ? <Loader /> : !data || data.data.length === 0 ? <EmptyState message="No courses yet." /> : (
        <div className="card overflow-x-auto p-0">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-left text-xs uppercase text-slate-400">
              <tr><th className="px-4 py-3">Title</th><th className="px-4 py-3">Level</th><th className="px-4 py-3">Fee</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Actions</th></tr>
            </thead>
            <tbody>
              {data.data.map((c) => (
                <tr key={c._id} className="border-t border-slate-100 dark:border-slate-800">
                  <td className="px-4 py-3">{c.title}</td>
                  <td className="px-4 py-3">{c.classLevel}</td>
                  <td className="px-4 py-3">৳{c.fee}</td>
                  <td className="px-4 py-3"><Badge color={c.isPublished ? "green" : "gray"}>{c.isPublished ? "Published" : "Draft"}</Badge></td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(c)} className="rounded p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800"><Pencil className="h-4 w-4" /></button>
                      <button onClick={() => togglePublish(c)} className="rounded p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800">{c.isPublished ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>
                      <button onClick={() => setDeleteTarget(c)} className="rounded p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-950"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {data && <Pagination page={data.page} totalPages={data.totalPages} onChange={setPage} />}

      <Modal open={modalOpen} title={editing ? "Edit Course" : "Add Course"} onClose={() => setModalOpen(false)} maxWidth="max-w-xl">
        <div className="grid gap-3 md:grid-cols-2">
          <div className="md:col-span-2"><Input label="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
          <div className="md:col-span-2">
            <label className="label-field">Description</label>
            <textarea className="input-field" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div>
            <label className="label-field">Class Level</label>
            <select className="input-field" value={form.classLevel} onChange={(e) => setForm({ ...form, classLevel: e.target.value })}>
              <option>SSC</option><option>HSC</option><option>Admission</option>
            </select>
          </div>
          <Input label="Subject" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
          <Input label="Duration" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} />
          <Input label="Fee (৳)" type="number" value={form.fee} onChange={(e) => setForm({ ...form, fee: e.target.value })} />
          <div>
            <label className="label-field">Teacher</label>
            <select className="input-field" value={form.teacher} onChange={(e) => setForm({ ...form, teacher: e.target.value })}>
              <option value="">None</option>
              {teachers.map((t) => <option key={t._id} value={t._id}>{t.name}</option>)}
            </select>
          </div>
          <Input label="Seat Capacity" type="number" value={form.seatCapacity} onChange={(e) => setForm({ ...form, seatCapacity: e.target.value })} />
          <div className="md:col-span-2"><Input label="Schedule" value={form.schedule} onChange={(e) => setForm({ ...form, schedule: e.target.value })} /></div>
          <div className="md:col-span-2"><Input label="Features (comma separated)" value={form.features} onChange={(e) => setForm({ ...form, features: e.target.value })} /></div>
          <div className="md:col-span-2"><Button onClick={handleSave} loading={saving} className="w-full">{editing ? "Save Changes" : "Create Course"}</Button></div>
        </div>
      </Modal>

      <ConfirmDialog open={!!deleteTarget} title="Delete Course" message={`Delete "${deleteTarget?.title}"? This cannot be undone.`} onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} />
    </div>
  );
}
