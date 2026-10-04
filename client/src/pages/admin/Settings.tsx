import { useEffect, useState } from "react";
import { api, getErrorMessage } from "../../services/api";
import { WebsiteSettings } from "../../types";
import { Loader } from "../../components/Loader";
import { Input } from "../../components/Input";
import { Button } from "../../components/Button";
import { useToast } from "../../components/Toast";

export default function AdminSettings() {
  const [form, setForm] = useState<WebsiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { show } = useToast();

  useEffect(() => {
    api.get("/settings").then((r) => setForm(r.data.data)).finally(() => setLoading(false));
  }, []);

  async function handleSave() {
    if (!form) return;
    setSaving(true);
    try {
      const res = await api.put("/settings", form);
      setForm(res.data.data);
      show("Settings updated successfully", "success");
    } catch (err) {
      show(getErrorMessage(err), "error");
    } finally {
      setSaving(false);
    }
  }

  if (loading || !form) return <Loader />;

  return (
    <div className="max-w-3xl">
      <h2 className="mb-6 font-display text-2xl font-bold text-slate-900 dark:text-white">Website Settings</h2>

      <div className="card grid gap-4 p-6 md:grid-cols-2">
        <Input label="Coaching Name" value={form.coachingName} onChange={(e) => setForm({ ...form, coachingName: e.target.value })} />
        <Input label="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        <Input label="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <Input label="Facebook URL" value={form.facebookUrl || ""} onChange={(e) => setForm({ ...form, facebookUrl: e.target.value })} />
        <Input label="YouTube URL" value={form.youtubeUrl || ""} onChange={(e) => setForm({ ...form, youtubeUrl: e.target.value })} />
        <Input label="Primary Color" type="color" value={form.primaryColor} onChange={(e) => setForm({ ...form, primaryColor: e.target.value })} />
        <Input label="Secondary Color" type="color" value={form.secondaryColor} onChange={(e) => setForm({ ...form, secondaryColor: e.target.value })} />
        <div className="md:col-span-2"><Input label="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} /></div>
        <div className="md:col-span-2">
          <label className="label-field">Hero Headline</label>
          <input className="input-field" value={form.heroContent?.headline || ""} onChange={(e) => setForm({ ...form, heroContent: { ...form.heroContent!, headline: e.target.value } })} />
        </div>
        <div className="md:col-span-2">
          <label className="label-field">Hero Subheadline</label>
          <input className="input-field" value={form.heroContent?.subheadline || ""} onChange={(e) => setForm({ ...form, heroContent: { ...form.heroContent!, subheadline: e.target.value } })} />
        </div>
        <div className="md:col-span-2">
          <label className="label-field">About Content</label>
          <textarea className="input-field" rows={4} value={form.aboutContent || ""} onChange={(e) => setForm({ ...form, aboutContent: e.target.value })} />
        </div>
        <div className="md:col-span-2">
          <label className="label-field">Footer Content</label>
          <textarea className="input-field" rows={2} value={form.footerContent || ""} onChange={(e) => setForm({ ...form, footerContent: e.target.value })} />
        </div>
        <div className="md:col-span-2"><Button onClick={handleSave} loading={saving}>Save Settings</Button></div>
      </div>
    </div>
  );
}
