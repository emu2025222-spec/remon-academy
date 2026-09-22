import { useState } from "react";
import { useForm } from "react-hook-form";
import { api, getErrorMessage } from "../../services/api";
import { Input } from "../../components/Input";
import { Button } from "../../components/Button";
import { useToast } from "../../components/Toast";

interface FormData { currentPassword: string; newPassword: string; confirmPassword: string }

export default function ChangePassword() {
  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm<FormData>();
  const [loading, setLoading] = useState(false);
  const { show } = useToast();
  const newPassword = watch("newPassword");

  async function onSubmit(data: FormData) {
    if (data.newPassword !== data.confirmPassword) {
      show("New passwords do not match", "error");
      return;
    }
    setLoading(true);
    try {
      await api.put("/students/me/password", { currentPassword: data.currentPassword, newPassword: data.newPassword });
      show("Password changed successfully", "success");
      reset();
    } catch (err) {
      show(getErrorMessage(err), "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md">
      <h2 className="mb-6 font-display text-2xl font-bold text-slate-900 dark:text-white">Change Password</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="card space-y-4 p-6">
        <Input label="Current Password" type="password" {...register("currentPassword", { required: true })} />
        <Input label="New Password" type="password" {...register("newPassword", { required: true, minLength: 8 })} />
        <Input label="Confirm New Password" type="password" {...register("confirmPassword", { required: true })} />
        {newPassword && newPassword.length < 8 && <p className="text-xs text-red-500">Password must be at least 8 characters</p>}
        <Button type="submit" loading={loading}>Update Password</Button>
      </form>
    </div>
  );
}
