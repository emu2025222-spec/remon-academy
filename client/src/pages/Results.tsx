
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Award,
  BarChart3,
  CheckCircle2,
  GraduationCap,
  LogIn,
  LockKeyhole,
  ShieldCheck,
  CalendarClock,
  Clock3,
  Search,
  UserRound,
  AlertCircle,
  Trophy,
  RefreshCw,
} from "lucide-react";
import { Link } from "react-router-dom";
import { api } from "../services/api";

interface Publication {
  examName: string;
  publishAt: string;
  isReleased: boolean;
}

interface PublicResult {
  _id?: string;
  examName?: string;
  subject?: string;
  obtainedMarks?: number;
  totalMarks?: number;
  grade?: string;
  gpa?: number;
  examDate?: string;
}

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Date unavailable";

  return date.toLocaleDateString("en-BD", {
    timeZone: "Asia/Dhaka",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function formatTime(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Time unavailable";

  return date.toLocaleTimeString("en-BD", {
    timeZone: "Asia/Dhaka",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

function CountdownUnit({
  value,
  label,
}: {
  value: number;
  label: string;
}) {
  return (
    <div className="border border-brand-gold/20 bg-[#101722] px-2 py-3 text-center sm:px-4">
      <p className="font-display text-2xl font-bold tabular-nums text-brand-gold sm:text-3xl">
        {String(value).padStart(2, "0")}
      </p>
      <p className="mt-1 text-[9px] font-bold uppercase tracking-widest text-slate-400">
        {label}
      </p>
    </div>
  );
}

export default function Results() {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [rollNumber, setRollNumber] = useState("");
  const [selectedExam, setSelectedExam] = useState("");
  const [results, setResults] = useState<PublicResult[]>([]);
  const [searched, setSearched] = useState(false);
  const [searching, setSearching] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [serverOffset, setServerOffset] = useState(0);
  const [currentTime, setCurrentTime] = useState(Date.now());

  const loadPublications = async () => {
    try {
      const response = await api.get(
        "/result-publications/public/status"
      );

      const data = response.data?.data;

      setPublications(data?.publications || []);

      if (data?.serverTime) {
        setServerOffset(
          new Date(data.serverTime).getTime() - Date.now()
        );
      }
    } catch (err) {
      console.error("Could not load result schedules:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPublications();

    const refresh = window.setInterval(loadPublications, 30000);

    return () => window.clearInterval(refresh);
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCurrentTime(Date.now() + serverOffset);
    }, 1000);

    return () => window.clearInterval(timer);
  }, [serverOffset]);

  const getCountdown = (publishAt: string) => {
    const difference = Math.max(
      0,
      new Date(publishAt).getTime() - currentTime
    );

    return {
      days: Math.floor(difference / 86400000),
      hours: Math.floor((difference % 86400000) / 3600000),
      minutes: Math.floor((difference % 3600000) / 60000),
      seconds: Math.floor((difference % 60000) / 1000),
      finished: difference <= 0,
    };
  };

  const handleSearch = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");
    setResults([]);
    setSearched(false);

    if (!rollNumber.trim()) {
      setError("Please enter your Roll Number.");
      return;
    }

    if (!selectedExam) {
      setError("Please select an examination.");
      return;
    }

    const publication = publications.find(
      (item) => item.examName === selectedExam
    );

    if (!publication) {
      setError("Selected examination was not found.");
      return;
    }

    if (new Date(publication.publishAt).getTime() > currentTime) {
      setError("This result has not been published yet. Please wait for the countdown.");
      return;
    }

    try {
      setSearching(true);

      const response = await api.post(
        "/result-publications/public/search",
        {
          studentId: rollNumber.trim(),
          examName: selectedExam,
        }
      );

      const data = response.data?.data;

      // Supports both an array response and an object containing results.
      const resultList = Array.isArray(data)
        ? data
        : Array.isArray(data?.results)
          ? data.results
          : data
            ? [data]
            : [];

      setResults(resultList);
      setSearched(true);

      if (resultList.length === 0) {
        setError("No result found for this Roll Number and examination.");
      }
    } catch (err: any) {
      setSearched(true);
      setError(
        err?.response?.data?.message ||
          "No result found. Please check your Roll Number and Exam Name."
      );
    } finally {
      setSearching(false);
    }
  };

  const selectedPublication = publications.find(
    (item) => item.examName === selectedExam
  );

  return (
    <main className="overflow-hidden bg-[#f5f3ee] text-[#111827] dark:bg-[#080c14] dark:text-white">

      {/* HERO */}
      <section className="relative overflow-hidden bg-[#101722] py-20 text-white sm:py-24 lg:py-28">
        <div className="pointer-events-none absolute right-[-150px] top-[-160px] h-[430px] w-[430px] rounded-full border border-brand-gold/[0.08]" />
        <div className="pointer-events-none absolute bottom-[-180px] left-[-130px] h-[380px] w-[380px] rounded-full border border-white/[0.04]" />

        <div className="container-page relative">
          <div className="grid gap-12 lg:grid-cols-[0.65fr_1.35fr] lg:items-end">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55 }}
            >
              <div className="flex items-center gap-3">
                <span className="h-px w-10 bg-brand-gold" />
                <span className="text-[9px] font-bold uppercase tracking-[0.35em] text-brand-gold">
                  Academic Performance
                </span>
              </div>

              <p className="mt-6 max-w-xs text-sm leading-7 text-slate-400">
                A secure space where students can review their academic
                performance, marks and progress.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.08 }}
            >
              <h1 className="font-display text-4xl font-bold leading-[1.02] tracking-[-0.04em] sm:text-5xl lg:text-[5rem]">
                Track your
                <br />
                <span className="text-brand-gold">progress.</span>
              </h1>

              <p className="mt-7 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base sm:leading-8">
                Enter your Roll Number and select your examination to
                access your published academic results.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SECURITY STRIP */}
      <section className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="container-page grid md:grid-cols-3">
          <div className="flex items-center gap-4 border-b border-slate-200 px-2 py-7 dark:border-slate-800 md:border-b-0 md:border-r md:px-8">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center border border-brand-gold/30">
              <LockKeyhole className="h-5 w-5 text-brand-gold" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-slate-400">
                Privacy
              </p>
              <p className="mt-1 text-sm font-semibold">
                Private student records
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 border-b border-slate-200 px-2 py-7 dark:border-slate-800 md:border-b-0 md:border-r md:px-8">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center border border-brand-gold/30">
              <BarChart3 className="h-5 w-5 text-brand-gold" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-slate-400">
                Performance
              </p>
              <p className="mt-1 text-sm font-semibold">
                Detailed academic progress
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 px-2 py-7 md:px-8">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center border border-brand-gold/30">
              <ShieldCheck className="h-5 w-5 text-brand-gold" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-slate-400">
                Secure Access
              </p>
              <p className="mt-1 text-sm font-semibold">
                Public result lookup
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PUBLIC RESULT SEARCH */}
      <section className="bg-[#f5f3ee] py-20 dark:bg-[#080c14] sm:py-24 lg:py-28">
        <div className="container-page">
          <div className="mx-auto max-w-4xl">

            <div className="mb-8 text-center">
              <div className="inline-flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.3em] text-brand-gold">
                <Search className="h-4 w-4" />
                Public Result Search
              </div>

              <h2 className="mt-4 font-display text-3xl font-bold sm:text-4xl">
                Find your results.
              </h2>

              <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-slate-500">
                Enter your student Roll Number and select an examination
                to view your published result.
              </p>
            </div>

            <div className="overflow-hidden border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="bg-[#101722] px-6 py-6 text-white sm:px-9">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center border border-brand-gold/40 bg-brand-gold/[0.08]">
                    <GraduationCap className="h-6 w-6 text-brand-gold" />
                  </div>
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-brand-gold">
                      REMON Academy
                    </p>
                    <h3 className="mt-1 font-display text-xl font-bold">
                      Result Portal
                    </h3>
                  </div>
                </div>
              </div>

              <form
                onSubmit={handleSearch}
                className="space-y-6 p-6 sm:p-9"
              >
                <div>
                  <label className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                    <UserRound className="h-4 w-4 text-brand-gold" />
                    Student Roll Number
                  </label>

                  <input
                    type="text"
                    value={rollNumber}
                    onChange={(event) =>
                      setRollNumber(event.target.value)
                    }
                    placeholder="Enter your Roll Number"
                    className="w-full border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-900 outline-none transition focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/10 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    autoComplete="off"
                  />
                </div>

                <div>
                  <label className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                    <CalendarClock className="h-4 w-4 text-brand-gold" />
                    Select Examination
                  </label>

                  <select
                    value={selectedExam}
                    onChange={(event) => {
                      setSelectedExam(event.target.value);
                      setError("");
                      setResults([]);
                      setSearched(false);
                    }}
                    className="w-full border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-900 outline-none transition focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/10 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  >
                    <option value="">Choose an examination</option>

                    {publications.map((publication) => (
                      <option
                        key={publication.examName}
                        value={publication.examName}
                      >
                        {publication.examName}
                      </option>
                    ))}
                  </select>

                  {!loading && publications.length === 0 && (
                    <p className="mt-2 text-xs text-slate-400">
                      No examination schedules are currently available.
                    </p>
                  )}
                </div>

                {selectedPublication && (
                  <div className="border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/50">
                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-brand-gold">
                      <CalendarClock className="h-4 w-4" />
                      Result Publication
                    </div>

                    <p className="mt-3 text-sm font-semibold text-slate-800 dark:text-white">
                      {selectedPublication.examName}
                    </p>

                    <div className="mt-2 flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-500 dark:text-slate-400">
                      <span className="inline-flex items-center gap-1.5">
                        <CalendarDays className="h-3.5 w-3.5" />
                        {formatDate(selectedPublication.publishAt)}
                      </span>

                      <span className="inline-flex items-center gap-1.5">
                        <Clock3 className="h-3.5 w-3.5" />
                        {formatTime(selectedPublication.publishAt)}
                      </span>
                    </div>

                    {getCountdown(selectedPublication.publishAt).finished ? (
                      <p className="mt-3 inline-flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="h-4 w-4" />
                        Publication time reached
                      </p>
                    ) : (
                      <>
                        <p className="mb-3 mt-5 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                          Result available in
                        </p>

                        <div className="grid grid-cols-4 gap-2">
                          {Object.entries(
                            getCountdown(selectedPublication.publishAt)
                          )
                            .filter(([key]) => key !== "finished")
                            .map(([key, value]) => (
                              <CountdownUnit
                                key={key}
                                value={value as number}
                                label={key}
                              />
                            ))}
                        </div>
                      </>
                    )}
                  </div>
                )}

                {error && (
                  <div className="flex items-start gap-3 border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300">
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                    <p>{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={
                    searching ||
                    loading ||
                    !selectedExam ||
                    !rollNumber.trim() ||
                    (!!selectedPublication &&
                      new Date(selectedPublication.publishAt).getTime() >
                        currentTime)
                  }
                  className="group flex w-full items-center justify-center gap-3 bg-[#101722] px-7 py-4 text-sm font-bold text-white transition-colors hover:bg-brand-gold hover:text-[#101722] disabled:cursor-not-allowed disabled:opacity-50 dark:bg-brand-gold dark:text-[#101722] dark:hover:bg-brand-goldLight"
                >
                  {searching ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      Searching Result...
                    </>
                  ) : (
                    <>
                      <Search className="h-4 w-4" />
                      Check Result
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </button>

                <p className="text-center text-[10px] leading-5 text-slate-400">
                  Results are accessible only after the official
                  publication time.
                </p>
              </form>
            </div>

            {/* RESULT OUTPUT */}
            {searched && results.length > 0 && (
              <div className="mt-10">
                <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-gold">
                      Official Result
                    </p>
                    <h3 className="mt-2 font-display text-2xl font-bold">
                      {selectedExam}
                    </h3>
                    <p className="mt-1 text-xs text-slate-500">
                      Roll Number: {rollNumber}
                    </p>
                  </div>

                  <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2 text-xs font-bold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
                    <CheckCircle2 className="h-4 w-4" />
                    Published
                  </span>
                </div>

                <div className="overflow-hidden border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-slate-100 dark:bg-slate-800">
                        <tr className="text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">
                          <th className="px-5 py-4">Subject</th>
                          <th className="px-5 py-4">Obtained</th>
                          <th className="px-5 py-4">Total</th>
                          <th className="px-5 py-4">Grade</th>
                          <th className="px-5 py-4">GPA</th>
                        </tr>
                      </thead>

                      <tbody>
                        {results.map((result, index) => (
                          <tr
                            key={result._id || `${result.subject}-${index}`}
                            className="border-t border-slate-100 dark:border-slate-800"
                          >
                            <td className="px-5 py-4 font-semibold">
                              {result.subject || "—"}
                            </td>
                            <td className="px-5 py-4">
                              {result.obtainedMarks ?? "—"}
                            </td>
                            <td className="px-5 py-4">
                              {result.totalMarks ?? "—"}
                            </td>
                            <td className="px-5 py-4">
                              {result.grade || "—"}
                            </td>
                            <td className="px-5 py-4 font-bold">
                              {result.gpa ?? "—"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-3 border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
                  <Trophy className="h-5 w-5 text-brand-gold" />
                  <p className="text-xs leading-5 text-slate-500 dark:text-slate-400">
                    This result has been retrieved from the academy's
                    published examination records.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* STUDENT LOGIN CTA */}
      <section className="bg-[#101722] py-20 text-white sm:py-24">
        <div className="container-page">
          <div className="mx-auto max-w-3xl text-center">
            <GraduationCap className="mx-auto h-10 w-10 text-brand-gold" />

            <p className="mt-5 text-[9px] font-bold uppercase tracking-[0.35em] text-brand-gold">
              Student Portal
            </p>

            <h2 className="mt-4 font-display text-3xl font-bold sm:text-4xl">
              Your results, your journey.
            </h2>

            <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-slate-400">
              Sign in to your student dashboard to access your complete
              academic performance and detailed progress.
            </p>

            <Link
              to="/login"
              className="group mt-8 inline-flex items-center gap-3 bg-brand-gold px-7 py-3.5 text-sm font-bold text-[#101722] transition hover:bg-brand-goldLight"
            >
              <LogIn className="h-4 w-4" />
              Student Login
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
