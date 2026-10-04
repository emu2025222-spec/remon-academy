import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { UserPlus } from "lucide-react";
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
  .refine((d) => d.password === d.confirmPassword, { message: "Passwords do not match", path: ["confirmPassword"] });
type FormData = z.infer<typeof schema>;

export default function Register() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(schema) });
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [courses, setCourses] = useState<Course[]>([]);
  const { refresh } = useAuth();
  const { show } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/courses/public").then((r) => setCourses(r.data.data)).catch(() => {});
  }, []);

  async function onSubmit(data: FormData) {
    setLoading(true);
    setServerError("");
    try {
      await api.post("/auth/register", data);
      await refresh();
      show("Registration successful! Welcome to Remon Academy.", "success");
      navigate("/student/dashboard");
    } catch (err) {
      setServerError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container-page flex items-center justify-center py-16">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card w-full max-w-2xl p-8">
        <div className="mb-6 text-center">
          <UserPlus className="mx-auto mb-2 h-10 w-10 text-brand-gold" />
          <h1 className="font-display text-2xl font-bold text-brand-navy dark:text-white">Student Registration</h1>
        </div>

        {serverError && <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">{serverError}</p>}

        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 md:grid-cols-2">
          <Input label="Full Name" error={errors.fullName?.message} {...register("fullName")} />
          <Input label="Email" type="email" error={errors.email?.message} {...register("email")} />
          <Input label="Phone" placeholder="+8801XXXXXXXXX" error={errors.phone?.message} {...register("phone")} />
          <Input label="Date of Birth" type="date" error={errors.dateOfBirth?.message} {...register("dateOfBirth")} />

          <div>
            <label className="label-field">Gender</label>
            <select className="input-field" {...register("gender")}>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="OTHER">Other</option>
            </select>
          </div>
          <Input label="Class" placeholder="e.g. HSC 1st Year" error={errors.class?.message} {...register("class")} />

          <Input label="Group (optional)" placeholder="Science / Commerce / Arts" {...register("group")} />
          <div>
            <label className="label-field">Course (optional)</label>
            <select className="input-field" {...register("course")}>
              <option value="">Select later</option>
              {courses.map((c) => (
                <option key={c._id} value={c._id}>{c.title}</option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <Input label="Address" error={errors.address?.message} {...register("address")} />
          </div>

          <Input label="Password" type="password" error={errors.password?.message} {...register("password")} />
          <Input label="Confirm Password" type="password" error={errors.confirmPassword?.message} {...register("confirmPassword")} />

          <div className="md:col-span-2">
            <Button type="submit" loading={loading} className="w-full">Create Account</Button>
          </div>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Already registered? <Link to="/login" className="font-semibold text-brand-navy hover:underline dark:text-brand-goldLight">Login</Link>
        </p>
      </motion.div>
    </div>
  );
}
