import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  GraduationCap,
  MapPin,
  Phone,
  Save,
  ShieldCheck,
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
    api
      .get("/students/me")
      .then((r) => {
        const student = r.data.data as Student;

        setProfile(student);

        reset({
          phone: student.phone,
          address: student.address,
        });

        setLoading(false);
      })
      .catch((err) => {
        show(getErrorMessage(err), "error");
        setLoading(false);
      });
  }, [reset, show]);

  async function onSubmit(data: FormData) {
    setSaving(true);

    try {
      const res = await api.put("/students/me", data);

      setProfile(res.data.data);

      show(
        "Profile updated successfully",
        "success"
      );
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
   *
   * New students:
   *   profile.courses
   *
   * Old students:
   *   profile.course
   *
   * Both structures are supported so existing
   * student data continues to work.
   */
  const assignedCourses: Course[] = [];

  if (Array.isArray(profile.courses)) {
    profile.courses.forEach((course) => {
      if (
        typeof course === "object" &&
        course !== null
      ) {
        assignedCourses.push(course as Course);
      }
    });
  }

  if (
    assignedCourses.length === 0 &&
    profile.course &&
    typeof profile.course === "object"
  ) {
    assignedCourses.push(
      profile.course as Course
    );
  }

  return (
    <div className="space-y-8 pb-10">
      {/* =====================================================
          PROFILE HEADER
      ===================================================== */}
      <section className="relative overflow-hidden rounded-3xl bg-brand-navyDark px-6 py-8 text-white sm:px-8 sm:py-10">
        <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full border border-brand-goldLight/10" />

        <div className="absolute -bottom-24 right-24 h-64 w-64 rounded-full border border-brand-goldLight/10" />

        <div className="relative z-10">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-brand-goldLight">
            <User className="h-3.5 w-3.5" />
            Student Profile
          </div>

          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
                My Profile
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-white/65">
                Manage your contact information and view
                your academic profile.
              </p>
            </div>

            <div className="flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-white/75">
              <ShieldCheck className="h-4 w-4 text-brand-goldLight" />

              ID: {profile.studentId}
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          BASIC STUDENT INFORMATION
      ===================================================== */}
      <section>
        <div className="mb-5">
          <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-brand-gold">
            <User className="h-4 w-4" />
            Personal Information
          </div>

          <h2 className="mt-2 font-display text-xl font-semibold text-slate-900 dark:text-white">
            Student details
          </h2>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Your official academic information is managed by
            the academy.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-px overflow-hidden rounded-3xl border border-slate-200 bg-slate-200 dark:border-slate-800 dark:bg-slate-800 sm:grid-cols-2">
          {/* Student ID */}
          <div className="bg-white p-6 dark:bg-slate-900/60">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
              Student ID
            </p>

            <p className="mt-2 font-display text-lg font-semibold text-slate-900 dark:text-white">
              {profile.studentId}
            </p>
          </div>

          {/* Full Name */}
          <div className="bg-white p-6 dark:bg-slate-900/60">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
              Full Name
            </p>

            <p className="mt-2 font-display text-lg font-semibold text-slate-900 dark:text-white">
              {profile.fullName}
            </p>
          </div>

          {/* Class */}
          <div className="bg-white p-6 dark:bg-slate-900/60">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
              Class
            </p>

            <p className="mt-2 font-display text-lg font-semibold text-slate-900 dark:text-white">
              {profile.class}
            </p>
          </div>

          {/* Group */}
          <div className="bg-white p-6 dark:bg-slate-900/60">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
              Group
            </p>

            <p className="mt-2 font-display text-lg font-semibold text-slate-900 dark:text-white">
              {profile.group || "—"}
            </p>
          </div>

          {/* Gender */}
          <div className="bg-white p-6 dark:bg-slate-900/60">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
              Gender
            </p>

            <p className="mt-2 font-display text-lg font-semibold capitalize text-slate-900 dark:text-white">
              {profile.gender}
            </p>
          </div>

          {/* DOB */}
          <div className="bg-white p-6 dark:bg-slate-900/60">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
              Date of Birth
            </p>

            <div className="mt-2 flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-brand-gold" />

              <p className="font-display text-lg font-semibold text-slate-900 dark:text-white">
                {new Date(
                  profile.dateOfBirth
                ).toLocaleDateString("en-BD", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          ASSIGNED COURSES
      ===================================================== */}
      <section>
        <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-brand-gold">
              <GraduationCap className="h-4 w-4" />
              Academic Enrollment
            </div>

            <h2 className="mt-2 font-display text-xl font-semibold text-slate-900 dark:text-white">
              My Courses
            </h2>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Courses assigned to you by the academy.
            </p>
          </div>

          <div className="flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
            <BookOpenIcon />

            {assignedCourses.length}{" "}
            {assignedCourses.length === 1
              ? "Course"
              : "Courses"}
          </div>
        </div>

        {assignedCourses.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50/70 p-8 text-center dark:border-slate-700 dark:bg-slate-900/30">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-goldLight/15 text-brand-gold">
              <GraduationCap className="h-6 w-6" />
            </div>

            <h3 className="mt-4 font-display text-lg font-semibold text-slate-800 dark:text-slate-200">
              No course assigned yet
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-400">
              No course has been assigned to your account.
              Please contact the academy office for
              enrollment assistance.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {assignedCourses.map((course, index) => (
              <div
                key={
                  course._id ||
                  `course-${index}`
                }
                className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-brand-goldLight/60 hover:shadow-md dark:border-slate-800 dark:bg-slate-900/40"
              >
                <div className="absolute left-0 top-0 h-full w-1 bg-brand-goldLight" />

                <div className="pl-2">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-goldLight/15 text-brand-gold">
                      <GraduationCap className="h-5 w-5" />
                    </div>

                    <span className="inline-flex items-center gap-1 rounded-full border border-emerald-100 bg-emerald-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-500/10 dark:text-emerald-400">
                      <CheckCircle2 className="h-3 w-3" />
                      Assigned
                    </span>
                  </div>

                  <div className="mt-5">
                    <div className="flex flex-wrap gap-2">
                      {course.classLevel && (
                        <span className="rounded-full bg-brand-navy/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-brand-navy dark:bg-brand-goldLight/10 dark:text-brand-goldLight">
                          {course.classLevel}
                        </span>
                      )}

                      {course.subject && (
                        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                          {course.subject}
                        </span>
                      )}
                    </div>

                    <h3 className="mt-4 font-display text-xl font-semibold leading-tight text-slate-900 dark:text-white">
                      {course.title}
                    </h3>
                  </div>

                  <div className="mt-6 space-y-3 border-t border-slate-100 pt-5 dark:border-slate-800">
                    {course.duration && (
                      <div className="flex items-center justify-between gap-4">
                        <span className="flex items-center gap-2 text-xs text-slate-400">
                          <Clock3 className="h-3.5 w-3.5" />
                          Duration
                        </span>

                        <span className="max-w-[60%] text-right text-sm font-semibold text-slate-700 dark:text-slate-300">
                          {course.duration}
                        </span>
                      </div>
                    )}

                    {course.fee !== undefined && (
                      <div className="flex items-center justify-between gap-4">
                        <span className="flex items-center gap-2 text-xs text-slate-400">
                          <Wallet className="h-3.5 w-3.5" />
                          Course Fee
                        </span>

                        <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                          ৳{course.fee}
                        </span>
                      </div>
                    )}

                    {course.schedule && (
                      <div className="flex items-start justify-between gap-4">
                        <span className="flex items-center gap-2 text-xs text-slate-400">
                          <CalendarDays className="h-3.5 w-3.5" />
                          Schedule
                        </span>

                        <span className="max-w-[60%] text-right text-sm font-semibold text-slate-700 dark:text-slate-300">
                          {course.schedule}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-5 flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-900/30">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-brand-gold" />

          <p className="text-xs leading-5 text-slate-500 dark:text-slate-400">
            Course enrollment can only be changed by the
            academy administration.
          </p>
        </div>
      </section>

      {/* =====================================================
          EDITABLE CONTACT INFORMATION
      ===================================================== */}
      <section>
        <div className="mb-5">
          <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-brand-gold">
            <Phone className="h-4 w-4" />
            Contact Details
          </div>

          <h2 className="mt-2 font-display text-xl font-semibold text-slate-900 dark:text-white">
            Update your information
          </h2>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Phone number and address can be edited from here.
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900/40"
        >
          <div className="border-b border-slate-100 px-6 py-5 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-goldLight/15 text-brand-gold">
                <Save className="h-4.5 w-4.5" />
              </div>

              <div>
                <h3 className="font-display text-base font-semibold text-slate-900 dark:text-white">
                  Contact Information
                </h3>

                <p className="mt-0.5 text-xs text-slate-400">
                  Keep your contact information up to date.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-5 p-6">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <Input
                  label="Phone"
                  {...register("phone")}
                />

                <p className="mt-2 flex items-center gap-1.5 text-[11px] text-slate-400">
                  <Phone className="h-3 w-3" />
                  Your active contact number
                </p>
              </div>

              <div>
                <Input
                  label="Address"
                  {...register("address")}
                />

                <p className="mt-2 flex items-center gap-1.5 text-[11px] text-slate-400">
                  <MapPin className="h-3 w-3" />
                  Your current address
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-4 border-t border-slate-100 pt-5 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
              <p className="max-w-md text-xs leading-5 text-slate-400">
                Other profile information such as your name,
                class, group and date of birth can only be
                updated by the academy office.
              </p>

              <Button
                type="submit"
                loading={saving}
              >
                Save Changes
              </Button>
            </div>
          </div>
        </form>
      </section>

      {/* =====================================================
          SECURITY / SUPPORT STRIP
      ===================================================== */}
      <section className="rounded-3xl bg-brand-navyDark px-6 py-6 text-white sm:px-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-brand-goldLight">
              <ShieldCheck className="h-5 w-5" />
            </div>

            <div>
              <p className="text-sm font-semibold">
                Profile security
              </p>

              <p className="mt-1 max-w-xl text-xs leading-5 text-white/55">
                Your academic information is securely managed
                by the academy administration.
              </p>
            </div>
          </div>

          <div className="inline-flex items-center gap-2 text-xs font-semibold text-white/65">
            <CheckCircle2 className="h-4 w-4 text-brand-goldLight" />
            Account verified
          </div>
        </div>
      </section>
    </div>
  );
}

/*
 * Small local icon component keeps the course-count
 * header clean without adding another dependency.
 */
function BookOpenIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="h-3.5 w-3.5"
    >
      <path d="M2 4.5A2.5 2.5 0 0 1 4.5 2H11v18H4.5A2.5 2.5 0 0 0 2 22V4.5Z" />
      <path d="M22 4.5A2.5 2.5 0 0 0 19.5 2H13v18h6.5A2.5 2.5 0 0 1 22 22V4.5Z" />
    </svg>
  );
}


