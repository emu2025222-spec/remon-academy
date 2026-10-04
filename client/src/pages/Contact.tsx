import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, Phone, MapPin } from "lucide-react";
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
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(schema) });
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
    <div className="container-page py-16">
      <div className="mb-10 text-center">
        <h1 className="font-display text-4xl font-bold text-brand-navy dark:text-white">Contact Us</h1>
        <p className="mt-2 text-slate-500">We'd love to hear from you.</p>
      </div>

      <div className="grid gap-10 md:grid-cols-2">
        <div className="space-y-6">
          <div className="card flex items-center gap-4 p-5">
            <MapPin className="h-6 w-6 text-brand-gold" />
            <span className="text-sm">{brand.contact.address}</span>
          </div>
          <div className="card flex items-center gap-4 p-5">
            <Phone className="h-6 w-6 text-brand-gold" />
            <span className="text-sm">{brand.contact.phone}</span>
          </div>
          <div className="card flex items-center gap-4 p-5">
            <Mail className="h-6 w-6 text-brand-gold" />
            <span className="text-sm">{brand.contact.email}</span>
          </div>
          <div className="card overflow-hidden">
            <iframe
              title="map"
              className="h-64 w-full"
              loading="lazy"
              src={`https://www.google.com/maps?q=${encodeURIComponent(brand.contact.address)}&output=embed`}
            />
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="card space-y-4 p-6">
          <Input label="Full Name" placeholder="Your name" error={errors.name?.message} {...register("name")} />
          <Input label="Email" type="email" placeholder="you@example.com" error={errors.email?.message} {...register("email")} />
          <Input label="Phone (optional)" placeholder="+8801XXXXXXXXX" error={errors.phone?.message} {...register("phone")} />
          <Input label="Subject" placeholder="How can we help?" error={errors.subject?.message} {...register("subject")} />
          <div>
            <label className="label-field">Message</label>
            <textarea rows={5} className="input-field" placeholder="Write your message..." {...register("message")} />
            {errors.message && <p className="mt-1 text-xs text-red-600">{errors.message.message}</p>}
          </div>
          <Button type="submit" loading={loading} className="w-full">Send Message</Button>
        </form>
      </div>
    </div>
  );
}
