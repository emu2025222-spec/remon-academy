
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
    <main className="overflow-hidden bg-[#f8f7f4] text-slate-800">

      {/* HERO */}
      <section className="relative overflow-hidden bg-[#071535] text-white">
        <div className="pointer-events-none absolute -right-44 -top-44 h-[520px] w-[520px] rounded-full border border-[#c9a24b]/15" />

        <div className="pointer-events-none absolute -bottom-56 -left-44 h-[480px] w-[480px] rounded-full border border-white/[0.06]" />

        <div className="container-page relative py-20 sm:py-24 lg:py-28">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl"
          >
            <div className="mb-7 flex items-center gap-3">
              <span className="h-px w-10 bg-[#c9a24b]" />

              <span className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#e0c179]">
                Get In Touch
              </span>
            </div>

            <h1 className="font-display text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
              Let's start a
              <br />
              <span className="text-[#e0c179]">
                conversation.
              </span>
            </h1>

            <p className="mt-7 max-w-2xl text-sm leading-8 text-slate-300 sm:text-base">
              Have a question about courses, admissions, classes or student
              support? Reach out to REMON ACADEMY. We're here to help.
            </p>
          </motion.div>
        </div>
      </section>

      {/* CONTACT INFO */}
      <section className="border-b border-[#eae6dd] bg-white">
        <div className="container-page">
          <div className="grid md:grid-cols-3">

            {/* Address */}
            <div className="border-b border-[#eae6dd] px-0 py-7 md:border-b-0 md:border-r md:px-8 md:py-9 md:first:pl-0">
              <div className="flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#c9a24b]/20 bg-[#c9a24b]/10">
                  <MapPin className="h-5 w-5 text-[#a17b2e]" />
                </div>

                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-400">
                    Visit Us
                  </p>

                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {brand.contact.address}
                  </p>
                </div>
              </div>
            </div>

            {/* Phone */}
            <div className="border-b border-[#eae6dd] px-0 py-7 md:border-b-0 md:border-r md:px-8 md:py-9">
              <div className="flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#c9a24b]/20 bg-[#c9a24b]/10">
                  <Phone className="h-5 w-5 text-[#a17b2e]" />
                </div>

                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-400">
                    Call Us
                  </p>

                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {brand.contact.phone}
                  </p>
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="px-0 py-7 md:px-8 md:py-9 md:last:pr-0">
              <div className="flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#c9a24b]/20 bg-[#c9a24b]/10">
                  <Mail className="h-5 w-5 text-[#a17b2e]" />
                </div>

                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-400">
                    Email Us
                  </p>

                  <p className="mt-2 break-all text-sm leading-6 text-slate-600">
                    {brand.contact.email}
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <section className="container-page py-16 sm:py-20 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">

          {/* LEFT SIDE */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
          >
            <div className="mb-8">
              <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#a17b2e]">
                Contact Information
              </p>

              <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-[#0b1f4d] sm:text-4xl">
                We'd love to hear from you.
              </h2>

              <p className="mt-4 max-w-lg text-sm leading-7 text-slate-600">
                Whether you're interested in joining a course, need help with
                your student account, or simply want to know more about the
                academy, send us a message.
              </p>
            </div>

            {/* SUPPORT CARD */}
            <div className="rounded-2xl border border-[#eae6dd] bg-white p-6 shadow-sm">
              <div className="flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#071535] text-[#e0c179]">
                  <MessageSquare className="h-5 w-5" />
                </div>

                <div>
                  <h3 className="font-display text-base font-bold text-[#0b1f4d]">
                    Student Support
                  </h3>

                  <p className="mt-2 text-xs leading-6 text-slate-500">
                    Need assistance with your account, courses, results or
                    academy services? Our team is ready to assist.
                  </p>
                </div>
              </div>
            </div>

            {/* AVAILABILITY */}
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-[#eae6dd] bg-white p-5 shadow-sm">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#c9a24b]/10">
                  <Clock3 className="h-5 w-5 text-[#a17b2e]" />
                </div>

                <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400">
                  Availability
                </p>

                <p className="mt-2 text-sm font-bold text-[#0b1f4d]">
                  Academy Support
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Contact us for current hours
                </p>
              </div>

              <div className="rounded-2xl border border-[#eae6dd] bg-white p-5 shadow-sm">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#c9a24b]/10">
                  <ShieldCheck className="h-5 w-5 text-[#a17b2e]" />
                </div>

                <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400">
                  Response
                </p>

                <p className="mt-2 text-sm font-bold text-[#0b1f4d]">
                  Direct Support
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  We'll get back to you as soon as possible
                </p>
              </div>
            </div>

            {/* MAP */}
            <div className="mt-4 overflow-hidden rounded-2xl border border-[#eae6dd] bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-[#eae6dd] px-5 py-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#a17b2e]">
                    Find Us
                  </p>

                  <p className="mt-1 font-display text-sm font-bold text-[#0b1f4d]">
                    Academy Location
                  </p>
                </div>

                <MapPin className="h-5 w-5 text-[#a17b2e]" />
              </div>

              <iframe
                title="REMON Academy location"
                className="h-72 w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                src={`https://www.google.com/maps?q=${encodeURIComponent(
                  brand.contact.address
                )}&output=embed`}
              />
            </div>
          </motion.div>

          {/* CONTACT FORM */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
          >
            <div className="rounded-3xl border border-[#eae6dd] bg-white p-6 shadow-[0_20px_60px_rgba(11,31,77,0.06)] sm:p-8 lg:p-10">
              <div className="mb-8">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#c9a24b]/20 bg-[#c9a24b]/10">
                  <Send className="h-5 w-5 text-[#a17b2e]" />
                </div>

                <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.35em] text-[#a17b2e]">
                  Send A Message
                </p>

                <h2 className="mt-3 font-display text-2xl font-bold text-[#0b1f4d] sm:text-3xl">
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
                    autoComplete="name"
                    error={errors.name?.message}
                    {...register("name")}
                  />

                  <Input
                    label="Email"
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    error={errors.email?.message}
                    {...register("email")}
                  />
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <Input
                    label="Phone"
                    type="tel"
                    placeholder="+8801XXXXXXXXX"
                    autoComplete="tel"
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
                  <label
                    htmlFor="contact-message"
                    className="mb-2 block text-sm font-semibold text-[#0b1f4d]"
                  >
                    Message
                  </label>

                  <textarea
                    id="contact-message"
                    rows={7}
                    aria-invalid={Boolean(errors.message)}
                    aria-describedby={
                      errors.message ? "contact-message-error" : undefined
                    }
                    className="
                      min-h-[170px] w-full resize-y rounded-xl
                      border border-[#dedbd3] bg-white px-4 py-3
                      text-sm text-slate-800 placeholder:text-slate-400
                      outline-none transition-all duration-200
                      hover:border-[#b9b4a8]
                      focus:border-[#c9a24b]
                      focus:ring-4 focus:ring-[#c9a24b]/15
                    "
                    placeholder="Write your message..."
                    {...register("message")}
                  />

                  {errors.message && (
                    <p
                      id="contact-message-error"
                      role="alert"
                      className="mt-1.5 text-xs font-medium text-red-600"
                    >
                      {errors.message.message}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  loading={loading}
                  className="group w-full !rounded-xl !py-3.5"
                >
                  <span>Send Message</span>

                  {!loading && (
                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  )}
                </Button>

                <p className="flex items-center justify-center gap-2 pt-1 text-[10px] text-slate-400">
                  <ShieldCheck className="h-3.5 w-3.5 text-[#a17b2e]" />
                  Your information is handled securely.
                </p>
              </form>
            </div>
          </motion.div>
        </div>
      </section>

      {/* BOTTOM CTA */}
      <section className="bg-[#071535] text-white">
        <div className="container-page py-16 sm:py-20">
          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#e0c179]">
                REMON ACADEMY
              </p>

              <h2 className="mt-3 max-w-2xl font-display text-3xl font-bold leading-tight sm:text-4xl">
                The right conversation can be the beginning of something great.
              </h2>
            </div>

            <div className="max-w-sm">
              <p className="text-sm leading-7 text-slate-300">
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
