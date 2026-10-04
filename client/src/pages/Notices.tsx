import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Bell, ArrowRight } from "lucide-react";
import { api, getErrorMessage } from "../services/api";
import { Notice } from "../types";
import { Loader } from "../components/Loader";
import { EmptyState } from "../components/EmptyState";
import { ErrorState } from "../components/ErrorState";
import { Card } from "../components/Card";

export default function Notices() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/notices/public")
      .then((r) => setNotices(r.data.data))
      .catch((e) => setError(getErrorMessage(e)))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="container-page py-16">
      <div className="mb-10 text-center">
        <h1 className="font-display text-4xl font-bold text-brand-navy dark:text-white">Notices</h1>
        <p className="mt-2 text-slate-500">Stay updated with the latest announcements.</p>
      </div>

      {loading ? (
        <Loader />
      ) : error ? (
        <ErrorState message={error} />
      ) : notices.length === 0 ? (
        <EmptyState message="No notices published yet." />
      ) : (
        <div className="mx-auto max-w-3xl space-y-4">
          {notices.map((n, i) => (
            <Card key={n._id} delay={i * 0.05} className="flex items-start gap-4">
              <div className="rounded-full bg-brand-navy/10 p-3">
                <Bell className="h-5 w-5 text-brand-navy dark:text-brand-goldLight" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase text-brand-gold">{n.category}</span>
                  <span className="text-xs text-slate-400">{new Date(n.date).toLocaleDateString()}</span>
                </div>
                <h3 className="mt-1 font-semibold text-brand-navy dark:text-white">{n.title}</h3>
                <p className="mt-1 line-clamp-2 text-sm text-slate-500">{n.description}</p>
                <Link to={`/notices/${n.slug}`} className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-brand-navy hover:underline dark:text-brand-goldLight">
                  Read more <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
