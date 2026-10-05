import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Clock3,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Send,
  ShieldCheck,
} from "lucide-react";

import { api, getErrorMessage } from "../services/api";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { useToast } from "../components/Toast";
import { brand } from "../config/brand";

const schema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().optional(),
  subject: z.string().min(2, "Subject is required"),
  message: z.string().min(5, "Message is too short"),
});

type FormData = z.infer<typeof schema>;

export default function Contact() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const [loading, setLoading] = useState(false);

  const { show } = useToast();

  async function onSubmit(data: FormData) {
    setLoading(true);

    try {
      await api.post("/contact", data);

      show("Your message has been sent!", "success");

      reset();
    } catch (err) {
      show(getErrorMessage(err), "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="bg-[#f5f3ee] dark:bg-[#080c14]">

      {/* ============================================================
          HERO
      ============================================================ */}

      <section className="relative overflow-hidden bg-[#101722] text-white">

        <div className="pointer-events-none absolute right-[-180px] top-[-180px] h-[520px] w-[520px] rounded-full border border-brand-gold/[0.08]" />

        <div className="pointer-events-none absolute bottom-[-220px] left-[-180px] h-[480px] w-[480px] rounded-full border border-white/[0.04]" />

        <div className="container-page relative py-20 sm:py-24 lg:py-28">

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl"
          >

            <div className="mb-7 flex items-center gap-3">

              <span className="h-px w-10 bg-brand-gold" />

              <span className="text-[9px] font-bold uppercase tracking-[0.35em] text-brand-gold">
                Get In Touch
              </span>

            </div>

            <h1 className="font-display text-5xl font-bold leading-[1.02] tracking-[-0.04em] sm:text-6xl lg:text-7xl">

              Let's start a
              <br />

              <span className="text-brand-gold">
                conversation.
              </span>

            </h1>

            <p className="mt-7 max-w-2xl text-sm leading-8 text-slate-400 sm:text-base">
              Have a question about courses, admissions, classes or student
              support? Reach out to REMON ACADEMY. We're here to help.
            </p>

          </motion.div>

        </div>

      </section>

      {/* ============================================================
          CONTACT INFO STRIP
      ============================================================ */}

      <section className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-[#0b1019]">

        <div className="container-page">

          <div className="grid md:grid-cols-3">

            {/* Address */}

            <div className="border-b border-slate-200 px-0 py-7 md:border-b-0 md:border-r md:px-8 md:py-9 dark:border-slate-800 md:first:pl-0">

              <div className="flex gap-4">

                <div className="flex h-11 w-11 shrink-0 items-center justify-center bg-brand-gold/[0.09]">

                  <MapPin className="h-5 w-5 text-brand-gold" />

                </div>

                <div>

                  <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-slate-400">
                    Visit Us
                  </p>

                  <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                    {brand.contact.address}
                  </p>

                </div>

              </div>

            </div>

            {/* Phone */}

            <div className="border-b border-slate-200 px-0 py-7 md:border-b-0 md:border-r md:px-8 md:py-9 dark:border-slate-800">

              <div className="flex gap-4">

                <div className="flex h-11 w-11 shrink-0 items-center justify-center bg-brand-gold/[0.09]">

                  <Phone className="h-5 w-5 text-brand-gold" />

                </div>

                <div>

                  <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-slate-400">
                    Call Us
                  </p>

                  <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                    {brand.contact.phone}
                  </p>

                </div>

              </div>

            </div>

            {/* Email */}

            <div className="px-0 py-7 md:px-8 md:py-9 md:last:pr-0">

              <div className="flex gap-4">

                <div className="flex h-11 w-11 shrink-0 items-center justify-center bg-brand-gold/[0.09]">

                  <Mail className="h-5 w-5 text-brand-gold" />

                </div>

                <div>

                  <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-slate-400">
                    Email Us
                  </p>

                  <p className="mt-2 break-all text-sm leading-6 text-slate-600 dark:text-slate-300">
                    {brand.contact.email}
                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* ============================================================
          MAIN CONTENT
      ============================================================ */}

      <section className="container-page py-16 sm:py-20 lg:py-24">

        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">

          {/* ========================================================
              LEFT SIDE
          ======================================================== */}

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
          >

            <div className="mb-8">

              <p className="text-[9px] font-bold uppercase tracking-[0.35em] text-brand-gold">
                Contact Information
              </p>

              <h2 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">
                We'd love to hear from you.
              </h2>

              <p className="mt-4 max-w-lg text-sm leading-7 text-slate-500">
                Whether you're interested in joining a course, need help with
                your student account, or simply want to know more about the
                academy, send us a message.
              </p>

            </div>

            {/* Support Card */}

            <div className="border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">

              <div className="flex gap-4">

                <div className="flex h-11 w-11 shrink-0 items-center justify-center bg-[#101722] text-brand-gold">

                  <MessageSquare className="h-5 w-5" />

                </div>

                <div>

                  <h3 className="font-display text-sm font-bold">
                    Student Support
                  </h3>

                  <p className="mt-2 text-xs leading-6 text-slate-500">
                    Need assistance with your account, courses, results or
                    academy services? Our team is ready to assist.
                  </p>

                </div>

              </div>

            </div>

            {/* Availability */}

            <div className="mt-4 grid gap-4 sm:grid-cols-2">

              <div className="border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">

                <Clock3 className="h-5 w-5 text-brand-gold" />

                <p className="mt-4 text-[9px] font-bold uppercase tracking-[0.22em] text-slate-400">
                  Availability
                </p>

                <p className="mt-2 text-sm font-semibold">
                  Academy Support
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Contact us for current hours
                </p>

              </div>

              <div className="border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">

                <ShieldCheck className="h-5 w-5 text-brand-gold" />

                <p className="mt-4 text-[9px] font-bold uppercase tracking-[0.22em] text-slate-400">
                  Response
                </p>

                <p className="mt-2 text-sm font-semibold">
                  Direct Support
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  We'll get back to you as soon as possible
                </p>

              </div>

            </div>

            {/* Map */}

            <div className="mt-4 overflow-hidden border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">

              <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-800">

                <div>

                  <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-brand-gold">
                    Find Us
                  </p>

                  <p className="mt-1 font-display text-sm font-bold">
                    Academy Location
                  </p>

                </div>

                <MapPin className="h-5 w-5 text-brand-gold" />

              </div>

              <iframe
                title="REMON Academy location"
                className="h-72 w-full grayscale-[20%]"
                loading="lazy"
                src={`https://www.google.com/maps?q=${encodeURIComponent(
                  brand.contact.address
                )}&output=embed`}
              />

            </div>

          </motion.div>

          {/* ========================================================
              CONTACT FORM
          ======================================================== */}

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
          >

            <div className="border border-slate-200 bg-white p-6 shadow-[0_25px_70px_rgba(16,23,34,0.05)] dark:border-slate-800 dark:bg-slate-900 sm:p-8 lg:p-10">

              <div className="mb-8">

                <div className="flex h-12 w-12 items-center justify-center bg-brand-gold/[0.09]">

                  <Send className="h-5 w-5 text-brand-gold" />

                </div>

                <p className="mt-6 text-[9px] font-bold uppercase tracking-[0.35em] text-brand-gold">
                  Send A Message
                </p>

                <h2 className="mt-3 font-display text-2xl font-bold sm:text-3xl">
                  Tell us how we can help.
                </h2>

                <p className="mt-3 text-sm leading-6 text-slate-500">
                  Fill in the details below and our team will receive your
                  message.
                </p>

              </div>

              <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-5"
              >

                <div className="grid gap-5 sm:grid-cols-2">

                  <Input
                    label="Full Name"
                    placeholder="Your name"
                    error={errors.name?.message}
                    {...register("name")}
                  />

                  <Input
                    label="Email"
                    type="email"
                    placeholder="you@example.com"
                    error={errors.email?.message}
                    {...register("email")}
                  />

                </div>

                <div className="grid gap-5 sm:grid-cols-2">

                  <Input
                    label="Phone"
                    placeholder="+8801XXXXXXXXX"
                    error={errors.phone?.message}
                    {...register("phone")}
                  />

                  <Input
                    label="Subject"
                    placeholder="How can we help?"
                    error={errors.subject?.message}
                    {...register("subject")}
                  />

                </div>

                <div>

                  <label className="label-field">
                    Message
                  </label>

                  <textarea
                    rows={7}
                    className="input-field min-h-[170px] resize-y"
                    placeholder="Write your message..."
                    {...register("message")}
                  />

                  {errors.message && (
                    <p className="mt-1.5 text-xs text-red-600">
                      {errors.message.message}
                    </p>
                  )}

                </div>

                <Button
                  type="submit"
                  loading={loading}
                  className="group w-full"
                >

                  <span>
                    Send Message
                  </span>

                  {!loading && (
                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  )}

                </Button>

                <p className="flex items-center justify-center gap-2 pt-1 text-[10px] text-slate-400">

                  <ShieldCheck className="h-3.5 w-3.5 text-brand-gold" />

                  Your information is handled securely.

                </p>

              </form>

            </div>

          </motion.div>

        </div>

      </section>

      {/* ============================================================
          BOTTOM CTA
      ============================================================ */}

      <section className="bg-[#101722] text-white">

        <div className="container-page py-16 sm:py-20">

          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">

            <div>

              <p className="text-[9px] font-bold uppercase tracking-[0.35em] text-brand-gold">
                REMON ACADEMY
              </p>

              <h2 className="mt-3 max-w-2xl font-display text-3xl font-bold leading-tight sm:text-4xl">
                The right conversation can be the beginning of something great.
              </h2>

            </div>

            <div className="max-w-sm">

              <p className="text-sm leading-7 text-slate-400">
                Explore our courses and discover an academic environment built
                around focused learning and meaningful progress.
              </p>

            </div>

          </div>

        </div>

      </section>

    </main>
  );
}


