import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import path from "path";
import { env } from "./config/env";
import authRoutes from "./routes/auth.routes";
import studentRoutes from "./routes/student.routes";
import courseRoutes from "./routes/course.routes";
import teacherRoutes from "./routes/teacher.routes";
import attendanceRoutes from "./routes/attendance.routes";
import resultRoutes from "./routes/result.routes";
import noticeRoutes from "./routes/notice.routes";
import assignmentRoutes from "./routes/assignment.routes";
import scheduleRoutes from "./routes/schedule.routes";
import feeRoutes from "./routes/fee.routes";
import galleryRoutes from "./routes/gallery.routes";
import contactRoutes from "./routes/contact.routes";
import settingsRoutes from "./routes/settings.routes";
import dashboardRoutes from "./routes/dashboard.routes";
import { notFoundHandler, errorHandler } from "./middleware/errorHandler";

const app: Application = express();

app.use(helmet());
app.use(
  cors({
    origin: env.clientUrl,
    credentials: true,
  })
);
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan(env.nodeEnv === "development" ? "dev" : "combined"));

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api", globalLimiter);

app.use("/uploads", express.static(path.join(__dirname, "..", env.uploadDir)));

app.get("/api/health", (req, res) => res.json({ success: true, message: "Remon Academy API is running" }));

app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/teachers", teacherRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/results", resultRoutes);
app.use("/api/notices", noticeRoutes);
app.use("/api/assignments", assignmentRoutes);
app.use("/api/schedule", scheduleRoutes);
app.use("/api/fees", feeRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
