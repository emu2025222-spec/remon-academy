import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  KeyRound,
  ShieldCheck,
} from "lucide-react";

import { api, getErrorMessage } from "../services/api";
import { Input } from "../components/Input";
import { Button } from "../components/Button";

const schema = z.object({
  email: z.string().email("Invalid email"),
});

type FormData = z.infer<typeof schema>;

export default function ForgotPassword() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [devResetUrl, setDevResetUrl] = useState("");
  const [error, setError] = useState("");

  async function onSubmit(data: FormData) {
    setLoading(true);
    setError("");

    try {
      const res = await api.post("/auth/forgot-password", data);

      setSent(true);

      if (res.data.data?.resetUrl) {
        setDevResetUrl(res.data.data.resetUrl);
      }
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
            {/* REAL LOGO */}
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center overflow-hidden border border-brand-gold/40 bg-white">
                <img
                  src="/logo.png"
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
                Account Recovery
              </span>
            </div>

            <h1 className="max-w-xl font-display text-5xl font-bold leading-[1.04] tracking-[-0.04em] xl:text-6xl">
              Secure your
              <br />
              <span className="text-brand-gold">account again.</span>
            </h1>

            <p className="mt-7 max-w-lg text-sm leading-8 text-slate-400">
              Forgot your password? No problem. Enter the email connected to
              your student account and we'll help you regain access.
            </p>

            <div className="mt-10 space-y-4">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-brand-gold" />

                <span className="text-xs text-slate-300">
                  Secure password recovery
                </span>
              </div>

              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-brand-gold" />

                <span className="text-xs text-slate-300">
                  Simple email verification
                </span>
              </div>

              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-brand-gold" />

                <span className="text-xs text-slate-300">
                  Get back to your student dashboard
                </span>
              </div>
            </div>
          </div>

          <div className="relative border-t border-white/10 px-12 py-7 xl:px-16">
            <div className="flex items-center gap-3 text-xs text-slate-500">
              <ShieldCheck className="h-4 w-4 text-brand-gold" />
              Protected student account recovery
            </div>
          </div>
        </section>

        {/* RECOVERY AREA */}
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
              {/* REAL LOGO */}
              <div className="flex h-11 w-11 items-center justify-center overflow-hidden border border-brand-gold/40 bg-white">
                <img
                  src="/logo.png"
                  alt="REMON ACADEMY"
                  className="h-full w-full object-contain p-1"
                />
              </div>

              <div>
                <p className="font-display text-sm font-bold dark:text-white">
                  REMON ACADEMY
                </p>

                <p className="mt-0.5 text-[8px] font-semibold uppercase tracking-[0.25em] text-slate-400">
                  Account Recovery
                </p>
              </div>
            </div>

            {/* HEADER */}
            <div className="mb-8">
              <div className="mb-5 flex h-12 w-12 items-center justify-center border border-brand-gold/30 bg-brand-gold/[0.06]">
                <KeyRound className="h-5 w-5 text-brand-gold" />
              </div>

              <p className="text-[9px] font-bold uppercase tracking-[0.35em] text-brand-gold">
                Reset Password
              </p>

              <h1 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">
                Forgot Password?
              </h1>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                Enter your registered email and we'll send you a secure reset
                link.
              </p>
            </div>

            {/* CARD */}
            <div className="border border-slate-200 bg-white p-6 shadow-[0_25px_70px_rgba(16,23,34,0.06)] dark:border-slate-800 dark:bg-slate-900 sm:p-8">
              {sent ? (
                /* SUCCESS */
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center"
                >
                  <div className="mx-auto flex h-16 w-16 items-center justify-center border border-emerald-200 bg-emerald-50 dark:border-emerald-900/50 dark:bg-emerald-950/20">
                    <CheckCircle2 className="h-7 w-7 text-emerald-600 dark:text-emerald-400" />
                  </div>

                  <h2 className="mt-6 font-display text-xl font-bold">
                    Check your email
                  </h2>

                  <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-slate-500">
                    If that email exists, a password reset link has been sent.
                    Please check your inbox and follow the instructions.
                  </p>

                  {devResetUrl && (
                    <div className="mt-6 border border-amber-200 bg-amber-50 p-4 text-left dark:border-amber-900/40 dark:bg-amber-950/20">
                      <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-amber-700 dark:text-amber-400">
                        Development Only
                      </p>

                      <p className="mt-2 break-all text-xs leading-5 text-slate-500">
                        Reset link:{" "}
                        <a
                          href={devResetUrl}
                          className="font-semibold text-brand-navy underline underline-offset-2 dark:text-brand-goldLight"
                        >
                          {devResetUrl}
                        </a>
                      </p>
                    </div>
                  )}

                  <Link
                    to="/login"
                    className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-brand-navy no-underline transition-colors hover:text-brand-gold dark:text-white dark:hover:text-brand-gold"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Login
                  </Link>
                </motion.div>
              ) : (
                /* FORM */
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

                  <Input
                    label="Email Address"
                    type="email"
                    placeholder="you@example.com"
                    error={errors.email?.message}
                    {...register("email")}
                  />

                  <Button
                    type="submit"
                    loading={loading}
                    className="group w-full"
                  >
                    <span>Send Reset Link</span>

                    {!loading && (
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    )}
                  </Button>
                </form>
              )}

              {!sent && (
                <div className="mt-7 border-t border-slate-100 pt-7 text-center dark:border-slate-800">
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-2 text-sm font-bold text-brand-navy no-underline hover:text-brand-gold dark:text-white dark:hover:text-brand-gold"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Login
                  </Link>
                </div>
              )}
            </div>

            <div className="mt-6 flex items-center justify-center gap-2 text-[10px] font-medium uppercase tracking-[0.18em] text-slate-400">
              <ShieldCheck className="h-3.5 w-3.5 text-brand-gold" />
              REMON ACADEMY · Secure Recovery
            </div>
          </motion.div>
        </section>
      </div>
    </main>
  );
}


