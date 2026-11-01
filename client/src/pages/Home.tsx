import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  Award,
  BookOpen,
  CheckCircle2,
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
  Activity,
  CalendarCheck,
  Clock3,
  Star,
  Zap,
  Globe2,
  BookMarked,
  Lightbulb,
  Trophy,
  ChevronRight,
} from "lucide-react";

import { api } from "../services/api";
import { Course, Teacher, Notice } from "../types";
import { StatCard } from "../components/StatCard";
import { Card } from "../components/Card";
import { brand } from "../config/brand";

const fadeUp = {
  hidden: { opacity: 0, y: 35 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: "easeOut" as const },
  },
};

const stagger = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

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
      color: "from-violet-500 to-purple-600",
    },
    {
      number: "02",
      icon: Target,
      title: "Focused Progress",
      text: "Structured learning, regular practice and academic tracking help students improve with direction.",
      color: "from-blue-500 to-cyan-500",
    },
    {
      number: "03",
      icon: TrendingUp,
      title: "Measurable Growth",
      text: "Progress becomes meaningful when students can clearly see where they are and where they need to go.",
      color: "from-fuchsia-500 to-pink-500",
    },
    {
      number: "04",
      icon: MonitorSmartphone,
      title: "Digital Learning",
      text: "Modern technology keeps academic information organized, accessible and connected.",
      color: "from-indigo-500 to-blue-500",
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

  const highlights = [
    {
      icon: BookOpen,
      title: "Academic Programs",
      text: "Structured courses",
    },
    {
      icon: Users,
      title: "Expert Teachers",
      text: "Dedicated guidance",
    },
    {
      icon: Activity,
      title: "Student Progress",
      text: "Track improvement",
    },
  ];

  return (
    <main className="relative isolate overflow-hidden bg-[#070711] text-white selection:bg-violet-500/40">

      {/* ============================================================
          GLOBAL BACKGROUND
      ============================================================ */}

      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">

        <div className="absolute -left-64 top-0 h-[600px] w-[600px] rounded-full bg-purple-700/[0.10] blur-[140px]" />

        <div className="absolute -right-64 top-[30%] h-[650px] w-[650px] rounded-full bg-blue-700/[0.10] blur-[150px]" />

        <div className="absolute bottom-0 left-[30%] h-[500px] w-[500px] rounded-full bg-fuchsia-700/[0.06] blur-[150px]" />

      </div>

      {/* ============================================================
          HERO
      ============================================================ */}

      <section className="relative min-h-[680px] overflow-hidden bg-[#080814] lg:min-h-[790px]">

        {/* Spotlight and Background */}

        <div className="pointer-events-none absolute inset-0">

          <div className="absolute -left-40 top-[-150px] h-[600px] w-[600px] rounded-full bg-purple-600/[0.13] blur-[130px]" />

          <div className="absolute right-[-150px] top-[10%] h-[600px] w-[600px] rounded-full bg-blue-600/[0.13] blur-[140px]" />

          <div className="absolute bottom-[-300px] left-[35%] h-[550px] w-[550px] rounded-full bg-fuchsia-600/[0.08] blur-[130px]" />

          <div className="absolute inset-0 opacity-[0.035] [background-image:linear-gradient(rgba(255,255,255,.7)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.7)_1px,transparent_1px)] [background-size:65px_65px]" />

          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#070711] to-transparent" />

          <motion.div
            animate={{ y: [0, -20, 0], opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 6, repeat: Infinity }}
            className="absolute left-[12%] top-[22%] h-2 w-2 rounded-full bg-violet-400 shadow-[0_0_20px_5px_rgba(139,92,246,0.5)]"
          />

          <motion.div
            animate={{ y: [0, 18, 0], opacity: [0.2, 0.8, 0.2] }}
            transition={{ duration: 7, repeat: Infinity }}
            className="absolute right-[20%] top-[30%] h-2 w-2 rounded-full bg-blue-400 shadow-[0_0_20px_5px_rgba(59,130,246,0.5)]"
          />

          <motion.div
            animate={{ y: [0, -15, 0], opacity: [0.2, 0.6, 0.2] }}
            transition={{ duration: 5, repeat: Infinity }}
            className="absolute bottom-[25%] right-[35%] h-1.5 w-1.5 rounded-full bg-fuchsia-400"
          />

        </div>

        <div className="container-page relative z-10">

          <div className="grid min-h-[680px] items-center gap-12 py-16 lg:min-h-[790px] lg:grid-cols-[1.05fr_0.95fr] lg:gap-8 lg:py-20">

            {/* Hero Content */}

            <motion.div
              initial="hidden"
              animate="visible"
              variants={stagger}
              className="relative z-10"
            >

              <motion.div
                variants={fadeUp}
                className="mb-7 inline-flex items-center gap-3 rounded-full border border-violet-400/20 bg-violet-500/[0.08] px-4 py-2.5 shadow-[0_0_35px_rgba(139,92,246,0.10)] backdrop-blur-xl"
              >

                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-violet-400 opacity-70" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-violet-400" />
                </span>

                <span className="text-[9px] font-bold uppercase tracking-[0.23em] text-violet-200">
                  REMON ACADEMY · EST. 2026
                </span>

                <Sparkles className="h-3.5 w-3.5 text-violet-300" />

              </motion.div>

              <motion.h1
                variants={fadeUp}
                className="max-w-4xl font-display text-[3.3rem] font-extrabold leading-[0.99] tracking-[-0.065em] sm:text-6xl lg:text-[5.2rem] xl:text-[6rem]"
              >

                Learn with

                <br />

                <span className="bg-gradient-to-r from-violet-300 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                  clarity.
                </span>

                <br />

                Grow with

                <br className="hidden sm:block" />

                <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-fuchsia-400 bg-clip-text text-transparent">
                  purpose.
                </span>

              </motion.h1>

              <motion.p
                variants={fadeUp}
                className="mt-7 max-w-xl text-sm leading-8 text-slate-400 sm:text-base"
              >
                {brand.name} is a modern learning environment built around
                strong academic foundations, focused guidance, measurable
                progress and meaningful student growth.
              </motion.p>

              <motion.div
                variants={fadeUp}
                className="mt-9 flex flex-col gap-3 sm:flex-row"
              >

                <Link
                  to="/courses"
                  className="group relative inline-flex items-center justify-center gap-3 overflow-hidden rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-7 py-4 text-sm font-bold text-white shadow-[0_0_35px_rgba(124,58,237,0.30)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_50px_rgba(124,58,237,0.48)]"
                >

                  <span className="absolute inset-0 translate-x-[-100%] bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-[100%]" />

                  <span className="relative">
                    Explore Courses
                  </span>

                  <ArrowUpRight className="relative h-4 w-4 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />

                </Link>

                <Link
                  to="/about"
                  className="group inline-flex items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-7 py-4 text-sm font-semibold text-slate-200 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-violet-400/40 hover:bg-violet-500/[0.08] hover:text-white"
                >

                  Discover REMON

                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />

                </Link>

              </motion.div>

              <motion.div
                variants={fadeUp}
                className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-4 text-xs text-slate-400"
              >

                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-violet-400" />
                  Structured Learning
                </div>

                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-blue-400" />
                  Digital Academic Support
                </div>

              </motion.div>

            </motion.div>

            {/* Floating Academic Dashboard */}

            <motion.div
              initial={{ opacity: 0, scale: 0.9, x: 35 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 0.9, delay: 0.2 }}
              className="relative mx-auto w-full max-w-[520px] pt-5 lg:pt-0"
            >

              <div className="absolute left-1/2 top-1/2 h-[390px] w-[390px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/[0.13] blur-[100px] sm:h-[480px] sm:w-[480px]" />

              {/* Main Dashboard */}

              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="relative z-10 overflow-hidden rounded-2xl border border-white/10 bg-[#111122]/90 p-5 shadow-[0_25px_100px_rgba(0,0,0,0.55)] backdrop-blur-2xl sm:p-6"
              >

                <div className="flex items-center justify-between border-b border-white/[0.07] pb-5">

                  <div className="flex items-center gap-3">

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-blue-600 shadow-lg shadow-violet-500/20">
                      <GraduationCap className="h-5 w-5 text-white" />
                    </div>

                    <div>
                      <p className="text-sm font-bold text-white">
                        Student Dashboard
                      </p>
                      <p className="mt-1 text-[9px] text-slate-500">
                        Academic overview
                      </p>
                    </div>

                  </div>

                  <div className="flex items-center gap-1.5 rounded-full border border-emerald-400/15 bg-emerald-400/[0.08] px-3 py-1.5">

                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />

                    <span className="text-[9px] font-semibold text-emerald-300">
                      Active
                    </span>

                  </div>

                </div>

                <div className="mt-5 grid grid-cols-2 gap-3">

                  <div className="rounded-xl border border-violet-400/15 bg-gradient-to-br from-violet-500/[0.13] to-transparent p-4">

                    <div className="flex items-center justify-between">

                      <BookOpen className="h-4 w-4 text-violet-300" />

                      <ArrowUpRight className="h-3 w-3 text-slate-500" />

                    </div>

                    <p className="mt-4 font-display text-2xl font-bold text-white">
                      Courses
                    </p>

                    <p className="mt-1 text-[9px] text-slate-500">
                      Academic programs
                    </p>

                  </div>

                  <div className="rounded-xl border border-blue-400/15 bg-gradient-to-br from-blue-500/[0.13] to-transparent p-4">

                    <div className="flex items-center justify-between">

                      <CalendarCheck className="h-4 w-4 text-blue-300" />

                      <Activity className="h-3 w-3 text-slate-500" />

                    </div>

                    <p className="mt-4 font-display text-2xl font-bold text-white">
                      Attendance
                    </p>

                    <p className="mt-1 text-[9px] text-slate-500">
                      Daily academic record
                    </p>

                  </div>

                </div>

                {/* Progress */}

                <div className="mt-4 rounded-xl border border-white/[0.07] bg-white/[0.025] p-4">

                  <div className="flex items-center justify-between">

                    <div>
                      <p className="text-xs font-semibold text-white">
                        Learning Progress
                      </p>
                      <p className="mt-1 text-[9px] text-slate-500">
                        Keep moving forward
                      </p>
                    </div>

                    <TrendingUp className="h-4 w-4 text-violet-400" />

                  </div>

                  <div className="mt-5 flex h-16 items-end gap-2">

                    {[35, 55, 43, 75, 58, 90, 68, 100, 78, 88, 65, 95].map(
                      (height, index) => (
                        <motion.div
                          key={index}
                          initial={{ height: 0 }}
                          animate={{ height: `${height}%` }}
                          transition={{
                            duration: 0.8,
                            delay: 0.3 + index * 0.04,
                          }}
                          className="flex-1 rounded-t-sm bg-gradient-to-t from-violet-700 to-blue-400 opacity-80"
                        />
                      )
                    )}

                  </div>

                  <div className="mt-2 flex justify-between text-[8px] text-slate-600">
                    <span>START</span>
                    <span>CONSISTENCY</span>
                    <span>GROWTH</span>
                  </div>

                </div>

                {/* Activity List */}

                <div className="mt-4 space-y-3">

                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-white">
                      Academic Activities
                    </p>

                    <span className="text-[9px] text-violet-300">
                      Organized learning
                    </span>
                  </div>

                  {[
                    {
                      icon: BookMarked,
                      title: "Course Learning",
                      subtitle: "Build strong foundations",
                      color: "text-violet-300",
                    },
                    {
                      icon: CalendarCheck,
                      title: "Attendance Tracking",
                      subtitle: "Stay consistent",
                      color: "text-blue-300",
                    },
                    {
                      icon: Trophy,
                      title: "Academic Results",
                      subtitle: "Measure your progress",
                      color: "text-fuchsia-300",
                    },
                  ].map((item) => {
                    const Icon = item.icon;

                    return (
                      <div
                        key={item.title}
                        className="flex items-center gap-3 rounded-lg border border-white/[0.05] bg-white/[0.02] p-3"
                      >

                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/[0.05]">
                          <Icon className={`h-4 w-4 ${item.color}`} />
                        </div>

                        <div>
                          <p className="text-[11px] font-semibold text-slate-200">
                            {item.title}
                          </p>
                          <p className="mt-1 text-[9px] text-slate-500">
                            {item.subtitle}
                          </p>
                        </div>

                        <CheckCircle2 className="ml-auto h-4 w-4 text-emerald-400" />

                      </div>
                    );
                  })}

                </div>

              </motion.div>

              {/* Floating Card */}

              <motion.div
                animate={{ y: [0, 12, 0], rotate: [0, 1, 0] }}
                transition={{ duration: 5, repeat: Infinity }}
                className="absolute -left-3 top-[15%] z-20 hidden rounded-xl border border-violet-400/20 bg-[#17152b]/95 p-4 shadow-[0_15px_50px_rgba(0,0,0,0.5)] backdrop-blur-xl sm:block"
              >

                <div className="flex items-center gap-3">

                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-500/15">
                    <Lightbulb className="h-4 w-4 text-violet-300" />
                  </div>

                  <div>
                    <p className="text-[10px] font-bold text-white">
                      Learn Better
                    </p>
                    <p className="mt-1 text-[8px] text-slate-500">
                      Understand concepts
                    </p>
                  </div>

                </div>

              </motion.div>

              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 5.5, repeat: Infinity }}
                className="absolute -right-3 bottom-[14%] z-20 hidden rounded-xl border border-blue-400/20 bg-[#111a2b]/95 p-4 shadow-[0_15px_50px_rgba(0,0,0,0.5)] backdrop-blur-xl sm:block"
              >

                <div className="flex items-center gap-3">

                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/15">
                    <Star className="h-4 w-4 text-blue-300" />
                  </div>

                  <div>
                    <p className="text-[10px] font-bold text-white">
                      Grow Every Day
                    </p>
                    <p className="mt-1 text-[8px] text-slate-500">
                      Consistency matters
                    </p>
                  </div>

                </div>

              </motion.div>

            </motion.div>

          </div>

        </div>

      </section>

      {/* ============================================================
          QUICK STATS
      ============================================================ */}

      <section className="relative z-20 border-y border-white/[0.07] bg-[#0c0c19]">

        <div className="container-page grid grid-cols-2 md:grid-cols-4">

          <div className="border-b border-white/[0.07] px-4 py-7 md:border-b-0 md:border-r md:border-white/[0.07]">

            <StatCard
              icon={Users}
              label="Students"
              value={stats.totalStudents}
              suffix="+"
            />

          </div>

          <div className="border-b border-white/[0.07] px-4 py-7 md:border-b-0 md:border-r md:border-white/[0.07]">

            <StatCard
              icon={GraduationCap}
              label="Teachers"
              value={stats.totalTeachers}
              suffix="+"
            />

          </div>

          <div className="px-4 py-7 md:border-r md:border-white/[0.07]">

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

      <section className="relative overflow-hidden bg-[#080814] py-20 sm:py-24 lg:py-28">

        <div className="pointer-events-none absolute -right-40 top-0 h-[450px] w-[450px] rounded-full bg-purple-700/[0.08] blur-[130px]" />

        <div className="container-page relative">

          <div className="grid gap-10 lg:grid-cols-[0.5fr_1.5fr]">

            <div>

              <p className="text-[9px] font-bold uppercase tracking-[0.35em] text-violet-400">
                Our Philosophy
              </p>

              <div className="mt-4 h-px w-12 bg-gradient-to-r from-violet-500 to-blue-500" />

              <p className="mt-5 max-w-xs text-xs leading-6 text-slate-500">
                A learning environment designed around understanding,
                consistency and long-term growth.
              </p>

            </div>

            <div>

              <h2 className="max-w-5xl font-display text-2xl font-semibold leading-[1.3] tracking-tight text-white sm:text-3xl lg:text-[2.75rem]">

                Education should do more than prepare students for an
                examination.

                <span className="bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
                  {" "}
                  It should prepare them for what comes after it.
                </span>

              </h2>

              <p className="mt-7 max-w-3xl text-sm leading-7 text-slate-400 sm:text-base sm:leading-8">
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

      <section className="relative overflow-hidden border-y border-white/[0.06] bg-[#0b0b19] py-20 sm:py-24 lg:py-28">

        <div className="pointer-events-none absolute -left-40 bottom-0 h-[400px] w-[400px] rounded-full bg-blue-700/[0.08] blur-[130px]" />

        <div className="container-page relative">

          <div className="flex flex-col justify-between gap-7 lg:flex-row lg:items-end">

            <div>

              <p className="text-[9px] font-bold uppercase tracking-[0.35em] text-violet-400">
                Why REMON
              </p>

              <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">

                A better way
                <br />

                <span className="bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
                  to learn.
                </span>

              </h2>

            </div>

            <p className="max-w-md text-sm leading-7 text-slate-400">
              Every part of REMON ACADEMY is designed to make learning
              more structured, focused and meaningful.
            </p>

          </div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            variants={stagger}
            className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
          >

            {features.map((feature) => {

              const Icon = feature.icon;

              return (
                <motion.div
                  key={feature.number}
                  variants={fadeUp}
                  className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.025] p-7 transition-all duration-500 hover:-translate-y-2 hover:border-violet-400/30 hover:bg-white/[0.045] hover:shadow-[0_20px_60px_rgba(109,40,217,0.12)] sm:p-8"
                >

                  <div className="flex items-start justify-between">

                    <span className="font-display text-4xl font-bold text-white/[0.09] transition-colors group-hover:text-violet-400/30">
                      {feature.number}
                    </span>

                    <div className={`rounded-xl bg-gradient-to-br ${feature.color} p-3 shadow-lg`}>
                      <Icon className="h-5 w-5 text-white" />
                    </div>

                  </div>

                  <h3 className="mt-10 font-display text-xl font-bold text-white">
                    {feature.title}
                  </h3>

                  <p className="mt-4 text-sm leading-7 text-slate-400">
                    {feature.text}
                  </p>

                  <div className="mt-7 h-px w-8 bg-gradient-to-r from-violet-500 to-blue-500 transition-all duration-300 group-hover:w-16" />

                  <div className="pointer-events-none absolute -bottom-20 -right-20 h-40 w-40 rounded-full bg-violet-500/[0.08] blur-[50px] transition-opacity group-hover:opacity-100" />

                </motion.div>
              );

            })}

          </motion.div>

        </div>

      </section>

      {/* ============================================================
          COURSES
      ============================================================ */}

      {courses.length > 0 && (
        <section className="relative overflow-hidden bg-[#080814] py-20 sm:py-24 lg:py-28">

          <div className="pointer-events-none absolute right-[-150px] top-[10%] h-[500px] w-[500px] rounded-full bg-blue-700/[0.09] blur-[140px]" />

          <div className="container-page relative">

            <div className="flex flex-col justify-between gap-7 lg:flex-row lg:items-end">

              <div>

                <p className="text-[9px] font-bold uppercase tracking-[0.35em] text-violet-400">
                  Academic Programs
                </p>

                <h2 className="mt-4 font-display text-3xl font-bold text-white sm:text-4xl lg:text-5xl">

                  Programs built
                  <br />

                  <span className="bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
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
                  className="group mt-5 inline-flex items-center gap-2 text-sm font-bold text-violet-300 transition-colors hover:text-blue-300"
                >
                  View all courses

                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
                </Link>

              </div>

            </div>

            <div className="mt-12 grid gap-5 md:grid-cols-3">

              {courses.map((course, index) => (

                <Card
                  key={course._id}
                  className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-[#111122]/80 p-0 text-white shadow-[0_18px_45px_rgba(0,0,0,0.20)] backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:border-violet-400/35 hover:shadow-[0_25px_70px_rgba(109,40,217,0.16)]"
                >

                  <div className="relative overflow-hidden border-b border-white/[0.07] p-6">

                    <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-violet-500/[0.10] blur-3xl transition-all group-hover:bg-violet-500/[0.20]" />

                    <div className="relative flex items-start justify-between">

                      <span className="font-display text-5xl font-bold text-white/[0.07]">
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      <div className="rounded-xl border border-violet-400/20 bg-violet-500/10 p-3">
                        <BookOpen className="h-5 w-5 text-violet-300" />
                      </div>

                    </div>

                    <div className="relative mt-8">

                      <p className="text-[8px] font-bold uppercase tracking-[0.22em] text-violet-300">
                        {course.classLevel}
                      </p>

                      <h3 className="mt-2 font-display text-xl font-bold text-white">
                        {course.title}
                      </h3>

                      <p className="mt-1 text-xs text-slate-500">
                        {course.subject}
                      </p>

                    </div>

                    <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-violet-500 to-blue-500 transition-all duration-500 group-hover:w-full" />

                  </div>

                  <div className="flex flex-1 flex-col p-6">

                    <p className="line-clamp-3 text-sm leading-7 text-slate-400">
                      {course.description}
                    </p>

                    <div className="mt-auto flex items-end justify-between gap-4 border-t border-white/[0.07] pt-6">

                      <div>

                        <p className="text-[8px] font-bold uppercase tracking-wider text-slate-500">
                          Course Fee
                        </p>

                        <p className="mt-1 text-xl font-bold text-violet-300">
                          ৳{course.fee}
                        </p>

                      </div>

                      <Link
                        to={`/courses/${course.slug}`}
                        className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.035] px-4 py-2.5 text-xs font-bold text-slate-200 transition-all hover:border-violet-400/40 hover:bg-violet-500/10 hover:text-white"
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

      <section className="relative overflow-hidden border-y border-white/[0.06] bg-[#0c0c1b] py-20 sm:py-24 lg:py-28">

        <div className="pointer-events-none absolute -left-40 top-1/3 h-[450px] w-[450px] rounded-full bg-purple-700/[0.08] blur-[130px]" />

        <div className="container-page relative">

          <div className="grid items-center gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">

            <div>

              <div className="flex items-center gap-3">

                <Layers3 className="h-5 w-5 text-violet-400" />

                <span className="text-[9px] font-bold uppercase tracking-[0.35em] text-violet-400">
                  One Learning Ecosystem
                </span>

              </div>

              <h2 className="mt-5 font-display text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">

                Everything students
                <br />

                need to stay
                <br />

                <span className="bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
                  on track.
                </span>

              </h2>

              <p className="mt-6 max-w-lg text-sm leading-7 text-slate-400 sm:text-base">
                REMON connects important academic information in one
                organized digital environment so students can focus more
                on learning and less on searching for information.
              </p>

              <Link
                to="/about"
                className="group mt-7 inline-flex items-center gap-2 text-sm font-bold text-violet-300 transition-colors hover:text-blue-300"
              >
                Learn about our approach

                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>

            </div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={stagger}
              className="grid gap-3 sm:grid-cols-2"
            >

              {learningPoints.map((item, index) => (

                <motion.div
                  key={item}
                  variants={fadeUp}
                  className="group rounded-xl border border-white/[0.07] bg-white/[0.025] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-violet-400/30 hover:bg-violet-500/[0.05]"
                >

                  <div className="flex items-center justify-between">

                    <span className="font-display text-2xl font-bold text-white/[0.12]">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <CheckCircle2 className="h-5 w-5 text-violet-400 transition-transform group-hover:scale-110" />

                  </div>

                  <p className="mt-8 text-sm font-semibold text-slate-200">
                    {item}
                  </p>

                </motion.div>

              ))}

            </motion.div>

          </div>

        </div>

      </section>

      {/* ============================================================
          TEACHERS
      ============================================================ */}

      {teachers.length > 0 && (
        <section className="relative overflow-hidden bg-[#080814] py-20 sm:py-24 lg:py-28">

          <div className="pointer-events-none absolute -right-40 bottom-0 h-[450px] w-[450px] rounded-full bg-blue-700/[0.08] blur-[130px]" />

          <div className="container-page relative">

            <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">

              <div>

                <p className="text-[9px] font-bold uppercase tracking-[0.35em] text-violet-400">
                  Faculty
                </p>

                <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">

                  Guided by
                  <br />

                  <span className="bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
                    dedicated educators.
                  </span>

                </h2>

              </div>

              <Link
                to="/teachers"
                className="group inline-flex items-center gap-2 text-sm font-bold text-violet-300 transition-colors hover:text-blue-300"
              >
                Meet all teachers

                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
              </Link>

            </div>

            <div className="mt-12 grid gap-5 md:grid-cols-3">

              {teachers.map((teacher, index) => (

                <Card
                  key={teacher._id}
                  className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#111122]/80 p-0 shadow-sm backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:border-violet-400/30 hover:shadow-[0_22px_55px_rgba(109,40,217,0.13)]"
                >

                  <div className="flex items-center justify-between border-b border-white/[0.07] px-5 py-4">

                    <span className="text-[8px] font-bold uppercase tracking-[0.25em] text-violet-300">
                      Faculty {String(index + 1).padStart(2, "0")}
                    </span>

                    <GraduationCap className="h-4 w-4 text-blue-300" />

                  </div>

                  <div className="flex gap-5 p-5 sm:p-6">

                    <div className="h-24 w-24 shrink-0 overflow-hidden rounded-2xl border border-violet-400/20 bg-[#17152b] shadow-[0_0_25px_rgba(139,92,246,0.12)]">

                      {teacher.photo ? (
                        <img
                          src={teacher.photo}
                          alt={teacher.name}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-violet-600 to-blue-600 text-2xl font-bold text-white">
                          {teacher.name.charAt(0)}
                        </div>
                      )}

                    </div>

                    <div className="min-w-0 pt-1">

                      <h3 className="font-display text-lg font-bold text-white">
                        {teacher.name}
                      </h3>

                      <p className="mt-1 text-[9px] font-bold uppercase tracking-wider text-violet-300">
                        {teacher.designation || "Instructor"}
                      </p>

                      {teacher.specialization && (
                        <p className="mt-3 text-xs leading-5 text-slate-400">
                          {teacher.specialization}
                        </p>
                      )}

                    </div>

                  </div>

                  <div className="h-0.5 w-0 bg-gradient-to-r from-violet-500 to-blue-500 transition-all duration-500 group-hover:w-full" />

                </Card>

              ))}

            </div>

          </div>

        </section>
      )}

      {/* ============================================================
          FOUNDER MESSAGE
      ============================================================ */}

      <section className="relative overflow-hidden border-y border-white/[0.07] bg-[#101020]">

        <div className="pointer-events-none absolute -left-40 top-0 h-[450px] w-[450px] rounded-full bg-violet-700/[0.10] blur-[130px]" />

        <div className="pointer-events-none absolute -right-40 bottom-0 h-[450px] w-[450px] rounded-full bg-blue-700/[0.08] blur-[130px]" />

        <div className="container-page relative py-20 sm:py-24 lg:py-28">

          <div className="grid gap-10 lg:grid-cols-[0.5fr_1.5fr] lg:items-center">

            <div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-violet-400/25 bg-violet-500/[0.08]">

                <Quote className="h-5 w-5 text-violet-300" />

              </div>

              <p className="mt-5 text-[8px] font-bold uppercase tracking-[0.3em] text-violet-300">
                Founder&apos;s Philosophy
              </p>

            </div>

            <div>

              <blockquote className="max-w-5xl font-display text-2xl font-semibold leading-[1.35] tracking-tight text-white sm:text-3xl lg:text-[2.7rem]">

                “Every student has potential. Our responsibility is to
                create the environment, guidance and discipline that helps
                that potential become real.”

              </blockquote>

              <div className="mt-7 flex items-center gap-3">

                <span className="h-px w-8 bg-gradient-to-r from-violet-500 to-blue-500" />

                <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-slate-400">
                  Emon Islam · Founder & CEO
                </span>

              </div>

              <Link
                to="/founder"
                className="group mt-8 inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.035] px-5 py-3 text-xs font-bold text-slate-200 transition-all hover:border-violet-400/40 hover:bg-violet-500/[0.08] hover:text-white"
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
        <section className="relative overflow-hidden bg-[#080814] py-20 sm:py-24 lg:py-28">

          <div className="pointer-events-none absolute -right-40 top-0 h-[450px] w-[450px] rounded-full bg-purple-700/[0.08] blur-[130px]" />

          <div className="container-page relative">

            <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">

              <div>

                <p className="text-[9px] font-bold uppercase tracking-[0.35em] text-violet-400">
                  Academy Journal
                </p>

                <h2 className="mt-4 font-display text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
                  Stay informed.
                </h2>

              </div>

              <Link
                to="/notices"
                className="group inline-flex items-center gap-2 text-sm font-bold text-violet-300 transition-colors hover:text-blue-300"
              >
                View all notices

                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
              </Link>

            </div>

            <div className="mt-12 grid gap-5 md:grid-cols-3">

              {notices.map((notice, index) => (

                <Link
                  key={notice._id}
                  to={`/notices/${notice.slug}`}
                  className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#111122]/80 p-6 shadow-sm backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:border-violet-400/30 hover:shadow-[0_22px_55px_rgba(109,40,217,0.13)]"
                >

                  <div className="flex items-start justify-between">

                    <span className="font-display text-4xl font-bold text-white/[0.08]">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <ArrowUpRight className="h-5 w-5 text-slate-500 transition-all group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-violet-300" />

                  </div>

                  <div className="mt-8">

                    <div className="mb-3 flex items-center gap-2">

                      <ShieldCheck className="h-3.5 w-3.5 text-violet-400" />

                      <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-violet-300">
                        {notice.category}
                      </span>

                    </div>

                    <h3 className="font-display text-lg font-bold text-white transition-colors group-hover:text-violet-300">
                      {notice.title}
                    </h3>

                    <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-400">
                      {notice.description}
                    </p>

                  </div>

                  <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-violet-500 to-blue-500 transition-all duration-500 group-hover:w-full" />

                </Link>

              ))}

            </div>

          </div>

        </section>
      )}

      {/* ============================================================
          FINAL CTA
      ============================================================ */}

      <section className="relative overflow-hidden bg-[#080814] py-20 text-white sm:py-24 lg:py-28">

        <div className="pointer-events-none absolute inset-0">

          <div className="absolute left-1/2 top-1/2 h-[500px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-700/[0.13] blur-[140px]" />

          <div className="absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-violet-500/30 to-transparent" />

        </div>

        <div className="container-page relative">

          <div className="relative overflow-hidden rounded-3xl border border-violet-400/20 bg-gradient-to-br from-[#17142c] via-[#111225] to-[#101c34] px-6 py-14 text-center shadow-[0_25px_100px_rgba(0,0,0,0.4)] sm:px-12 lg:px-20 lg:py-20">

            <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full border border-violet-400/[0.12]" />

            <div className="pointer-events-none absolute -right-5 -top-12 h-44 w-44 rounded-full border border-blue-400/[0.10]" />

            <div className="pointer-events-none absolute -bottom-32 -left-24 h-72 w-72 rounded-full bg-blue-600/[0.10] blur-[80px]" />

            <div className="relative">

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-violet-400/25 bg-violet-500/10 shadow-[0_0_35px_rgba(139,92,246,0.15)]">

                <Award className="h-7 w-7 text-violet-300" />

              </div>

              <p className="mt-5 text-[9px] font-bold uppercase tracking-[0.35em] text-violet-300">
                Begin Your Journey
              </p>

              <h2 className="mx-auto mt-4 max-w-3xl font-display text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">

                A stronger foundation.
                <br />

                <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                  A clearer future.
                </span>

              </h2>

              <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-slate-400">

                Start your academic journey with structured courses,
                dedicated teachers and a modern learning environment
                built around student growth.

              </p>

              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">

                <Link
                  to="/register"
                  className="group inline-flex items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-7 py-4 text-sm font-bold text-white shadow-[0_0_30px_rgba(124,58,237,0.25)] transition-all hover:-translate-y-1 hover:shadow-[0_0_45px_rgba(124,58,237,0.4)]"
                >
                  Join REMON ACADEMY

                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />

                </Link>

                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/[0.035] px-7 py-4 text-sm font-semibold text-white transition-all hover:border-violet-400/40 hover:bg-violet-500/[0.08]"
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