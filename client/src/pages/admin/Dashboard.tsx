import { useEffect, useMemo, useState } from "react";
import {
  Users,
  GraduationCap,
  BookOpen,
  Wallet,
  CalendarCheck,
  Mail,
  TrendingUp,
  TrendingDown,
  CircleDollarSign,
  BarChart3,
  PieChart,
  Activity,
  ArrowUpRight,
  Sparkles,
  Bell,
  Clock3,
  RefreshCw,
  LogIn,
  LogOut,
  Monitor,
  Wifi,
  WifiOff,
  CalendarDays,
} from "lucide-react";

import { api } from "../../services/api";
import { Notice } from "../../types";
import { Loader } from "../../components/Loader";

interface StudentStatus {
  active: number;
  inactive: number;
}

interface FeeOverview {
  totalFee: number;
  totalPaid: number;
  totalDue: number;
  totalRecords: number;
}

interface MonthlyFee {
  month: string;
  totalFee: number;
  paid: number;
  due: number;
}

interface CourseStudents {
  courseId: string;
  courseName: string;
  students: number;
}

interface StudentGrowth {
  year: number;
  month: number;
  count: number;
}

interface Stats {
  totalStudents: number;
  activeStudents: number;
  totalCourses: number;
  totalTeachers: number;
  pendingFees: number;
  todayAttendance: number;
  newMessages: number;
  latestNotices: Notice[];
  studentStatus?: StudentStatus;
  feeOverview?: FeeOverview;
  monthlyFees?: MonthlyFee[];
  courseWiseStudents?: CourseStudents[];
  studentGrowth?: StudentGrowth[];
}

interface OnlineStudent {
  studentObjectId?: string;
  studentId?: string;
  fullName?: string;
  email?: string;
  phone?: string;
  class?: string;
  group?: string;
  profilePhoto?: string;
  loginAt?: string;
  lastActiveAt?: string;
  isOnline?: boolean;
  userAgent?: string;
  ipAddress?: string;
}

interface LoginHistoryItem {
  _id: string;
  role: "ADMIN" | "STUDENT";
  loginAt: string;
  lastActiveAt: string;
  logoutAt?: string | null;
  isOnline?: boolean;
  currentlyOnline?: boolean;
  userAgent?: string;
  ipAddress?: string;
  student?: {
    _id?: string;
    studentId?: string;
    fullName?: string;
    email?: string;
    phone?: string;
  };
  user?: {
    _id?: string;
    name?: string;
    email?: string;
    role?: string;
  };
}

const formatMoney = (value: number) =>
  `৳${Number(value || 0).toLocaleString("en-BD")}`;

const formatMonth = (month: string) => {
  if (!month) return "-";

  const [year, monthNumber] = month.split("-");

  return new Date(
    Number(year),
    Number(monthNumber) - 1,
    1
  ).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
};

const getToday = () =>
  new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Dhaka",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());

