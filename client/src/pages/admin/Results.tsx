import { ReactNode } from "react";

export type UserRole = "ADMIN" | "STUDENT";

export interface User {
  _id: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  createdAt?: string;
}

export interface Teacher {
  _id: string;
  name: string;
  email?: string;
  phone?: string;
  designation?: string;
  specialization?: string;
  bio?: string;
  photo?: string;
  isActive?: boolean;
  createdAt?: string;
}

export interface Course {
  _id: string;
  title: string;
  slug: string;
  description: string;
  classLevel: string;
  subject: string;
  duration: string;
  fee: number;
  teacher?: Teacher | string;
  schedule?: string;
  seatCapacity: number;
  enrolledCount: number;
  image?: string;
  features: string[];
  isPublished: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Student {
  _id: string;

  user:
    | {
        _id: string;
        email: string;
        isActive: boolean;
      }
    | string;

  studentId: string;
  fullName: string;
  phone: string;
  dateOfBirth: string;

  gender:
    | "MALE"
    | "FEMALE"
    | "OTHER";

  address: string;
  class: string;
  group?: string;

  // Existing single-course field.
  // Kept for backward compatibility.
  course?: Course | string;

  // New multiple-course field.
  courses?: (Course | string)[];

  profilePhoto?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface Result {
  _id: string;

  student: Student | string;

  // Course is optional because old result records
  // may not have a course assigned.
  course?: Course | string;

  examName: string;
  subject: string;

  totalMarks: number;
  obtainedMarks: number;

  grade: string;
  gpa: number;

  examDate: string;

  createdAt?: string;
  updatedAt?: string;
}

export interface Fee {
  _id: string;

  student: Student | string;

  course?: Course | string;

  amount: number;
  paidAmount: number;
  dueAmount?: number;

  dueDate?: string;

  status:
    | "PAID"
    | "PARTIAL"
    | "DUE";

  paymentDate?: string;
  notes?: string;

  createdAt?: string;
  updatedAt?: string;
}

export interface Attendance {
  _id: string;

  student: Student | string;

  course?: Course | string;

  date: string;

  status:
    | "PRESENT"
    | "ABSENT"
    | "LATE"
    | "LEAVE";

  remarks?: string;

  createdAt?: string;
  updatedAt?: string;
}

export interface AttendanceStats {
  total: number;
  present: number;
  absent: number;
  late: number;
  leave: number;
  percentage: number;
}

export interface CourseAttendanceStats
  extends AttendanceStats {
  courseId: string;
  courseTitle: string;
}

export interface Schedule {
  _id: string;

  course: Course | string;

  teacher?: Teacher | string;

  day: string;
  startTime: string;
  endTime: string;

  room?: string;

  createdAt?: string;
  updatedAt?: string;
}

export interface Assignment {
  _id: string;

  title: string;
  description?: string;

  course: Course | string;

  teacher?: Teacher | string;

  dueDate: string;

  totalMarks?: number;

  attachment?: string;

  createdAt?: string;
  updatedAt?: string;
}

export interface Notice {
  _id: string;

  title: string;
  content: string;

  isPublished?: boolean;

  createdAt: string;
  updatedAt?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export interface DashboardStats {
  totalStudents?: number;
  totalCourses?: number;
  totalTeachers?: number;
  totalFees?: number;
  totalPaid?: number;
  totalDue?: number;
}

export interface FeeSummary {
  totalRecords: number;
  totalFee: number;
  totalPaid: number;
  totalDue: number;
  paidPercentage: number;
  duePercentage: number;
}

export interface ExamSummary {
  examName: string;
  examDate: string;
  subjectCount: number;
  totalMarks: number;
  obtainedMarks: number;
  averageGpa: number;
}

export interface StudentResultsResponse {
  results: Result[];
  averageGpa: number;
  exams: ExamSummary[];
}

export interface StudentAttendanceResponse {
  records: Attendance[];
  stats: AttendanceStats;
  courseStats: CourseAttendanceStats[];
}

export interface StudentFeeSummary {
  pendingTotal: number;
  totalFee: number;
  totalPaid: number;
  totalDue: number;
  totalRecords: number;
}

export interface LoginResponse {
  token: string;
  refreshToken?: string;
  user: User;
}

export interface AuthUser extends User {
  student?: Student;
  teacher?: Teacher;
}

export interface FormEvent {
  preventDefault: () => void;
}

export type Children = ReactNode;