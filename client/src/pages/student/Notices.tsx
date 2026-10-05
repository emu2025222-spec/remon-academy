import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  Bell,
  CalendarDays,
  Megaphone,
  ShieldCheck,
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

  if (loading) {
    return <Loader />;
  }

  if (notices.length === 0) {
    return (
      <div className="space-y-8 pb-10">
        <section className="relative overflow-hidden rounded-3xl bg-brand-navyDark px-6 py-8 text-white sm:px-8 sm:py-10">
          <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full border border-brand-goldLight/10" />

          <div className="relative z-10">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-brand-goldLight">
              <Bell className="h-3.5 w-3.5" />
              Academy Updates
            </div>

            <h1 className="font-display text-3xl font-semibold sm:text-4xl">
              Notices
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/65">
              Stay informed about important academy announcements,
              schedules and updates.
            </p>
          </div>
        </section>

        <div className="card-premium p-8">
          <EmptyState message="No notices published yet." />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      {/* =========================================================
          HEADER
      ========================================================= */}
      <section className="relative overflow-hidden rounded-3xl bg-brand-navyDark px-6 py-8 text-white sm:px-8 sm:py-10">
        <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full border border-brand-goldLight/10" />

        <div className="absolute -bottom-24 right-24 h-64 w-64 rounded-full border border-brand-goldLight/10" />

        <div className="relative z-10">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-brand-goldLight">
            <Megaphone className="h-3.5 w-3.5" />
            Academy Updates
          </div>

          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
                Notices
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-white/65">
                Important announcements and updates from
                the academy administration.
              </p>
            </div>

            <div className="flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-white/75">
              <Bell className="h-4 w-4 text-brand-goldLight" />

              {notices.length}{" "}
              {notices.length === 1
                ? "Notice"
                : "Notices"}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          NOTICE LIST
      ========================================================= */}
      <section>
        <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-brand-gold">
              <Bell className="h-4 w-4" />
              Latest Information
            </div>

            <h2 className="mt-2 font-display text-xl font-semibold text-slate-900 dark:text-white">
              Recent announcements
            </h2>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Check this section regularly for academy updates.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {notices.map((notice, index) => (
            <article
              key={notice._id}
              className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-brand-goldLight/60 hover:shadow-md dark:border-slate-800 dark:bg-slate-900/40"
            >
              {/* Accent */}
              <div className="absolute left-0 top-0 h-full w-1 bg-brand-goldLight opacity-80" />

              <div className="pl-2">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                  {/* Main */}
                  <div className="flex min-w-0 gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-goldLight/15 text-brand-gold">
                      <span className="font-display text-xs font-bold">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        {notice.category && (
                          <span className="rounded-full bg-brand-navy/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-brand-navy dark:bg-brand-goldLight/10 dark:text-brand-goldLight">
                            {notice.category}
                          </span>
                        )}

                        <span className="inline-flex items-center gap-1 text-[11px] text-slate-400">
                          <CalendarDays className="h-3.5 w-3.5" />

                          {new Date(
                            notice.date
                          ).toLocaleDateString("en-BD", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </div>

                      <h3 className="mt-3 font-display text-lg font-semibold leading-6 text-slate-900 dark:text-white sm:text-xl">
                        {notice.title}
                      </h3>

                      {notice.description && (
                        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500 dark:text-slate-400">
                          {notice.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Link */}
                  {notice.slug && (
                    <Link
                      to={`/notices/${notice.slug}`}
                      className="inline-flex shrink-0 items-center gap-2 self-start rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-bold text-slate-700 no-underline transition hover:border-brand-goldLight hover:text-brand-navy dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-300"
                    >
                      Read notice
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </Link>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* =========================================================
          INFO STRIP
      ========================================================= */}
      <section className="rounded-3xl border border-slate-200 bg-slate-50/70 px-6 py-6 dark:border-slate-800 dark:bg-slate-900/30">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-navyDark text-brand-goldLight">
              <ShieldCheck className="h-5 w-5" />
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                Stay updated.
              </p>

              <p className="mt-1 max-w-xl text-xs leading-5 text-slate-400">
                Academy notices may include important information
                about classes, examinations, schedules and other
                student activities.
              </p>
            </div>
          </div>

          <div className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
            <Bell className="h-4 w-4 text-brand-gold" />
            Check regularly for new announcements
          </div>
        </div>
      </section>
    </div>
  );
}

