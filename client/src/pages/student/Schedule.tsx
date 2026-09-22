import { useEffect, useState } from "react";
import { api } from "../../services/api";
import { ScheduleItem, Teacher } from "../../types";
import { Loader } from "../../components/Loader";
import { EmptyState } from "../../components/EmptyState";

const dayOrder = ["SAT", "SUN", "MON", "TUE", "WED", "THU", "FRI"];

export default function StudentSchedule() {
  const [items, setItems] = useState<ScheduleItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/schedule/my").then((r) => setItems(r.data.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;
  if (items.length === 0) return <EmptyState message="No class schedule available yet." />;

  const sorted = [...items].sort((a, b) => dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day));

  return (
    <div>
      <h2 className="mb-6 font-display text-2xl font-bold text-slate-900 dark:text-white">Class Schedule</h2>
      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 dark:bg-slate-800/50 text-left text-xs uppercase text-slate-400">
            <tr>
              <th className="px-4 py-3">Day</th>
              <th className="px-4 py-3">Subject</th>
              <th className="px-4 py-3">Teacher</th>
              <th className="px-4 py-3">Room</th>
              <th className="px-4 py-3">Time</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((s) => (
              <tr key={s._id} className="border-t border-slate-100 dark:border-slate-800">
                <td className="px-4 py-3 font-medium">{s.day}</td>
                <td className="px-4 py-3">{s.subject}</td>
                <td className="px-4 py-3">{typeof s.teacher === "object" ? (s.teacher as Teacher).name : "-"}</td>
                <td className="px-4 py-3">{s.room}</td>
                <td className="px-4 py-3">{s.startTime} - {s.endTime}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
