import { useEffect, useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  GraduationCap,
  MapPin,
  UserRound,
} from "lucide-react";

import { api, getErrorMessage } from "../../services/api";
import { ScheduleItem, Teacher } from "../../types";
import { Loader } from "../../components/Loader";
import { EmptyState } from "../../components/EmptyState";
import { useToast } from "../../components/Toast";

const dayOrder = [
  "SAT",
  "SUN",
  "MON",
  "TUE",
  "WED",
  "THU",
  "FRI",
];

const dayNames: Record<string, string> = {
  SAT: "Saturday",
  SUN: "Sunday",
  MON: "Monday",
  TUE: "Tuesday",
  WED: "Wednesday",
  THU: "Thursday",
  FRI: "Friday",
};

export default function StudentSchedule() {
  const [items, setItems] = useState<ScheduleItem[]>([]);
  const [loading, setLoading] = useState(true);

  const { show } = useToast();

  useEffect(() => {
    api
      .get("/schedule/my")
      .then((r) => {
        setItems(r.data.data || []);
      })
      .catch((err) => {
        show(getErrorMessage(err), "error");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [show]);

  if (loading) {
    return <Loader />;
  }

  if (items.length === 0) {
    return (
      <div className="space-y-8 pb-10">
        <section className="relative overflow-hidden rounded-3xl bg-brand-navyDark px-6 py-8 text-white sm:px-8 sm:py-10">
          <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full border border-brand-goldLight/10" />

          <div className="relative z-10">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-brand-goldLight">
              <CalendarDays className="h-3.5 w-3.5" />
              Academic Schedule
            </div>

            <h1 className="font-display text-3xl font-semibold sm:text-4xl">
              Class Schedule
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/65">
              Your weekly class routine will appear here once
              the academy publishes your schedule.
            </p>
          </div>
        </section>

        <div className="card-premium p-8">
          <EmptyState message="No class schedule available yet." />
        </div>
      </div>
    );
  }

  const sorted = [...items].sort(
    (a, b) =>
      dayOrder.indexOf(a.day) -
      dayOrder.indexOf(b.day)
  );

  const uniqueDays = Array.from(
    new Set(sorted.map((item) => item.day))
  );

  return (
    <div className="space-y-8 pb-10">
      {/* =====================================================
          HEADER
      ===================================================== */}
      <section className="relative overflow-hidden rounded-3xl bg-brand-navyDark px-6 py-8 text-white sm:px-8 sm:py-10">
        <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full border border-brand-goldLight/10" />

        <div className="absolute -bottom-24 right-24 h-64 w-64 rounded-full border border-brand-goldLight/10" />

        <div className="relative z-10">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-brand-goldLight">
            <CalendarDays className="h-3.5 w-3.5" />
            Academic Schedule
          </div>

          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
                Class Schedule
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-white/65">
                Your weekly class routine, teachers, rooms and
                timings in one place.
              </p>
            </div>

            <div className="flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-white/75">
              <Clock3 className="h-4 w-4 text-brand-goldLight" />

              {items.length}{" "}
              {items.length === 1
                ? "Class"
                : "Classes"}
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          WEEK OVERVIEW
      ===================================================== */}
      <section>
        <div className="mb-5">
          <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-brand-gold">
            <GraduationCap className="h-4 w-4" />
            Weekly Routine
          </div>

          <h2 className="mt-2 font-display text-xl font-semibold text-slate-900 dark:text-white">
            Your class timetable
          </h2>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Classes are arranged according to the academy's weekly
            schedule.
          </p>
        </div>

        {/* Day Summary */}
        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
          {dayOrder.map((day) => {
            const count = sorted.filter(
              (item) => item.day === day
            ).length;

            const active = count > 0;

            return (
              <div
                key={day}
                className={`rounded-2xl border p-4 transition ${
                  active
                    ? "border-brand-goldLight/50 bg-brand-goldLight/5"
                    : "border-slate-200 bg-slate-50/70 dark:border-slate-800 dark:bg-slate-900/30"
                }`}
              >
                <p
                  className={`text-[10px] font-bold uppercase tracking-[0.12em] ${
                    active
                      ? "text-brand-gold"
                      : "text-slate-400"
                  }`}
                >
                  {day}
                </p>

                <p className="mt-2 font-display text-xl font-semibold text-slate-900 dark:text-white">
                  {count}
                </p>

                <p className="mt-0.5 text-[10px] text-slate-400">
                  {count === 1 ? "class" : "classes"}
                </p>
              </div>
            );
          })}
        </div>

        {/* ===================================================
            DESKTOP TABLE
        =================================================== */}
        <div className="hidden overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900/40 md:block">
          <div className="border-b border-slate-100 px-6 py-5 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-goldLight/15 text-brand-gold">
                <CalendarDays className="h-4.5 w-4.5" />
              </div>

              <div>
                <h3 className="font-display text-base font-semibold text-slate-900 dark:text-white">
                  Weekly Class Routine
                </h3>

                <p className="mt-0.5 text-xs text-slate-400">
                  {uniqueDays.length} active{" "}
                  {uniqueDays.length === 1
                    ? "day"
                    : "days"}{" "}
                  this week
                </p>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/60">
                <tr className="text-left text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
                  <th className="px-5 py-4">
                    Day
                  </th>

                  <th className="px-5 py-4">
                    Subject
                  </th>

                  <th className="px-5 py-4">
                    Teacher
                  </th>

                  <th className="px-5 py-4">
                    Room
                  </th>

                  <th className="px-5 py-4">
                    Time
                  </th>
                </tr>
              </thead>

              <tbody>
                {sorted.map((schedule) => {
                  const teacher =
                    typeof schedule.teacher ===
                    "object"
                      ? (schedule.teacher as Teacher)
                          .name
                      : "-";

                  return (
                    <tr
                      key={schedule._id}
                      className="border-t border-slate-100 transition hover:bg-slate-50/70 dark:border-slate-800 dark:hover:bg-slate-800/30"
                    >
                      <td className="px-5 py-4">
                        <div>
                          <p className="font-semibold text-slate-800 dark:text-slate-200">
                            {dayNames[
                              schedule.day
                            ] || schedule.day}
                          </p>

                          <p className="mt-0.5 text-[10px] font-bold uppercase tracking-wide text-brand-gold">
                            {schedule.day}
                          </p>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                          {schedule.subject}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <span className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400">
                          <UserRound className="h-3.5 w-3.5 text-brand-gold" />
                          {teacher}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <span className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400">
                          <MapPin className="h-3.5 w-3.5 text-slate-400" />
                          {schedule.room || "-"}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <span className="inline-flex items-center gap-2 rounded-full bg-brand-navy/5 px-3 py-1.5 text-xs font-bold text-brand-navy dark:bg-brand-goldLight/10 dark:text-brand-goldLight">
                          <Clock3 className="h-3.5 w-3.5" />
                          {schedule.startTime} -{" "}
                          {schedule.endTime}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* ===================================================
            MOBILE CARDS
        =================================================== */}
        <div className="space-y-4 md:hidden">
          {sorted.map((schedule, index) => {
            const teacher =
              typeof schedule.teacher === "object"
                ? (schedule.teacher as Teacher).name
                : "-";

            return (
              <div
                key={schedule._id}
                className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/40"
              >
                <div className="absolute left-0 top-0 h-full w-1 bg-brand-goldLight" />

                <div className="pl-2">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex min-w-0 gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-goldLight/15 text-brand-gold">
                        <CalendarDays className="h-5 w-5" />
                      </div>

                      <div className="min-w-0">
                        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-brand-gold">
                          {dayNames[schedule.day] ||
                            schedule.day}
                        </p>

                        <h3 className="mt-1 truncate font-display text-lg font-semibold text-slate-900 dark:text-white">
                          {schedule.subject}
                        </h3>
                      </div>
                    </div>

                    <span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                      #{index + 1}
                    </span>
                  </div>

                  <div className="mt-5 space-y-3 border-t border-slate-100 pt-4 dark:border-slate-800">
                    <div className="flex items-center justify-between gap-4">
                      <span className="flex items-center gap-2 text-xs text-slate-400">
                        <UserRound className="h-3.5 w-3.5" />
                        Teacher
                      </span>

                      <span className="text-right text-sm font-semibold text-slate-700 dark:text-slate-300">
                        {teacher}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-4">
                      <span className="flex items-center gap-2 text-xs text-slate-400">
                        <MapPin className="h-3.5 w-3.5" />
                        Room
                      </span>

                      <span className="text-right text-sm font-semibold text-slate-700 dark:text-slate-300">
                        {schedule.room || "-"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-4">
                      <span className="flex items-center gap-2 text-xs text-slate-400">
                        <Clock3 className="h-3.5 w-3.5" />
                        Time
                      </span>

                      <span className="rounded-full bg-brand-goldLight/10 px-3 py-1.5 text-xs font-bold text-brand-gold">
                        {schedule.startTime} -{" "}
                        {schedule.endTime}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center gap-2 border-t border-slate-100 pt-4 text-[11px] text-slate-400 dark:border-slate-800">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                    Scheduled class
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* =====================================================
          INFO STRIP
      ===================================================== */}
      <section className="rounded-3xl bg-brand-navyDark px-6 py-6 text-white sm:px-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-brand-goldLight">
              <Clock3 className="h-5 w-5" />
            </div>

            <div>
              <p className="text-sm font-semibold">
                Keep your routine in mind.
              </p>

              <p className="mt-1 max-w-xl text-xs leading-5 text-white/55">
                Please arrive before your scheduled class time
                and check the academy notices for any routine
                changes.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-white/60">
            <CheckCircle2 className="h-4 w-4 text-brand-goldLight" />
            {items.length} scheduled{" "}
            {items.length === 1
              ? "class"
              : "classes"}
          </div>
        </div>
      </section>
    </div>
  );
}