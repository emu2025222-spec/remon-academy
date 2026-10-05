import { Link } from "react-router-dom";
import { ArrowLeft, ArrowUpRight, GraduationCap } from "lucide-react";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <main className="relative flex min-h-[calc(100vh-80px)] items-center justify-center overflow-hidden bg-[#101722] px-5 text-white">

      {/* Decorative circles */}

      <div className="pointer-events-none absolute right-[-180px] top-[-180px] h-[480px] w-[480px] rounded-full border border-brand-gold/[0.08]" />

      <div className="pointer-events-none absolute bottom-[-200px] left-[-160px] h-[440px] w-[440px] rounded-full border border-white/[0.04]" />

      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[280px] w-[280px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-brand-gold/[0.05]" />

      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-2xl text-center"
      >

        {/* Icon */}

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mx-auto flex h-16 w-16 items-center justify-center border border-brand-gold/30 bg-brand-gold/[0.05]"
        >
          <GraduationCap className="h-7 w-7 text-brand-gold" />
        </motion.div>

        {/* Label */}

        <div className="mt-8 flex items-center justify-center gap-3">

          <span className="h-px w-8 bg-brand-gold" />

          <span className="text-[9px] font-bold uppercase tracking-[0.35em] text-brand-gold">
            REMON ACADEMY
          </span>

          <span className="h-px w-8 bg-brand-gold" />

        </div>

        {/* 404 */}

        <h1 className="mt-7 font-display text-[7rem] font-bold leading-none tracking-[-0.07em] text-white sm:text-[10rem]">

          404

        </h1>

        <div className="mx-auto mt-[-8px] h-px w-20 bg-brand-gold" />

        <h2 className="mt-7 font-display text-2xl font-bold sm:text-3xl">
          This page took a wrong turn.
        </h2>

        <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-slate-400 sm:text-base">
          The page you're looking for doesn't exist, may have been moved,
          or is no longer available.
        </p>

        {/* Actions */}

        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">

          <Link
            to="/"
            className="group inline-flex items-center gap-3 bg-brand-gold px-7 py-3.5 text-sm font-bold text-[#101722] no-underline transition-colors hover:bg-brand-goldLight"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to Home
          </Link>

          <Link
            to="/courses"
            className="group inline-flex items-center gap-3 border border-white/15 px-7 py-3.5 text-sm font-bold text-white no-underline transition-colors hover:border-brand-gold hover:text-brand-gold"
          >
            Explore Courses
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>

        </div>

        {/* Bottom text */}

        <p className="mt-12 text-[9px] font-bold uppercase tracking-[0.3em] text-slate-600">
          Learn · Grow · Achieve
        </p>

      </motion.div>

    </main>
  );
}


