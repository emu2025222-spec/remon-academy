import { useEffect, useState } from "react";
import { Users, GraduationCap, BookOpen, Wallet, CalendarCheck, Mail } from "lucide-react";
import { api } from "../../services/api";
import { Notice } from "../../types";
import { Loader } from "../../components/Loader";

interface Stats {
  totalStudents: number;
  activeStudents: number;
  totalCourses: number;
  totalTeachers: number;
  pendingFees: number;
  todayAttendance: number;
  newMessages: number;
  latestNotices: Notice[];
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    api.get("/dashboard/admin-stats").then((r) => setStats(r.data.data));
  }, []);

  if (!stats) return <Loader label="Loading dashboard..." />;

  const cards = [
    { icon: Users, label: "Total Students", value: stats.totalStudents },
    { icon: Users, label: "Active Students", value: stats.activeStudents },
    { icon: BookOpen, label: "Total Courses", value: stats.totalCourses },
    { icon: GraduationCap, label: "Total Teachers", value: stats.totalTeachers },
    { icon: Wallet, label: "Pending Fees", value: stats.pendingFees },
    { icon: CalendarCheck, label: "Today's Attendance", value: stats.todayAttendance },
    { icon: Mail, label: "New Messages", value: stats.newMessages },
  ];

  return (
    <div>
      <h2 className="mb-6 font-display text-2xl font-bold text-slate-900 dark:text-white">Admin Dashboard</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="card flex items-center gap-4 p-5">
            <div className="rounded-full bg-brand-navy/10 p-3">
              <c.icon className="h-6 w-6 text-brand-navy dark:text-brand-goldLight" />
            </div>
            <div>
              <p className="text-xs text-slate-500">{c.label}</p>
              <p className="text-xl font-bold text-slate-900 dark:text-white">{c.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 card p-6">
        <h3 className="mb-4 font-display text-lg font-semibold text-slate-900 dark:text-white">Latest Notices</h3>
        <ul className="space-y-3">
          {stats.latestNotices.map((n) => (
            <li key={n._id} className="border-b border-slate-100 pb-3 last:border-0 dark:border-slate-800">
              <p className="font-medium text-slate-800 dark:text-slate-200">{n.title}</p>
              <p className="text-xs text-slate-400">{new Date(n.date).toLocaleDateString()}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
