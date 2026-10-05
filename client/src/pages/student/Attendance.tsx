import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import {
  BarChart3,
  CalendarDays,
  CheckCircle2,
  Clock3,
  GraduationCap,
  Users,
  XCircle,
} from "lucide-react";

import { api, getErrorMessage } from "../../services/api";
import { AttendanceRecord, Course } from "../../types";
import { Loader } from "../../components/Loader";
import { Badge } from "../../components/Badge";
import { useToast } from "../../components/Toast";

interface CourseAttendanceStat {
  courseId: string;
  courseTitle: string;
  total: number;
  present: number;
  absent: number;
  late: number;
  percentage: number;
}

export default function StudentAttendance() {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);

  const [stats, setStats] = useState({
    total: 0,
    present: 0,
    absent: 0,
    late: 0,
    percentage: 0,
  });

  const [courseStats, setCourseStats] = useState<CourseAttendanceStat[]>([]);
  const [loading, setLoading] = useState(true);

  const { show } = useToast();

  useEffect(() => {
    api
      .get("/attendance/my")
      .then((r) => {
        const data = r.data.data;

        setRecords(data.records || []);

        setStats(
          data.stats || {
            total: 0,
            present: 0,
            absent: 0,
            late: 0,
            percentage: 0,
          }
        );

        setCourseStats(data.courseStats || []);
        setLoading(false);
      })
      .catch((err) => {
        show(getErrorMessage(err), "error");
        setLoading(false);
      });
  }, [show]);

  if (loading) {
    return <Loader />;
  }

  const chartData = [
    {
      name: "Present",
      value: stats.present,
      color: "#16a34a",
    },
    {
      name: "Absent",
      value: stats.absent,
      color: "#dc2626",
    },
    {
      name: "Late",
      value: stats.late,
      color: "#eab308",
    },
  ];

  const attendanceScore = Math.min(
    Math.max(stats.percentage, 0),
    100
  );

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-3 flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-navyDark">
              <BarChart3 className="h-4 w-4 text-brand-goldLight" />
            </div>

            <span className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-gold">
              Academic Performance
            </span>
          </div>

          <h1 className="font-display text-3xl font-semibold tracking-[-0.03em] text-brand-navyDark sm:text-4xl">
            Attendance
          </h1>

          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
            Monitor your overall attendance, course-wise performance and
            complete attendance history.
          </p>
        </div>

        <div className="flex w-fit items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
          <CalendarDays className="h-4 w-4 text-brand-gold" />

          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">
              Total Classes
            </p>

            <p className="text-sm font-semibold text-brand-navyDark">
              {stats.total}
            </p>
          </div>
        </div>
      </div>

      {/* OVERVIEW */}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_15px_50px_rgba(15,23,42,0.04)]">
          <div className="mb-5 flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-navyDark">
              <BarChart3 className="h-5 w-5 text-brand-goldLight" />
            </div>

            <span className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-400">
              Overall
            </span>
          </div>

          <p className="font-display text-3xl font-semibold text-brand-navyDark">
            {stats.percentage}%
          </p>

          <p className="mt-1 text-sm text-slate-500">
            Attendance rate
          </p>

          <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-brand-navyDark transition-all duration-500"
              style={{ width: `${attendanceScore}%` }}
            />
          </div>
        </div>

        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_15px_50px_rgba(15,23,42,0.04)]">
          <div className="mb-5 flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            </div>

            <span className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-400">
              Present
            </span>
          </div>

          <p className="font-display text-3xl font-semibold text-brand-navyDark">
            {stats.present}
          </p>

          <p className="mt-1 text-sm text-slate-500">
            Classes attended
          </p>
        </div>

        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_15px_50px_rgba(15,23,42,0.04)]">
          <div className="mb-5 flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50">
              <XCircle className="h-5 w-5 text-red-600" />
            </div>

            <span className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-400">
              Absent
            </span>
          </div>

          <p className="font-display text-3xl font-semibold text-brand-navyDark">
            {stats.absent}
          </p>

          <p className="mt-1 text-sm text-slate-500">
            Classes missed
          </p>
        </div>

        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_15px_50px_rgba(15,23,42,0.04)]">
          <div className="mb-5 flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50">
              <Clock3 className="h-5 w-5 text-amber-600" />
            </div>

            <span className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-400">
              Late
            </span>
          </div>

          <p className="font-display text-3xl font-semibold text-brand-navyDark">
            {stats.late}
          </p>

          <p className="mt-1 text-sm text-slate-500">
            Late arrivals
          </p>
        </div>
      </div>

      {/* CHART + COURSE STATS */}
      <div className="grid gap-6 xl:grid-cols-[360px_1fr]">
        {/* PIE CHART */}
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_15px_50px_rgba(15,23,42,0.05)] sm:p-7">
          <div className="mb-2">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-gold">
              Overall Summary
            </p>

            <h2 className="mt-2 font-display text-xl font-semibold text-brand-navyDark">
              Attendance breakdown
            </h2>
          </div>

          <div className="relative mt-3 h-[230px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  innerRadius={58}
                  outerRadius={82}
                  paddingAngle={3}
                  strokeWidth={0}
                >
                  {chartData.map((item) => (
                    <Cell
                      key={item.name}
                      fill={item.color}
                    />
                  ))}
                </Pie>

                <Tooltip />
              </PieChart>
            </ResponsiveContainer>

            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-display text-3xl font-semibold text-brand-navyDark">
                {stats.percentage}%
              </span>

              <span className="mt-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-400">
                Attendance
              </span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="rounded-xl bg-green-50 p-3 text-center">
              <div className="mx-auto mb-1 h-2 w-2 rounded-full bg-green-600" />
              <p className="text-xs font-semibold text-green-700">
                {stats.present}
              </p>
              <p className="text-[10px] text-green-600">
                Present
              </p>
            </div>

            <div className="rounded-xl bg-red-50 p-3 text-center">
              <div className="mx-auto mb-1 h-2 w-2 rounded-full bg-red-600" />
              <p className="text-xs font-semibold text-red-700">
                {stats.absent}
              </p>
              <p className="text-[10px] text-red-600">
                Absent
              </p>
            </div>

            <div className="rounded-xl bg-amber-50 p-3 text-center">
              <div className="mx-auto mb-1 h-2 w-2 rounded-full bg-amber-500" />
              <p className="text-xs font-semibold text-amber-700">
                {stats.late}
              </p>
              <p className="text-[10px] text-amber-600">
                Late
              </p>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-slate-50 p-4 text-center">
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                Total Classes
              </p>

              <p className="mt-1 font-display text-xl font-semibold text-brand-navyDark">
                {stats.total}
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-4 text-center">
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                Present + Late
              </p>

              <p className="mt-1 font-display text-xl font-semibold text-green-600">
                {stats.present + stats.late}
              </p>
            </div>
          </div>
        </div>

        {/* COURSE-WISE */}
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_15px_50px_rgba(15,23,42,0.05)] sm:p-7">
          <div className="mb-6">
            <div className="mb-2 flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-brand-gold" />

              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-gold">
                Course Performance
              </p>
            </div>

            <h2 className="font-display text-xl font-semibold text-brand-navyDark">
              Course-wise attendance
            </h2>

            <p className="mt-1 text-xs text-slate-400">
              Attendance performance across your assigned courses.
            </p>
          </div>

          {courseStats.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 p-10 text-center">
              <Users className="mx-auto h-8 w-8 text-slate-300" />

              <p className="mt-3 text-sm text-slate-400">
                No course-wise attendance data available.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {courseStats.map((course) => {
                const percentage = Math.min(
                  Math.max(course.percentage, 0),
                  100
                );

                return (
                  <div
                    key={course.courseId}
                    className="rounded-2xl border border-slate-200 p-5 transition-colors hover:border-brand-gold/30"
                  >
                    <div className="mb-4 flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <p className="font-semibold text-brand-navyDark">
                          {course.courseTitle}
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          {course.total} total classes
                        </p>
                      </div>

                      <span className="shrink-0 font-display text-xl font-semibold text-brand-navyDark">
                        {course.percentage}%
                      </span>
                    </div>

                    <div className="mb-4 h-2 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-brand-gold transition-all duration-500"
                        style={{
                          width: `${percentage}%`,
                        }}
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <div className="rounded-xl bg-green-50 p-3 text-center">
                        <p className="text-sm font-semibold text-green-700">
                          {course.present}
                        </p>

                        <p className="mt-0.5 text-[10px] text-green-600">
                          Present
                        </p>
                      </div>

                      <div className="rounded-xl bg-red-50 p-3 text-center">
                        <p className="text-sm font-semibold text-red-700">
                          {course.absent}
                        </p>

                        <p className="mt-0.5 text-[10px] text-red-600">
                          Absent
                        </p>
                      </div>

                      <div className="rounded-xl bg-amber-50 p-3 text-center">
                        <p className="text-sm font-semibold text-amber-700">
                          {course.late}
                        </p>

                        <p className="mt-0.5 text-[10px] text-amber-600">
                          Late
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* RECORDS */}
      <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_15px_50px_rgba(15,23,42,0.05)]">
        <div className="border-b border-slate-100 px-6 py-6 sm:px-7">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-gold">
                Attendance History
              </p>

              <h2 className="mt-2 font-display text-xl font-semibold text-brand-navyDark">
                Attendance records
              </h2>

              <p className="mt-1 text-xs text-slate-400">
                Complete attendance history for all assigned courses.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-400">
              <CalendarDays className="h-4 w-4" />
              {records.length} records
            </div>
          </div>
        </div>

        {records.length === 0 ? (
          <div className="p-12 text-center">
            <CalendarDays className="mx-auto h-9 w-9 text-slate-300" />

            <p className="mt-3 text-sm text-slate-400">
              No attendance records found.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[650px] text-sm">
              <thead>
                <tr className="bg-slate-50 text-left text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                  <th className="px-6 py-4">
                    Date
                  </th>

                  <th className="px-6 py-4">
                    Course
                  </th>

                  <th className="px-6 py-4 text-right">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody>
                {records.map((record) => {
                  const course =
                    typeof record.course === "object" &&
                    record.course !== null
                      ? (record.course as Course)
                      : null;

                  return (
                    <tr
                      key={record._id}
                      className="border-t border-slate-100 transition-colors hover:bg-slate-50/70"
                    >
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100">
                            <CalendarDays className="h-4 w-4 text-slate-500" />
                          </div>

                          <span className="font-medium text-brand-navyDark">
                            {new Date(
                              record.date
                            ).toLocaleDateString()}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-5">
                        <div>
                          <p className="font-medium text-brand-navyDark">
                            {course?.title || "-"}
                          </p>

                          {course?.subject && (
                            <p className="mt-1 text-xs text-slate-400">
                              {course.subject}
                            </p>
                          )}
                        </div>
                      </td>

                      <td className="px-6 py-5 text-right">
                        <Badge
                          color={
                            record.status === "PRESENT"
                              ? "green"
                              : record.status === "LATE"
                              ? "gold"
                              : "red"
                          }
                        >
                          {record.status}
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
    </div>
  );
}