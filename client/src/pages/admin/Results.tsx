import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { api, getErrorMessage } from "../../services/api";
import { Result, Student, PaginatedResponse } from "../../types";
import { Loader } from "../../components/Loader";
import { EmptyState } from "../../components/EmptyState";
import { Pagination } from "../../components/Pagination";
import { Modal } from "../../components/Modal";
import { ConfirmDialog } from "../../components/ConfirmDialog";
import { Input } from "../../components/Input";
import { Button } from "../../components/Button";
import { useToast } from "../../components/Toast";

interface FormState { student: string; examName: string; subject: string; totalMarks: string; obtainedMarks: string; grade: string; gpa: string; examDate: string }
const emptyForm: FormState = { student: "", examName: "", subject: "", totalMarks: "100", obtainedMarks: "", grade: "A", gpa: "5.0", examDate: new Date().toISOString().slice(0, 10) };

export default function AdminResults() {
  const [data, setData] = useState<PaginatedResponse<Result> | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Result | null>(null);
  const { show } = useToast();

  function load() {
    setLoading(true);
    api.get("/results", { params: { page } }).then((r) => setData(r.data.data)).finally(() => setLoading(false));
  }
  useEffect(load, [page]);
  useEffect(() => { api.get("/students", { params: { limit: 200 } }).then((r) => setStudents(r.data.data.data)); }, []);

  async function handleSave() {
    setSaving(true);
    try {
      await api.post("/results", { ...form, totalMarks: Number(form.totalMarks), obtainedMarks: Number(form.obtainedMarks), gpa: Number(form.gpa) });
      show("Result added", "success");
      setModalOpen(false);
      setForm(emptyForm);
      load();
    } catch (err) { show(getErrorMessage(err), "error"); } finally { setSaving(false); }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    try { await api.delete(`/results/${deleteTarget._id}`); show("Result deleted", "success"); setDeleteTarget(null); load(); }
    catch (err) { show(getErrorMessage(err), "error"); }
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white">Results</h2>
        <Button onClick={() => setModalOpen(true)}><Plus className="h-4 w-4" /> Add Result</Button>
      </div>

      {loading ? <Loader /> : !data || data.data.length === 0 ? <EmptyState message="No results yet." /> : (
        <div className="card overflow-x-auto p-0">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-left text-xs uppercase text-slate-400">
              <tr><th className="px-4 py-3">Student</th><th className="px-4 py-3">Exam</th><th className="px-4 py-3">Subject</th><th className="px-4 py-3">Marks</th><th className="px-4 py-3">GPA</th><th className="px-4 py-3">Actions</th></tr>
            </thead>
            <tbody>
              {data.data.map((r) => (
                <tr key={r._id} className="border-t border-slate-100 dark:border-slate-800">
                  <td className="px-4 py-3">{typeof r.student === "object" ? (r.student as Student).fullName : "-"}</td>
                  <td className="px-4 py-3">{r.examName}</td>
                  <td className="px-4 py-3">{r.subject}</td>
                  <td className="px-4 py-3">{r.obtainedMarks}/{r.totalMarks}</td>
                  <td className="px-4 py-3">{r.gpa}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => setDeleteTarget(r)} className="rounded p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-950"><Trash2 className="h-4 w-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {data && <Pagination page={data.page} totalPages={data.totalPages} onChange={setPage} />}

      <Modal open={modalOpen} title="Add Result" onClose={() => setModalOpen(false)}>
        <div className="grid gap-3">
          <div>
            <label className="label-field">Student</label>
            <select className="input-field" value={form.student} onChange={(e) => setForm({ ...form, student: e.target.value })}>
              <option value="">Select student</option>
              {students.map((s) => <option key={s._id} value={s._id}>{s.fullName} ({s.studentId})</option>)}
            </select>
          </div>
          <Input label="Exam Name" value={form.examName} onChange={(e) => setForm({ ...form, examName: e.target.value })} />
          <Input label="Subject" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Total Marks" type="number" value={form.totalMarks} onChange={(e) => setForm({ ...form, totalMarks: e.target.value })} />
            <Input label="Obtained Marks" type="number" value={form.obtainedMarks} onChange={(e) => setForm({ ...form, obtainedMarks: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Grade" value={form.grade} onChange={(e) => setForm({ ...form, grade: e.target.value })} />
            <Input label="GPA" type="number" step="0.01" value={form.gpa} onChange={(e) => setForm({ ...form, gpa: e.target.value })} />
          </div>
          <Input label="Exam Date" type="date" value={form.examDate} onChange={(e) => setForm({ ...form, examDate: e.target.value })} />
          <Button onClick={handleSave} loading={saving}>Add Result</Button>
        </div>
      </Modal>

      <ConfirmDialog open={!!deleteTarget} title="Delete Result" message="Are you sure you want to delete this result?" onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} />
    </div>
  );
}
