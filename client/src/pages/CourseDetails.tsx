import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  CheckCircle2,
  Clock3,
  GraduationCap,
  ShieldCheck,
  Users,
} from "lucide-react";

import { api, getErrorMessage } from "../services/api";
import { Course, Teacher } from "../types";
import { Loader } from "../components/Loader";
import { ErrorState } from "../components/ErrorState";
import { brand } from "../config/brand";

export default function CourseDetails() {
  const { id } = useParams();

  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");

    api
      .get(`/courses/public/${id}`)
      .then((r) => setCourse(r.data.data))
      .catch((e) => setError(getErrorMessage(e)))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <Loader label="Loading course..." />;
  }

  if (error || !course) {
    return <ErrorState message={error || "Course not found"} />;
  }

  const teacher = course.teacher as Teacher | undefined;

  return (
    <main className="bg-brand-ivory">
      {/* HERO */}
      <section className="relative overflow-hidden bg-brand-navyDark">
        <div className="absolute inset-0">
          <div className="absolute -left-24 top-16 h-72 w-72 rounded-full bg-brand-gold/10 blur-3xl" />
          <div className="absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-white/5 blur-3xl" />
        </div>

        <div className="container-page relative py-16 sm:py-20 lg:py-24">
          <Link
            to="/courses"
            className="mb-10 inline-flex items-center gap-2 text-sm font-medium text-white/60 no-underline transition-colors hover:text-brand-goldLight"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to courses
          </Link>

          <div className="max-w-4xl">
            <div className="mb-6 flex flex-wrap gap-2">
              <span className="rounded-full border border-brand-gold/30 bg-brand-gold/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-brand-goldLight">
                {course.classLevel}
              </span>

              <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-white/60">
                {course.subject}
              </span>
            </div>

            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.3em] text-brand-goldLight">
              REMON ACADEMY · Course
            </p>

            <h1 className="max-w-4xl font-display text-4xl font-semibold leading-[1.05] tracking-[-0.04em] text-white sm:text-5xl lg:text-7xl">
              {course.title}
            </h1>

            <p className="mt-7 max-w-2xl text-base leading-8 text-white/60 sm:text-lg">
              {course.description}
            </p>
          </div>
        </div>
      </section>

      {/* QUICK INFORMATION */}
      <section className="border-b border-slate-200 bg-white">
        <div className="container-page grid divide-y divide-slate-200 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          <div className="flex items-center gap-4 py-6 sm:px-8 sm:first:pl-0">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-navyDark/5">
              <Clock3 className="h-5 w-5 text-brand-navyDark" />
            </div>

            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                Duration
              </p>
              <p className="mt-1 text-sm font-semibold text-brand-navyDark">
                {course.duration}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 py-6 sm:px-8">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-navyDark/5">
              <Calendar className="h-5 w-5 text-brand-navyDark" />
            </div>

            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                Schedule
              </p>
              <p className="mt-1 text-sm font-semibold text-brand-navyDark">
                {course.schedule || "To be announced"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 py-6 sm:px-8 sm:last:pr-0">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-navyDark/5">
              <Users className="h-5 w-5 text-brand-navyDark" />
            </div>

            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                Seats
              </p>
              <p className="mt-1 text-sm font-semibold text-brand-navyDark">
                {course.seatCapacity}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <section className="container-page py-16 sm:py-20 lg:py-24">
        <div className="grid gap-10 lg:grid-cols-[1fr_380px] lg:items-start">
          {/* LEFT */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
            >
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.28em] text-brand-gold">
                What you will get
              </p>

              <h2 className="max-w-2xl font-display text-3xl font-semibold tracking-[-0.03em] text-brand-navyDark sm:text-4xl">
                A focused learning experience built around progress.
              </h2>

              <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-500">
                Every course is designed to provide structured learning,
                practical guidance and consistent academic support.
              </p>
            </motion.div>

            {course.features?.length > 0 && (
              <div className="mt-10 grid gap-4 sm:grid-cols-2">
                {course.features.map((feature, index) => (
                  <motion.div
                    key={feature}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.35,
                      delay: index * 0.05,
                    }}
                    className="rounded-2xl border border-slate-200 bg-white p-5"
                  >
                    <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-brand-navyDark">
                      <CheckCircle2 className="h-5 w-5 text-brand-goldLight" />
                    </div>

                    <p className="text-sm font-semibold leading-6 text-brand-navyDark">
                      {feature}
                    </p>
                  </motion.div>
                ))}
              </div>
            )}

            {/* INSTRUCTOR */}
            {typeof course.teacher === "object" && teacher && (
              <div className="mt-12 border-t border-slate-200 pt-10">
                <div className="mb-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-gold">
                    Course Instructor
                  </p>

                  <h2 className="mt-2 font-display text-2xl font-semibold text-brand-navyDark">
                    Learn with experienced guidance.
                  </h2>
                </div>

                <div className="flex flex-col gap-5 rounded-[2rem] border border-slate-200 bg-white p-6 sm:flex-row sm:items-center">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-brand-navyDark text-brand-goldLight">
                    <GraduationCap className="h-7 w-7" />
                  </div>

                  <div className="flex-1">
                    <h3 className="font-display text-xl font-semibold text-brand-navyDark">
                      {teacher.name}
                    </h3>

                    {teacher.designation && (
                      <p className="mt-1 text-sm font-medium text-brand-gold">
                        {teacher.designation}
                      </p>
                    )}

                    {teacher.qualification && (
                      <p className="mt-2 text-sm text-slate-500">
                        {teacher.qualification}
                      </p>
                    )}
                  </div>

                  <Link
                    to="/teachers"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-brand-navyDark no-underline hover:text-brand-gold"
                  >
                    Meet faculty
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* ENROLLMENT CARD */}
          <aside className="lg:sticky lg:top-28">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.1 }}
              className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_20px_70px_rgba(15,23,42,0.08)]"
            >
              <div className="bg-brand-navyDark p-7 sm:p-8">
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-goldLight">
                  Enrollment
                </p>

                <div className="mt-4 flex items-end gap-2">
                  <span className="font-display text-4xl font-semibold tracking-[-0.03em] text-white">
                    ৳{course.fee}
                  </span>

                  <span className="pb-1 text-sm text-white/40">
                    course fee
                  </span>
                </div>

                <p className="mt-4 text-sm leading-6 text-white/55">
                  Secure your place and begin your learning journey with{" "}
                  {brand.name}.
                </p>
              </div>

              <div className="p-7 sm:p-8">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Clock3 className="mt-0.5 h-4 w-4 shrink-0 text-brand-gold" />
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                        Duration
                      </p>
                      <p className="mt-1 text-sm font-medium text-brand-navyDark">
                        {course.duration}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Calendar className="mt-0.5 h-4 w-4 shrink-0 text-brand-gold" />
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                        Schedule
                      </p>
                      <p className="mt-1 text-sm font-medium text-brand-navyDark">
                        {course.schedule || "To be announced"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Users className="mt-0.5 h-4 w-4 shrink-0 text-brand-gold" />
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                        Available seats
                      </p>
                      <p className="mt-1 text-sm font-medium text-brand-navyDark">
                        {course.seatCapacity}
                      </p>
                    </div>
                  </div>
                </div>

                <Link
                  to="/register"
                  className="btn-primary mt-8 flex w-full items-center justify-center gap-2 no-underline"
                >
                  Enroll Now
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <div className="mt-5 flex items-center justify-center gap-2 text-center text-xs text-slate-400">
                  <ShieldCheck className="h-4 w-4 text-brand-gold" />
                  <span>Secure registration through {brand.name}</span>
                </div>
              </div>
            </motion.div>
          </aside>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="bg-brand-navyDark">
        <div className="container-page py-16 sm:py-20">
          <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-goldLight">
                Ready to begin?
              </p>

              <h2 className="mt-3 font-display text-3xl font-semibold tracking-[-0.03em] text-white sm:text-4xl">
                Take the next step toward stronger results.
              </h2>

              <p className="mt-4 text-sm leading-7 text-white/55">
                Join the course and become part of the REMON ACADEMY learning
                community.
              </p>
            </div>

            <Link
              to="/register"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-brand-gold px-7 py-3.5 text-sm font-semibold text-brand-navyDark no-underline transition-transform duration-300 hover:-translate-y-0.5"
            >
              Register Now
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

