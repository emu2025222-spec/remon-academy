
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  Bell,
  CalendarDays,
  Megaphone,
  ShieldCheck,
  Sparkles,
  FileText,
  ChevronRight,
} from "lucide-react";

import { api, getErrorMessage } from "../../services/api";
import { Notice } from "../../types";
import { Loader } from "../../components/Loader";
import { EmptyState } from "../../components/EmptyState";
import { useToast } from "../../components/Toast";

export default function StudentNotices() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);

  const { show } = useToast();

  useEffect(() => {
    api
      .get("/notices/public")
      .then((r) => {
        setNotices(r.data.data || []);
      })
      .catch((err) => {
        show(getErrorMessage(err), "error");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [show]);

  const formatDate = (date: string | Date) => {
    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Date unavailable";
    }

    return parsedDate.toLocaleDateString("en-BD", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
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
        <div className="pointer-events-none absolute -bottom-36 left-1/3 h-72 w-72 rounded-full bg-brand-goldLight/5 blur-3xl" />

        <div className="relative z-10">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-goldLight/20 bg-white/5 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-brand-goldLight">
            <Sparkles className="h-3.5 w-3.5" />
            REMON Academy Updates
          </div>

          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/50">
                <Megaphone className="h-4 w-4 text-brand-goldLight" />
                Student Information Center
              </div>

              <h1 className="mt-3 font-display text-4xl font-bold tracking-tight sm:text-5xl">
                Academy <span className="text-brand-goldLight">Notices.</span>
              </h1>

              <p className="mt-4 max-w-xl text-sm leading-7 text-white/65 sm:text-base">
                Stay connected with everything happening at REMON Academy.
                Find important announcements, examination updates, class
                schedules and other academic information in one place.
              </p>
            </div>

            <div className="flex w-fit items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.06] px-5 py-4 backdrop-blur-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-goldLight/15 text-brand-goldLight">
                <Bell className="h-6 w-6" />
              </div>

              <div>
                <p className="font-display text-3xl font-bold text-white">
                  {notices.length.toString().padStart(2, "0")}
                </p>
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/45">
                  Published Notices
                </p>
              </div>
            </div>
          </div>

          <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-white/10 pt-5 text-xs text-white/45">
            <span className="inline-flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-brand-goldLight" />
              Official Academy Updates
            </span>

            <span className="inline-flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-brand-goldLight" />
              Regularly Updated
            </span>
          </div>
        </div>
      </section>

      {/* NOTICE SECTION */}
      <section>
        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-brand-gold">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-gold" />
              Notice Board
            </div>

            <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
              Latest Announcements
            </h2>

            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Important information and announcements from the academy.
            </p>
          </div>

          {notices.length > 0 && (
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
              <FileText className="h-4 w-4 text-brand-gold" />
              {notices.length} {notices.length === 1 ? "Announcement" : "Announcements"}
            </div>
          )}
        </div>

        {notices.length === 0 ? (
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900/50 sm:p-12">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-navyDark text-brand-goldLight shadow-lg">
              <Bell className="h-7 w-7" />
            </div>

            <div className="text-center">
              <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white">
                No Notices Yet
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">
                There are no announcements available right now. Please check
                back later for the latest academy updates.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {notices.map((notice, index) => (
              <article
                key={notice._id}
                className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand-goldLight/60 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900/50 sm:p-7"
              >
                {/* LEFT ACCENT */}
                <div className="absolute bottom-0 left-0 top-0 w-1 bg-brand-goldLight transition-all duration-300 group-hover:w-1.5" />

                <div className="flex flex-col gap-5 pl-2 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
                  {/* NOTICE CONTENT */}
                  <div className="flex min-w-0 flex-1 gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-navyDark text-brand-goldLight shadow-md transition-transform duration-300 group-hover:scale-105">
                      <span className="font-display text-sm font-bold">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        {notice.category && (
                          <span className="rounded-full bg-brand-navy/10 px-3 py-1 text-[9px] font-bold uppercase tracking-[0.14em] text-brand-navy dark:bg-brand-goldLight/10 dark:text-brand-goldLight">
                            {notice.category}
                          </span>
                        )}

                        <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-slate-400">
                          <CalendarDays className="h-3.5 w-3.5 text-brand-gold" />
                          {formatDate(notice.date)}
                        </span>
                      </div>

                      <h3 className="mt-3 break-words font-display text-lg font-bold leading-7 text-slate-900 transition-colors group-hover:text-brand-navy dark:text-white dark:group-hover:text-brand-goldLight sm:text-xl">
                        {notice.title}
                      </h3>

                      {notice.description && (
                        <p className="mt-2 max-w-3xl whitespace-pre-line break-words text-sm leading-7 text-slate-500 dark:text-slate-400">
                          {notice.description}
                        </p>
                      )}

                      {notice.slug && (
                        <Link
                          to={`/notices/${notice.slug}`}
                          className="mt-5 inline-flex items-center gap-2 text-xs font-bold text-brand-navy no-underline transition-all hover:gap-3 dark:text-brand-goldLight"
                        >
                          Read Full Announcement
                          <ChevronRight className="h-4 w-4" />
                        </Link>
                      )}
                    </div>
                  </div>

                  {/* RIGHT INDICATOR */}
                  <div className="hidden shrink-0 items-center justify-center rounded-xl bg-slate-50 p-3 text-slate-400 transition-all group-hover:bg-brand-goldLight/10 group-hover:text-brand-gold dark:bg-slate-800/60 sm:flex">
                    <ArrowUpRight className="h-5 w-5" />
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* INFORMATION STRIP */}
      <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-slate-50/80 p-6 dark:border-slate-800 dark:bg-slate-900/40 sm:p-7">
        <div className="pointer-events-none absolute -right-10 -top-16 h-40 w-40 rounded-full bg-brand-goldLight/10 blur-3xl" />

        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-navyDark text-brand-goldLight shadow-md">
              <ShieldCheck className="h-6 w-6" />
            </div>

            <div>
              <h3 className="font-display text-base font-bold text-slate-900 dark:text-white">
                Stay Informed. Stay Ahead.
              </h3>

              <p className="mt-1 max-w-xl text-xs leading-6 text-slate-500 dark:text-slate-400">
                Academy notices may contain important information about
                classes, examinations, schedules, fees and student activities.
                Make sure to check the notice board regularly.
              </p>
            </div>
          </div>

          <div className="inline-flex shrink-0 items-center gap-2 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
            <Bell className="h-4 w-4 text-brand-gold" />
            Official Updates
          </div>
        </div>
      </section>

      {/* FOOTER BRANDING */}
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
