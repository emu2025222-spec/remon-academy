import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  Bell,
  CalendarDays,
  Megaphone,
  ShieldCheck,
} from "lucide-react";

import { api, getErrorMessage } from "../services/api";
import { Notice } from "../types";
import { Loader } from "../components/Loader";
import { EmptyState } from "../components/EmptyState";
import { ErrorState } from "../components/ErrorState";

export default function Notices() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/notices/public")
      .then((r) => setNotices(r.data.data))
      .catch((e) => setError(getErrorMessage(e)))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="overflow-hidden bg-[#f5f3ee] text-[#111827] dark:bg-[#080c14] dark:text-white">

      {/* ============================================================
          HERO
      ============================================================ */}

      <section className="relative overflow-hidden bg-[#101722] py-20 text-white sm:py-24 lg:py-28">

        <div className="pointer-events-none absolute right-[-150px] top-[-160px] h-[430px] w-[430px] rounded-full border border-brand-gold/[0.08]" />

        <div className="pointer-events-none absolute bottom-[-180px] left-[-130px] h-[380px] w-[380px] rounded-full border border-white/[0.04]" />

        <div className="container-page relative">

          <div className="grid gap-12 lg:grid-cols-[0.65fr_1.35fr] lg:items-end">

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55 }}
            >
              <div className="flex items-center gap-3">

                <span className="h-px w-10 bg-brand-gold" />

                <span className="text-[9px] font-bold uppercase tracking-[0.35em] text-brand-gold">
                  Academy Updates
                </span>

              </div>

              <p className="mt-6 max-w-xs text-sm leading-7 text-slate-400">
                Important announcements, academic updates and information
                for students and guardians.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.08 }}
            >

              <h1 className="font-display text-4xl font-bold leading-[1.02] tracking-[-0.04em] sm:text-5xl lg:text-[5rem]">
                Stay
                <br />
                <span className="text-brand-gold">
                  informed.
                </span>
              </h1>

              <p className="mt-7 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base sm:leading-8">
                Keep up with the latest academic announcements, schedules,
                events and important information from REMON ACADEMY.
              </p>

            </motion.div>

          </div>

        </div>
      </section>

      {/* ============================================================
          INFO STRIP
      ============================================================ */}

      <section className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">

        <div className="container-page grid md:grid-cols-3">

          <div className="flex items-center gap-4 border-b border-slate-200 px-2 py-7 dark:border-slate-800 md:border-b-0 md:border-r md:px-8">

            <div className="flex h-11 w-11 shrink-0 items-center justify-center border border-brand-gold/30">
              <Megaphone className="h-5 w-5 text-brand-gold" />
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-slate-400">
                Announcements
              </p>

              <p className="mt-1 text-sm font-semibold">
                Latest academy updates
              </p>
            </div>

          </div>

          <div className="flex items-center gap-4 border-b border-slate-200 px-2 py-7 dark:border-slate-800 md:border-b-0 md:border-r md:px-8">

            <div className="flex h-11 w-11 shrink-0 items-center justify-center border border-brand-gold/30">
              <CalendarDays className="h-5 w-5 text-brand-gold" />
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-slate-400">
                Academic Calendar
              </p>

              <p className="mt-1 text-sm font-semibold">
                Important dates & events
              </p>
            </div>

          </div>

          <div className="flex items-center gap-4 px-2 py-7 md:px-8">

            <div className="flex h-11 w-11 shrink-0 items-center justify-center border border-brand-gold/30">
              <ShieldCheck className="h-5 w-5 text-brand-gold" />
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-slate-400">
                Official Information
              </p>

              <p className="mt-1 text-sm font-semibold">
                Reliable academy notices
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* ============================================================
          NOTICE LIST
      ============================================================ */}

      <section className="bg-[#f5f3ee] py-20 dark:bg-[#080c14] sm:py-24 lg:py-28">

        <div className="container-page">

          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

            <div>

              <p className="text-[9px] font-bold uppercase tracking-[0.35em] text-brand-gold">
                Notice Board
              </p>

              <h2 className="mt-4 font-display text-3xl font-bold tracking-tight sm:text-4xl">
                Latest announcements.
              </h2>

              <p className="mt-4 max-w-xl text-sm leading-7 text-slate-500 sm:text-base">
                Check this page regularly for important updates and
                announcements from the academy.
              </p>

            </div>

            {notices.length > 0 && (
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                <Bell className="h-4 w-4 text-brand-gold" />
                {notices.length}{" "}
                {notices.length === 1 ? "notice" : "notices"}
              </div>
            )}

          </div>

          <div className="mt-10 h-px bg-slate-200 dark:bg-slate-800" />

          {loading ? (
            <div className="py-16">
              <Loader label="Loading notices..." />
            </div>
          ) : error ? (
            <div className="py-12">
              <ErrorState message={error} />
            </div>
          ) : notices.length === 0 ? (
            <div className="py-12">
              <EmptyState message="No notices published yet." />
            </div>
          ) : (
            <div className="mx-auto mt-10 max-w-5xl">

              <div className="space-y-4">

                {notices.map((notice, index) => (

                  <motion.article
                    key={notice._id}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.4,
                      delay: Math.min(index * 0.05, 0.3),
                    }}
                    className="group border border-slate-200 bg-white transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-gold/50 hover:shadow-[0_15px_40px_rgba(16,23,34,0.07)] dark:border-slate-800 dark:bg-slate-900"
                  >

                    <div className="grid md:grid-cols-[90px_1fr_auto]">

                      {/* Number */}

                      <div className="hidden items-center justify-center border-r border-slate-100 bg-[#faf9f6] md:flex dark:border-slate-800 dark:bg-slate-950">

                        <span className="font-display text-3xl font-bold text-slate-200 dark:text-slate-800">
                          {String(index + 1).padStart(2, "0")}
                        </span>

                      </div>

                      {/* Main content */}

                      <div className="p-6 sm:p-7">

                        <div className="flex flex-wrap items-center gap-3">

                          <span className="inline-flex items-center gap-2 border border-brand-gold/30 bg-brand-gold/[0.06] px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.18em] text-[#8b6a24] dark:text-brand-gold">

                            <span className="h-1.5 w-1.5 rounded-full bg-brand-gold" />

                            {notice.category}

                          </span>

                          <span className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-400">

                            <CalendarDays className="h-3.5 w-3.5" />

                            {new Date(notice.date).toLocaleDateString(
                              "en-GB",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              }
                            )}

                          </span>

                        </div>

                        <h3 className="mt-5 font-display text-xl font-bold leading-tight text-[#111827] transition-colors group-hover:text-[#8b6a24] dark:text-white dark:group-hover:text-brand-gold sm:text-2xl">
                          {notice.title}
                        </h3>

                        <p className="mt-3 line-clamp-2 max-w-3xl text-sm leading-7 text-slate-500 dark:text-slate-400">
                          {notice.description}
                        </p>

                      </div>

                      {/* Action */}

                      <div className="flex items-center border-t border-slate-100 px-6 py-5 md:border-l md:border-t-0 md:px-7 dark:border-slate-800">

                        <Link
                          to={`/notices/${notice.slug}`}
                          className="group/link inline-flex items-center gap-2 text-xs font-bold text-[#101722] no-underline transition-colors hover:text-brand-gold dark:text-white dark:hover:text-brand-gold"
                        >
                          Read Notice

                          <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5" />
                        </Link>

                      </div>

                    </div>

                  </motion.article>

                ))}

              </div>

            </div>
          )}

        </div>
      </section>

      {/* ============================================================
          NOTICE PHILOSOPHY
      ============================================================ */}

      <section className="bg-[#101722] py-20 text-white sm:py-24 lg:py-28">

        <div className="container-page">

          <div className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr]">

            <div>

              <div className="flex items-center gap-3">

                <span className="h-px w-10 bg-brand-gold" />

                <span className="text-[9px] font-bold uppercase tracking-[0.35em] text-brand-gold">
                  Stay Connected
                </span>

              </div>

              <h2 className="mt-5 font-display text-3xl font-bold leading-tight sm:text-4xl">
                Never miss an
                <br />
                important update.
              </h2>

              <p className="mt-6 max-w-sm text-sm leading-7 text-slate-400">
                Staying informed helps students plan better, prepare
                properly and stay connected with their academic journey.
              </p>

            </div>

            <div className="border-t border-white/10">

              <div className="grid sm:grid-cols-3">

                <div className="border-b border-white/10 py-8 sm:border-b-0 sm:border-r sm:px-7">

                  <Bell className="h-5 w-5 text-brand-gold" />

                  <h3 className="mt-5 font-display text-xl font-bold">
                    Updates
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-slate-400">
                    Keep track of new academy announcements and important
                    information.
                  </p>

                </div>

                <div className="border-b border-white/10 py-8 sm:border-b-0 sm:border-r sm:px-7">

                  <CalendarDays className="h-5 w-5 text-brand-gold" />

                  <h3 className="mt-5 font-display text-xl font-bold">
                    Plan
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-slate-400">
                    Stay aware of important dates, schedules and academic
                    activities.
                  </p>

                </div>

                <div className="py-8 sm:px-7">

                  <ShieldCheck className="h-5 w-5 text-brand-gold" />

                  <h3 className="mt-5 font-display text-xl font-bold">
                    Stay Ready
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-slate-400">
                    Timely information helps students stay prepared for
                    what comes next.
                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>
      </section>

      {/* ============================================================
          FINAL CTA
      ============================================================ */}

      <section className="bg-[#f5f3ee] py-20 dark:bg-[#080c14] sm:py-24">

        <div className="container-page">

          <div className="relative overflow-hidden border border-slate-200 bg-white px-6 py-14 text-center dark:border-slate-800 dark:bg-slate-900 sm:px-12 lg:px-20">

            <div className="pointer-events-none absolute right-[-100px] top-[-100px] h-64 w-64 rounded-full border border-brand-gold/[0.12]" />

            <div className="pointer-events-none absolute bottom-[-120px] left-[-100px] h-56 w-56 rounded-full border border-slate-200 dark:border-slate-800" />

            <div className="relative">

              <p className="text-[9px] font-bold uppercase tracking-[0.35em] text-brand-gold">
                REMON ACADEMY
              </p>

              <h2 className="mx-auto mt-4 max-w-2xl font-display text-3xl font-bold tracking-tight sm:text-4xl">
                Learning starts with staying informed.
              </h2>

              <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-slate-500">
                Keep checking the notice board for the latest information
                and make sure you never miss an important academic update.
              </p>

              <Link
                to="/courses"
                className="group mt-8 inline-flex items-center gap-3 bg-[#101722] px-7 py-3.5 text-sm font-bold text-white no-underline transition-colors hover:bg-brand-gold hover:text-[#101722] dark:bg-brand-gold dark:text-[#101722] dark:hover:bg-brand-goldLight"
              >
                Explore Courses

                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>

            </div>

          </div>

        </div>
      </section>

    </main>
  );
}


