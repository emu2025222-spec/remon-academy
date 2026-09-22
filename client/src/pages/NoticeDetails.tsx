import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Paperclip } from "lucide-react";
import { api, getErrorMessage } from "../services/api";
import { Notice } from "../types";
import { Loader } from "../components/Loader";
import { ErrorState } from "../components/ErrorState";

export default function NoticeDetails() {
  const { id } = useParams();
  const [notice, setNotice] = useState<Notice | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get(`/notices/public/${id}`)
      .then((r) => setNotice(r.data.data))
      .catch((e) => setError(getErrorMessage(e)))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Loader />;
  if (error || !notice) return <ErrorState message={error || "Notice not found"} />;

  return (
    <div className="container-page max-w-2xl py-16">
      <Link to="/notices" className="mb-6 inline-flex items-center gap-1 text-sm text-slate-500 hover:text-brand-navy">
        <ArrowLeft className="h-4 w-4" /> Back to notices
      </Link>
      <span className="text-xs font-semibold uppercase text-brand-gold">{notice.category}</span>
      <h1 className="mt-1 font-display text-2xl font-bold text-brand-navy dark:text-white">{notice.title}</h1>
      <p className="mt-1 text-xs text-slate-400">{new Date(notice.date).toLocaleDateString()}</p>
      <p className="mt-4 whitespace-pre-line text-slate-600 dark:text-slate-300">{notice.description}</p>
      {notice.attachment && (
        <a href={notice.attachment} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-brand-navy hover:underline dark:text-brand-goldLight">
          <Paperclip className="h-4 w-4" /> View Attachment
        </a>
      )}
    </div>
  );
}
