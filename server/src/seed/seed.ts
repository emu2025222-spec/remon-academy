import mongoose from "mongoose";
import { connectDB } from "../config/db";
import { env } from "../config/env";
import { User } from "../models/User";
import { Admin } from "../models/Admin";
import { Student } from "../models/Student";
import { Course } from "../models/Course";
import { Teacher } from "../models/Teacher";
import { Notice } from "../models/Notice";
import { Result } from "../models/Result";
import { Attendance } from "../models/Attendance";
import { WebsiteSettings } from "../models/WebsiteSettings";
import { hashPassword, generateUniqueStudentId } from "../services/auth.service";

async function seed() {
  await connectDB();
  console.log("[SEED] Clearing existing data...");
  await Promise.all([
    User.deleteMany({}),
    Admin.deleteMany({}),
    Student.deleteMany({}),
    Course.deleteMany({}),
    Teacher.deleteMany({}),
    Notice.deleteMany({}),
    Result.deleteMany({}),
    Attendance.deleteMany({}),
    WebsiteSettings.deleteMany({}),
  ]);

  console.log("[SEED] Creating website settings...");
  await WebsiteSettings.create({
    coachingName: "Remon Academy",
    phone: "+8801700000000",
    email: "info@remonacademy.com",
    address: "House 12, Road 5, Dhanmondi, Dhaka, Bangladesh",
    facebookUrl: "https://facebook.com/remonacademy",
    youtubeUrl: "https://youtube.com/@remonacademy",
    heroContent: {
      headline: "Building Bright Futures Together",
      subheadline: "Expert coaching for SSC, HSC & Admission students across Bangladesh.",
    },
  });

  console.log("[SEED] Creating admin account...");
  const adminPasswordHash = await hashPassword(env.seedAdminPassword);
  const adminUser = await User.create({ email: env.seedAdminEmail, passwordHash: adminPasswordHash, role: "ADMIN" });
  await Admin.create({ user: adminUser._id, fullName: "Md. Remon Hossain", phone: "+8801700000001" });

  console.log("[SEED] Creating teachers...");
  const teachers = await Teacher.insertMany([
    {
      name: "Dr. Ayesha Rahman",
      designation: "Senior Physics Teacher",
      qualification: "PhD in Physics, Dhaka University",
      subjects: ["Physics", "Higher Math"],
      experienceYears: 12,
      bio: "Dr. Rahman has guided hundreds of HSC students to top results over the past decade.",
    },
    {
      name: "Md. Kamal Hossain",
      designation: "Senior Chemistry Teacher",
      qualification: "MSc in Chemistry, BUET",
      subjects: ["Chemistry"],
      experienceYears: 9,
      bio: "Known for simplifying complex chemistry concepts for SSC and HSC students.",
    },
    {
      name: "Nusrat Jahan",
      designation: "English Language Instructor",
      qualification: "MA in English, Dhaka University",
      subjects: ["English", "IELTS Preparation"],
      experienceYears: 7,
      bio: "Specializes in spoken English and admission test preparation.",
    },
  ]);

  console.log("[SEED] Creating courses...");
  const courses = await Course.insertMany([
    {
      title: "HSC Science Batch (2027)",
      slug: "hsc-science-batch-2027",
      description: "Complete HSC Physics, Chemistry, Higher Math and Biology coverage with regular model tests.",
      classLevel: "HSC",
      subject: "Science",
      duration: "2 years",
      fee: 8000,
      teacher: teachers[0]._id,
      schedule: "Sat, Mon, Wed - 4:00 PM to 6:00 PM",
      seatCapacity: 40,
      features: ["Weekly model tests", "Printed notes", "Doubt-clearing sessions"],
      isPublished: true,
    },
    {
      title: "SSC Special Batch (2027)",
      slug: "ssc-special-batch-2027",
      description: "Board-focused preparation for SSC candidates covering all core science subjects.",
      classLevel: "SSC",
      subject: "Science",
      duration: "1.5 years",
      fee: 6000,
      teacher: teachers[1]._id,
      schedule: "Sun, Tue, Thu - 4:00 PM to 6:00 PM",
      seatCapacity: 35,
      features: ["Chapter-wise tests", "Board question practice"],
      isPublished: true,
    },
    {
      title: "University Admission Crash Course",
      slug: "university-admission-crash-course",
      description: "Intensive preparation for engineering and general university admission tests.",
      classLevel: "Admission",
      subject: "General",
      duration: "6 months",
      fee: 12000,
      teacher: teachers[0]._id,
      schedule: "Daily - 7:00 AM to 9:00 AM",
      seatCapacity: 25,
      features: ["Daily mock tests", "Previous year question analysis"],
      isPublished: true,
    },
  ]);

  console.log("[SEED] Creating demo students...");
  const demoStudents = [
    { fullName: "Tanvir Ahmed", email: "tanvir.student@example.com", className: "HSC 1st Year" },
    { fullName: "Farzana Akter", email: "farzana.student@example.com", className: "SSC 2027" },
    { fullName: "Rakibul Islam", email: "rakibul.student@example.com", className: "Admission" },
  ];

  const createdStudents = [];
  for (const s of demoStudents) {
    const passwordHash = await hashPassword("Student123!");
    const user = await User.create({ email: s.email, passwordHash, role: "STUDENT" });
    const studentId = await generateUniqueStudentId();
    const student = await Student.create({
      user: user._id,
      studentId,
      fullName: s.fullName,
      phone: "+8801800000000",
      dateOfBirth: new Date("2008-01-15"),
      gender: "MALE",
      address: "Dhaka, Bangladesh",
      class: s.className,
      course: courses[0]._id,
    });
    createdStudents.push(student);
  }

  console.log("[SEED] Creating notices...");
  const adminDoc = await Admin.findOne({ user: adminUser._id });
  await Notice.insertMany([
    {
      title: "Admission Open for 2027 HSC Batch",
      slug: "admission-open-hsc-2027",
      description: "Admission is now open for the HSC 2027 science batch. Seats are limited.",
      category: "Admission",
      date: new Date(),
      author: adminDoc!._id,
      isPublished: true,
    },
    {
      title: "Model Test Schedule Published",
      slug: "model-test-schedule-published",
      description: "The model test schedule for this month has been published. Check the notice board.",
      category: "Exam",
      date: new Date(),
      author: adminDoc!._id,
      isPublished: true,
    },
  ]);

  console.log("[SEED] Creating sample results...");
  await Result.insertMany([
    {
      student: createdStudents[0]._id,
      examName: "Monthly Test - September",
      subject: "Physics",
      totalMarks: 100,
      obtainedMarks: 87,
      grade: "A+",
      gpa: 5.0,
      examDate: new Date(),
    },
  ]);

  console.log("[SEED] Creating sample attendance...");
  await Attendance.create({
    student: createdStudents[0]._id,
    course: courses[0]._id,
    date: new Date(),
    status: "PRESENT",
  });

  console.log("\n================ SEED COMPLETE ================");
  console.log(`Admin login  -> email: ${env.seedAdminEmail}  password: ${env.seedAdminPassword}`);
  console.log(`Student login-> email: tanvir.student@example.com  password: Student123!`);
  console.log("IMPORTANT: change the admin password immediately after first login.");
  console.log("=================================================\n");

  await mongoose.connection.close();
  process.exit(0);
}

seed().catch((err) => {
  console.error("[SEED] Failed:", err);
  process.exit(1);
});
