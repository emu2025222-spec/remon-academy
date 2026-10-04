import { useEffect, useState } from "react";
import { api } from "../../services/api";
import { Result } from "../../types";
import { Loader } from "../../components/Loader";
import { EmptyState } from "../../components/EmptyState";
import { Badge } from "../../components/Badge";

export default function StudentResults() {
  const [results, setResults] = useState<Result[]>([]);
  const [averageGpa, setAverageGpa] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/results/my").then((r) => {
      setResults(r.data.data.results);
      setAverageGpa(r.data.data.averageGpa);
      setLoading(false);
    });
  }, []);

  if (loading) return <Loader />;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white">My Results</h2>
        <div className="rounded-xl bg-brand-navy/10 px-4 py-2 text-sm font-semibold text-brand-navy dark:text-brand-goldLight">
          Average GPA: {averageGpa}
        </div>
      </div>

      {results.length === 0 ? (
        <EmptyState message="No results published yet." />
      ) : (
        <div className="card overflow-x-auto p-0">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-left text-xs uppercase text-slate-400">
              <tr>
                <th className="px-4 py-3">Exam</th>
                <th className="px-4 py-3">Subject</th>
                <th className="px-4 py-3">Marks</th>
                <th className="px-4 py-3">Grade</th>
                <th className="px-4 py-3">GPA</th>
                <th className="px-4 py-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {results.map((r) => (
                <tr key={r._id} className="border-t border-slate-100 dark:border-slate-800">
                  <td className="px-4 py-3">{r.examName}</td>
                  <td className="px-4 py-3">{r.subject}</td>
                  <td className="px-4 py-3">{r.obtainedMarks}/{r.totalMarks}</td>
                  <td className="px-4 py-3"><Badge color={r.gpa >= 4 ? "green" : r.gpa >= 3 ? "gold" : "red"}>{r.grade}</Badge></td>
                  <td className="px-4 py-3">{r.gpa}</td>
                  <td className="px-4 py-3">{new Date(r.examDate).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
