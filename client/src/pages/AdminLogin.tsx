
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
    <main className="min-h-screen bg-[#f8f7f4]">
      <div className="grid min-h-screen lg:grid-cols-[0.9fr_1.1fr]">

        {/* LEFT BRAND PANEL */}
        <section className="relative hidden overflow-hidden bg-[#071535] text-white lg:flex">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -left-24 top-20 h-72 w-72 rounded-full bg-[#c9a24b]/10 blur-3xl" />
            <div className="absolute -right-20 bottom-10 h-80 w-80 rounded-full bg-white/5 blur-3xl" />
            <div className="absolute right-10 top-10 h-72 w-72 rounded-full border border-[#c9a24b]/10" />
            <div className="absolute -bottom-32 -left-20 h-96 w-96 rounded-full border border-white/[0.05]" />
          </div>

          <div className="relative flex w-full flex-col justify-between p-12 xl:p-16">
            <Link
              to="/"
              className="inline-flex w-fit items-center gap-3 no-underline"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white shadow-lg">
                <img
                  src="/logo.png"
                  alt="REMON ACADEMY"
                  className="h-full w-full object-contain p-1.5"
                />
              </div>

              <div>
                <p className="font-display text-lg font-bold text-white">
                  {brand.name}
                </p>

                <p className="text-[10px] uppercase tracking-[0.28em] text-white/50">
                  Administration
                </p>
              </div>
            </Link>

            <div className="max-w-lg">
              <div className="mb-5 flex items-center gap-3">
                <span className="h-px w-8 bg-[#c9a24b]" />
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#e0c179]">
                  Private Administration
                </p>
              </div>

              <h1 className="font-display text-5xl font-bold leading-[1.08] tracking-tight xl:text-6xl">
                Manage the academy
                <span className="mt-3 block text-[#e0c179]">
                  with confidence.
                </span>
              </h1>

              <p className="mt-7 max-w-md text-sm leading-7 text-slate-300">
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
                    className="flex items-center gap-3 text-sm text-white/80"
                  >
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-[#e0c179]" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs text-white/50">
              <ShieldCheck className="h-4 w-4 text-[#e0c179]" />
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
                <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white shadow-md">
                  <img
                    src="/logo.png"
                    alt="REMON ACADEMY"
                    className="h-full w-full object-contain p-1.5"
                  />
                </div>

                <div>
                  <p className="font-display text-lg font-bold text-[#071535]">
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
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#071535] text-[#e0c179] shadow-lg shadow-[#071535]/15">
                  <LockKeyhole className="h-6 w-6" />
                </div>

                <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-[#a17b2e]">
                  Secure Access
                </p>

                <h2 className="font-display text-4xl font-bold tracking-tight text-[#0b1f4d] sm:text-5xl">
                  Admin sign in
                </h2>

                <p className="mt-4 max-w-md text-sm leading-7 text-slate-600">
                  Sign in to continue to the REMON ACADEMY administration
                  dashboard.
                </p>
              </div>

              {serverError && (
                <div
                  role="alert"
                  className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700"
                >
                  {serverError}
                </div>
              )}

              <form
                onSubmit={handleSubmit(onSubmit)}
                className="rounded-3xl border border-[#eae6dd] bg-white p-6 shadow-[0_20px_60px_rgba(11,31,77,0.07)] sm:p-8"
              >
                <div className="mb-7 flex items-center gap-3 border-b border-[#f0eee8] pb-6">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0b1f4d]/[0.06]">
                    <GraduationCap className="h-6 w-6 text-[#0b1f4d]" />
                  </div>

                  <div>
                    <p className="text-sm font-bold text-[#0b1f4d]">
                      Administrator account
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      Use your registered credentials
                    </p>
                  </div>
                </div>

                <div className="space-y-5">
                  <Input
                    label="Admin Email"
                    type="email"
                    placeholder="admin@remonacademy.com"
                    autoComplete="username"
                    error={errors.email?.message}
                    {...register("email")}
                  />

                  <Input
                    label="Password"
                    type="password"
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    error={errors.password?.message}
                    {...register("password")}
                  />

                  <Button
                    type="submit"
                    loading={loading}
                    className="group w-full !rounded-xl !py-3.5"
                  >
                    <span>Access Dashboard</span>

                    <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </Button>
                </div>

                <div className="mt-7 flex items-center justify-center gap-2 border-t border-[#f0eee8] pt-5 text-xs text-slate-500">
                  <ShieldCheck className="h-4 w-4 text-[#a17b2e]" />
                  <span>Your administrative session is protected.</span>
                </div>
              </form>

              <div className="mt-7 flex flex-wrap items-center justify-between gap-4">
                <Link
                  to="/login"
                  className="group inline-flex items-center gap-2 text-sm font-semibold text-slate-500 no-underline transition-colors hover:text-[#0b1f4d]"
                >
                  <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                  Student Login
                </Link>

                <Link
                  to="/"
                  className="text-sm font-semibold text-[#0b1f4d] no-underline transition-colors hover:text-[#a17b2e]"
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
