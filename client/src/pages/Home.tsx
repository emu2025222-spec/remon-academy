
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Award,
  BookOpen,
  CheckCircle2,
  GraduationCap,
  Instagram,
  Layers3,
  Menu,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  Trophy,
  Users,
  X,
  Zap,
  Quote,
  BookMarked,
  CalendarDays,
} from "lucide-react";

import { api } from "../services/api";
import type { Course, Teacher, Notice } from "../types";
import { StatCard } from "../components/StatCard";
import { brand } from "../config/brand";

const reveal = {
  hidden: { opacity: 0, y: 35 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: "easeOut" as const },
  },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const features = [
  {
    number: "01",
    icon: Target,
    title: "Concept-Based Learning",
    description:
      "We focus on understanding concepts deeply instead of depending only on memorization.",
  },
  {
    number: "02",
    icon: Zap,
    title: "Consistent Progress",
    description:
      "Regular practice and academic guidance help students move forward with confidence.",
  },
  {
    number: "03",
    icon: Trophy,
    title: "Academic Excellence",
    description:
      "A disciplined learning environment helps students build strong academic foundations.",
  },
  {
    number: "04",
    icon: Layers3,
    title: "Digital Experience",
    description:
      "Academic information and student activities stay organized through digital support.",
  },
];

const learningPoints = [
  "Structured academic programs",
  "Dedicated teaching guidance",
  "Regular academic assessment",
  "Digital student management",
  "Organized attendance tracking",
  "Transparent fee information",
];

function SectionLabel({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mb-5 flex items-center gap-3">
      <span className="h-px w-8 bg-orange-500" />
      <span className="text-[10px] font-extrabold uppercase tracking-[0.3em] text-orange-400">
        {children}
      </span>
    </div>
  );
}

