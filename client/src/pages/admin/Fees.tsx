import { useEffect, useState } from "react";
import { Plus, Pencil } from "lucide-react";
import { api, getErrorMessage } from "../../services/api";
import { Fee, Student, Course, PaginatedResponse } from "../../types";
import { Loader } from "../../components/Loader";
import { EmptyState } from "../../components/EmptyState";
import { Pagination } from "../../components/Pagination";
import { Modal } from "../../components/Modal";
import { Input } from "../../components/Input";
import { Button } from "../../components/Button";
import { Badge } from "../../components/Badge";
import { useToast } from "../../components/Toast";

interface CreateForm { student: string; course: string; amount: string; dueDate: string }
const emptyCreate: CreateForm = { student: "", course: "", amount: "", dueDate: new Date().toISOString().slice(0, 10) };

interface UpdateForm { amountPaid: string; paymentDate: string; paymentMethod: string; transactionId: string }

export default function AdminFees() {
  const [data, setData] = useState<PaginatedResponse<Fee> | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState<CreateForm>(emptyCreate);
  const [editTarget, setEditTarget] = useState<Fee | null>(null);
  const [updateForm, setUpdateForm] = useState<UpdateForm>({ amountPaid: "", paymentDate: "", paymentMethod: "", transactionId: "" });
  const [saving, setSaving] = useState(false);
  const { show } = useToast();

  function load() {
    setLoading(true);
    api.get("/fees", { params: { page } }).then((r) => setData(r.data.data)).finally(() => setLoading(false));
  }
  useEffect(load, [page]);
  useEffect(() => {
    api.get("/students", { params: { limit: 200 } }).then((r) => setStudents(r.data.data.data));
    api.get("/courses", { params: { limit: 100 } }).then((r) => setCourses(r.data.data.data));
  }, []);

  async function handleCreate() {
    setSaving(true);
    try {
      await api.post("/fees", { ...createForm, amount: Number(createForm.amount) });
      show("Fee record created", "success");
      setCreateOpen(false);
      setCreateForm(emptyCreate);
      load();
    } catch (err) { show(getErrorMessage(err), "error"); } finally { setSaving(false); }
  }

  function openEdit(f: Fee) {
    setEditTarget(f);
    setUpdateForm({ amountPaid: String(f.amountPaid), paymentDate: f.paymentDate?.slice(0, 10) || "", paymentMethod: f.paymentMethod || "", transactionId: f.transactionId || "" });
  }

  async function handleUpdate() {
    if (!editTarget) return;
    setSaving(true);
    try {
      await api.put(`/fees/${editTarget._id}`, { ...updateForm, amountPaid: Number(updateForm.amountPaid) });
      show("Fee record updated", "success");
      setEditTarget(null);
      load();
    } catch (err) { show(getErrorMessage(err), "error"); } finally { setSaving(false); }
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white">Fees</h2>
        <Button onClick={() => setCreateOpen(true)}><Plus className="h-4 w-4" /> Add Fee Record</Button>
      </div>

      {loading ? <Loader /> : !data || data.data.length === 0 ? <EmptyState message="No fee records yet." /> : (
        <div className="card overflow-x-auto p-0">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-left text-xs uppercase text-slate-400">
              <tr><th className="px-4 py-3">Student</th><th className="px-4 py-3">Amount</th><th className="px-4 py-3">Paid</th><th className="px-4 py-3">Due Date</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Actions</th></tr>
            </thead>
            <tbody>
              {data.data.map((f) => (
                <tr key={f._id} className="border-t border-slate-100 dark:border-slate-800">
                  <td className="px-4 py-3">{typeof f.student === "object" ? (f.student as Student).fullName : "-"}</td>
                  <td className="px-4 py-3">৳{f.amount}</td>
                  <td className="px-4 py-3">৳{f.amountPaid}</td>
                  <td className="px-4 py-3">{new Date(f.dueDate).toLocaleDateString()}</td>
                  <td className="px-4 py-3"><Badge color={f.status === "PAID" ? "green" : f.status === "PARTIAL" ? "gold" : "red"}>{f.status}</Badge></td>
                  <td className="px-4 py-3">
                    <button onClick={() => openEdit(f)} className="rounded p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800"><Pencil className="h-4 w-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {data && <Pagination page={data.page} totalPages={data.totalPages} onChange={setPage} />}

      <Modal open={createOpen} title="Add Fee Record" onClose={() => setCreateOpen(false)}>
        <div className="grid gap-3">
          <div>
            <label className="label-field">Student</label>
            <select className="input-field" value={createForm.student} onChange={(e) => setCreateForm({ ...createForm, student: e.target.value })}>
              <option value="">Select student</option>
              {students.map((s) => <option key={s._id} value={s._id}>{s.fullName} ({s.studentId})</option>)}
            </select>
          </div>
          <div>
            <label className="label-field">Course</label>
            <select className="input-field" value={createForm.course} onChange={(e) => setCreateForm({ ...createForm, course: e.target.value })}>
              <option value="">Select course</option>
              {courses.map((c) => <option key={c._id} value={c._id}>{c.title}</option>)}
            </select>
          </div>
          <Input label="Amount (৳)" type="number" value={createForm.amount} onChange={(e) => setCreateForm({ ...createForm, amount: e.target.value })} />
          <Input label="Due Date" type="date" value={createForm.dueDate} onChange={(e) => setCreateForm({ ...createForm, dueDate: e.target.value })} />
          <Button onClick={handleCreate} loading={saving}>Create</Button>
        </div>
      </Modal>

      <Modal open={!!editTarget} title="Update Payment" onClose={() => setEditTarget(null)}>
        <div className="grid gap-3">
          <Input label="Amount Paid (৳)" type="number" value={updateForm.amountPaid} onChange={(e) => setUpdateForm({ ...updateForm, amountPaid: e.target.value })} />
          <Input label="Payment Date" type="date" value={updateForm.paymentDate} onChange={(e) => setUpdateForm({ ...updateForm, paymentDate: e.target.value })} />
          <Input label="Payment Method" value={updateForm.paymentMethod} onChange={(e) => setUpdateForm({ ...updateForm, paymentMethod: e.target.value })} />
          <Input label="Transaction ID" value={updateForm.transactionId} onChange={(e) => setUpdateForm({ ...updateForm, transactionId: e.target.value })} />
          <Button onClick={handleUpdate} loading={saving}>Save</Button>
        </div>
      </Modal>
    </div>
  );
}
