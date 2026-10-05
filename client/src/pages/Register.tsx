import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  GraduationCap,
  ShieldCheck,
  UserPlus,
} from "lucide-react";

import { api, getErrorMessage } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { useToast } from "../components/Toast";
import { Course } from "../types";

const schema = z
  .object({
    fullName: z.string().min(2, "Full name is required"),
    email: z.string().email("Invalid email"),
    phone: z.string().min(11, "Enter a valid phone number"),
    password: z.string().min(8, "At least 8 characters"),
    confirmPassword: z.string(),
    dateOfBirth: z.string().min(1, "Date of birth is required"),
    gender: z.enum(["MALE", "FEMALE", "OTHER"]),
    address: z.string().min(3, "Address is required"),
    class: z.string().min(1, "Class is required"),
    group: z.string().optional(),
    course: z.string().optional(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type FormData = z.infer<typeof schema>;

export default function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [courses, setCourses] = useState<Course[]>([]);

  const { refresh } = useAuth();
  const { show } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/courses/public")
      .then((r) => setCourses(r.data.data))
      .catch(() => {});
  }, []);

  async function onSubmit(data: FormData) {
    setLoading(true);
    setServerError("");

    try {
      await api.post("/auth/register", data);
      await refresh();

      show(
        "Registration successful! Welcome to Remon Academy.",
        "success"
      );

      navigate("/student/dashboard");
    } catch (err) {
      setServerError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-[calc(100vh-80px)] overflow-hidden bg-[#f5f3ee] text-[#111827] dark:bg-[#080c14] dark:text-white">
      <div className="grid lg:grid-cols-[0.72fr_1.28fr]">
        {/* LEFT BRAND PANEL */}
        <section className="relative hidden overflow-hidden bg-[#101722] text-white lg:flex lg:min-h-[calc(100vh-80px)] lg:flex-col lg:justify-between">
          <div className="pointer-events-none absolute right-[-160px] top-[-160px] h-[480px] w-[480px] rounded-full border border-brand-gold/[0.08]" />

          <div className="pointer-events-none absolute bottom-[-180px] left-[-150px] h-[430px] w-[430px] rounded-full border border-white/[0.04]" />

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
                Join The Academy
              </span>
            </div>

            <h1 className="max-w-xl font-display text-5xl font-bold leading-[1.03] tracking-[-0.04em] xl:text-6xl">
              Begin your
              <br />
              <span className="text-brand-gold">next chapter.</span>
            </h1>

            <p className="mt-7 max-w-lg text-sm leading-8 text-slate-400">
              Create your student account and get access to your academic
              dashboard, courses, results, attendance and academy updates.
            </p>

            <div className="mt-10 space-y-4">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-brand-gold" />

                <span className="text-xs text-slate-300">
                  Personalized student dashboard
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
                  Track attendance and results
                </span>
              </div>

              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-brand-gold" />

                <span className="text-xs text-slate-300">
                  Receive important academy updates
                </span>
              </div>
            </div>
          </div>

          <div className="relative border-t border-white/10 px-12 py-7 xl:px-16">
            <div className="flex items-center gap-3 text-xs text-slate-500">
              <ShieldCheck className="h-4 w-4 text-brand-gold" />
              Secure student registration
            </div>
          </div>
        </section>

        {/* REGISTRATION AREA */}
        <section className="relative px-5 py-12 sm:px-8 sm:py-16 lg:px-12">
          <div className="pointer-events-none absolute right-[-100px] top-[-100px] h-72 w-72 rounded-full border border-brand-gold/[0.08]" />

          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="relative mx-auto w-full max-w-3xl"
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
                  Student Registration
                </p>
              </div>
            </div>

            {/* HEADER */}
            <div className="mb-8">
              <div className="mb-5 flex h-12 w-12 items-center justify-center border border-brand-gold/30 bg-brand-gold/[0.06]">
                <UserPlus className="h-5 w-5 text-brand-gold" />
              </div>

              <p className="text-[9px] font-bold uppercase tracking-[0.35em] text-brand-gold">
                Create Account
              </p>

              <h1 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">
                Student Registration
              </h1>

              <p className="mt-3 max-w-xl text-sm leading-6 text-slate-500">
                Create your account to access the REMON ACADEMY student
                portal.
              </p>
            </div>

            {/* ERROR */}
            {serverError && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-900/50 dark:bg-red-950/20 dark:text-red-400"
              >
                {serverError}
              </motion.div>
            )}

            {/* FORM CARD */}
            <div className="border border-slate-200 bg-white p-6 shadow-[0_25px_70px_rgba(16,23,34,0.06)] dark:border-slate-800 dark:bg-slate-900 sm:p-8">
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-8"
              >
                {/* PERSONAL INFORMATION */}
                <div>
                  <div className="mb-5 flex items-center gap-3">
                    <span className="font-display text-lg font-bold text-brand-gold">
                      01
                    </span>

                    <div>
                      <h2 className="font-display text-base font-bold">
                        Personal Information
                      </h2>

                      <p className="mt-0.5 text-[11px] text-slate-400">
                        Tell us a little about yourself.
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-5 md:grid-cols-2">
                    <Input
                      label="Full Name"
                      placeholder="Your full name"
                      error={errors.fullName?.message}
                      {...register("fullName")}
                    />

                    <Input
                      label="Email"
                      type="email"
                      placeholder="you@example.com"
                      error={errors.email?.message}
                      {...register("email")}
                    />

                    <Input
                      label="Phone"
                      placeholder="+8801XXXXXXXXX"
                      error={errors.phone?.message}
                      {...register("phone")}
                    />

                    <Input
                      label="Date of Birth"
                      type="date"
                      error={errors.dateOfBirth?.message}
                      {...register("dateOfBirth")}
                    />

                    <div>
                      <label className="label-field">Gender</label>

                      <select
                        className="input-field"
                        {...register("gender")}
                      >
                        <option value="MALE">Male</option>
                        <option value="FEMALE">Female</option>
                        <option value="OTHER">Other</option>
                      </select>
                    </div>

                    <Input
                      label="Class"
                      placeholder="e.g. HSC 1st Year"
                      error={errors.class?.message}
                      {...register("class")}
                    />
                  </div>
                </div>

                {/* ACADEMIC INFORMATION */}
                <div className="border-t border-slate-100 pt-8 dark:border-slate-800">
                  <div className="mb-5 flex items-center gap-3">
                    <span className="font-display text-lg font-bold text-brand-gold">
                      02
                    </span>

                    <div>
                      <h2 className="font-display text-base font-bold">
                        Academic Information
                      </h2>

                      <p className="mt-0.5 text-[11px] text-slate-400">
                        Help us understand your academic needs.
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-5 md:grid-cols-2">
                    <Input
                      label="Group"
                      placeholder="Science / Commerce / Arts"
                      {...register("group")}
                    />

                    <div>
                      <label className="label-field">Course</label>

                      <select
                        className="input-field"
                        {...register("course")}
                      >
                        <option value="">Select later</option>

                        {courses.map((c) => (
                          <option key={c._id} value={c._id}>
                            {c.title}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="md:col-span-2">
                      <Input
                        label="Address"
                        placeholder="Your current address"
                        error={errors.address?.message}
                        {...register("address")}
                      />
                    </div>
                  </div>
                </div>

                {/* SECURITY */}
                <div className="border-t border-slate-100 pt-8 dark:border-slate-800">
                  <div className="mb-5 flex items-center gap-3">
                    <span className="font-display text-lg font-bold text-brand-gold">
                      03
                    </span>

                    <div>
                      <h2 className="font-display text-base font-bold">
                        Account Security
                      </h2>

                      <p className="mt-0.5 text-[11px] text-slate-400">
                        Create a secure password for your account.
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-5 md:grid-cols-2">
                    <Input
                      label="Password"
                      type="password"
                      placeholder="Minimum 8 characters"
                      error={errors.password?.message}
                      {...register("password")}
                    />

                    <Input
                      label="Confirm Password"
                      type="password"
                      placeholder="Repeat your password"
                      error={errors.confirmPassword?.message}
                      {...register("confirmPassword")}
                    />
                  </div>
                </div>

                {/* SUBMIT */}
                <div className="border-t border-slate-100 pt-7 dark:border-slate-800">
                  <Button
                    type="submit"
                    loading={loading}
                    className="group w-full"
                  >
                    <span>Create Student Account</span>

                    {!loading && (
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    )}
                  </Button>
                </div>
              </form>

              {/* LOGIN */}
              <div className="mt-7 border-t border-slate-100 pt-7 text-center dark:border-slate-800">
                <p className="text-sm text-slate-500">
                  Already registered?{" "}
                  <Link
                    to="/login"
                    className="font-bold text-[#101722] no-underline hover:text-brand-gold dark:text-white dark:hover:text-brand-gold"
                  >
                    Login
                  </Link>
                </p>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-center gap-2 text-[10px] font-medium uppercase tracking-[0.18em] text-slate-400">
              <GraduationCap className="h-3.5 w-3.5 text-brand-gold" />
              REMON ACADEMY · Student Portal
            </div>
          </motion.div>
        </section>
      </div>
    </main>
  );
}


