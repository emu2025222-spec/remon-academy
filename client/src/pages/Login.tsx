
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  GraduationCap,
  LockKeyhole,
  Eye,
  EyeOff,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import { useToast } from "../components/Toast";

const schema = z.object({
  identifier: z.string().min(3, "Enter your email or Student ID"),
  password: z.string().min(1, "Password is required"),
});

type FormData = z.infer<typeof schema>;

function GoldenSphere({
  className,
  duration,
  delay = 0,
}: {
  className: string;
  duration: number;
  delay?: number;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={{ y: 0, x: 0 }}
      animate={
        reduceMotion
          ? undefined
          : {
              y: [0, -14, 0, 12, 0],
              x: [0, 8, 0, -8, 0],
            }
      }
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className={`pointer-events-none absolute rounded-full ${className}`}
      style={{
        background:
          "radial-gradient(circle at 32% 24%, #fff0b5 0%, #d8b66d 18%, #9b7038 48%, #4b2c15 78%, #21150e 100%)",
        boxShadow:
          "inset -10px -14px 24px rgba(0,0,0,.45), inset 5px 5px 14px rgba(255,239,180,.3), 0 0 22px rgba(201,162,75,.12)",
        willChange: reduceMotion ? "auto" : "transform",
      }}
    />
  );
}

export default function Login() {
  const reduceMotion = useReducedMotion();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

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
      setServerError(
        (err as Error).message || "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative flex min-h-[calc(100vh-80px)] items-center justify-center overflow-hidden bg-[#050505] px-5 py-12 text-white">

      {/* SIMPLE BACKGROUND */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,#292929_0%,#111111_48%,#030303_100%)]" />

      {/* THREE LIGHTWEIGHT GOLDEN SPHERES */}
      <GoldenSphere
        className="left-[5%] top-[38%] h-28 w-28 opacity-80 sm:h-44 sm:w-44"
        duration={12}
      />

      <GoldenSphere
        className="right-[7%] top-[12%] h-24 w-24 opacity-90 sm:h-36 sm:w-36"
        duration={14}
        delay={1}
      />

      <GoldenSphere
        className="right-[7%] bottom-[8%] h-32 w-32 opacity-80 sm:h-48 sm:w-48"
        duration={16}
        delay={2}
      />

      {/* STATIC GOLD AMBIENT LIGHT */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#c9a24b]/[0.07]" />

      {/* LOGIN CARD */}
      <motion.div
        initial={
          reduceMotion ? false : { opacity: 0, y: 25 }
        }
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: "easeOut" }}
        className="relative z-10 w-full max-w-3xl"
      >
        {/* GOLD BORDER */}
        <div className="absolute -inset-[2px] rounded-[34px] bg-gradient-to-br from-[#d8bd7b] via-[#6c501d] to-[#d6a900]" />

        {/* GLASS CARD */}
        <div className="relative overflow-hidden rounded-[32px] border border-[#c9a24b]/40 bg-[#242424]/95 shadow-[0_20px_65px_rgba(0,0,0,.55)] sm:backdrop-blur-sm">

          <div className="mx-auto max-w-lg px-7 py-10 sm:px-14 sm:py-14">

            {/* BRAND */}
            <div className="mb-7 flex items-center justify-center gap-3">
              <div className="h-11 w-11 overflow-hidden rounded-full border border-[#d6b66c]/70 bg-white">
                <img
                  src="/logo.png"
                  alt="REMON Academy"
                  className="h-full w-full object-contain p-1"
                />
              </div>

              <div>
                <p className="text-sm font-bold tracking-[0.12em] text-[#f2d58e]">
                  REMON ACADEMY
                </p>
                <p className="text-[9px] uppercase tracking-[0.3em] text-white/50">
                  Learn. Grow. Achieve.
                </p>
              </div>
            </div>

            {/* HEADING */}
            <div className="mb-8 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-[#c9a24b]/40 bg-[#c9a24b]/10">
                <GraduationCap className="h-6 w-6 text-[#e5c77f]" />
              </div>

              <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.4em] text-[#d8bd7b]">
                Welcome Back
              </p>

              <h1 className="font-display text-3xl font-medium tracking-[0.12em] text-[#f2d58e] sm:text-4xl">
                LOGIN
              </h1>

              <p className="mt-3 text-xs text-white/55">
                Sign in to access your student portal
              </p>
            </div>

            {/* ERROR */}
            {serverError && (
              <div
                role="alert"
                className="mb-5 rounded-lg border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-300"
              >
                {serverError}
              </div>
            )}

            {/* FORM */}
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-6"
            >
              {/* EMAIL / STUDENT ID */}
              <div>
                <label className="mb-2 block text-xs font-medium text-white/75">
                  Email address or Student ID
                </label>

                <input
                  {...register("identifier")}
                  autoComplete="username"
                  placeholder="Enter your email or Student ID"
                  className="w-full rounded-xl border border-[#d0ad63]/30 bg-[#c9a24b]/20 px-5 py-3.5 text-sm text-white outline-none transition-colors duration-200 placeholder:text-white/35 focus:border-[#f0ce82] focus:bg-[#c9a24b]/30"
                />

                {errors.identifier && (
                  <p className="mt-2 text-xs text-red-300">
                    {errors.identifier.message}
                  </p>
                )}
              </div>

              {/* PASSWORD */}
              <div>
                <label className="mb-2 block text-xs font-medium text-white/75">
                  Password
                </label>

                <div className="relative">
                  <input
                    {...register("password")}
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    className="w-full rounded-xl border border-[#d0ad63]/30 bg-[#c9a24b]/20 px-5 py-3.5 pr-12 text-sm text-white outline-none transition-colors duration-200 placeholder:text-white/35 focus:border-[#f0ce82] focus:bg-[#c9a24b]/30"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 transition-colors hover:text-[#f2d58e]"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>

                {errors.password && (
                  <p className="mt-2 text-xs text-red-300">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* FORGOT PASSWORD */}
              <div className="flex justify-end">
                <Link
                  to="/forgot-password"
                  className="text-xs text-white/60 transition-colors hover:text-[#f2d58e]"
                >
                  Forgot password?
                </Link>
              </div>

              {/* LOGIN BUTTON */}
              <button
                type="submit"
                disabled={loading}
                className="group mx-auto flex w-full max-w-xs items-center justify-center gap-3 rounded-full bg-gradient-to-r from-[#d5b66f] to-[#b98c43] px-8 py-3.5 text-sm font-semibold uppercase tracking-[0.16em] text-[#17110a] shadow-[0_5px_20px_rgba(201,162,75,.12)] transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Signing in..." : "Sign In"}

                {!loading && (
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                )}
              </button>
            </form>

            {/* REGISTER */}
            <div className="mt-8 border-t border-white/10 pt-6 text-center">
              <p className="text-sm text-white/55">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="font-semibold text-[#e5c77f] transition-colors hover:text-white"
                >
                  Register
                </Link>
              </p>
            </div>

            {/* ADMIN */}
            <div className="mt-5 text-center">
              <Link
                to="/admin/login"
                className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40 transition-colors hover:text-[#e5c77f]"
              >
                <LockKeyhole className="h-3.5 w-3.5" />
                Admin Login
              </Link>
            </div>

          </div>
        </div>
      </motion.div>
    </main>
  );
}
