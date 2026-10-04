import { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sun, Moon, GraduationCap, LogOut, LayoutDashboard } from "lucide-react";
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
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  async function handleLogout() {
    await logout();
    navigate("/");
  }

  return (
    <header
      className={`sticky top-0 z-40 transition-all ${
        scrolled ? "bg-white/90 dark:bg-slate-950/90 shadow-md backdrop-blur" : "bg-white dark:bg-slate-950"
      }`}
    >
      <nav className="container-page flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-display text-lg font-bold text-brand-navy dark:text-white">
          <GraduationCap className="h-7 w-7 text-brand-gold" />
          {brand.name}
        </Link>

        <div className="hidden items-center gap-6 lg:flex">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `text-sm font-medium transition-colors hover:text-brand-gold ${
                  isActive ? "text-brand-gold" : "text-slate-600 dark:text-slate-300"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <button onClick={toggleTheme} aria-label="Toggle theme" className="rounded-full p-2 hover:bg-slate-100 dark:hover:bg-slate-800">
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>

          {user ? (
            <div className="flex items-center gap-2">
              <Link
                to={user.role === "ADMIN" ? "/admin/dashboard" : "/student/dashboard"}
                className="flex items-center gap-1 rounded-lg bg-brand-navy/10 px-3 py-2 text-sm font-semibold text-brand-navy dark:text-brand-goldLight"
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Link>
              <button onClick={handleLogout} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800">
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn-primary !px-4 !py-2 text-sm">
              Student Login
            </Link>
          )}
        </div>

        <button className="lg:hidden" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-slate-100 dark:border-slate-800 lg:hidden"
          >
            <div className="container-page flex flex-col gap-1 py-4">
              {links.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  {l.label}
                </NavLink>
              ))}
              <div className="mt-2 flex items-center justify-between px-3">
                <button onClick={toggleTheme} className="rounded-full p-2 hover:bg-slate-100 dark:hover:bg-slate-800">
                  {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </button>
                {user ? (
                  <button onClick={handleLogout} className="btn-secondary !px-4 !py-2 text-sm">Logout</button>
                ) : (
                  <Link to="/login" onClick={() => setOpen(false)} className="btn-primary !px-4 !py-2 text-sm">
                    Student Login
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
