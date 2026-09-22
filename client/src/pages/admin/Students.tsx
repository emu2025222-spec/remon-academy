import { useEffect, useState } from "react";
import { Search, Plus, Pencil, Trash2, KeyRound, Power } from "lucide-react";
import { api, getErrorMessage } from "../../services/api";
import { Student, Course, PaginatedResponse } from "../../types";
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
  fullName: string; email: string; phone: string; password: string;
  dateOfBirth: string; gender: string; address: string; class: string; group: string; course: string;
}
const emptyForm: FormState = { fullName: "", email: "", phone: "", password: "", dateOfBirth: "", gender: "MALE", address: "", class: "", group: "", course: "" };

export default function AdminStudents() {
  const [data, setData] = useState<PaginatedResponse<Student> | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Student | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Student | null>(null);
  const [resetTarget, setResetTarget] = useState<Student | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const { show } = useToast();

  function load() {
    setLoading(true);
    api.get("/students", { params: { page, search } }).then((r) => setData(r.data.data)).finally(() => setLoading(false));
  }

  useEffect(load, [page, search]);
  useEffect(() => { api.get("/courses", { params: { limit: 100 } }).then((r) => setCourses(r.data.data.data)); }, []);

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  }

  function openEdit(s: Student) {
    setEditing(s);
    setForm({
      fullName: s.fullName, email: "", phone: s.phone, password: "",
      dateOfBirth: s.dateOfBirth?.slice(0, 10) || "", gender: s.gender, address: s.address,
      class: s.class, group: s.group || "", course: typeof s.course === "object" ? (s.course as Course)._id : (s.course as string) || "",
    });
    setModalOpen(true);
  }

  async function handleSave() {
    setSaving(true);
    try {
      if (editing) {
        await api.put(`/students/${editing._id}`, { fullName: form.fullName, phone: form.phone, address: form.address, class: form.class, group: form.group, course: form.course || undefined });
        show("Student updated", "success");
      } else {
        await api.post("/students", form);
        show("Student created", "success");
      }
      setModalOpen(false);
      load();
    } catch (err) {
      show(getErrorMessage(err), "error");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    try {
      await api.delete(`/students/${deleteTarget._id}`);
      show("Student deleted", "success");
      setDeleteTarget(null);
      load();
    } catch (err) {
      show(getErrorMessage(err), "error");
    }
  }

  async function toggleActive(s: Student) {
    try {
      await api.patch(`/students/${s._id}/toggle-active`);
      load();
    } catch (err) {
      show(getErrorMessage(err), "error");
    }
  }

  async function handleResetPassword() {
    if (!resetTarget || newPassword.length < 8) { show("Password must be at least 8 characters", "error"); return; }
    try {
      await api.post(`/students/${resetTarget._id}/reset-password`, { newPassword });
      show("Password reset successfully", "success");
      setResetTarget(null);
      setNewPassword("");
    } catch (err) {
      show(getErrorMessage(err), "error");
    }
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white">Students</h2>
        <Button onClick={openCreate}><Plus className="h-4 w-4" /> Add Student</Button>
      </div>

      <div className="mb-4 flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 dark:border-slate-800 dark:bg-slate-900">
        <Search className="h-4 w-4 text-slate-400" />
        <input
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          placeholder="Search by name or Student ID..."
          className="flex-1 bg-transparent text-sm outline-none"
        />
      </div>

      {loading ? <Loader /> : !data || data.data.length === 0 ? <EmptyState message="No students found." /> : (
        <div className="card overflow-x-auto p-0">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-left text-xs uppercase text-slate-400">
              <tr>
                <th className="px-4 py-3">Student ID</th><th className="px-4 py-3">Name</th><th className="px-4 py-3">Class</th>
                <th className="px-4 py-3">Course</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.data.map((s) => (
                <tr key={s._id} className="border-t border-slate-100 dark:border-slate-800">
                  <td className="px-4 py-3 font-mono text-xs">{s.studentId}</td>
                  <td className="px-4 py-3">{s.fullName}</td>
                  <td className="px-4 py-3">{s.class}</td>
                  <td className="px-4 py-3">{typeof s.course === "object" ? (s.course as Course)?.title : "-"}</td>
                  <td className="px-4 py-3"><Badge color={s.isActive ? "green" : "red"}>{s.isActive ? "Active" : "Inactive"}</Badge></td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(s)} className="rounded p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800"><Pencil className="h-4 w-4" /></button>
                      <button onClick={() => toggleActive(s)} className="rounded p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800"><Power className="h-4 w-4" /></button>
                      <button onClick={() => setResetTarget(s)} className="rounded p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800"><KeyRound className="h-4 w-4" /></button>
                      <button onClick={() => setDeleteTarget(s)} className="rounded p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-950"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {data && <Pagination page={data.page} totalPages={data.totalPages} onChange={setPage} />}

      <Modal open={modalOpen} title={editing ? "Edit Student" : "Add Student"} onClose={() => setModalOpen(false)}>
        <div className="grid gap-3">
          <Input label="Full Name" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
          {!editing && <Input label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />}
          <Input label="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          {!editing && <Input label="Password (default: Student123!)" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />}
          {!editing && <Input label="Date of Birth" type="date" value={form.dateOfBirth} onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })} />}
          <Input label="Class" value={form.class} onChange={(e) => setForm({ ...form, class: e.target.value })} />
          <Input label="Group" value={form.group} onChange={(e) => setForm({ ...form, group: e.target.value })} />
          <Input label="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
          <div>
            <label className="label-field">Course</label>
            <select className="input-field" value={form.course} onChange={(e) => setForm({ ...form, course: e.target.value })}>
              <option value="">None</option>
              {courses.map((c) => <option key={c._id} value={c._id}>{c.title}</option>)}
            </select>
          </div>
          <Button onClick={handleSave} loading={saving}>{editing ? "Save Changes" : "Create Student"}</Button>
        </div>
      </Modal>

      <Modal open={!!resetTarget} title="Reset Student Password" onClose={() => setResetTarget(null)}>
        <div className="space-y-3">
          <Input label="New Password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
          <Button onClick={handleResetPassword} className="w-full">Reset Password</Button>
        </div>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Student"
        message={`Are you sure you want to delete ${deleteTarget?.fullName}? This cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
