import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Menu,
  Moon,
  Sun,
  X,
} from "lucide-react";

import { brand } from "../config/brand";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

const links = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
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
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", onScroll);

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
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "border-b border-slate-200/70 bg-white/95 shadow-[0_8px_30px_rgba(15,23,42,0.06)] backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-950/95"
          : "border-b border-transparent bg-white dark:bg-slate-950"
      }`}
    >
      <nav className="container-page flex h-[76px] items-center justify-between">
        {/* BRAND */}
        <Link
          to="/"
          onClick={closeMenu}
          className="group flex items-center gap-3"
        >
          {/* REAL LOGO */}
          <div className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white shadow-[0_8px_24px_rgba(15,23,42,0.10)] transition-transform duration-300 group-hover:-translate-y-0.5">
            <img
              src="/logo.png"
              alt="REMON ACADEMY"
              className="h-full w-full object-contain p-1.5"
            />
          </div>

          <div className="leading-none">
            <div className="font-display text-[17px] font-extrabold tracking-tight text-brand-navy dark:text-white">
              {brand.name}
            </div>

            <div className="mt-1 text-[9px] font-semibold uppercase tracking-[0.24em] text-slate-400 dark:text-slate-500">
              Education • Excellence
            </div>
          </div>
        </Link>

        {/* DESKTOP NAVIGATION */}
        <div className="hidden items-center gap-1 lg:flex">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `relative rounded-full px-3.5 py-2 text-[13px] font-semibold transition-all duration-200 ${
                  isActive
                    ? "text-brand-navy dark:text-white"
                    : "text-slate-500 hover:text-brand-navy dark:text-slate-400 dark:hover:text-white"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {link.label}

                  {isActive && (
                    <motion.span
                      layoutId="navbar-active"
                      className="absolute bottom-0 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-brand-gold"
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>

        {/* DESKTOP ACTIONS */}
        <div className="hidden items-center gap-2 lg:flex">
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition-all hover:border-brand-gold hover:text-brand-gold dark:border-slate-800 dark:text-slate-400"
          >
            {theme === "dark" ? (
              <Sun className="h-[17px] w-[17px]" />
            ) : (
              <Moon className="h-[17px] w-[17px]" />
            )}
          </button>

          {user ? (
            <div className="ml-1 flex items-center gap-2">
              <Link
                to={
                  user.role === "ADMIN"
                    ? "/admin/dashboard"
                    : "/student/dashboard"
                }
                className="flex items-center gap-2 rounded-full border border-brand-navy bg-brand-navy px-4 py-2.5 text-xs font-bold text-white transition-all hover:-translate-y-0.5 hover:shadow-lg dark:border-brand-gold dark:bg-brand-gold dark:text-brand-navy"
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Link>

              <button
                onClick={handleLogout}
                aria-label="Logout"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition-all hover:border-red-200 hover:bg-red-50 hover:text-red-500 dark:border-slate-800 dark:hover:bg-red-950/30"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="group ml-1 flex items-center gap-2 rounded-full bg-brand-navy px-5 py-2.5 text-xs font-bold text-white shadow-[0_8px_24px_rgba(15,23,42,0.14)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl dark:bg-brand-gold dark:text-brand-navy"
            >
              Student Login

              <ChevronDown className="h-3.5 w-3.5 -rotate-90 transition-transform group-hover:translate-x-0.5" />
            </Link>
          )}
        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          onClick={() => setOpen((value) => !value)}
          aria-label="Toggle menu"
          aria-expanded={open}
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 text-brand-navy transition-all hover:border-brand-gold hover:text-brand-gold lg:hidden dark:border-slate-800 dark:text-white"
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
              className="fixed inset-0 top-[76px] bg-slate-950/20 backdrop-blur-[2px] lg:hidden"
            />

            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
              className="absolute left-0 right-0 top-full border-b border-slate-200 bg-white shadow-[0_20px_40px_rgba(15,23,42,0.10)] dark:border-slate-800 dark:bg-slate-950 lg:hidden"
            >
              <div className="container-page py-4">
                {/* Mobile brand heading */}
                <div className="mb-3 flex items-center gap-3 border-b border-slate-100 pb-4 dark:border-slate-800">
                  {/* REAL MOBILE LOGO */}
                  <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-lg bg-white">
                    <img
                      src="/logo.png"
                      alt="REMON ACADEMY"
                      className="h-full w-full object-contain p-1"
                    />
                  </div>

                  <div>
                    <p className="text-sm font-bold text-brand-navy dark:text-white">
                      {brand.name}
                    </p>

                    <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                      Education • Excellence
                    </p>
                  </div>
                </div>

                {/* Links */}
                <div className="space-y-1">
                  {links.map((link) => (
                    <NavLink
                      key={link.to}
                      to={link.to}
                      onClick={closeMenu}
                      className={({ isActive }) =>
                        `flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
                          isActive
                            ? "bg-brand-navy text-white dark:bg-brand-gold dark:text-brand-navy"
                            : "text-slate-600 hover:bg-slate-50 hover:text-brand-navy dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white"
                        }`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <span>{link.label}</span>

                          {isActive && (
                            <span className="h-1.5 w-1.5 rounded-full bg-brand-gold dark:bg-brand-navy" />
                          )}
                        </>
                      )}
                    </NavLink>
                  ))}
                </div>

                {/* Mobile actions */}
                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
                  <button
                    onClick={toggleTheme}
                    className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-600 dark:border-slate-800 dark:text-slate-300"
                  >
                    {theme === "dark" ? (
                      <Sun className="h-4 w-4" />
                    ) : (
                      <Moon className="h-4 w-4" />
                    )}

                    {theme === "dark" ? "Light Mode" : "Dark Mode"}
                  </button>

                  {user ? (
                    <div className="flex gap-2">
                      <Link
                        onClick={closeMenu}
                        to={
                          user.role === "ADMIN"
                            ? "/admin/dashboard"
                            : "/student/dashboard"
                        }
                        className="flex items-center gap-2 rounded-xl bg-brand-navy px-4 py-2.5 text-xs font-bold text-white dark:bg-brand-gold dark:text-brand-navy"
                      >
                        <LayoutDashboard className="h-4 w-4" />
                        Dashboard
                      </Link>

                      <button
                        onClick={handleLogout}
                        className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-500 dark:border-slate-800"
                      >
                        <LogOut className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <Link
                      to="/login"
                      onClick={closeMenu}
                      className="rounded-xl bg-brand-navy px-5 py-2.5 text-xs font-bold text-white dark:bg-brand-gold dark:text-brand-navy"
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


