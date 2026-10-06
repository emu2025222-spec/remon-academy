import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Activity,
  Clock3,
  Monitor,
  RefreshCw,
  Search,
  Smartphone,
  UserRound,
  Users,
} from "lucide-react";

import { api, getErrorMessage } from "../../services/api";
import { Loader } from "../../components/Loader";
import { EmptyState } from "../../components/EmptyState";

interface OnlineStudent {
  sessionId: string;
  studentId: string;
  fullName: string;
  phone?: string;
  class?: string;
  group?: string;
  profilePhoto?: string;
  loginAt: string;
  lastActiveAt: string;
  isOnline: boolean;
  userAgent?: string;
}

interface OnlineStudentsResponse {
  online: boolean;
  count: number;
  students: OnlineStudent[];
  checkedAt: string;
}

interface LoginHistoryItem {
  role: "ADMIN" | "STUDENT";
  email?: string;
  studentId?: string;
  fullName?: string;
  phone?: string;
  class?: string;
  group?: string;
  profilePhoto?: string;
  loginAt: string;
  lastActiveAt: string;
  logoutAt?: string;
  isOnline: boolean;
  userAgent?: string;
}

interface LoginHistoryResponse {
  history: LoginHistoryItem[];
}

function formatTime(value?: string) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
  });
}

