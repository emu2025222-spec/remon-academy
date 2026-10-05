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
      title: "Academic Excellence",
      desc: "Concept-focused teaching designed to build strong fundamentals and long-term academic confidence.",
    },
    {
      number: "02",
      icon: Target,
      title: "Measured Progress",
      desc: "Regular assessment and performance tracking help students understand exactly where they need to improve.",
    },
    {
      number: "03",
      icon: Layers3,
      title: "Complete Ecosystem",
      desc: "Courses, attendance, results, fees and important notices stay organized inside one modern platform.",
    },
  ];

  return (
    <div className="overflow-hidden bg-[#f7f5f0] text-slate-900 dark:bg-slate-950 dark:text-white">

      {/* =========================================================
          HERO
      ========================================================= */}
      <section className="relative overflow-hidden bg-[#111827] text-white">

        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 opacity-[0.025] [background-image:linear-gradient(rgba(255,255,255,.8)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.8)_1px,transparent_1px)] [background-size:70px_70px]" />

          <div className="absolute right-[-180px] top-[-180px] h-[500px] w-[500px] rounded-full border border-brand-gold/10" />

          <div className="absolute bottom-[-220px] left-[-180px] h-[500px] w-[500px] rounded-full border border-white/[0.04]" />
        </div>

        <div className="container-page relative">

          {/* =====================================================
              MOBILE / UNIVERSAL PHOTO FIRST
          ===================================================== */}
          <div className="relative flex flex-col lg:grid lg:min-h-[720px] lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:gap-16">

            {/* PHOTO */}
            <motion.div
              initial={{ opacity: 0, x: 50, scale: 0.97 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{
                duration: 0.7,
                ease: "easeOut",
              }}
              className="relative order-1 flex justify-center pt-8 sm:pt-10 lg:order-2 lg:pt-16"
            >
              <div className="relative w-full max-w-[520px]">

                {/* top label */}
                <div className="mb-4 flex items-center justify-between lg:hidden">
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-brand-gold" />

                    <span className="text-[9px] font-bold uppercase tracking-[0.28em] text-brand-gold">
                      REMON ACADEMY
                    </span>
                  </div>

                  <span className="text-[9px] uppercase tracking-[0.2em] text-white/35">
                    EST. 2026
                  </span>
                </div>

                {/* photo frame */}
                <div className="relative mx-auto w-[92%] sm:w-[82%] lg:w-[86%]">

                  {/* decorative number */}
                  <div className="absolute -left-8 -top-7 hidden font-display text-[7rem] font-bold leading-none text-white/[0.035] sm:block">
                    01
                  </div>

                  <div className="border border-brand-gold/30 bg-white/[0.02] p-1.5 sm:p-2">

                    <div className="relative overflow-hidden bg-[#0b1220]">

                      <img
                        src="/photo/emon.png"
                        alt="Emon Islam"
                        className="h-[430px] w-full object-cover object-top sm:h-[540px] lg:h-[590px]"
                      />

                      {/* image gradient */}
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#111827] via-transparent to-transparent" />

                      {/* bottom line */}
                      <div className="absolute bottom-0 left-0 h-1 w-full bg-brand-gold" />

                      {/* photo label */}
                      <div className="absolute left-4 top-4 border border-white/10 bg-[#111827]/80 px-3 py-2 sm:left-5 sm:top-5">
                        <p className="text-[8px] font-bold uppercase tracking-[0.25em] text-brand-gold">
                          Founder
                        </p>
                      </div>

                      {/* mobile name overlay */}
                      <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.45, duration: 0.45 }}
                        className="absolute bottom-0 left-0 right-0 p-4 sm:p-6"
                      >
                        <div className="border border-white/10 bg-[#111827]/95 p-4 sm:p-5">

                          <p className="text-[8px] font-bold uppercase tracking-[0.28em] text-brand-gold">
                            Founder & CEO
                          </p>

                          <h2 className="mt-1 font-display text-2xl font-bold sm:text-3xl">
                            Emon Islam
                          </h2>

                          <p className="mt-1 text-[11px] text-slate-400 sm:text-xs">
                            B.Sc. in CSE · Developer · Educator
                          </p>

                        </div>
                      </motion.div>
                    </div>
                  </div>

                  {/* side label */}
                  <div className="absolute -right-7 bottom-10 hidden border-l border-brand-gold pl-3 lg:block">
                    <p className="text-[8px] font-bold uppercase tracking-[0.3em] text-brand-gold">
                      Education
                    </p>

                    <p className="mt-1 text-[9px] uppercase tracking-[0.2em] text-white/35">
                      Technology · Future
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* =================================================
                INFORMATION
            ================================================= */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.65,
                delay: 0.25,
                ease: "easeOut",
              }}
              className="relative order-2 py-12 sm:py-14 lg:order-1 lg:py-20"
            >

              {/* desktop top line */}
              <div className="mb-6 hidden items-center gap-3 lg:flex">
                <span className="h-px w-10 bg-brand-gold" />

                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-gold">
                  A Better Way To Learn
                </span>
              </div>

              <div className="lg:hidden">
                <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-brand-gold">
                  Meet The Founder
                </p>
              </div>

              <h1 className="mt-3 max-w-2xl font-display text-[2.7rem] font-bold leading-[0.98] tracking-[-0.04em] sm:text-5xl lg:mt-0 lg:text-[5rem]">
                {brand.tagline}
              </h1>

              <div className="mt-6 h-px w-14 bg-brand-gold" />

              <p className="mt-6 max-w-xl text-sm leading-7 text-slate-300 sm:text-base sm:leading-8">
                {brand.name} is built around one simple idea — students
                deserve better teaching, clearer direction and a learning
                environment that prepares them for what comes next.
              </p>

              {/* Emon information */}
              <div className="mt-8 border-l-2 border-brand-gold/70 pl-5">

                <p className="text-[9px] font-bold uppercase tracking-[0.28em] text-brand-gold">
                  Emon Islam
                </p>

                <h3 className="mt-1 font-display text-xl font-bold sm:text-2xl">
                  Founder & CEO
                </h3>

                <p className="mt-2 text-xs leading-6 text-slate-400 sm:text-sm">
                  B.Sc. in CSE · Developer · Educator
                </p>

              </div>

              {/* buttons */}
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">

                <Link
                  to="/courses"
                  className="group inline-flex items-center justify-center gap-3 bg-brand-gold px-6 py-3.5 text-sm font-bold text-[#111827] transition-colors hover:bg-brand-goldLight"
                >
                  Explore Courses
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>

                <Link
                  to="/login"
                  className="inline-flex items-center justify-center gap-3 border border-white/15 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:border-brand-gold/50 hover:text-brand-gold"
                >
                  Student Portal
                </Link>

              </div>

              {/* trust */}
              <div className="mt-8 grid grid-cols-1 gap-3 border-t border-white/10 pt-6 sm:grid-cols-3">

                {[
                  "Expert Mentorship",
                  "Regular Assessment",
                  "Digital Portal",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-2 text-[11px] text-slate-400"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-brand-gold" />
                    {item}
                  </div>
                ))}

              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* =========================================================
          FOUNDER MESSAGE
      ========================================================= */}
      <section className="border-b border-slate-200 bg-[#f7f5f0] dark:border-slate-800 dark:bg-slate-950">

        <div className="container-page py-16 sm:py-20 lg:py-24">

          <div className="mx-auto max-w-4xl text-center">

            <div className="mx-auto mb-5 flex h-11 w-11 items-center justify-center rounded-full border border-brand-gold/30">
              <Quote className="h-5 w-5 text-brand-gold" />
            </div>

            <p className="text-[9px] font-bold uppercase tracking-[0.35em] text-brand-gold">
              Founder&apos;s Message
            </p>

            <blockquote className="mt-5 font-display text-xl font-semibold leading-[1.45] tracking-tight text-[#111827] dark:text-white sm:text-2xl lg:text-3xl">
              “My goal is simple — every student who walks through
              REMON ACADEMY should leave with stronger knowledge,
              greater confidence and a clearer direction for the future.”
            </blockquote>

            <div className="mx-auto mt-6 h-px w-10 bg-brand-gold" />

            <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.25em] text-slate-500">
              Emon Islam · Founder & CEO
            </p>

          </div>
        </div>
      </section>

      {/* =========================================================
          STATS
      ========================================================= */}
      <section className="bg-[#f7f5f0] py-8 dark:bg-slate-950 sm:py-10">

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
      <section className="bg-white py-20 dark:bg-slate-900 sm:py-24 lg:py-28">

        <div className="container-page">

          <div className="mb-12 grid gap-7 lg:grid-cols-[0.75fr_1.25fr] lg:items-end">

            <div>
              <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-brand-gold">
                The REMON Standard
              </p>

              <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-[#111827] dark:text-white sm:text-4xl">
                Education with intention.
              </h2>
            </div>

            <p className="max-w-2xl text-sm leading-7 text-slate-500">
              Good education is more than completing a syllabus.
              It is about building understanding, discipline,
              confidence and the ability to move forward independently.
            </p>

          </div>

          <div className="grid gap-4 md:grid-cols-3">

            {features.map((item) => {
              const Icon = item.icon;

              return (
                <Card
                  key={item.number}
                  className="group relative overflow-hidden border border-slate-200 bg-[#faf9f6] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-brand-gold/40 hover:shadow-xl dark:border-slate-800 dark:bg-slate-950 sm:p-7"
                >

                  <div className="flex items-start justify-between">

                    <div className="flex h-12 w-12 items-center justify-center border border-brand-gold/20 bg-brand-gold/5">
                      <Icon className="h-5 w-5 text-brand-gold" />
                    </div>

                    <span className="font-display text-3xl font-bold text-slate-200 dark:text-slate-800">
                      {item.number}
                    </span>

                  </div>

                  <h3 className="mt-7 font-display text-xl font-bold text-[#111827] dark:text-white">
                    {item.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-slate-500">
                    {item.desc}
                  </p>

                  <div className="mt-6 h-px w-8 bg-brand-gold transition-all duration-300 group-hover:w-16" />

                </Card>
              );
            })}

          </div>
        </div>
      </section>

      {/* =========================================================
          COURSES
      ========================================================= */}
      {courses.length > 0 && (
        <section className="border-y border-slate-200 bg-[#f7f5f0] py-20 dark:border-slate-800 dark:bg-slate-950 sm:py-24 lg:py-28">

          <div className="container-page">

            <div className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

              <div>

                <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-brand-gold">
                  Academic Programs
                </p>

                <h2 className="mt-3 font-display text-3xl font-bold text-[#111827] dark:text-white sm:text-4xl">
                  Featured Courses
                </h2>

                <p className="mt-3 max-w-xl text-sm leading-7 text-slate-500">
                  Structured programs designed around clear learning
                  objectives and measurable progress.
                </p>

              </div>

              <Link
                to="/courses"
                className="group inline-flex items-center gap-2 text-sm font-bold text-[#111827] dark:text-brand-gold"
              >
                View all courses
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>

            </div>

            <div className="grid gap-5 md:grid-cols-3">

              {courses.map((course, index) => (
                <Card
                  key={course._id}
                  className="group flex h-full flex-col overflow-hidden border border-slate-200 bg-white p-0 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900"
                >

                  <div className="relative h-40 overflow-hidden bg-[#111827] sm:h-44">

                    <div className="absolute left-5 top-5 font-display text-[5rem] font-bold leading-none text-white/[0.035]">
                      0{index + 1}
                    </div>

                    <div className="absolute bottom-5 left-5">
                      <BookOpen className="h-9 w-9 text-brand-gold" />
                    </div>

                    <span className="absolute right-4 top-4 border border-white/10 px-3 py-1 text-[8px] font-bold uppercase tracking-[0.2em] text-white/70">
                      Featured
                    </span>

                    <div className="absolute bottom-0 left-0 h-1 w-full bg-brand-gold" />

                  </div>

                  <div className="flex flex-1 flex-col p-5 sm:p-6">

                    <div className="mb-3 flex items-center gap-2 text-[9px] font-bold uppercase tracking-wider text-slate-400">
                      <span>{course.classLevel}</span>
                      <span>·</span>
                      <span>{course.subject}</span>
                    </div>

                    <h3 className="font-display text-xl font-bold text-[#111827] dark:text-white">
                      {course.title}
                    </h3>

                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-500">
                      {course.description}
                    </p>

                    <div className="mt-auto flex items-end justify-between gap-4 border-t border-slate-100 pt-5 dark:border-slate-800">

                      <div>
                        <p className="text-[8px] font-bold uppercase tracking-wider text-slate-400">
                          Course Fee
                        </p>

                        <p className="mt-1 text-xl font-bold text-brand-gold">
                          ৳{course.fee}
                        </p>
                      </div>

                      <Link
                        to={`/courses/${course.slug}`}
                        className="group/link inline-flex items-center gap-2 border border-slate-200 px-3.5 py-2.5 text-xs font-bold text-[#111827] transition-all hover:border-brand-gold hover:bg-brand-gold dark:border-slate-700 dark:text-white"
                      >
                        Details
                        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/link:translate-x-1" />
                      </Link>

                    </div>

                  </div>
                </Card>
              ))}

            </div>
          </div>
        </section>
      )}

      {/* =========================================================
          TECHNOLOGY / FOUNDER
      ========================================================= */}
      <section className="bg-[#111827] py-20 text-white sm:py-24 lg:py-28">

        <div className="container-page">

          <div className="grid items-center gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-16">

            <div className="relative mx-auto w-full max-w-sm">

              <div className="absolute -left-4 -top-4 h-16 w-16 border-l border-t border-brand-gold/50" />

              <div className="border border-white/10 p-2">

                <div className="relative h-[350px] overflow-hidden bg-slate-950 sm:h-[400px]">

                  <img
                    src="/photo/emon.png"
                    alt="Emon Islam"
                    className="h-full w-full object-cover object-top"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-[#111827] via-transparent to-transparent" />

                  <div className="absolute bottom-5 left-5">

                    <p className="text-[8px] font-bold uppercase tracking-[0.3em] text-brand-gold">
                      Founder & CEO
                    </p>

                    <h3 className="mt-1 font-display text-2xl font-bold">
                      Emon Islam
                    </h3>

                  </div>

                </div>
              </div>

              <div className="absolute -bottom-4 -right-4 h-16 w-16 border-b border-r border-brand-gold/50" />

            </div>

            <div>

              <div className="mb-5 flex items-center gap-3">

                <Code2 className="h-5 w-5 text-brand-gold" />

                <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-brand-gold">
                  Education × Technology
                </span>

              </div>

              <h2 className="max-w-3xl font-display text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
                Building an education experience for the next generation.
              </h2>

              <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base sm:leading-8">
                REMON ACADEMY brings together academic mentorship and
                technology to create a more organized, transparent and
                student-focused learning experience.
              </p>

              <div className="mt-7 grid gap-3 sm:grid-cols-2">

                {[
                  "Digital Student Portal",
                  "Modern Learning Management",
                  "Academic Performance Tracking",
                  "Technology-Driven Education",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 border border-white/10 px-4 py-3 text-xs text-slate-300"
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

      {/* =========================================================
          TEACHERS
      ========================================================= */}
      {teachers.length > 0 && (
        <section className="bg-white py-20 dark:bg-slate-900 sm:py-24 lg:py-28">

          <div className="container-page">

            <div className="mb-10 max-w-2xl">

              <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-brand-gold">
                Our Faculty
              </p>

              <h2 className="mt-3 font-display text-3xl font-bold text-[#111827] dark:text-white sm:text-4xl">
                Meet the educators.
              </h2>

              <p className="mt-4 text-sm leading-7 text-slate-500">
                Dedicated teachers focused on making difficult concepts
                easier to understand and easier to remember.
              </p>

            </div>

            <div className="grid gap-5 md:grid-cols-3">

              {teachers.map((teacher) => (
                <Card
                  key={teacher._id}
                  className="group relative overflow-hidden border border-slate-200 bg-[#faf9f6] text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-950"
                >

                  <div className="absolute left-0 right-0 top-0 h-1 bg-brand-gold" />

                  <div className="relative mx-auto mb-5 mt-7 h-28 w-28 overflow-hidden rounded-full border-4 border-brand-gold/10 bg-[#111827] shadow-lg">

                    {teacher.photo ? (
                      <img
                        src={teacher.photo}
                        alt={teacher.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-3xl font-bold text-brand-gold">
                        {teacher.name.charAt(0)}
                      </div>
                    )}

                  </div>

                  <h3 className="font-display text-xl font-bold text-[#111827] dark:text-white">
                    {teacher.name}
                  </h3>

                  <p className="mt-1 text-xs font-bold uppercase tracking-wider text-brand-gold">
                    {teacher.designation || "Instructor"}
                  </p>

                  {teacher.specialization && (
                    <p className="mt-3 text-sm text-slate-500">
                      {teacher.specialization}
                    </p>
                  )}

                  <div className="mx-auto mb-2 mt-5 h-px w-10 bg-brand-gold/40" />

                </Card>
              ))}

            </div>
          </div>
        </section>
      )}

      {/* =========================================================
          NOTICES
      ========================================================= */}
      {notices.length > 0 && (
        <section className="border-y border-slate-200 bg-[#f7f5f0] py-20 dark:border-slate-800 dark:bg-slate-950 sm:py-24 lg:py-28">

          <div className="container-page">

            <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

              <div>

                <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-brand-gold">
                  Academy Updates
                </p>

                <h2 className="mt-3 font-display text-3xl font-bold text-[#111827] dark:text-white sm:text-4xl">
                  Latest Notices
                </h2>

              </div>

              <Link
                to="/notices"
                className="group inline-flex items-center gap-2 text-sm font-bold text-[#111827] dark:text-brand-gold"
              >
                View all notices
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>

            </div>

            <div className="grid gap-5 md:grid-cols-3">

              {notices.map((notice) => (
                <Card
                  key={notice._id}
                  className="group h-full border border-slate-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900"
                >

                  <div className="mb-5 flex items-center justify-between">

                    <span className="border border-brand-gold/20 bg-brand-gold/5 px-3 py-1.5 text-[9px] font-bold uppercase tracking-wider text-brand-gold">
                      {notice.category}
                    </span>

                    <ShieldCheck className="h-4 w-4 text-slate-300" />

                  </div>

                  <h3 className="font-display text-lg font-bold text-[#111827] dark:text-white">
                    {notice.title}
                  </h3>

                  <p className="mt-3 line-clamp-3 text-sm leading-7 text-slate-500">
                    {notice.description}
                  </p>

                  <Link
                    to={`/notices/${notice.slug}`}
                    className="mt-6 inline-flex items-center gap-2 text-xs font-bold text-[#111827] dark:text-brand-gold"
                  >
                    Read notice
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </Link>

                </Card>
              ))}

            </div>
          </div>
        </section>
      )}

      {/* =========================================================
          FINAL CTA
      ========================================================= */}
      <section className="bg-white py-20 dark:bg-slate-900 sm:py-24 lg:py-28">

        <div className="container-page">

          <div className="relative overflow-hidden bg-[#111827] px-6 py-14 text-center sm:px-12 sm:py-16 lg:py-20">

            <div className="pointer-events-none absolute right-[-100px] top-[-100px] h-64 w-64 rounded-full border border-brand-gold/10" />

            <div className="pointer-events-none absolute bottom-[-120px] left-[-100px] h-64 w-64 rounded-full border border-white/[0.05]" />

            <div className="relative">

              <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center border border-brand-gold/30">
                <Award className="h-5 w-5 text-brand-gold" />
              </div>

              <p className="text-[9px] font-bold uppercase tracking-[0.35em] text-brand-gold">
                Your Journey Starts Here
              </p>

              <h2 className="mx-auto mt-4 max-w-2xl font-display text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
                Give your potential the right direction.
              </h2>

              <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-slate-400">
                Join {brand.name} and build your academic journey with
                structured learning, dedicated mentorship and modern
                student support.
              </p>

              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">

                <Link
                  to="/register"
                  className="group inline-flex items-center justify-center gap-3 bg-brand-gold px-7 py-3.5 text-sm font-bold text-[#111827] transition-colors hover:bg-brand-goldLight"
                >
                  Register Now
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>

                <Link
                  to="/courses"
                  className="inline-flex items-center justify-center gap-3 border border-white/15 px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:border-brand-gold/50 hover:text-brand-gold"
                >
                  Explore Courses
                </Link>

              </div>

            </div>
          </div>
        </div>
      </section>

    </div>
  );
}