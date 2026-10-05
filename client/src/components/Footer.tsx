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
    <footer className="relative overflow-hidden bg-brand-navyDark text-slate-300">
      {/* Decorative background */}
      <div className="pointer-events-none absolute right-[-120px] top-[-120px] h-[300px] w-[300px] rounded-full border border-brand-gold/10" />
      <div className="pointer-events-none absolute right-[-70px] top-[-70px] h-[200px] w-[200px] rounded-full border border-brand-gold/10" />

      <div className="container-page relative">
        {/* TOP BRAND / CTA AREA */}
        <div className="flex flex-col gap-8 border-b border-white/10 py-12 md:flex-row md:items-end md:justify-between md:py-16">
          <div className="max-w-2xl">
            {/* REAL LOGO */}
            <div className="mb-5 inline-flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl bg-white shadow-lg">
                <img
                  src="/logo.jpg"
                  alt="REMON ACADEMY"
                  className="h-full w-full object-contain p-1.5"
                />
              </div>

              <div>
                <div className="font-display text-lg font-extrabold tracking-tight text-white">
                  {brand.name}
                </div>

                <div className="mt-1 text-[9px] font-bold uppercase tracking-[0.25em] text-slate-500">
                  Education • Excellence
                </div>
              </div>
            </div>

            <h2 className="max-w-xl font-display text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl">
              Building knowledge.
              <br />
              <span className="text-brand-gold">
                Shaping the future.
              </span>
            </h2>

            <p className="mt-4 max-w-xl text-sm leading-7 text-slate-400 sm:text-base">
              {brand.tagline}
            </p>
          </div>

          <Link
            to="/courses"
            className="group inline-flex w-fit items-center gap-3 rounded-full border border-brand-gold/50 px-5 py-3 text-sm font-bold text-brand-gold transition-all duration-300 hover:bg-brand-gold hover:text-brand-navy"
          >
            Explore Courses

            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-gold/10 transition-transform duration-300 group-hover:translate-x-1 group-hover:bg-brand-navy/10">
              <ArrowUpRight className="h-4 w-4" />
            </span>
          </Link>
        </div>

        {/* MAIN FOOTER GRID */}
        <div className="grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-12 lg:py-14">
          {/* Brand */}
          <div>
            <h3 className="mb-5 text-xs font-bold uppercase tracking-[0.2em] text-brand-gold">
              REMON ACADEMY
            </h3>

            <p className="max-w-sm text-sm leading-7 text-slate-400">
              A modern learning platform dedicated to helping students
              develop stronger knowledge, confidence, discipline and a
              clearer direction for their future.
            </p>

            {/* Social */}
            <div className="mt-6 flex items-center gap-3">
              <a
                href={brand.social.facebook}
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-slate-400 transition-all duration-300 hover:-translate-y-1 hover:border-brand-gold hover:bg-brand-gold hover:text-brand-navy"
              >
                <Facebook className="h-4 w-4" />
              </a>

              <a
                href={brand.social.youtube}
                target="_blank"
                rel="noreferrer"
                aria-label="YouTube"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-slate-400 transition-all duration-300 hover:-translate-y-1 hover:border-brand-gold hover:bg-brand-gold hover:text-brand-navy"
              >
                <Youtube className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-5 text-xs font-bold uppercase tracking-[0.2em] text-brand-gold">
              Explore
            </h3>

            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="group inline-flex items-center gap-2 text-sm text-slate-400 transition-colors duration-200 hover:text-white"
                  >
                    <span className="h-px w-0 bg-brand-gold transition-all duration-300 group-hover:w-4" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Students */}
          <div>
            <h3 className="mb-5 text-xs font-bold uppercase tracking-[0.2em] text-brand-gold">
              Students
            </h3>

            <ul className="space-y-3">
              {studentLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="group inline-flex items-center gap-2 text-sm text-slate-400 transition-colors duration-200 hover:text-white"
                  >
                    <span className="h-px w-0 bg-brand-gold transition-all duration-300 group-hover:w-4" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-5 text-xs font-bold uppercase tracking-[0.2em] text-brand-gold">
              Contact
            </h3>

            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04]">
                  <MapPin className="h-4 w-4 text-brand-gold" />
                </span>

                <span className="pt-1 text-sm leading-6 text-slate-400">
                  {brand.contact.address}
                </span>
              </li>

              <li className="flex items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04]">
                  <Phone className="h-4 w-4 text-brand-gold" />
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
                  <Mail className="h-4 w-4 text-brand-gold" />
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
            <span className="font-semibold text-slate-400">
              {brand.name}
            </span>
            . All rights reserved.
          </p>

          <div className="flex items-center gap-2">
            <span>Designed for</span>

            <span className="font-semibold text-brand-gold">
              Learning & Excellence
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

