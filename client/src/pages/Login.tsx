import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  GraduationCap,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { useToast } from "../components/Toast";

const schema = z.object({
  identifier: z.string().min(3, "Enter your email or Student ID"),
  password: z.string().min(1, "Password is required"),
});

type FormData = z.infer<typeof schema>;

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const { login } = useAuth();
  const { show } = useToast();
  const navigate = useNavigate();

  async function onSubmit(data: FormData) {
    setLoading(true);
    setServerError("");

    try {
      await login(data.identifier, data.password);

      show("Login successful!", "success");

      navigate("/student/dashboard");
    } catch (err) {
      setServerError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-[calc(100vh-80px)] overflow-hidden bg-[#f5f3ee] text-[#111827] dark:bg-[#080c14] dark:text-white">
      <div className="grid min-h-[calc(100vh-80px)] lg:grid-cols-2">
        {/* LEFT SIDE — BRAND PANEL */}
        <section className="relative hidden overflow-hidden bg-[#101722] text-white lg:flex lg:flex-col lg:justify-between">
          <div className="pointer-events-none absolute right-[-160px] top-[-160px] h-[480px] w-[480px] rounded-full border border-brand-gold/[0.08]" />

          <div className="pointer-events-none absolute bottom-[-180px] left-[-150px] h-[430px] w-[430px] rounded-full border border-white/[0.04]" />

          <div className="relative p-12 xl:p-16">
            {/* REAL LOGO */}
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center overflow-hidden border border-brand-gold/40 bg-white">
                <img
                  src="/logo.jpg"
                  alt="REMON ACADEMY"
                  className="h-full w-full object-contain p-1"
                />
              </div>

              <div>
                <p className="font-display text-sm font-bold tracking-wide">
                  REMON ACADEMY
                </p>

                <p className="mt-0.5 text-[8px] font-semibold uppercase tracking-[0.28em] text-slate-500">
                  Learn. Grow. Achieve.
                </p>
              </div>
            </div>
          </div>

          <div className="relative px-12 pb-16 xl:px-16">
            <div className="mb-7 flex items-center gap-3">
              <span className="h-px w-10 bg-brand-gold" />

              <span className="text-[9px] font-bold uppercase tracking-[0.35em] text-brand-gold">
                Student Portal
              </span>
            </div>

            <h1 className="max-w-xl font-display text-5xl font-bold leading-[1.03] tracking-[-0.04em] xl:text-6xl">
              Your learning
              <br />
              <span className="text-brand-gold">starts here.</span>
            </h1>

            <p className="mt-7 max-w-lg text-sm leading-8 text-slate-400">
              Access your courses, attendance, results, notices and academic
              information from one secure student portal.
            </p>

            <div className="mt-10 grid max-w-lg gap-4 sm:grid-cols-2">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-brand-gold" />
                <span className="text-xs text-slate-300">
                  Track your academic progress
                </span>
              </div>

              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-brand-gold" />
                <span className="text-xs text-slate-300">
                  Access your enrolled courses
                </span>
              </div>

              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-brand-gold" />
                <span className="text-xs text-slate-300">
                  View results and performance
                </span>
              </div>

              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-brand-gold" />
                <span className="text-xs text-slate-300">
                  Stay updated with notices
                </span>
              </div>
            </div>
          </div>

          <div className="relative border-t border-white/10 px-12 py-7 xl:px-16">
            <div className="flex items-center gap-3 text-xs text-slate-500">
              <ShieldCheck className="h-4 w-4 text-brand-gold" />
              Secure student access
            </div>
          </div>
        </section>

        {/* RIGHT SIDE — LOGIN */}
        <section className="relative flex items-center justify-center px-5 py-14 sm:px-8 lg:px-12">
          <div className="pointer-events-none absolute right-[-120px] top-[-120px] h-72 w-72 rounded-full border border-brand-gold/[0.08]" />

          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="relative w-full max-w-md"
          >
            {/* MOBILE BRAND */}
            <div className="mb-10 flex items-center justify-center gap-3 lg:hidden">
              {/* REAL LOGO */}
              <div className="flex h-11 w-11 items-center justify-center overflow-hidden border border-brand-gold/40 bg-white">
                <img
                  src="/logo.jpg"
                  alt="REMON ACADEMY"
                  className="h-full w-full object-contain p-1"
                />
              </div>

              <div>
                <p className="font-display text-sm font-bold dark:text-white">
                  REMON ACADEMY
                </p>

                <p className="mt-0.5 text-[8px] font-semibold uppercase tracking-[0.25em] text-slate-400">
                  Student Portal
                </p>
              </div>
            </div>

            {/* LOGIN CARD */}
            <div className="border border-slate-200 bg-white p-7 shadow-[0_25px_70px_rgba(16,23,42,0.08)] dark:border-slate-800 dark:bg-slate-900 sm:p-9">
              <div className="mb-8">
                <div className="mb-5 flex h-12 w-12 items-center justify-center border border-brand-gold/30 bg-brand-gold/[0.06]">
                  <GraduationCap className="h-5 w-5 text-brand-gold" />
                </div>

                <p className="text-[9px] font-bold uppercase tracking-[0.35em] text-brand-gold">
                  Welcome Back
                </p>

                <h2 className="mt-3 font-display text-3xl font-bold tracking-tight dark:text-white">
                  Student Login
                </h2>

                <p className="mt-3 text-sm leading-6 text-slate-500">
                  Sign in to continue to your academic dashboard.
                </p>
              </div>

              {/* SERVER ERROR */}
              {serverError && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-5 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-900/50 dark:bg-red-950/20 dark:text-red-400"
                >
                  {serverError}
                </motion.div>
              )}

              {/* FORM */}
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-5"
              >
                <Input
                  label="Email or Student ID"
                  placeholder="you@example.com or RA-2026-0001"
                  error={errors.identifier?.message}
                  {...register("identifier")}
                />

                <Input
                  label="Password"
                  type="password"
                  placeholder="••••••••"
                  error={errors.password?.message}
                  {...register("password")}
                />

                <div className="flex justify-end">
                  <Link
                    to="/forgot-password"
                    className="text-xs font-semibold text-slate-500 no-underline transition-colors hover:text-brand-gold dark:text-slate-400 dark:hover:text-brand-gold"
                  >
                    Forgot password?
                  </Link>
                </div>

                <Button
                  type="submit"
                  loading={loading}
                  className="group w-full"
                >
                  <span>Login to Student Portal</span>

                  {!loading && (
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  )}
                </Button>
              </form>

              {/* REGISTER */}
              <div className="mt-8 border-t border-slate-100 pt-7 text-center dark:border-slate-800">
                <p className="text-sm text-slate-500">
                  Don't have an account?{" "}
                  <Link
                    to="/register"
                    className="font-bold text-[#101722] no-underline hover:text-brand-gold dark:text-white dark:hover:text-brand-gold"
                  >
                    Register
                  </Link>
                </p>
              </div>

              {/* ADMIN */}
              <div className="mt-5 text-center">
                <Link
                  to="/admin/login"
                  className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400 no-underline transition-colors hover:text-brand-gold"
                >
                  <LockKeyhole className="h-3.5 w-3.5" />
                  Admin Login
                </Link>
              </div>
            </div>

            <p className="mt-6 text-center text-[10px] font-medium uppercase tracking-[0.18em] text-slate-400">
              Secure access · REMON ACADEMY
            </p>
          </motion.div>
        </section>
      </div>
    </main>
  );
}