function HalloweenHero() {
  return (
    <section className="relative isolate overflow-hidden bg-[#100d0b] text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-orange-600/15 blur-[130px]" />
        <div className="absolute -right-40 top-20 h-[500px] w-[500px] rounded-full bg-purple-700/15 blur-[130px]" />
        <div className="absolute inset-0 opacity-[0.045] [background-image:linear-gradient(rgba(255,255,255,.5)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.5)_1px,transparent_1px)] [background-size:55px_55px]" />
      </div>

      <div className="container-page relative z-10 py-16 sm:py-24 lg:py-28">
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_.9fr]">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
          >
            <motion.div
              variants={reveal}
              className="inline-flex items-center gap-2 rounded-full border border-orange-400/25 bg-orange-400/10 px-4 py-2 text-[9px] font-bold uppercase tracking-[0.25em] text-orange-300"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Halloween Edition · REMON Academy
            </motion.div>

            <motion.h1
              variants={reveal}
              className="mt-8 max-w-3xl font-display text-5xl font-black leading-[1.02] tracking-[-0.06em] sm:text-7xl lg:text-[5.7rem]"
            >
              Fear less.
              <br />
              <span className="text-orange-500">Learn more.</span>
              <br />
              <span className="text-[#f4e8d7]">Become more.</span>
            </motion.h1>

            <motion.p
              variants={reveal}
              className="mt-7 max-w-lg text-sm leading-8 text-stone-400 sm:text-base"
            >
              Welcome to {brand.name}. A place where curiosity becomes
              knowledge, effort becomes progress and every student gets
              the opportunity to grow.
            </motion.p>

            <motion.div
              variants={reveal}
              className="mt-9 flex flex-col gap-3 sm:flex-row"
            >
              <Link
                to="/courses"
                className="group inline-flex items-center justify-center gap-3 rounded-xl bg-orange-500 px-7 py-4 text-sm font-extrabold text-[#17100b] transition duration-300 hover:-translate-y-1 hover:bg-orange-400"
              >
                Explore Courses
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
              </Link>

              <Link
                to="/about"
                className="inline-flex items-center justify-center gap-3 rounded-xl border border-white/15 px-7 py-4 text-sm font-bold text-white transition hover:border-orange-400/60 hover:bg-white/5"
              >
                Discover Academy
                <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>

            <motion.div
              variants={reveal}
              className="mt-10 flex flex-wrap gap-x-7 gap-y-3 text-xs text-stone-400"
            >
              <span className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-orange-400" />
                Learn with confidence
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-orange-400" />
                Grow with purpose
              </span>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.85, rotate: 5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.9 }}
            className="relative mx-auto flex min-h-[350px] w-full max-w-[480px] items-center justify-center sm:min-h-[480px]"
          >
            <div className="absolute h-[280px] w-[280px] rounded-full border border-orange-400/20 sm:h-[390px] sm:w-[390px]" />
            <div className="absolute h-[230px] w-[230px] rounded-full border border-orange-400/10 sm:h-[330px] sm:w-[330px]" />
            <div className="absolute h-64 w-64 rounded-full bg-orange-500/15 blur-[90px] sm:h-80 sm:w-80" />

            <motion.div
              animate={{ y: [0, -15, 0], rotate: [-3, 3, -3] }}
              transition={{ duration: 5, repeat: Infinity }}
              className="relative z-10 text-center"
            >
              <div className="text-[145px] leading-none drop-shadow-[0_0_55px_rgba(249,115,22,.35)] sm:text-[205px]">
                🎃
              </div>
              <div className="mt-5 flex items-center justify-center gap-8 text-3xl">
                <span>👻</span>
                <span>🕸️</span>
                <span>🦇</span>
              </div>
              <div className="mt-7 inline-flex rounded-full border border-orange-400/30 bg-orange-400/10 px-6 py-3 text-[10px] font-black tracking-[0.35em] text-orange-300">
                HAPPY HALLOWEEN
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute left-0 top-[20%] hidden rounded-xl border border-white/10 bg-[#201713] p-4 sm:block"
            >
              <BookOpen className="h-5 w-5 text-orange-400" />
              <p className="mt-2 text-xs font-bold text-white">Keep Learning</p>
            </motion.div>

            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4.5, repeat: Infinity }}
              className="absolute bottom-[15%] right-0 hidden rounded-xl border border-white/10 bg-[#201713] p-4 sm:block"
            >
              <Star className="h-5 w-5 text-yellow-400" />
              <p className="mt-2 text-xs font-bold text-white">Keep Growing</p>
            </motion.div>
          </motion.div>
        </div>

        <div className="mt-14 flex items-center justify-between border-t border-white/10 pt-6 text-[9px] font-bold uppercase tracking-[0.25em] text-stone-500">
          <span>Learn · Grow · Achieve</span>
          <span className="flex items-center gap-2">
            Scroll to explore <ArrowDown className="h-3.5 w-3.5" />
          </span>
        </div>
      </div>
    </section>
  );
}

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
  const [mobileMenu, setMobileMenu] = useState(false);

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

  const closeMenu = () => setMobileMenu(false);

  return (
    <main className="relative overflow-hidden bg-[#f5f0e8] text-[#211b16]">

      {/* HALLOWEEN ANNOUNCEMENT BAR */}
      <div className="bg-[#e96b25] px-4 py-3 text-center text-[10px] font-black uppercase tracking-[0.2em] text-[#1c120c] sm:text-xs">
        🎃 Halloween Special · Learn something extraordinary today
      </div>

      {/* CUSTOM HOME NAVIGATION */}
      <nav className="relative z-50 border-b border-[#211b16]/10 bg-[#f5f0e8]">
        <div className="container-page flex h-[76px] items-center justify-between">
          <Link to="/" className="flex items-center gap-3" onClick={closeMenu}>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#211b16] text-orange-400">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div>
              <p className="font-display text-lg font-black tracking-tight">
                REMON<span className="text-orange-600">.</span>
              </p>
              <p className="text-[8px] font-bold uppercase tracking-[0.25em] text-stone-500">
                Academy · Est. 2026
              </p>
            </div>
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            {[
              ["Home", "/"],
              ["Courses", "/courses"],
              ["About", "/about"],
              ["Teachers", "/teachers"],
              ["Notices", "/notices"],
            ].map(([label, path]) => (
              <Link
                key={path}
                to={path}
                className="text-xs font-bold text-stone-600 transition hover:text-orange-600"
              >
                {label}
              </Link>
            ))}
            <Link
              to="/register"
              className="rounded-lg bg-[#211b16] px-5 py-3 text-xs font-bold text-white transition hover:bg-orange-600"
            >
              Get Started <ArrowUpRight className="ml-1 inline h-3.5 w-3.5" />
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setMobileMenu(!mobileMenu)}
            className="rounded-lg border border-stone-300 p-2 md:hidden"
            aria-label="Toggle navigation"
          >
            {mobileMenu ? <X /> : <Menu />}
          </button>
        </div>

        {mobileMenu && (
          <div className="absolute left-0 right-0 top-full border-b border-stone-200 bg-[#f5f0e8] p-5 shadow-xl md:hidden">
            <div className="flex flex-col gap-4">
              {[
                ["Home", "/"],
                ["Courses", "/courses"],
                ["About", "/about"],
                ["Teachers", "/teachers"],
                ["Notices", "/notices"],
                ["Contact", "/contact"],
                ["Register", "/register"],
              ].map(([label, path]) => (
                <Link
                  key={path}
                  to={path}
                  onClick={closeMenu}
                  className="border-b border-stone-200 pb-3 text-sm font-bold"
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* HERO */}
      <HalloweenHero />

      {/* STATS */}
      <section className="relative z-10 bg-[#211b16] text-white">
        <div className="container-page grid grid-cols-2 md:grid-cols-4">
          <div className="border-b border-white/10 px-4 py-7 md:border-b-0 md:border-r">
            <StatCard icon={Users} label="Students" value={stats.totalStudents} suffix="+" />
          </div>
          <div className="border-b border-white/10 px-4 py-7 md:border-b-0 md:border-r">
            <StatCard icon={GraduationCap} label="Teachers" value={stats.totalTeachers} suffix="+" />
          </div>
          <div className="border-r border-white/10 px-4 py-7">
            <StatCard icon={BookOpen} label="Programs" value={stats.totalCourses} suffix="+" />
          </div>
          <div className="px-4 py-7">
            <StatCard icon={Trophy} label="Successful Students" value={stats.successfulStudents} suffix="+" />
          </div>
        </div>
      </section>

      {/* INTRODUCTION */}
      <section className="relative overflow-hidden py-20 sm:py-28">
        <div className="container-page">
          <div className="grid gap-12 lg:grid-cols-[.8fr_1.2fr] lg:items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={reveal}
            >
              <SectionLabel>Welcome to REMON</SectionLabel>
              <h2 className="font-display text-4xl font-black leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
                Education is
                <br />
                <span className="text-orange-600">more than</span>
                <br />
                a classroom.
              </h2>
              <div className="mt-8 h-1 w-20 rounded-full bg-orange-500" />
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={reveal}
            >
              <p className="text-lg font-semibold leading-9 text-[#3b3028] sm:text-xl">
                We believe every student deserves the right guidance, a
                supportive environment and the opportunity to achieve
                something extraordinary.
              </p>
              <p className="mt-6 text-sm leading-8 text-stone-600">
                {brand.name} brings together academic discipline, dedicated
                teaching and digital organization to create a clearer path
                for students. Our goal is to make learning meaningful,
                organized and focused on long-term growth.
              </p>
              <Link
                to="/about"
                className="mt-8 inline-flex items-center gap-3 border-b-2 border-orange-500 pb-2 text-sm font-black transition hover:gap-5"
              >
                Discover our story <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* PHILOSOPHY STRIP */}
      <section className="overflow-hidden bg-orange-500 py-5 text-[#211b16]">
        <div className="flex min-w-max animate-[marquee_25s_linear_infinite] items-center gap-10 whitespace-nowrap">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="flex items-center gap-10">
              <span className="font-display text-2xl font-black uppercase tracking-tight">
                Learn. Grow. Achieve.
              </span>
              <Sparkles className="h-6 w-6" />
              <span className="font-display text-2xl font-black uppercase tracking-tight">
                Your Future Starts Here.
              </span>
              <Star className="h-6 w-6" />
            </div>
          ))}
        </div>
      </section>

      {/* WHY REMON */}
      <section className="bg-[#211b16] py-20 text-white sm:py-28">
        <div className="container-page">
          <div className="grid gap-10 lg:grid-cols-[.8fr_1.2fr]">
            <div>
              <SectionLabel>Why Choose Us</SectionLabel>
              <h2 className="font-display text-4xl font-black leading-tight sm:text-5xl">
                A different
                <br />
                <span className="text-orange-400">way to learn.</span>
              </h2>
              <p className="mt-6 max-w-sm text-sm leading-8 text-stone-400">
                We focus on the things that matter most: understanding,
                consistency, guidance and real academic development.
              </p>
            </div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.15 }}
              variants={stagger}
              className="grid gap-3 sm:grid-cols-2"
            >
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={feature.number}
                    variants={reveal}
                    className="group rounded-2xl border border-white/10 bg-white/[0.035] p-6 transition duration-300 hover:-translate-y-1 hover:border-orange-400/50 hover:bg-white/[0.07]"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-display text-4xl font-black text-white/15">
                        {feature.number}
                      </span>
                      <div className="rounded-xl bg-orange-500 p-3 text-[#211b16]">
                        <Icon className="h-5 w-5" />
                      </div>
                    </div>
                    <h3 className="mt-8 text-lg font-extrabold">{feature.title}</h3>
                    <p className="mt-3 text-xs leading-7 text-stone-400">
                      {feature.description}
                    </p>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </div>
      </section>

      {/* COURSES */}
      {courses.length > 0 && (
        <section className="py-20 sm:py-28">
          <div className="container-page">
            <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
              <div>
                <SectionLabel>Explore Programs</SectionLabel>
                <h2 className="font-display text-4xl font-black tracking-tight sm:text-5xl">
                  Find your
                  <br />
                  <span className="text-orange-600">next chapter.</span>
                </h2>
              </div>
              <Link
                to="/courses"
                className="inline-flex items-center gap-2 text-sm font-black hover:text-orange-600"
              >
                View all courses <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-12 grid gap-5 md:grid-cols-3">
              {courses.map((course, index) => (
                <motion.div
                  key={course._id}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={reveal}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white transition duration-300 hover:-translate-y-2 hover:shadow-[0_25px_60px_rgba(40,25,10,.12)]"
                >
                  <div className="relative overflow-hidden bg-[#211b16] p-7 text-white">
                    <div className="absolute -right-8 -top-12 h-40 w-40 rounded-full border border-orange-400/20" />
                    <div className="absolute -right-2 -top-6 h-28 w-28 rounded-full border border-orange-400/20" />
                    <div className="relative flex items-center justify-between">
                      <span className="font-display text-5xl font-black text-white/15">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <BookOpen className="h-6 w-6 text-orange-400" />
                    </div>
                    <p className="relative mt-8 text-[9px] font-black uppercase tracking-[0.25em] text-orange-400">
                      {course.classLevel}
                    </p>
                    <h3 className="relative mt-2 font-display text-2xl font-black">
                      {course.title}
                    </h3>
                    <p className="relative mt-2 text-xs text-stone-400">
                      {course.subject}
                    </p>
                  </div>

                  <div className="flex flex-1 flex-col p-6">
                    <p className="line-clamp-3 text-sm leading-7 text-stone-600">
                      {course.description}
                    </p>
                    <div className="mt-auto flex items-end justify-between gap-3 border-t border-stone-100 pt-6">
                      <div>
                        <p className="text-[9px] font-bold uppercase tracking-widest text-stone-400">
                          Course Fee
                        </p>
                        <p className="mt-1 text-2xl font-black text-[#211b16]">
                          ৳{course.fee}
                        </p>
                      </div>
                      <Link
                        to={`/courses/${course.slug}`}
                        className="inline-flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-3 text-xs font-black text-[#211b16] transition hover:bg-orange-400"
                      >
                        Details <ArrowUpRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* LEARNING EXPERIENCE */}
      <section className="bg-[#e9dfd0] py-20 sm:py-28">
        <div className="container-page">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <SectionLabel>Our Learning System</SectionLabel>
              <h2 className="font-display text-4xl font-black leading-tight sm:text-5xl">
                Everything
                <br />
                in one
                <br />
                <span className="text-orange-600">place.</span>
              </h2>
              <p className="mt-6 max-w-lg text-sm leading-8 text-stone-600">
                A well-organized academic environment helps students and
                guardians stay informed and focused on what matters.
              </p>
              <Link
                to="/about"
                className="mt-8 inline-flex items-center gap-2 rounded-lg bg-[#211b16] px-6 py-4 text-xs font-black text-white transition hover:bg-orange-600"
              >
                Learn about REMON <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {learningPoints.map((point, index) => (
                <div
                  key={point}
                  className="rounded-xl border border-[#211b16]/10 bg-white/70 p-5 transition hover:-translate-y-1 hover:bg-white"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-display text-3xl font-black text-orange-600/30">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <CheckCircle2 className="h-5 w-5 text-orange-600" />
                  </div>
                  <p className="mt-7 text-sm font-extrabold text-[#211b16]">
                    {point}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* TEACHERS */}
      {teachers.length > 0 && (
        <section className="bg-[#f5f0e8] py-20 sm:py-28">
          <div className="container-page">
            <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
              <div>
                <SectionLabel>Meet Our Faculty</SectionLabel>
                <h2 className="font-display text-4xl font-black sm:text-5xl">
                  Guided by
                  <br />
                  <span className="text-orange-600">great teachers.</span>
                </h2>
              </div>
              <Link
                to="/teachers"
                className="inline-flex items-center gap-2 text-sm font-black hover:text-orange-600"
              >
                Meet everyone <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-12 grid gap-5 md:grid-cols-3">
              {teachers.map((teacher, index) => (
                <motion.div
                  key={teacher._id}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={reveal}
                  className="group overflow-hidden rounded-2xl border border-stone-200 bg-white transition duration-300 hover:-translate-y-2 hover:shadow-xl"
                >
                  <div className="relative h-64 overflow-hidden bg-[#211b16]">
                    {teacher.photo ? (
                      <img
                        src={teacher.photo}
                        alt={teacher.name}
                        className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-gradient-to-br from-[#211b16] to-[#56301b]">
                        <span className="font-display text-8xl font-black text-orange-400">
                          {teacher.name.charAt(0)}
                        </span>
                      </div>
                    )}
                    <span className="absolute left-4 top-4 rounded-full bg-orange-500 px-4 py-2 text-[9px] font-black uppercase tracking-widest text-[#211b16]">
                      Faculty {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <div className="p-6">
                    <h3 className="font-display text-xl font-black">
                      {teacher.name}
                    </h3>
                    <p className="mt-2 text-[10px] font-black uppercase tracking-widest text-orange-600">
                      {teacher.designation || "Instructor"}
                    </p>
                    {teacher.specialization && (
                      <p className="mt-4 text-sm leading-7 text-stone-500">
                        {teacher.specialization}
                      </p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FOUNDER */}
      <section className="overflow-hidden bg-[#211b16] py-20 text-white sm:py-28">
        <div className="container-page">
          <div className="grid gap-10 lg:grid-cols-[.65fr_1.35fr] lg:items-center">
            <div>
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-500 text-[#211b16]">
                <Quote className="h-8 w-8" />
              </div>
              <p className="mt-6 text-[10px] font-black uppercase tracking-[0.3em] text-orange-400">
                Founder's Message
              </p>
            </div>

            <div>
              <blockquote className="font-display text-2xl font-bold leading-[1.4] tracking-tight sm:text-3xl lg:text-4xl">
                “Every student has potential. Our responsibility is to
                create the environment, guidance and discipline that
                helps that potential become real.”
              </blockquote>
              <div className="mt-8 flex flex-wrap items-center justify-between gap-5 border-t border-white/10 pt-6">
                <div>
                  <p className="font-display text-lg font-black">Emon Islam</p>
                  <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-orange-400">
                    Founder & CEO
                  </p>
                </div>
                <Link
                  to="/founder"
                  className="inline-flex items-center gap-2 rounded-lg border border-white/20 px-5 py-3 text-xs font-bold transition hover:border-orange-400 hover:bg-orange-500 hover:text-[#211b16]"
                >
                  Meet the Founder <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* NOTICES */}
      {notices.length > 0 && (
        <section className="py-20 sm:py-28">
          <div className="container-page">
            <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
              <div>
                <SectionLabel>Latest Updates</SectionLabel>
                <h2 className="font-display text-4xl font-black sm:text-5xl">
                  Academy
                  <br />
                  <span className="text-orange-600">bulletin.</span>
                </h2>
              </div>
              <Link
                to="/notices"
                className="inline-flex items-center gap-2 text-sm font-black hover:text-orange-600"
              >
                All announcements <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-12 grid gap-4 md:grid-cols-3">
              {notices.map((notice, index) => (
                <Link
                  key={notice._id}
                  to={`/notices/${notice.slug}`}
                  className="group relative overflow-hidden rounded-2xl border border-stone-200 bg-white p-6 transition duration-300 hover:-translate-y-2 hover:border-orange-300 hover:shadow-xl"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-display text-5xl font-black text-orange-500/20">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <ArrowUpRight className="h-5 w-5 text-stone-400 transition group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-orange-600" />
                  </div>
                  <div className="mt-8 flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-orange-600">
                    <ShieldCheck className="h-4 w-4" />
                    {notice.category}
                  </div>
                  <h3 className="mt-4 font-display text-xl font-black leading-snug transition group-hover:text-orange-600">
                    {notice.title}
                  </h3>
                  <p className="mt-3 line-clamp-3 text-sm leading-7 text-stone-500">
                    {notice.description}
                  </p>
                  <div className="mt-7 flex items-center gap-2 text-xs font-black">
                    Read announcement <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FINAL CTA */}
      <section className="bg-orange-500 px-4 py-20 text-[#211b16] sm:py-28">
        <div className="container-page">
          <div className="grid items-center gap-10 lg:grid-cols-[1fr_auto]">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em]">
                Your Journey Starts Here
              </p>
              <h2 className="mt-5 max-w-3xl font-display text-4xl font-black leading-[1.05] tracking-tight sm:text-6xl">
                Don't just dream about success.
                <br />
                <span className="text-white">Prepare for it.</span>
              </h2>
              <p className="mt-6 max-w-xl text-sm font-medium leading-8 text-[#442512]">
                Join REMON Academy and take the next step toward a
                stronger academic future.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-3 rounded-xl bg-[#211b16] px-7 py-4 text-sm font-black text-white transition hover:-translate-y-1 hover:bg-[#38291e]"
              >
                Join REMON Academy <ArrowUpRight className="h-4 w-4" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-3 rounded-xl border-2 border-[#211b16]/30 px-7 py-4 text-sm font-black transition hover:bg-white/20"
              >
                Contact Us <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#17120e] px-4 py-10 text-white">
        <div className="container-page">
          <div className="flex flex-col justify-between gap-6 border-b border-white/10 pb-8 sm:flex-row sm:items-center">
            <Link to="/" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500 text-[#211b16]">
                <GraduationCap className="h-6 w-6" />
              </div>
              <div>
                <p className="font-display text-lg font-black">REMON ACADEMY</p>
                <p className="text-[9px] font-bold uppercase tracking-widest text-stone-500">
                  Learn. Grow. Achieve.
                </p>
              </div>
            </Link>

            <div className="flex flex-wrap gap-5 text-xs font-bold text-stone-400">
              <Link to="/about" className="hover:text-orange-400">About</Link>
              <Link to="/courses" className="hover:text-orange-400">Courses</Link>
              <Link to="/teachers" className="hover:text-orange-400">Teachers</Link>
              <Link to="/contact" className="hover:text-orange-400">Contact</Link>
            </div>
          </div>

          <div className="flex flex-col justify-between gap-3 pt-6 text-[10px] text-stone-500 sm:flex-row">
            <p>© {new Date().getFullYear()} REMON Academy. All rights reserved.</p>
            <p>Designed & Developed by Emon Islam</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
