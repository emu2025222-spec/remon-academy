import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  Award,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  GraduationCap,
  Layers3,
  Quote,
  ShieldCheck,
  Target,
  TrendingUp,
  Users,
  Sparkles,
  Brain,
  MonitorSmartphone,
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
      .then((r) =>
        setCourses((r.data.data || []).slice(0, 3))
      )
      .catch(() => {});

    api
      .get("/teachers/public")
      .then((r) =>
        setTeachers((r.data.data || []).slice(0, 3))
      )
      .catch(() => {});

    api
      .get("/notices/public")
      .then((r) =>
        setNotices((r.data.data || []).slice(0, 3))
      )
      .catch(() => {});
  }, []);

  const features = [
    {
      number: "01",
      icon: Brain,
      title: "Concept First",
      text: "Strong academic foundations begin with understanding. We focus on concepts before memorization.",
    },
    {
      number: "02",
      icon: Target,
      title: "Focused Progress",
      text: "Structured learning, regular practice and academic tracking help students improve with direction.",
    },
    {
      number: "03",
      icon: TrendingUp,
      title: "Measurable Growth",
      text: "Progress becomes meaningful when students can clearly see where they are and where they need to go.",
    },
    {
      number: "04",
      icon: MonitorSmartphone,
      title: "Digital Learning",
      text: "Modern technology keeps academic information organized, accessible and connected.",
    },
  ];

  const learningPoints = [
    "Strong academic fundamentals",
    "Experienced teaching guidance",
    "Regular academic assessment",
    "Digital student management",
    "Organized attendance tracking",
    "Transparent fee information",
  ];

  return (
    <main className="overflow-hidden bg-[#f5f3ee] text-[#111827] dark:bg-[#080c14] dark:text-white">

      {/* ============================================================
          HERO
      ============================================================ */}

      <section className="relative overflow-hidden bg-[#101722] text-white">

        <div className="pointer-events-none absolute inset-0">

          <div className="absolute right-[-180px] top-[-180px] h-[560px] w-[560px] rounded-full border border-brand-gold/[0.08]" />

          <div className="absolute right-[-80px] top-[-80px] h-[360px] w-[360px] rounded-full border border-brand-gold/[0.05]" />

          <div className="absolute bottom-[-300px] left-[-200px] h-[550px] w-[550px] rounded-full border border-white/[0.035]" />

          <div className="absolute inset-0 opacity-[0.02] [background-image:linear-gradient(rgba(255,255,255,.8)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.8)_1px,transparent_1px)] [background-size:80px_80px]" />

          <div className="absolute left-[10%] top-[20%] h-2 w-2 rounded-full bg-brand-gold/40" />

          <div className="absolute right-[25%] top-[32%] h-1.5 w-1.5 rounded-full bg-white/20" />

          <div className="absolute bottom-[25%] right-[12%] h-2 w-2 rounded-full bg-brand-gold/30" />

        </div>

        <div className="container-page relative">

          <div className="grid min-h-[680px] items-center gap-12 py-16 lg:grid-cols-[1.2fr_0.8fr] lg:gap-20">

            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="relative z-10"
            >

              <div className="mb-7 flex items-center gap-3">

                <span className="h-px w-12 bg-brand-gold" />

                <span className="text-[9px] font-bold uppercase tracking-[0.34em] text-brand-gold">
                  REMON ACADEMY · EST. 2026
                </span>

              </div>

              <div className="mb-5 inline-flex items-center gap-2 border border-white/10 bg-white/[0.03] px-3 py-2">

                <Sparkles className="h-3.5 w-3.5 text-brand-gold" />

                <span className="text-[9px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                  Learn · Grow · Achieve
                </span>

              </div>

              <h1 className="max-w-5xl font-display text-[3.4rem] font-bold leading-[0.93] tracking-[-0.055em] sm:text-6xl lg:text-[6.4rem]">

                Learn with
                <br />

                <span className="text-white/30">
                  clarity.
                </span>

                <br />

                <span className="text-brand-gold">
                  Grow with purpose.
                </span>

              </h1>

              <p className="mt-8 max-w-xl text-sm leading-7 text-slate-300 sm:text-base sm:leading-8">
                {brand.name} is a modern learning environment built around
                strong academic foundations, focused guidance, measurable
                progress and meaningful student growth.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">

                <Link
                  to="/courses"
                  className="group inline-flex items-center justify-center gap-3 bg-brand-gold px-7 py-3.5 text-sm font-bold text-[#101722] transition-all duration-300 hover:bg-brand-goldLight"
                >
                  Explore Courses

                  <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" />
                </Link>

                <Link
                  to="/about"
                  className="group inline-flex items-center justify-center gap-3 border border-white/15 px-7 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:border-brand-gold hover:text-brand-gold"
                >
                  Discover REMON

                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>

              </div>

              <div className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-3 text-xs text-slate-400">

                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-brand-gold" />
                  Structured Learning
                </div>

                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-brand-gold" />
                  Digital Academic Support
                </div>

              </div>

            </motion.div>

            {/* ABSTRACT ACADEMY VISUAL — NO FOUNDER PHOTO */}

            <motion.div
              initial={{ opacity: 0, x: 35 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="relative hidden justify-center lg:flex"
            >

              <div className="relative h-[480px] w-[390px]">

                <div className="absolute inset-10 rounded-full border border-brand-gold/10" />

                <div className="absolute inset-20 rounded-full border border-brand-gold/10" />

                <div className="absolute inset-[120px] rounded-full border border-white/5" />

                <div className="absolute left-1/2 top-1/2 flex h-52 w-52 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-brand-gold/20 bg-white/[0.025]">

                  <div className="flex h-36 w-36 items-center justify-center rounded-full border border-brand-gold/20 bg-brand-gold/[0.04]">

                    <div className="text-center">

                      <p className="font-display text-5xl font-bold text-brand-gold">
                        R
                      </p>

                      <p className="mt-1 text-[8px] font-bold uppercase tracking-[0.3em] text-slate-400">
                        Academy
                      </p>

                    </div>

                  </div>

                </div>

                <div className="absolute left-0 top-16 border border-white/10 bg-[#101722]/90 p-4">

                  <GraduationCap className="h-5 w-5 text-brand-gold" />

                  <p className="mt-3 text-[8px] font-bold uppercase tracking-[0.2em] text-slate-500">
                    Academic
                  </p>

                  <p className="mt-1 text-xs font-semibold text-white">
                    Excellence
                  </p>

                </div>

                <div className="absolute bottom-16 right-0 border border-white/10 bg-[#101722]/90 p-4">

                  <MonitorSmartphone className="h-5 w-5 text-brand-gold" />

                  <p className="mt-3 text-[8px] font-bold uppercase tracking-[0.2em] text-slate-500">
                    Education
                  </p>

                  <p className="mt-1 text-xs font-semibold text-white">
                    Technology
                  </p>

                </div>

                <div className="absolute right-8 top-0 h-2 w-2 rounded-full bg-brand-gold" />

                <div className="absolute bottom-5 left-12 h-1.5 w-1.5 rounded-full bg-white/30" />

                <div className="absolute left-1/2 top-5 -translate-x-1/2 text-[8px] font-bold uppercase tracking-[0.4em] text-white/20">
                  EDUCATION · FUTURE
                </div>

                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 whitespace-nowrap text-[8px] font-bold uppercase tracking-[0.35em] text-white/20">
                  KNOWLEDGE · DISCIPLINE · GROWTH
                </div>

              </div>

            </motion.div>

          </div>

        </div>

      </section>

      {/* ============================================================
          QUICK STATS
      ============================================================ */}

      <section className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">

        <div className="container-page grid grid-cols-2 md:grid-cols-4">

          <div className="border-b border-slate-200 px-4 py-7 dark:border-slate-800 md:border-b-0 md:border-r">

            <StatCard
              icon={Users}
              label="Students"
              value={stats.totalStudents}
              suffix="+"
            />

          </div>

          <div className="border-b border-slate-200 px-4 py-7 dark:border-slate-800 md:border-b-0 md:border-r">

            <StatCard
              icon={GraduationCap}
              label="Teachers"
              value={stats.totalTeachers}
              suffix="+"
            />

          </div>

          <div className="px-4 py-7 md:border-r md:border-slate-200 dark:md:border-slate-800">

            <StatCard
              icon={BookOpen}
              label="Programs"
              value={stats.totalCourses}
              suffix="+"
            />

          </div>

          <div className="px-4 py-7">

            <StatCard
              icon={TrendingUp}
              label="Successful Students"
              value={stats.successfulStudents}
              suffix="+"
            />

          </div>

        </div>

      </section>

      {/* ============================================================
          PHILOSOPHY
      ============================================================ */}

      <section className="bg-[#f5f3ee] py-20 dark:bg-[#080c14] sm:py-24 lg:py-28">

        <div className="container-page">

          <div className="grid gap-10 lg:grid-cols-[0.5fr_1.5fr]">

            <div>

              <p className="text-[9px] font-bold uppercase tracking-[0.35em] text-brand-gold">
                Our Philosophy
              </p>

              <div className="mt-4 h-px w-10 bg-brand-gold" />

              <p className="mt-5 max-w-xs text-xs leading-6 text-slate-400">
                A learning environment designed around understanding,
                consistency and long-term growth.
              </p>

            </div>

            <div>

              <h2 className="max-w-5xl font-display text-2xl font-semibold leading-[1.3] tracking-tight text-[#111827] dark:text-white sm:text-3xl lg:text-[2.75rem]">

                Education should do more than prepare students for an
                examination.

                <span className="text-brand-gold">
                  {" "}
                  It should prepare them for what comes after it.
                </span>

              </h2>

              <p className="mt-7 max-w-3xl text-sm leading-7 text-slate-500 sm:text-base sm:leading-8">
                REMON ACADEMY brings together academic discipline,
                dedicated teaching and digital organization to create a
                clearer path for students.
              </p>

            </div>

          </div>

        </div>

      </section>

      {/* ============================================================
          WHY REMON
      ============================================================ */}

      <section className="bg-white py-20 dark:bg-slate-900 sm:py-24 lg:py-28">

        <div className="container-page">

          <div className="flex flex-col justify-between gap-7 lg:flex-row lg:items-end">

            <div>

              <p className="text-[9px] font-bold uppercase tracking-[0.35em] text-brand-gold">
                Why REMON
              </p>

              <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-[#111827] dark:text-white sm:text-4xl lg:text-5xl">

                A better way
                <br />

                <span className="text-slate-300 dark:text-slate-700">
                  to learn.
                </span>

              </h2>

            </div>

            <p className="max-w-md text-sm leading-7 text-slate-500">
              Every part of REMON ACADEMY is designed to make learning
              more structured, focused and meaningful.
            </p>

          </div>

          <div className="mt-14 grid gap-px overflow-hidden border border-slate-200 bg-slate-200 dark:border-slate-800 dark:bg-slate-800 sm:grid-cols-2 lg:grid-cols-4">

            {features.map((feature) => {

              const Icon = feature.icon;

              return (
                <div
                  key={feature.number}
                  className="group bg-[#faf9f6] p-7 transition-all duration-300 hover:bg-white dark:bg-slate-950 dark:hover:bg-slate-900 sm:p-8"
                >

                  <div className="flex items-start justify-between">

                    <span className="font-display text-4xl font-bold text-slate-200 transition-colors group-hover:text-brand-gold/20 dark:text-slate-800">
                      {feature.number}
                    </span>

                    <Icon className="h-6 w-6 text-brand-gold" />

                  </div>

                  <h3 className="mt-10 font-display text-xl font-bold text-[#111827] dark:text-white">
                    {feature.title}
                  </h3>

                  <p className="mt-4 text-sm leading-7 text-slate-500">
                    {feature.text}
                  </p>

                  <div className="mt-7 h-px w-8 bg-brand-gold transition-all duration-300 group-hover:w-16" />

                </div>
              );

            })}

          </div>

        </div>

      </section>

      {/* ============================================================
          COURSES
      ============================================================ */}

      {courses.length > 0 && (
        <section className="bg-[#101722] py-20 text-white sm:py-24 lg:py-28">

          <div className="container-page">

            <div className="flex flex-col justify-between gap-7 lg:flex-row lg:items-end">

              <div>

                <p className="text-[9px] font-bold uppercase tracking-[0.35em] text-brand-gold">
                  Academic Programs
                </p>

                <h2 className="mt-4 font-display text-3xl font-bold sm:text-4xl lg:text-5xl">

                  Programs built
                  <br />

                  <span className="text-white/35">
                    for progress.
                  </span>

                </h2>

              </div>

              <div className="max-w-md">

                <p className="text-sm leading-7 text-slate-400">
                  Carefully structured academic programs designed around
                  fundamentals, practice and measurable improvement.
                </p>

                <Link
                  to="/courses"
                  className="group mt-5 inline-flex items-center gap-2 text-sm font-bold text-brand-gold"
                >
                  View all courses

                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
                </Link>

              </div>

            </div>

            <div className="mt-12 grid gap-4 md:grid-cols-3">

              {courses.map((course, index) => (

                <Card
                  key={course._id}
                  className="group relative flex h-full flex-col overflow-hidden border border-white/10 bg-white/[0.025] p-0 text-white transition-all duration-300 hover:-translate-y-1 hover:border-brand-gold/40 hover:bg-white/[0.045]"
                >

                  <div className="relative border-b border-white/10 p-6">

                    <div className="flex items-start justify-between">

                      <span className="font-display text-5xl font-bold text-white/[0.07]">
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      <BookOpen className="h-5 w-5 text-brand-gold" />

                    </div>

                    <div className="mt-8">

                      <p className="text-[8px] font-bold uppercase tracking-[0.22em] text-brand-gold">
                        {course.classLevel}
                      </p>

                      <h3 className="mt-2 font-display text-xl font-bold">
                        {course.title}
                      </h3>

                      <p className="mt-1 text-xs text-slate-500">
                        {course.subject}
                      </p>

                    </div>

                    <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-brand-gold transition-all duration-500 group-hover:w-full" />

                  </div>

                  <div className="flex flex-1 flex-col p-6">

                    <p className="line-clamp-3 text-sm leading-7 text-slate-400">
                      {course.description}
                    </p>

                    <div className="mt-auto flex items-end justify-between gap-4 border-t border-white/10 pt-6">

                      <div>

                        <p className="text-[8px] font-bold uppercase tracking-wider text-slate-500">
                          Course Fee
                        </p>

                        <p className="mt-1 text-xl font-bold text-brand-gold">
                          ৳{course.fee}
                        </p>

                      </div>

                      <Link
                        to={`/courses/${course.slug}`}
                        className="inline-flex items-center gap-2 border border-white/15 px-4 py-2.5 text-xs font-bold transition-colors hover:border-brand-gold hover:bg-brand-gold hover:text-[#101722]"
                      >
                        Details

                        <ArrowUpRight className="h-3.5 w-3.5" />

                      </Link>

                    </div>

                  </div>

                </Card>

              ))}

            </div>

          </div>

        </section>
      )}

      {/* ============================================================
          LEARNING ECOSYSTEM
      ============================================================ */}

      <section className="bg-[#f5f3ee] py-20 dark:bg-[#080c14] sm:py-24 lg:py-28">

        <div className="container-page">

          <div className="grid items-center gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">

            <div>

              <div className="flex items-center gap-3">

                <Layers3 className="h-5 w-5 text-brand-gold" />

                <span className="text-[9px] font-bold uppercase tracking-[0.35em] text-brand-gold">
                  One Learning Ecosystem
                </span>

              </div>

              <h2 className="mt-5 font-display text-3xl font-bold leading-tight text-[#111827] dark:text-white sm:text-4xl lg:text-5xl">

                Everything students
                <br />

                need to stay
                <br />

                <span className="text-brand-gold">
                  on track.
                </span>

              </h2>

              <p className="mt-6 max-w-lg text-sm leading-7 text-slate-500 sm:text-base">
                REMON connects important academic information in one
                organized digital environment so students can focus more
                on learning and less on searching for information.
              </p>

              <Link
                to="/about"
                className="group mt-7 inline-flex items-center gap-2 text-sm font-bold text-[#111827] dark:text-brand-gold"
              >
                Learn about our approach

                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>

            </div>

            <div className="grid gap-3 sm:grid-cols-2">

              {learningPoints.map((item, index) => (

                <div
                  key={item}
                  className="group border border-slate-200 bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-brand-gold/40 dark:border-slate-800 dark:bg-slate-900"
                >

                  <div className="flex items-center justify-between">

                    <span className="font-display text-2xl font-bold text-slate-200 dark:text-slate-800">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <CheckCircle2 className="h-5 w-5 text-brand-gold" />

                  </div>

                  <p className="mt-8 text-sm font-semibold text-slate-700 dark:text-slate-200">
                    {item}
                  </p>

                </div>

              ))}

            </div>

          </div>

        </div>

      </section>

      {/* ============================================================
          TEACHERS
      ============================================================ */}

      {teachers.length > 0 && (
        <section className="bg-white py-20 dark:bg-slate-900 sm:py-24 lg:py-28">

          <div className="container-page">

            <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">

              <div>

                <p className="text-[9px] font-bold uppercase tracking-[0.35em] text-brand-gold">
                  Faculty
                </p>

                <h2 className="mt-4 font-display text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">

                  Guided by
                  <br />

                  <span className="text-slate-300 dark:text-slate-700">
                    dedicated educators.
                  </span>

                </h2>

              </div>

              <Link
                to="/teachers"
                className="group inline-flex items-center gap-2 text-sm font-bold text-[#111827] dark:text-brand-gold"
              >
                Meet all teachers

                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
              </Link>

            </div>

            <div className="mt-12 grid gap-4 md:grid-cols-3">

              {teachers.map((teacher, index) => (

                <Card
                  key={teacher._id}
                  className="group relative overflow-hidden border border-slate-200 bg-[#faf9f6] p-0 transition-all duration-300 hover:-translate-y-1 hover:border-brand-gold/40 dark:border-slate-800 dark:bg-slate-950"
                >

                  <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-800">

                    <span className="text-[8px] font-bold uppercase tracking-[0.25em] text-brand-gold">
                      Faculty {String(index + 1).padStart(2, "0")}
                    </span>

                    <GraduationCap className="h-4 w-4 text-slate-300" />

                  </div>

                  <div className="flex gap-5 p-5 sm:p-6">

                    <div className="h-24 w-24 shrink-0 overflow-hidden rounded-full border-2 border-brand-gold/20 bg-[#101722]">

                      {teacher.photo ? (
                        <img
                          src={teacher.photo}
                          alt={teacher.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-2xl font-bold text-brand-gold">
                          {teacher.name.charAt(0)}
                        </div>
                      )}

                    </div>

                    <div className="min-w-0 pt-1">

                      <h3 className="font-display text-lg font-bold text-[#111827] dark:text-white">
                        {teacher.name}
                      </h3>

                      <p className="mt-1 text-[9px] font-bold uppercase tracking-wider text-brand-gold">
                        {teacher.designation || "Instructor"}
                      </p>

                      {teacher.specialization && (
                        <p className="mt-3 text-xs leading-5 text-slate-500">
                          {teacher.specialization}
                        </p>
                      )}

                    </div>

                  </div>

                  <div className="h-1 w-0 bg-brand-gold transition-all duration-500 group-hover:w-full" />

                </Card>

              ))}

            </div>

          </div>

        </section>
      )}

      {/* ============================================================
          FOUNDER MESSAGE — NO PHOTO
      ============================================================ */}

      <section className="border-y border-slate-200 bg-[#101722] text-white dark:border-slate-800">

        <div className="container-page py-20 sm:py-24 lg:py-28">

          <div className="grid gap-10 lg:grid-cols-[0.5fr_1.5fr] lg:items-center">

            <div>

              <div className="flex h-12 w-12 items-center justify-center border border-brand-gold/30">

                <Quote className="h-5 w-5 text-brand-gold" />

              </div>

              <p className="mt-5 text-[8px] font-bold uppercase tracking-[0.3em] text-brand-gold">
                Founder&apos;s Philosophy
              </p>

            </div>

            <div>

              <blockquote className="max-w-5xl font-display text-2xl font-semibold leading-[1.35] tracking-tight sm:text-3xl lg:text-[2.7rem]">

                “Every student has potential. Our responsibility is to
                create the environment, guidance and discipline that helps
                that potential become real.”

              </blockquote>

              <div className="mt-7 flex items-center gap-3">

                <span className="h-px w-8 bg-brand-gold" />

                <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-slate-400">
                  Emon Islam · Founder & CEO
                </span>

              </div>

              <Link
                to="/founder"
                className="group mt-8 inline-flex items-center gap-2 border border-white/10 px-5 py-3 text-xs font-bold transition-colors hover:border-brand-gold hover:text-brand-gold"
              >
                Meet the Founder

                <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
              </Link>

            </div>

          </div>

        </div>

      </section>

      {/* ============================================================
          NOTICES
      ============================================================ */}

      {notices.length > 0 && (
        <section className="bg-white py-20 dark:bg-slate-900 sm:py-24 lg:py-28">

          <div className="container-page">

            <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">

              <div>

                <p className="text-[9px] font-bold uppercase tracking-[0.35em] text-brand-gold">
                  Academy Journal
                </p>

                <h2 className="mt-4 font-display text-3xl font-bold sm:text-4xl lg:text-5xl">
                  Stay informed.
                </h2>

              </div>

              <Link
                to="/notices"
                className="group inline-flex items-center gap-2 text-sm font-bold text-[#111827] dark:text-brand-gold"
              >
                View all notices

                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
              </Link>

            </div>

            <div className="mt-12 grid gap-4 md:grid-cols-3">

              {notices.map((notice, index) => (

                <Link
                  key={notice._id}
                  to={`/notices/${notice.slug}`}
                  className="group relative overflow-hidden border border-slate-200 bg-[#faf9f6] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-brand-gold/40 dark:border-slate-800 dark:bg-slate-950"
                >

                  <div className="flex items-start justify-between">

                    <span className="font-display text-4xl font-bold text-slate-200 dark:text-slate-800">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <ArrowUpRight className="h-5 w-5 text-slate-300 transition-all group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-brand-gold" />

                  </div>

                  <div className="mt-8">

                    <div className="mb-3 flex items-center gap-2">

                      <ShieldCheck className="h-3.5 w-3.5 text-brand-gold" />

                      <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-brand-gold">
                        {notice.category}
                      </span>

                    </div>

                    <h3 className="font-display text-lg font-bold text-[#111827] transition-colors group-hover:text-brand-gold dark:text-white">
                      {notice.title}
                    </h3>

                    <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-500">
                      {notice.description}
                    </p>

                  </div>

                  <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-brand-gold transition-all duration-500 group-hover:w-full" />

                </Link>

              ))}

            </div>

          </div>

        </section>
      )}

      {/* ============================================================
          FINAL CTA
      ============================================================ */}

      <section className="bg-[#101722] py-20 text-white sm:py-24 lg:py-28">

        <div className="container-page">

          <div className="relative overflow-hidden border border-white/10 px-6 py-14 text-center sm:px-12 lg:px-20 lg:py-20">

            <div className="pointer-events-none absolute right-[-100px] top-[-100px] h-64 w-64 rounded-full border border-brand-gold/[0.08]" />

            <div className="pointer-events-none absolute bottom-[-130px] left-[-100px] h-72 w-72 rounded-full border border-white/[0.035]" />

            <div className="relative">

              <Award className="mx-auto h-7 w-7 text-brand-gold" />

              <p className="mt-5 text-[9px] font-bold uppercase tracking-[0.35em] text-brand-gold">
                Begin Your Journey
              </p>

              <h2 className="mx-auto mt-4 max-w-3xl font-display text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">

                A stronger foundation.
                <br />

                A clearer future.

              </h2>

              <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-slate-400">

                Start your academic journey with structured courses,
                dedicated teachers and a modern learning environment
                built around student growth.

              </p>

              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">

                <Link
                  to="/register"
                  className="group inline-flex items-center justify-center gap-3 bg-brand-gold px-7 py-3.5 text-sm font-bold text-[#101722] transition-colors hover:bg-brand-goldLight"
                >
                  Join REMON ACADEMY

                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />

                </Link>

                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center gap-3 border border-white/15 px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:border-brand-gold hover:text-brand-gold"
                >
                  Contact Us
                </Link>

              </div>

            </div>

          </div>

        </div>

      </section>

    </main>
  );
}