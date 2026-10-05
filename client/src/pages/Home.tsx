import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  Award,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Code2,
  GraduationCap,
  Layers3,
  ShieldCheck,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";

import { api } from "../services/api";
import { Course, Teacher, Notice } from "../types";
import { StatCard } from "../components/StatCard";
import { Card } from "../components/Card";
import { brand } from "../config/brand";

export default function Home() {
  const reduceMotion = useReducedMotion();

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
      title: "Meaningful Mentorship",
      desc: "Guidance that focuses on understanding, confidence and long-term academic growth.",
    },
    {
      icon: Target,
      number: "02",
      title: "Purposeful Assessment",
      desc: "Regular evaluation helps students understand where they stand and where they need to improve.",
    },
    {
      icon: Layers3,
      number: "03",
      title: "One Learning Ecosystem",
      desc: "Courses, attendance, results, fees and academic updates stay organized in one platform.",
    },
  ];

  const reveal = reduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 24 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: 0.15 },
        transition: { duration: 0.55 },
      };

  return (
    <main className="overflow-hidden bg-[#f7f7f4] text-[#171918] dark:bg-[#101311] dark:text-white">

      {/* =========================================================
          HERO
      ========================================================= */}
      <section className="relative overflow-hidden bg-[#111512] text-white">

        {/* Subtle background */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[linear-gradient(135deg,#111512_0%,#18201b_52%,#0e1210_100%)]" />

          <div className="absolute right-[-15%] top-[-20%] h-[420px] w-[420px] rounded-full border border-emerald-400/10" />

          <div className="absolute right-[-8%] top-[-10%] h-[300px] w-[300px] rounded-full border border-white/5" />

          <div className="absolute bottom-[-25%] left-[-10%] h-[380px] w-[380px] rounded-full bg-emerald-500/[0.06] blur-3xl" />
        </div>

        <div className="container-page relative grid min-h-[760px] items-center gap-14 py-16 lg:grid-cols-[1.02fr_0.98fr] lg:gap-10 lg:py-20">

          {/* LEFT CONTENT */}
          <motion.div
            initial={
              reduceMotion
                ? undefined
                : { opacity: 0, x: -28 }
            }
            animate={
              reduceMotion
                ? undefined
                : { opacity: 1, x: 0 }
            }
            transition={
              reduceMotion
                ? undefined
                : { duration: 0.65 }
            }
            className="order-2 lg:order-1"
          >

            <div className="mb-7 inline-flex items-center gap-2 border border-white/10 bg-white/[0.04] px-3.5 py-2 text-[10px] font-bold uppercase tracking-[0.22em] text-emerald-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              REMON ACADEMY · EST. 2026
            </div>

            <h1 className="max-w-4xl font-display text-[2.7rem] font-semibold leading-[1.02] tracking-[-0.04em] sm:text-5xl lg:text-[5.2rem]">
              Learn with
              <span className="block text-emerald-300">
                purpose.
              </span>
            </h1>

            <p className="mt-7 max-w-xl text-base leading-8 text-white/65 sm:text-lg">
              {brand.name} is built to give students more than lessons —
              a focused environment for learning, discipline, confidence
              and meaningful academic progress.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/courses"
                className="group inline-flex items-center gap-2 bg-emerald-400 px-6 py-3.5 text-sm font-bold text-[#101512] transition-colors hover:bg-emerald-300"
              >
                Explore Courses
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>

              <Link
                to="/login"
                className="inline-flex items-center gap-2 border border-white/15 bg-white/[0.04] px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white hover:text-[#111512]"
              >
                Student Portal
              </Link>
            </div>

            <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3 text-xs text-white/50">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                Experienced Teachers
              </span>

              <span className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                Structured Learning
              </span>

              <span className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                Digital Support
              </span>
            </div>

            <div className="mt-12 border-t border-white/10 pt-6">
              <div className="flex flex-wrap items-center gap-3 text-sm">
                <span className="font-semibold text-white">
                  Emon Islam
                </span>

                <span className="text-white/20">/</span>

                <span className="text-white/50">
                  Founder & CEO
                </span>

                <span className="text-white/20">/</span>

                <span className="text-white/50">
                  B.Sc. in CSE
                </span>
              </div>
            </div>
          </motion.div>

          {/* RIGHT PHOTO */}
          <motion.div
            initial={
              reduceMotion
                ? undefined
                : { opacity: 0, x: 45, scale: 0.97 }
            }
            animate={
              reduceMotion
                ? undefined
                : { opacity: 1, x: 0, scale: 1 }
            }
            transition={
              reduceMotion
                ? undefined
                : { duration: 0.8, delay: 0.12 }
            }
            className="relative order-1 mx-auto w-full max-w-[520px] lg:order-2"
          >

            {/* Photo frame */}
            <div className="relative">

              <div className="absolute -inset-3 border border-emerald-400/10" />

              <div className="relative overflow-hidden border border-white/10 bg-[#1a211d]">

                <img
                  src="/photo/emon.png"
                  alt="Emon Islam - Founder and CEO of REMON ACADEMY"
                  loading="eager"
                  decoding="async"
                  className="h-[470px] w-full object-cover object-top sm:h-[590px]"
                />

                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#111512] via-transparent to-transparent" />

                {/* Founder label */}
                <motion.div
                  initial={
                    reduceMotion
                      ? undefined
                      : { opacity: 0, y: 18 }
                  }
                  animate={
                    reduceMotion
                      ? undefined
                      : { opacity: 1, y: 0 }
                  }
                  transition={
                    reduceMotion
                      ? undefined
                      : { duration: 0.55, delay: 0.65 }
                  }
                  className="absolute bottom-5 left-5 right-5 border border-white/10 bg-[#111512]/95 p-5"
                >
                  <div className="flex items-end justify-between gap-4">

                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-emerald-300">
                        Founder & CEO
                      </p>

                      <h2 className="mt-1 font-display text-2xl font-semibold">
                        Emon Islam
                      </h2>

                      <p className="mt-1 text-xs text-white/50">
                        B.Sc. in CSE · Developer · Educator
                      </p>
                    </div>

                    <div className="hidden h-11 w-11 items-center justify-center border border-emerald-400/20 bg-emerald-400/10 sm:flex">
                      <Code2 className="h-5 w-5 text-emerald-300" />
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Side identity */}
              <motion.div
                initial={
                  reduceMotion
                    ? undefined
                    : { opacity: 0, x: 20 }
                }
                animate={
                  reduceMotion
                    ? undefined
                    : { opacity: 1, x: 0 }
                }
                transition={
                  reduceMotion
                    ? undefined
                    : { duration: 0.5, delay: 0.85 }
                }
                className="absolute -bottom-6 -left-3 hidden border border-white/10 bg-[#18201b] px-4 py-3 shadow-xl sm:block"
              >
                <p className="text-[9px] uppercase tracking-[0.2em] text-white/35">
                  Vision
                </p>

                <p className="mt-1 text-sm font-semibold">
                  Better Students. Better Future.
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* =========================================================
          FOUNDER STATEMENT
      ========================================================= */}
      <section className="border-b border-[#dedfd9] bg-[#f7f7f4] dark:border-white/10 dark:bg-[#101311]">
        <div className="container-page py-20 lg:py-24">

          <motion.div
            {...reveal}
            className="mx-auto max-w-4xl text-center"
          >
            <div className="mx-auto mb-7 flex h-11 w-11 items-center justify-center rounded-full border border-emerald-600/20 text-emerald-700 dark:text-emerald-300">
              <Award className="h-5 w-5" />
            </div>

            <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-emerald-700 dark:text-emerald-300">
              A Message From The Founder
            </p>

            <blockquote className="mt-7 font-display text-2xl font-medium leading-[1.35] tracking-[-0.02em] text-[#171918] sm:text-3xl lg:text-[2.65rem] dark:text-white">
              “My goal is simple — to create an environment where every
              student gets the guidance, confidence and opportunity to
              become better than yesterday.”
            </blockquote>

            <div className="mt-8">
              <p className="font-semibold">
                Emon Islam
              </p>

              <p className="mt-1 text-xs uppercase tracking-[0.18em] text-black/40 dark:text-white/40">
                Founder & CEO · REMON ACADEMY
              </p>
            </div>
          </motion.div>

        </div>
      </section>

      {/* =========================================================
          STATS
      ========================================================= */}
      <section className="border-b border-[#dedfd9] bg-white dark:border-white/10 dark:bg-[#151916]">
        <div className="container-page grid grid-cols-2 md:grid-cols-4">
          <div className="border-b border-r border-[#dedfd9] py-8 md:border-b-0 dark:border-white/10">
            <StatCard
              icon={Users}
              label="Total Students"
              value={stats.totalStudents}
              suffix="+"
            />
          </div>

          <div className="border-b border-[#dedfd9] py-8 md:border-b-0 md:border-r dark:border-white/10">
            <StatCard
              icon={GraduationCap}
              label="Teachers"
              value={stats.totalTeachers}
              suffix="+"
            />
          </div>

          <div className="border-r border-[#dedfd9] py-8 dark:border-white/10">
            <StatCard
              icon={BookOpen}
              label="Courses"
              value={stats.totalCourses}
              suffix="+"
            />
          </div>

          <div className="py-8">
            <StatCard
              icon={TrendingUp}
              label="Successful Students"
              value={stats.successfulStudents}
              suffix="+"
            />
          </div>
        </div>
      </section>

      {/* =========================================================
          WHY REMON
      ========================================================= */}
      <section className="container-page py-20 lg:py-28">

        <motion.div
          {...reveal}
          className="mb-12 max-w-2xl"
        >
          <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-emerald-700 dark:text-emerald-300">
            Why REMON
          </p>

          <h2 className="mt-3 max-w-xl font-display text-3xl font-semibold leading-tight tracking-[-0.03em] sm:text-4xl lg:text-5xl">
            Education should create direction, not just information.
          </h2>

          <p className="mt-5 max-w-xl text-sm leading-7 text-black/55 dark:text-white/50">
            We focus on the things that genuinely influence a student's
            journey — good teaching, consistency, assessment and support.
          </p>
        </motion.div>

        <div className="grid gap-px overflow-hidden border border-[#dedfd9] bg-[#dedfd9] md:grid-cols-3 dark:border-white/10 dark:bg-white/10">

          {features.map((item) => {
            const Icon = item.icon;

            return (
              <motion.div
                key={item.title}
                {...reveal}
                className="group bg-[#f7f7f4] p-7 transition-colors hover:bg-white dark:bg-[#151916] dark:hover:bg-[#191e1a] lg:p-9"
              >

                <div className="flex items-start justify-between">
                  <div className="flex h-11 w-11 items-center justify-center border border-emerald-600/20 text-emerald-700 dark:text-emerald-300">
                    <Icon className="h-5 w-5" />
                  </div>

                  <span className="font-display text-sm text-black/20 dark:text-white/20">
                    {item.number}
                  </span>
                </div>

                <h3 className="mt-8 font-display text-xl font-semibold">
                  {item.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-black/55 dark:text-white/50">
                  {item.desc}
                </p>

                <div className="mt-7 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
                  Learn better
                  <ChevronRight className="h-3.5 w-3.5" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* =========================================================
          COURSES
      ========================================================= */}
      {courses.length > 0 && (
        <section className="border-y border-[#dedfd9] bg-white dark:border-white/10 dark:bg-[#151916]">

          <div className="container-page py-20 lg:py-28">

            <motion.div
              {...reveal}
              className="mb-12 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between"
            >
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-emerald-700 dark:text-emerald-300">
                  Learning Programs
                </p>

                <h2 className="mt-3 font-display text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">
                  Featured Courses
                </h2>

                <p className="mt-3 max-w-xl text-sm leading-7 text-black/50 dark:text-white/45">
                  Structured programs designed around clear learning
                  objectives and consistent academic progress.
                </p>
              </div>

              <Link
                to="/courses"
                className="group inline-flex items-center gap-2 text-sm font-bold"
              >
                View all courses
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>

            <div className="grid gap-5 md:grid-cols-3">

              {courses.map((course) => (
                <motion.div
                  key={course._id}
                  {...reveal}
                >
                  <Card className="group flex h-full flex-col overflow-hidden rounded-none border-[#dedfd9] bg-[#f7f7f4] p-0 shadow-none transition-colors hover:border-emerald-500/30 hover:bg-white dark:border-white/10 dark:bg-[#101311] dark:hover:bg-[#151916]">

                    <div className="relative flex h-36 items-center justify-between overflow-hidden bg-[#111512] px-6">

                      <div>
                        <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-emerald-300">
                          Program
                        </p>

                        <p className="mt-2 text-sm text-white/60">
                          {course.classLevel}
                        </p>
                      </div>

                      <BookOpen className="h-9 w-9 text-emerald-300" />

                      <div className="absolute bottom-0 left-0 h-px w-full bg-emerald-400/40" />
                    </div>

                    <div className="flex flex-1 flex-col p-6">

                      <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-black/40 dark:text-white/35">
                        <span>{course.subject}</span>
                        <span>•</span>
                        <span>{course.duration}</span>
                      </div>

                      <h3 className="mt-3 font-display text-xl font-semibold">
                        {course.title}
                      </h3>

                      <p className="mt-3 line-clamp-3 text-sm leading-6 text-black/50 dark:text-white/45">
                        {course.description}
                      </p>

                      <div className="mt-auto flex items-end justify-between border-t border-black/10 pt-5 dark:border-white/10">

                        <div>
                          <p className="text-[9px] font-bold uppercase tracking-wider text-black/35 dark:text-white/30">
                            Course Fee
                          </p>

                          <p className="mt-1 text-xl font-bold text-emerald-700 dark:text-emerald-300">
                            ৳{course.fee}
                          </p>
                        </div>

                        <Link
                          to={`/courses/${course.slug}`}
                          className="group/link inline-flex items-center gap-1.5 border border-black/10 px-3 py-2 text-xs font-bold transition-colors hover:border-emerald-500 hover:bg-emerald-400 hover:text-[#101512] dark:border-white/10"
                        >
                          Details
                          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/link:translate-x-1" />
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
          TECHNOLOGY / FOUNDER
      ========================================================= */}
      <section className="container-page py-20 lg:py-28">

        <motion.div
          {...reveal}
          className="grid overflow-hidden border border-[#dedfd9] bg-[#111512] text-white lg:grid-cols-[0.85fr_1.15fr] dark:border-white/10"
        >

          <div className="relative min-h-[380px] overflow-hidden">
            <img
              src="/photo/emon.png"
              alt="Emon Islam"
              loading="lazy"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover object-top opacity-90"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-[#111512] via-transparent to-transparent" />

            <div className="absolute bottom-6 left-6">
              <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-emerald-300">
                Founder & CEO
              </p>

              <h3 className="mt-1 font-display text-2xl font-semibold">
                Emon Islam
              </h3>
            </div>
          </div>

          <div className="flex flex-col justify-center p-7 sm:p-10 lg:p-14">

            <div className="flex items-center gap-2 text-emerald-300">
              <Code2 className="h-4 w-4" />

              <span className="text-[9px] font-bold uppercase tracking-[0.25em]">
                Technology × Education
              </span>
            </div>

            <h2 className="mt-5 max-w-xl font-display text-3xl font-semibold leading-tight tracking-[-0.03em] sm:text-4xl">
              Building an education experience that feels ready for the future.
            </h2>

            <p className="mt-5 max-w-xl text-sm leading-7 text-white/55">
              REMON ACADEMY brings academic guidance and technology
              together so students can learn, track their progress and
              stay connected through one organized digital environment.
            </p>

            <div className="mt-8 flex flex-wrap gap-2">
              {[
                "B.Sc. in CSE",
                "Web Development",
                "Education Technology",
                "Digital Student Portal",
              ].map((item) => (
                <span
                  key={item}
                  className="border border-white/10 px-3 py-2 text-[10px] font-semibold text-white/65"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

        </motion.div>
      </section>

      {/* =========================================================
          TEACHERS
      ========================================================= */}
      {teachers.length > 0 && (
        <section className="border-y border-[#dedfd9] bg-white dark:border-white/10 dark:bg-[#151916]">

          <div className="container-page py-20 lg:py-28">

            <motion.div
              {...reveal}
              className="mb-12 max-w-2xl"
            >
              <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-emerald-700 dark:text-emerald-300">
                The People Behind Learning
              </p>

              <h2 className="mt-3 font-display text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">
                Meet Our Teachers
              </h2>

              <p className="mt-4 text-sm leading-7 text-black/50 dark:text-white/45">
                Dedicated educators focused on making every lesson clear,
                practical and meaningful.
              </p>
            </motion.div>

            <div className="grid gap-px overflow-hidden border border-[#dedfd9] bg-[#dedfd9] md:grid-cols-3 dark:border-white/10 dark:bg-white/10">

              {teachers.map((teacher) => (
                <motion.div
                  key={teacher._id}
                  {...reveal}
                  className="bg-[#f7f7f4] p-7 dark:bg-[#101311]"
                >

                  <div className="flex items-center gap-5">

                    <div className="h-20 w-20 shrink-0 overflow-hidden rounded-full border border-emerald-500/20 bg-[#111512]">

                      {teacher.photo ? (
                        <img
                          src={teacher.photo}
                          alt={teacher.name}
                          loading="lazy"
                          decoding="async"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-xl font-bold text-emerald-300">
                          {teacher.name.charAt(0)}
                        </div>
                      )}

                    </div>

                    <div>
                      <h3 className="font-display text-lg font-semibold">
                        {teacher.name}
                      </h3>

                      <p className="mt-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                        {teacher.designation || "Instructor"}
                      </p>

                      {teacher.specialization && (
                        <p className="mt-2 text-xs text-black/45 dark:text-white/40">
                          {teacher.specialization}
                        </p>
                      )}
                    </div>
                  </div>

                </motion.div>
              ))}

            </div>
          </div>
        </section>
      )}

      {/* =========================================================
          NOTICES
      ========================================================= */}
      {notices.length > 0 && (
        <section className="container-page py-20 lg:py-28">

          <motion.div
            {...reveal}
            className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
          >
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-emerald-700 dark:text-emerald-300">
                Academy Updates
              </p>

              <h2 className="mt-3 font-display text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">
                Latest Notices
              </h2>

              <p className="mt-3 text-sm text-black/50 dark:text-white/45">
                Stay informed about important academy announcements.
              </p>
            </div>

            <Link
              to="/notices"
              className="inline-flex items-center gap-2 text-sm font-bold"
            >
              View all notices
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>

          <div className="grid gap-5 md:grid-cols-3">

            {notices.map((notice) => (
              <motion.div
                key={notice._id}
                {...reveal}
              >
                <Card className="group h-full rounded-none border-[#dedfd9] bg-[#f7f7f4] shadow-none transition-colors hover:bg-white dark:border-white/10 dark:bg-[#151916] dark:hover:bg-[#191e1a]">

                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-300">
                      {notice.category}
                    </span>

                    <ShieldCheck className="h-4 w-4 text-black/20 dark:text-white/20" />
                  </div>

                  <h3 className="mt-6 font-display text-lg font-semibold">
                    {notice.title}
                  </h3>

                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-black/50 dark:text-white/45">
                    {notice.description}
                  </p>

                  <Link
                    to={`/notices/${notice.slug}`}
                    className="mt-6 inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-300"
                  >
                    Read notice
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>

                </Card>
              </motion.div>
            ))}

          </div>
        </section>
      )}

      {/* =========================================================
          FINAL CTA
      ========================================================= */}
      <section className="container-page pb-20 lg:pb-28">

        <motion.div
          {...reveal}
          className="relative overflow-hidden bg-[#111512] px-6 py-16 text-center text-white sm:px-12 lg:py-20"
        >

          <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(52,211,153,0.08),transparent_40%,rgba(52,211,153,0.04))]" />

          <div className="relative">

            <div className="mx-auto flex h-12 w-12 items-center justify-center border border-emerald-400/20 bg-emerald-400/10">
              <Award className="h-5 w-5 text-emerald-300" />
            </div>

            <p className="mt-7 text-[9px] font-bold uppercase tracking-[0.3em] text-emerald-300">
              Your journey starts here
            </p>

            <h2 className="mx-auto mt-3 max-w-2xl font-display text-3xl font-semibold tracking-[-0.03em] sm:text-4xl lg:text-5xl">
              Give your learning a better direction.
            </h2>

            <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-white/50">
              Join {brand.name} and build your academic journey with
              structured learning, dedicated teachers and modern support.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-3">

              <Link
                to="/register"
                className="group inline-flex items-center gap-2 bg-emerald-400 px-6 py-3.5 text-sm font-bold text-[#101512] transition-colors hover:bg-emerald-300"
              >
                Register Now
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>

              <Link
                to="/courses"
                className="inline-flex items-center gap-2 border border-white/15 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white hover:text-[#111512]"
              >
                Explore Courses
              </Link>

            </div>
          </div>
        </motion.div>

      </section>

    </main>
  );
}