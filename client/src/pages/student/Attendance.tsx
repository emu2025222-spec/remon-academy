import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
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
  const [records, setRecords] = useState<
    AttendanceRecord[]
  >([]);

  const [stats, setStats] = useState({
    total: 0,
    present: 0,
    absent: 0,
    late: 0,
    percentage: 0,
  });

  const [courseStats, setCourseStats] = useState<
    CourseAttendanceStat[]
  >([]);

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

  if (loading) return <Loader />;

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

  return (
    <div>
      <div className="mb-6">
        <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white">
          Attendance
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Overall and course-wise attendance records.
        </p>
      </div>

      {/* Overall Attendance */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="card p-6 md:col-span-1">
          <p className="mb-2 text-center text-3xl font-bold text-brand-navy dark:text-brand-goldLight">
            {stats.percentage}%
          </p>

          <p className="mb-4 text-center text-sm text-slate-500">
            Overall Attendance
          </p>

          <ResponsiveContainer
            width="100%"
            height={180}
          >
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                innerRadius={45}
                outerRadius={70}
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

          <div className="flex flex-wrap justify-center gap-4 text-xs">
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-green-600" />
              Present {stats.present}
            </span>

            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-red-600" />
              Absent {stats.absent}
            </span>

            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-yellow-500" />
              Late {stats.late}
            </span>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3 text-center">
            <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800/50">
              <p className="text-xs text-slate-400">
                Total Classes
              </p>

              <p className="mt-1 font-bold text-slate-900 dark:text-white">
                {stats.total}
              </p>
            </div>

            <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800/50">
              <p className="text-xs text-slate-400">
                Present + Late
              </p>

              <p className="mt-1 font-bold text-green-600">
                {stats.present + stats.late}
              </p>
            </div>
          </div>
        </div>

        {/* Course-wise Attendance */}
        <div className="card p-6 md:col-span-2">
          <div className="mb-5">
            <h3 className="font-display text-lg font-semibold text-slate-900 dark:text-white">
              Course-wise Attendance
            </h3>

            <p className="mt-1 text-xs text-slate-400">
              Attendance for each assigned course.
            </p>
          </div>

          {courseStats.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-200 p-8 text-center dark:border-slate-700">
              <p className="text-sm text-slate-400">
                No course-wise attendance data available.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {courseStats.map((course) => (
                <div
                  key={course.courseId}
                  className="rounded-xl border border-slate-200 p-4 dark:border-slate-700"
                >
                  <div className="mb-3 flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-900 dark:text-white">
                        {course.courseTitle}
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        {course.total} total classes
                      </p>
                    </div>

                    <span className="shrink-0 text-lg font-bold text-brand-navy dark:text-brand-goldLight">
                      {course.percentage}%
                    </span>
                  </div>

                  <div className="mb-3 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                    <div
                      className="h-full rounded-full bg-brand-gold transition-all"
                      style={{
                        width: `${Math.min(
                          Math.max(course.percentage, 0),
                          100
                        )}%`,
                      }}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="rounded-lg bg-green-50 p-2 text-green-700 dark:bg-green-950/20 dark:text-green-400">
                      <p className="font-semibold">
                        {course.present}
                      </p>
                      <p>Present</p>
                    </div>

                    <div className="rounded-lg bg-red-50 p-2 text-red-700 dark:bg-red-950/20 dark:text-red-400">
                      <p className="font-semibold">
                        {course.absent}
                      </p>
                      <p>Absent</p>
                    </div>

                    <div className="rounded-lg bg-yellow-50 p-2 text-yellow-700 dark:bg-yellow-950/20 dark:text-yellow-400">
                      <p className="font-semibold">
                        {course.late}
                      </p>
                      <p>Late</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Attendance Records */}
      <div className="card mt-6 overflow-x-auto p-0">
        <div className="border-b border-slate-100 px-6 py-4 dark:border-slate-800">
          <h3 className="font-display text-lg font-semibold text-slate-900 dark:text-white">
            Attendance Records
          </h3>

          <p className="mt-1 text-xs text-slate-400">
            Complete attendance history for all assigned courses.
          </p>
        </div>

        {records.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-sm text-slate-400">
              No attendance records found.
            </p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase text-slate-400 dark:bg-slate-800/50">
              <tr>
                <th className="px-4 py-3">
                  Date
                </th>

                <th className="px-4 py-3">
                  Course
                </th>

                <th className="px-4 py-3">
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
                    className="border-t border-slate-100 dark:border-slate-800"
                  >
                    <td className="px-4 py-3">
                      {new Date(
                        record.date
                      ).toLocaleDateString()}
                    </td>

                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-slate-800 dark:text-slate-200">
                          {course?.title || "-"}
                        </p>

                        {course?.subject && (
                          <p className="mt-0.5 text-xs text-slate-400">
                            {course.subject}
                          </p>
                        )}
                      </div>
                    </td>

                    <td className="px-4 py-3">
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
        )}
      </div>
    </div>
  );
}