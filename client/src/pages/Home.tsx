import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Award,
  BookOpen,
  CheckCircle2,
  Code2,
  GraduationCap,
  Layers3,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";

import { api } from "../services/api";
import { Course, Teacher, Notice } from "../types";
import { StatCard } from "../components/StatCard";
import { Card } from "../components/Card";
import { brand } from "../config/brand";

export default function Home() {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalTeachers: 0,
    totalCourses: 0,
    successfulStudents: 0,
  });

  const [courses, setCourses] = useState<Course[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);

  useEffect(() => {
    api
      .get("/dashboard/public-stats")
      .then((r) => setStats(r.data.data))
      .catch(() => {});

    api
      .get("/courses/public")
      .then((r) => setCourses((r.data.data || []).slice(0, 3)))
      .catch(() => {});

    api
      .get("/teachers/public")
      .then((r) => setTeachers((r.data.data || []).slice(0, 3)))
      .catch(() => {});

    api
      .get("/notices/public")
      .then((r) => setNotices((r.data.data || []).slice(0, 3)))
      .catch(() => {});
  }, []);

  const features = [
    {
      icon: GraduationCap,
      number: "01",
      title: "Expert Mentorship",
      desc: "Learn from dedicated educators with a strong focus on concepts, clarity and academic growth.",
    },
    {
      icon: Target,
      number: "02",
      title: "Focused Assessment",
      desc: "Regular exams and performance tracking help students identify weaknesses and improve consistently.",
    },
    {
      icon: Layers3,
      number: "03",
      title: "Complete Learning",
      desc: "Courses, attendance, results, fees and notices stay organized through a modern student portal.",
    },
  ];

  return (
    <div className="overflow-hidden bg-white dark:bg-slate-950">

      {/* =========================================================
          HERO
      ========================================================= */}
      <section className="relative isolate min-h-[720px] overflow-hidden bg-brand-navy text-white">

        {/* Background */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-[-180px] top-[-180px] h-[520px] w-[520px] rounded-full bg-brand-gold/10 blur-[100px]" />
          <div className="absolute bottom-[-220px] right-[-150px] h-[620px] w-[620px] rounded-full bg-blue-500/10 blur-[120px]" />

          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(255,255,255,0.06),transparent_30%)]" />

          <div className="absolute inset-0 opacity-[0.035] [background-image:linear-gradient(rgba(255,255,255,.8)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.8)_1px,transparent_1px)] [background-size:55px_55px]" />
        </div>

        {/* Floating particles */}
        <motion.div
          className="absolute left-[12%] top-[24%] h-1.5 w-1.5 rounded-full bg-brand-gold"
          animate={{
            y: [0, -25, 0],
            opacity: [0.2, 1, 0.2],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
          }}
        />

        <motion.div
          className="absolute right-[18%] top-[18%] h-2 w-2 rounded-full bg-white/70"
          animate={{
            y: [0, 30, 0],
            opacity: [0.2, 0.9, 0.2],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
          }}
        />

        <motion.div
          className="absolute right-[40%] bottom-[18%] h-1 w-1 rounded-full bg-brand-gold"
          animate={{
            y: [0, -20, 0],
            x: [0, 10, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
          }}
        />

        <div className="container-page relative grid min-h-[720px] items-center gap-14 py-16 lg:grid-cols-[1fr_0.9fr] lg:gap-8 lg:py-20">

          {/* HERO CONTENT */}
          <motion.div
            initial={{
              opacity: 0,
              x: -40,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              duration: 0.8,
            }}
            className="relative z-10 order-2 lg:order-1"
          >
            {/* Badge */}
            <motion.div
              initial={{
                opacity: 0,
                y: 12,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.15,
              }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-gold/25 bg-white/[0.04] px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-brand-goldLight shadow-lg backdrop-blur-md"
            >
              <Sparkles className="h-4 w-4" />
              Est. 2026 · Bangladesh
            </motion.div>

            {/* Heading */}
            <h1 className="max-w-3xl font-display text-4xl font-bold leading-[1.04] tracking-tight sm:text-5xl lg:text-[4.5rem]">
              {brand.tagline}
            </h1>

            <div className="mt-6 h-px w-20 bg-brand-gold/70" />

            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
              {brand.name} provides expert, result-oriented coaching for
              SSC, HSC and university admission candidates — combining
              experienced teachers, structured courses, regular assessment
              and modern student support.
            </p>

            {/* Identity */}
            <div className="mt-7 flex flex-wrap items-center gap-3 text-sm">
              <span className="font-semibold text-brand-gold">
                Emon Islam
              </span>

              <span className="text-white/20">•</span>

              <span className="text-slate-300">
                B.Sc. in CSE
              </span>

              <span className="text-white/20">•</span>

              <span className="text-slate-300">
                Developer
              </span>

              <span className="text-white/20">•</span>

              <span className="text-slate-300">
                Educator
              </span>
            </div>

            {/* Buttons */}
            <div className="mt-9 flex flex-wrap gap-4">
              <Link
                to="/courses"
                className="group inline-flex items-center gap-2 rounded-xl bg-brand-gold px-7 py-3.5 font-semibold text-brand-navy shadow-xl shadow-brand-gold/10 transition-all duration-300 hover:-translate-y-1 hover:bg-brand-goldLight hover:shadow-brand-gold/20"
              >
                Explore Courses

                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>

              <Link
                to="/login"
                className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/[0.05] px-7 py-3.5 font-semibold text-white backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:text-brand-navy"
              >
                Student Login
              </Link>
            </div>

            {/* Trust points */}
            <div className="mt-9 flex flex-wrap gap-x-7 gap-y-3 text-sm text-slate-400">
              {[
                "Experienced Teachers",
                "Regular Assessment",
                "Digital Student Portal",
              ].map((item) => (
                <span
                  key={item}
                  className="flex items-center gap-2"
                >
                  <CheckCircle2 className="h-4 w-4 text-brand-gold" />
                  {item}
                </span>
              ))}
            </div>
          </motion.div>

          {/* HERO PHOTO */}
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.9,
              x: 35,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              x: 0,
            }}
            transition={{
              duration: 0.9,
              delay: 0.15,
            }}
            className="relative z-10 order-1 mx-auto w-full max-w-[500px] lg:order-2"
          >
            {/* Glow */}
            <div className="absolute -inset-8 rounded-[3rem] bg-brand-gold/10 blur-[70px]" />

            {/* Main frame */}
            <div className="relative rounded-[2.5rem] border border-white/10 bg-white/[0.04] p-2 shadow-2xl backdrop-blur-md">

              <div className="relative overflow-hidden rounded-[2rem] bg-slate-950">

                <img
                  src="/photo/emon.png"
                  alt="Emon Islam - B.Sc. in CSE, Developer and Educator"
                  className="h-[480px] w-full object-cover object-top transition-transform duration-700 hover:scale-[1.025] sm:h-[560px]"
                />

                {/* Image overlays */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-brand-navy via-brand-navy/10 to-transparent" />

                <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-brand-navy/20 via-transparent to-brand-gold/5" />

                {/* Bottom profile */}
                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
                  <div className="rounded-2xl border border-white/10 bg-brand-navy/80 p-5 shadow-2xl backdrop-blur-xl">

                    <div className="flex items-end justify-between gap-4">
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-brand-gold">
                          Founder · Educator
                        </p>

                        <h2 className="mt-1 font-display text-2xl font-bold sm:text-3xl">
                          Emon Islam
                        </h2>
                      </div>

                      <div className="hidden rounded-xl border border-brand-gold/20 bg-brand-gold/10 p-3 sm:block">
                        <Code2 className="h-5 w-5 text-brand-gold" />
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {[
                        "B.Sc. in CSE",
                        "Developer",
                        "Educator",
                      ].map((item) => (
                        <span
                          key={item}
                          className="rounded-full border border-brand-gold/20 bg-brand-gold/10 px-3 py-1 text-[11px] font-semibold text-brand-goldLight"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Academic */}
            <motion.div
              className="absolute -left-5 top-12 hidden rounded-2xl border border-white/10 bg-brand-navy/85 px-4 py-3 shadow-2xl backdrop-blur-xl sm:block"
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
              }}
            >
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-brand-gold/10 p-2.5">
                  <GraduationCap className="h-5 w-5 text-brand-gold" />
                </div>

                <div>
                  <p className="text-[10px] uppercase tracking-wider text-slate-500">
                    Academic
                  </p>

                  <p className="text-sm font-semibold">
                    Mentorship
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Floating Developer */}
            <motion.div
              className="absolute -right-5 bottom-28 hidden rounded-2xl border border-white/10 bg-brand-navy/85 px-4 py-3 shadow-2xl backdrop-blur-xl sm:block"
              animate={{
                y: [0, 10, 0],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
              }}
            >
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-brand-gold/10 p-2.5">
                  <Zap className="h-5 w-5 text-brand-gold" />
                </div>

                <div>
                  <p className="text-[10px] uppercase tracking-wider text-slate-500">
                    Technology
                  </p>

                  <p className="text-sm font-semibold">
                    Developer
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* =========================================================
          STATS
      ========================================================= */}
      <section className="relative z-20 -mt-8">
        <div className="container-page grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          <StatCard
            icon={Users}
            label="Total Students"
            value={stats.totalStudents}
            suffix="+"
          />

          <StatCard
            icon={GraduationCap}
            label="Experienced Teachers"
            value={stats.totalTeachers}
            suffix="+"
          />

          <StatCard
            icon={BookOpen}
            label="Courses"
            value={stats.totalCourses}
            suffix="+"
          />

          <StatCard
            icon={TrendingUp}
            label="Successful Students"
            value={stats.successfulStudents}
            suffix="+"
          />
        </div>
      </section>

      {/* =========================================================
          WHY REMON
      ========================================================= */}
      <section className="container-page py-24 lg:py-28">

        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            duration: 0.6,
          }}
          className="mx-auto mb-14 max-w-2xl text-center"
        >
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-brand-gold">
            Why REMON
          </span>

          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-brand-navy dark:text-white sm:text-4xl">
            Built Around Better Learning
          </h2>

          <p className="mt-4 leading-7 text-slate-500">
            A focused academic environment where strong teaching,
            consistent assessment and modern technology work together.
          </p>
        </motion.div>

        <div className="grid gap-5 md:grid-cols-3">
          {features.map((item, index) => {
            const Icon = item.icon;

            return (
              <motion.div
                key={item.title}
                initial={{
                  opacity: 0,
                  y: 25,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: true,
                }}
                transition={{
                  delay: index * 0.1,
                  duration: 0.5,
                }}
              >
                <Card className="group relative h-full overflow-hidden border border-slate-100 transition-all duration-500 hover:-translate-y-2 hover:border-brand-gold/20 hover:shadow-2xl dark:border-slate-800">

                  <span className="absolute right-5 top-5 text-xs font-bold text-slate-200 dark:text-slate-800">
                    {item.number}
                  </span>

                  <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-gold/10 transition-all duration-500 group-hover:scale-110 group-hover:bg-brand-gold/15">
                    <Icon className="h-7 w-7 text-brand-gold" />
                  </div>

                  <h3 className="font-display text-xl font-semibold text-brand-navy dark:text-white">
                    {item.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-slate-500">
                    {item.desc}
                  </p>

                  <div className="mt-6 h-px w-10 bg-brand-gold/40 transition-all duration-500 group-hover:w-16" />
                </Card>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* =========================================================
          COURSES
      ========================================================= */}
      {courses.length > 0 && (
        <section className="relative overflow-hidden bg-slate-50 py-24 dark:bg-slate-900/50 lg:py-28">

          <div className="pointer-events-none absolute right-[-150px] top-[-100px] h-96 w-96 rounded-full bg-brand-gold/5 blur-[100px]" />

          <div className="container-page relative">

            <div className="mb-12 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

              <div>
                <span className="text-xs font-bold uppercase tracking-[0.25em] text-brand-gold">
                  Learn With Us
                </span>

                <h2 className="mt-2 font-display text-3xl font-bold text-brand-navy dark:text-white sm:text-4xl">
                  Featured Courses
                </h2>

                <p className="mt-3 max-w-xl text-sm leading-6 text-slate-500">
                  Carefully structured courses designed to make
                  learning more focused and effective.
                </p>
              </div>

              <Link
                to="/courses"
                className="group inline-flex items-center gap-2 text-sm font-semibold text-brand-navy dark:text-brand-goldLight"
              >
                View all courses

                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {courses.map((course, index) => (
                <motion.div
                  key={course._id}
                  initial={{
                    opacity: 0,
                    y: 25,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{
                    once: true,
                  }}
                  transition={{
                    delay: index * 0.1,
                  }}
                >
                  <Card className="group flex h-full flex-col overflow-hidden p-0 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl">

                    {/* Course header */}
                    <div className="relative flex h-40 items-center justify-center overflow-hidden bg-brand-navy">

                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08),transparent_55%)]" />

                      <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full border border-brand-gold/10" />

                      <div className="absolute -bottom-16 -left-10 h-36 w-36 rounded-full border border-brand-gold/10" />

                      <BookOpen className="relative h-14 w-14 text-brand-gold transition-all duration-500 group-hover:scale-110 group-hover:rotate-3" />

                      <span className="absolute right-4 top-4 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-white backdrop-blur">
                        Featured
                      </span>
                    </div>

                    <div className="flex flex-1 flex-col p-6">

                      <div className="mb-2 flex items-center gap-2 text-xs text-slate-400">
                        <span>{course.classLevel}</span>

                        <span>•</span>

                        <span>{course.subject}</span>
                      </div>

                      <h3 className="font-display text-xl font-semibold text-brand-navy dark:text-white">
                        {course.title}
                      </h3>

                      <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-500">
                        {course.description}
                      </p>

                      <div className="mt-auto flex items-center justify-between gap-4 border-t border-slate-100 pt-6 dark:border-slate-800">

                        <div>
                          <p className="text-[10px] uppercase tracking-wider text-slate-400">
                            Course Fee
                          </p>

                          <span className="text-lg font-bold text-brand-gold">
                            ৳{course.fee}
                          </span>
                        </div>

                        <Link
                          to={`/courses/${course.slug}`}
                          className="group/link inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3.5 py-2 text-sm font-semibold text-brand-navy transition-all hover:border-brand-gold hover:bg-brand-gold hover:text-brand-navy dark:border-slate-700 dark:text-brand-goldLight"
                        >
                          Details

                          <ArrowRight className="h-4 w-4 transition-transform group-hover/link:translate-x-1" />
                        </Link>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* =========================================================
          DEVELOPER / FOUNDER
      ========================================================= */}
      <section className="container-page py-24 lg:py-28">

        <div className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-7 shadow-xl dark:border-slate-800 dark:bg-slate-900 sm:p-10">

          <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-brand-gold/10 blur-[80px]" />

          <div className="relative grid items-center gap-10 lg:grid-cols-[0.8fr_1.2fr]">

            {/* Mini profile */}
            <div className="flex items-center gap-5">

              <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl border border-brand-gold/20 bg-brand-navy shadow-lg">
                <img
                  src="/photo/emon.png"
                  alt="Emon Islam"
                  className="h-full w-full object-cover object-top"
                />
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-gold">
                  Developer
                </p>

                <h3 className="mt-1 font-display text-2xl font-bold text-brand-navy dark:text-white">
                  Emon Islam
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  B.Sc. in CSE · Educator
                </p>
              </div>
            </div>

            {/* Content */}
            <div>
              <div className="mb-4 flex items-center gap-2 text-brand-gold">
                <Code2 className="h-5 w-5" />

                <span className="text-xs font-bold uppercase tracking-[0.2em]">
                  Technology & Education
                </span>
              </div>

              <h2 className="font-display text-2xl font-bold text-brand-navy dark:text-white sm:text-3xl">
                Technology designed around education.
              </h2>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-500">
                REMON ACADEMY combines academic guidance with a modern
                digital platform so students can manage their learning
                journey from one organized environment.
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                {[
                  "B.Sc. in CSE",
                  "Web Development",
                  "Education Technology",
                  "Student Portal",
                ].map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 dark:border-slate-700 dark:text-slate-300"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================
          TEACHERS
      ========================================================= */}
      {teachers.length > 0 && (
        <section className="container-page py-24 lg:py-28">

          <div className="mx-auto mb-12 max-w-2xl text-center">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-brand-gold">
              Our Team
            </span>

            <h2 className="mt-2 font-display text-3xl font-bold text-brand-navy dark:text-white sm:text-4xl">
              Meet Our Teachers
            </h2>

            <p className="mt-4 leading-7 text-slate-500">
              Dedicated educators committed to making every lesson
              clear, meaningful and effective.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {teachers.map((teacher, index) => (
              <motion.div
                key={teacher._id}
                initial={{
                  opacity: 0,
                  y: 25,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: true,
                }}
                transition={{
                  delay: index * 0.1,
                }}
              >
                <Card className="group relative overflow-hidden text-center transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl">

                  <div className="absolute left-0 right-0 top-0 h-1 bg-brand-gold/20 transition-all duration-500 group-hover:bg-brand-gold" />

                  <div className="relative mx-auto mb-5 mt-3 flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-4 border-brand-gold/10 bg-brand-navy text-3xl font-bold text-brand-gold shadow-lg transition-transform duration-500 group-hover:scale-105">

                    {teacher.photo ? (
                      <img
                        src={teacher.photo}
                        alt={teacher.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      teacher.name.charAt(0)
                    )}
                  </div>

                  <h3 className="font-display text-xl font-semibold text-brand-navy dark:text-white">
                    {teacher.name}
                  </h3>

                  <p className="mt-1 text-sm font-medium text-brand-gold">
                    {teacher.designation || "Instructor"}
                  </p>

                  {teacher.specialization && (
                    <p className="mt-3 text-sm text-slate-500">
                      {teacher.specialization}
                    </p>
                  )}

                  <div className="mx-auto mt-5 h-px w-10 bg-slate-200 dark:bg-slate-700" />
                </Card>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* =========================================================
          NOTICES
      ========================================================= */}
      {notices.length > 0 && (
        <section className="bg-slate-50 py-24 dark:bg-slate-900/50 lg:py-28">

          <div className="container-page">

            <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

              <div>
                <span className="text-xs font-bold uppercase tracking-[0.25em] text-brand-gold">
                  Stay Updated
                </span>

                <h2 className="mt-2 font-display text-3xl font-bold text-brand-navy dark:text-white sm:text-4xl">
                  Latest Notices
                </h2>

                <p className="mt-3 text-sm text-slate-500">
                  Important updates and announcements from REMON ACADEMY.
                </p>
              </div>

              <Link
                to="/notices"
                className="group inline-flex items-center gap-2 text-sm font-semibold text-brand-navy dark:text-brand-goldLight"
              >
                View all notices

                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              {notices.map((notice, index) => (
                <motion.div
                  key={notice._id}
                  initial={{
                    opacity: 0,
                    y: 20,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{
                    once: true,
                  }}
                  transition={{
                    delay: index * 0.1,
                  }}
                >
                  <Card className="group h-full transition-all duration-500 hover:-translate-y-1 hover:shadow-xl">

                    <div className="mb-5 flex items-center justify-between">

                      <span className="rounded-full bg-brand-gold/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-brand-gold">
                        {notice.category}
                      </span>

                      <ShieldCheck className="h-4 w-4 text-slate-300" />
                    </div>

                    <h3 className="font-display text-lg font-semibold text-brand-navy dark:text-white">
                      {notice.title}
                    </h3>

                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-500">
                      {notice.description}
                    </p>

                    <Link
                      to={`/notices/${notice.slug}`}
                      className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-navy dark:text-brand-goldLight"
                    >
                      Read more

                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* =========================================================
          FINAL CTA
      ========================================================= */}
      <section className="container-page py-24 lg:py-28">

        <motion.div
          initial={{
            opacity: 0,
            y: 25,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            duration: 0.6,
          }}
          className="relative overflow-hidden rounded-[2rem] bg-brand-navy px-6 py-16 text-center shadow-2xl sm:px-12"
        >

          {/* Background */}
          <div className="pointer-events-none absolute inset-0 opacity-[0.04] [background-image:linear-gradient(rgba(255,255,255,.8)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.8)_1px,transparent_1px)] [background-size:45px_45px]" />

          <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-brand-gold/10 blur-[90px]" />

          <div className="pointer-events-none absolute -bottom-32 -right-20 h-80 w-80 rounded-full bg-blue-500/10 blur-[100px]" />

          <div className="relative">

            <motion.div
              animate={{
                y: [0, -8, 0],
                rotate: [0, 3, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
              }}
            >
              <Award className="mx-auto mb-6 h-10 w-10 text-brand-gold" />
            </motion.div>

            <p className="text-xs font-bold uppercase tracking-[0.3em] text-brand-gold">
              Your Next Chapter Starts Here
            </p>

            <h2 className="mt-3 font-display text-3xl font-bold text-white sm:text-4xl">
              Ready to Start Your Journey?
            </h2>

            <p className="mx-auto mt-4 max-w-xl leading-7 text-slate-300">
              Join {brand.name} and take the next step toward your
              academic goals with structured learning and dedicated guidance.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-4">

              <Link
                to="/register"
                className="group inline-flex items-center gap-2 rounded-xl bg-brand-gold px-7 py-3.5 font-semibold text-brand-navy shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-brand-goldLight"
              >
                Register Now

                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>

              <Link
                to="/courses"
                className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/[0.05] px-7 py-3.5 font-semibold text-white backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:text-brand-navy"
              >
                Explore Courses
              </Link>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}