import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Award,
  BookOpen,
  CheckCircle2,
  Code2,
  GraduationCap,
  Layers3,
  Quote,
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
      number: "01",
      icon: GraduationCap,
      title: "Strong Foundations",
      text: "We focus on concepts first, helping students build knowledge that stays useful beyond the classroom.",
    },
    {
      number: "02",
      icon: Target,
      title: "Focused Progress",
      text: "Regular assessments and academic tracking keep students aware of their strengths and improvement areas.",
    },
    {
      number: "03",
      icon: Layers3,
      title: "One Learning Ecosystem",
      text: "Courses, results, attendance, fees and notices are organized through one connected digital platform.",
    },
  ];

  return (
    <main className="overflow-hidden bg-[#f5f3ee] text-[#111827] dark:bg-[#080c14] dark:text-white">

      {/* ============================================================
          HERO — NEW EDITORIAL LAYOUT
      ============================================================ */}

      <section className="relative overflow-hidden bg-[#101722] text-white">

        <div className="pointer-events-none absolute inset-0">
          <div className="absolute right-[-180px] top-[-180px] h-[520px] w-[520px] rounded-full border border-brand-gold/[0.08]" />

          <div className="absolute right-[-110px] top-[-110px] h-[380px] w-[380px] rounded-full border border-brand-gold/[0.05]" />

          <div className="absolute bottom-[-280px] left-[-180px] h-[500px] w-[500px] rounded-full border border-white/[0.035]" />

          <div className="absolute inset-0 opacity-[0.018] [background-image:linear-gradient(rgba(255,255,255,.8)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.8)_1px,transparent_1px)] [background-size:80px_80px]" />
        </div>

        <div className="container-page relative">

          <div className="grid min-h-[680px] items-center gap-12 py-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-8 lg:py-16">

            {/* LEFT */}

            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65 }}
              className="relative z-10"
            >

              <div className="mb-7 flex items-center gap-3">

                <span className="h-px w-12 bg-brand-gold" />

                <span className="text-[9px] font-bold uppercase tracking-[0.34em] text-brand-gold">
                  REMON ACADEMY · EST. 2026
                </span>

              </div>

              <h1 className="max-w-4xl font-display text-[3.15rem] font-bold leading-[0.94] tracking-[-0.055em] sm:text-6xl lg:text-[6rem]">

                Education
                <br />

                <span className="text-white/30">
                  with
                </span>{" "}

                <span className="text-brand-gold">
                  purpose.
                </span>

              </h1>

              <p className="mt-7 max-w-xl text-sm leading-7 text-slate-300 sm:text-base sm:leading-8">
                {brand.name} combines focused teaching, measurable academic
                progress and modern technology to create a better learning
                experience for every student.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">

                <Link
                  to="/courses"
                  className="group inline-flex items-center justify-center gap-3 bg-brand-gold px-6 py-3.5 text-sm font-bold text-[#101722] transition-all duration-300 hover:bg-brand-goldLight"
                >
                  Explore Courses

                  <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                </Link>

                <Link
                  to="/about"
                  className="inline-flex items-center justify-center gap-3 border border-white/15 px-6 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:border-brand-gold hover:text-brand-gold"
                >
                  Discover REMON
                </Link>

              </div>

              <div className="mt-10 grid max-w-xl grid-cols-3 border-y border-white/10">

                <div className="py-5 pr-3">
                  <p className="font-display text-xl font-bold text-white sm:text-2xl">
                    {stats.totalStudents}+
                  </p>

                  <p className="mt-1 text-[8px] font-bold uppercase tracking-[0.15em] text-slate-500 sm:text-[9px]">
                    Students
                  </p>
                </div>

                <div className="border-x border-white/10 px-3 py-5">
                  <p className="font-display text-xl font-bold text-white sm:text-2xl">
                    {stats.totalTeachers}+
                  </p>

                  <p className="mt-1 text-[8px] font-bold uppercase tracking-[0.15em] text-slate-500 sm:text-[9px]">
                    Teachers
                  </p>
                </div>

                <div className="py-5 pl-3">
                  <p className="font-display text-xl font-bold text-white sm:text-2xl">
                    {stats.totalCourses}+
                  </p>

                  <p className="mt-1 text-[8px] font-bold uppercase tracking-[0.15em] text-slate-500 sm:text-[9px]">
                    Programs
                  </p>
                </div>

              </div>

            </motion.div>

            {/* RIGHT — PHOTO */}

            <motion.div
              initial={{ opacity: 0, x: 35 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.75, delay: 0.1 }}
              className="relative flex justify-center lg:justify-end"
            >

              <div className="relative w-full max-w-[390px]">

                <div className="absolute -left-5 top-8 z-20 hidden h-20 w-20 border-l border-t border-brand-gold/50 sm:block" />

                <div className="absolute -bottom-5 right-5 z-20 hidden h-20 w-20 border-b border-r border-brand-gold/50 sm:block" />

                <div className="absolute -right-5 top-1/2 hidden -translate-y-1/2 rotate-90 lg:block">
                  <span className="text-[8px] font-bold uppercase tracking-[0.35em] text-white/25">
                    FOUNDER · EDUCATOR · DEVELOPER
                  </span>
                </div>

                <div className="relative mx-auto w-[76%] sm:w-[72%] lg:w-[82%]">

                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 font-display text-[8rem] font-bold leading-none text-white/[0.025]">
                    R
                  </div>

                  <div className="border border-brand-gold/30 bg-white/[0.025] p-1.5">

                    <div className="relative overflow-hidden bg-[#0a1019]">

                      <img
                        src="/photo/emon.png"
                        alt="Emon Islam"
                        className="h-[390px] w-full object-cover object-top sm:h-[470px] lg:h-[510px]"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-[#101722] via-transparent to-transparent" />

                      <div className="absolute left-4 top-4 border border-white/10 bg-[#101722]/90 px-3 py-2">

                        <p className="text-[8px] font-bold uppercase tracking-[0.25em] text-brand-gold">
                          Founder
                        </p>

                      </div>

                      <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4">

                        <div className="border border-white/10 bg-[#101722]/95 p-4">

                          <p className="text-[8px] font-bold uppercase tracking-[0.25em] text-brand-gold">
                            Emon Islam
                          </p>

                          <h2 className="mt-1 font-display text-xl font-bold sm:text-2xl">
                            Founder & CEO
                          </h2>

                          <p className="mt-1 text-[10px] text-slate-400 sm:text-xs">
                            B.Sc. in CSE · Developer · Educator
                          </p>

                        </div>

                      </div>

                      <div className="absolute bottom-0 left-0 h-1 w-full bg-brand-gold" />

                    </div>

                  </div>

                </div>

              </div>

            </motion.div>

          </div>
        </div>
      </section>

      {/* ============================================================
          INTRO / STATEMENT
      ============================================================ */}

      <section className="bg-[#f5f3ee] py-20 dark:bg-[#080c14] sm:py-24 lg:py-28">

        <div className="container-page">

          <div className="grid gap-10 lg:grid-cols-[0.55fr_1.45fr] lg:items-start">

            <div>

              <p className="text-[9px] font-bold uppercase tracking-[0.35em] text-brand-gold">
                Our Philosophy
              </p>

              <div className="mt-4 h-px w-10 bg-brand-gold" />

            </div>

            <div>

              <h2 className="max-w-5xl font-display text-2xl font-semibold leading-[1.3] tracking-tight text-[#111827] dark:text-white sm:text-3xl lg:text-[2.7rem]">
                We believe education should not simply prepare students
                for an exam. It should prepare them for the opportunities
                waiting beyond it.
              </h2>

              <p className="mt-7 max-w-3xl text-sm leading-7 text-slate-500 sm:text-base sm:leading-8">
                That is why REMON ACADEMY focuses on understanding,
                consistency and direction — creating an environment where
                students can learn with confidence and grow with purpose.
              </p>

            </div>

          </div>

        </div>
      </section>

      {/* ============================================================
          STATS STRIP
      ============================================================ */}

      <section className="border-y border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">

        <div className="container-page grid grid-cols-2 md:grid-cols-4">

          <div className="border-b border-slate-200 px-4 py-7 dark:border-slate-800 md:border-b-0 md:border-r">
            <StatCard
              icon={Users}
              label="Total Students"
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
          WHY REMON — NEW NUMBERED LAYOUT
      ============================================================ */}

      <section className="bg-white py-20 dark:bg-slate-900 sm:py-24 lg:py-28">

        <div className="container-page">

          <div className="flex flex-col justify-between gap-7 lg:flex-row lg:items-end">

            <div className="max-w-2xl">

              <p className="text-[9px] font-bold uppercase tracking-[0.35em] text-brand-gold">
                Why REMON
              </p>

              <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-[#111827] dark:text-white sm:text-4xl lg:text-5xl">
                A different standard
                <br />
                <span className="text-slate-300 dark:text-slate-700">
                  for modern learning.
                </span>
              </h2>

            </div>

            <p className="max-w-md text-sm leading-7 text-slate-500">
              Every part of the academy is designed to make learning
              clearer, more organized and more meaningful.
            </p>

          </div>

          <div className="mt-14 grid gap-px overflow-hidden border border-slate-200 bg-slate-200 dark:border-slate-800 dark:bg-slate-800 md:grid-cols-3">

            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <div
                  key={feature.number}
                  className="group relative bg-[#faf9f6] p-7 transition-colors duration-300 hover:bg-white dark:bg-slate-950 dark:hover:bg-slate-900 sm:p-9"
                >

                  <div className="flex items-start justify-between">

                    <span className="font-display text-4xl font-bold text-slate-200 transition-colors group-hover:text-brand-gold/20 dark:text-slate-800">
                      {feature.number}
                    </span>

                    <Icon className="h-6 w-6 text-brand-gold" />

                  </div>

                  <h3 className="mt-12 font-display text-xl font-bold text-[#111827] dark:text-white">
                    {feature.title}
                  </h3>

                  <p className="mt-4 text-sm leading-7 text-slate-500">
                    {feature.text}
                  </p>

                  <div className="mt-8 h-px w-8 bg-brand-gold transition-all duration-300 group-hover:w-16" />

                </div>
              );
            })}

          </div>

        </div>
      </section>

      {/* ============================================================
          COURSES — NEW CATALOG STYLE
      ============================================================ */}

      {courses.length > 0 && (
        <section className="bg-[#101722] py-20 text-white sm:py-24 lg:py-28">

          <div className="container-page">

            <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">

              <div>

                <p className="text-[9px] font-bold uppercase tracking-[0.35em] text-brand-gold">
                  Academic Programs
                </p>

                <h2 className="mt-4 font-display text-3xl font-bold sm:text-4xl">
                  Learn something
                  <br />
                  worth knowing.
                </h2>

              </div>

              <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">

                <p className="max-w-lg text-sm leading-7 text-slate-400">
                  Carefully structured courses designed around academic
                  fundamentals, practice and measurable improvement.
                </p>

                <Link
                  to="/courses"
                  className="group inline-flex shrink-0 items-center gap-2 text-sm font-bold text-brand-gold"
                >
                  All Courses
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                </Link>

              </div>

            </div>

            <div className="mt-12 grid gap-4 md:grid-cols-3">

              {courses.map((course, index) => (
                <Card
                  key={course._id}
                  className="group relative flex h-full flex-col overflow-hidden border border-white/10 bg-white/[0.025] p-0 text-white transition-all duration-300 hover:border-brand-gold/40 hover:bg-white/[0.045]"
                >

                  <div className="relative flex h-48 flex-col justify-between border-b border-white/10 p-6">

                    <div className="flex items-start justify-between">

                      <span className="font-display text-5xl font-bold text-white/[0.07]">
                        0{index + 1}
                      </span>

                      <BookOpen className="h-5 w-5 text-brand-gold" />

                    </div>

                    <div>

                      <p className="text-[8px] font-bold uppercase tracking-[0.22em] text-brand-gold">
                        {course.classLevel}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        {course.subject}
                      </p>

                    </div>

                    <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-brand-gold transition-all duration-500 group-hover:w-full" />

                  </div>

                  <div className="flex flex-1 flex-col p-6">

                    <h3 className="font-display text-xl font-bold">
                      {course.title}
                    </h3>

                    <p className="mt-3 line-clamp-3 text-sm leading-7 text-slate-400">
                      {course.description}
                    </p>

                    <div className="mt-auto flex items-end justify-between gap-4 border-t border-white/10 pt-6">

                      <div>

                        <p className="text-[8px] font-bold uppercase tracking-wider text-slate-500">
                          Investment
                        </p>

                        <p className="mt-1 text-xl font-bold text-brand-gold">
                          ৳{course.fee}
                        </p>

                      </div>

                      <Link
                        to={`/courses/${course.slug}`}
                        className="inline-flex items-center gap-2 border border-white/15 px-4 py-2.5 text-xs font-bold transition-colors hover:border-brand-gold hover:bg-brand-gold hover:text-[#101722]"
                      >
                        View Course
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
          FOUNDER / TECHNOLOGY
      ============================================================ */}

      <section className="bg-[#f5f3ee] py-20 dark:bg-[#080c14] sm:py-24 lg:py-28">

        <div className="container-page">

          <div className="grid items-center gap-12 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">

            <div className="relative mx-auto w-full max-w-[360px]">

              <div className="absolute -left-5 -top-5 h-16 w-16 border-l border-t border-brand-gold/60" />

              <div className="border border-slate-300 bg-white p-2 dark:border-slate-700 dark:bg-slate-900">

                <div className="relative h-[390px] overflow-hidden bg-[#101722]">

                  <img
                    src="/photo/emon.png"
                    alt="Emon Islam"
                    className="h-full w-full object-cover object-top"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-[#101722] via-transparent to-transparent" />

                  <div className="absolute bottom-5 left-5">

                    <p className="text-[8px] font-bold uppercase tracking-[0.3em] text-brand-gold">
                      Founder & CEO
                    </p>

                    <h3 className="mt-1 font-display text-2xl font-bold text-white">
                      Emon Islam
                    </h3>

                  </div>

                </div>

              </div>

              <div className="absolute -bottom-5 -right-5 h-16 w-16 border-b border-r border-brand-gold/60" />

            </div>

            <div>

              <div className="flex items-center gap-3">

                <Code2 className="h-5 w-5 text-brand-gold" />

                <span className="text-[9px] font-bold uppercase tracking-[0.35em] text-brand-gold">
                  Education × Technology
                </span>

              </div>

              <h2 className="mt-5 max-w-3xl font-display text-3xl font-bold leading-tight text-[#111827] dark:text-white sm:text-4xl lg:text-5xl">
                The classroom is changing.
                <br />
                We are changing with it.
              </h2>

              <p className="mt-6 max-w-2xl text-sm leading-7 text-slate-500 sm:text-base sm:leading-8">
                REMON ACADEMY uses technology not as decoration, but as
                infrastructure — making academic information easier to
                access, manage and understand.
              </p>

              <div className="mt-8 grid gap-3 sm:grid-cols-2">

                {[
                  "Digital Student Portal",
                  "Academic Performance Tracking",
                  "Organized Attendance",
                  "Transparent Fee Management",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 border border-slate-200 bg-white px-4 py-3.5 text-xs font-medium text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
                  >
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-brand-gold" />
                    {item}
                  </div>
                ))}

              </div>

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

                <h2 className="mt-4 font-display text-3xl font-bold tracking-tight sm:text-4xl">
                  People behind
                  <br />
                  the learning.
                </h2>

              </div>

              <Link
                to="/teachers"
                className="group inline-flex items-center gap-2 text-sm font-bold text-[#111827] dark:text-brand-gold"
              >
                Meet all teachers
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
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
          FOUNDER MESSAGE
      ============================================================ */}

      <section className="border-y border-slate-200 bg-[#f5f3ee] dark:border-slate-800 dark:bg-[#080c14]">

        <div className="container-page py-20 sm:py-24">

          <div className="grid gap-8 lg:grid-cols-[0.35fr_1.65fr]">

            <div>

              <div className="flex h-11 w-11 items-center justify-center border border-brand-gold/30">
                <Quote className="h-5 w-5 text-brand-gold" />
              </div>

              <p className="mt-4 text-[8px] font-bold uppercase tracking-[0.3em] text-brand-gold">
                Founder&apos;s Note
              </p>

            </div>

            <div>

              <blockquote className="font-display text-2xl font-semibold leading-[1.35] tracking-tight text-[#111827] dark:text-white sm:text-3xl lg:text-[2.65rem]">
                “Every student has potential. Our responsibility is to
                create the environment, guidance and discipline that
                helps that potential become real.”
              </blockquote>

              <div className="mt-7 flex items-center gap-3">

                <span className="h-px w-8 bg-brand-gold" />

                <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-slate-500">
                  Emon Islam · Founder & CEO
                </span>

              </div>

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

                <h2 className="mt-4 font-display text-3xl font-bold sm:text-4xl">
                  Latest updates.
                </h2>

              </div>

              <Link
                to="/notices"
                className="group inline-flex items-center gap-2 text-sm font-bold text-[#111827] dark:text-brand-gold"
              >
                Browse all notices
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </Link>

            </div>

            <div className="mt-12 grid gap-0 border-y border-slate-200 dark:border-slate-800">

              {notices.map((notice, index) => (
                <Link
                  key={notice._id}
                  to={`/notices/${notice.slug}`}
                  className="group grid gap-4 border-b border-slate-200 py-6 transition-colors last:border-b-0 hover:bg-[#faf9f6] dark:border-slate-800 dark:hover:bg-slate-950 sm:grid-cols-[80px_1fr_auto] sm:items-center sm:gap-6 sm:px-4"
                >

                  <span className="font-display text-3xl font-bold text-slate-200 dark:text-slate-800">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <div>

                    <div className="mb-2 flex items-center gap-3">

                      <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-brand-gold">
                        {notice.category}
                      </span>

                      <ShieldCheck className="h-3.5 w-3.5 text-slate-300" />

                    </div>

                    <h3 className="font-display text-lg font-bold text-[#111827] transition-colors group-hover:text-brand-gold dark:text-white">
                      {notice.title}
                    </h3>

                    <p className="mt-2 line-clamp-1 text-sm text-slate-500">
                      {notice.description}
                    </p>

                  </div>

                  <ArrowUpRight className="hidden h-5 w-5 text-slate-300 transition-all group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-brand-gold sm:block" />

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
                Your future deserves
                <br />
                a strong beginning.
              </h2>

              <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-slate-400">
                Start learning with structured courses, dedicated
                teachers and a modern academic environment built around
                student success.
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


