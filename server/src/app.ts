
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
import examRoutes from "./routes/exam.routes";

import {
  notFoundHandler,
  errorHandler,
} from "./middleware/errorHandler";

const app: Application = express();

/*
|--------------------------------------------------------------------------
| TRUST PROXY
|--------------------------------------------------------------------------
| Render proxy configuration.
| This allows Express to identify the actual client IP.
*/
app.set("trust proxy", 1);

/*
|--------------------------------------------------------------------------
| SECURITY & MIDDLEWARE
|--------------------------------------------------------------------------
*/

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

app.use(
  morgan(env.nodeEnv === "development" ? "dev" : "combined")
);

/*
|--------------------------------------------------------------------------
| GLOBAL RATE LIMITER
|--------------------------------------------------------------------------
| Public and normal API requests.
| Authentication has its own dedicated limiter.
*/

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  standardHeaders: true,
  legacyHeaders: false,

  skip: (req) => req.path.startsWith("/auth/"),

  message: {
    success: false,
    message: "Too many requests. Please try again later.",
    errors: [],
  },
});

app.use("/api", globalLimiter);

/*
|--------------------------------------------------------------------------
| STATIC FILES
|--------------------------------------------------------------------------
*/

app.use(
  "/uploads",
  express.static(path.join(__dirname, "..", env.uploadDir))
);

/*
|--------------------------------------------------------------------------
| HEALTH CHECK
|--------------------------------------------------------------------------
*/

app.get("/api/health", (_req, res) => {
  res.json({
    success: true,
    message: "Remon Academy API is running",
  });
});

/*
|--------------------------------------------------------------------------
| ROUTES
|--------------------------------------------------------------------------
*/

app.use("/api/exams", examRoutes);

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

/*
|--------------------------------------------------------------------------
| ERROR HANDLERS
|--------------------------------------------------------------------------
*/

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