const formatDateTime = (value?: string | null) => {
  if (!value) return "Not recorded";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Not recorded";

  return date.toLocaleString("en-BD", {
    timeZone: "Asia/Dhaka",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};

const getDeviceName = (userAgent?: string) => {
  if (!userAgent) return "Unknown device";

  if (/android/i.test(userAgent)) return "Android device";
  if (/iphone|ipad|ipod/i.test(userAgent)) return "Apple device";
  if (/windows/i.test(userAgent)) return "Windows PC";
  if (/macintosh|mac os/i.test(userAgent)) return "Mac";
  if (/linux/i.test(userAgent)) return "Linux device";

  return "Unknown device";
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState("");

  // Online students
  const [onlineStudents, setOnlineStudents] = useState<OnlineStudent[]>([]);
  const [onlineCount, setOnlineCount] = useState(0);
  const [onlineDeviceCount, setOnlineDeviceCount] = useState(0);
  const [onlineLoading, setOnlineLoading] = useState(true);
  const [onlineError, setOnlineError] = useState("");

  // Login history
  const [history, setHistory] = useState<LoginHistoryItem[]>([]);
  const [historyDate, setHistoryDate] = useState(getToday());
  const [historyLoading, setHistoryLoading] = useState(true);
  const [historyError, setHistoryError] = useState("");
  const [historyCount, setHistoryCount] = useState(0);

  const [refreshing, setRefreshing] = useState(false);

  // Main dashboard stats
  useEffect(() => {
    let mounted = true;

    api
      .get("/dashboard/admin-stats")
      .then((r) => {
        if (mounted) setStats(r.data.data);
      })
      .catch((err) => {
        console.error("Admin dashboard error:", err);

        if (mounted) {
          setError("Unable to load dashboard analytics.");
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  // Fetch online students
  const fetchOnlineStudents = async (showLoader = false) => {
    try {
      if (showLoader) setOnlineLoading(true);

      const response = await api.get("/dashboard/online-students");
      const data = response.data.data;

      setOnlineStudents(data.students || []);
      setOnlineCount(
        Number(data.onlineStudentCount ?? data.count ?? 0)
      );
      setOnlineDeviceCount(
        Number(data.onlineDeviceCount ?? data.count ?? 0)
      );

      setOnlineError("");
    } catch (err) {
      console.error("Online students error:", err);
      setOnlineError("Unable to load online students.");
    } finally {
      setOnlineLoading(false);
    }
  };

  // Fetch login history
  const fetchLoginHistory = async (showLoader = false) => {
    try {
      if (showLoader) setHistoryLoading(true);

      const response = await api.get("/dashboard/login-history", {
        params: {
          date: historyDate,
          limit: 100,
        },
      });

      const data = response.data.data;

      setHistory(data.history || []);
      setHistoryCount(Number(data.count || 0));
      setHistoryError("");
    } catch (err) {
      console.error("Login history error:", err);
      setHistoryError("Unable to load login history.");
    } finally {
      setHistoryLoading(false);
    }
  };

  // Initial load and automatic refresh
  useEffect(() => {
    fetchOnlineStudents(true);
    fetchLoginHistory(true);

    const onlineInterval = window.setInterval(() => {
      fetchOnlineStudents();
    }, 10000);

    const historyInterval = window.setInterval(() => {
      fetchLoginHistory();
    }, 30000);

    return () => {
      window.clearInterval(onlineInterval);
      window.clearInterval(historyInterval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Reload history when selected date changes
  useEffect(() => {
    fetchLoginHistory(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [historyDate]);

  const handleRefresh = async () => {
    setRefreshing(true);

    await Promise.all([
      fetchOnlineStudents(true),
      fetchLoginHistory(true),
    ]);

    setRefreshing(false);
  };

  const monthlyFees = useMemo(
    () => stats?.monthlyFees || [],
    [stats]
  );

  const courseWiseStudents = useMemo(
    () => stats?.courseWiseStudents || [],
    [stats]
  );

  const studentGrowth = useMemo(
    () => stats?.studentGrowth || [],
    [stats]
  );

  if (!stats) {
    return <Loader label={error || "Loading dashboard..."} />;
  }

  const fee = stats.feeOverview || {
    totalFee: 0,
    totalPaid: 0,
    totalDue: 0,
    totalRecords: 0,
  };

  const activeStudents =
    stats.studentStatus?.active ?? stats.activeStudents;

  const inactiveStudents =
    stats.studentStatus?.inactive ??
    Math.max(stats.totalStudents - activeStudents, 0);

  const maxCourseStudents = Math.max(
    ...courseWiseStudents.map((item) => item.students),
    1
  );

  const maxMonthlyValue = Math.max(
    ...monthlyFees.map((item) =>
      Math.max(item.paid, item.due)
    ),
    1
  );

  const maxGrowth = Math.max(
    ...studentGrowth.map((item) => item.count),
    1
  );

  const paidPercentage =
    fee.totalFee > 0
      ? Math.round((fee.totalPaid / fee.totalFee) * 100)
      : 0;

  const activePercentage =
    stats.totalStudents > 0
      ? Math.round(
          (activeStudents / stats.totalStudents) * 100
        )
      : 0;

  const cards = [
    {
      icon: Users,
      label: "Total Students",
      value: stats.totalStudents,
      description: "All registered learners",
      color: "bg-violet-50 text-violet-700",
    },
    {
      icon: GraduationCap,
      label: "Active Students",
      value: stats.activeStudents,
      description: "Currently enrolled",
      color: "bg-emerald-50 text-emerald-700",
    },
    {
      icon: BookOpen,
      label: "Academic Courses",
      value: stats.totalCourses,
      description: "Available programs",
      color: "bg-blue-50 text-blue-700",
    },
    {
      icon: Users,
      label: "Teaching Faculty",
      value: stats.totalTeachers,
      description: "Academy educators",
      color: "bg-amber-50 text-amber-700",
    },
    {
      icon: Wallet,
      label: "Pending Fees",
      value: stats.pendingFees,
      description: "Unpaid / partial records",
      color: "bg-rose-50 text-rose-700",
    },
    {
      icon: CalendarCheck,
      label: "Today's Attendance",
      value: stats.todayAttendance,
      description: "Attendance records today",
      color: "bg-cyan-50 text-cyan-700",
    },
    {
      icon: Mail,
      label: "New Messages",
      value: stats.newMessages,
      description: "Unread contact messages",
      color: "bg-slate-100 text-slate-700",
    },
  ];

  return (
    <div className="min-w-0 space-y-6 text-slate-800">

      {/* Dashboard Header */}

      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#101c3a] via-[#192c54] to-[#294779] p-6 text-white shadow-xl sm:p-8">
        <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full border border-white/10" />
        <div className="pointer-events-none absolute -right-5 -top-14 h-52 w-52 rounded-full border border-white/10" />

        <div className="relative flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <div className="mb-3 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.25em] text-blue-200">
              <Sparkles className="h-4 w-4" />
              REMON ACADEMY
              <span className="text-white/30">/</span>
              ACADEMIC CONTROL CENTER
            </div>

            <h2 className="font-display text-2xl font-bold sm:text-3xl">
              Welcome to your dashboard
            </h2>

            <p className="mt-2 max-w-xl text-sm leading-6 text-blue-100/75">
              Monitor student activity, academic programs,
              attendance and fee collection from one place.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-xs font-semibold text-blue-50 backdrop-blur sm:self-auto">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-300 opacity-60" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
            </span>
            Live academy overview
          </div>
        </div>

        <div className="relative mt-7 grid grid-cols-2 gap-4 border-t border-white/10 pt-5 sm:grid-cols-4">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-blue-200/65">
              Total learners
            </p>
            <p className="mt-1 text-2xl font-bold">
              {stats.totalStudents.toLocaleString("en-BD")}
            </p>
          </div>

          <div>
            <p className="text-[10px] uppercase tracking-wider text-blue-200/65">
              Academic courses
            </p>
            <p className="mt-1 text-2xl font-bold">
              {stats.totalCourses.toLocaleString("en-BD")}
            </p>
          </div>

          <div>
            <p className="text-[10px] uppercase tracking-wider text-blue-200/65">
              Attendance today
            </p>
            <p className="mt-1 text-2xl font-bold">
              {stats.todayAttendance.toLocaleString("en-BD")}
            </p>
          </div>

          <div>
            <p className="text-[10px] uppercase tracking-wider text-blue-200/65">
              Fee collection
            </p>
            <p className="mt-1 text-2xl font-bold">
              {paidPercentage}%
            </p>
          </div>
        </div>
      </section>

      {/* Statistics Cards */}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.label}
              className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-slate-500">
                    {card.label}
                  </p>

                  <p className="mt-2 font-display text-3xl font-bold tracking-tight text-[#17233f]">
                    {card.value.toLocaleString("en-BD")}
                  </p>

                  <p className="mt-1 text-[11px] text-slate-400">
                    {card.description}
                  </p>
                </div>

                <div className={`rounded-xl p-3 ${card.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>

              <div className="absolute inset-x-0 bottom-0 h-[3px] origin-left scale-x-0 bg-gradient-to-r from-blue-600 to-violet-500 transition-transform duration-300 group-hover:scale-x-100" />
            </div>
          );
        })}
      </section>

      {/* LIVE STUDENT ACTIVITY */}

      <section className="space-y-5">

        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-700">
              Real-time monitoring
            </p>
            <h3 className="mt-1 font-display text-xl font-bold text-[#17233f]">
              Live Student Activity
            </h3>
            <p className="mt-1 text-xs text-slate-400">
              Automatically updates every 10 seconds.
            </p>
          </div>

          <button
            type="button"
            onClick={handleRefresh}
            disabled={refreshing}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-50"
          >
            <RefreshCw
              className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
            />
            Refresh Activity
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-emerald-100 bg-gradient-to-br from-white to-emerald-50 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500">
                  Online Students
                </p>
                <p className="mt-2 text-4xl font-bold text-emerald-700">
                  {onlineCount.toLocaleString("en-BD")}
                </p>
                <p className="mt-1 text-[11px] text-slate-400">
                  Unique students currently online
                </p>
              </div>
              <div className="rounded-xl bg-emerald-100 p-3 text-emerald-700">
                <Wifi className="h-6 w-6" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-blue-100 bg-gradient-to-br from-white to-blue-50 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500">
                  Active Devices
                </p>
                <p className="mt-2 text-4xl font-bold text-blue-700">
                  {onlineDeviceCount.toLocaleString("en-BD")}
                </p>
                <p className="mt-1 text-[11px] text-slate-400">
                  Active login sessions across devices
                </p>
              </div>
              <div className="rounded-xl bg-blue-100 p-3 text-blue-700">
                <Monitor className="h-6 w-6" />
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 p-5">
            <div>
              <h4 className="font-display font-bold text-[#17233f]">
                Currently Online
              </h4>
              <p className="mt-1 text-xs text-slate-400">
                Students with active sessions
              </p>
            </div>

            <span className="flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-[10px] font-bold text-emerald-700">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
              LIVE
            </span>
          </div>

          {onlineLoading ? (
            <div className="p-8 text-center text-sm text-slate-400">
              Loading online students...
            </div>
          ) : onlineError ? (
            <div className="p-8 text-center text-sm text-rose-500">
              {onlineError}
              <button
                onClick={() => fetchOnlineStudents(true)}
                className="ml-2 font-bold underline"
              >
                Retry
              </button>
            </div>
          ) : onlineStudents.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-5 py-12 text-center">
              <WifiOff className="h-9 w-9 text-slate-300" />
              <p className="mt-3 text-sm font-semibold text-slate-600">
                No students online right now
              </p>
              <p className="mt-1 text-xs text-slate-400">
                Online students will appear here after they log in.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {onlineStudents.map((student, index) => (
                <div
                  key={
                    student.studentObjectId ||
                    student.studentId ||
                    `${student.email}-${index}`
                  }
                  className="flex flex-col gap-3 p-4 transition hover:bg-slate-50 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    {student.profilePhoto ? (
                      <img
                        src={student.profilePhoto}
                        alt={student.fullName || "Student"}
                        className="h-11 w-11 rounded-full border border-slate-200 object-cover"
                      />
                    ) : (
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-50 font-bold text-blue-700">
                        {(student.fullName || "S")
                          .charAt(0)
                          .toUpperCase()}
                      </div>
                    )}

                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-[#17233f]">
                        {student.fullName || "Unknown Student"}
                      </p>
                      <p className="truncate text-xs text-slate-400">
                        {student.studentId || student.email || "Student"}
                      </p>
                      <p className="mt-1 text-[10px] text-slate-400">
                        {student.class || "Class not specified"}
                        {student.group ? ` • ${student.group}` : ""}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 sm:justify-end">
                    <div>
                      <p className="text-[10px] text-slate-400">
                        Device
                      </p>
                      <p className="mt-1 text-xs font-semibold text-slate-600">
                        {getDeviceName(student.userAgent)}
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] text-slate-400">
                        Last Active
                      </p>
                      <p className="mt-1 text-xs font-semibold text-slate-600">
                        {formatDateTime(student.lastActiveAt)}
                      </p>
                    </div>

                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-bold text-emerald-700">
                      Online
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* LOGIN HISTORY */}

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col justify-between gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-blue-700">
              Security & Activity
            </p>
            <h3 className="mt-1 font-display text-xl font-bold text-[#17233f]">
              Login History
            </h3>
            <p className="mt-1 text-xs text-slate-400">
              Login records for students and administrators.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <label className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2">
              <CalendarDays className="h-4 w-4 text-slate-400" />
              <input
                type="date"
                value={historyDate}
                onChange={(e) => setHistoryDate(e.target.value)}
                className="min-w-0 bg-transparent text-xs font-semibold text-slate-700 outline-none"
              />
            </label>

            <button
              type="button"
              onClick={() => setHistoryDate(getToday())}
              className="rounded-xl bg-blue-50 px-3 py-2 text-xs font-bold text-blue-700 transition hover:bg-blue-100"
            >
              Today
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 bg-slate-50/70 px-5 py-3">
          <p className="text-xs text-slate-500">
            Records found:{" "}
            <strong className="text-[#17233f]">
              {historyCount}
            </strong>
          </p>
          <p className="text-[10px] text-slate-400">
            Automatic refresh every 30 seconds
          </p>
        </div>

        {historyLoading ? (
          <div className="p-10 text-center text-sm text-slate-400">
            Loading login history...
          </div>
        ) : historyError ? (
          <div className="p-8 text-center text-sm text-rose-500">
            {historyError}
            <button
              onClick={() => fetchLoginHistory(true)}
              className="ml-2 font-bold underline"
            >
              Retry
            </button>
          </div>
        ) : history.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-5 py-12 text-center">
            <Clock3 className="h-9 w-9 text-slate-300" />
            <p className="mt-3 text-sm font-semibold text-slate-600">
              No login history found
            </p>
            <p className="mt-1 text-xs text-slate-400">
              Try another date or check again after a user logs in.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left">
              <thead className="bg-slate-50 text-[10px] uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-5 py-4 font-bold">User</th>
                  <th className="px-5 py-4 font-bold">Role</th>
                  <th className="px-5 py-4 font-bold">Device</th>
                  <th className="px-5 py-4 font-bold">Login Time</th>
                  <th className="px-5 py-4 font-bold">Logout Time</th>
                  <th className="px-5 py-4 font-bold">Last Active</th>
                  <th className="px-5 py-4 font-bold">Status</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {history.map((item) => {
                  const isOnline =
                    item.currentlyOnline ??
                    item.isOnline ??
                    false;

                  const userName =
                    item.student?.fullName ||
                    item.user?.name ||
                    item.student?.email ||
                    item.user?.email ||
                    "Unknown User";

                  const userEmail =
                    item.student?.email ||
                    item.user?.email ||
                    item.student?.studentId ||
                    "";

                  return (
                    <tr
                      key={item._id}
                      className="transition hover:bg-slate-50"
                    >
                      <td className="px-5 py-4">
                        <p className="text-xs font-bold text-[#17233f]">
                          {userName}
                        </p>
                        <p className="mt-1 text-[10px] text-slate-400">
                          {userEmail}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
                            item.role === "ADMIN"
                              ? "bg-violet-50 text-violet-700"
                              : "bg-blue-50 text-blue-700"
                          }`}
                        >
                          {item.role}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2 text-xs text-slate-600">
                          <Monitor className="h-4 w-4 text-slate-400" />
                          {getDeviceName(item.userAgent)}
                        </div>
                        <p className="mt-1 text-[10px] text-slate-400">
                          {item.ipAddress || "IP unavailable"}
                        </p>
                      </td>

                      <td className="px-5 py-4 text-xs text-slate-600">
                        <div className="flex items-center gap-2">
                          <LogIn className="h-3.5 w-3.5 text-emerald-600" />
                          {formatDateTime(item.loginAt)}
                        </div>
                      </td>

                      <td className="px-5 py-4 text-xs text-slate-600">
                        <div className="flex items-center gap-2">
                          <LogOut className="h-3.5 w-3.5 text-rose-500" />
                          {item.logoutAt
                            ? formatDateTime(item.logoutAt)
                            : isOnline
                              ? "Not logged out"
                              : "Not recorded"}
                        </div>
                      </td>

                      <td className="px-5 py-4 text-xs text-slate-600">
                        {formatDateTime(item.lastActiveAt)}
                      </td>

                      <td className="px-5 py-4">
                        {isOnline ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                            Online
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-500">
                            <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                            Offline
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Financial Overview */}

      <section>
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-700">
              Academy finance
            </p>
            <h3 className="mt-1 font-display text-xl font-bold text-[#17233f]">
              Financial Overview
            </h3>
          </div>

          <div className="rounded-xl bg-blue-50 p-2.5 text-blue-700">
            <CircleDollarSign className="h-5 w-5" />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">
                Total Fee
              </span>
              <Wallet className="h-5 w-5 text-blue-600" />
            </div>
            <p className="mt-3 font-display text-2xl font-bold text-[#17233f]">
              {formatMoney(fee.totalFee)}
            </p>
            <p className="mt-1 text-[11px] text-slate-400">
              {fee.totalRecords} fee records
            </p>
          </div>

          <div className="rounded-2xl border border-emerald-100 bg-gradient-to-br from-white to-emerald-50/70 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">
                Total Paid
              </span>
              <TrendingUp className="h-5 w-5 text-emerald-600" />
            </div>
            <p className="mt-3 font-display text-2xl font-bold text-emerald-700">
              {formatMoney(fee.totalPaid)}
            </p>
            <p className="mt-1 text-[11px] text-emerald-600">
              {paidPercentage}% collected
            </p>
          </div>

          <div className="rounded-2xl border border-rose-100 bg-gradient-to-br from-white to-rose-50/70 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">
                Total Due
              </span>
              <TrendingDown className="h-5 w-5 text-rose-600" />
            </div>
            <p className="mt-3 font-display text-2xl font-bold text-rose-700">
              {formatMoney(fee.totalDue)}
            </p>
            <p className="mt-1 text-[11px] text-rose-500">
              Outstanding amount
            </p>
          </div>
        </div>
      </section>

      {/* Student Status and Fee Collection */}

      <div className="grid gap-5 xl:grid-cols-2">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-blue-700">
                Enrollment
              </p>
              <h3 className="mt-1 font-display text-lg font-bold text-[#17233f]">
                Student Status
              </h3>
            </div>
            <PieChart className="h-5 w-5 text-slate-400" />
          </div>

          <div className="flex flex-col items-center gap-6 sm:flex-row">
            <div
              className="relative h-40 w-40 shrink-0 rounded-full"
              style={{
                background: `conic-gradient(#2563eb 0% ${activePercentage}%, #e8edf5 ${activePercentage}% 100%)`,
              }}
            >
              <div className="absolute inset-5 flex flex-col items-center justify-center rounded-full bg-white">
                <span className="font-display text-3xl font-bold text-[#17233f]">
                  {stats.totalStudents}
                </span>
                <span className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
                  Students
                </span>
              </div>
            </div>

            <div className="w-full space-y-3">
              <div className="flex items-center justify-between rounded-xl bg-blue-50/80 p-4">
                <div className="flex items-center gap-3">
                  <span className="h-3 w-3 rounded-full bg-blue-600" />
                  <span className="text-sm text-slate-600">
                    Active Students
                  </span>
                </div>
                <span className="font-bold text-[#17233f]">
                  {activeStudents}
                </span>
              </div>

              <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4">
                <div className="flex items-center gap-3">
                  <span className="h-3 w-3 rounded-full bg-slate-300" />
                  <span className="text-sm text-slate-600">
                    Inactive Students
                  </span>
                </div>
                <span className="font-bold text-[#17233f]">
                  {inactiveStudents}
                </span>
              </div>

              <p className="text-xs text-slate-400">
                {activePercentage}% of registered students are currently active.
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-blue-700">
                Collection Progress
              </p>
              <h3 className="mt-1 font-display text-lg font-bold text-[#17233f]">
                Paid vs Due
              </h3>
            </div>
            <BarChart3 className="h-5 w-5 text-slate-400" />
          </div>

          <div className="space-y-6">
            <div>
              <div className="mb-2 flex justify-between text-sm">
                <span className="font-medium text-slate-600">Paid</span>
                <span className="font-bold text-emerald-700">
                  {formatMoney(fee.totalPaid)}
                </span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-emerald-500 transition-all duration-700"
                  style={{ width: `${Math.min(paidPercentage, 100)}%` }}
                />
              </div>
            </div>

            <div>
              <div className="mb-2 flex justify-between text-sm">
                <span className="font-medium text-slate-600">Due</span>
                <span className="font-bold text-rose-700">
                  {formatMoney(fee.totalDue)}
                </span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-rose-500 transition-all duration-700"
                  style={{
                    width: `${
                      fee.totalFee > 0
                        ? Math.min(
                            (fee.totalDue / fee.totalFee) * 100,
                            100
                          )
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-slate-200 p-4">
              <p className="text-[10px] uppercase tracking-wider text-slate-400">
                Collection Rate
              </p>
              <p className="mt-1 text-xl font-bold text-[#17233f]">
                {paidPercentage}%
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 p-4">
              <p className="text-[10px] uppercase tracking-wider text-slate-400">
                Outstanding
              </p>
              <p className="mt-1 text-lg font-bold text-rose-700">
                {formatMoney(fee.totalDue)}
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* Monthly Fee Collection */}

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-blue-700">
              Finance Trend
            </p>
            <h3 className="mt-1 font-display text-lg font-bold text-[#17233f]">
              Monthly Fee Collection
            </h3>
            <p className="mt-1 text-xs text-slate-400">
              Paid and due amounts across recent months.
            </p>
          </div>
          <TrendingUp className="h-5 w-5 text-slate-400" />
        </div>

        {monthlyFees.length === 0 ? (
          <div className="flex min-h-[180px] items-center justify-center text-sm text-slate-400">
            No monthly fee data available.
          </div>
        ) : (
          <div className="space-y-5">
            {monthlyFees.map((item) => {
              const paidWidth = (item.paid / maxMonthlyValue) * 100;
              const dueWidth = (item.due / maxMonthlyValue) * 100;

              return (
                <div key={item.month}>
                  <div className="mb-2 flex items-center justify-between gap-4">
                    <span className="text-sm font-semibold text-slate-700">
                      {formatMonth(item.month)}
                    </span>
                    <span className="text-xs text-slate-400">
                      Total {formatMoney(item.totalFee)}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="w-9 text-[10px] font-bold text-emerald-700">
                        Paid
                      </span>
                      <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full bg-emerald-500 transition-all duration-700"
                          style={{ width: `${paidWidth}%` }}
                        />
                      </div>
                      <span className="w-24 text-right text-xs font-semibold text-slate-600">
                        {formatMoney(item.paid)}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="w-9 text-[10px] font-bold text-rose-700">
                        Due
                      </span>
                      <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full bg-rose-400 transition-all duration-700"
                          style={{ width: `${dueWidth}%` }}
                        />
                      </div>
                      <span className="w-24 text-right text-xs font-semibold text-slate-600">
                        {formatMoney(item.due)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Course Wise Students */}

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-blue-700">
              Academic Enrollment
            </p>
            <h3 className="mt-1 font-display text-lg font-bold text-[#17233f]">
              Students by Course
            </h3>
          </div>
          <BookOpen className="h-5 w-5 text-slate-400" />
        </div>

        {courseWiseStudents.length === 0 ? (
          <div className="flex min-h-[150px] items-center justify-center text-sm text-slate-400">
            No course enrollment data available.
          </div>
        ) : (
          <div className="space-y-5">
            {courseWiseStudents.map((course) => (
              <div key={course.courseId}>
                <div className="mb-2 flex items-center justify-between gap-4">
                  <span className="min-w-0 truncate text-sm font-semibold text-slate-700">
                    {course.courseName}
                  </span>
                  <span className="shrink-0 text-sm font-bold text-[#17233f]">
                    {course.students}
                  </span>
                </div>

                <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-blue-700 to-violet-500 transition-all duration-700"
                    style={{
                      width: `${
                        (course.students / maxCourseStudents) * 100
                      }%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Student Growth */}

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-blue-700">
              Growth
            </p>
            <h3 className="mt-1 font-display text-lg font-bold text-[#17233f]">
              Student Growth
            </h3>
          </div>
          <Activity className="h-5 w-5 text-slate-400" />
        </div>

        {studentGrowth.length === 0 ? (
          <div className="flex min-h-[180px] items-center justify-center text-sm text-slate-400">
            No student growth data available.
          </div>
        ) : (
          <div className="flex h-52 items-end gap-3 overflow-x-auto pb-7">
            {studentGrowth.map((item) => {
              const height = Math.max(
                (item.count / maxGrowth) * 100,
                5
              );

              const label = `${String(item.month).padStart(2, "0")}/${item.year}`;

              return (
                <div
                  key={`${item.year}-${item.month}`}
                  className="group flex h-full min-w-[42px] flex-1 flex-col justify-end"
                >
                  <div className="relative flex flex-1 items-end">
                    <div
                      className="mx-auto flex w-full max-w-[42px] items-start justify-center rounded-t-lg bg-gradient-to-t from-blue-700 to-violet-500 pt-2 text-[10px] font-bold text-white transition group-hover:brightness-110"
                      style={{ height: `${height}%` }}
                      title={`${item.count} students`}
                    >
                      {item.count}
                    </div>
                  </div>
                  <span className="mt-2 text-center text-[10px] text-slate-400">
                    {label}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Latest Notices */}

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-blue-700">
              Academy Updates
            </p>
            <h3 className="mt-1 font-display text-lg font-bold text-[#17233f]">
              Latest Notices
            </h3>
          </div>
          <Bell className="h-5 w-5 text-slate-400" />
        </div>

        {stats.latestNotices.length === 0 ? (
          <p className="py-8 text-center text-sm text-slate-400">
            No notices available.
          </p>
        ) : (
          <ul className="space-y-3">
            {stats.latestNotices.map((notice) => (
              <li
                key={notice._id}
                className="flex items-center justify-between gap-4 rounded-xl border border-slate-100 p-4 transition hover:border-blue-200 hover:bg-blue-50/40"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-800">
                    {notice.title}
                  </p>
                  <p className="mt-1 flex items-center gap-1.5 text-[11px] text-slate-400">
                    <Clock3 className="h-3 w-3" />
                    {new Date(notice.date).toLocaleDateString(
                      "en-BD",
                      {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      }
                    )}
                  </p>
                </div>
                <ArrowUpRight className="h-4 w-4 shrink-0 text-slate-300" />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}