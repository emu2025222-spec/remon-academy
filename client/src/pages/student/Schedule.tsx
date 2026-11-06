
import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  GraduationCap,
  MapPin,
  UserRound,
  Sparkles,
  BookOpen,
  ShieldCheck,
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

  const sorted = useMemo(() => {
    return [...items].sort((a, b) => {
      const aIndex = dayOrder.indexOf(a.day);
      const bIndex = dayOrder.indexOf(b.day);

      return (
        (aIndex === -1 ? 99 : aIndex) -
        (bIndex === -1 ? 99 : bIndex)
      );
    });
  }, [items]);

  const uniqueDays = useMemo(
    () => Array.from(new Set(sorted.map((item) => item.day))),
    [sorted]
  );

  const getTeacherName = (teacher: ScheduleItem["teacher"]) => {
    return typeof teacher === "object" && teacher !== null
      ? (teacher as Teacher).name
      : "-";
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="space-y-8 pb-12">
      {/* HERO SECTION */}
      <section className="relative isolate overflow-hidden rounded-[2rem] bg-brand-navyDark px-6 py-9 text-white shadow-xl sm:px-9 sm:py-12">
        <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full border border-brand-goldLight/10" />
        <div className="pointer-events-none absolute -right-10 -top-14 h-52 w-52 rounded-full border border-brand-goldLight/10" />
        <div className="pointer-events-none absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-brand-goldLight/5 blur-3xl" />

        <div className="relative z-10">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-goldLight/20 bg-white/5 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-brand-goldLight">
            <Sparkles className="h-3.5 w-3.5" />
            REMON Academy
          </div>

          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/50">
                <CalendarDays className="h-4 w-4 text-brand-goldLight" />
                Academic Planning
              </div>

              <h1 className="mt-3 font-display text-4xl font-bold tracking-tight sm:text-5xl">
                Class <span className="text-brand-goldLight">Schedule.</span>
              </h1>

              <p className="mt-4 max-w-xl text-sm leading-7 text-white/65 sm:text-base">
                Your complete weekly class routine, organized in one place.
                Stay prepared with your class timings, subjects, teachers
                and classroom information.
              </p>
            </div>

            <div className="flex w-fit items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.06] px-5 py-4 backdrop-blur-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-goldLight/15 text-brand-goldLight">
                <Clock3 className="h-6 w-6" />
              </div>

              <div>
                <p className="font-display text-3xl font-bold text-white">
                  {items.length.toString().padStart(2, "0")}
                </p>
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/45">
                  Scheduled Classes
                </p>
              </div>
            </div>
          </div>

          <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-white/10 pt-5 text-xs text-white/45">
            <span className="inline-flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-brand-goldLight" />
              Official Class Routine
            </span>

            <span className="inline-flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-brand-goldLight" />
              Weekly Schedule
            </span>
          </div>
        </div>
      </section>

      {/* EMPTY STATE */}
      {items.length === 0 ? (
        <section className="space-y-6">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-brand-gold">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-gold" />
              Weekly Routine
            </div>

            <h2 className="mt-2 font-display text-2xl font-bold text-slate-900 dark:text-white">
              Your Timetable
            </h2>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900/50 sm:p-12">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-navyDark text-brand-goldLight shadow-lg">
              <CalendarDays className="h-7 w-7" />
            </div>

            <div className="text-center">
              <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white">
                No Schedule Available
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">
                Your weekly class routine has not been published yet.
                Please check back later for your updated schedule.
              </p>
            </div>
          </div>

          <div className="rounded-3xl bg-brand-navyDark px-6 py-6 text-white sm:px-8">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-brand-goldLight">
                <ShieldCheck className="h-5 w-5" />
              </div>

              <div>
                <p className="text-sm font-semibold">
                  Stay prepared for your classes.
                </p>
                <p className="mt-1 text-xs leading-5 text-white/55">
                  Your class schedule will appear here after the academy
                  publishes your routine.
                </p>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <>
          {/* WEEKLY OVERVIEW */}
          <section>
            <div className="mb-6">
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-brand-gold">
                <GraduationCap className="h-4 w-4" />
                Weekly Overview
              </div>

              <h2 className="mt-2 font-display text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
                Your Class Timetable
              </h2>

              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                A complete overview of your weekly academic routine.
              </p>
            </div>

            {/* DAY SUMMARY */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
              {dayOrder.map((day) => {
                const count = sorted.filter(
                  (item) => item.day === day
                ).length;

                const active = count > 0;

                return (
                  <div
                    key={day}
                    className={`group rounded-2xl border p-4 transition-all duration-300 hover:-translate-y-1 ${
                      active
                        ? "border-brand-goldLight/50 bg-brand-goldLight/5 shadow-sm hover:shadow-md"
                        : "border-slate-200 bg-slate-50/70 dark:border-slate-800 dark:bg-slate-900/30"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <p
                        className={`text-[10px] font-bold uppercase tracking-[0.12em] ${
                          active
                            ? "text-brand-gold"
                            : "text-slate-400"
                        }`}
                      >
                        {day}
                      </p>

                      {active && (
                        <span className="h-2 w-2 rounded-full bg-brand-gold" />
                      )}
                    </div>

                    <p className="mt-3 font-display text-2xl font-bold text-slate-900 dark:text-white">
                      {count.toString().padStart(2, "0")}
                    </p>

                    <p className="mt-0.5 text-[10px] text-slate-400">
                      {count === 1 ? "Class" : "Classes"}
                    </p>
                  </div>
                );
              })}
            </div>
          </section>

          {/* DESKTOP TABLE */}
          <section className="hidden overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900/40 md:block">
            <div className="flex flex-col justify-between gap-4 border-b border-slate-100 px-6 py-5 dark:border-slate-800 sm:flex-row sm:items-center">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-goldLight/15 text-brand-gold">
                  <CalendarDays className="h-5 w-5" />
                </div>

                <div>
                  <h3 className="font-display text-base font-bold text-slate-900 dark:text-white">
                    Weekly Class Routine
                  </h3>

                  <p className="mt-1 text-xs text-slate-400">
                    {uniqueDays.length} active{" "}
                    {uniqueDays.length === 1 ? "day" : "days"} this week
                  </p>
                </div>
              </div>

              <div className="inline-flex w-fit items-center gap-2 rounded-full bg-brand-navy/5 px-4 py-2 text-xs font-semibold text-brand-navy dark:bg-brand-goldLight/10 dark:text-brand-goldLight">
                <BookOpen className="h-4 w-4" />
                {items.length} Total Classes
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 dark:bg-slate-800/60">
                  <tr className="text-left text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
                    <th className="px-6 py-4">Day</th>
                    <th className="px-6 py-4">Subject</th>
                    <th className="px-6 py-4">Teacher</th>
                    <th className="px-6 py-4">Room</th>
                    <th className="px-6 py-4">Time</th>
                  </tr>
                </thead>

                <tbody>
                  {sorted.map((schedule) => (
                    <tr
                      key={schedule._id}
                      className="border-t border-slate-100 transition-colors hover:bg-slate-50/70 dark:border-slate-800 dark:hover:bg-slate-800/30"
                    >
                      <td className="px-6 py-5">
                        <div>
                          <p className="font-semibold text-slate-800 dark:text-slate-200">
                            {dayNames[schedule.day] || schedule.day}
                          </p>

                          <p className="mt-1 text-[10px] font-bold uppercase tracking-wide text-brand-gold">
                            {schedule.day}
                          </p>
                        </div>
                      </td>

                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-goldLight/10 text-brand-gold">
                            <BookOpen className="h-4 w-4" />
                          </div>

                          <span className="font-semibold text-slate-800 dark:text-slate-200">
                            {schedule.subject}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-5">
                        <span className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400">
                          <UserRound className="h-4 w-4 text-brand-gold" />
                          {getTeacherName(schedule.teacher)}
                        </span>
                      </td>

                      <td className="px-6 py-5">
                        <span className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400">
                          <MapPin className="h-4 w-4 text-slate-400" />
                          {schedule.room || "-"}
                        </span>
                      </td>

                      <td className="px-6 py-5">
                        <span className="inline-flex items-center gap-2 rounded-full bg-brand-navy/5 px-3 py-2 text-xs font-bold text-brand-navy dark:bg-brand-goldLight/10 dark:text-brand-goldLight">
                          <Clock3 className="h-3.5 w-3.5" />
                          {schedule.startTime} - {schedule.endTime}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* MOBILE CLASS CARDS */}
          <section className="space-y-4 md:hidden">
            <div>
              <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white">
                Your Scheduled Classes
              </h3>
              <p className="mt-1 text-xs text-slate-400">
                Your weekly routine in mobile-friendly format.
              </p>
            </div>

            {sorted.map((schedule, index) => (
              <article
                key={schedule._id}
                className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:border-brand-goldLight/50 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900/40"
              >
                <div className="absolute bottom-0 left-0 top-0 w-1 bg-brand-goldLight transition-all group-hover:w-1.5" />

                <div className="pl-2">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex min-w-0 gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-navyDark text-brand-goldLight shadow-md">
                        <CalendarDays className="h-5 w-5" />
                      </div>

                      <div className="min-w-0">
                        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-brand-gold">
                          {dayNames[schedule.day] || schedule.day}
                        </p>

                        <h3 className="mt-1 break-words font-display text-lg font-bold text-slate-900 dark:text-white">
                          {schedule.subject}
                        </h3>
                      </div>
                    </div>

                    <span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                      #{index + 1}
                    </span>
                  </div>

                  <div className="mt-5 space-y-4 border-t border-slate-100 pt-4 dark:border-slate-800">
                    <div className="flex items-center justify-between gap-4">
                      <span className="flex items-center gap-2 text-xs text-slate-400">
                        <UserRound className="h-3.5 w-3.5" />
                        Teacher
                      </span>

                      <span className="text-right text-sm font-semibold text-slate-700 dark:text-slate-300">
                        {getTeacherName(schedule.teacher)}
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
                        Class Time
                      </span>

                      <span className="rounded-full bg-brand-goldLight/10 px-3 py-1.5 text-xs font-bold text-brand-gold">
                        {schedule.startTime} - {schedule.endTime}
                      </span>
                    </div>
                  </div>

                  <div className="mt-5 flex items-center gap-2 border-t border-slate-100 pt-4 text-[11px] font-medium text-slate-400 dark:border-slate-800">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                    Scheduled class
                  </div>
                </div>
              </article>
            ))}
          </section>
        </>
      )}

      {/* INFORMATION STRIP */}
      <section className="relative overflow-hidden rounded-3xl bg-brand-navyDark px-6 py-7 text-white sm:px-8">
        <div className="pointer-events-none absolute -right-10 -top-16 h-40 w-40 rounded-full bg-brand-goldLight/10 blur-3xl" />

        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-brand-goldLight">
              <Clock3 className="h-5 w-5" />
            </div>

            <div>
              <h3 className="font-display text-base font-bold">
                Be Ready. Be On Time.
              </h3>

              <p className="mt-1 max-w-xl text-xs leading-6 text-white/55">
                Please arrive before your scheduled class time.
                Always check academy notices for routine changes
                and important academic announcements.
              </p>
            </div>
          </div>

          <div className="inline-flex shrink-0 items-center gap-2 text-[10px] font-bold uppercase tracking-[0.14em] text-white/60">
            <CheckCircle2 className="h-4 w-4 text-brand-goldLight" />
            {items.length} Scheduled {items.length === 1 ? "Class" : "Classes"}
          </div>
        </div>
      </section>

      {/* BRAND FOOTER */}
      <div className="flex flex-col items-center justify-center gap-2 pt-2 text-center">
        <p className="font-display text-xs font-bold tracking-[0.2em] text-slate-400">
          REMON ACADEMY
        </p>
        <p className="text-[10px] tracking-wide text-slate-400">
          Learn. Grow. Achieve.
        </p>
      </div>
    </div>
  );
}
