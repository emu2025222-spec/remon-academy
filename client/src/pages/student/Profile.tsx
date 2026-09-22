import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
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
  const { register, handleSubmit, reset } = useForm<FormData>();
  const { show } = useToast();

  useEffect(() => {
    api.get("/students/me").then((r) => {
      setProfile(r.data.data);
      reset({ phone: r.data.data.phone, address: r.data.data.address });
      setLoading(false);
    });
  }, [reset]);

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

  if (loading || !profile) return <Loader />;
  const courseTitle = profile.course && typeof profile.course === "object" ? (profile.course as Course).title : "Not assigned";

  return (
    <div className="max-w-2xl">
      <h2 className="mb-6 font-display text-2xl font-bold text-slate-900 dark:text-white">My Profile</h2>
      <div className="card mb-6 grid grid-cols-2 gap-4 p-6 text-sm">
        <div><p className="text-slate-400">Student ID</p><p className="font-semibold">{profile.studentId}</p></div>
        <div><p className="text-slate-400">Full Name</p><p className="font-semibold">{profile.fullName}</p></div>
        <div><p className="text-slate-400">Class</p><p className="font-semibold">{profile.class}</p></div>
        <div><p className="text-slate-400">Group</p><p className="font-semibold">{profile.group || "—"}</p></div>
        <div><p className="text-slate-400">Course</p><p className="font-semibold">{courseTitle}</p></div>
        <div><p className="text-slate-400">Gender</p><p className="font-semibold">{profile.gender}</p></div>
        <div><p className="text-slate-400">Date of Birth</p><p className="font-semibold">{new Date(profile.dateOfBirth).toLocaleDateString()}</p></div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="card space-y-4 p-6">
        <p className="text-xs text-slate-400">Only phone and address can be edited. Contact the office to update other details.</p>
        <Input label="Phone" {...register("phone")} />
        <Input label="Address" {...register("address")} />
        <Button type="submit" loading={saving}>Save Changes</Button>
      </form>
    </div>
  );
}
