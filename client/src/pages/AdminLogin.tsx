import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { useToast } from "../components/Toast";

const schema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(1, "Password is required"),
});
type FormData = z.infer<typeof schema>;

export default function AdminLogin() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(schema) });
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
    <div className="container-page flex min-h-[70vh] items-center justify-center bg-slate-50 py-16 dark:bg-slate-950">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card w-full max-w-md p-8">
        <div className="mb-6 text-center">
          <ShieldCheck className="mx-auto mb-2 h-10 w-10 text-brand-navy dark:text-brand-goldLight" />
          <h1 className="font-display text-2xl font-bold text-brand-navy dark:text-white">Admin Login</h1>
        </div>

        {serverError && <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">{serverError}</p>}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input label="Admin Email" placeholder="admin@remonacademy.com" error={errors.email?.message} {...register("email")} />
          <Input label="Password" type="password" placeholder="••••••••" error={errors.password?.message} {...register("password")} />
          <Button type="submit" loading={loading} className="w-full">Login</Button>
        </form>
      </motion.div>
    </div>
  );
}
