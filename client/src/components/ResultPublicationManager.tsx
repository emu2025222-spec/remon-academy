
import { useCallback, useEffect, useState } from "react";
import {
  CalendarClock,
  CheckCircle2,
  Clock,
  Plus,
  RefreshCw,
  Trash2,
  XCircle,
} from "lucide-react";

import { api, getErrorMessage } from "../services/api";
import { Button } from "./Button";
import { Input } from "./Input";
import { Modal } from "./Modal";
import { ConfirmDialog } from "./ConfirmDialog";
import { Loader } from "./Loader";
import { EmptyState } from "./EmptyState";
import { useToast } from "./Toast";

interface Publication {
  _id: string;
  examName: string;
  publishAt: string;
  status: "SCHEDULED" | "CANCELLED";
  isReleased?: boolean;
}

interface PublicationForm {
  examName: string;
  publishAt: string;
}

const emptyForm: PublicationForm = {
  examName: "",
  publishAt: "",
};

const formatDateTime = (value: string) => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const toLocalDateTime = (value: string) => {
  const date = new Date(value);
  const offset = date.getTimezoneOffset() * 60000;

  return new Date(date.getTime() - offset)
    .toISOString()
    .slice(0, 16);
};

export default function ResultPublicationManager() {
  const { show } = useToast();

  const [publications, setPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Publication | null>(null);
  const [form, setForm] = useState<PublicationForm>(emptyForm);

  const [deleteTarget, setDeleteTarget] = useState<Publication | null>(null);

  const loadPublications = useCallback(async () => {
    setLoading(true);

    try {
      const response = await api.get("/result-publications");
      const payload = response.data.data;

      setPublications(
        Array.isArray(payload)
          ? payload
          : payload?.publications || payload?.data || []
      );
    } catch (error) {
      show(getErrorMessage(error), "error");
    } finally {
      setLoading(false);
    }
  }, [show]);

  useEffect(() => {
    loadPublications();
  }, [loadPublications]);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (item: Publication) => {
    setEditing(item);
    setForm({
      examName: item.examName,
      publishAt: toLocalDateTime(item.publishAt),
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.examName.trim()) {
      show("Please enter an exam name.", "error");
      return;
    }

    if (!form.publishAt) {
      show("Please select publication date and time.", "error");
      return;
    }

    const publishDate = new Date(form.publishAt);

    if (Number.isNaN(publishDate.getTime())) {
      show("Invalid publication date.", "error");
      return;
    }

    setSaving(true);

    try {
      const payload = {
        examName: form.examName.trim(),
        publishAt: publishDate.toISOString(),
      };

      if (editing) {
        await api.put(
          `/result-publications/${editing._id}`,
          payload
        );
        show("Publication schedule updated.", "success");
      } else {
        await api.post("/result-publications", payload);
        show("Publication schedule created.", "success");
      }

      setModalOpen(false);
      setEditing(null);
      setForm(emptyForm);

      await loadPublications();
    } catch (error) {
      show(getErrorMessage(error), "error");
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async (item: Publication) => {
    try {
      await api.patch(
        `/result-publications/${item._id}/toggle`
      );

      show(
        item.status === "SCHEDULED"
          ? "Publication schedule cancelled."
          : "Publication schedule re-enabled.",
        "success"
      );

      await loadPublications();
    } catch (error) {
      show(getErrorMessage(error), "error");
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
      await api.delete(
        `/result-publications/${deleteTarget._id}`
      );

      show("Publication schedule deleted.", "success");
      setDeleteTarget(null);

      await loadPublications();
    } catch (error) {
      show(getErrorMessage(error), "error");
    }
  };

  const getStatus = (item: Publication) => {
    if (item.status === "CANCELLED") {
      return {
        label: "Cancelled",
        className: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
      };
    }

    if (new Date(item.publishAt).getTime() <= Date.now()) {
      return {
        label: "Published",
        className: "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300",
      };
    }

    return {
      label: "Scheduled",
      className: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
    };
  };

  return (
    <div className="space-y-5">
      <div className="card p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <CalendarClock className="h-5 w-5 text-amber-500" />
              <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white">
                Result Publication Schedule
              </h3>
            </div>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Control when students can access examination results.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button onClick={loadPublications}>
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>

            <Button onClick={openCreate}>
              <Plus className="h-4 w-4" />
              Create Schedule
            </Button>
          </div>
        </div>
      </div>

      {loading ? (
        <Loader />
      ) : publications.length === 0 ? (
        <EmptyState message="No publication schedules created yet." />
      ) : (
        <div className="grid gap-4">
          {publications.map((item) => {
            const status = getStatus(item);

            return (
              <div key={item._id} className="card p-5">
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="font-display text-lg font-bold text-slate-900 dark:text-white">
                        {item.examName}
                      </h4>

                      <span className={`rounded-full px-3 py-1 text-xs font-bold ${status.className}`}>
                        {status.label}
                      </span>
                    </div>

                    <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                      <Clock className="h-4 w-4" />
                      <span>Publication time:</span>
                      <strong className="text-slate-700 dark:text-slate-200">
                        {formatDateTime(item.publishAt)}
                      </strong>
                    </div>

                    {item.status === "SCHEDULED" &&
                      new Date(item.publishAt).getTime() > Date.now() && (
                        <p className="mt-2 text-xs text-amber-600 dark:text-amber-400">
                          Results will become available automatically at the scheduled time.
                        </p>
                      )}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => openEdit(item)}
                      className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                    >
                      Edit Schedule
                    </button>

                    <button
                      type="button"
                      onClick={() => handleToggle(item)}
                      className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold ${
                        item.status === "SCHEDULED"
                          ? "bg-amber-50 text-amber-700 hover:bg-amber-100 dark:bg-amber-950 dark:text-amber-300"
                          : "bg-green-50 text-green-700 hover:bg-green-100 dark:bg-green-950 dark:text-green-300"
                      }`}
                    >
                      {item.status === "SCHEDULED" ? (
                        <>
                          <XCircle className="h-4 w-4" />
                          Cancel
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="h-4 w-4" />
                          Re-enable
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeleteTarget(item)}
                      className="rounded-lg p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950"
                      title="Delete schedule"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Modal
        open={modalOpen}
        title={editing ? "Edit Publication Schedule" : "Create Publication Schedule"}
        onClose={() => {
          if (!saving) setModalOpen(false);
        }}
      >
        <div className="grid gap-4">
          <Input
            label="Exam Name"
            placeholder="Example: Half Yearly Examination 2026"
            value={form.examName}
            onChange={(event) =>
              setForm({ ...form, examName: event.target.value })
            }
          />

          <Input
            label="Publication Date & Time"
            type="datetime-local"
            value={form.publishAt}
            onChange={(event) =>
              setForm({ ...form, publishAt: event.target.value })
            }
          />

          <p className="text-xs text-slate-500 dark:text-slate-400">
            Use your local date and time. Students will only see this exam's
            results after the scheduled publication time.
          </p>

          <Button onClick={handleSave} loading={saving}>
            {editing ? "Update Schedule" : "Create Schedule"}
          </Button>
        </div>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Publication Schedule"
        message="Are you sure you want to permanently delete this publication schedule?"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
