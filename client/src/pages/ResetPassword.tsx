import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  KeyRound,
  Lock,
  ShieldCheck,
} from "lucide-react";

import { api, getErrorMessage } from "../services/api";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { useToast } from "../components/Toast";

const schema = z
  .object({
    password: z.string().min(8, "At least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type FormData = z.infer<typeof schema>;

export default function ResetPassword() {
  const { token } = useParams();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { show } = useToast();
  const navigate = useNavigate();

  async function onSubmit(data: FormData) {
    setLoading(true);
    setError("");

    try {
      await api.post(`/auth/reset-password/${token}`, {
        password: data.password,
      });

      show("Password reset successfully. Please log in.", "success");

      navigate("/login");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-[calc(100vh-80px)] bg-[#f5f3ee] dark:bg-[#080c14]">
      <div className="grid min-h-[calc(100vh-80px)] lg:grid-cols-[0.8fr_1.2fr]">
        {/* LEFT BRAND PANEL */}
        <section className="relative hidden overflow-hidden bg-[#101722] text-white lg:flex lg:flex-col lg:justify-between">
          <div className="pointer-events-none absolute right-[-150px] top-[-150px] h-[460px] w-[460px] rounded-full border border-brand-gold/[0.08]" />

          <div className="pointer-events-none absolute bottom-[-180px] left-[-160px] h-[430px] w-[430px] rounded-full border border-white/[0.04]" />

          <div className="relative p-12 xl:p-16">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white shadow-[0_8px_24px_rgba(0,0,0,0.18)]">
                <img
                  src="/logo.png"
                  alt="REMON ACADEMY"
                  className="h-full w-full object-contain p-1.5"
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
                New Password
              </span>
            </div>

            <h1 className="max-w-xl font-display text-5xl font-bold leading-[1.04] tracking-[-0.04em] xl:text-6xl">
              Create a
              <br />
              <span className="text-brand-gold">
                stronger password.
              </span>
            </h1>

            <p className="mt-7 max-w-lg text-sm leading-8 text-slate-400">
              Choose a secure password for your REMON ACADEMY account. Once
              updated, you can sign in with your new credentials.
            </p>

            <div className="mt-10 space-y-4">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-brand-gold" />

                <span className="text-xs text-slate-300">
                  Minimum 8 characters
                </span>
              </div>

              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-brand-gold" />

                <span className="text-xs text-slate-300">
                  Confirm your new password
                </span>
              </div>

              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-brand-gold" />

                <span className="text-xs text-slate-300">
                  Secure student account access
                </span>
              </div>
            </div>
          </div>

          <div className="relative border-t border-white/10 px-12 py-7 xl:px-16">
            <div className="flex items-center gap-3 text-xs text-slate-500">
              <ShieldCheck className="h-4 w-4 text-brand-gold" />
              Secure password management
            </div>
          </div>
        </section>

        {/* RESET AREA */}
        <section className="relative flex items-center px-5 py-12 sm:px-8 sm:py-16 lg:px-12">
          <div className="pointer-events-none absolute right-[-100px] top-[-100px] h-72 w-72 rounded-full border border-brand-gold/[0.08]" />

          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="relative mx-auto w-full max-w-md"
          >
            {/* MOBILE BRAND */}
            <div className="mb-10 flex items-center justify-center gap-3 lg:hidden">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white shadow-[0_8px_24px_rgba(16,23,34,0.10)]">
                <img
                  src="/logo.png"
                  alt="REMON ACADEMY"
                  className="h-full w-full object-contain p-1.5"
                />
              </div>

              <div>
                <p className="font-display text-sm font-bold dark:text-white">
                  REMON ACADEMY
                </p>

                <p className="mt-0.5 text-[8px] font-semibold uppercase tracking-[0.25em] text-slate-400">
                  Password Reset
                </p>
              </div>
            </div>

            {/* HEADER */}
            <div className="mb-8">
              <div className="mb-5 flex h-12 w-12 items-center justify-center border border-brand-gold/30 bg-brand-gold/[0.06]">
                <KeyRound className="h-5 w-5 text-brand-gold" />
              </div>

              <p className="text-[9px] font-bold uppercase tracking-[0.35em] text-brand-gold">
                Account Security
              </p>

              <h1 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">
                Reset Password
              </h1>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                Create a new password to secure your student account.
              </p>
            </div>

            {/* CARD */}
            <div className="border border-slate-200 bg-white p-6 shadow-[0_25px_70px_rgba(16,23,34,0.06)] dark:border-slate-800 dark:bg-slate-900 sm:p-8">
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-5"
              >
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-900/50 dark:bg-red-950/20 dark:text-red-400"
                  >
                    {error}
                  </motion.div>
                )}

                <div>
                  <div className="mb-5 flex items-center gap-3 border-b border-slate-100 pb-5 dark:border-slate-800">
                    <div className="flex h-9 w-9 items-center justify-center bg-brand-gold/[0.08]">
                      <Lock className="h-4 w-4 text-brand-gold" />
                    </div>

                    <div>
                      <p className="text-xs font-bold">
                        Choose New Password
                      </p>

                      <p className="mt-0.5 text-[10px] text-slate-400">
                        Use at least 8 characters.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-5">
                    <Input
                      label="New Password"
                      type="password"
                      placeholder="Enter new password"
                      error={errors.password?.message}
                      {...register("password")}
                    />

                    <Input
                      label="Confirm New Password"
                      type="password"
                      placeholder="Repeat your new password"
                      error={errors.confirmPassword?.message}
                      {...register("confirmPassword")}
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <Button
                    type="submit"
                    loading={loading}
                    className="group w-full"
                  >
                    <span>Reset Password</span>

                    {!loading && (
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    )}
                  </Button>
                </div>
              </form>

              <div className="mt-7 border-t border-slate-100 pt-7 text-center dark:border-slate-800">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 text-sm font-bold text-brand-navy no-underline hover:text-brand-gold dark:text-white dark:hover:text-brand-gold"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Login
                </Link>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-center gap-2 text-[10px] font-medium uppercase tracking-[0.18em] text-slate-400">
              <ShieldCheck className="h-3.5 w-3.5 text-brand-gold" />
              REMON ACADEMY · Secure Account
            </div>
          </motion.div>
        </section>
      </div>
    </main>
  );
}


