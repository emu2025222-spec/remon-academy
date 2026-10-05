import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  BookOpen,
  CheckCircle2,
  GraduationCap,
  Layers3,
} from "lucide-react";

import { api, getErrorMessage } from "../services/api";
import { Course } from "../types";
import { Loader } from "../components/Loader";
import { EmptyState } from "../components/EmptyState";
import { ErrorState } from "../components/ErrorState";

export default function Courses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [classLevel, setClassLevel] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");

    api
      .get("/courses/public", {
        params: classLevel ? { classLevel } : {},
      })
      .then((r) => setCourses(r.data.data))
      .catch((e) => setError(getErrorMessage(e)))
      .finally(() => setLoading(false));
  }, [classLevel]);

  const filters = [
    { value: "", label: "All Programs" },
    { value: "SSC", label: "SSC" },
    { value: "HSC", label: "HSC" },
    { value: "Admission", label: "Admission" },
  ];

  return (
    <main className="overflow-hidden bg-[#f5f3ee] text-[#111827] dark:bg-[#080c14] dark:text-white">

      {/* HERO */}
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
                  Academic Programs
                </span>
              </div>

              <p className="mt-6 max-w-xs text-sm leading-7 text-slate-400">
                Structured learning programs designed around knowledge,
                practice and measurable progress.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.08 }}
            >
              <h1 className="font-display text-4xl font-bold leading-[1.02] tracking-[-0.04em] sm:text-5xl lg:text-[5rem]">
                Learn with
                <br />
                <span className="text-brand-gold">purpose.</span>
              </h1>

              <p className="mt-7 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base sm:leading-8">
                Explore our academic programs and choose a learning path
                designed to help you understand better, practise regularly
                and move forward with confidence.
              </p>
            </motion.div>

          </div>

        </div>
      </section>

      {/* INTRO STRIP */}
      <section className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">

        <div className="container-page grid md:grid-cols-3">

          <div className="flex items-center gap-4 border-b border-slate-200 px-2 py-7 dark:border-slate-800 md:border-b-0 md:border-r md:px-8">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center border border-brand-gold/30">
              <GraduationCap className="h-5 w-5 text-brand-gold" />
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-slate-400">
                Academic Focus
              </p>

              <p className="mt-1 text-sm font-semibold">
                Structured programs
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 border-b border-slate-200 px-2 py-7 dark:border-slate-800 md:border-b-0 md:border-r md:px-8">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center border border-brand-gold/30">
              <BookOpen className="h-5 w-5 text-brand-gold" />
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-slate-400">
                Learning Model
              </p>

              <p className="mt-1 text-sm font-semibold">
                Learn · Practice · Improve
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 px-2 py-7 md:px-8">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center border border-brand-gold/30">
              <Layers3 className="h-5 w-5 text-brand-gold" />
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-slate-400">
                Student Support
              </p>

              <p className="mt-1 text-sm font-semibold">
                Continuous guidance
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* COURSE CATALOG */}
      <section className="bg-[#f5f3ee] py-20 dark:bg-[#080c14] sm:py-24 lg:py-28">

        <div className="container-page">

          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">

            <div>
              <p className="text-[9px] font-bold uppercase tracking-[0.35em] text-brand-gold">
                Course Catalog
              </p>

              <h2 className="mt-4 font-display text-3xl font-bold tracking-tight sm:text-4xl">
                Find your academic path.
              </h2>

              <p className="mt-4 max-w-xl text-sm leading-7 text-slate-500 sm:text-base">
                Browse available programs by academic level and choose
                the course that fits your current goals.
              </p>
            </div>

            <div className="flex w-full flex-wrap gap-2 lg:w-auto">

              {filters.map((filter) => {
                const active = classLevel === filter.value;

                return (
                  <button
                    key={filter.value || "all"}
                    type="button"
                    onClick={() => setClassLevel(filter.value)}
                    className={`border px-4 py-2.5 text-xs font-bold transition-all duration-200 ${
                      active
                        ? "border-[#101722] bg-[#101722] text-white dark:border-brand-gold dark:bg-brand-gold dark:text-[#101722]"
                        : "border-slate-300 bg-white text-slate-600 hover:border-brand-gold hover:text-[#101722] dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:text-brand-gold"
                    }`}
                  >
                    {filter.label}
                  </button>
                );
              })}

            </div>

          </div>

          <div className="mt-10 h-px bg-slate-200 dark:bg-slate-800" />

          {loading && (
            <div className="py-16">
              <Loader label="Loading courses..." />
            </div>
          )}

          {!loading && error && (
            <div className="py-12">
              <ErrorState message={error} />
            </div>
          )}

          {!loading && !error && courses.length === 0 && (
            <div className="py-12">
              <EmptyState message="No courses available right now." />
            </div>
          )}

          {!loading && !error && courses.length > 0 && (
            <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">

              {courses.map((course, index) => (
                <motion.article
                  key={course._id}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.4,
                    delay: Math.min(index * 0.05, 0.3),
                  }}
                  className="group flex flex-col border border-slate-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-brand-gold/50 hover:shadow-[0_18px_45px_rgba(16,23,34,0.08)] dark:border-slate-800 dark:bg-slate-900 dark:hover:border-brand-gold/40"
                >

                  <div className="border-b border-slate-100 p-6 dark:border-slate-800 sm:p-7">

                    <div className="flex items-start justify-between gap-4">

                      <span className="inline-flex items-center gap-2 border border-brand-gold/30 bg-brand-gold/[0.06] px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.18em] text-[#8b6a24] dark:text-brand-gold">
                        <span className="h-1.5 w-1.5 rounded-full bg-brand-gold" />
                        {course.classLevel}
                      </span>

                      <span className="font-display text-4xl font-bold text-slate-100 dark:text-slate-800">
                        {String(index + 1).padStart(2, "0")}
                      </span>

                    </div>

                    <h3 className="mt-8 font-display text-xl font-bold leading-tight text-[#111827] transition-colors group-hover:text-[#8b6a24] dark:text-white dark:group-hover:text-brand-gold sm:text-2xl">
                      {course.title}
                    </h3>

                    <p className="mt-4 line-clamp-3 text-sm leading-7 text-slate-500 dark:text-slate-400">
                      {course.description}
                    </p>

                  </div>

                  <div className="mt-auto p-6 sm:p-7">

                    <div className="flex items-center justify-between gap-4">

                      <div>
                        <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">
                          Course Fee
                        </p>

                        <p className="mt-1 font-display text-xl font-bold text-[#101722] dark:text-white">
                          ৳{course.fee}
                        </p>
                      </div>

                      <Link
                        to={`/courses/${course.slug}`}
                        className="group/link inline-flex items-center gap-2 border border-[#101722] px-4 py-2.5 text-xs font-bold text-[#101722] no-underline transition-all duration-200 hover:bg-[#101722] hover:text-white dark:border-brand-gold dark:text-brand-gold dark:hover:bg-brand-gold dark:hover:text-[#101722]"
                      >
                        View Details

                        <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5" />
                      </Link>

                    </div>

                  </div>

                </motion.article>
              ))}

            </div>
          )}

        </div>
      </section>

      {/* WHY CHOOSE THESE PROGRAMS */}
      <section className="bg-[#101722] py-20 text-white sm:py-24 lg:py-28">

        <div className="container-page">

          <div className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr]">

            <div>

              <div className="flex items-center gap-3">
                <span className="h-px w-10 bg-brand-gold" />

                <span className="text-[9px] font-bold uppercase tracking-[0.35em] text-brand-gold">
                  Our Approach
                </span>
              </div>

              <h2 className="mt-5 font-display text-3xl font-bold leading-tight sm:text-4xl">
                A course is more
                <br />
                than a syllabus.
              </h2>

              <p className="mt-6 max-w-sm text-sm leading-7 text-slate-400">
                Every program is designed to give students a clearer
                structure for learning, practising and measuring progress.
              </p>

            </div>

            <div className="border-t border-white/10">

              <div className="grid gap-0 sm:grid-cols-2">

                <div className="border-b border-white/10 px-0 py-7 sm:border-r sm:px-8 sm:py-9">
                  <CheckCircle2 className="h-5 w-5 text-brand-gold" />

                  <h3 className="mt-5 font-display text-xl font-bold">
                    Clear Learning
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-slate-400">
                    Lessons are structured around understanding the
                    important concepts before moving forward.
                  </p>
                </div>

                <div className="border-b border-white/10 px-0 py-7 sm:px-8 sm:py-9">
                  <CheckCircle2 className="h-5 w-5 text-brand-gold" />

                  <h3 className="mt-5 font-display text-xl font-bold">
                    Regular Practice
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-slate-400">
                    Practice and assessment help students turn knowledge
                    into confidence.
                  </p>
                </div>

                <div className="px-0 py-7 sm:border-r sm:px-8 sm:py-9">
                  <CheckCircle2 className="h-5 w-5 text-brand-gold" />

                  <h3 className="mt-5 font-display text-xl font-bold">
                    Performance Focus
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-slate-400">
                    Students can identify weaknesses and work toward
                    measurable improvement.
                  </p>
                </div>

                <div className="px-0 py-7 sm:px-8 sm:py-9">
                  <CheckCircle2 className="h-5 w-5 text-brand-gold" />

                  <h3 className="mt-5 font-display text-xl font-bold">
                    Ongoing Support
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-slate-400">
                    A structured academic environment keeps students
                    connected with their learning journey.
                  </p>
                </div>

              </div>

            </div>

          </div>

        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#f5f3ee] py-20 dark:bg-[#080c14] sm:py-24">

        <div className="container-page">

          <div className="relative overflow-hidden border border-slate-200 bg-white px-6 py-14 text-center dark:border-slate-800 dark:bg-slate-900 sm:px-12 lg:px-20">

            <div className="pointer-events-none absolute right-[-100px] top-[-100px] h-64 w-64 rounded-full border border-brand-gold/[0.12]" />

            <div className="pointer-events-none absolute bottom-[-120px] left-[-100px] h-56 w-56 rounded-full border border-slate-200 dark:border-slate-800" />

            <div className="relative">

              <p className="text-[9px] font-bold uppercase tracking-[0.35em] text-brand-gold">
                Your Next Step
              </p>

              <h2 className="mx-auto mt-4 max-w-2xl font-display text-3xl font-bold tracking-tight sm:text-4xl">
                Choose the right path.
              </h2>

              <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-slate-500">
                Explore our programs, understand the course structure and
                take the next step toward a stronger academic journey.
              </p>

              <Link
                to="/contact"
                className="group mt-8 inline-flex items-center gap-3 bg-[#101722] px-7 py-3.5 text-sm font-bold text-white no-underline transition-colors hover:bg-brand-gold hover:text-[#101722] dark:bg-brand-gold dark:text-[#101722] dark:hover:bg-brand-goldLight"
              >
                Talk to Us

                <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-1 group-hover:translate-x-1" />
              </Link>

            </div>

          </div>

        </div>
      </section>

    </main>
  );
}