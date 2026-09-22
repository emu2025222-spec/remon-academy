import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { api } from "../../services/api";
import { AttendanceRecord, Course } from "../../types";
import { Loader } from "../../components/Loader";
import { Badge } from "../../components/Badge";

export default function StudentAttendance() {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [stats, setStats] = useState({ total: 0, present: 0, absent: 0, late: 0, percentage: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/attendance/my").then((r) => {
      setRecords(r.data.data.records);
      setStats(r.data.data.stats);
      setLoading(false);
    });
  }, []);

  if (loading) return <Loader />;

  const chartData = [
    { name: "Present", value: stats.present, color: "#16a34a" },
    { name: "Absent", value: stats.absent, color: "#dc2626" },
    { name: "Late", value: stats.late, color: "#eab308" },
  ];

  return (
    <div>
      <h2 className="mb-6 font-display text-2xl font-bold text-slate-900 dark:text-white">Attendance</h2>
      <div className="grid gap-6 md:grid-cols-3">
        <div className="card p-6 md:col-span-1">
          <p className="mb-2 text-center text-3xl font-bold text-brand-navy dark:text-brand-goldLight">{stats.percentage}%</p>
          <p className="mb-4 text-center text-sm text-slate-500">Overall Attendance</p>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={chartData} dataKey="value" innerRadius={45} outerRadius={70}>
                {chartData.map((d) => <Cell key={d.name} fill={d.color} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-4 text-xs">
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-green-600" /> Present {stats.present}</span>
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-red-600" /> Absent {stats.absent}</span>
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-yellow-500" /> Late {stats.late}</span>
          </div>
        </div>

        <div className="card overflow-x-auto p-0 md:col-span-2">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-left text-xs uppercase text-slate-400">
              <tr><th className="px-4 py-3">Date</th><th className="px-4 py-3">Course</th><th className="px-4 py-3">Status</th></tr>
            </thead>
            <tbody>
              {records.map((r) => (
                <tr key={r._id} className="border-t border-slate-100 dark:border-slate-800">
                  <td className="px-4 py-3">{new Date(r.date).toLocaleDateString()}</td>
                  <td className="px-4 py-3">{typeof r.course === "object" ? (r.course as Course).title : "-"}</td>
                  <td className="px-4 py-3">
                    <Badge color={r.status === "PRESENT" ? "green" : r.status === "LATE" ? "gold" : "red"}>{r.status}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
