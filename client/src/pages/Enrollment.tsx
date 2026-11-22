
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  GraduationCap,
  ShieldCheck,
  Smartphone,
  Wallet,
} from "lucide-react";

import { api, getErrorMessage } from "../services/api";
import { Course } from "../types";
import { brand } from "../config/brand";

type FormData = {
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: "MALE" | "FEMALE" | "OTHER";
  address: string;
  class: string;
  group: string;
  courseId: string;
  paymentPlan: "MONTHLY";
  paymentMethod: "ONLINE" | "OFFLINE";
  senderNumber: string;
  transactionId: string;
};

const initialForm: FormData = {
  fullName: "",
  email: "",
  phone: "",
  dateOfBirth: "",
  gender: "MALE",
  address: "",
  class: "",
  group: "",
  courseId: "",
  paymentPlan: "MONTHLY",
  paymentMethod: "ONLINE",
  senderNumber: "",
  transactionId: "",
};

export default function Enrollment() {
  const [searchParams] = useSearchParams();

  const [courses, setCourses] = useState<Course[]>([]);
  const [form, setForm] = useState<FormData>({
    ...initialForm,
    courseId: searchParams.get("course") || "",
  });

  const [loading, setLoading] = useState(false);
  const [courseLoading, setCourseLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submittedData, setSubmittedData] = useState<any>(null);

  useEffect(() => {
    api
      .get("/courses/public")
      .then((res) => {
        const list = res.data.data;
        setCourses(Array.isArray(list) ? list : []);

        const requestedCourse = searchParams.get("course");
        if (requestedCourse) {
          setForm((prev) => ({ ...prev, courseId: requestedCourse }));
        }
      })
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setCourseLoading(false));
  }, [searchParams]);

  const selectedCourse = courses.find(
    (course) => course._id === form.courseId
  );

  function update<K extends keyof FormData>(
    key: K,
    value: FormData[K]
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    if (!selectedCourse) {
      setError("Please select a course.");
      return;
    }

    if (!form.transactionId.trim()) {
      setError("Please enter your bKash Transaction ID.");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/enrollments", form);

      setSubmittedData(response.data.data);
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "input-field w-full";

  if (submitted) {
    return (
      <main className="min-h-screen bg-brand-ivory px-4 py-16">
        <div className="mx-auto max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="border border-slate-200 bg-white p-8 text-center shadow-xl sm:p-12"
          >
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-50">
              <CheckCircle2 className="h-9 w-9 text-green-600" />
            </div>

            <p className="mt-6 text-xs font-bold uppercase tracking-[0.3em] text-brand-gold">
              Application Submitted
            </p>

            <h1 className="mt-3 font-display text-3xl font-bold text-brand-navyDark">
              Thank you, {form.fullName}!
            </h1>

            <p className="mt-4 text-sm leading-7 text-slate-500">
              Your enrollment request has been received. Our team will verify
              your payment and review your application.
            </p>

            <div className="mt-8 space-y-3 border border-slate-200 bg-slate-50 p-5 text-left">
              <div className="flex justify-between gap-4 text-sm">
                <span className="text-slate-500">Course</span>
                <strong>{submittedData?.course || selectedCourse?.title}</strong>
              </div>

              <div className="flex justify-between gap-4 text-sm">
                <span className="text-slate-500">Amount</span>
                <strong>৳{submittedData?.amount}</strong>
              </div>

              <div className="flex justify-between gap-4 text-sm">
                <span className="text-slate-500">Transaction ID</span>
                <strong className="break-all">{form.transactionId}</strong>
              </div>

              <div className="flex justify-between gap-4 text-sm">
                <span className="text-slate-500">Application status</span>
                <strong className="text-amber-600">Pending verification</strong>
              </div>
            </div>

            <p className="mt-6 text-xs leading-6 text-slate-400">
              Please keep your transaction information safe. Your student
              account will be created after approval.
            </p>

            <Link to="/" className="btn-primary mt-8 inline-flex items-center gap-2 no-underline">
              Back to Home <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-brand-ivory">
      <section className="bg-brand-navyDark px-4 py-14 text-white sm:py-20">
        <div className="container-page">
          <Link
            to="/courses"
            className="mb-8 inline-flex items-center gap-2 text-sm text-white/60 no-underline hover:text-brand-goldLight"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Courses
          </Link>

          <p className="text-xs font-bold uppercase tracking-[0.3em] text-brand-goldLight">
            REMON ACADEMY
          </p>

          <h1 className="mt-4 font-display text-4xl font-bold sm:text-5xl">
            Course Enrollment
          </h1>

          <p className="mt-5 max-w-2xl text-sm leading-7 text-white/60">
            Complete your application and submit your bKash payment information
            to join our learning community.
          </p>
        </div>
      </section>

      <section className="container-page py-12 sm:py-16">
        <form onSubmit={handleSubmit} className="mx-auto max-w-4xl space-y-8">
          {error && (
            <div className="border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-7 flex items-center gap-3">
              <GraduationCap className="h-6 w-6 text-brand-gold" />
              <div>
                <h2 className="font-display text-xl font-bold text-brand-navyDark">
                  Personal Information
                </h2>
                <p className="mt-1 text-xs text-slate-400">
                  Enter your correct personal details.
                </p>
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="label-field">Full Name *</label>
                <input required className={inputClass} value={form.fullName}
                  onChange={(e) => update("fullName", e.target.value)} />
              </div>

              <div>
                <label className="label-field">Email Address *</label>
                <input required type="email" className={inputClass} value={form.email}
                  onChange={(e) => update("email", e.target.value)} />
              </div>

              <div>
                <label className="label-field">Phone Number *</label>
                <input required type="tel" className={inputClass} value={form.phone}
                  onChange={(e) => update("phone", e.target.value)} />
              </div>

              <div>
                <label className="label-field">Date of Birth *</label>
                <input required type="date" className={inputClass} value={form.dateOfBirth}
                  onChange={(e) => update("dateOfBirth", e.target.value)} />
              </div>

              <div>
                <label className="label-field">Gender *</label>
                <select required className={inputClass} value={form.gender}
                  onChange={(e) => update("gender", e.target.value as FormData["gender"])}>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>

              <div>
                <label className="label-field">Class / Academic Level *</label>
                <input required className={inputClass} placeholder="e.g. HSC 1st Year"
                  value={form.class} onChange={(e) => update("class", e.target.value)} />
              </div>

              <div>
                <label className="label-field">Group</label>
                <input className={inputClass} placeholder="Science / Commerce / Arts"
                  value={form.group} onChange={(e) => update("group", e.target.value)} />
              </div>

              <div>
                <label className="label-field">Address *</label>
                <input required className={inputClass} value={form.address}
                  onChange={(e) => update("address", e.target.value)} />
              </div>
            </div>
          </div>

          <div className="border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="font-display text-xl font-bold text-brand-navyDark">
              Select Your Course
            </h2>

            <div className="mt-5">
              <label className="label-field">Available Courses *</label>
              <select required className={inputClass} value={form.courseId}
                disabled={courseLoading}
                onChange={(e) => update("courseId", e.target.value)}>
                <option value="">
                  {courseLoading ? "Loading courses..." : "Select a course"}
                </option>
                {courses.map((course) => (
                  <option key={course._id} value={course._id}>
                    {course.title} — ৳{course.fee}
                  </option>
                ))}
              </select>
            </div>

            {selectedCourse && (
              <div className="mt-5 border border-brand-gold/30 bg-brand-gold/5 p-5">
                <p className="text-xs font-bold uppercase tracking-wider text-brand-gold">
                  Selected Course
                </p>
                <h3 className="mt-2 font-display text-lg font-bold text-brand-navyDark">
                  {selectedCourse.title}
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  {selectedCourse.classLevel} · {selectedCourse.subject}
                </p>
                <p className="mt-3 text-2xl font-bold text-brand-navyDark">
                  ৳{selectedCourse.fee}
                </p>
                <p className="text-xs text-slate-400">
                  Monthly payment amount
                </p>
              </div>
            )}
          </div>

          <div className="border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-6 flex items-center gap-3">
              <Wallet className="h-6 w-6 text-brand-gold" />
              <div>
                <h2 className="font-display text-xl font-bold text-brand-navyDark">
                  Payment Information
                </h2>
                <p className="mt-1 text-xs text-slate-400">
                  Submit your bKash payment details.
                </p>
              </div>
            </div>

            <div className="border border-pink-200 bg-pink-50 p-5">
              <p className="text-xs font-bold uppercase tracking-wider text-pink-700">
                Send Money To
              </p>
              <p className="mt-2 text-2xl font-bold tracking-wider text-slate-900">
                01408666304
              </p>
              <p className="mt-1 text-xs text-slate-500">
                bKash Personal Number
              </p>
            </div>

            <div className="mt-6">
              <p className="mb-3 text-sm font-bold text-brand-navyDark">
                Payment Method
              </p>

              <div className="grid gap-3 sm:grid-cols-2">
                <button type="button"
                  onClick={() => update("paymentMethod", "ONLINE")}
                  className={`border p-4 text-left transition ${
                    form.paymentMethod === "ONLINE"
                      ? "border-brand-gold bg-brand-gold/10"
                      : "border-slate-200"
                  }`}>
                  <Smartphone className="mb-2 h-5 w-5 text-brand-gold" />
                  <strong className="block text-sm text-brand-navyDark">Online</strong>
                  <span className="mt-1 block text-xs text-slate-500">
                    bKash Send Money
                  </span>
                </button>

                <button type="button"
                  onClick={() => update("paymentMethod", "OFFLINE")}
                  className={`border p-4 text-left transition ${
                    form.paymentMethod === "OFFLINE"
                      ? "border-brand-gold bg-brand-gold/10"
                      : "border-slate-200"
                  }`}>
                  <Wallet className="mb-2 h-5 w-5 text-brand-gold" />
                  <strong className="block text-sm text-brand-navyDark">Offline</strong>
                  <span className="mt-1 block text-xs text-slate-500">
                    Payment through academy office
                  </span>
                </button>
              </div>
            </div>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <div>
                <label className="label-field">Sender bKash Number *</label>
                <input required type="tel" className={inputClass}
                  placeholder="01XXXXXXXXX"
                  value={form.senderNumber}
                  onChange={(e) => update("senderNumber", e.target.value)} />
              </div>

              <div>
                <label className="label-field">Transaction ID *</label>
                <input required className={inputClass}
                  placeholder="Enter full Transaction ID"
                  value={form.transactionId}
                  onChange={(e) => update("transactionId", e.target.value)} />
              </div>
            </div>

            <p className="mt-4 text-xs leading-6 text-slate-400">
              Your payment will be manually verified by the REMON Academy
              administration. Submitting this form does not mean your
              enrollment is approved.
            </p>
          </div>

          <div className="border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex items-start gap-3">
              <ShieldCheck className="h-6 w-6 shrink-0 text-brand-gold" />
              <div>
                <h3 className="font-bold text-brand-navyDark">
                  Review Before Submission
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Please check your personal details and transaction ID.
                  After submission, your application will remain pending
                  until an administrator verifies your payment.
                </p>
              </div>
            </div>

            <button type="submit" disabled={loading || courseLoading || !courses.length}
              className="btn-primary mt-7 flex w-full items-center justify-center gap-3 disabled:cursor-not-allowed disabled:opacity-60">
              {loading ? "Submitting Application..." : "Submit Enrollment Application"}
              {!loading && <ArrowRight className="h-4 w-4" />}
            </button>
          </div>

          <p className="text-center text-xs text-slate-400">
            Need help? WhatsApp{" "}
            <a className="font-bold text-brand-gold" href="https://wa.me/8801567936519">
              01567936519
            </a>
          </p>
        </form>
      </section>
    </main>
  );
}
