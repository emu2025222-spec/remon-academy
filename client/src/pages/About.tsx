import { motion } from "framer-motion";
import { Target, Eye, Building2, Users2 } from "lucide-react";
import { StatCard } from "../components/StatCard";
import { Users, GraduationCap, BookOpen, TrendingUp } from "lucide-react";
import { brand } from "../config/brand";

export default function About() {
  return (
    <div className="container-page py-16">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-3xl text-center">
        <h1 className="font-display text-4xl font-bold text-brand-navy dark:text-white">About {brand.name}</h1>
        <p className="mt-4 text-slate-500">
          Founded in 2026, {brand.name} was built with one goal: helping students achieve real, measurable academic
          success through structured teaching, honest feedback, and consistent practice — not shortcuts.
        </p>
      </motion.div>

      <div className="mt-16 grid gap-6 md:grid-cols-2">
        <div className="card p-8">
          <Target className="mb-3 h-8 w-8 text-brand-gold" />
          <h2 className="font-display text-xl font-semibold text-brand-navy dark:text-white">Our Mission</h2>
          <p className="mt-2 text-sm text-slate-500">
            To provide every student with access to expert guidance, structured curriculum, and continuous
            assessment — regardless of their starting point.
          </p>
        </div>
        <div className="card p-8">
          <Eye className="mb-3 h-8 w-8 text-brand-gold" />
          <h2 className="font-display text-xl font-semibold text-brand-navy dark:text-white">Our Vision</h2>
          <p className="mt-2 text-sm text-slate-500">
            To become the most trusted coaching platform in Bangladesh, known for real results and genuine student
            care.
          </p>
        </div>
      </div>

      <div className="mt-16 grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard icon={Users} label="Total Students" value={500} suffix="+" />
        <StatCard icon={GraduationCap} label="Teachers" value={20} suffix="+" />
        <StatCard icon={BookOpen} label="Courses" value={15} suffix="+" />
        <StatCard icon={TrendingUp} label="Success Rate" value={95} suffix="%" />
      </div>

      <div className="mt-16 grid gap-6 md:grid-cols-2">
        <div className="card p-8">
          <Building2 className="mb-3 h-8 w-8 text-brand-gold" />
          <h2 className="font-display text-xl font-semibold text-brand-navy dark:text-white">Facilities</h2>
          <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-slate-500">
            <li>Air-conditioned classrooms</li>
            <li>Digital notice & result system</li>
            <li>Dedicated student support desk</li>
            <li>Printed notes & practice sheets</li>
          </ul>
        </div>
        <div className="card p-8">
          <Users2 className="mb-3 h-8 w-8 text-brand-gold" />
          <h2 className="font-display text-xl font-semibold text-brand-navy dark:text-white">Teaching Methodology</h2>
          <p className="mt-2 text-sm text-slate-500">
            Concept-first teaching, weekly model tests, individualized feedback, and continuous parent-teacher
            communication.
          </p>
        </div>
      </div>

      <div className="mt-16 card mx-auto max-w-2xl p-8 text-center">
        <p className="italic text-slate-500">
          "Our commitment has always been simple — every student who walks through our doors deserves a genuine
          chance to succeed."
        </p>
        <p className="mt-4 font-semibold text-brand-navy dark:text-white">— Director, {brand.name}</p>
      </div>
    </div>
  );
}
