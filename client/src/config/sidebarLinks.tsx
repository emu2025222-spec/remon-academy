import {
  LayoutDashboard, User, BookOpen, CalendarDays, CalendarCheck, Award, Bell,
  ClipboardList, Wallet, KeyRound, Users, GraduationCap, Image, MessageSquare, Settings,
} from "lucide-react";
import { SidebarLink } from "../layouts/DashboardLayout";

export const studentLinks: SidebarLink[] = [
  { to: "/student/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/student/profile", label: "My Profile", icon: User },
  { to: "/student/courses", label: "My Courses", icon: BookOpen },
  { to: "/student/schedule", label: "Class Schedule", icon: CalendarDays },
  { to: "/student/attendance", label: "Attendance", icon: CalendarCheck },
  { to: "/student/results", label: "Results", icon: Award },
  { to: "/student/notices", label: "Notices", icon: Bell },
  { to: "/student/assignments", label: "Assignments", icon: ClipboardList },
  { to: "/student/fees", label: "Fees", icon: Wallet },
  { to: "/student/change-password", label: "Change Password", icon: KeyRound },
];

export const adminLinks: SidebarLink[] = [
  { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/students", label: "Students", icon: Users },
  { to: "/admin/courses", label: "Courses", icon: BookOpen },
  { to: "/admin/teachers", label: "Teachers", icon: GraduationCap },
  { to: "/admin/attendance", label: "Attendance", icon: CalendarCheck },
  { to: "/admin/results", label: "Results", icon: Award },
  { to: "/admin/notices", label: "Notices", icon: Bell },
  { to: "/admin/assignments", label: "Assignments", icon: ClipboardList },
  { to: "/admin/schedule", label: "Schedule", icon: CalendarDays },
  { to: "/admin/fees", label: "Fees", icon: Wallet },
  { to: "/admin/gallery", label: "Gallery", icon: Image },
  { to: "/admin/messages", label: "Messages", icon: MessageSquare },
  { to: "/admin/settings", label: "Settings", icon: Settings },
];
