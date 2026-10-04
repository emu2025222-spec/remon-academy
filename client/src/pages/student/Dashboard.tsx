import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  CalendarCheck,
  Award,
  Bell,
  Wallet,
} from "lucide-react";
import { api } from "../../services/api";
import { Course, Notice } from "../../types";
import { Loader } from "../../components/Loader";

interface Summary {
  fullName: string;
  studentId: string;

  // Old single-course field
  course?: Course | string;

  // New multiple-course field
  courses?: (Course | string)[];
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
      api
        .get("/attendance/my")
        .catch(() => ({
          data: {
            data: {
              stats: {
                percentage: 0,
              },
            },
          },
        })),
      api
        .get("/results/my")
        .catch(() => ({
          data: {
            data: {
              results: [],
            },
          },
        })),
      api
        .get("/fees/my")
        .catch(() => ({
          data: {
            data: {
              pendingTotal: 0,
            },
          },
        })),
      api
        .get("/notices/public")
        .catch(() => ({
          data: {
            data: [],
          },
        })),
    ])
      .then(([p, att, res, fees, notice]) => {
        setProfile(p.data.data);

        setAttendancePct(
          att.data.data.stats?.percentage || 0
        );

        const results = res.data.data.results || [];

        setLatestGpa(
          results.length ? results[0].gpa : null
        );

        setPendingFees(
          fees.data.data.pendingTotal || 0
        );

        setNotices(
          (notice.data.data || []).slice(0, 3)
        );

        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <Loader label="Loading your dashboard..." />;
  }

  /*
   * Build assigned courses.
   *
   * New students:
   *   profile.courses[]
   *
   * Old students:
   *   profile.course
   *
   * This keeps existing student data working.
   */
  const assignedCourses: Course[] = [];

  if (Array.isArray(profile?.courses)) {
    profile.courses.forEach((course) => {
      if (
        typeof course === "object" &&
        course !== null
      ) {
        assignedCourses.push(course as Course);
      }
    });
  }

  // Backward compatibility with old single-course data
  if (
    assignedCourses.length === 0 &&
    profile?.course &&
    typeof profile.course === "object"
  ) {
    assignedCourses.push(
      profile.course as Course
    );
  }

  const courseCount = assignedCourses.length;

  return (
    <div>
      <h2 className="mb-1 font-display text-2xl font-bold text-slate-900 dark:text-white">
        Welcome, {profile?.fullName} 👋
      </h2>

      <p className="mb-8 text-sm text-slate-500">
        Student ID: {profile?.studentId}
      </p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Courses */}
        <div className="card flex items-center gap-4 p-5">
          <BookOpen className="h-8 w-8 shrink-0 text-brand-gold" />

          <div className="min-w-0">
            <p className="text-xs text-slate-500">
              Assigned Courses
            </p>

            <p className="font-semibold text-slate-900 dark:text-white">
              {courseCount === 0
                ? "Not assigned"
                : `${courseCount} ${
                    courseCount === 1
                      ? "Course"
                      : "Courses"
                  }`}
            </p>
          </div>
        </div>

        {/* Attendance */}
        <div className="card flex items-center gap-4 p-5">
          <CalendarCheck className="h-8 w-8 shrink-0 text-brand-gold" />

          <div>
            <p className="text-xs text-slate-500">
              Attendance
            </p>

            <p className="font-semibold text-slate-900 dark:text-white">
              {attendancePct}%
            </p>
          </div>
        </div>

        {/* GPA */}
        <div className="card flex items-center gap-4 p-5">
          <Award className="h-8 w-8 shrink-0 text-brand-gold" />

          <div>
            <p className="text-xs text-slate-500">
              Latest GPA
            </p>

            <p className="font-semibold text-slate-900 dark:text-white">
              {latestGpa ?? "N/A"}
            </p>
          </div>
        </div>

        {/* Fees */}
        <div className="card flex items-center gap-4 p-5">
          <Wallet className="h-8 w-8 shrink-0 text-brand-gold" />

          <div>
            <p className="text-xs text-slate-500">
              Pending Fees
            </p>

            <p className="font-semibold text-slate-900 dark:text-white">
              ৳{pendingFees}
            </p>
          </div>
        </div>
      </div>

      {/* Assigned Courses */}
      <div className="mt-8 card p-6">
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <h3 className="font-display text-lg font-semibold text-slate-900 dark:text-white">
              My Courses
            </h3>

            <p className="mt-1 text-xs text-slate-400">
              Courses assigned by the academy administration.
            </p>
          </div>

          <Link
            to="/student/profile"
            className="text-sm font-semibold text-brand-navy hover:underline dark:text-brand-goldLight"
          >
            View profile
          </Link>
        </div>

        {assignedCourses.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-200 p-6 text-center dark:border-slate-700">
            <BookOpen className="mx-auto mb-2 h-7 w-7 text-slate-400" />

            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              No course has been assigned yet.
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Please contact the academy office.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {assignedCourses.map((course, index) => (
              <div
                key={
                  course._id ||
                  `assigned-course-${index}`
                }
                className="rounded-xl border border-slate-200 p-5 dark:border-slate-700"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-900 dark:text-white">
                      {course.title}
                    </p>

                    {course.subject && (
                      <p className="mt-1 text-xs text-slate-400">
                        {course.subject}
                      </p>
                    )}
                  </div>

                  <span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                    Assigned
                  </span>
                </div>

                <div className="mt-4 space-y-2 text-xs text-slate-500 dark:text-slate-400">
                  {course.classLevel && (
                    <div className="flex justify-between gap-4">
                      <span>Class</span>

                      <span className="font-medium text-slate-700 dark:text-slate-300">
                        {course.classLevel}
                      </span>
                    </div>
                  )}

                  {course.duration && (
                    <div className="flex justify-between gap-4">
                      <span>Duration</span>

                      <span className="font-medium text-slate-700 dark:text-slate-300">
                        {course.duration}
                      </span>
                    </div>
                  )}

                  {course.fee !== undefined && (
                    <div className="flex justify-between gap-4">
                      <span>Course Fee</span>

                      <span className="font-semibold text-slate-700 dark:text-slate-300">
                        ৳{course.fee}
                      </span>
                    </div>
                  )}

                  {course.schedule && (
                    <div className="flex justify-between gap-4">
                      <span>Schedule</span>

                      <span className="text-right font-medium text-slate-700 dark:text-slate-300">
                        {course.schedule}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-4 rounded-lg bg-slate-50 p-3 text-xs text-slate-500 dark:bg-slate-800/50 dark:text-slate-400">
          Course enrollment can only be changed by the academy administration.
        </div>
      </div>

      {/* Latest Notices */}
      <div className="mt-8 card p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="flex items-center gap-2 font-display text-lg font-semibold text-slate-900 dark:text-white">
            <Bell className="h-5 w-5 text-brand-gold" />
            Latest Notices
          </h3>

          <Link
            to="/student/notices"
            className="text-sm font-semibold text-brand-navy hover:underline dark:text-brand-goldLight"
          >
            View all
          </Link>
        </div>

        {notices.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-200 p-6 text-center dark:border-slate-700">
            <p className="text-sm text-slate-400">
              No notices available.
            </p>
          </div>
        ) : (
          <ul className="space-y-3">
            {notices.map((n) => (
              <li
                key={n._id}
                className="border-b border-slate-100 pb-3 last:border-0 dark:border-slate-800"
              >
                <p className="font-medium text-slate-800 dark:text-slate-200">
                  {n.title}
                </p>

                <p className="text-xs text-slate-400">
                  {new Date(
                    n.date
                  ).toLocaleDateString()}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}