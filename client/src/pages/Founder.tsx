import { motion } from "framer-motion";
import {
  ArrowUpRight,
  BookOpen,
  Code2,
  GraduationCap,
  Lightbulb,
  Target,
  Quote,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Founder() {
  return (
    <main className="overflow-hidden bg-[#f5f3ee] text-[#111827] dark:bg-[#080c14] dark:text-white">
      {/* ============================================================
          HERO
      ============================================================ */}
      <section className="relative overflow-hidden bg-[#101722] text-white">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute right-[-180px] top-[-180px] h-[520px] w-[520px] rounded-full border border-brand-gold/[0.08]" />

          <div className="absolute right-[-110px] top-[-110px] h-[380px] w-[380px] rounded-full border border-brand-gold/[0.05]" />

          <div className="absolute bottom-[-250px] left-[-180px] h-[500px] w-[500px] rounded-full border border-white/[0.035]" />

          <div className="absolute inset-0 opacity-[0.018] [background-image:linear-gradient(rgba(255,255,255,.8)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.8)_1px,transparent_1px)] [background-size:80px_80px]" />
        </div>

        <div className="container-page relative">
          <div className="grid min-h-[650px] items-center gap-12 py-16 lg:grid-cols-[1fr_0.85fr] lg:gap-16 lg:py-20">
            {/* LEFT */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <div className="mb-7 flex items-center gap-3">
                <span className="h-px w-12 bg-brand-gold" />

                <span className="text-[9px] font-bold uppercase tracking-[0.34em] text-brand-gold">
                  Leadership · Vision · Education
                </span>
              </div>

              <p className="text-sm font-medium uppercase tracking-[0.18em] text-slate-400">
                Founder & CEO
              </p>

              <h1 className="mt-4 font-display text-[3.5rem] font-bold leading-[0.92] tracking-[-0.055em] sm:text-6xl lg:text-[6.5rem]">
                Emon
                <br />
                <span className="text-brand-gold">
                  Islam.
                </span>
              </h1>

              <p className="mt-7 max-w-xl text-sm leading-7 text-slate-300 sm:text-base sm:leading-8">
                Founder of REMON ACADEMY, a technology-driven educational
                initiative built around meaningful learning, academic
                discipline and long-term student growth.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/courses"
                  className="group inline-flex items-center gap-3 bg-brand-gold px-6 py-3.5 text-sm font-bold text-[#101722] transition-all duration-300 hover:bg-brand-goldLight"
                >
                  Explore REMON ACADEMY

                  <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                </Link>

                <Link
                  to="/about"
                  className="inline-flex items-center gap-3 border border-white/15 px-6 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:border-brand-gold hover:text-brand-gold"
                >
                  About the Academy
                </Link>
              </div>

              <div className="mt-10 flex flex-wrap gap-6 border-t border-white/10 pt-7">
                <div>
                  <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-brand-gold">
                    Education
                  </p>

                  <p className="mt-1 text-sm font-medium text-white">
                    B.Sc. in CSE
                  </p>
                </div>

                <div className="h-10 w-px bg-white/10" />

                <div>
                  <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-brand-gold">
                    Focus
                  </p>

                  <p className="mt-1 text-sm font-medium text-white">
                    Education & Technology
                  </p>
                </div>

                <div className="h-10 w-px bg-white/10" />

                <div>
                  <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-brand-gold">
                    Role
                  </p>

                  <p className="mt-1 text-sm font-medium text-white">
                    Founder & CEO
                  </p>
                </div>
              </div>
            </motion.div>

            {/* PHOTO */}
            <motion.div
              initial={{ opacity: 0, x: 35 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="relative flex justify-center lg:justify-end"
            >
              <div className="relative w-full max-w-[430px]">
                <div className="absolute -left-5 top-8 hidden h-20 w-20 border-l border-t border-brand-gold/50 sm:block" />

                <div className="absolute -bottom-5 right-5 hidden h-20 w-20 border-b border-r border-brand-gold/50 sm:block" />

                <div className="absolute -right-8 top-1/2 hidden -translate-y-1/2 rotate-90 lg:block">
                  <span className="text-[8px] font-bold uppercase tracking-[0.35em] text-white/25">
                    FOUNDER · EDUCATOR · DEVELOPER
                  </span>
                </div>

                <div className="relative mx-auto w-[82%]">
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 font-display text-[9rem] font-bold leading-none text-white/[0.025]">
                    E
                  </div>

                  <div className="border border-brand-gold/30 bg-white/[0.025] p-1.5">
                    <div className="relative overflow-hidden bg-[#0a1019]">
                      <img
                        src="/photo/emon.png"
                        alt="Emon Islam - Founder and CEO of REMON ACADEMY"
                        className="h-[460px] w-full object-cover object-top sm:h-[560px]"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-[#101722] via-transparent to-transparent" />

                      <div className="absolute left-4 top-4 border border-white/10 bg-[#101722]/90 px-3 py-2">
                        <p className="text-[8px] font-bold uppercase tracking-[0.25em] text-brand-gold">
                          REMON ACADEMY
                        </p>
                      </div>

                      <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
                        <div className="border border-white/10 bg-[#101722]/95 p-4 sm:p-5">
                          <p className="text-[8px] font-bold uppercase tracking-[0.25em] text-brand-gold">
                            Founder & CEO
                          </p>

                          <h2 className="mt-1 font-display text-2xl font-bold sm:text-3xl">
                            Emon Islam
                          </h2>

                          <p className="mt-1 text-xs text-slate-400">
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
          INTRO
      ============================================================ */}
      <section className="bg-[#f5f3ee] py-20 dark:bg-[#080c14] sm:py-24 lg:py-28">
        <div className="container-page">
          <div className="grid gap-10 lg:grid-cols-[0.55fr_1.45fr]">
            <div>
              <p className="text-[9px] font-bold uppercase tracking-[0.35em] text-brand-gold">
                The Founder
              </p>

              <div className="mt-4 h-px w-10 bg-brand-gold" />
            </div>

            <div>
              <h2 className="max-w-5xl font-display text-2xl font-semibold leading-[1.3] tracking-tight text-[#111827] dark:text-white sm:text-3xl lg:text-[2.7rem]">
                Building an educational platform where knowledge,
                technology and purpose move together.
              </h2>

              <p className="mt-7 max-w-3xl text-sm leading-7 text-slate-500 sm:text-base sm:leading-8">
                Emon Islam founded REMON ACADEMY with a simple belief:
                students deserve more than memorization. They deserve
                clarity, guidance, discipline and an environment that
                encourages them to understand what they learn.
              </p>

              <p className="mt-5 max-w-3xl text-sm leading-7 text-slate-500 sm:text-base sm:leading-8">
                With a background in Computer Science and Engineering,
                Emon combines an academic mindset with technology to
                create a more organized and accessible learning
                experience.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          PROFILE CARDS
      ============================================================ */}
      <section className="bg-white py-20 dark:bg-slate-900 sm:py-24 lg:py-28">
        <div className="container-page">
          <div className="grid gap-px overflow-hidden border border-slate-200 bg-slate-200 dark:border-slate-800 dark:bg-slate-800 md:grid-cols-3">
            {[
              {
                icon: GraduationCap,
                title: "Academic Mindset",
                text: "Focused on building strong foundations, clear concepts and disciplined academic progress.",
              },
              {
                icon: Code2,
                title: "Technology",
                text: "Using modern technology to make educational information more organized, accessible and useful.",
              },
              {
                icon: Users,
                title: "Student First",
                text: "Every system and learning initiative is designed around the real needs of students.",
              },
            ].map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="group bg-[#faf9f6] p-8 transition-colors duration-300 hover:bg-white dark:bg-slate-950 dark:hover:bg-slate-900 sm:p-10"
                >
                  <Icon className="h-7 w-7 text-brand-gold" />

                  <h3 className="mt-8 font-display text-xl font-bold text-[#111827] dark:text-white">
                    {item.title}
                  </h3>

                  <p className="mt-4 text-sm leading-7 text-slate-500">
                    {item.text}
                  </p>

                  <div className="mt-8 h-px w-8 bg-brand-gold transition-all duration-300 group-hover:w-16" />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================================================
          EDUCATION × TECHNOLOGY
      ============================================================ */}
      <section className="bg-[#101722] py-20 text-white sm:py-24 lg:py-28">
        <div className="container-page">
          <div className="grid gap-12 lg:grid-cols-[0.75fr_1.25fr] lg:items-center lg:gap-20">
            <div>
              <div className="flex items-center gap-3">
                <Code2 className="h-5 w-5 text-brand-gold" />

                <span className="text-[9px] font-bold uppercase tracking-[0.35em] text-brand-gold">
                  Education × Technology
                </span>
              </div>

              <h2 className="mt-5 font-display text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
                Technology should
                <br />
                <span className="text-white/35">
                  improve education.
                </span>
              </h2>
            </div>

            <div>
              <p className="max-w-2xl text-sm leading-8 text-slate-400 sm:text-base">
                The vision behind REMON ACADEMY is not to replace the
                classroom with technology. It is to make the classroom
                stronger through technology.
              </p>

              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {[
                  "Digital Student Portal",
                  "Academic Performance Tracking",
                  "Organized Attendance",
                  "Transparent Fee Management",
                  "Digital Notices",
                  "Structured Academic Information",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 border border-white/10 bg-white/[0.025] px-4 py-4 text-xs font-medium text-slate-300"
                  >
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand-gold" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          LEADERSHIP PHILOSOPHY
      ============================================================ */}
      <section className="bg-[#f5f3ee] py-20 dark:bg-[#080c14] sm:py-24 lg:py-28">
        <div className="container-page">
          <div className="mb-12 max-w-2xl">
            <p className="text-[9px] font-bold uppercase tracking-[0.35em] text-brand-gold">
              Leadership Philosophy
            </p>

            <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-[#111827] dark:text-white sm:text-4xl">
              Principles behind the journey.
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {[
              {
                icon: Target,
                number: "01",
                title: "Purpose",
                text: "Education becomes meaningful when students understand why they are learning and where that knowledge can take them.",
              },
              {
                icon: Lightbulb,
                number: "02",
                title: "Clarity",
                text: "Complex ideas become easier when teaching is structured, consistent and centered around understanding.",
              },
              {
                icon: BookOpen,
                number: "03",
                title: "Growth",
                text: "Real academic progress comes from continuous practice, honest assessment and the willingness to improve.",
              },
            ].map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.number}
                  className="relative border border-slate-200 bg-white p-7 dark:border-slate-800 dark:bg-slate-900 sm:p-9"
                >
                  <div className="flex items-start justify-between">
                    <span className="font-display text-4xl font-bold text-slate-200 dark:text-slate-800">
                      {item.number}
                    </span>

                    <Icon className="h-6 w-6 text-brand-gold" />
                  </div>

                  <h3 className="mt-12 font-display text-xl font-bold text-[#111827] dark:text-white">
                    {item.title}
                  </h3>

                  <p className="mt-4 text-sm leading-7 text-slate-500">
                    {item.text}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================================================
          FOUNDER QUOTE
      ============================================================ */}
      <section className="border-y border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="container-page py-20 sm:py-24">
          <div className="grid gap-8 lg:grid-cols-[0.3fr_1.7fr]">
            <div>
              <div className="flex h-11 w-11 items-center justify-center border border-brand-gold/30">
                <Quote className="h-5 w-5 text-brand-gold" />
              </div>

              <p className="mt-4 text-[8px] font-bold uppercase tracking-[0.3em] text-brand-gold">
                Founder&apos;s Philosophy
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
          FINAL CTA
      ============================================================ */}
      <section className="bg-[#101722] py-20 text-white sm:py-24 lg:py-28">
        <div className="container-page">
          <div className="relative overflow-hidden border border-white/10 px-6 py-14 text-center sm:px-12 lg:px-20 lg:py-20">
            <div className="pointer-events-none absolute right-[-100px] top-[-100px] h-64 w-64 rounded-full border border-brand-gold/[0.08]" />

            <div className="pointer-events-none absolute bottom-[-130px] left-[-100px] h-72 w-72 rounded-full border border-white/[0.035]" />

            <div className="relative">
              <GraduationCap className="mx-auto h-7 w-7 text-brand-gold" />

              <p className="mt-5 text-[9px] font-bold uppercase tracking-[0.35em] text-brand-gold">
                The Vision Continues
              </p>

              <h2 className="mx-auto mt-4 max-w-3xl font-display text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
                Better education begins
                <br />
                with a better direction.
              </h2>

              <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-slate-400">
                Explore REMON ACADEMY and discover an educational
                environment built around knowledge, discipline and
                meaningful progress.
              </p>

              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <Link
                  to="/courses"
                  className="group inline-flex items-center justify-center gap-3 bg-brand-gold px-7 py-3.5 text-sm font-bold text-[#101722] transition-colors hover:bg-brand-goldLight"
                >
                  Explore Courses

                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
                </Link>

                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center gap-3 border border-white/15 px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:border-brand-gold hover:text-brand-gold"
                >
                  Contact REMON
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}