import { Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { PublicLayout } from "./layouts/PublicLayout";
import { DashboardLayout } from "./layouts/DashboardLayout";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import { studentLinks, adminLinks } from "./config/sidebarLinks";

import Home from "./pages/Home";
import About from "./pages/About";
import Courses from "./pages/Courses";
import CourseDetails from "./pages/CourseDetails";
import Teachers from "./pages/Teachers";
import Results from "./pages/Results";
import Notices from "./pages/Notices";
import NoticeDetails from "./pages/NoticeDetails";
import Gallery from "./pages/Gallery";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import AdminLogin from "./pages/AdminLogin";
import NotFound from "./pages/NotFound";

import StudentDashboard from "./pages/student/Dashboard";
import StudentProfile from "./pages/student/Profile";
import StudentMyCourses from "./pages/student/MyCourses";
import StudentSchedule from "./pages/student/Schedule";
import StudentAttendance from "./pages/student/Attendance";
import StudentResults from "./pages/student/Results";
import StudentNotices from "./pages/student/Notices";
import StudentAssignments from "./pages/student/Assignments";
import StudentFees from "./pages/student/Fees";
import StudentChangePassword from "./pages/student/ChangePassword";

import AdminDashboard from "./pages/admin/Dashboard";
import AdminStudents from "./pages/admin/Students";
import AdminCourses from "./pages/admin/Courses";
import AdminTeachers from "./pages/admin/Teachers";
import AdminAttendance from "./pages/admin/Attendance";
import AdminResults from "./pages/admin/Results";
import AdminNotices from "./pages/admin/Notices";
import AdminAssignments from "./pages/admin/Assignments";
import AdminSchedule from "./pages/admin/Schedule";
import AdminFees from "./pages/admin/Fees";
import AdminGallery from "./pages/admin/Gallery";
import AdminMessages from "./pages/admin/Messages";
import AdminSettings from "./pages/admin/Settings";

export default function App() {
  return (
    <AnimatePresence mode="wait">
      <Routes>
        {/* Public site */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/:id" element={<CourseDetails />} />
          <Route path="/teachers" element={<Teachers />} />
          <Route path="/results" element={<Results />} />
          <Route path="/notices" element={<Notices />} />
          <Route path="/notices/:id" element={<NoticeDetails />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        {/* Student dashboard */}
        <Route element={<ProtectedRoute role="STUDENT" />}>
          <Route element={<DashboardLayout links={studentLinks} title="Student Dashboard" />}>
            <Route path="/student/dashboard" element={<StudentDashboard />} />
            <Route path="/student/profile" element={<StudentProfile />} />
            <Route path="/student/courses" element={<StudentMyCourses />} />
            <Route path="/student/schedule" element={<StudentSchedule />} />
            <Route path="/student/attendance" element={<StudentAttendance />} />
            <Route path="/student/results" element={<StudentResults />} />
            <Route path="/student/notices" element={<StudentNotices />} />
            <Route path="/student/assignments" element={<StudentAssignments />} />
            <Route path="/student/fees" element={<StudentFees />} />
            <Route path="/student/change-password" element={<StudentChangePassword />} />
          </Route>
        </Route>

        {/* Admin dashboard */}
        <Route element={<ProtectedRoute role="ADMIN" />}>
          <Route element={<DashboardLayout links={adminLinks} title="Admin Dashboard" />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/students" element={<AdminStudents />} />
            <Route path="/admin/courses" element={<AdminCourses />} />
            <Route path="/admin/teachers" element={<AdminTeachers />} />
            <Route path="/admin/attendance" element={<AdminAttendance />} />
            <Route path="/admin/results" element={<AdminResults />} />
            <Route path="/admin/notices" element={<AdminNotices />} />
            <Route path="/admin/assignments" element={<AdminAssignments />} />
            <Route path="/admin/schedule" element={<AdminSchedule />} />
            <Route path="/admin/fees" element={<AdminFees />} />
            <Route path="/admin/gallery" element={<AdminGallery />} />
            <Route path="/admin/messages" element={<AdminMessages />} />
            <Route path="/admin/settings" element={<AdminSettings />} />
          </Route>
        </Route>
      </Routes>
    </AnimatePresence>
  );
}
