import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { KeyRound } from "lucide-react";
import { api, getErrorMessage } from "../services/api";
import { Input } from "../components/Input";
import { Button } from "../components/Button";

const schema = z.object({ email: z.string().email("Invalid email") });
type FormData = z.infer<typeof schema>;

export default function ForgotPassword() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(schema) });
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
      if (res.data.data?.resetUrl) setDevResetUrl(res.data.data.resetUrl);
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
          <KeyRound className="mx-auto mb-2 h-10 w-10 text-brand-gold" />
          <h1 className="font-display text-2xl font-bold text-brand-navy dark:text-white">Forgot Password</h1>
          <p className="mt-1 text-sm text-slate-500">We'll send you a reset link.</p>
        </div>

        {sent ? (
          <div className="rounded-lg bg-green-50 p-4 text-sm text-green-700">
            If that email exists, a reset link has been sent.
            {devResetUrl && (
              <p className="mt-2 break-all text-xs text-slate-500">
                (Dev only) Reset link: <a href={devResetUrl} className="underline">{devResetUrl}</a>
              </p>
            )}
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</p>}
            <Input label="Email" type="email" error={errors.email?.message} {...register("email")} />
            <Button type="submit" loading={loading} className="w-full">Send Reset Link</Button>
          </form>
        )}
      </motion.div>
    </div>
  );
}
