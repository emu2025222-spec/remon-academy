import { Link } from "react-router-dom";
import { Facebook, Youtube, Mail, Phone, MapPin, GraduationCap } from "lucide-react";
import { brand } from "../config/brand";

export function Footer() {
  return (
    <footer className="bg-brand-navyDark text-slate-300">
      <div className="container-page grid gap-8 py-12 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2 font-display text-lg font-bold text-white">
            <GraduationCap className="h-6 w-6 text-brand-gold" />
            {brand.name}
          </div>
          <p className="mt-3 text-sm text-slate-400">{brand.tagline}</p>
          <div className="mt-4 flex gap-3">
            <a href={brand.social.facebook} target="_blank" rel="noreferrer" className="rounded-full bg-white/10 p-2 hover:bg-brand-gold">
              <Facebook className="h-4 w-4" />
            </a>
            <a href={brand.social.youtube} target="_blank" rel="noreferrer" className="rounded-full bg-white/10 p-2 hover:bg-brand-gold">
              <Youtube className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div>
          <h4 className="mb-3 font-semibold text-white">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/about" className="hover:text-brand-gold">About Us</Link></li>
            <li><Link to="/courses" className="hover:text-brand-gold">Courses</Link></li>
            <li><Link to="/teachers" className="hover:text-brand-gold">Teachers</Link></li>
            <li><Link to="/notices" className="hover:text-brand-gold">Notices</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 font-semibold text-white">Students</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/results" className="hover:text-brand-gold">Results</Link></li>
            <li><Link to="/gallery" className="hover:text-brand-gold">Gallery</Link></li>
            <li><Link to="/login" className="hover:text-brand-gold">Student Login</Link></li>
            <li><Link to="/register" className="hover:text-brand-gold">Register</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 font-semibold text-white">Contact</h4>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2"><MapPin className="mt-0.5 h-4 w-4 shrink-0" /> {brand.contact.address}</li>
            <li className="flex items-center gap-2"><Phone className="h-4 w-4" /> {brand.contact.phone}</li>
            <li className="flex items-center gap-2"><Mail className="h-4 w-4" /> {brand.contact.email}</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} {brand.name}. All rights reserved.
      </div>
    </footer>
  );
}
