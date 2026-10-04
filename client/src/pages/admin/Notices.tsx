import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import { api, getErrorMessage } from "../../services/api";
import { Notice, PaginatedResponse } from "../../types";
import { Loader } from "../../components/Loader";
import { EmptyState } from "../../components/EmptyState";
import { Pagination } from "../../components/Pagination";
import { Modal } from "../../components/Modal";
import { ConfirmDialog } from "../../components/ConfirmDialog";
import { Input } from "../../components/Input";
import { Button } from "../../components/Button";
import { Badge } from "../../components/Badge";
import { useToast } from "../../components/Toast";

interface FormState { title: string; description: string; category: string; date: string }
const emptyForm: FormState = { title: "", description: "", category: "General", date: new Date().toISOString().slice(0, 10) };

export default function AdminNotices() {
  const [data, setData] = useState<PaginatedResponse<Notice> | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Notice | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Notice | null>(null);
  const { show } = useToast();

  function load() {
    setLoading(true);
    api.get("/notices", { params: { page } }).then((r) => setData(r.data.data)).finally(() => setLoading(false));
  }
  useEffect(load, [page]);

  function openCreate() { setEditing(null); setForm(emptyForm); setModalOpen(true); }
  function openEdit(n: Notice) {
    setEditing(n);
    setForm({ title: n.title, description: n.description, category: n.category, date: n.date.slice(0, 10) });
    setModalOpen(true);
  }

  async function handleSave() {
    setSaving(true);
    try {
      if (editing) { await api.put(`/notices/${editing._id}`, form); show("Notice updated", "success"); }
      else {
        const me = await api.get("/auth/me");
        const authorId = (me.data.data.profile as { _id: string })._id;
        await api.post("/notices", { ...form, author: authorId });
        show("Notice created", "success");
      }
      setModalOpen(false);
      load();
    } catch (err) { show(getErrorMessage(err), "error"); } finally { setSaving(false); }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    try { await api.delete(`/notices/${deleteTarget._id}`); show("Notice deleted", "success"); setDeleteTarget(null); load(); }
    catch (err) { show(getErrorMessage(err), "error"); }
  }

  async function togglePublish(n: Notice) {
    try { await api.patch(`/notices/${n._id}/toggle-publish`); load(); } catch (err) { show(getErrorMessage(err), "error"); }
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white">Notices</h2>
        <Button onClick={openCreate}><Plus className="h-4 w-4" /> Add Notice</Button>
      </div>

      {loading ? <Loader /> : !data || data.data.length === 0 ? <EmptyState message="No notices yet." /> : (
        <div className="card overflow-x-auto p-0">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-left text-xs uppercase text-slate-400">
              <tr><th className="px-4 py-3">Title</th><th className="px-4 py-3">Category</th><th className="px-4 py-3">Date</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Actions</th></tr>
            </thead>
            <tbody>
              {data.data.map((n) => (
                <tr key={n._id} className="border-t border-slate-100 dark:border-slate-800">
                  <td className="px-4 py-3">{n.title}</td>
                  <td className="px-4 py-3">{n.category}</td>
                  <td className="px-4 py-3">{new Date(n.date).toLocaleDateString()}</td>
                  <td className="px-4 py-3"><Badge color={n.isPublished ? "green" : "gray"}>{n.isPublished ? "Published" : "Draft"}</Badge></td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(n)} className="rounded p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800"><Pencil className="h-4 w-4" /></button>
                      <button onClick={() => togglePublish(n)} className="rounded p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800">{n.isPublished ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>
                      <button onClick={() => setDeleteTarget(n)} className="rounded p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-950"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {data && <Pagination page={data.page} totalPages={data.totalPages} onChange={setPage} />}

      <Modal open={modalOpen} title={editing ? "Edit Notice" : "Add Notice"} onClose={() => setModalOpen(false)}>
        <div className="grid gap-3">
          <Input label="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <div>
            <label className="label-field">Description</label>
            <textarea className="input-field" rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <Input label="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
          <Input label="Date" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
          <Button onClick={handleSave} loading={saving}>{editing ? "Save Changes" : "Create Notice"}</Button>
        </div>
      </Modal>

      <ConfirmDialog open={!!deleteTarget} title="Delete Notice" message={`Delete "${deleteTarget?.title}"?`} onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} />
    </div>
  );
}
