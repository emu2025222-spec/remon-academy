import { motion } from "framer-motion";
import {
  ArrowRight,
  Award,
  BarChart3,
  CheckCircle2,
  GraduationCap,
  LogIn,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Results() {
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
                  Academic Performance
                </span>

              </div>

              <p className="mt-6 max-w-xs text-sm leading-7 text-slate-400">
                A secure space where students can review their academic
                performance, marks and progress.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.08 }}
            >

              <h1 className="font-display text-4xl font-bold leading-[1.02] tracking-[-0.04em] sm:text-5xl lg:text-[5rem]">
                Track your
                <br />
                <span className="text-brand-gold">
                  progress.
                </span>
              </h1>

              <p className="mt-7 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base sm:leading-8">
                Your results are personal. Log in to your student dashboard
                to access subject-wise marks, GPA and detailed performance
                information.
              </p>

            </motion.div>

          </div>

        </div>
      </section>

      {/* ============================================================
          SECURITY STRIP
      ============================================================ */}

      <section className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">

        <div className="container-page grid md:grid-cols-3">

          <div className="flex items-center gap-4 border-b border-slate-200 px-2 py-7 dark:border-slate-800 md:border-b-0 md:border-r md:px-8">

            <div className="flex h-11 w-11 shrink-0 items-center justify-center border border-brand-gold/30">
              <LockKeyhole className="h-5 w-5 text-brand-gold" />
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-slate-400">
                Privacy
              </p>

              <p className="mt-1 text-sm font-semibold">
                Private student records
              </p>
            </div>

          </div>

          <div className="flex items-center gap-4 border-b border-slate-200 px-2 py-7 dark:border-slate-800 md:border-b-0 md:border-r md:px-8">

            <div className="flex h-11 w-11 shrink-0 items-center justify-center border border-brand-gold/30">
              <BarChart3 className="h-5 w-5 text-brand-gold" />
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-slate-400">
                Performance
              </p>

              <p className="mt-1 text-sm font-semibold">
                Detailed academic progress
              </p>
            </div>

          </div>

          <div className="flex items-center gap-4 px-2 py-7 md:px-8">

            <div className="flex h-11 w-11 shrink-0 items-center justify-center border border-brand-gold/30">
              <ShieldCheck className="h-5 w-5 text-brand-gold" />
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-slate-400">
                Secure Access
              </p>

              <p className="mt-1 text-sm font-semibold">
                Student dashboard only
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* ============================================================
          RESULT ACCESS
      ============================================================ */}

      <section className="bg-[#f5f3ee] py-20 dark:bg-[#080c14] sm:py-24 lg:py-28">

        <div className="container-page">

          <div className="mx-auto max-w-5xl">

            <div className="grid overflow-hidden border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 lg:grid-cols-[0.85fr_1.15fr]">

              {/* LEFT */}

              <div className="relative overflow-hidden bg-[#101722] px-7 py-12 text-white sm:px-10 sm:py-14 lg:px-12 lg:py-16">

                <div className="pointer-events-none absolute right-[-100px] top-[-100px] h-64 w-64 rounded-full border border-brand-gold/[0.10]" />

                <div className="relative">

                  <div className="flex h-14 w-14 items-center justify-center border border-brand-gold/40 bg-brand-gold/[0.08]">

                    <GraduationCap className="h-6 w-6 text-brand-gold" />

                  </div>

                  <p className="mt-8 text-[9px] font-bold uppercase tracking-[0.35em] text-brand-gold">
                    Student Portal
                  </p>

                  <h2 className="mt-4 font-display text-3xl font-bold leading-tight sm:text-4xl">
                    Your results,
                    <br />
                    your journey.
                  </h2>

                  <p className="mt-5 max-w-sm text-sm leading-7 text-slate-400">
                    Access your academic information from one secure
                    student dashboard.
                  </p>

                </div>

              </div>

              {/* RIGHT */}

              <div className="px-7 py-12 sm:px-10 sm:py-14 lg:px-12 lg:py-16">

                <p className="text-[9px] font-bold uppercase tracking-[0.35em] text-brand-gold">
                  Secure Result Access
                </p>

                <h2 className="mt-4 font-display text-2xl font-bold sm:text-3xl">
                  View your academic performance.
                </h2>

                <p className="mt-4 text-sm leading-7 text-slate-500">
                  Individual results are available only after signing in
                  to your student account. This keeps your academic
                  information private and accessible only to you.
                </p>

                <div className="mt-8 space-y-4">

                  <div className="flex items-start gap-4">

                    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-gold/10">
                      <CheckCircle2 className="h-4 w-4 text-brand-gold" />
                    </div>

                    <div>
                      <p className="text-sm font-bold">
                        Subject-wise marks
                      </p>

                      <p className="mt-1 text-xs leading-6 text-slate-500">
                        Review your performance across individual subjects.
                      </p>
                    </div>

                  </div>

                  <div className="flex items-start gap-4">

                    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-gold/10">
                      <CheckCircle2 className="h-4 w-4 text-brand-gold" />
                    </div>

                    <div>
                      <p className="text-sm font-bold">
                        GPA & academic results
                      </p>

                      <p className="mt-1 text-xs leading-6 text-slate-500">
                        Keep track of your overall academic outcome.
                      </p>
                    </div>

                  </div>

                  <div className="flex items-start gap-4">

                    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-gold/10">
                      <CheckCircle2 className="h-4 w-4 text-brand-gold" />
                    </div>

                    <div>
                      <p className="text-sm font-bold">
                        Performance tracking
                      </p>

                      <p className="mt-1 text-xs leading-6 text-slate-500">
                        Understand your progress and identify areas to improve.
                      </p>
                    </div>

                  </div>

                </div>

                <Link
                  to="/login"
                  className="group mt-9 inline-flex items-center gap-3 bg-[#101722] px-7 py-3.5 text-sm font-bold text-white no-underline transition-colors hover:bg-brand-gold hover:text-[#101722] dark:bg-brand-gold dark:text-[#101722] dark:hover:bg-brand-goldLight"
                >
                  <LogIn className="h-4 w-4" />

                  Student Login

                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                </Link>

              </div>

            </div>

          </div>

        </div>
      </section>

      {/* ============================================================
          PERFORMANCE PHILOSOPHY
      ============================================================ */}

      <section className="bg-[#101722] py-20 text-white sm:py-24 lg:py-28">

        <div className="container-page">

          <div className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr]">

            <div>

              <div className="flex items-center gap-3">

                <span className="h-px w-10 bg-brand-gold" />

                <span className="text-[9px] font-bold uppercase tracking-[0.35em] text-brand-gold">
                  Beyond Results
                </span>

              </div>

              <h2 className="mt-5 font-display text-3xl font-bold leading-tight sm:text-4xl">
                Results are
                <br />
                a starting point.
              </h2>

              <p className="mt-6 max-w-sm text-sm leading-7 text-slate-400">
                Academic performance is not only about numbers. It is
                about understanding your strengths, recognising weaknesses
                and continuing to improve.
              </p>

            </div>

            <div className="border-t border-white/10">

              <div className="grid sm:grid-cols-3">

                <div className="border-b border-white/10 py-8 sm:border-b-0 sm:border-r sm:px-7">

                  <Award className="h-5 w-5 text-brand-gold" />

                  <h3 className="mt-5 font-display text-xl font-bold">
                    Measure
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-slate-400">
                    Understand where you currently stand through clear
                    academic results.
                  </p>

                </div>

                <div className="border-b border-white/10 py-8 sm:border-b-0 sm:border-r sm:px-7">

                  <BarChart3 className="h-5 w-5 text-brand-gold" />

                  <h3 className="mt-5 font-display text-xl font-bold">
                    Improve
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-slate-400">
                    Use performance information to identify areas that
                    need more attention.
                  </p>

                </div>

                <div className="py-8 sm:px-7">

                  <GraduationCap className="h-5 w-5 text-brand-gold" />

                  <h3 className="mt-5 font-display text-xl font-bold">
                    Grow
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-slate-400">
                    Turn consistent improvement into stronger academic
                    confidence.
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
                Student Access
              </p>

              <h2 className="mx-auto mt-4 max-w-2xl font-display text-3xl font-bold tracking-tight sm:text-4xl">
                Ready to check your results?
              </h2>

              <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-slate-500">
                Sign in to your student dashboard to view your latest
                academic performance and results.
              </p>

              <Link
                to="/login"
                className="group mt-8 inline-flex items-center gap-3 bg-[#101722] px-7 py-3.5 text-sm font-bold text-white no-underline transition-colors hover:bg-brand-gold hover:text-[#101722] dark:bg-brand-gold dark:text-[#101722] dark:hover:bg-brand-goldLight"
              >
                Login to Dashboard

                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>

            </div>

          </div>

        </div>
      </section>

    </main>
  );
}


