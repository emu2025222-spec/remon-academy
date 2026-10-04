import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { BookOpen, Users, GraduationCap, TrendingUp, ArrowRight, Star, CheckCircle2 } from "lucide-react";
import { api } from "../services/api";
import { Course, Teacher, Notice } from "../types";
import { StatCard } from "../components/StatCard";
import { Card } from "../components/Card";
import { brand } from "../config/brand";

export default function Home() {
  const [stats, setStats] = useState({ totalStudents: 0, totalTeachers: 0, totalCourses: 0, successfulStudents: 0 });
  const [courses, setCourses] = useState<Course[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);

  useEffect(() => {
    api.get("/dashboard/public-stats").then((r) => setStats(r.data.data)).catch(() => {});
    api.get("/courses/public").then((r) => setCourses(r.data.data.slice(0, 3))).catch(() => {});
    api.get("/teachers/public").then((r) => setTeachers(r.data.data.slice(0, 3))).catch(() => {});
    api.get("/notices/public").then((r) => setNotices(r.data.data.slice(0, 3))).catch(() => {});
  }, []);

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-navy to-brand-navyDark py-20 text-white">
        <motion.div
          className="absolute -top-10 right-10 hidden text-brand-gold/20 md:block"
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 6, repeat: Infinity }}
        >
          <BookOpen size={140} />
        </motion.div>
        <motion.div
          className="absolute bottom-0 left-10 hidden text-brand-gold/10 md:block"
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
        >
          <GraduationCap size={160} />
        </motion.div>

        <div className="container-page relative grid items-center gap-10 md:grid-cols-2">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
            <span className="mb-4 inline-block rounded-full bg-brand-gold/20 px-4 py-1 text-sm font-medium text-brand-goldLight">
              Est. 2026 · Dhaka, Bangladesh
            </span>
            <h1 className="font-display text-4xl font-bold leading-tight md:text-5xl">{brand.tagline}</h1>
            <p className="mt-4 text-lg text-slate-300">
              {brand.name} provides expert, result-oriented coaching for SSC, HSC, and university admission
              candidates — combining experienced teachers, structured courses, and real academic outcomes.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/courses" className="btn-primary bg-brand-gold hover:bg-brand-goldLight">
                Explore Courses <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/login" className="btn-secondary border-white text-white hover:bg-white hover:text-brand-navy">
                Student Login
              </Link>
            </div>
          </motion.div>

          <motion.div
            className="relative mx-auto hidden h-72 w-72 items-center justify-center rounded-full bg-white/5 md:flex"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 30, repeat: Infinity, ease: "linear" }}>
              <GraduationCap className="h-40 w-40 text-brand-gold" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* STATS */}
      <section className="container-page -mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard icon={Users} label="Total Students" value={stats.totalStudents} suffix="+" />
        <StatCard icon={GraduationCap} label="Experienced Teachers" value={stats.totalTeachers} suffix="+" />
        <StatCard icon={BookOpen} label="Courses" value={stats.totalCourses} suffix="+" />
        <StatCard icon={TrendingUp} label="Successful Students" value={stats.successfulStudents} suffix="+" />
      </section>

      {/* WHY CHOOSE US */}
      <section className="container-page py-20">
        <div className="mb-12 text-center">
          <h2 className="font-display text-3xl font-bold text-brand-navy dark:text-white">Why Choose {brand.name}</h2>
          <p className="mt-2 text-slate-500">A structured, honest approach to real academic results.</p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { title: "Expert Teachers", desc: "Subject specialists with years of board and admission exam experience." },
            { title: "Regular Assessment", desc: "Weekly model tests and detailed performance tracking for every student." },
            { title: "Modern Facilities", desc: "Well-equipped classrooms, digital notices, and a dedicated student dashboard." },
          ].map((item, i) => (
            <Card key={item.title} delay={i * 0.1}>
              <CheckCircle2 className="mb-3 h-8 w-8 text-brand-gold" />
              <h3 className="font-display text-lg font-semibold text-brand-navy dark:text-white">{item.title}</h3>
              <p className="mt-2 text-sm text-slate-500">{item.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* POPULAR COURSES */}
      {courses.length > 0 && (
        <section className="bg-slate-50 py-20 dark:bg-slate-900/50">
          <div className="container-page">
            <div className="mb-10 flex items-center justify-between">
              <h2 className="font-display text-3xl font-bold text-brand-navy dark:text-white">Popular Courses</h2>
              <Link to="/courses" className="text-sm font-semibold text-brand-gold hover:underline">View all →</Link>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {courses.map((c, i) => (
                <Card key={c._id} delay={i * 0.1} className="flex flex-col">
                  <h3 className="font-display text-lg font-semibold text-brand-navy dark:text-white">{c.title}</h3>
                  <p className="mt-2 line-clamp-2 text-sm text-slate-500">{c.description}</p>
                  <div className="mt-4 flex items-center justify-between text-sm">
                    <span className="font-bold text-brand-gold">৳{c.fee}</span>
                    <Link to={`/courses/${c.slug}`} className="font-semibold text-brand-navy hover:underline dark:text-brand-goldLight">
                      Details →
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* TEACHERS */}
      {teachers.length > 0 && (
        <section className="container-page py-20">
          <div className="mb-10 text-center">
            <h2 className="font-display text-3xl font-bold text-brand-navy dark:text-white">Meet Our Teachers</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {teachers.map((t, i) => (
              <Card key={t._id} delay={i * 0.1} className="text-center">
                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-brand-navy/10 text-2xl font-bold text-brand-navy dark:text-brand-goldLight">
                  {t.name.charAt(0)}
                </div>
                <h3 className="font-semibold text-brand-navy dark:text-white">{t.name}</h3>
                <p className="text-sm text-slate-500">{t.designation}</p>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* NOTICES */}
      {notices.length > 0 && (
        <section className="bg-slate-50 py-20 dark:bg-slate-900/50">
          <div className="container-page">
            <div className="mb-10 flex items-center justify-between">
              <h2 className="font-display text-3xl font-bold text-brand-navy dark:text-white">Latest Notices</h2>
              <Link to="/notices" className="text-sm font-semibold text-brand-gold hover:underline">View all →</Link>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {notices.map((n, i) => (
                <Card key={n._id} delay={i * 0.1}>
                  <span className="text-xs font-semibold uppercase text-brand-gold">{n.category}</span>
                  <h3 className="mt-1 font-semibold text-brand-navy dark:text-white">{n.title}</h3>
                  <p className="mt-2 line-clamp-2 text-sm text-slate-500">{n.description}</p>
                  <Link to={`/notices/${n.slug}`} className="mt-3 inline-block text-sm font-semibold text-brand-navy hover:underline dark:text-brand-goldLight">
                    Read more →
                  </Link>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="container-page py-20 text-center">
        <Star className="mx-auto mb-4 h-10 w-10 text-brand-gold" />
        <h2 className="font-display text-3xl font-bold text-brand-navy dark:text-white">Ready to start your journey?</h2>
        <p className="mt-2 text-slate-500">Join {brand.name} today and take the first step toward your goals.</p>
        <Link to="/register" className="btn-primary mt-6 inline-flex">Register Now</Link>
      </section>
    </div>
  );
}
