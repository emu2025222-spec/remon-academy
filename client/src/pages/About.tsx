import { motion } from "framer-motion";
import {
  ArrowUpRight,
  BookOpen,
  Building2,
  CheckCircle2,
  Eye,
  GraduationCap,
  Target,
  TrendingUp,
  Users,
  Users2,
} from "lucide-react";
import { Link } from "react-router-dom";

import { StatCard } from "../components/StatCard";
import { brand } from "../config/brand";

export default function About() {
  const principles = [
    {
      number: "01",
      title: "Concept First",
      text: "We focus on understanding the subject before memorising answers, helping students build knowledge that lasts.",
    },
    {
      number: "02",
      title: "Consistent Practice",
      text: "Regular classes, assessments and practice create the consistency students need to improve with confidence.",
    },
    {
      number: "03",
      title: "Honest Feedback",
      text: "Students need to know where they stand. We use performance feedback to identify strengths and areas for improvement.",
    },
  ];

  const facilities = [
    "Structured classroom environment",
    "Digital notice and result system",
    "Dedicated student support",
    "Printed notes and practice materials",
    "Regular model tests and assessments",
    "Organized academic communication",
  ];

  return (
    <main className="overflow-hidden bg-[#f5f3ee] text-[#111827] dark:bg-[#080c14] dark:text-white">

      {/* ============================================================
          HERO
      ============================================================ */}

      <section className="relative overflow-hidden bg-[#101722] py-20 text-white sm:py-24 lg:py-28">

        <div className="pointer-events-none absolute right-[-150px] top-[-150px] h-[420px] w-[420px] rounded-full border border-brand-gold/[0.08]" />

        <div className="pointer-events-none absolute bottom-[-180px] left-[-130px] h-[380px] w-[380px] rounded-full border border-white/[0.04]" />

        <div className="container-page relative">

          <div className="grid gap-12 lg:grid-cols-[0.65fr_1.35fr] lg:items-end">

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55 }}
            >
              <div className="flex items-center gap-3">

                <span className="h-px w-10 bg-brand-gold" />

                <span className="text-[9px] font-bold uppercase tracking-[0.35em] text-brand-gold">
                  About REMON
                </span>

              </div>

              <p className="mt-6 max-w-xs text-sm leading-7 text-slate-400">
                A modern learning platform built around knowledge,
                discipline and measurable progress.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.08 }}
            >

              <h1 className="font-display text-4xl font-bold leading-[1.02] tracking-[-0.04em] sm:text-5xl lg:text-[5rem]">
                Education
                <br />
                <span className="text-brand-gold">
                  with intention.
                </span>
              </h1>

              <p className="mt-7 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base sm:leading-8">
                Founded in 2026, {brand.name} was created with a simple
                belief: students deserve an academic environment where
                quality teaching, regular practice and genuine guidance
                work together.
              </p>

            </motion.div>

          </div>

        </div>
      </section>

      {/* ============================================================
          INTRODUCTION
      ============================================================ */}

      <section className="bg-[#f5f3ee] py-20 dark:bg-[#080c14] sm:py-24 lg:py-28">

        <div className="container-page">

          <div className="grid gap-10 lg:grid-cols-[0.55fr_1.45fr]">

            <div>

              <p className="text-[9px] font-bold uppercase tracking-[0.35em] text-brand-gold">
                Our Story
              </p>

              <div className="mt-4 h-px w-10 bg-brand-gold" />

            </div>

            <div>

              <h2 className="max-w-5xl font-display text-2xl font-semibold leading-[1.35] tracking-tight sm:text-3xl lg:text-[2.7rem]">
                REMON ACADEMY exists to make learning more structured,
                more accessible and more meaningful for students.
              </h2>

              <p className="mt-7 max-w-3xl text-sm leading-7 text-slate-500 sm:text-base sm:leading-8">
                We do not believe in shortcuts. Real academic growth comes
                from understanding concepts, practising consistently,
                receiving honest feedback and having the right people
                around you. Our academic model is designed around those
                principles.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">

                <span className="border border-slate-300 bg-white px-4 py-2 text-[9px] font-bold uppercase tracking-[0.18em] text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
                  Knowledge
                </span>

                <span className="border border-slate-300 bg-white px-4 py-2 text-[9px] font-bold uppercase tracking-[0.18em] text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
                  Discipline
                </span>

                <span className="border border-slate-300 bg-white px-4 py-2 text-[9px] font-bold uppercase tracking-[0.18em] text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
                  Progress
                </span>

              </div>

            </div>

          </div>

        </div>
      </section>

      {/* ============================================================
          MISSION / VISION
      ============================================================ */}

      <section className="bg-white py-20 dark:bg-slate-900 sm:py-24 lg:py-28">

        <div className="container-page">

          <div className="grid gap-px overflow-hidden border border-slate-200 bg-slate-200 dark:border-slate-800 dark:bg-slate-800 md:grid-cols-2">

            <div className="group bg-[#faf9f6] p-8 transition-colors hover:bg-white dark:bg-slate-950 dark:hover:bg-slate-900 sm:p-10 lg:p-12">

              <div className="flex items-start justify-between">

                <div className="flex h-12 w-12 items-center justify-center border border-brand-gold/30">
                  <Target className="h-5 w-5 text-brand-gold" />
                </div>

                <span className="font-display text-5xl font-bold text-slate-200 dark:text-slate-800">
                  01
                </span>

              </div>

              <h2 className="mt-14 font-display text-2xl font-bold">
                Our Mission
              </h2>

              <p className="mt-4 max-w-xl text-sm leading-7 text-slate-500">
                To provide students with expert guidance, structured
                curriculum and continuous assessment so that every learner
                has a genuine opportunity to improve — regardless of where
                they begin.
              </p>

              <div className="mt-8 h-px w-10 bg-brand-gold transition-all duration-300 group-hover:w-20" />

            </div>

            <div className="group bg-[#faf9f6] p-8 transition-colors hover:bg-white dark:bg-slate-950 dark:hover:bg-slate-900 sm:p-10 lg:p-12">

              <div className="flex items-start justify-between">

                <div className="flex h-12 w-12 items-center justify-center border border-brand-gold/30">
                  <Eye className="h-5 w-5 text-brand-gold" />
                </div>

                <span className="font-display text-5xl font-bold text-slate-200 dark:text-slate-800">
                  02
                </span>

              </div>

              <h2 className="mt-14 font-display text-2xl font-bold">
                Our Vision
              </h2>

              <p className="mt-4 max-w-xl text-sm leading-7 text-slate-500">
                To build a trusted academic platform where students,
                teachers and technology work together to create a better,
                more transparent and more effective learning experience.
              </p>

              <div className="mt-8 h-px w-10 bg-brand-gold transition-all duration-300 group-hover:w-20" />

            </div>

          </div>

        </div>
      </section>

      {/* ============================================================
          STATS
      ============================================================ */}

      <section className="border-y border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">

        <div className="container-page grid grid-cols-2 md:grid-cols-4">

          <div className="border-b border-slate-200 px-4 py-8 dark:border-slate-800 md:border-b-0 md:border-r">
            <StatCard
              icon={Users}
              label="Students"
              value={500}
              suffix="+"
            />
          </div>

          <div className="border-b border-slate-200 px-4 py-8 dark:border-slate-800 md:border-b-0 md:border-r">
            <StatCard
              icon={GraduationCap}
              label="Teachers"
              value={20}
              suffix="+"
            />
          </div>

          <div className="px-4 py-8 md:border-r md:border-slate-200 dark:md:border-slate-800">
            <StatCard
              icon={BookOpen}
              label="Courses"
              value={15}
              suffix="+"
            />
          </div>

          <div className="px-4 py-8">
            <StatCard
              icon={TrendingUp}
              label="Success Rate"
              value={95}
              suffix="%"
            />
          </div>

        </div>

      </section>

      {/* ============================================================
          PRINCIPLES
      ============================================================ */}

      <section className="bg-[#101722] py-20 text-white sm:py-24 lg:py-28">

        <div className="container-page">

          <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr]">

            <div>

              <p className="text-[9px] font-bold uppercase tracking-[0.35em] text-brand-gold">
                What We Believe
              </p>

              <h2 className="mt-5 font-display text-3xl font-bold leading-tight sm:text-4xl">
                Three principles
                <br />
                guide everything.
              </h2>

              <p className="mt-6 max-w-sm text-sm leading-7 text-slate-400">
                A strong academic institution is built on more than
                classrooms. It needs a clear philosophy.
              </p>

            </div>

            <div className="border-t border-white/10">

              {principles.map((item) => (
                <div
                  key={item.number}
                  className="grid gap-5 border-b border-white/10 py-7 sm:grid-cols-[70px_1fr] sm:gap-7 sm:py-9"
                >

                  <span className="font-display text-3xl font-bold text-brand-gold/40">
                    {item.number}
                  </span>

                  <div>

                    <h3 className="font-display text-xl font-bold">
                      {item.title}
                    </h3>

                    <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400">
                      {item.text}
                    </p>

                  </div>

                </div>
              ))}

            </div>

          </div>

        </div>
      </section>

      {/* ============================================================
          FACILITIES + METHODOLOGY
      ============================================================ */}

      <section className="bg-[#f5f3ee] py-20 dark:bg-[#080c14] sm:py-24 lg:py-28">

        <div className="container-page">

          <div className="grid gap-6 lg:grid-cols-2">

            {/* Facilities */}

            <div className="border border-slate-200 bg-white p-8 dark:border-slate-800 dark:bg-slate-900 sm:p-10">

              <div className="flex items-center justify-between">

                <div className="flex h-11 w-11 items-center justify-center border border-brand-gold/30">
                  <Building2 className="h-5 w-5 text-brand-gold" />
                </div>

                <span className="font-display text-5xl font-bold text-slate-100 dark:text-slate-800">
                  01
                </span>

              </div>

              <h2 className="mt-12 font-display text-2xl font-bold">
                Facilities
              </h2>

              <p className="mt-3 text-sm leading-7 text-slate-500">
                Everything students need for a focused and organized
                academic experience.
              </p>

              <div className="mt-7 space-y-3">

                {facilities.map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 border-b border-slate-100 pb-3 text-sm text-slate-600 last:border-0 dark:border-slate-800 dark:text-slate-300"
                  >
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-brand-gold" />
                    {item}
                  </div>
                ))}

              </div>

            </div>

            {/* Methodology */}

            <div className="border border-slate-200 bg-white p-8 dark:border-slate-800 dark:bg-slate-900 sm:p-10">

              <div className="flex items-center justify-between">

                <div className="flex h-11 w-11 items-center justify-center border border-brand-gold/30">
                  <Users2 className="h-5 w-5 text-brand-gold" />
                </div>

                <span className="font-display text-5xl font-bold text-slate-100 dark:text-slate-800">
                  02
                </span>

              </div>

              <h2 className="mt-12 font-display text-2xl font-bold">
                Teaching Methodology
              </h2>

              <p className="mt-4 text-sm leading-7 text-slate-500">
                Our teaching approach combines conceptual learning with
                regular practice, assessment and feedback.
              </p>

              <div className="mt-8 space-y-5">

                <div className="border-l-2 border-brand-gold pl-5">

                  <p className="text-xs font-bold uppercase tracking-[0.15em] text-brand-gold">
                    Learn
                  </p>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Understand the concept through structured classroom
                    teaching.
                  </p>

                </div>

                <div className="border-l-2 border-brand-gold/60 pl-5">

                  <p className="text-xs font-bold uppercase tracking-[0.15em] text-brand-gold">
                    Practice
                  </p>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Strengthen understanding through exercises and model
                    tests.
                  </p>

                </div>

                <div className="border-l-2 border-brand-gold/30 pl-5">

                  <p className="text-xs font-bold uppercase tracking-[0.15em] text-brand-gold">
                    Improve
                  </p>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Use performance feedback to identify weaknesses and
                    improve continuously.
                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>
      </section>

      {/* ============================================================
          QUOTE
      ============================================================ */}

      <section className="border-y border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">

        <div className="container-page py-20 sm:py-24 lg:py-28">

          <div className="mx-auto max-w-4xl text-center">

            <div className="mx-auto flex h-11 w-11 items-center justify-center border border-brand-gold/30">
              <Target className="h-5 w-5 text-brand-gold" />
            </div>

            <blockquote className="mt-8 font-display text-2xl font-semibold leading-[1.4] tracking-tight sm:text-3xl lg:text-4xl">
              “Our commitment is simple — every student who walks through
              our doors deserves a genuine chance to succeed.”
            </blockquote>

            <div className="mt-7 flex items-center justify-center gap-3">

              <span className="h-px w-8 bg-brand-gold" />

              <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-slate-500">
                Director · {brand.name}
              </span>

              <span className="h-px w-8 bg-brand-gold" />

            </div>

          </div>

        </div>
      </section>

      {/* ============================================================
          CTA
      ============================================================ */}

      <section className="bg-[#101722] py-20 text-white sm:py-24">

        <div className="container-page">

          <div className="relative overflow-hidden border border-white/10 px-6 py-14 text-center sm:px-12 lg:px-20">

            <div className="pointer-events-none absolute right-[-100px] top-[-100px] h-64 w-64 rounded-full border border-brand-gold/[0.08]" />

            <div className="relative">

              <p className="text-[9px] font-bold uppercase tracking-[0.35em] text-brand-gold">
                Start Your Journey
              </p>

              <h2 className="mx-auto mt-4 max-w-2xl font-display text-3xl font-bold sm:text-4xl">
                Ready to learn with purpose?
              </h2>

              <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-slate-400">
                Explore our academic programs and find the right path
                for your next step.
              </p>

              <Link
                to="/courses"
                className="group mt-8 inline-flex items-center gap-3 bg-brand-gold px-7 py-3.5 text-sm font-bold text-[#101722] transition-colors hover:bg-brand-goldLight"
              >
                Explore Courses

                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
              </Link>

            </div>

          </div>

        </div>
      </section>

    </main>
  );
}

