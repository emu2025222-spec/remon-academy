
import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Menu,
  X,
} from "lucide-react";

import { brand } from "../config/brand";
import { useAuth } from "../context/AuthContext";

const links = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/founder", label: "Founder" },
  { to: "/courses", label: "Courses" },
  { to: "/teachers", label: "Teachers" },
  { to: "/results", label: "Results" },
  { to: "/notices", label: "Notices" },
  { to: "/gallery", label: "Gallery" },
  { to: "/contact", label: "Contact" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", onScroll);
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  async function handleLogout() {
    setOpen(false);
    await logout();
    navigate("/");
  }

  function closeMenu() {
    setOpen(false);
  }

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b transition-all duration-300 ${
        scrolled
          ? "border-[#e8e3d8] bg-white/95 shadow-[0_8px_30px_rgba(15,23,42,0.07)] backdrop-blur-xl"
          : "border-[#f0ede6] bg-white"
      }`}
    >
      <nav className="container-page flex h-[72px] items-center justify-between gap-3 sm:h-[76px]">
        {/* BRAND */}
        <Link
          to="/"
          onClick={closeMenu}
          className="group flex shrink-0 items-center gap-2.5 sm:gap-3"
        >
          <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white shadow-[0_5px_18px_rgba(11,31,77,0.12)] transition-transform duration-300 group-hover:-translate-y-0.5 sm:h-11 sm:w-11">
            <img
              src="/logo.png"
              alt="REMON ACADEMY"
              className="h-full w-full object-contain p-1.5"
            />
          </div>

          <div className="leading-none">
            <div className="font-display text-[16px] font-extrabold tracking-tight text-[#0b1f4d] sm:text-[17px]">
              {brand.name}
            </div>

            <div className="mt-1.5 text-[8px] font-semibold uppercase tracking-[0.19em] text-slate-400 sm:text-[9px] sm:tracking-[0.24em]">
              Education • Excellence
            </div>
          </div>
        </Link>

        {/* DESKTOP NAVIGATION */}
        <div className="hidden items-center gap-0.5 xl:flex">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `relative rounded-full px-3 py-2 text-[12px] font-semibold transition-all duration-200 2xl:px-3.5 2xl:text-[13px] ${
                  isActive
                    ? "text-[#0b1f4d]"
                    : "text-slate-500 hover:text-[#0b1f4d]"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {link.label}

                  {isActive && (
                    <motion.span
                      layoutId="navbar-active"
                      className="absolute bottom-0 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-[#c9a24b]"
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>

        {/* DESKTOP ACTIONS */}
        <div className="hidden shrink-0 items-center gap-2 xl:flex">
          {user ? (
            <div className="ml-1 flex items-center gap-2">
              <Link
                to={
                  user.role === "ADMIN"
                    ? "/admin/dashboard"
                    : "/student/dashboard"
                }
                className="flex items-center gap-2 rounded-full border border-[#0b1f4d] bg-[#0b1f4d] px-4 py-2.5 text-xs font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-[#071535] hover:shadow-lg"
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Link>

              <button
                onClick={handleLogout}
                aria-label="Logout"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition-all hover:border-red-200 hover:bg-red-50 hover:text-red-500"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="group ml-1 flex items-center gap-2 rounded-full bg-[#0b1f4d] px-5 py-2.5 text-xs font-bold text-white shadow-[0_8px_24px_rgba(11,31,77,0.16)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#071535] hover:shadow-xl"
            >
              Student Login

              <ChevronDown className="h-3.5 w-3.5 -rotate-90 transition-transform group-hover:translate-x-0.5" />
            </Link>
          )}
        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-label="Toggle menu"
          aria-expanded={open}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#e8e3d8] text-[#0b1f4d] transition-all hover:border-[#c9a24b] hover:text-[#c9a24b] xl:hidden sm:h-11 sm:w-11"
        >
          {open ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </nav>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMenu}
              className="fixed inset-0 top-[72px] bg-[#071535]/25 backdrop-blur-[2px] xl:hidden sm:top-[76px]"
            />

            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
              className="absolute left-0 right-0 top-full max-h-[calc(100vh-72px)] overflow-y-auto border-b border-[#e8e3d8] bg-white shadow-[0_20px_40px_rgba(15,23,42,0.12)] xl:hidden"
            >
              <div className="container-page py-4">
                {/* MOBILE BRAND */}
                <div className="mb-3 flex items-center gap-3 border-b border-[#eeeae1] pb-4">
                  <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-lg bg-white">
                    <img
                      src="/logo.png"
                      alt="REMON ACADEMY"
                      className="h-full w-full object-contain p-1"
                    />
                  </div>

                  <div>
                    <p className="text-sm font-bold text-[#0b1f4d]">
                      {brand.name}
                    </p>

                    <p className="mt-1 text-[9px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                      Education • Excellence
                    </p>
                  </div>
                </div>

                {/* MOBILE LINKS */}
                <div className="space-y-1">
                  {links.map((link) => (
                    <NavLink
                      key={link.to}
                      to={link.to}
                      onClick={closeMenu}
                      className={({ isActive }) =>
                        `flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
                          isActive
                            ? "bg-[#0b1f4d] text-white shadow-sm"
                            : "text-slate-600 hover:bg-[#f8f7f4] hover:text-[#0b1f4d]"
                        }`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <span>{link.label}</span>

                          {isActive && (
                            <span className="h-1.5 w-1.5 rounded-full bg-[#e0c179]" />
                          )}
                        </>
                      )}
                    </NavLink>
                  ))}
                </div>

                {/* MOBILE ACTIONS */}
                <div className="mt-4 flex items-center justify-between gap-3 border-t border-[#eeeae1] pt-4">
                  {user ? (
                    <div className="flex w-full items-center justify-between gap-2">
                      <Link
                        onClick={closeMenu}
                        to={
                          user.role === "ADMIN"
                            ? "/admin/dashboard"
                            : "/student/dashboard"
                        }
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#0b1f4d] px-4 py-3 text-xs font-bold text-white transition-colors hover:bg-[#071535]"
                      >
                        <LayoutDashboard className="h-4 w-4" />
                        Dashboard
                      </Link>

                      <button
                        onClick={handleLogout}
                        aria-label="Logout"
                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-500"
                      >
                        <LogOut className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <Link
                      to="/login"
                      onClick={closeMenu}
                      className="w-full rounded-xl bg-[#0b1f4d] px-5 py-3 text-center text-xs font-bold text-white transition-colors hover:bg-[#071535]"
                    >
                      Student Login
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
