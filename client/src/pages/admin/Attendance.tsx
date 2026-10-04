import { useEffect, useState } from "react";
import { api, getErrorMessage } from "../../services/api";
import { Course, Student } from "../../types";
import { Button } from "../../components/Button";
import { Loader } from "../../components/Loader";
import { EmptyState } from "../../components/EmptyState";
import { useToast } from "../../components/Toast";

type StatusMap = Record<string, "PRESENT" | "ABSENT" | "LATE">;

export default function AdminAttendance() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [courseId, setCourseId] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [students, setStudents] = useState<Student[]>([]);
  const [statusMap, setStatusMap] = useState<StatusMap>({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const { show } = useToast();

  useEffect(() => { api.get("/courses", { params: { limit: 100 } }).then((r) => setCourses(r.data.data.data)); }, []);

  useEffect(() => {
    if (!courseId) { setStudents([]); return; }
    setLoading(true);
    api.get("/students", { params: { course: courseId, limit: 100 } }).then((r) => {
      setStudents(r.data.data.data);
      const initial: StatusMap = {};
      r.data.data.data.forEach((s: Student) => { initial[s._id] = "PRESENT"; });
      setStatusMap(initial);
    }).finally(() => setLoading(false));
  }, [courseId]);

  async function handleSubmit() {
    if (!courseId) { show("Select a course first", "error"); return; }
    setSaving(true);
    try {
      const records = students.map((s) => ({ student: s._id, status: statusMap[s._id] || "PRESENT" }));
      await api.post("/attendance/bulk", { course: courseId, date, records });
      show("Attendance saved successfully", "success");
    } catch (err) {
      show(getErrorMessage(err), "error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <h2 className="mb-6 font-display text-2xl font-bold text-slate-900 dark:text-white">Mark Attendance</h2>

      <div className="mb-6 flex flex-wrap gap-4">
        <div>
          <label className="label-field">Course</label>
          <select className="input-field" value={courseId} onChange={(e) => setCourseId(e.target.value)}>
            <option value="">Select course</option>
            {courses.map((c) => <option key={c._id} value={c._id}>{c.title}</option>)}
          </select>
        </div>
        <div>
          <label className="label-field">Date</label>
          <input type="date" className="input-field" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
      </div>

      {loading ? <Loader /> : !courseId ? (
        <EmptyState message="Select a course to load its students." />
      ) : students.length === 0 ? (
        <EmptyState message="No students enrolled in this course." />
      ) : (
        <>
          <div className="card overflow-x-auto p-0">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-left text-xs uppercase text-slate-400">
                <tr><th className="px-4 py-3">Student ID</th><th className="px-4 py-3">Name</th><th className="px-4 py-3">Status</th></tr>
              </thead>
              <tbody>
                {students.map((s) => (
                  <tr key={s._id} className="border-t border-slate-100 dark:border-slate-800">
                    <td className="px-4 py-3 font-mono text-xs">{s.studentId}</td>
                    <td className="px-4 py-3">{s.fullName}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        {(["PRESENT", "ABSENT", "LATE"] as const).map((st) => (
                          <button
                            key={st}
                            onClick={() => setStatusMap({ ...statusMap, [s._id]: st })}
                            className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                              statusMap[s._id] === st
                                ? st === "PRESENT" ? "bg-green-600 text-white" : st === "LATE" ? "bg-yellow-500 text-white" : "bg-red-600 text-white"
                                : "bg-slate-100 text-slate-500 dark:bg-slate-800"
                            }`}
                          >
                            {st}
                          </button>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Button onClick={handleSubmit} loading={saving} className="mt-4">Save Attendance</Button>
        </>
      )}
    </div>
  );
}
