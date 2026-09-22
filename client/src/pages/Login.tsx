import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { GraduationCap } from "lucide-react";
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
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(schema) });
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
    <div className="container-page flex min-h-[70vh] items-center justify-center py-16">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card w-full max-w-md p-8">
        <div className="mb-6 text-center">
          <GraduationCap className="mx-auto mb-2 h-10 w-10 text-brand-gold" />
          <h1 className="font-display text-2xl font-bold text-brand-navy dark:text-white">Student Login</h1>
          <p className="mt-1 text-sm text-slate-500">Login with your email or Student ID</p>
        </div>

        {serverError && <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">{serverError}</p>}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input label="Email or Student ID" placeholder="you@example.com or RA-2026-0001" error={errors.identifier?.message} {...register("identifier")} />
          <Input label="Password" type="password" placeholder="••••••••" error={errors.password?.message} {...register("password")} />
          <div className="text-right text-sm">
            <Link to="/forgot-password" className="text-brand-navy hover:underline dark:text-brand-goldLight">Forgot password?</Link>
          </div>
          <Button type="submit" loading={loading} className="w-full">Login</Button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Don't have an account? <Link to="/register" className="font-semibold text-brand-navy hover:underline dark:text-brand-goldLight">Register</Link>
        </p>
        <p className="mt-2 text-center text-xs text-slate-400">
          Are you an admin? <Link to="/admin/login" className="hover:underline">Admin Login</Link>
        </p>
      </motion.div>
    </div>
  );
}
