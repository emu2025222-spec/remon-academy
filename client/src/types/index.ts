export type UserRole = "ADMIN" | "STUDENT";

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
  createdAt: string;
}

export interface Teacher {
  _id: string;
  name: string;
  photo?: string;
  designation: string;
  qualification: string;
  subjects: string[];
  experienceYears: number;
  bio: string;
  phone?: string;
  email?: string;
  socialLinks?: { facebook?: string; linkedin?: string; youtube?: string };
  isActive: boolean;
}

export interface Notice {
  _id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  date: string;
  attachment?: string;
  isPublished: boolean;
}

export interface Student {
  _id: string;
  user: { _id: string; email: string; isActive: boolean } | string;
  studentId: string;
  fullName: string;
  phone: string;
  dateOfBirth: string;
  gender: "MALE" | "FEMALE" | "OTHER";
  address: string;
  class: string;
  group?: string;
  course?: Course | string;
  profilePhoto?: string;
  isActive: boolean;
  createdAt: string;
}

export interface Result {
  _id: string;
  student: string | Student;
  examName: string;
  subject: string;
  totalMarks: number;
  obtainedMarks: number;
  grade: string;
  gpa: number;
  examDate: string;
}

export interface AttendanceRecord {
  _id: string;
  student: string | Student;
  course: string | Course;
  date: string;
  status: "PRESENT" | "ABSENT" | "LATE";
}

export interface Fee {
  _id: string;
  student: string | Student;
  course: string | Course;
  amount: number;
  amountPaid: number;
  dueDate: string;
  status: "PAID" | "PENDING" | "PARTIAL";
  paymentDate?: string;
  paymentMethod?: string;
  transactionId?: string;
}

export interface Assignment {
  _id: string;
  title: string;
  description: string;
  course: string | Course;
  subject: string;
  deadline: string;
  attachment?: string;
}

export interface ScheduleItem {
  _id: string;
  course: string | Course;
  subject: string;
  teacher: string | Teacher;
  room: string;
  day: string;
  startTime: string;
  endTime: string;
}

export interface GalleryImage {
  _id: string;
  title: string;
  category: string;
  image: string;
}

export interface WebsiteSettings {
  coachingName: string;
  logo?: string;
  primaryColor: string;
  secondaryColor: string;
  phone: string;
  email: string;
  address: string;
  facebookUrl?: string;
  youtubeUrl?: string;
  aboutContent?: string;
  heroContent?: { headline: string; subheadline: string };
  footerContent?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiSuccess<T> {
  success: true;
  message: string;
  data: T;
}

export interface ApiFailure {
  success: false;
  message: string;
  errors: unknown[];
}
