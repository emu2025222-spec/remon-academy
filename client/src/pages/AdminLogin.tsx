import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
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
import { brand } from "../config/brand";

const schema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(1, "Password is required"),
});

type FormData = z.infer<typeof schema>;

export default function AdminLogin() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const { adminLogin } = useAuth();
  const { show } = useToast();
  const navigate = useNavigate();

  async function onSubmit(data: FormData) {
    setLoading(true);
    setServerError("");

    try {
      await adminLogin(data.email, data.password);
      show("Welcome back, admin!", "success");
      navigate("/admin/dashboard");
    } catch (err) {
      setServerError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-brand-ivory">
      <div className="grid min-h-screen lg:grid-cols-[0.9fr_1.1fr]">
        {/* LEFT BRAND PANEL */}
        <section className="relative hidden overflow-hidden bg-brand-navyDark lg:flex">
          <div className="absolute inset-0">
            <div className="absolute -left-24 top-20 h-72 w-72 rounded-full bg-brand-gold/10 blur-3xl" />
            <div className="absolute -right-20 bottom-10 h-80 w-80 rounded-full bg-white/5 blur-3xl" />
          </div>

          <div className="relative flex w-full flex-col justify-between p-12 xl:p-16">
            <Link
              to="/"
              className="inline-flex w-fit items-center gap-3 no-underline"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white shadow-[0_8px_24px_rgba(0,0,0,0.18)]">
                <img
                  src="/logo.png"
                  alt="REMON ACADEMY"
                  className="h-full w-full object-contain p-1.5"
                />
              </div>

              <div>
                <p className="font-display text-lg font-semibold text-white">
                  {brand.name}
                </p>

                <p className="text-[10px] uppercase tracking-[0.28em] text-white/45">
                  Administration
                </p>
              </div>
            </Link>

            <div className="max-w-lg">
              <p className="mb-5 text-xs font-semibold uppercase tracking-[0.3em] text-brand-goldLight">
                Private Administration
              </p>

              <h1 className="font-display text-5xl font-semibold leading-[1.05] tracking-[-0.035em] text-white xl:text-6xl">
                Manage the academy
                <span className="mt-2 block text-brand-goldLight">
                  with confidence.
                </span>
              </h1>

              <p className="mt-7 max-w-md text-sm leading-7 text-white/60">
                Access the administrative workspace for managing students,
                courses, results, notices and the academic experience.
              </p>

              <div className="mt-9 space-y-4">
                {[
                  "Secure administrative access",
                  "Student and academic management",
                  "Centralized academy operations",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 text-sm text-white/75"
                  >
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-brand-goldLight" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs text-white/35">
              <ShieldCheck className="h-4 w-4 text-brand-goldLight/70" />
              <span>Authorized personnel only</span>
            </div>
          </div>
        </section>

        {/* RIGHT LOGIN PANEL */}
        <section className="flex min-h-screen items-center justify-center px-5 py-10 sm:px-8 lg:px-14 xl:px-20">
          <div className="w-full max-w-xl">
            {/* MOBILE BRAND */}
            <div className="mb-10 lg:hidden">
              <Link
                to="/"
                className="inline-flex items-center gap-3 no-underline"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white shadow-[0_8px_24px_rgba(15,23,42,0.10)]">
                  <img
                    src="/logo.png"
                    alt="REMON ACADEMY"
                    className="h-full w-full object-contain p-1.5"
                  />
                </div>

                <div>
                  <p className="font-display text-lg font-semibold text-brand-navyDark">
                    {brand.name}
                  </p>

                  <p className="text-[10px] uppercase tracking-[0.28em] text-slate-500">
                    Administration
                  </p>
                </div>
              </Link>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="mb-8">
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-navyDark text-brand-goldLight shadow-lg">
                  <LockKeyhole className="h-5 w-5" />
                </div>

                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-brand-gold">
                  Secure access
                </p>

                <h2 className="font-display text-4xl font-semibold tracking-[-0.035em] text-brand-navyDark sm:text-5xl">
                  Admin sign in
                </h2>

                <p className="mt-4 max-w-md text-sm leading-7 text-slate-500">
                  Sign in to continue to the REMON ACADEMY administration
                  dashboard.
                </p>
              </div>

              {serverError && (
                <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700">
                  {serverError}
                </div>
              )}

              <form
                onSubmit={handleSubmit(onSubmit)}
                className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] sm:p-8"
              >
                <div className="mb-7 flex items-center gap-3 border-b border-slate-100 pb-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-navyDark/5">
                    <GraduationCap className="h-5 w-5 text-brand-navyDark" />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-brand-navyDark">
                      Administrator account
                    </p>

                    <p className="text-xs text-slate-400">
                      Use your registered credentials
                    </p>
                  </div>
                </div>

                <div className="space-y-5">
                  <Input
                    label="Admin Email"
                    placeholder="admin@remonacademy.com"
                    error={errors.email?.message}
                    {...register("email")}
                  />

                  <Input
                    label="Password"
                    type="password"
                    placeholder="••••••••"
                    error={errors.password?.message}
                    {...register("password")}
                  />

                  <Button
                    type="submit"
                    loading={loading}
                    className="group w-full"
                  >
                    <span>Access Dashboard</span>

                    <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </Button>
                </div>

                <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-400">
                  <ShieldCheck className="h-4 w-4 text-brand-gold" />
                  <span>Your administrative session is protected.</span>
                </div>
              </form>

              <div className="mt-7 flex items-center justify-between">
                <Link
                  to="/login"
                  className="group inline-flex items-center gap-2 text-sm font-medium text-slate-500 no-underline transition-colors hover:text-brand-navyDark"
                >
                  <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                  Student Login
                </Link>

                <Link
                  to="/"
                  className="text-sm font-medium text-brand-navyDark no-underline hover:text-brand-gold"
                >
                  Back to website
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </main>
  );
}


