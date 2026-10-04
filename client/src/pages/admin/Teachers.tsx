import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Power } from "lucide-react";
import { api, getErrorMessage } from "../../services/api";
import { Teacher, PaginatedResponse } from "../../types";
import { Loader } from "../../components/Loader";
import { EmptyState } from "../../components/EmptyState";
import { Pagination } from "../../components/Pagination";
import { Modal } from "../../components/Modal";
import { ConfirmDialog } from "../../components/ConfirmDialog";
import { Input } from "../../components/Input";
import { Button } from "../../components/Button";
import { Badge } from "../../components/Badge";
import { useToast } from "../../components/Toast";

interface FormState { name: string; designation: string; qualification: string; subjects: string; experienceYears: string; bio: string; phone: string; email: string }
const emptyForm: FormState = { name: "", designation: "", qualification: "", subjects: "", experienceYears: "0", bio: "", phone: "", email: "" };

export default function AdminTeachers() {
  const [data, setData] = useState<PaginatedResponse<Teacher> | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Teacher | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Teacher | null>(null);
  const { show } = useToast();

  function load() {
    setLoading(true);
    api.get("/teachers", { params: { page } }).then((r) => setData(r.data.data)).finally(() => setLoading(false));
  }
  useEffect(load, [page]);

  function openCreate() { setEditing(null); setForm(emptyForm); setModalOpen(true); }
  function openEdit(t: Teacher) {
    setEditing(t);
    setForm({ name: t.name, designation: t.designation, qualification: t.qualification, subjects: t.subjects.join(", "), experienceYears: String(t.experienceYears), bio: t.bio, phone: t.phone || "", email: t.email || "" });
    setModalOpen(true);
  }

  async function handleSave() {
    setSaving(true);
    try {
      const payload = { ...form, experienceYears: Number(form.experienceYears), subjects: form.subjects.split(",").map((s) => s.trim()).filter(Boolean) };
      if (editing) { await api.put(`/teachers/${editing._id}`, payload); show("Teacher updated", "success"); }
      else { await api.post("/teachers", payload); show("Teacher added", "success"); }
      setModalOpen(false);
      load();
    } catch (err) { show(getErrorMessage(err), "error"); } finally { setSaving(false); }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    try { await api.delete(`/teachers/${deleteTarget._id}`); show("Teacher deleted", "success"); setDeleteTarget(null); load(); }
    catch (err) { show(getErrorMessage(err), "error"); }
  }

  async function toggleActive(t: Teacher) {
    try { await api.patch(`/teachers/${t._id}/toggle-active`); load(); } catch (err) { show(getErrorMessage(err), "error"); }
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white">Teachers</h2>
        <Button onClick={openCreate}><Plus className="h-4 w-4" /> Add Teacher</Button>
      </div>

      {loading ? <Loader /> : !data || data.data.length === 0 ? <EmptyState message="No teachers yet." /> : (
        <div className="card overflow-x-auto p-0">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-left text-xs uppercase text-slate-400">
              <tr><th className="px-4 py-3">Name</th><th className="px-4 py-3">Designation</th><th className="px-4 py-3">Subjects</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Actions</th></tr>
            </thead>
            <tbody>
              {data.data.map((t) => (
                <tr key={t._id} className="border-t border-slate-100 dark:border-slate-800">
                  <td className="px-4 py-3">{t.name}</td>
                  <td className="px-4 py-3">{t.designation}</td>
                  <td className="px-4 py-3">{t.subjects.join(", ")}</td>
                  <td className="px-4 py-3"><Badge color={t.isActive ? "green" : "red"}>{t.isActive ? "Active" : "Inactive"}</Badge></td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(t)} className="rounded p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800"><Pencil className="h-4 w-4" /></button>
                      <button onClick={() => toggleActive(t)} className="rounded p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800"><Power className="h-4 w-4" /></button>
                      <button onClick={() => setDeleteTarget(t)} className="rounded p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-950"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {data && <Pagination page={data.page} totalPages={data.totalPages} onChange={setPage} />}

      <Modal open={modalOpen} title={editing ? "Edit Teacher" : "Add Teacher"} onClose={() => setModalOpen(false)}>
        <div className="grid gap-3">
          <Input label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Input label="Designation" value={form.designation} onChange={(e) => setForm({ ...form, designation: e.target.value })} />
          <Input label="Qualification" value={form.qualification} onChange={(e) => setForm({ ...form, qualification: e.target.value })} />
          <Input label="Subjects (comma separated)" value={form.subjects} onChange={(e) => setForm({ ...form, subjects: e.target.value })} />
          <Input label="Experience (years)" type="number" value={form.experienceYears} onChange={(e) => setForm({ ...form, experienceYears: e.target.value })} />
          <Input label="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <Input label="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <div>
            <label className="label-field">Bio</label>
            <textarea className="input-field" rows={3} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
          </div>
          <Button onClick={handleSave} loading={saving}>{editing ? "Save Changes" : "Add Teacher"}</Button>
        </div>
      </Modal>

      <ConfirmDialog open={!!deleteTarget} title="Delete Teacher" message={`Delete ${deleteTarget?.name}?`} onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} />
    </div>
  );
}
