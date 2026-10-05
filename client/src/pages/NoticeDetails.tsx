import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowUpRight,
  Bell,
  CalendarDays,
  Paperclip,
  ShieldCheck,
} from "lucide-react";

import { api, getErrorMessage } from "../services/api";
import { Notice } from "../types";
import { Loader } from "../components/Loader";
import { ErrorState } from "../components/ErrorState";

export default function NoticeDetails() {
  const { id } = useParams();

  const [notice, setNotice] = useState<Notice | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get(`/notices/public/${id}`)
      .then((r) => setNotice(r.data.data))
      .catch((e) => setError(getErrorMessage(e)))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-[#f5f3ee] dark:bg-[#080c14]">
        <Loader />
      </main>
    );
  }

  if (error || !notice) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-[#f5f3ee] px-5 dark:bg-[#080c14]">
        <div className="w-full max-w-xl">
          <ErrorState message={error || "Notice not found"} />
        </div>
      </main>
    );
  }

  return (
    <main className="overflow-hidden bg-[#f5f3ee] text-[#111827] dark:bg-[#080c14] dark:text-white">

      {/* ============================================================
          HERO
      ============================================================ */}

      <section className="relative overflow-hidden bg-[#101722] py-16 text-white sm:py-20 lg:py-24">

        <div className="pointer-events-none absolute right-[-150px] top-[-160px] h-[420px] w-[420px] rounded-full border border-brand-gold/[0.08]" />

        <div className="pointer-events-none absolute bottom-[-180px] left-[-140px] h-[380px] w-[380px] rounded-full border border-white/[0.04]" />

        <div className="container-page relative">

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >

            <Link
              to="/notices"
              className="group inline-flex items-center gap-2 text-xs font-semibold text-slate-400 no-underline transition-colors hover:text-brand-gold"
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Back to Notices
            </Link>

            <div className="mt-10 flex items-center gap-3">

              <span className="h-px w-10 bg-brand-gold" />

              <span className="text-[9px] font-bold uppercase tracking-[0.35em] text-brand-gold">
                Official Announcement
              </span>

            </div>

            <div className="mt-6 max-w-4xl">

              <span className="inline-flex items-center gap-2 border border-brand-gold/30 bg-brand-gold/[0.06] px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.18em] text-brand-gold">

                <Bell className="h-3.5 w-3.5" />

                {notice.category}

              </span>

              <h1 className="mt-6 font-display text-4xl font-bold leading-[1.08] tracking-[-0.04em] sm:text-5xl lg:text-6xl">
                {notice.title}
              </h1>

              <div className="mt-7 flex flex-wrap items-center gap-5 text-xs text-slate-400">

                <span className="flex items-center gap-2">

                  <CalendarDays className="h-4 w-4 text-brand-gold" />

                  {new Date(notice.date).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}

                </span>

                <span className="h-1 w-1 rounded-full bg-slate-600" />

                <span className="flex items-center gap-2">

                  <ShieldCheck className="h-4 w-4 text-brand-gold" />

                  REMON ACADEMY

                </span>

              </div>

            </div>

          </motion.div>

        </div>
      </section>

      {/* ============================================================
          CONTENT
      ============================================================ */}

      <section className="py-16 sm:py-20 lg:py-24">

        <div className="container-page">

          <div className="grid gap-12 lg:grid-cols-[1fr_300px] lg:items-start">

            {/* Main article */}

            <motion.article
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.08 }}
              className="min-w-0"
            >

              <div className="border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">

                <div className="p-6 sm:p-9 lg:p-12">

                  <div className="mb-8 flex items-center gap-3">

                    <span className="h-8 w-1 bg-brand-gold" />

                    <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-slate-400">
                      Notice Details
                    </p>

                  </div>

                  <div className="whitespace-pre-line text-sm leading-8 text-slate-600 dark:text-slate-300 sm:text-base sm:leading-9">
                    {notice.description}
                  </div>

                  {/* Attachment */}

                  {notice.attachment && (
                    <div className="mt-10 border-t border-slate-200 pt-8 dark:border-slate-800">

                      <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-brand-gold">
                        Related Document
                      </p>

                      <a
                        href={notice.attachment}
                        target="_blank"
                        rel="noreferrer"
                        className="group mt-4 flex items-center justify-between border border-slate-200 bg-[#faf9f6] p-4 no-underline transition-all hover:border-brand-gold/50 hover:bg-brand-gold/[0.04] dark:border-slate-800 dark:bg-slate-950"
                      >

                        <div className="flex min-w-0 items-center gap-4">

                          <div className="flex h-11 w-11 shrink-0 items-center justify-center border border-brand-gold/30">

                            <Paperclip className="h-5 w-5 text-brand-gold" />

                          </div>

                          <div className="min-w-0">

                            <p className="text-sm font-bold text-[#111827] dark:text-white">
                              View Attachment
                            </p>

                            <p className="mt-1 text-xs text-slate-400">
                              Open the attached document or file
                            </p>

                          </div>

                        </div>

                        <ArrowUpRight className="ml-4 h-4 w-4 shrink-0 text-slate-400 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand-gold" />

                      </a>

                    </div>
                  )}

                </div>

              </div>

            </motion.article>

            {/* Sidebar */}

            <motion.aside
              initial={{ opacity: 0, x: 18 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="lg:sticky lg:top-28"
            >

              <div className="border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">

                <div className="border-b border-slate-200 p-6 dark:border-slate-800">

                  <div className="flex h-11 w-11 items-center justify-center border border-brand-gold/30 bg-brand-gold/[0.05]">

                    <Bell className="h-5 w-5 text-brand-gold" />

                  </div>

                  <h3 className="mt-5 font-display text-lg font-bold">
                    Academy Notice
                  </h3>

                  <p className="mt-2 text-xs leading-6 text-slate-500">
                    This is an official announcement published by REMON
                    ACADEMY.
                  </p>

                </div>

                <div className="p-6">

                  <div className="space-y-5">

                    <div>

                      <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">
                        Category
                      </p>

                      <p className="mt-1 text-sm font-semibold">
                        {notice.category}
                      </p>

                    </div>

                    <div>

                      <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">
                        Published
                      </p>

                      <p className="mt-1 text-sm font-semibold">
                        {new Date(notice.date).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>

                    </div>

                  </div>

                  <Link
                    to="/notices"
                    className="group mt-7 flex items-center justify-center gap-2 border border-slate-200 px-5 py-3 text-xs font-bold text-[#101722] no-underline transition-all hover:border-brand-gold hover:text-brand-gold dark:border-slate-700 dark:text-white"
                  >
                    <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
                    All Notices
                  </Link>

                </div>

              </div>

            </motion.aside>

          </div>

        </div>
      </section>

      {/* ============================================================
          FOOTER CTA
      ============================================================ */}

      <section className="bg-[#101722] py-16 text-white sm:py-20">

        <div className="container-page">

          <div className="flex flex-col gap-7 sm:flex-row sm:items-center sm:justify-between">

            <div>

              <p className="text-[9px] font-bold uppercase tracking-[0.35em] text-brand-gold">
                Stay Updated
              </p>

              <h2 className="mt-3 font-display text-2xl font-bold sm:text-3xl">
                More academy announcements
              </h2>

            </div>

            <Link
              to="/notices"
              className="group inline-flex w-fit items-center gap-3 border border-white/15 px-6 py-3.5 text-sm font-bold text-white no-underline transition-colors hover:border-brand-gold hover:text-brand-gold"
            >
              View All Notices
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>

          </div>

        </div>
      </section>

    </main>
  );
}


