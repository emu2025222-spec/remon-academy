import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  BookOpen,
  Facebook,
  GraduationCap,
  Linkedin,
  Users,
  Youtube,
} from "lucide-react";

import { api, getErrorMessage } from "../services/api";
import { Teacher } from "../types";
import { Loader } from "../components/Loader";
import { EmptyState } from "../components/EmptyState";
import { ErrorState } from "../components/ErrorState";

export default function Teachers() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/teachers/public")
      .then((r) => setTeachers(r.data.data))
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
                  Faculty & Mentors
                </span>

              </div>

              <p className="mt-6 max-w-xs text-sm leading-7 text-slate-400">
                Meet the educators who bring knowledge, experience and
                genuine dedication into the classroom.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.08 }}
            >

              <h1 className="font-display text-4xl font-bold leading-[1.02] tracking-[-0.04em] sm:text-5xl lg:text-[5rem]">
                Learn from
                <br />
                <span className="text-brand-gold">
                  experience.
                </span>
              </h1>

              <p className="mt-7 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base sm:leading-8">
                Great learning starts with great guidance. Our teachers are
                here to help students understand concepts, build confidence
                and make meaningful academic progress.
              </p>

            </motion.div>

          </div>

        </div>
      </section>

      {/* ============================================================
          FACULTY INTRO
      ============================================================ */}

      <section className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">

        <div className="container-page grid md:grid-cols-3">

          <div className="flex items-center gap-4 border-b border-slate-200 px-2 py-7 dark:border-slate-800 md:border-b-0 md:border-r md:px-8">

            <div className="flex h-11 w-11 shrink-0 items-center justify-center border border-brand-gold/30">
              <Users className="h-5 w-5 text-brand-gold" />
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-slate-400">
                Faculty
              </p>

              <p className="mt-1 text-sm font-semibold">
                Dedicated educators
              </p>
            </div>

          </div>

          <div className="flex items-center gap-4 border-b border-slate-200 px-2 py-7 dark:border-slate-800 md:border-b-0 md:border-r md:px-8">

            <div className="flex h-11 w-11 shrink-0 items-center justify-center border border-brand-gold/30">
              <GraduationCap className="h-5 w-5 text-brand-gold" />
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-slate-400">
                Expertise
              </p>

              <p className="mt-1 text-sm font-semibold">
                Knowledge & experience
              </p>
            </div>

          </div>

          <div className="flex items-center gap-4 px-2 py-7 md:px-8">

            <div className="flex h-11 w-11 shrink-0 items-center justify-center border border-brand-gold/30">
              <BookOpen className="h-5 w-5 text-brand-gold" />
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-slate-400">
                Teaching
              </p>

              <p className="mt-1 text-sm font-semibold">
                Student-focused learning
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* ============================================================
          TEACHERS
      ============================================================ */}

      <section className="bg-[#f5f3ee] py-20 dark:bg-[#080c14] sm:py-24 lg:py-28">

        <div className="container-page">

          <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

            <div>

              <p className="text-[9px] font-bold uppercase tracking-[0.35em] text-brand-gold">
                Our Faculty
              </p>

              <h2 className="mt-4 font-display text-3xl font-bold tracking-tight sm:text-4xl">
                The people behind the learning.
              </h2>

            </div>

            {teachers.length > 0 && (
              <p className="text-sm text-slate-500">
                {teachers.length}{" "}
                {teachers.length === 1 ? "educator" : "educators"}
              </p>
            )}

          </div>

          <div className="h-px bg-slate-200 dark:bg-slate-800" />

          {loading ? (
            <div className="py-16">
              <Loader label="Loading teachers..." />
            </div>
          ) : error ? (
            <div className="py-12">
              <ErrorState message={error} />
            </div>
          ) : teachers.length === 0 ? (
            <div className="py-12">
              <EmptyState message="No teachers listed yet." />
            </div>
          ) : (
            <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">

              {teachers.map((teacher, index) => (

                <motion.article
                  key={teacher._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.45,
                    delay: Math.min(index * 0.06, 0.3),
                  }}
                  className="group flex flex-col overflow-hidden border border-slate-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-brand-gold/50 hover:shadow-[0_18px_45px_rgba(16,23,34,0.08)] dark:border-slate-800 dark:bg-slate-900"
                >

                  {/* Photo */}

                  <div className="relative overflow-hidden bg-[#e9e5dc] dark:bg-[#111827]">

                    <div className="absolute left-5 top-5 z-10">

                      <span className="border border-white/50 bg-[#101722]/90 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.18em] text-brand-gold backdrop-blur-sm">
                        {String(index + 1).padStart(2, "0")}
                      </span>

                    </div>

                    <div className="flex h-[330px] items-end justify-center overflow-hidden sm:h-[360px]">

                      {teacher.photo ? (
                        <img
                          src={teacher.photo}
                          alt={teacher.name}
                          className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">

                          <div className="flex h-28 w-28 items-center justify-center rounded-full border border-brand-gold/30 bg-brand-gold/10 font-display text-5xl font-bold text-brand-gold">
                            {teacher.name.charAt(0).toUpperCase()}
                          </div>

                        </div>
                      )}

                    </div>

                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#101722]/50 to-transparent" />

                  </div>

                  {/* Information */}

                  <div className="flex flex-1 flex-col p-6 sm:p-7">

                    <div className="flex items-start justify-between gap-4">

                      <div>

                        <h3 className="font-display text-xl font-bold leading-tight text-[#111827] transition-colors group-hover:text-[#8b6a24] dark:text-white dark:group-hover:text-brand-gold sm:text-2xl">
                          {teacher.name}
                        </h3>

                        <p className="mt-2 text-xs font-bold uppercase tracking-[0.16em] text-brand-gold">
                          {teacher.designation}
                        </p>

                      </div>

                      {teacher.experienceYears !== undefined && (
                        <div className="shrink-0 text-right">

                          <p className="font-display text-2xl font-bold text-[#101722] dark:text-white">
                            {teacher.experienceYears}+
                          </p>

                          <p className="text-[8px] font-bold uppercase tracking-[0.15em] text-slate-400">
                            Years
                          </p>

                        </div>
                      )}

                    </div>

                    <div className="mt-5 border-t border-slate-100 pt-5 dark:border-slate-800">

                      <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                        {teacher.qualification}
                      </p>

                      {teacher.bio && (
                        <p className="mt-3 line-clamp-3 text-sm leading-7 text-slate-500 dark:text-slate-400">
                          {teacher.bio}
                        </p>
                      )}

                    </div>

                    {teacher.subjects && teacher.subjects.length > 0 && (
                      <div className="mt-5">

                        <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">
                          Subjects
                        </p>

                        <div className="mt-3 flex flex-wrap gap-2">

                          {teacher.subjects.map((subject) => (
                            <span
                              key={subject}
                              className="border border-slate-200 bg-[#faf9f6] px-2.5 py-1.5 text-[10px] font-semibold text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                            >
                              {subject}
                            </span>
                          ))}

                        </div>

                      </div>
                    )}

                    {/* Social */}

                    <div className="mt-auto flex items-center justify-between gap-4 border-t border-slate-100 pt-5 dark:border-slate-800">

                      <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">
                        Connect
                      </span>

                      <div className="flex items-center gap-2">

                        {teacher.socialLinks?.facebook && (
                          <a
                            href={teacher.socialLinks.facebook}
                            target="_blank"
                            rel="noreferrer"
                            aria-label={`${teacher.name} Facebook`}
                            className="flex h-9 w-9 items-center justify-center border border-slate-200 text-slate-500 transition-all duration-200 hover:border-brand-gold hover:bg-brand-gold hover:text-[#101722] dark:border-slate-700 dark:text-slate-400"
                          >
                            <Facebook className="h-4 w-4" />
                          </a>
                        )}

                        {teacher.socialLinks?.linkedin && (
                          <a
                            href={teacher.socialLinks.linkedin}
                            target="_blank"
                            rel="noreferrer"
                            aria-label={`${teacher.name} LinkedIn`}
                            className="flex h-9 w-9 items-center justify-center border border-slate-200 text-slate-500 transition-all duration-200 hover:border-brand-gold hover:bg-brand-gold hover:text-[#101722] dark:border-slate-700 dark:text-slate-400"
                          >
                            <Linkedin className="h-4 w-4" />
                          </a>
                        )}

                        {teacher.socialLinks?.youtube && (
                          <a
                            href={teacher.socialLinks.youtube}
                            target="_blank"
                            rel="noreferrer"
                            aria-label={`${teacher.name} YouTube`}
                            className="flex h-9 w-9 items-center justify-center border border-slate-200 text-slate-500 transition-all duration-200 hover:border-brand-gold hover:bg-brand-gold hover:text-[#101722] dark:border-slate-700 dark:text-slate-400"
                          >
                            <Youtube className="h-4 w-4" />
                          </a>
                        )}

                      </div>

                    </div>

                  </div>

                </motion.article>

              ))}

            </div>
          )}

        </div>
      </section>

      {/* ============================================================
          PHILOSOPHY
      ============================================================ */}

      <section className="bg-[#101722] py-20 text-white sm:py-24 lg:py-28">

        <div className="container-page">

          <div className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr]">

            <div>

              <div className="flex items-center gap-3">

                <span className="h-px w-10 bg-brand-gold" />

                <span className="text-[9px] font-bold uppercase tracking-[0.35em] text-brand-gold">
                  Teaching Philosophy
                </span>

              </div>

              <h2 className="mt-5 font-display text-3xl font-bold leading-tight sm:text-4xl">
                Good teaching
                <br />
                creates confidence.
              </h2>

              <p className="mt-6 max-w-sm text-sm leading-7 text-slate-400">
                Our teachers are not only here to deliver lessons. They
                help students understand where they are, where they need
                to go and how to get there.
              </p>

            </div>

            <div className="border-t border-white/10">

              <div className="grid sm:grid-cols-3">

                <div className="border-b border-white/10 py-8 sm:border-b-0 sm:border-r sm:px-7">

                  <span className="font-display text-3xl font-bold text-brand-gold/40">
                    01
                  </span>

                  <h3 className="mt-5 font-display text-xl font-bold">
                    Explain
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-slate-400">
                    Make difficult concepts easier to understand through
                    clear and structured teaching.
                  </p>

                </div>

                <div className="border-b border-white/10 py-8 sm:border-b-0 sm:border-r sm:px-7">

                  <span className="font-display text-3xl font-bold text-brand-gold/40">
                    02
                  </span>

                  <h3 className="mt-5 font-display text-xl font-bold">
                    Guide
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-slate-400">
                    Help students identify mistakes, improve weak areas
                    and stay focused on their goals.
                  </p>

                </div>

                <div className="py-8 sm:px-7">

                  <span className="font-display text-3xl font-bold text-brand-gold/40">
                    03
                  </span>

                  <h3 className="mt-5 font-display text-xl font-bold">
                    Inspire
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-slate-400">
                    Build the confidence and discipline students need to
                    keep improving.
                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>
      </section>

      {/* ============================================================
          CTA
      ============================================================ */}

      <section className="bg-[#f5f3ee] py-20 dark:bg-[#080c14] sm:py-24">

        <div className="container-page">

          <div className="relative overflow-hidden border border-slate-200 bg-white px-6 py-14 text-center dark:border-slate-800 dark:bg-slate-900 sm:px-12 lg:px-20">

            <div className="pointer-events-none absolute right-[-100px] top-[-100px] h-64 w-64 rounded-full border border-brand-gold/[0.12]" />

            <div className="relative">

              <p className="text-[9px] font-bold uppercase tracking-[0.35em] text-brand-gold">
                Learn Better
              </p>

              <h2 className="mx-auto mt-4 max-w-2xl font-display text-3xl font-bold tracking-tight sm:text-4xl">
                Find the right learning environment.
              </h2>

              <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-slate-500">
                Explore our courses and discover a structured academic
                path supported by dedicated teachers.
              </p>

              <Link
                to="/courses"
                className="group mt-8 inline-flex items-center gap-3 bg-[#101722] px-7 py-3.5 text-sm font-bold text-white no-underline transition-colors hover:bg-brand-gold hover:text-[#101722] dark:bg-brand-gold dark:text-[#101722] dark:hover:bg-brand-goldLight"
              >
                Explore Courses

                <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-1 group-hover:translate-x-1" />
              </Link>

            </div>

          </div>

        </div>
      </section>

    </main>
  );
}