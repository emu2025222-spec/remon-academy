import { useEffect, useState } from "react";
import { api } from "../../services/api";
import { Fee, Course } from "../../types";
import { Loader } from "../../components/Loader";
import { EmptyState } from "../../components/EmptyState";
import { Badge } from "../../components/Badge";

export default function StudentFees() {
  const [fees, setFees] = useState<Fee[]>([]);
  const [pendingTotal, setPendingTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/fees/my").then((r) => {
      setFees(r.data.data.fees);
      setPendingTotal(r.data.data.pendingTotal);
      setLoading(false);
    });
  }, []);

  if (loading) return <Loader />;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white">Fees</h2>
        <div className="rounded-xl bg-red-50 px-4 py-2 text-sm font-semibold text-red-600">Pending: ৳{pendingTotal}</div>
      </div>

      {fees.length === 0 ? (
        <EmptyState message="No fee records found." />
      ) : (
        <div className="card overflow-x-auto p-0">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-left text-xs uppercase text-slate-400">
              <tr>
                <th className="px-4 py-3">Course</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Paid</th>
                <th className="px-4 py-3">Due Date</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {fees.map((f) => (
                <tr key={f._id} className="border-t border-slate-100 dark:border-slate-800">
                  <td className="px-4 py-3">{typeof f.course === "object" ? (f.course as Course).title : "-"}</td>
                  <td className="px-4 py-3">৳{f.amount}</td>
                  <td className="px-4 py-3">৳{f.amountPaid}</td>
                  <td className="px-4 py-3">{new Date(f.dueDate).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <Badge color={f.status === "PAID" ? "green" : f.status === "PARTIAL" ? "gold" : "red"}>{f.status}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
