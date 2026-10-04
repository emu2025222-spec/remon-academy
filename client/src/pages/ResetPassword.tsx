import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock } from "lucide-react";
import { api, getErrorMessage } from "../services/api";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { useToast } from "../components/Toast";

const schema = z
  .object({ password: z.string().min(8, "At least 8 characters"), confirmPassword: z.string() })
  .refine((d) => d.password === d.confirmPassword, { message: "Passwords do not match", path: ["confirmPassword"] });
type FormData = z.infer<typeof schema>;

export default function ResetPassword() {
  const { token } = useParams();
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(schema) });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { show } = useToast();
  const navigate = useNavigate();

  async function onSubmit(data: FormData) {
    setLoading(true);
    setError("");
    try {
      await api.post(`/auth/reset-password/${token}`, { password: data.password });
      show("Password reset successfully. Please log in.", "success");
      navigate("/login");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container-page flex min-h-[70vh] items-center justify-center py-16">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card w-full max-w-md p-8">
        <div className="mb-6 text-center">
          <Lock className="mx-auto mb-2 h-10 w-10 text-brand-gold" />
          <h1 className="font-display text-2xl font-bold text-brand-navy dark:text-white">Reset Password</h1>
        </div>
        {error && <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</p>}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input label="New Password" type="password" error={errors.password?.message} {...register("password")} />
          <Input label="Confirm New Password" type="password" error={errors.confirmPassword?.message} {...register("confirmPassword")} />
          <Button type="submit" loading={loading} className="w-full">Reset Password</Button>
        </form>
      </motion.div>
    </div>
  );
}
