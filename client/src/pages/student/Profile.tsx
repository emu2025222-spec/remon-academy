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
      show(
        getErrorMessage(err),
        "error"
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading || !profile) {
    return <Loader />;
  }

  /*
   * New multiple-course support.
   *
   * New students:
   *   profile.courses
   *
   * Old students:
   *   profile.course
   *
   * We support both so existing data does not break.
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

  // Backward compatibility for old
  // single-course students.
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
    <div className="max-w-4xl">
      <h2 className="mb-6 font-display text-2xl font-bold text-slate-900 dark:text-white">
        My Profile
      </h2>

      {/* Student Information */}
      <div className="card mb-6 grid grid-cols-1 gap-5 p-6 text-sm sm:grid-cols-2">
        <div>
          <p className="text-slate-400">
            Student ID
          </p>

          <p className="font-semibold text-slate-900 dark:text-white">
            {profile.studentId}
          </p>
        </div>

        <div>
          <p className="text-slate-400">
            Full Name
          </p>

          <p className="font-semibold text-slate-900 dark:text-white">
            {profile.fullName}
          </p>
        </div>

        <div>
          <p className="text-slate-400">
            Class
          </p>

          <p className="font-semibold text-slate-900 dark:text-white">
            {profile.class}
          </p>
        </div>

        <div>
          <p className="text-slate-400">
            Group
          </p>

          <p className="font-semibold text-slate-900 dark:text-white">
            {profile.group || "—"}
          </p>
        </div>

        <div>
          <p className="text-slate-400">
            Gender
          </p>

          <p className="font-semibold text-slate-900 dark:text-white">
            {profile.gender}
          </p>
        </div>

        <div>
          <p className="text-slate-400">
            Date of Birth
          </p>

          <p className="font-semibold text-slate-900 dark:text-white">
            {new Date(
              profile.dateOfBirth
            ).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Assigned Courses */}
      <div className="card mb-6 p-6">
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white">
              My Courses
            </h3>

            <p className="mt-1 text-xs text-slate-400">
              Courses assigned to you by the academy.
            </p>
          </div>

          <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            {assignedCourses.length}{" "}
            {assignedCourses.length === 1
              ? "Course"
              : "Courses"}
          </div>
        </div>

        {assignedCourses.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-200 p-6 text-center dark:border-slate-700">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              No course has been assigned yet.
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Please contact the academy office.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {assignedCourses.map(
              (course, index) => (
                <div
                  key={
                    course._id ||
                    `course-${index}`
                  }
                  className="rounded-xl border border-slate-200 p-5 transition dark:border-slate-700"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-base font-bold text-slate-900 dark:text-white">
                        {course.title}
                      </p>

                      {course.subject && (
                        <p className="mt-1 text-xs text-slate-400">
                          {course.subject}
                        </p>
                      )}
                    </div>

                    <span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                      Assigned
                    </span>
                  </div>

                  <div className="mt-4 space-y-2 text-xs text-slate-500 dark:text-slate-400">
                    {course.classLevel && (
                      <div className="flex justify-between gap-4">
                        <span>Class</span>
                        <span className="font-medium text-slate-700 dark:text-slate-300">
                          {course.classLevel}
                        </span>
                      </div>
                    )}

                    {course.duration && (
                      <div className="flex justify-between gap-4">
                        <span>Duration</span>
                        <span className="font-medium text-slate-700 dark:text-slate-300">
                          {course.duration}
                        </span>
                      </div>
                    )}

                    {course.fee !== undefined && (
                      <div className="flex justify-between gap-4">
                        <span>Course Fee</span>
                        <span className="font-semibold text-slate-700 dark:text-slate-300">
                          ৳{course.fee}
                        </span>
                      </div>
                    )}

                    {course.schedule && (
                      <div className="flex justify-between gap-4">
                        <span>Schedule</span>
                        <span className="text-right font-medium text-slate-700 dark:text-slate-300">
                          {course.schedule}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )
            )}
          </div>
        )}

        <div className="mt-4 rounded-lg bg-slate-50 p-3 text-xs text-slate-500 dark:bg-slate-800/50 dark:text-slate-400">
          Course enrollment can only be changed by
          the academy administration.
        </div>
      </div>

      {/* Editable Profile Information */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="card space-y-4 p-6"
      >
        <div>
          <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white">
            Contact Information
          </h3>

          <p className="mt-1 text-xs text-slate-400">
            Only phone and address can be edited.
            Contact the office to update other
            details.
          </p>
        </div>

        <Input
          label="Phone"
          {...register("phone")}
        />

        <Input
          label="Address"
          {...register("address")}
        />

        <Button
          type="submit"
          loading={saving}
        >
          Save Changes
        </Button>
      </form>
    </div>
  );
}