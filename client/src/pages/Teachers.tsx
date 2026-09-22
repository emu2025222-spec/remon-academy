import { useEffect, useState } from "react";
import { Facebook, Linkedin, Youtube } from "lucide-react";
import { api, getErrorMessage } from "../services/api";
import { Teacher } from "../types";
import { Card } from "../components/Card";
import { Loader } from "../components/Loader";
import { EmptyState } from "../components/EmptyState";
import { ErrorState } from "../components/ErrorState";

export default function Teachers() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/teachers/public")
      .then((r) => setTeachers(r.data.data))
      .catch((e) => setError(getErrorMessage(e)))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="container-page py-16">
      <div className="mb-10 text-center">
        <h1 className="font-display text-4xl font-bold text-brand-navy dark:text-white">Our Teachers</h1>
        <p className="mt-2 text-slate-500">Experienced educators dedicated to your success.</p>
      </div>

      {loading ? (
        <Loader />
      ) : error ? (
        <ErrorState message={error} />
      ) : teachers.length === 0 ? (
        <EmptyState message="No teachers listed yet." />
      ) : (
        <div className="grid gap-6 md:grid-cols-3">
          {teachers.map((t, i) => (
            <Card key={t._id} delay={i * 0.05} className="text-center">
              <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-brand-navy/10 text-3xl font-bold text-brand-navy dark:text-brand-goldLight">
                {t.name.charAt(0)}
              </div>
              <h3 className="font-display text-lg font-semibold text-brand-navy dark:text-white">{t.name}</h3>
              <p className="text-sm text-brand-gold">{t.designation}</p>
              <p className="mt-2 text-xs text-slate-500">{t.qualification}</p>
              <p className="mt-2 text-sm text-slate-500">{t.bio}</p>
              <p className="mt-2 text-xs font-semibold text-slate-400">{t.subjects.join(", ")} · {t.experienceYears}+ yrs</p>
              <div className="mt-4 flex justify-center gap-2">
                {t.socialLinks?.facebook && (
                  <a href={t.socialLinks.facebook} target="_blank" rel="noreferrer" className="rounded-full bg-slate-100 p-2 hover:bg-brand-gold hover:text-white dark:bg-slate-800">
                    <Facebook className="h-4 w-4" />
                  </a>
                )}
                {t.socialLinks?.linkedin && (
                  <a href={t.socialLinks.linkedin} target="_blank" rel="noreferrer" className="rounded-full bg-slate-100 p-2 hover:bg-brand-gold hover:text-white dark:bg-slate-800">
                    <Linkedin className="h-4 w-4" />
                  </a>
                )}
                {t.socialLinks?.youtube && (
                  <a href={t.socialLinks.youtube} target="_blank" rel="noreferrer" className="rounded-full bg-slate-100 p-2 hover:bg-brand-gold hover:text-white dark:bg-slate-800">
                    <Youtube className="h-4 w-4" />
                  </a>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
