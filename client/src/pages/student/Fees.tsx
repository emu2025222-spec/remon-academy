import { useEffect, useState } from "react";
import { api, getErrorMessage } from "../../services/api";
import { Fee, Course } from "../../types";
import { Loader } from "../../components/Loader";
import { EmptyState } from "../../components/EmptyState";
import { Badge } from "../../components/Badge";
import { useToast } from "../../components/Toast";

export default function StudentFees() {
  const [fees, setFees] = useState<Fee[]>([]);
  const [pendingTotal, setPendingTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const { show } = useToast();

  useEffect(() => {
    api
      .get("/fees/my")
      .then((r) => {
        const data = r.data.data;

        setFees(data.fees || []);
        setPendingTotal(data.pendingTotal || 0);
        setLoading(false);
      })
      .catch((err) => {
        show(getErrorMessage(err), "error");
        setLoading(false);
      });
  }, [show]);

  if (loading) return <Loader />;

  const totalAmount = fees.reduce(
    (sum, fee) => sum + Number(fee.amount || 0),
    0
  );

  const totalPaid = fees.reduce(
    (sum, fee) => sum + Number(fee.amountPaid || 0),
    0
  );

  const totalDue = Math.max(
    totalAmount - totalPaid,
    0
  );

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white">
            Fees
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Your fee records for all assigned courses.
          </p>
        </div>

        <div className="rounded-xl bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 dark:bg-red-950/30 dark:text-red-400">
          Pending: ৳{pendingTotal}
        </div>
      </div>

      {/* Summary */}
      {fees.length > 0 && (
        <div className="mb-6 grid gap-4 sm:grid-cols-3">
          <div className="card p-5">
            <p className="text-xs text-slate-500">
              Total Fee
            </p>

            <p className="mt-1 text-xl font-bold text-slate-900 dark:text-white">
              ৳{totalAmount}
            </p>
          </div>

          <div className="card p-5">
            <p className="text-xs text-slate-500">
              Total Paid
            </p>

            <p className="mt-1 text-xl font-bold text-green-600">
              ৳{totalPaid}
            </p>
          </div>

          <div className="card p-5">
            <p className="text-xs text-slate-500">
              Total Due
            </p>

            <p className="mt-1 text-xl font-bold text-red-600">
              ৳{totalDue}
            </p>
          </div>
        </div>
      )}

      {/* Fee Records */}
      {fees.length === 0 ? (
        <EmptyState message="No fee records found." />
      ) : (
        <div className="card overflow-x-auto p-0">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase text-slate-400 dark:bg-slate-800/50">
              <tr>
                <th className="px-4 py-3">
                  Course
                </th>

                <th className="px-4 py-3">
                  Amount
                </th>

                <th className="px-4 py-3">
                  Paid
                </th>

                <th className="px-4 py-3">
                  Due
                </th>

                <th className="px-4 py-3">
                  Due Date
                </th>

                <th className="px-4 py-3">
                  Status
                </th>
              </tr>
            </thead>

            <tbody>
              {fees.map((fee) => {
                const course =
                  typeof fee.course === "object" &&
                  fee.course !== null
                    ? (fee.course as Course)
                    : null;

                const due = Math.max(
                  Number(fee.amount || 0) -
                    Number(fee.amountPaid || 0),
                  0
                );

                return (
                  <tr
                    key={fee._id}
                    className="border-t border-slate-100 dark:border-slate-800"
                  >
                    {/* Course */}
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-slate-800 dark:text-slate-200">
                          {course?.title || "Course"}
                        </p>

                        {course?.subject && (
                          <p className="mt-0.5 text-xs text-slate-400">
                            {course.subject}
                          </p>
                        )}
                      </div>
                    </td>

                    {/* Amount */}
                    <td className="px-4 py-3">
                      ৳{fee.amount}
                    </td>

                    {/* Paid */}
                    <td className="px-4 py-3 font-medium text-green-600">
                      ৳{fee.amountPaid}
                    </td>

                    {/* Due */}
                    <td className="px-4 py-3 font-medium text-red-600">
                      ৳{due}
                    </td>

                    {/* Due Date */}
                    <td className="px-4 py-3">
                      {new Date(
                        fee.dueDate
                      ).toLocaleDateString()}
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3">
                      <Badge
                        color={
                          fee.status === "PAID"
                            ? "green"
                            : fee.status === "PARTIAL"
                            ? "gold"
                            : "red"
                        }
                      >
                        {fee.status}
                      </Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}