import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  GraduationCap,
  Sparkles,
  Star,
  TrendingUp,
  Users,
  ShieldCheck,
  Target,
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
      .then((r) => {
        setStats(r.data.data);
      })
      .catch(() => {});

    api
      .get("/courses/public")
      .then((r) => {
        setCourses((r.data.data || []).slice(0, 3));
      })
      .catch(() => {});

    api
      .get("/teachers/public")
      .then((r) => {
        setTeachers((r.data.data || []).slice(0, 3));
      })
      .catch(() => {});

    api
      .get("/notices/public")
      .then((r) => {
        setNotices((r.data.data || []).slice(0, 3));
      })
      .catch(() => {});
  }, []);

  return (
    <div className="overflow-hidden bg-white dark:bg-slate-950">

      {/* ========================= HERO ========================= */}
      <section className="relative isolate overflow-hidden bg-brand-navy text-white">
        {/* Background: keeps the hero visually connected to the existing REMON theme */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-40 -top-40 h-[520px] w-[520px] rounded-full bg-brand-gold/10 blur-3xl" />
          <div className="absolute -bottom-52 -right-40 h-[620px] w-[620px] rounded-full bg-blue-500/10 blur-3xl" />
          <div className="absolute inset-0 bg-gradient-to-br from-brand-navy via-brand-navy/95 to-slate-950/90" />

          <motion.div
            className="absolute right-[12%] top-20 h-2 w-2 rounded-full bg-brand-gold"
            animate={{ y: [0, 30, 0], opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 4, repeat: Infinity }}
          />

          <motion.div
            className="absolute left-[15%] top-[45%] h-1.5 w-1.5 rounded-full bg-white/60"
            animate={{ y: [0, -25, 0], opacity: [0.2, 1, 0.2] }}
            transition={{ duration: 5, repeat: Infinity }}
          />
        </div>

        <div className="container-page relative grid min-h-[680px] items-center gap-10 py-16 lg:grid-cols-[0.95fr_1.05fr] lg:py-20">
          {/* HERO TEXT */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="relative z-10 order-2 lg:order-1"
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="mb-5 inline-flex items-center gap-2 rounded-full border border-brand-gold/30 bg-brand-gold/10 px-4 py-2 text-sm font-medium text-brand-goldLight backdrop-blur"
            >
              <Sparkles className="h-4 w-4" />
              Est. 2026 · Bangladesh
            </motion.div>

            <h1 className="max-w-3xl font-display text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
              {brand.tagline}
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
              {brand.name} provides expert, result-oriented coaching
              for SSC, HSC, and university admission candidates —
              combining experienced teachers, structured courses,
              regular assessment, and modern student support.
            </p>

            {/* Founder / Educator identity */}
            <div className="mt-7 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm font-medium">
              <span className="text-brand-gold">Remon</span>
              <span className="text-white/30">•</span>
              <span className="text-slate-300">BSc</span>
              <span className="text-white/30">•</span>
              <span className="text-slate-300">CSE</span>
              <span className="text-white/30">•</span>
              <span className="text-slate-300">Developer</span>
              <span className="text-white/30">•</span>
              <span className="text-slate-300">Educator</span>
            </div>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/courses"
                className="group inline-flex items-center gap-2 rounded-xl bg-brand-gold px-6 py-3.5 font-semibold text-brand-navy shadow-lg shadow-brand-gold/10 transition-all duration-300 hover:-translate-y-1 hover:bg-brand-goldLight"
              >
                Explore Courses
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>

              <Link
                to="/login"
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-6 py-3.5 font-semibold text-white backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:text-brand-navy"
              >
                Student Login
              </Link>
            </div>

            <div className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-3 text-sm text-slate-400">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-brand-gold" />
                Experienced Teachers
              </span>

              <span className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-brand-gold" />
                Regular Assessment
              </span>

              <span className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-brand-gold" />
                Student Portal
              </span>
            </div>
          </motion.div>

          {/* HERO PHOTO */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, x: 30 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="relative z-10 order-1 mx-auto w-full max-w-[520px] lg:order-2"
          >
            {/* Soft glow behind the portrait */}
            <div className="absolute -inset-6 rounded-[2.5rem] bg-brand-gold/10 blur-3xl" />

            {/* Portrait frame */}
            <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.06] p-2 shadow-2xl shadow-black/30 backdrop-blur-sm">
              <div className="relative overflow-hidden rounded-[1.5rem] bg-slate-950">
                <img
                  src="/photo/emon.png"
                  alt="Remon - BSc, CSE, Developer and Educator"
                  className="h-[460px] w-full object-cover object-top transition-transform duration-700 hover:scale-[1.025] sm:h-[540px]"
                />

                {/* Website-matching navy/gold overlay */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-brand-navy via-transparent to-transparent opacity-95" />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-brand-navy/20 via-transparent to-brand-gold/5" />

                {/* Bottom identity card */}
                <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-7">
                  <div className="rounded-2xl border border-white/10 bg-brand-navy/75 p-4 shadow-xl backdrop-blur-md sm:p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-gold">
                      Founder · Educator
                    </p>

                    <h2 className="mt-1 font-display text-2xl font-bold text-white sm:text-3xl">
                      Remon
                    </h2>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {["BSc", "CSE", "Developer", "Educator"].map((item) => (
                        <span
                          key={item}
                          className="rounded-full border border-brand-gold/25 bg-brand-gold/10 px-3 py-1 text-xs font-semibold text-brand-goldLight"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating academic card */}
            <motion.div
              className="absolute -left-3 top-10 hidden rounded-2xl border border-white/10 bg-brand-navy/80 px-4 py-3 shadow-xl backdrop-blur-md sm:block"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-brand-gold/15 p-2.5">
                  <GraduationCap className="h-5 w-5 text-brand-gold" />
                </div>
                <div>
                  <p className="text-xs text-slate-400">Academic</p>
                  <p className="font-semibold text-white">Mentorship</p>
                </div>
              </div>
            </motion.div>

            {/* Floating developer card */}
            <motion.div
              className="absolute -right-3 bottom-24 hidden rounded-2xl border border-white/10 bg-brand-navy/80 px-4 py-3 shadow-xl backdrop-blur-md sm:block"
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 5, repeat: Infinity }}
            >
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-brand-gold/15 p-2.5">
                  <Zap className="h-5 w-5 text-brand-gold" />
                </div>
                <div>
                  <p className="text-xs text-slate-400">Tech</p>
                  <p className="font-semibold text-white">Developer</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ========================= STATS ========================= */}
      <section className="relative z-20 -mt-8">
        <div className="container-page grid grid-cols-2 gap-4 md:grid-cols-4">
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

      {/* ========================= WHY CHOOSE US ========================= */}
      <section className="container-page py-24">
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
            duration: 0.5,
          }}
          className="mx-auto mb-14 max-w-2xl text-center"
        >
          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-gold">
            Why REMON
          </span>

          <h2 className="mt-3 font-display text-3xl font-bold text-brand-navy dark:text-white sm:text-4xl">
            More Than Just Coaching
          </h2>

          <p className="mt-4 leading-7 text-slate-500">
            A structured and modern learning environment designed
            to help students stay consistent, confident, and focused.
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              icon: GraduationCap,
              title: "Expert Teachers",
              desc: "Learn from dedicated subject specialists who focus on clear concepts and practical academic preparation.",
            },
            {
              icon: Target,
              title: "Regular Assessment",
              desc: "Regular exams, performance tracking, and feedback help students understand exactly where they need improvement.",
            },
            {
              icon: Zap,
              title: "Modern Learning",
              desc: "A digital student portal keeps courses, results, attendance, fees, notices, and academic information organized.",
            },
          ].map((item, index) => {
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
                }}
              >
                <Card className="group h-full border border-slate-100 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl dark:border-slate-800">
                  <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-gold/10 transition-transform duration-300 group-hover:scale-110">
                    <Icon className="h-7 w-7 text-brand-gold" />
                  </div>

                  <h3 className="font-display text-xl font-semibold text-brand-navy dark:text-white">
                    {item.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-slate-500">
                    {item.desc}
                  </p>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ========================= POPULAR COURSES ========================= */}
      {courses.length > 0 && (
        <section className="relative overflow-hidden bg-slate-50 py-24 dark:bg-slate-900/50">
          <div className="pointer-events-none absolute -right-40 top-0 h-80 w-80 rounded-full bg-brand-gold/5 blur-3xl" />

          <div className="container-page relative">
            <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <span className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-gold">
                  Learn With Us
                </span>

                <h2 className="mt-2 font-display text-3xl font-bold text-brand-navy dark:text-white sm:text-4xl">
                  Popular Courses
                </h2>
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
                  <Card className="group flex h-full flex-col overflow-hidden p-0 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
                    <div className="relative flex h-36 items-center justify-center overflow-hidden bg-brand-navy">
                      <div className="absolute inset-0 bg-gradient-to-br from-brand-navy to-brand-navyDark" />

                      <BookOpen className="relative h-14 w-14 text-brand-gold transition-transform duration-500 group-hover:scale-110" />

                      <div className="absolute right-4 top-4 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
                        Course
                      </div>
                    </div>

                    <div className="flex flex-1 flex-col p-6">
                      <h3 className="font-display text-xl font-semibold text-brand-navy dark:text-white">
                        {course.title}
                      </h3>

                      <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-500">
                        {course.description}
                      </p>

                      <div className="mt-auto flex items-center justify-between gap-4 pt-6">
                        <span className="text-lg font-bold text-brand-gold">
                          ৳{course.fee}
                        </span>

                        <Link
                          to={`/courses/${course.slug}`}
                          className="group/link inline-flex items-center gap-1 text-sm font-semibold text-brand-navy dark:text-brand-goldLight"
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

      {/* ========================= TEACHERS ========================= */}
      {teachers.length > 0 && (
        <section className="container-page py-24">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <span className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-gold">
              Our Team
            </span>

            <h2 className="mt-2 font-display text-3xl font-bold text-brand-navy dark:text-white sm:text-4xl">
              Meet Our Teachers
            </h2>

            <p className="mt-4 text-slate-500">
              Dedicated educators working to make every lesson meaningful.
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
                <Card className="group text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
                  <div className="relative mx-auto mb-5 flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-4 border-brand-gold/10 bg-brand-navy text-3xl font-bold text-brand-gold shadow-lg transition-transform duration-300 group-hover:scale-105">
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

                  <p className="mt-1 text-sm text-brand-gold">
                    {teacher.designation || "Instructor"}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* ========================= NOTICES ========================= */}
      {notices.length > 0 && (
        <section className="bg-slate-50 py-24 dark:bg-slate-900/50">
          <div className="container-page">
            <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <span className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-gold">
                  Stay Updated
                </span>

                <h2 className="mt-2 font-display text-3xl font-bold text-brand-navy dark:text-white sm:text-4xl">
                  Latest Notices
                </h2>
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
                  <Card className="group h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                    <div className="mb-4 flex items-center justify-between">
                      <span className="rounded-full bg-brand-gold/10 px-3 py-1 text-xs font-semibold uppercase text-brand-gold">
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
                      className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-brand-navy dark:text-brand-goldLight"
                    >
                      Read more

                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ========================= FINAL CTA ========================= */}
      <section className="container-page py-24">
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
          className="relative overflow-hidden rounded-3xl bg-brand-navy px-6 py-16 text-center shadow-2xl sm:px-12"
        >
          <div className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full bg-brand-gold/10 blur-3xl" />

          <div className="pointer-events-none absolute -bottom-32 -right-20 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />

          <div className="relative">
            <motion.div
              animate={{
                y: [0, -8, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
              }}
            >
              <Star className="mx-auto mb-5 h-10 w-10 fill-brand-gold text-brand-gold" />
            </motion.div>

            <h2 className="font-display text-3xl font-bold text-white sm:text-4xl">
              Ready to Start Your Journey?
            </h2>

            <p className="mx-auto mt-4 max-w-xl leading-7 text-slate-300">
              Join {brand.name} and take the next step toward
              your academic goals with structured learning and
              dedicated guidance.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 rounded-xl bg-brand-gold px-7 py-3.5 font-semibold text-brand-navy transition-all duration-300 hover:-translate-y-1 hover:bg-brand-goldLight"
              >
                Register Now

                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                to="/courses"
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-7 py-3.5 font-semibold text-white transition-all duration-300 hover:bg-white hover:text-brand-navy"
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