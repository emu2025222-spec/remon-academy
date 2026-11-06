import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  ArrowUpRight,
  Award,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Clock3,
  GraduationCap,
  MapPin,
  Phone,
  Save,
  ShieldCheck,
  Sparkles,
  User,
  Wallet,
} from "lucide-react";

import { api, getErrorMessage } from "../../services/api";
import { Input } from "../../components/Input";
import { Button } from "../../components/Button";
import { Loader } from "../../components/Loader";
import { useToast } from "../../components/Toast";
import { Student, Course } from "../../types";

interface FormData {
  phone: string;
  address: string;
}

export default function Profile() {
  const [profile, setProfile] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const { register, handleSubmit, reset } =
    useForm<FormData>();

  const { show } = useToast();

  useEffect(() => {
    let mounted = true;

    api
      .get("/students/me")
      .then((r) => {
        if (!mounted) return;

        const student = r.data.data as Student;

        setProfile(student);

        reset({
          phone: student.phone || "",
          address: student.address || "",
        });

        setLoading(false);
      })
      .catch((err) => {
        if (!mounted) return;

        show(getErrorMessage(err), "error");
        setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [reset, show]);

  async function onSubmit(data: FormData) {
    setSaving(true);

    try {
      const res = await api.put("/students/me", data);

      setProfile(res.data.data);

      show("Profile updated successfully", "success");
    } catch (err) {
      show(getErrorMessage(err), "error");
    } finally {
      setSaving(false);
    }
  }

  if (loading || !profile) {
    return <Loader />;
  }

  /*
   * Multiple-course support.
   * New students: profile.courses
   * Old students: profile.course
   */
  const assignedCourses: Course[] = [];

  if (Array.isArray(profile.courses)) {
    profile.courses.forEach((course) => {
      if (typeof course === "object" && course !== null) {
        assignedCourses.push(course as Course);
      }
    });
  }

  if (
    assignedCourses.length === 0 &&
    profile.course &&
    typeof profile.course === "object"
  ) {
    assignedCourses.push(profile.course as Course);
  }

  const initials = profile.fullName
    ?.trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase() || "ST";

  const formattedDate = profile.dateOfBirth
    ? new Date(profile.dateOfBirth).toLocaleDateString("en-BD", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : "Not provided";

  return (
    <div className="mx-auto max-w-7xl space-y-8 pb-12">

      {/* ================= PROFILE HERO ================= */}

      <section className="relative isolate overflow-hidden rounded-[28px] bg-gradient-to-br from-[#07172f] via-[#102d53] to-[#194879] px-6 py-8 text-white shadow-xl shadow-blue-950/10 sm:px-9 sm:py-10">

        <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full border border-white/10" />
        <div className="pointer-events-none absolute -right-5 -top-10 h-52 w-52 rounded-full border border-white/10" />
        <div className="pointer-events-none absolute -bottom-32 left-1/3 h-64 w-64 rounded-full border border-white/10" />

        <div className="relative z-10">

          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-amber-300/20 bg-amber-300/10 px-3.5 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-amber-200">
            <Sparkles className="h-3.5 w-3.5" />
            REMON Academy · Student Profile
          </div>

          <div className="flex flex-col gap-7 sm:flex-row sm:items-center sm:justify-between">

            <div className="flex items-center gap-5">

              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-[24px] border border-white/15 bg-white/10 font-display text-2xl font-bold text-amber-300 shadow-lg backdrop-blur-sm sm:h-24 sm:w-24 sm:text-3xl">
                {initials}
              </div>

              <div className="min-w-0">

                <p className="text-xs font-medium text-blue-100/60">
                  Welcome to your profile
                </p>

                <h1 className="mt-1 break-words font-display text-2xl font-bold tracking-tight sm:text-4xl">
                  {profile.fullName}
                  <span className="text-amber-300">.</span>
                </h1>

                <div className="mt-3 flex flex-wrap items-center gap-2">

                  <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-[10px] font-bold text-white/80">
                    <ShieldCheck className="h-3.5 w-3.5 text-amber-300" />
                    Student Account
                  </span>

                  <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-[10px] font-bold text-white/80">
                    ID: {profile.studentId}
                  </span>

                </div>
              </div>
            </div>

            <div className="hidden h-28 w-28 items-center justify-center rounded-[28px] border border-white/10 bg-white/5 text-white/20 lg:flex">
              <GraduationCap className="h-16 w-16" />
            </div>

          </div>

          <div className="mt-8 border-t border-white/10 pt-5">
            <p className="max-w-2xl text-xs leading-6 text-blue-100/65 sm:text-sm">
              Manage your personal contact information and
              explore your academic enrollment details.
              Keep your information updated to stay connected
              with REMON Academy.
            </p>
          </div>

        </div>
      </section>

      {/* ================= QUICK OVERVIEW ================= */}

      <section>

        <div className="mb-5">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-gold">
            Your Information
          </p>

          <h2 className="mt-1 font-display text-xl font-bold text-slate-900 dark:text-white">
            Profile Overview
          </h2>

          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            A quick look at your student account.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

          {[
            {
              label: "Student ID",
              value: profile.studentId || "N/A",
              icon: ShieldCheck,
              color: "blue",
            },
            {
              label: "Class",
              value: profile.class || "N/A",
              icon: GraduationCap,
              color: "amber",
            },
            {
              label: "Group",
              value: profile.group || "Not assigned",
              icon: BookOpen,
              color: "emerald",
            },
            {
              label: "Courses",
              value: `${assignedCourses.length} Assigned`,
              icon: Award,
              color: "violet",
            },
          ].map((item) => {
            const Icon = item.icon;

            const colorClasses: Record<string, string> = {
              blue: "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400",
              amber: "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400",
              emerald: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
              violet: "bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400",
            };

            return (
              <div
                key={item.label}
                className="group rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-slate-900/5 dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="flex items-center justify-between gap-3">

                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">
                      {item.label}
                    </p>

                    <p className="mt-3 break-words font-display text-lg font-bold text-slate-900 dark:text-white">
                      {item.value}
                    </p>
                  </div>

                  <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl transition group-hover:scale-110 ${colorClasses[item.color]}`}>
                    <Icon className="h-5 w-5" />
                  </div>

                </div>
              </div>
            );
          })}

        </div>
      </section>

      {/* ================= PERSONAL INFORMATION ================= */}

      <section>

        <div className="mb-5">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-gold">
            Personal Information
          </p>

          <h2 className="mt-1 font-display text-xl font-bold text-slate-900 dark:text-white">
            Student Details
          </h2>

          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Your official academic information.
          </p>
        </div>

        <div className="overflow-hidden rounded-[24px] border border-slate-200/80 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">

          <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-5 dark:border-slate-800 sm:px-7">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
              <User className="h-5 w-5" />
            </div>

            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Basic Information
              </h3>

              <p className="mt-0.5 text-[11px] text-slate-400">
                Details registered with the academy
              </p>
            </div>

          </div>

          <div className="grid gap-px bg-slate-100 sm:grid-cols-2 dark:bg-slate-800">

            {[
              {
                label: "Full Name",
                value: profile.fullName,
                icon: User,
              },
              {
                label: "Student ID",
                value: profile.studentId,
                icon: ShieldCheck,
              },
              {
                label: "Class",
                value: profile.class,
                icon: GraduationCap,
              },
              {
                label: "Group",
                value: profile.group || "Not assigned",
                icon: BookOpen,
              },
              {
                label: "Gender",
                value: profile.gender
                  ? profile.gender.charAt(0).toUpperCase() +
                    profile.gender.slice(1)
                  : "Not provided",
                icon: User,
              },
              {
                label: "Date of Birth",
                value: formattedDate,
                icon: CalendarDays,
              },
            ].map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.label}
                  className="flex items-center gap-4 bg-white p-5 transition hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800/60 sm:p-6"
                >

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                    <Icon className="h-4 w-4" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
                      {item.label}
                    </p>

                    <p className="mt-1 break-words text-sm font-semibold text-slate-800 dark:text-slate-200">
                      {item.value || "Not provided"}
                    </p>
                  </div>

                </div>
              );
            })}

          </div>

          <div className="flex items-start gap-3 border-t border-slate-100 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-950/30">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-brand-gold" />

            <p className="text-xs leading-5 text-slate-500 dark:text-slate-400">
              Official information such as your name, class,
              group and date of birth is managed by the academy
              administration.
            </p>
          </div>

        </div>
      </section>

      {/* ================= ASSIGNED COURSES ================= */}

      <section>

        <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">

          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-gold">
              Academic Enrollment
            </p>

            <h2 className="mt-1 font-display text-xl font-bold text-slate-900 dark:text-white">
              My Courses
            </h2>

            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Courses assigned to you by the academy.
            </p>
          </div>

          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
            <BookOpen className="h-3.5 w-3.5 text-brand-gold" />
            {assignedCourses.length}{" "}
            {assignedCourses.length === 1 ? "Course" : "Courses"}
          </div>

        </div>

        {assignedCourses.length === 0 ? (

          <div className="rounded-[24px] border border-dashed border-slate-300 bg-slate-50/70 px-5 py-12 text-center dark:border-slate-700 dark:bg-slate-900/30">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300">
              <GraduationCap className="h-7 w-7" />
            </div>

            <h3 className="mt-5 font-display text-lg font-bold text-slate-800 dark:text-slate-200">
              No course assigned yet
            </h3>

            <p className="mx-auto mt-2 max-w-md text-xs leading-6 text-slate-500 dark:text-slate-400">
              No course has been assigned to your account.
              Please contact the academy office for enrollment
              assistance.
            </p>

          </div>

        ) : (

          <div className="grid gap-4 md:grid-cols-2">

            {assignedCourses.map((course, index) => (

              <article
                key={course._id || `course-${index}`}
                className="group relative overflow-hidden rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-amber-300 hover:shadow-xl hover:shadow-slate-900/5 dark:border-slate-800 dark:bg-slate-900"
              >

                <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-amber-300 to-amber-600" />

                <div className="pl-2">

                  <div className="flex items-start justify-between gap-3">

                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-700 transition group-hover:scale-105 dark:bg-amber-500/10 dark:text-amber-300">
                      <GraduationCap className="h-6 w-6" />
                    </div>

                    <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wide text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-500/10 dark:text-emerald-400">
                      <CheckCircle2 className="h-3 w-3" />
                      Assigned
                    </span>

                  </div>

                  <div className="mt-5">

                    <div className="flex flex-wrap gap-2">

                      {course.classLevel && (
                        <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-blue-700 dark:bg-blue-500/10 dark:text-blue-300">
                          {course.classLevel}
                        </span>
                      )}

                      {course.subject && (
                        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                          {course.subject}
                        </span>
                      )}

                    </div>

                    <h3 className="mt-4 break-words font-display text-xl font-bold text-slate-900 dark:text-white">
                      {course.title}
                    </h3>

                  </div>

                  <div className="mt-6 space-y-4 border-t border-slate-100 pt-5 dark:border-slate-800">

                    {course.duration && (
                      <div className="flex items-center justify-between gap-3">
                        <span className="flex items-center gap-2 text-xs text-slate-400">
                          <Clock3 className="h-3.5 w-3.5" />
                          Duration
                        </span>

                        <span className="text-right text-xs font-bold text-slate-700 dark:text-slate-300">
                          {course.duration}
                        </span>
                      </div>
                    )}

                    {course.fee !== undefined && (
                      <div className="flex items-center justify-between gap-3">
                        <span className="flex items-center gap-2 text-xs text-slate-400">
                          <Wallet className="h-3.5 w-3.5" />
                          Course Fee
                        </span>

                        <span className="text-right text-sm font-bold text-slate-800 dark:text-slate-200">
                          ৳{course.fee}
                        </span>
                      </div>
                    )}

                    {course.schedule && (
                      <div className="flex items-start justify-between gap-3">
                        <span className="flex shrink-0 items-center gap-2 text-xs text-slate-400">
                          <CalendarDays className="h-3.5 w-3.5" />
                          Schedule
                        </span>

                        <span className="max-w-[65%] text-right text-xs font-bold text-slate-700 dark:text-slate-300">
                          {course.schedule}
                        </span>
                      </div>
                    )}

                  </div>

                </div>

              </article>

            ))}

          </div>

        )}

        <div className="mt-5 flex items-start gap-3 rounded-2xl border border-blue-100 bg-blue-50/70 p-4 dark:border-blue-900/30 dark:bg-blue-500/5">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-blue-600 dark:text-blue-400" />

          <p className="text-xs leading-5 text-slate-600 dark:text-slate-400">
            Course enrollment can only be changed by the academy
            administration.
          </p>
        </div>

      </section>

      {/* ================= EDIT CONTACT INFORMATION ================= */}

      <section>

        <div className="mb-5">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-gold">
            Account Settings
          </p>

          <h2 className="mt-1 font-display text-xl font-bold text-slate-900 dark:text-white">
            Contact Information
          </h2>

          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Update your phone number and current address.
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="overflow-hidden rounded-[24px] border border-slate-200/80 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900"
        >

          <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-5 dark:border-slate-800 sm:px-7">

            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
              <Save className="h-5 w-5" />
            </div>

            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Edit your details
              </h3>

              <p className="mt-1 text-[11px] text-slate-400">
                Changes will be saved to your student profile.
              </p>
            </div>

          </div>

          <div className="space-y-6 p-5 sm:p-7">

            <div className="grid gap-5 md:grid-cols-2">

              <div>
                <Input
                  label="Phone Number"
                  {...register("phone")}
                />

                <p className="mt-2 flex items-center gap-1.5 text-[10px] text-slate-400">
                  <Phone className="h-3 w-3" />
                  Your active contact number
                </p>
              </div>

              <div>
                <Input
                  label="Address"
                  {...register("address")}
                />

                <p className="mt-2 flex items-center gap-1.5 text-[10px] text-slate-400">
                  <MapPin className="h-3 w-3" />
                  Your current residential address
                </p>
              </div>

            </div>

            <div className="flex flex-col gap-4 border-t border-slate-100 pt-5 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">

              <div className="flex items-start gap-2">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-brand-gold" />

                <p className="max-w-md text-[11px] leading-5 text-slate-400">
                  Your other academic information is managed
                  by the academy administration.
                </p>
              </div>

              <Button
                type="submit"
                loading={saving}
              >
                <span className="inline-flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  Save Changes
                </span>
              </Button>

            </div>

          </div>

        </form>
      </section>

      {/* ================= SECURITY FOOTER ================= */}

      <section className="relative isolate overflow-hidden rounded-[24px] bg-gradient-to-r from-[#07172f] to-[#173d69] px-6 py-6 text-white sm:px-8">

        <div className="pointer-events-none absolute -right-10 -top-16 h-40 w-40 rounded-full border border-white/10" />

        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

          <div className="flex items-start gap-4">

            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-amber-300">
              <ShieldCheck className="h-6 w-6" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <Sparkles className="h-3.5 w-3.5 text-amber-300" />

                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-amber-200">
                  Account Security
                </p>
              </div>

              <h3 className="mt-1 text-sm font-bold">
                Your information matters.
              </h3>

              <p className="mt-1 max-w-lg text-xs leading-5 text-white/55">
                Your academic records are managed securely
                by REMON Academy.
              </p>
            </div>

          </div>

          <div className="inline-flex shrink-0 items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-4 py-2.5 text-[10px] font-bold text-emerald-200">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Student Portal
          </div>

        </div>

      </section>

      {/* ================= FOOTER ================= */}

      <div className="flex flex-col items-center justify-between gap-2 border-t border-slate-200/70 pt-5 text-center dark:border-slate-800 sm:flex-row sm:text-left">

        <p className="text-[10px] font-bold tracking-[0.16em] text-slate-400">
          REMON ACADEMY
        </p>

        <p className="text-[10px] text-slate-400">
          Learn. Grow. Achieve.
        </p>

      </div>

    </div>
  );
}