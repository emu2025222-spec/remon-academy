
const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (char) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return entities[char];
  });

export async function sendEnrollmentApprovalEmail(
  email: string,
  fullName: string,
  courseTitle: string,
  studentId: string,
  resetUrl: string
) {
  const scriptUrl = process.env.GMAIL_SCRIPT_URL;
  const secret = process.env.GMAIL_SCRIPT_SECRET;

  if (!scriptUrl || !secret) {
    throw new Error("Google Apps Script email configuration is missing");
  }

  const safeName = escapeHtml(fullName);
  const safeCourse = escapeHtml(courseTitle);
  const safeStudentId = escapeHtml(studentId);
  const safeUrl = escapeHtml(resetUrl);

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:24px;color:#172033">
      <div style="background:#071735;color:white;padding:24px;border-radius:12px 12px 0 0">
        <h2 style="margin:0">REMON Academy</h2>
        <p style="margin:8px 0 0;color:#e7c46b">Learn. Grow. Achieve.</p>
      </div>

      <div style="padding:24px;border:1px solid #e5e7eb;border-top:0;border-radius:0 0 12px 12px">
        <h2>Congratulations, ${safeName}!</h2>

        <p>Your course enrollment has been approved.</p>

        <p><strong>Course:</strong> ${safeCourse}</p>
        <p><strong>Student ID:</strong> ${safeStudentId}</p>

        <p>Please set your account password using the button below:</p>

        <p style="margin:28px 0">
          <a href="${safeUrl}"
             style="background:#c9a44c;color:#071735;padding:14px 22px;text-decoration:none;border-radius:8px;font-weight:bold;display:inline-block">
            Set Your Password
          </a>
        </p>

        <p>This link will expire in 1 hour.</p>

        <p>If the button does not work, copy this link into your browser:</p>
        <p style="word-break:break-all">${safeUrl}</p>

        <hr style="border:0;border-top:1px solid #e5e7eb;margin:24px 0">

        <p style="color:#64748b;font-size:13px">
          REMON Academy<br>
          Learn. Grow. Achieve.
        </p>
      </div>
    </div>
  `;

  const text = [
    `Congratulations, ${fullName}!`,
    "",
    "Your course enrollment has been approved.",
    `Course: ${courseTitle}`,
    `Student ID: ${studentId}`,
    "",
    "Set your password using this link:",
    resetUrl,
    "",
    "This link will expire in 1 hour.",
    "",
    "REMON Academy",
    "Learn. Grow. Achieve.",
  ].join("\n");

  const response = await fetch(scriptUrl, {
    method: "POST",
    headers: {
      "Content-Type": "text/plain;charset=utf-8",
    },
    body: JSON.stringify({
      secret,
      to: email,
      subject: "Your REMON Academy Enrollment Is Approved",
      html,
      text,
    }),
    redirect: "follow",
  });

  if (!response.ok) {
    throw new Error(
      `Google Apps Script request failed: HTTP ${response.status}`
    );
  }

  const result = await response.json() as {
    success?: boolean;
    message?: string;
  };

  if (!result.success) {
    throw new Error(
      result.message || "Google Apps Script could not send the email"
    );
  }

  return result;
}
