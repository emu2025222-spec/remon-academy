import { useEffect, useState } from "react";
import { Trash2, Mail, MailOpen } from "lucide-react";
import { api, getErrorMessage } from "../../services/api";
import { PaginatedResponse } from "../../types";
import { Loader } from "../../components/Loader";
import { EmptyState } from "../../components/EmptyState";
import { Pagination } from "../../components/Pagination";
import { ConfirmDialog } from "../../components/ConfirmDialog";
import { Badge } from "../../components/Badge";
import { useToast } from "../../components/Toast";

interface ContactMsg { _id: string; name: string; email: string; phone?: string; subject: string; message: string; isRead: boolean; createdAt: string }

export default function AdminMessages() {
  const [data, setData] = useState<PaginatedResponse<ContactMsg> | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<ContactMsg | null>(null);
  const { show } = useToast();

  function load() {
    setLoading(true);
    api.get("/contact", { params: { page } }).then((r) => setData(r.data.data)).finally(() => setLoading(false));
  }
  useEffect(load, [page]);

  async function markRead(id: string) {
    try { await api.patch(`/contact/${id}/read`); load(); } catch (err) { show(getErrorMessage(err), "error"); }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    try { await api.delete(`/contact/${deleteTarget._id}`); show("Message deleted", "success"); setDeleteTarget(null); load(); }
    catch (err) { show(getErrorMessage(err), "error"); }
  }

  return (
    <div>
      <h2 className="mb-6 font-display text-2xl font-bold text-slate-900 dark:text-white">Contact Messages</h2>

      {loading ? <Loader /> : !data || data.data.length === 0 ? <EmptyState message="No messages yet." /> : (
        <div className="space-y-3">
          {data.data.map((m) => (
            <div key={m._id} className="card p-5">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-slate-900 dark:text-white">{m.subject}</h3>
                    <Badge color={m.isRead ? "gray" : "gold"}>{m.isRead ? "Read" : "New"}</Badge>
                  </div>
                  <p className="text-xs text-slate-400">{m.name} · {m.email} {m.phone && `· ${m.phone}`}</p>
                </div>
                <div className="flex gap-2">
                  {!m.isRead && (
                    <button onClick={() => markRead(m._id)} className="rounded p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800"><MailOpen className="h-4 w-4" /></button>
                  )}
                  {m.isRead && <Mail className="h-4 w-4 text-slate-300" />}
                  <button onClick={() => setDeleteTarget(m)} className="rounded p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-950"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{m.message}</p>
              <p className="mt-2 text-xs text-slate-400">{new Date(m.createdAt).toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}

      {data && <Pagination page={data.page} totalPages={data.totalPages} onChange={setPage} />}

      <ConfirmDialog open={!!deleteTarget} title="Delete Message" message="Delete this message?" onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} />
    </div>
  );
}
