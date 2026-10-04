import { useEffect, useState } from "react";
import { api } from "../../services/api";
import { Notice } from "../../types";
import { Loader } from "../../components/Loader";
import { EmptyState } from "../../components/EmptyState";

export default function StudentNotices() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/notices/public").then((r) => setNotices(r.data.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;
  if (notices.length === 0) return <EmptyState message="No notices published yet." />;

  return (
    <div>
      <h2 className="mb-6 font-display text-2xl font-bold text-slate-900 dark:text-white">Notices</h2>
      <div className="space-y-3">
        {notices.map((n) => (
          <div key={n._id} className="card p-5">
            <span className="text-xs font-semibold uppercase text-brand-gold">{n.category}</span>
            <h3 className="mt-1 font-semibold text-slate-900 dark:text-white">{n.title}</h3>
            <p className="mt-1 text-sm text-slate-500">{n.description}</p>
            <p className="mt-2 text-xs text-slate-400">{new Date(n.date).toLocaleDateString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
