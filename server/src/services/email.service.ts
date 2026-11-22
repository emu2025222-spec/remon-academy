
import nodemailer from "nodemailer";
import { env } from "../config/env";

const transporter = nodemailer.createTransport({
  host: env.smtpHost,
  port: env.smtpPort,
  secure: env.smtpSecure,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export async function sendEnrollmentApprovalEmail(
  recipient: string,
  studentName: string,
  courseName: string,
  studentId: string,
  resetUrl: string
) {
  if (
    !process.env.SMTP_HOST ||
    !process.env.SMTP_USER ||
    !process.env.SMTP_PASSWORD
  ) {
    throw new Error("SMTP is not configured");
  }

  await transporter.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: recipient,
    subject: "Welcome to REMON Academy - Enrollment Approved",
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;color:#172033;line-height:1.7">
        <div style="background:#101b35;padding:25px;text-align:center;color:white">
          <h1 style="margin:0">REMON Academy</h1>
          <p style="margin:5px 0 0">Learn. Grow. Achieve.</p>
        </div>

        <div style="padding:25px;border:1px solid #e5e7eb">
          <h2>Congratulations, ${studentName}!</h2>

          <p>Your course enrollment has been approved.</p>

          <p><strong>Course:</strong> ${courseName}</p>
          <p><strong>Student ID:</strong> ${studentId}</p>
          <p><strong>Email:</strong> ${recipient}</p>

          <p>To activate your student account, set your password using the button below.</p>

          <div style="text-align:center;margin:30px 0">
            <a href="${resetUrl}"
              style="background:#c49a45;color:#101b35;padding:13px 25px;text-decoration:none;border-radius:6px;font-weight:bold">
              Set Your Password
            </a>
          </div>

          <p>This link expires in 1 hour. If it expires, contact the academy.</p>

          <p>Welcome to REMON Academy!</p>
        </div>
      </div>
    `,
  });
}