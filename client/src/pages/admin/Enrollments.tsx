
import { useCallback, useEffect, useState } from "react";
import {
  RefreshCw,
  Search,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  X,
  User,
  Phone,
  Mail,
  BookOpen,
  CreditCard,
} from "lucide-react";
import { api, getErrorMessage } from "../../services/api";

type Enrollment = {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth?: string;
  gender?: string;
  address?: string;
  class?: string;
  group?: string;
  course?: string | { _id?: string; title?: string };
  courseTitle?: string;
  paymentPlan?: string;
  paymentMethod?: string;
  amount?: number;
  senderNumber?: string;
  transactionId?: string;
  status?: string;
  adminNote?: string;
  createdAt?: string;
};

export default function AdminEnrollments() {
  const [items, setItems] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selected, setSelected] = useState<Enrollment | null>(null);
  const [processing, setProcessing] = useState("");

  const loadEnrollments = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await api.get("/enrollments");
      const data = response.data;

      const records = Array.isArray(data)
        ? data
        : data?.requests
        ?? data?.data?.requests
        ?? data?.data?.enrollments
        ?? data?.enrollments
        ?? [];

      setItems(Array.isArray(records) ? records : []);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadEnrollments();
  }, [loadEnrollments]);

  async function updateStatus(id: string, action: "approve" | "reject") {
    const message =
      action === "approve"
        ? "এই আবেদনটি Approve করতে চাও?"
        : "এই আবেদনটি Reject করতে চাও?";

    if (!window.confirm(message)) return;

    setProcessing(id);

    try {
      await api.patch(`/enrollments/${id}/${action}`);
      setSelected(null);
      await loadEnrollments();
      window.alert(
        action === "approve"
          ? "Enrollment approved successfully."
          : "Enrollment rejected successfully."
      );
    } catch (err) {
      window.alert(getErrorMessage(err));
    } finally {
      setProcessing("");
    }
  }

  const filtered = items.filter((item) => {
    const query = search.toLowerCase();

    const matchesSearch = [
      item.fullName,
      item.email,
      item.phone,
      item.courseTitle,
      item.transactionId,
      item.senderNumber,
    ]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(query));

    const matchesStatus =
      statusFilter === "ALL" ||
      (item.status || "PENDING").toUpperCase() === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const pendingCount = items.filter(
    (item) => (item.status || "PENDING").toUpperCase() === "PENDING"
  ).length;

  const approvedCount = items.filter(
    (item) => item.status?.toUpperCase() === "APPROVED"
  ).length;

  const rejectedCount = items.filter(
    (item) => item.status?.toUpperCase() === "REJECTED"
  ).length;

  function statusStyle(status?: string) {
    switch (status?.toUpperCase()) {
      case "APPROVED":
        return "bg-green-100 text-green-700";
      case "REJECTED":
        return "bg-red-100 text-red-700";
      default:
        return "bg-amber-100 text-amber-700";
    }
  }

  function courseName(item: Enrollment) {
    if (typeof item.course === "object") {
      return item.course?.title || item.courseTitle || "Course";
    }

    return item.courseTitle || "Course";
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Course Enrollments
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Review and manage student enrollment applications.
          </p>
        </div>

        <button
          onClick={loadEnrollments}
          disabled={loading}
          className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-5 dark:border-amber-900 dark:bg-amber-950/30">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-amber-700">Pending</p>
            <Clock className="h-5 w-5 text-amber-600" />
          </div>
          <p className="mt-2 text-3xl font-bold text-amber-800">
            {pendingCount}
          </p>
        </div>

        <div className="rounded-xl border border-green-200 bg-green-50 p-5 dark:border-green-900 dark:bg-green-950/30">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-green-700">Approved</p>
            <CheckCircle className="h-5 w-5 text-green-600" />
          </div>
          <p className="mt-2 text-3xl font-bold text-green-800">
            {approvedCount}
          </p>
        </div>

        <div className="rounded-xl border border-red-200 bg-red-50 p-5 dark:border-red-900 dark:bg-red-950/30">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-red-700">Rejected</p>
            <XCircle className="h-5 w-5 text-red-600" />
          </div>
          <p className="mt-2 text-3xl font-bold text-red-800">
            {rejectedCount}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search name, email, phone or transaction ID..."
            className="w-full rounded-lg border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm outline-none focus:border-brand-gold dark:border-slate-700 dark:bg-slate-900"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-900"
        >
          <option value="ALL">All Applications</option>
          <option value="PENDING">Pending</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
        </select>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        {loading ? (
          <div className="p-10 text-center text-slate-500">
            Loading applications...
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-10 text-center text-slate-500">
            No enrollment applications found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500 dark:bg-slate-800">
                <tr>
                  <th className="px-5 py-4">Applicant</th>
                  <th className="px-5 py-4">Course</th>
                  <th className="px-5 py-4">Payment</th>
                  <th className="px-5 py-4">Transaction ID</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filtered.map((item) => (
                  <tr key={item._id}>
                    <td className="px-5 py-4">
                      <p className="font-semibold text-slate-900 dark:text-white">
                        {item.fullName}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {item.phone}
                      </p>
                      <p className="text-xs text-slate-500">{item.email}</p>
                    </td>

                    <td className="px-5 py-4">
                      {courseName(item)}
                    </td>

                    <td className="px-5 py-4">
                      <p>{item.paymentPlan || "—"}</p>
                      <p className="text-xs text-slate-500">
                        {item.paymentMethod || "—"}
                      </p>
                    </td>

                    <td className="px-5 py-4 font-mono text-xs">
                      {item.transactionId || "—"}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyle(item.status)}`}
                      >
                        {item.status || "PENDING"}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <button
                        onClick={() => setSelected(item)}
                        className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
                      >
                        <Eye className="h-4 w-4" />
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 p-4">
          <div className="my-auto max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl dark:bg-slate-900">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  Application Details
                </h3>
                <p className="mt-1 text-xs text-slate-500">
                  ID: {selected._id}
                </p>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {[
                { label: "Full Name", value: selected.fullName, icon: User },
                { label: "Phone", value: selected.phone, icon: Phone },
                { label: "Email", value: selected.email, icon: Mail },
                { label: "Course", value: courseName(selected), icon: BookOpen },
                { label: "Class", value: selected.class, icon: User },
                { label: "Group", value: selected.group, icon: User },
                { label: "Payment Plan", value: selected.paymentPlan, icon: CreditCard },
                { label: "Payment Method", value: selected.paymentMethod, icon: CreditCard },
                { label: "Sender Number", value: selected.senderNumber, icon: Phone },
                { label: "Transaction ID", value: selected.transactionId, icon: CreditCard },
                { label: "Gender", value: selected.gender, icon: User },
                {
                  label: "Date of Birth",
                  value: selected.dateOfBirth
                    ? new Date(selected.dateOfBirth).toLocaleDateString()
                    : "",
                  icon: Clock,
                },
              ].map((field) => (
                <div
                  key={field.label}
                  className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800"
                >
                  <p className="flex items-center gap-2 text-xs text-slate-500">
                    <field.icon className="h-4 w-4" />
                    {field.label}
                  </p>
                  <p className="mt-1 break-words text-sm font-semibold text-slate-900 dark:text-white">
                    {field.value || "—"}
                  </p>
                </div>
              ))}

              <div className="rounded-lg bg-slate-50 p-3 sm:col-span-2 dark:bg-slate-800">
                <p className="text-xs text-slate-500">Address</p>
                <p className="mt-1 text-sm text-slate-900 dark:text-white">
                  {selected.address || "—"}
                </p>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyle(selected.status)}`}
              >
                {selected.status || "PENDING"}
              </span>

              {(selected.status || "PENDING").toUpperCase() === "PENDING" && (
                <div className="flex gap-2">
                  <button
                    disabled={processing === selected._id}
                    onClick={() => updateStatus(selected._id, "reject")}
                    className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
                  >
                    <XCircle className="h-4 w-4" />
                    Reject
                  </button>

                  <button
                    disabled={processing === selected._id}
                    onClick={() => updateStatus(selected._id, "approve")}
                    className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
                  >
                    <CheckCircle className="h-4 w-4" />
                    Approve
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

