
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  Facebook,
  Mail,
  MapPin,
  Phone,
  Youtube,
} from "lucide-react";

import { brand } from "../config/brand";

const quickLinks = [
  { to: "/about", label: "About Us" },
  { to: "/courses", label: "Courses" },
  { to: "/teachers", label: "Teachers" },
  { to: "/notices", label: "Notices" },
];

const studentLinks = [
  { to: "/results", label: "Results" },
  { to: "/gallery", label: "Gallery" },
  { to: "/login", label: "Student Login" },
  { to: "/register", label: "Register" },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative isolate overflow-hidden bg-[#071535] text-slate-300">
      {/* Decorative Background */}
      <div className="pointer-events-none absolute -right-32 -top-32 -z-10 h-[380px] w-[380px] rounded-full border border-[#c9a24b]/10" />
      <div className="pointer-events-none absolute -right-20 -top-20 -z-10 h-[260px] w-[260px] rounded-full border border-[#c9a24b]/10" />
      <div className="pointer-events-none absolute -bottom-40 -left-32 -z-10 h-[350px] w-[350px] rounded-full bg-[#0b1f4d]/70 blur-3xl" />

      <div className="container-page relative">
        {/* TOP BRAND / CTA AREA */}
        <div className="flex flex-col gap-8 border-b border-white/10 py-12 md:flex-row md:items-end md:justify-between md:py-16">
          <div className="max-w-2xl">
            {/* BRAND */}
            <div className="mb-6 inline-flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl bg-white shadow-[0_8px_24px_rgba(0,0,0,0.2)]">
                <img
                  src="/logo.png"
                  alt="REMON ACADEMY"
                  className="h-full w-full object-contain p-1.5"
                />
              </div>

              <div>
                <div className="font-display text-lg font-extrabold tracking-tight text-white">
                  {brand.name}
                </div>

                <div className="mt-1 text-[9px] font-bold uppercase tracking-[0.25em] text-slate-400">
                  Education • Excellence
                </div>
              </div>
            </div>

            <h2 className="max-w-xl font-display text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl">
              Building knowledge.
              <br />
              <span className="text-[#e0c179]">
                Shaping the future.
              </span>
            </h2>

            <p className="mt-4 max-w-xl text-sm leading-7 text-slate-400 sm:text-base">
              {brand.tagline}
            </p>
          </div>

          <Link
            to="/courses"
            className="group inline-flex w-fit items-center gap-3 rounded-full border border-[#c9a24b]/60 px-5 py-3 text-sm font-bold text-[#e0c179] transition-all duration-300 hover:-translate-y-1 hover:bg-[#c9a24b] hover:text-[#071535] hover:shadow-lg hover:shadow-[#c9a24b]/10"
          >
            Explore Courses

            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#c9a24b]/15 transition-transform duration-300 group-hover:translate-x-1 group-hover:bg-[#071535]/10">
              <ArrowUpRight className="h-4 w-4" />
            </span>
          </Link>
        </div>

        {/* MAIN FOOTER GRID */}
        <div className="grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-12 lg:py-14">
          {/* ABOUT */}
          <div>
            <h3 className="mb-5 text-xs font-bold uppercase tracking-[0.2em] text-[#e0c179]">
              REMON ACADEMY
            </h3>

            <p className="max-w-sm text-sm leading-7 text-slate-400">
              A modern learning platform dedicated to helping students
              develop stronger knowledge, confidence, discipline and a
              clearer direction for their future.
            </p>

            {/* SOCIAL LINKS */}
            <div className="mt-6 flex items-center gap-3">
              <a
                href={brand.social.facebook}
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-slate-400 transition-all duration-300 hover:-translate-y-1 hover:border-[#c9a24b] hover:bg-[#c9a24b] hover:text-[#071535]"
              >
                <Facebook className="h-4 w-4" />
              </a>

              <a
                href={brand.social.youtube}
                target="_blank"
                rel="noreferrer"
                aria-label="YouTube"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-slate-400 transition-all duration-300 hover:-translate-y-1 hover:border-[#c9a24b] hover:bg-[#c9a24b] hover:text-[#071535]"
              >
                <Youtube className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* QUICK LINKS */}
          <div>
            <h3 className="mb-5 text-xs font-bold uppercase tracking-[0.2em] text-[#e0c179]">
              Explore
            </h3>

            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="group inline-flex items-center gap-2 text-sm text-slate-400 transition-colors duration-200 hover:text-white"
                  >
                    <span className="h-px w-0 bg-[#c9a24b] transition-all duration-300 group-hover:w-4" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* STUDENT LINKS */}
          <div>
            <h3 className="mb-5 text-xs font-bold uppercase tracking-[0.2em] text-[#e0c179]">
              Students
            </h3>

            <ul className="space-y-3">
              {studentLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="group inline-flex items-center gap-2 text-sm text-slate-400 transition-colors duration-200 hover:text-white"
                  >
                    <span className="h-px w-0 bg-[#c9a24b] transition-all duration-300 group-hover:w-4" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* CONTACT */}
          <div>
            <h3 className="mb-5 text-xs font-bold uppercase tracking-[0.2em] text-[#e0c179]">
              Contact
            </h3>

            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04]">
                  <MapPin className="h-4 w-4 text-[#e0c179]" />
                </span>

                <span className="pt-1 text-sm leading-6 text-slate-400">
                  {brand.contact.address}
                </span>
              </li>

              <li className="flex items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04]">
                  <Phone className="h-4 w-4 text-[#e0c179]" />
                </span>

                <a
                  href={`tel:${brand.contact.phone}`}
                  className="text-sm text-slate-400 transition-colors hover:text-white"
                >
                  {brand.contact.phone}
                </a>
              </li>

              <li className="flex items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04]">
                  <Mail className="h-4 w-4 text-[#e0c179]" />
                </span>

                <a
                  href={`mailto:${brand.contact.email}`}
                  className="break-all text-sm text-slate-400 transition-colors hover:text-white"
                >
                  {brand.contact.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div className="flex flex-col gap-4 border-t border-white/10 py-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {currentYear}{" "}
            <span className="font-semibold text-slate-300">
              {brand.name}
            </span>
            . All rights reserved.
          </p>

          <div className="flex flex-wrap items-center gap-2">
            <span>Designed for</span>
            <span className="font-semibold text-[#e0c179]">
              Learning & Excellence
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
