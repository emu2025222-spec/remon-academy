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
          PREMIUM HERO
      ========================================================= */}
      <section className="relative overflow-hidden bg-[#111827] text-white">

        {/* subtle architectural background */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 opacity-[0.035] [background-image:linear-gradient(rgba(255,255,255,.9)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.9)_1px,transparent_1px)] [background-size:72px_72px]" />

          <div className="absolute right-[-160px] top-[-160px] h-[520px] w-[520px] rounded-full border border-brand-gold/10" />

          <div className="absolute right-[-90px] top-[-90px] h-[380px] w-[380px] rounded-full border border-brand-gold/10" />

          <div className="absolute bottom-[-220px] left-[-180px] h-[520px] w-[520px] rounded-full border border-white/[0.04]" />
        </div>

        <div className="container-page relative py-10 sm:py-14 lg:py-20">

          {/* top brand line */}
          <div className="mb-10 flex items-center justify-between border-b border-white/10 pb-5">
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-brand-gold" />

              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/60 sm:text-xs">
                REMON ACADEMY
              </span>
            </div>

            <span className="text-[10px] font-medium uppercase tracking-[0.25em] text-white/40 sm:text-xs">
              EST. 2026 · BANGLADESH
            </span>
          </div>

          <div className="grid items-center gap-14 lg:grid-cols-[0.95fr_1.05fr] lg:gap-20">

            {/* LEFT CONTENT */}
            <motion.div
              initial={{ opacity: 0, x: -25 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.65 }}
              className="order-2 lg:order-1"
            >
              <div className="mb-7 flex items-center gap-3">
                <span className="h-px w-10 bg-brand-gold" />

                <span className="text-[10px] font-bold uppercase tracking-[0.28em] text-brand-gold">
                  A Better Way To Learn
                </span>
              </div>

              <h1 className="max-w-3xl font-display text-[2.9rem] font-bold leading-[0.98] tracking-[-0.04em] sm:text-6xl lg:text-[5.4rem]">
                {brand.tagline}
              </h1>

              <p className="mt-7 max-w-xl text-base leading-8 text-slate-300 sm:text-lg">
                {brand.name} is built around one simple idea — students
                deserve better teaching, clearer direction and a learning
                environment that prepares them for what comes next.
              </p>

              {/* identity */}
              <div className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
                <span className="font-semibold text-brand-gold">
                  Emon Islam
                </span>

                <span className="text-white/20">/</span>

                <span className="text-slate-400">
                  B.Sc. in CSE
                </span>

                <span className="text-white/20">/</span>

                <span className="text-slate-400">
                  Developer
                </span>

                <span className="text-white/20">/</span>

                <span className="text-slate-400">
                  Educator
                </span>
              </div>

              {/* buttons */}
              <div className="mt-9 flex flex-wrap gap-3">
                <Link
                  to="/courses"
                  className="group inline-flex items-center gap-3 bg-brand-gold px-6 py-3.5 text-sm font-bold text-[#111827] transition-all duration-300 hover:bg-brand-goldLight"
                >
                  Explore Courses
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>

                <Link
                  to="/login"
                  className="inline-flex items-center gap-3 border border-white/15 px-6 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:border-brand-gold/50 hover:text-brand-gold"
                >
                  Student Portal
                </Link>
              </div>

              {/* trust */}
              <div className="mt-10 grid max-w-xl grid-cols-1 gap-3 border-t border-white/10 pt-7 sm:grid-cols-3">
                {[
                  "Expert Mentorship",
                  "Regular Assessment",
                  "Digital Portal",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-2 text-xs text-slate-400"
                  >
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-brand-gold" />
                    {item}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* RIGHT PHOTO */}
            <motion.div
              initial={{ opacity: 0, x: 45 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.75, delay: 0.1 }}
              className="relative order-1 lg:order-2"
            >
              <div className="relative mx-auto max-w-[540px]">

                {/* editorial number */}
                <div className="absolute -left-2 top-2 z-20 hidden text-[8rem] font-bold leading-none text-white/[0.035] sm:block">
                  01
                </div>

                {/* vertical label */}
                <div className="absolute -right-9 top-12 z-30 hidden rotate-90 text-[9px] font-bold uppercase tracking-[0.35em] text-white/30 lg:block">
                  EDUCATION · TECHNOLOGY · FUTURE
                </div>

                {/* image border */}
                <div className="relative ml-auto w-[88%] border border-brand-gold/25 p-2 sm:w-[82%]">

                  <div className="relative overflow-hidden bg-[#0b1220]">

                    <img
                      src="/photo/emon.png"
                      alt="Emon Islam"
                      className="h-[430px] w-full object-cover object-top sm:h-[570px]"
                    />

                    {/* image gradient */}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#111827] via-transparent to-transparent" />

                    {/* gold edge */}
                    <div className="absolute bottom-0 left-0 h-1 w-full bg-brand-gold" />

                    {/* profile reveal card */}
                    <motion.div
                      initial={{ opacity: 0, y: 18 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.55 }}
                      className="absolute bottom-0 left-0 right-0 p-4 sm:p-6"
                    >
                      <div className="border border-white/10 bg-[#111827]/95 p-5 sm:p-6">

                        <div className="flex items-end justify-between gap-4">
                          <div>
                            <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-brand-gold">
                              Founder & CEO
                            </p>

                            <h2 className="mt-1 font-display text-2xl font-bold sm:text-3xl">
                              Emon Islam
                            </h2>

                            <p className="mt-1 text-xs text-slate-400">
                              B.Sc. in CSE · Developer · Educator
                            </p>
                          </div>

                          <div className="hidden border border-brand-gold/20 p-3 sm:block">
                            <Code2 className="h-5 w-5 text-brand-gold" />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>

                {/* side label */}
                <div className="absolute bottom-5 left-0 hidden w-32 border-l border-brand-gold pl-4 sm:block">
                  <p className="text-[9px] uppercase tracking-[0.25em] text-brand-gold">
                    Founder
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-400">
                    Building education with technology.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* =========================================================
          FOUNDER NOTE
      ========================================================= */}
      <section className="border-b border-slate-200 bg-[#f7f5f0] dark:border-slate-800 dark:bg-slate-950">
        <div className="container-page py-20 sm:py-24 lg:py-28">

          <div className="mx-auto max-w-4xl text-center">

            <div className="mx-auto mb-7 flex h-12 w-12 items-center justify-center rounded-full border border-brand-gold/30 bg-brand-gold/5">
              <Quote className="h-5 w-5 text-brand-gold" />
            </div>

            <p className="mb-5 text-[10px] font-bold uppercase tracking-[0.35em] text-brand-gold">
              A Note From The Founder
            </p>

            <blockquote className="font-display text-2xl font-semibold leading-[1.35] tracking-tight text-[#111827] dark:text-white sm:text-3xl lg:text-4xl">
              “My goal is simple — every student who walks through
              REMON ACADEMY should leave with stronger knowledge,
              greater confidence and a clearer direction for the future.”
            </blockquote>

            <div className="mx-auto mt-8 h-px w-12 bg-brand-gold" />

            <p className="mt-5 text-xs font-bold uppercase tracking-[0.25em] text-slate-500">
              Emon Islam · Founder & CEO
            </p>

          </div>
        </div>
      </section>

      {/* =========================================================
          STATS
      ========================================================= */}
      <section className="relative z-10 -mt-1 bg-[#f7f5f0] py-10 dark:bg-slate-950">
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
      <section className="bg-white py-24 dark:bg-slate-900 lg:py-28">
        <div className="container-page">

          <div className="mb-14 grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-end">

            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-gold">
                The REMON Standard
              </p>

              <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-[#111827] dark:text-white sm:text-4xl">
                Education with intention.
              </h2>
            </div>

            <p className="max-w-2xl text-sm leading-7 text-slate-500">
              We believe good education is more than completing a syllabus.
              It is about building understanding, discipline, confidence and
              the ability to move forward independently.
            </p>

          </div>

          <div className="grid gap-4 md:grid-cols-3">

            {features.map((item) => {
              const Icon = item.icon;

              return (
                <Card
                  key={item.number}
                  className="group relative overflow-hidden border border-slate-200 bg-[#faf9f6] p-7 transition-all duration-300 hover:-translate-y-1 hover:border-brand-gold/40 hover:shadow-xl dark:border-slate-800 dark:bg-slate-950"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex h-12 w-12 items-center justify-center border border-brand-gold/20 bg-brand-gold/5">
                      <Icon className="h-5 w-5 text-brand-gold" />
                    </div>

                    <span className="font-display text-3xl font-bold text-slate-200 dark:text-slate-800">
                      {item.number}
                    </span>
                  </div>

                  <h3 className="mt-8 font-display text-xl font-bold text-[#111827] dark:text-white">
                    {item.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-slate-500">
                    {item.desc}
                  </p>

                  <div className="mt-7 h-px w-8 bg-brand-gold transition-all duration-300 group-hover:w-16" />
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
        <section className="border-y border-slate-200 bg-[#f7f5f0] py-24 dark:border-slate-800 dark:bg-slate-950 lg:py-28">
          <div className="container-page">

            <div className="mb-12 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">

              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-gold">
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
                  <div className="relative h-44 overflow-hidden bg-[#111827]">

                    <div className="absolute left-6 top-6 text-[5rem] font-bold leading-none text-white/[0.035]">
                      0{index + 1}
                    </div>

                    <div className="absolute bottom-5 left-6">
                      <BookOpen className="h-9 w-9 text-brand-gold" />
                    </div>

                    <span className="absolute right-5 top-5 border border-white/10 px-3 py-1 text-[9px] font-bold uppercase tracking-[0.2em] text-white/70">
                      Featured
                    </span>

                    <div className="absolute bottom-0 left-0 h-1 w-full bg-brand-gold" />
                  </div>

                  <div className="flex flex-1 flex-col p-6">

                    <div className="mb-3 flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
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

                    <div className="mt-auto flex items-end justify-between gap-4 border-t border-slate-100 pt-6 dark:border-slate-800">

                      <div>
                        <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                          Course Fee
                        </p>

                        <p className="mt-1 text-xl font-bold text-brand-gold">
                          ৳{course.fee}
                        </p>
                      </div>

                      <Link
                        to={`/courses/${course.slug}`}
                        className="group/link inline-flex items-center gap-2 border border-slate-200 px-4 py-2.5 text-xs font-bold text-[#111827] transition-all hover:border-brand-gold hover:bg-brand-gold dark:border-slate-700 dark:text-white"
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
          FOUNDER / TECHNOLOGY
      ========================================================= */}
      <section className="bg-[#111827] py-24 text-white lg:py-28">
        <div className="container-page">

          <div className="grid items-center gap-12 lg:grid-cols-[0.7fr_1.3fr]">

            <div className="relative mx-auto w-full max-w-sm">

              <div className="absolute -left-5 -top-5 h-20 w-20 border-l border-t border-brand-gold/50" />

              <div className="relative border border-white/10 p-2">

                <div className="relative h-[390px] overflow-hidden bg-slate-950">
                  <img
                    src="/photo/emon.png"
                    alt="Emon Islam"
                    className="h-full w-full object-cover object-top"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-[#111827] via-transparent to-transparent" />

                  <div className="absolute bottom-5 left-5">
                    <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-brand-gold">
                      Founder & CEO
                    </p>

                    <h3 className="mt-1 font-display text-2xl font-bold">
                      Emon Islam
                    </h3>
                  </div>
                </div>

              </div>

              <div className="absolute -bottom-5 -right-5 h-20 w-20 border-b border-r border-brand-gold/50" />
            </div>

            <div>

              <div className="mb-6 flex items-center gap-3">
                <Code2 className="h-5 w-5 text-brand-gold" />

                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-gold">
                  Education × Technology
                </span>
              </div>

              <h2 className="max-w-3xl font-display text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
                Building an education experience for the next generation.
              </h2>

              <p className="mt-6 max-w-2xl text-base leading-8 text-slate-400">
                REMON ACADEMY brings together academic mentorship and
                technology to create a more organized, transparent and
                student-focused learning experience.
              </p>

              <div className="mt-8 grid gap-3 sm:grid-cols-2">

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
        <section className="bg-white py-24 dark:bg-slate-900 lg:py-28">
          <div className="container-page">

            <div className="mb-12 max-w-2xl">
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-gold">
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
        <section className="border-y border-slate-200 bg-[#f7f5f0] py-24 dark:border-slate-800 dark:bg-slate-950 lg:py-28">
          <div className="container-page">

            <div className="mb-12 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">

              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-gold">
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
      <section className="bg-white py-24 dark:bg-slate-900 lg:py-28">
        <div className="container-page">

          <div className="relative overflow-hidden bg-[#111827] px-7 py-16 text-center sm:px-12 lg:py-20">

            <div className="pointer-events-none absolute right-[-100px] top-[-100px] h-72 w-72 rounded-full border border-brand-gold/10" />

            <div className="pointer-events-none absolute bottom-[-140px] left-[-100px] h-72 w-72 rounded-full border border-white/[0.05]" />

            <div className="relative">

              <div className="mx-auto mb-7 flex h-12 w-12 items-center justify-center border border-brand-gold/30">
                <Award className="h-5 w-5 text-brand-gold" />
              </div>

              <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-brand-gold">
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

              <div className="mt-9 flex flex-wrap justify-center gap-3">

                <Link
                  to="/register"
                  className="group inline-flex items-center gap-3 bg-brand-gold px-7 py-3.5 text-sm font-bold text-[#111827] transition-all hover:bg-brand-goldLight"
                >
                  Register Now
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>

                <Link
                  to="/courses"
                  className="inline-flex items-center gap-3 border border-white/15 px-7 py-3.5 text-sm font-semibold text-white transition-all hover:border-brand-gold/50 hover:text-brand-gold"
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