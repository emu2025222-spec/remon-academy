import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  ArrowLeft,
  CheckCircle2,
  KeyRound,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react";
import { Link } from "react-router-dom";

import { api, getErrorMessage } from "../../services/api";
import { Input } from "../../components/Input";
import { Button } from "../../components/Button";
import { useToast } from "../../components/Toast";

interface FormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function ChangePassword() {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<FormData>();

  const [loading, setLoading] = useState(false);
  const { show } = useToast();

  const newPassword = watch("newPassword") || "";

  const passwordLengthValid = newPassword.length >= 8;
  const passwordsMatch =
    newPassword.length > 0 &&
    newPassword === watch("confirmPassword");

  async function onSubmit(data: FormData) {
    if (data.newPassword !== data.confirmPassword) {
      show("New passwords do not match", "error");
      return;
    }

    if (data.newPassword.length < 8) {
      show("Password must be at least 8 characters", "error");
      return;
    }

    setLoading(true);

    try {
      await api.put("/students/me/password", {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });

      show("Password changed successfully", "success");
      reset();
    } catch (err) {
      show(getErrorMessage(err), "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl">
      {/* HEADER */}
      <div className="mb-8">
        <div className="mb-3 flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-navyDark">
            <KeyRound className="h-4 w-4 text-brand-goldLight" />
          </div>

          <span className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-gold">
            Account Security
          </span>
        </div>

        <h1 className="font-display text-3xl font-semibold tracking-[-0.03em] text-brand-navyDark sm:text-4xl">
          Change Password
        </h1>

        <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
          Update your account password regularly to keep your student account
          secure.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
        {/* FORM */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_15px_50px_rgba(15,23,42,0.05)] sm:p-8"
        >
          <div className="mb-7 flex items-center gap-4 border-b border-slate-100 pb-6">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-navyDark">
              <LockKeyhole className="h-5 w-5 text-brand-goldLight" />
            </div>

            <div>
              <h2 className="font-display text-lg font-semibold text-brand-navyDark">
                Update your password
              </h2>

              <p className="mt-1 text-xs text-slate-400">
                Enter your current password first.
              </p>
            </div>
          </div>

          <div className="space-y-5">
            <Input
              label="Current Password"
              type="password"
              placeholder="Enter current password"
              error={errors.currentPassword ? "Current password is required" : undefined}
              {...register("currentPassword", {
                required: true,
              })}
            />

            <div>
              <Input
                label="New Password"
                type="password"
                placeholder="Enter new password"
                error={
                  errors.newPassword
                    ? "New password is required"
                    : undefined
                }
                {...register("newPassword", {
                  required: true,
                  minLength: 8,
                })}
              />

              {newPassword.length > 0 && (
                <div className="mt-3 rounded-xl bg-slate-50 p-3">
                  <div className="flex items-center gap-2">
                    {passwordLengthValid ? (
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                    ) : (
                      <span className="h-4 w-4 rounded-full border-2 border-slate-300" />
                    )}

                    <span
                      className={`text-xs ${
                        passwordLengthValid
                          ? "text-green-600"
                          : "text-slate-500"
                      }`}
                    >
                      At least 8 characters
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div>
              <Input
                label="Confirm New Password"
                type="password"
                placeholder="Re-enter new password"
                error={
                  errors.confirmPassword
                    ? "Please confirm your new password"
                    : undefined
                }
                {...register("confirmPassword", {
                  required: true,
                })}
              />

              {watch("confirmPassword") && (
                <div className="mt-3 flex items-center gap-2">
                  {passwordsMatch ? (
                    <>
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <span className="text-xs text-green-600">
                        Passwords match
                      </span>
                    </>
                  ) : (
                    <span className="text-xs text-red-500">
                      Passwords do not match
                    </span>
                  )}
                </div>
              )}
            </div>

            <Button
              type="submit"
              loading={loading}
              className="mt-2 w-full sm:w-auto"
            >
              <KeyRound className="mr-2 h-4 w-4" />
              Update Password
            </Button>
          </div>
        </form>

        {/* SECURITY INFO */}
        <aside className="h-fit rounded-[2rem] bg-brand-navyDark p-6 text-white shadow-[0_15px_50px_rgba(15,23,42,0.12)] sm:p-7">
          <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-gold/10">
            <ShieldCheck className="h-5 w-5 text-brand-goldLight" />
          </div>

          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-goldLight">
            Stay Secure
          </p>

          <h2 className="mt-3 font-display text-xl font-semibold">
            Protect your account.
          </h2>

          <p className="mt-3 text-sm leading-6 text-white/55">
            Use a strong password that is difficult for others to guess.
          </p>

          <div className="mt-6 space-y-4 border-t border-white/10 pt-6">
            <div className="flex gap-3">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-goldLight" />
              <p className="text-xs leading-5 text-white/65">
                Use at least 8 characters.
              </p>
            </div>

            <div className="flex gap-3">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-goldLight" />
              <p className="text-xs leading-5 text-white/65">
                Avoid using easily guessed information.
              </p>
            </div>

            <div className="flex gap-3">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-goldLight" />
              <p className="text-xs leading-5 text-white/65">
                Never share your password with anyone.
              </p>
            </div>
          </div>
        </aside>
      </div>

      {/* BACK */}
      <Link
        to="/student/dashboard"
        className="group mt-7 inline-flex items-center gap-2 text-sm font-medium text-slate-500 no-underline transition-colors hover:text-brand-navyDark"
      >
        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
        Back to dashboard
      </Link>
    </div>
  );
}