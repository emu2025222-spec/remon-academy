import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { api, getErrorMessage } from "../../services/api";
import { ScheduleItem, Course, Teacher } from "../../types";
import { Loader } from "../../components/Loader";
import { EmptyState } from "../../components/EmptyState";
import { Modal } from "../../components/Modal";
import { ConfirmDialog } from "../../components/ConfirmDialog";
import { Input } from "../../components/Input";
import { Button } from "../../components/Button";
import { useToast } from "../../components/Toast";

interface FormState { course: string; subject: string; teacher: string; room: string; day: string; startTime: string; endTime: string }
const emptyForm: FormState = { course: "", subject: "", teacher: "", room: "", day: "SAT", startTime: "16:00", endTime: "18:00" };
const days = ["SAT", "SUN", "MON", "TUE", "WED", "THU", "FRI"];

export default function AdminSchedule() {
  const [items, setItems] = useState<ScheduleItem[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<ScheduleItem | null>(null);
  const { show } = useToast();

  function load() {
    setLoading(true);
    api.get("/schedule", { params: { limit: 100 } }).then((r) => setItems(r.data.data.data)).finally(() => setLoading(false));
  }
  useEffect(load, []);
  useEffect(() => {
    api.get("/courses", { params: { limit: 100 } }).then((r) => setCourses(r.data.data.data));
    api.get("/teachers", { params: { limit: 100 } }).then((r) => setTeachers(r.data.data.data));
  }, []);

  async function handleSave() {
    setSaving(true);
    try {
      await api.post("/schedule", form);
      show("Schedule entry added", "success");
      setModalOpen(false);
      setForm(emptyForm);
      load();
    } catch (err) { show(getErrorMessage(err), "error"); } finally { setSaving(false); }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    try { await api.delete(`/schedule/${deleteTarget._id}`); show("Deleted", "success"); setDeleteTarget(null); load(); }
    catch (err) { show(getErrorMessage(err), "error"); }
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white">Class Schedule</h2>
        <Button onClick={() => setModalOpen(true)}><Plus className="h-4 w-4" /> Add Entry</Button>
      </div>

      {loading ? <Loader /> : items.length === 0 ? <EmptyState message="No schedule entries yet." /> : (
        <div className="card overflow-x-auto p-0">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-left text-xs uppercase text-slate-400">
              <tr><th className="px-4 py-3">Course</th><th className="px-4 py-3">Subject</th><th className="px-4 py-3">Teacher</th><th className="px-4 py-3">Day</th><th className="px-4 py-3">Time</th><th className="px-4 py-3">Room</th><th className="px-4 py-3">Actions</th></tr>
            </thead>
            <tbody>
              {items.map((s) => (
                <tr key={s._id} className="border-t border-slate-100 dark:border-slate-800">
                  <td className="px-4 py-3">{typeof s.course === "object" ? (s.course as Course).title : "-"}</td>
                  <td className="px-4 py-3">{s.subject}</td>
                  <td className="px-4 py-3">{typeof s.teacher === "object" ? (s.teacher as Teacher).name : "-"}</td>
                  <td className="px-4 py-3">{s.day}</td>
                  <td className="px-4 py-3">{s.startTime} - {s.endTime}</td>
                  <td className="px-4 py-3">{s.room}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => setDeleteTarget(s)} className="rounded p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-950"><Trash2 className="h-4 w-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={modalOpen} title="Add Schedule Entry" onClose={() => setModalOpen(false)}>
        <div className="grid gap-3">
          <div>
            <label className="label-field">Course</label>
            <select className="input-field" value={form.course} onChange={(e) => setForm({ ...form, course: e.target.value })}>
              <option value="">Select course</option>
              {courses.map((c) => <option key={c._id} value={c._id}>{c.title}</option>)}
            </select>
          </div>
          <Input label="Subject" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
          <div>
            <label className="label-field">Teacher</label>
            <select className="input-field" value={form.teacher} onChange={(e) => setForm({ ...form, teacher: e.target.value })}>
              <option value="">Select teacher</option>
              {teachers.map((t) => <option key={t._id} value={t._id}>{t.name}</option>)}
            </select>
          </div>
          <div>
            <label className="label-field">Day</label>
            <select className="input-field" value={form.day} onChange={(e) => setForm({ ...form, day: e.target.value })}>
              {days.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Start Time" type="time" value={form.startTime} onChange={(e) => setForm({ ...form, startTime: e.target.value })} />
            <Input label="End Time" type="time" value={form.endTime} onChange={(e) => setForm({ ...form, endTime: e.target.value })} />
          </div>
          <Input label="Room" value={form.room} onChange={(e) => setForm({ ...form, room: e.target.value })} />
          <Button onClick={handleSave} loading={saving}>Add Entry</Button>
        </div>
      </Modal>

      <ConfirmDialog open={!!deleteTarget} title="Delete Schedule Entry" message="Are you sure?" onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} />
    </div>
  );
}