function formatDateTime(value?: string) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleString([], {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function getRelativeTime(value?: string) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  const seconds = Math.max(
    0,
    Math.floor((Date.now() - date.getTime()) / 1000)
  );

  if (seconds < 5) return "Active now";
  if (seconds < 60) return `${seconds}s ago`;

  const minutes = Math.floor(seconds / 60);

  if (minutes < 60) {
    return `${minutes}m ago`;
  }

  const hours = Math.floor(minutes / 60);

  if (hours < 24) {
    return `${hours}h ago`;
  }

  return `${Math.floor(hours / 24)}d ago`;
}

function getDeviceType(userAgent?: string) {
  if (!userAgent) return "Unknown device";

  const value = userAgent.toLowerCase();

  if (
    value.includes("iphone") ||
    value.includes("ipad") ||
    value.includes("android")
  ) {
    return "Mobile";
  }

  return "Desktop";
}

export default function OnlineStudents() {
  const [students, setStudents] = useState<OnlineStudent[]>([]);
  const [history, setHistory] = useState<LoginHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [lastChecked, setLastChecked] = useState("");

  const loadOnlineStudents = useCallback(async () => {
    try {
      setError("");

      const response = await api.get<OnlineStudentsResponse>(
        "/dashboard/online-students"
      );

      const data = response.data;

      setStudents(data.students || []);
      setLastChecked(data.checkedAt || new Date().toISOString());
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  const loadHistory = useCallback(async () => {
    try {
      setHistoryLoading(true);

      const response = await api.get<LoginHistoryResponse>(
        "/dashboard/login-history?limit=100"
      );

      setHistory(response.data.history || []);
    } catch (err) {
      console.error("Failed to load login history:", err);
    } finally {
      setHistoryLoading(false);
    }
  }, []);

  const refreshAll = useCallback(async () => {
    setRefreshing(true);

    await Promise.all([
      loadOnlineStudents(),
      loadHistory(),
    ]);
  }, [loadOnlineStudents, loadHistory]);

  useEffect(() => {
    loadOnlineStudents();
    loadHistory();

    const interval = window.setInterval(() => {
      loadOnlineStudents();
    }, 15000);

    return () => {
      window.clearInterval(interval);
    };
  }, [loadOnlineStudents, loadHistory]);

  const filteredStudents = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return students;
    }

    return students.filter((student) => {
      return (
        student.fullName?.toLowerCase().includes(query) ||
        student.studentId?.toLowerCase().includes(query) ||
        student.class?.toLowerCase().includes(query) ||
        student.group?.toLowerCase().includes(query)
      );
    });
  }, [students, search]);

  const studentHistory = useMemo(() => {
    return history.filter(
      (item) => item.role === "STUDENT"
    );
  }, [history]);

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm font-medium text-brand-gold">
            <Activity size={16} />
            Live Monitoring
          </div>

          <h1 className="text-2xl font-semibold tracking-tight text-brand-navy dark:text-white sm:text-3xl">
            Online Students
          </h1>

          <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
            Monitor students who are currently active on the REMON
            ACADEMY website.
          </p>
        </div>

        <button
          type="button"
          onClick={refreshAll}
          disabled={refreshing}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-brand-gold/40 hover:text-brand-navy disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-200"
        >
          <RefreshCw
            size={17}
            className={refreshing ? "animate-spin" : ""}
          />
          Refresh
        </button>
      </div>

      {/* =====================================================
          ERROR
      ===================================================== */}

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-950/20 dark:text-red-300">
          {error}
        </div>
      )}

      {/* =====================================================
          SUMMARY
      ===================================================== */}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-2xl border border-emerald-200 bg-white p-5 shadow-sm dark:border-emerald-900/30 dark:bg-white/[0.04]">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                Currently Online
              </p>

              <p className="mt-2 text-3xl font-bold text-brand-navy dark:text-white">
                {students.length}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
              <Users size={21} />
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2 text-xs font-medium text-emerald-600 dark:text-emerald-400">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
            Live monitoring
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                Login Activity
              </p>

              <p className="mt-2 text-3xl font-bold text-brand-navy dark:text-white">
                {studentHistory.length}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-slate-300">
              <Activity size={21} />
            </div>
          </div>

          <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">
            Recent student sessions
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/[0.04] sm:col-span-2 lg:col-span-1">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                Last Checked
              </p>

              <p className="mt-2 text-lg font-bold text-brand-navy dark:text-white">
                {formatTime(lastChecked)}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-gold/10 text-brand-gold">
              <Clock3 size={21} />
            </div>
          </div>

          <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">
            Automatically refreshed every 15 seconds
          </p>
        </div>
      </div>

      {/* =====================================================
          ONLINE STUDENTS
      ===================================================== */}

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
        <div className="border-b border-slate-200 px-5 py-5 dark:border-white/10 sm:px-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-500" />

                <h2 className="text-lg font-semibold text-brand-navy dark:text-white">
                  Live Visitors
                </h2>

                <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400">
                  {students.length} Online
                </span>
              </div>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Students active within the last minute.
              </p>
            </div>

            <div className="relative w-full lg:w-72">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search student..."
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm outline-none transition focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/10 dark:border-white/10 dark:bg-white/[0.03] dark:text-white dark:placeholder:text-slate-500"
              />
            </div>
          </div>
        </div>

        {filteredStudents.length === 0 ? (
          <div className="p-8">
            {search ? (
              <EmptyState message="No students found. Try searching with a different name, student ID, class, or group." />
            ) : (
              <EmptyState message="No students are online. Students will appear here automatically when they log in and remain active." />
            )}
          </div>
        ) : (
          <>
            {/* Desktop table */}

            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[850px]">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/80 dark:border-white/10 dark:bg-white/[0.02]">
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Student
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Student ID
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Class
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Login Time
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Last Active
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Device
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredStudents.map((student) => (
                    <tr
                      key={student.sessionId}
                      className="border-b border-slate-100 last:border-0 dark:border-white/5"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {student.profilePhoto ? (
                            <img
                              src={student.profilePhoto}
                              alt={student.fullName}
                              className="h-10 w-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-navy text-sm font-bold text-white">
                              {student.fullName
                                ?.charAt(0)
                                .toUpperCase() || "S"}
                            </div>
                          )}

                          <div className="min-w-0">
                            <p className="truncate font-semibold text-slate-800 dark:text-white">
                              {student.fullName}
                            </p>

                            {student.group && (
                              <p className="text-xs text-slate-500 dark:text-slate-400">
                                Group: {student.group}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-sm font-medium text-slate-700 dark:text-slate-200">
                        {student.studentId}
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
                        {student.class || "—"}
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
                        {formatTime(student.loginAt)}
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />

                          <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                            {getRelativeTime(
                              student.lastActiveAt
                            )}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                          {getDeviceType(student.userAgent) ===
                          "Mobile" ? (
                            <Smartphone size={16} />
                          ) : (
                            <Monitor size={16} />
                          )}

                          {getDeviceType(student.userAgent)}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}

            <div className="divide-y divide-slate-100 md:hidden dark:divide-white/5">
              {filteredStudents.map((student) => (
                <div
                  key={student.sessionId}
                  className="p-5"
                >
                  <div className="flex items-start gap-3">
                    {student.profilePhoto ? (
                      <img
                        src={student.profilePhoto}
                        alt={student.fullName}
                        className="h-11 w-11 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-navy text-sm font-bold text-white">
                        {student.fullName
                          ?.charAt(0)
                          .toUpperCase() || "S"}
                      </div>
                    )}

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-3">
                        <p className="truncate font-semibold text-slate-800 dark:text-white">
                          {student.fullName}
                        </p>

                        <span className="flex shrink-0 items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                          <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
                          Online
                        </span>
                      </div>

                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        {student.studentId}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                    <div className="rounded-xl bg-slate-50 p-3 dark:bg-white/[0.03]">
                      <p className="text-xs text-slate-400">
                        Class
                      </p>

                      <p className="mt-1 font-semibold text-slate-700 dark:text-slate-200">
                        {student.class || "—"}
                      </p>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-3 dark:bg-white/[0.03]">
                      <p className="text-xs text-slate-400">
                        Last Active
                      </p>

                      <p className="mt-1 font-semibold text-emerald-600 dark:text-emerald-400">
                        {getRelativeTime(
                          student.lastActiveAt
                        )}
                      </p>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-3 dark:bg-white/[0.03]">
                      <p className="text-xs text-slate-400">
                        Login
                      </p>

                      <p className="mt-1 font-semibold text-slate-700 dark:text-slate-200">
                        {formatTime(student.loginAt)}
                      </p>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-3 dark:bg-white/[0.03]">
                      <p className="text-xs text-slate-400">
                        Device
                      </p>

                      <p className="mt-1 flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-200">
                        {getDeviceType(student.userAgent) ===
                        "Mobile" ? (
                          <Smartphone size={14} />
                        ) : (
                          <Monitor size={14} />
                        )}

                        {getDeviceType(student.userAgent)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </section>

      {/* =====================================================
          LOGIN HISTORY
      ===================================================== */}

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
        <div className="border-b border-slate-200 px-5 py-5 dark:border-white/10 sm:px-6">
          <div>
            <h2 className="text-lg font-semibold text-brand-navy dark:text-white">
              Login Activity
            </h2>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Recent student login sessions.
            </p>
          </div>
        </div>

        {historyLoading ? (
          <div className="flex min-h-[180px] items-center justify-center">
            <Loader />
          </div>
        ) : studentHistory.length === 0 ? (
          <div className="p-8">
            <EmptyState
              message="No login activity. Student login sessions will appear here."
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px]">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80 dark:border-white/10 dark:bg-white/[0.02]">
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Student
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Student ID
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Login Time
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Last Active
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Status
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Device
                  </th>
                </tr>
              </thead>

              <tbody>
                {studentHistory.map((item, index) => (
                  <tr
                    key={`${item.studentId || item.email}-${item.loginAt}-${index}`}
                    className="border-b border-slate-100 last:border-0 dark:border-white/5"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {item.profilePhoto ? (
                          <img
                            src={item.profilePhoto}
                            alt={item.fullName || "Student"}
                            className="h-9 w-9 rounded-full object-cover"
                          />
                        ) : (
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-slate-300">
                            <UserRound size={17} />
                          </div>
                        )}

                        <div>
                          <p className="font-semibold text-slate-800 dark:text-white">
                            {item.fullName || "Unknown student"}
                          </p>

                          {item.class && (
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              Class {item.class}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-sm font-medium text-slate-700 dark:text-slate-200">
                      {item.studentId || "—"}
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
                      {formatDateTime(item.loginAt)}
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
                      {formatDateTime(item.lastActiveAt)}
                    </td>

                    <td className="px-6 py-4">
                      {item.isOnline ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400">
                          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                          Online
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600 dark:bg-white/10 dark:text-slate-400">
                          Offline
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                        {getDeviceType(item.userAgent) ===
                        "Mobile" ? (
                          <Smartphone size={15} />
                        ) : (
                          <Monitor size={15} />
                        )}

                        {getDeviceType(item.userAgent)}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}