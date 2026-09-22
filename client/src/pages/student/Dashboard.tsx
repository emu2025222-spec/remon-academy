import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen, CalendarCheck, Award, Bell, Wallet } from "lucide-react";
import { api } from "../../services/api";
import { Course, Notice } from "../../types";
import { Loader } from "../../components/Loader";

interface Summary {
  fullName: string;
  studentId: string;
  course?: Course | string;
}

export default function StudentDashboard() {
  const [profile, setProfile] = useState<Summary | null>(null);
  const [attendancePct, setAttendancePct] = useState(0);
  const [latestGpa, setLatestGpa] = useState<number | null>(null);
  const [pendingFees, setPendingFees] = useState(0);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get("/students/me"),
      api.get("/attendance/my").catch(() => ({ data: { data: { stats: { percentage: 0 } } } })),
      api.get("/results/my").catch(() => ({ data: { data: { results: [] } } })),
      api.get("/fees/my").catch(() => ({ data: { data: { pendingTotal: 0 } } })),
      api.get("/notices/public").catch(() => ({ data: { data: [] } })),
    ]).then(([p, att, res, fees, notice]) => {
      setProfile(p.data.data);
      setAttendancePct(att.data.data.stats?.percentage || 0);
      const results = res.data.data.results || [];
      setLatestGpa(results.length ? results[0].gpa : null);
      setPendingFees(fees.data.data.pendingTotal || 0);
      setNotices(notice.data.data.slice(0, 3));
      setLoading(false);
    });
  }, []);

  if (loading) return <Loader label="Loading your dashboard..." />;

  const courseTitle = profile?.course && typeof profile.course === "object" ? (profile.course as Course).title : "Not assigned";

  return (
    <div>
      <h2 className="mb-1 font-display text-2xl font-bold text-slate-900 dark:text-white">Welcome, {profile?.fullName} 👋</h2>
      <p className="mb-8 text-sm text-slate-500">Student ID: {profile?.studentId}</p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="card flex items-center gap-4 p-5">
          <BookOpen className="h-8 w-8 text-brand-gold" />
          <div>
            <p className="text-xs text-slate-500">Current Course</p>
            <p className="font-semibold text-slate-900 dark:text-white">{courseTitle}</p>
          </div>
        </div>
        <div className="card flex items-center gap-4 p-5">
          <CalendarCheck className="h-8 w-8 text-brand-gold" />
          <div>
            <p className="text-xs text-slate-500">Attendance</p>
            <p className="font-semibold text-slate-900 dark:text-white">{attendancePct}%</p>
          </div>
        </div>
        <div className="card flex items-center gap-4 p-5">
          <Award className="h-8 w-8 text-brand-gold" />
          <div>
            <p className="text-xs text-slate-500">Latest GPA</p>
            <p className="font-semibold text-slate-900 dark:text-white">{latestGpa ?? "N/A"}</p>
          </div>
        </div>
        <div className="card flex items-center gap-4 p-5">
          <Wallet className="h-8 w-8 text-brand-gold" />
          <div>
            <p className="text-xs text-slate-500">Pending Fees</p>
            <p className="font-semibold text-slate-900 dark:text-white">৳{pendingFees}</p>
          </div>
        </div>
      </div>

      <div className="mt-8 card p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="flex items-center gap-2 font-display text-lg font-semibold text-slate-900 dark:text-white">
            <Bell className="h-5 w-5 text-brand-gold" /> Latest Notices
          </h3>
          <Link to="/student/notices" className="text-sm font-semibold text-brand-navy hover:underline dark:text-brand-goldLight">View all</Link>
        </div>
        <ul className="space-y-3">
          {notices.map((n) => (
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
