
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  BookMarked,
  CheckCircle2,
  GraduationCap,
  Lightbulb,
  Target,
  Trophy,
  Users,
  ShieldCheck,
  Sparkles,
  Laptop,
  ClipboardCheck,
  Star,
  Quote,
  Award,
} from "lucide-react";

import { api } from "../services/api";
import type { Course, Teacher, Notice } from "../types";
import { StatCard } from "../components/StatCard";
import { brand } from "../config/brand";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const features = [
  {
    icon: Lightbulb,
    title: "Concept-Based Learning",
    description:
      "Build a strong understanding of every subject through clear explanations and meaningful learning.",
    number: "01",
  },
  {
    icon: Target,
    title: "Focused Preparation",
    description:
      "Stay focused on academic goals with structured lessons, regular practice and proper guidance.",
    number: "02",
  },
  {
    icon: Trophy,
    title: "Academic Excellence",
    description:
      "Develop confidence, discipline and the skills needed to achieve your academic goals.",
    number: "03",
  },
  {
    icon: Laptop,
    title: "Digital Learning Support",
    description:
      "Access organized academic information and stay connected with your learning journey.",
    number: "04",
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

function SectionHeading({
  eyebrow,
  title,
  highlight,
  description,
  centered = false,
}: {
  eyebrow: string;
  title: string;
  highlight?: string;
  description?: string;
  centered?: boolean;
}) {
  return (
    <div className={`max-w-2xl ${centered ? "mx-auto text-center" : ""}`}>
      <div
        className={`mb-4 inline-flex items-center gap-2 rounded-full border border-[#c9a24b]/25 bg-[#c9a24b]/10 px-4 py-2 text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#98752e] ${
          centered ? "justify-center" : ""
        }`}
      >
        <Sparkles className="h-3.5 w-3.5" />
        {eyebrow}
      </div>

      <h2 className="font-display text-3xl font-bold leading-tight tracking-tight text-[#0b1f4d] sm:text-4xl lg:text-5xl">
        {title}{" "}
        {highlight && (
          <span className="text-[#b18a3d]">{highlight}</span>
        )}
      </h2>

      {description && (
        <p className="mt-5 max-w-xl text-sm leading-8 text-slate-500 sm:text-base">
          {description}
        </p>
      )}
    </div>
  );
}

function HeroVisual() {
  return (
    <div className="relative mx-auto w-full max-w-[500px]">
      <div className="absolute inset-8 rounded-full bg-[#c9a24b]/20 blur-3xl" />

      <div className="relative overflow-hidden rounded-[30px] border border-[#c9a24b]/20 bg-white p-5 shadow-[0_30px_90px_rgba(11,31,77,0.12)] sm:p-8">
        <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full border-[35px] border-[#c9a24b]/10" />

        <div className="relative">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#b18a3d]">
                Your Learning Journey
              </p>
              <h3 className="mt-2 font-display text-xl font-bold text-[#0b1f4d]">
                Learn Something New
              </h3>
            </div>

            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#0b1f4d] text-[#e0c179] shadow-lg">
              <GraduationCap className="h-6 w-6" />
            </div>
          </div>

          <div className="relative mt-8 flex min-h-[230px] items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-[#071535] via-[#0b1f4d] to-[#173568] p-6 text-white">
            <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full border border-[#e0c179]/20" />
            <div className="absolute -bottom-20 -left-10 h-52 w-52 rounded-full border border-white/10" />

            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="relative text-center"
            >
              <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-[28px] border border-[#e0c179]/30 bg-white/10 text-[#e0c179] shadow-2xl backdrop-blur">
                <BookOpen className="h-12 w-12" />
              </div>

              <p className="mt-5 font-display text-2xl font-bold">
                Learn. Grow. Achieve.
              </p>

              <p className="mt-2 text-xs text-slate-300">
                Your future begins with knowledge.
              </p>
            </motion.div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-slate-100 bg-[#f8f7f4] p-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0b1f4d] text-[#e0c179]">
                <BookMarked className="h-5 w-5" />
              </div>
              <p className="mt-3 text-sm font-bold text-[#0b1f4d]">
                Quality Lessons
              </p>
              <p className="mt-1 text-[10px] text-slate-400">
                Learn with clarity
              </p>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-[#f8f7f4] p-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#c9a24b]/15 text-[#98752e]">
                <Award className="h-5 w-5" />
              </div>
              <p className="mt-3 text-sm font-bold text-[#0b1f4d]">
                Better Results
              </p>
              <p className="mt-1 text-[10px] text-slate-400">
                Grow with confidence
              </p>
            </div>
          </div>
        </div>
      </div>

      <motion.div
        animate={{ y: [0, -9, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute -left-4 top-[27%] hidden items-center gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-xl sm:flex"
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
          <CheckCircle2 className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xs font-bold text-[#0b1f4d]">Keep Improving</p>
          <p className="mt-1 text-[10px] text-slate-400">
            Every day matters
          </p>
        </div>
      </motion.div>

      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 4.5, repeat: Infinity }}
        className="absolute -right-3 bottom-[18%] hidden items-center gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-xl sm:flex"
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#c9a24b]/15 text-[#98752e]">
          <Star className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xs font-bold text-[#0b1f4d]">Stay Inspired</p>
          <p className="mt-1 text-[10px] text-slate-400">
            Reach your goals
          </p>
        </div>
      </motion.div>
    </div>
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

  return (
    <main className="overflow-hidden bg-[#f8f7f4] text-slate-800">
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#f8f7f4] via-white to-[#f3efe4]">
        <div className="pointer-events-none absolute -right-40 -top-40 h-[550px] w-[550px] rounded-full bg-[#c9a24b]/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 left-0 h-[400px] w-[400px] rounded-full bg-[#0b1f4d]/5 blur-3xl" />

        <div className="container-page relative grid items-center gap-14 py-16 sm:py-20 lg:grid-cols-[1.05fr_.95fr] lg:py-24">
          <motion.div initial="hidden" animate="visible" variants={stagger}>
            <motion.div variants={fadeUp}>
              <span className="inline-flex items-center gap-2 rounded-full border border-[#c9a24b]/30 bg-white px-4 py-2 text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#98752e] shadow-sm">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Welcome to {brand.name}
              </span>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="mt-8 max-w-3xl font-display text-5xl font-bold leading-[1.08] tracking-[-0.045em] text-[#0b1f4d] sm:text-6xl lg:text-[4.5rem]"
            >
              Building
              <br />
              Knowledge.
              <br />
              <span className="text-[#b18a3d]">Shaping Futures.</span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="mt-7 max-w-xl text-sm leading-8 text-slate-500 sm:text-base"
            >
              A better learning environment begins with the right guidance.
              At {brand.name}, we help students build knowledge, develop
              confidence and move towards a brighter academic future.
            </motion.p>

            <motion.div
              variants={fadeUp}
              className="mt-9 flex flex-col gap-3 sm:flex-row"
            >
              <Link
                to="/courses"
                className="group inline-flex items-center justify-center gap-3 rounded-xl bg-[#0b1f4d] px-7 py-4 text-sm font-bold text-white shadow-lg shadow-[#0b1f4d]/15 transition hover:-translate-y-1 hover:bg-[#071535]"
              >
                Explore Courses
                <ArrowUpRight className="h-4 w-4 transition group-hover:-translate-y-1 group-hover:translate-x-1" />
              </Link>

              <Link
                to="/about"
                className="inline-flex items-center justify-center gap-3 rounded-xl border border-[#c9a24b]/50 bg-white px-7 py-4 text-sm font-bold text-[#0b1f4d] transition hover:border-[#c9a24b] hover:bg-[#c9a24b]/10"
              >
                Discover Academy
                <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>

            <motion.div
              variants={fadeUp}
              className="mt-9 flex flex-wrap gap-x-7 gap-y-3 text-xs font-medium text-slate-500"
            >
              <span className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#b18a3d]" />
                Learn with confidence
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#b18a3d]" />
                Grow with purpose
              </span>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.94, x: 25 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <HeroVisual />
          </motion.div>
        </div>

        <div className="container-page relative pb-8">
          <div className="flex items-center justify-between border-t border-[#c9a24b]/25 pt-5 text-[9px] font-extrabold uppercase tracking-[0.22em] text-slate-400">
            <span>Learn · Grow · Achieve</span>
            <span>Education · Excellence</span>
          </div>
        </div>
      </section>

      {/* STATISTICS */}
      <section className="relative z-10 border-y border-slate-100 bg-white">
        <div className="container-page grid grid-cols-2 md:grid-cols-4">
          <div className="border-b border-slate-100 px-4 py-7 md:border-b-0 md:border-r">
            <StatCard icon={Users} label="Students" value={stats.totalStudents} suffix="+" />
          </div>
          <div className="border-b border-slate-100 px-4 py-7 md:border-b-0 md:border-r">
            <StatCard icon={GraduationCap} label="Teachers" value={stats.totalTeachers} suffix="+" />
          </div>
          <div className="border-r border-slate-100 px-4 py-7">
            <StatCard icon={BookOpen} label="Courses" value={stats.totalCourses} suffix="+" />
          </div>
          <div className="px-4 py-7">
            <StatCard icon={Trophy} label="Successful Students" value={stats.successfulStudents} suffix="+" />
          </div>
        </div>
      </section>

      {/* INTRODUCTION */}
      <section className="bg-white py-20 sm:py-28">
        <div className="container-page grid items-center gap-12 lg:grid-cols-2">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <SectionHeading
              eyebrow="About Our Academy"
              title="Education is the"
              highlight="foundation of success."
              description="We believe every student deserves the opportunity to learn, improve and achieve. Our goal is to create a supportive academic environment where learning becomes a meaningful journey."
            />

            <Link
              to="/about"
              className="mt-8 inline-flex items-center gap-3 rounded-xl bg-[#0b1f4d] px-6 py-4 text-sm font-bold text-white transition hover:bg-[#071535]"
            >
              Discover Our Story
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="grid grid-cols-2 gap-4"
          >
            <div className="rounded-3xl bg-[#0b1f4d] p-7 text-white sm:p-9">
              <GraduationCap className="h-9 w-9 text-[#e0c179]" />
              <h3 className="mt-12 font-display text-2xl font-bold">
                Learn Better
              </h3>
              <p className="mt-3 text-xs leading-7 text-slate-300">
                Build knowledge through structured academic guidance.
              </p>
            </div>

            <div className="mt-10 rounded-3xl border border-slate-100 bg-[#f8f7f4] p-7 sm:p-9">
              <Target className="h-9 w-9 text-[#b18a3d]" />
              <h3 className="mt-12 font-display text-2xl font-bold text-[#0b1f4d]">
                Aim Higher
              </h3>
              <p className="mt-3 text-xs leading-7 text-slate-500">
                Stay focused and work towards meaningful goals.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-100 bg-[#f8f7f4] p-7 sm:p-9">
              <Users className="h-9 w-9 text-[#b18a3d]" />
              <h3 className="mt-12 font-display text-2xl font-bold text-[#0b1f4d]">
                Grow Together
              </h3>
              <p className="mt-3 text-xs leading-7 text-slate-500">
                Learn in a supportive academic environment.
              </p>
            </div>

            <div className="mt-10 rounded-3xl border border-[#c9a24b]/20 bg-[#f4efe2] p-7 sm:p-9">
              <Trophy className="h-9 w-9 text-[#98752e]" />
              <h3 className="mt-12 font-display text-2xl font-bold text-[#0b1f4d]">
                Achieve More
              </h3>
              <p className="mt-3 text-xs leading-7 text-slate-500">
                Turn consistent effort into academic progress.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="bg-[#f8f7f4] py-20 sm:py-28">
        <div className="container-page">
          <SectionHeading
            centered
            eyebrow="Why Choose REMON"
            title="A smarter way"
            highlight="to learn."
            description="We bring together the essential elements of a positive learning experience."
          />

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            variants={stagger}
            className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
          >
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <motion.div
                  key={feature.title}
                  variants={fadeUp}
                  className="group rounded-2xl border border-slate-100 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-2 hover:border-[#c9a24b]/40 hover:shadow-xl"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0b1f4d] text-[#e0c179] transition group-hover:bg-[#c9a24b] group-hover:text-white">
                    <Icon className="h-7 w-7" />
                  </div>

                  <span className="mt-7 block text-[10px] font-black uppercase tracking-widest text-[#c9a24b]">
                    {feature.number}
                  </span>

                  <h3 className="mt-3 font-display text-lg font-bold text-[#0b1f4d]">
                    {feature.title}
                  </h3>

                  <p className="mt-3 text-xs leading-7 text-slate-500">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* COURSES */}
      {courses.length > 0 && (
        <section className="bg-white py-20 sm:py-28">
          <div className="container-page">
            <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
              <SectionHeading
                eyebrow="Our Academic Programs"
                title="Explore our"
                highlight="courses."
                description="Find the right academic program and take your next step towards learning."
              />

              <Link
                to="/courses"
                className="inline-flex items-center gap-2 text-sm font-bold text-[#98752e] transition hover:gap-4"
              >
                View All Courses
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-12 grid gap-5 md:grid-cols-3">
              {courses.map((course, index) => (
                <motion.div
                  key={course._id}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  className="group overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition duration-300 hover:-translate-y-2 hover:border-[#c9a24b]/40 hover:shadow-xl"
                >
                  <div className="relative overflow-hidden bg-gradient-to-br from-[#071535] to-[#173568] p-7 text-white">
                    <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full border-[20px] border-[#e0c179]/10" />

                    <div className="relative flex items-center justify-between">
                      <span className="font-display text-5xl font-bold text-white/15">
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#e0c179]/30 bg-white/10 text-[#e0c179]">
                        <BookOpen className="h-6 w-6" />
                      </div>
                    </div>

                    <p className="relative mt-7 text-[10px] font-bold uppercase tracking-[0.2em] text-[#e0c179]">
                      {course.classLevel}
                    </p>

                    <h3 className="relative mt-2 font-display text-2xl font-bold">
                      {course.title}
                    </h3>

                    <p className="relative mt-2 text-xs text-slate-300">
                      {course.subject}
                    </p>
                  </div>

                  <div className="flex flex-1 flex-col p-6">
                    <p className="line-clamp-3 min-h-[72px] text-sm leading-7 text-slate-500">
                      {course.description}
                    </p>

                    <div className="mt-6 flex items-center justify-between gap-3 border-t border-slate-100 pt-5">
                      <div>
                        <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">
                          Course Fee
                        </p>
                        <p className="mt-1 text-xl font-bold text-[#0b1f4d]">
                          ৳{course.fee}
                        </p>
                      </div>

                      <Link
                        to={`/courses/${course.slug}`}
                        className="inline-flex items-center gap-2 rounded-lg bg-[#f4efe2] px-4 py-3 text-xs font-bold text-[#98752e] transition hover:bg-[#0b1f4d] hover:text-white"
                      >
                        Details
                        <ArrowUpRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* LEARNING SYSTEM */}
      <section className="bg-[#f8f7f4] py-20 sm:py-28">
        <div className="container-page grid items-center gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading
              eyebrow="Our Learning Experience"
              title="Everything students"
              highlight="need to grow."
              description="A well-organized academic environment helps students and guardians stay informed and focused on what matters."
            />

            <div className="mt-9 grid gap-4 sm:grid-cols-2">
              {learningPoints.map((point) => (
                <div key={point} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#b18a3d]" />
                  <span className="text-sm font-semibold text-slate-700">
                    {point}
                  </span>
                </div>
              ))}
            </div>

            <Link
              to="/about"
              className="mt-9 inline-flex items-center gap-3 rounded-xl bg-[#0b1f4d] px-6 py-4 text-sm font-bold text-white shadow-lg transition hover:bg-[#071535]"
            >
              Learn About Us
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="relative">
            <div className="absolute inset-5 rounded-full bg-[#c9a24b]/15 blur-3xl" />

            <div className="relative rounded-[30px] border border-slate-100 bg-white p-6 shadow-xl sm:p-9">
              <div className="flex items-center justify-between border-b border-slate-100 pb-5">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#98752e]">
                    Academic Environment
                  </p>
                  <h3 className="mt-2 text-xl font-bold text-[#0b1f4d]">
                    Your Progress Matters
                  </h3>
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f4efe2] text-[#98752e]">
                  <ClipboardCheck className="h-6 w-6" />
                </div>
              </div>

              <div className="space-y-4 py-7">
                {[
                  ["Learning & Understanding", "Build strong foundations", "bg-[#0b1f4d]"],
                  ["Practice & Assessment", "Improve through consistency", "bg-[#98752e]"],
                  ["Guidance & Support", "Stay on the right path", "bg-slate-600"],
                ].map(([title, subtitle, color], index) => (
                  <div
                    key={title}
                    className="flex items-center gap-4 rounded-2xl bg-[#f8f7f4] p-4"
                  >
                    <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${color} text-white`}>
                      {index === 0 ? (
                        <BookOpen className="h-5 w-5" />
                      ) : index === 1 ? (
                        <Target className="h-5 w-5" />
                      ) : (
                        <Users className="h-5 w-5" />
                      )}
                    </div>

                    <div>
                      <p className="text-sm font-bold text-[#0b1f4d]">
                        {title}
                      </p>
                      <p className="mt-1 text-xs text-slate-400">
                        {subtitle}
                      </p>
                    </div>

                    <CheckCircle2 className="ml-auto h-5 w-5 shrink-0 text-emerald-500" />
                  </div>
                ))}
              </div>

              <div className="rounded-2xl bg-gradient-to-r from-[#071535] to-[#173568] p-5 text-white">
                <div className="flex items-center gap-3">
                  <GraduationCap className="h-7 w-7 shrink-0 text-[#e0c179]" />
                  <div>
                    <p className="text-sm font-bold">Learn. Grow. Achieve.</p>
                    <p className="mt-1 text-[10px] text-slate-300">
                      Make every learning moment count.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TEACHERS */}
      {teachers.length > 0 && (
        <section className="bg-white py-20 sm:py-28">
          <div className="container-page">
            <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
              <SectionHeading
                eyebrow="Meet Our Faculty"
                title="Learn from"
                highlight="dedicated teachers."
                description="Meet the people who guide, support and inspire students throughout their academic journey."
              />

              <Link
                to="/teachers"
                className="inline-flex items-center gap-2 text-sm font-bold text-[#98752e] transition hover:gap-4"
              >
                Meet Our Teachers
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-12 grid gap-5 md:grid-cols-3">
              {teachers.map((teacher, index) => (
                <motion.div
                  key={teacher._id}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  className="group overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition duration-300 hover:-translate-y-2 hover:border-[#c9a24b]/40 hover:shadow-xl"
                >
                  <div className="relative h-64 overflow-hidden bg-gradient-to-br from-[#f4efe2] to-[#e9e3d5]">
                    {teacher.photo ? (
                      <img
                        src={teacher.photo}
                        alt={teacher.name}
                        className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <span className="font-display text-8xl font-bold text-[#0b1f4d]/40">
                          {teacher.name.charAt(0)}
                        </span>
                      </div>
                    )}

                    <span className="absolute left-4 top-4 rounded-full border border-white/70 bg-white/90 px-4 py-2 text-[9px] font-bold uppercase tracking-widest text-[#98752e] backdrop-blur">
                      Faculty 0{index + 1}
                    </span>
                  </div>

                  <div className="p-6">
                    <h3 className="font-display text-xl font-bold text-[#0b1f4d]">
                      {teacher.name}
                    </h3>

                    <p className="mt-2 text-[10px] font-bold uppercase tracking-widest text-[#98752e]">
                      {teacher.designation || "Instructor"}
                    </p>

                    {teacher.specialization && (
                      <p className="mt-4 text-sm leading-7 text-slate-500">
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

      {/* FOUNDER MESSAGE */}
      <section className="bg-[#f8f7f4] py-20 sm:py-28">
        <div className="container-page">
          <div className="relative overflow-hidden rounded-[30px] bg-gradient-to-br from-[#071535] to-[#173568] p-8 text-white sm:p-12 lg:p-16">
            <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full border-[35px] border-[#e0c179]/10" />
            <div className="absolute -bottom-32 right-1/4 h-72 w-72 rounded-full bg-white/5 blur-2xl" />

            <div className="relative grid gap-10 lg:grid-cols-[auto_1fr] lg:items-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-[#e0c179]/30 bg-white/10 text-[#e0c179]">
                <Quote className="h-8 w-8" />
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#e0c179]">
                  A Message from the Founder
                </p>

                <blockquote className="mt-6 max-w-4xl font-display text-2xl font-bold leading-relaxed sm:text-3xl">
                  “Every student has potential. Our responsibility is to
                  create an environment where that potential can grow
                  through knowledge, guidance and dedication.”
                </blockquote>

                <div className="mt-9 flex flex-wrap items-center justify-between gap-5 border-t border-white/20 pt-7">
                  <div>
                    <p className="font-display text-xl font-bold">
                      Emon Islam
                    </p>
                    <p className="mt-1 text-xs font-semibold text-slate-300">
                      Founder & CEO
                    </p>
                  </div>

                  <Link
                    to="/founder"
                    className="inline-flex items-center gap-3 rounded-xl bg-[#e0c179] px-6 py-4 text-xs font-bold text-[#071535] transition hover:-translate-y-1 hover:bg-white"
                  >
                    Meet the Founder
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* NOTICES */}
      {notices.length > 0 && (
        <section className="bg-white py-20 sm:py-28">
          <div className="container-page">
            <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
              <SectionHeading
                eyebrow="Latest Updates"
                title="What's happening"
                highlight="at REMON."
                description="Stay updated with the latest academy announcements and important information."
              />

              <Link
                to="/notices"
                className="inline-flex items-center gap-2 text-sm font-bold text-[#98752e] transition hover:gap-4"
              >
                View All Notices
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-12 grid gap-5 md:grid-cols-3">
              {notices.map((notice, index) => (
                <Link
                  key={notice._id}
                  to={`/notices/${notice.slug}`}
                  className="group rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-2 hover:border-[#c9a24b]/40 hover:shadow-xl"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#0b1f4d] text-[#e0c179]">
                      <BookMarked className="h-6 w-6" />
                    </div>

                    <span className="font-display text-3xl font-bold text-slate-100">
                      0{index + 1}
                    </span>
                  </div>

                  <div className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#f4efe2] px-3 py-1.5 text-[9px] font-bold uppercase tracking-widest text-[#98752e]">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    {notice.category}
                  </div>

                  <h3 className="mt-4 font-display text-lg font-bold leading-snug text-[#0b1f4d] transition group-hover:text-[#98752e]">
                    {notice.title}
                  </h3>

                  <p className="mt-3 line-clamp-3 text-sm leading-7 text-slate-500">
                    {notice.description}
                  </p>

                  <div className="mt-7 flex items-center gap-2 border-t border-slate-100 pt-5 text-xs font-bold text-[#98752e]">
                    Read Announcement
                    <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FINAL CTA */}
      <section className="bg-[#f8f7f4] px-4 py-20 sm:py-28">
        <div className="container-page">
          <div className="relative overflow-hidden rounded-[30px] bg-[#f0eadb] px-7 py-14 sm:px-12 lg:px-16">
            <div className="absolute -right-20 -top-24 h-80 w-80 rounded-full bg-[#c9a24b]/20 blur-3xl" />

            <div className="relative grid items-center gap-9 lg:grid-cols-[1fr_auto]">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#98752e]">
                  Your Journey Starts Here
                </p>

                <h2 className="mt-5 max-w-3xl font-display text-3xl font-bold leading-tight text-[#0b1f4d] sm:text-5xl">
                  Your future is full of possibilities.
                  <span className="text-[#b18a3d]"> Start today.</span>
                </h2>

                <p className="mt-5 max-w-xl text-sm leading-8 text-slate-500">
                  Take the next step towards a stronger academic future
                  with REMON Academy.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center gap-3 rounded-xl bg-[#0b1f4d] px-7 py-4 text-sm font-bold text-white shadow-lg transition hover:-translate-y-1 hover:bg-[#071535]"
                >
                  Join REMON Academy
                  <ArrowUpRight className="h-4 w-4" />
                </Link>

                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center gap-3 rounded-xl border border-[#c9a24b]/50 bg-white px-7 py-4 text-sm font-bold text-[#0b1f4d] transition hover:border-[#c9a24b] hover:bg-[#c9a24b]/10"
                >
                  Contact Us
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
