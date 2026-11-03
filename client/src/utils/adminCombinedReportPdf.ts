
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import type { ResultPdfRecord } from "./resultPdf";

interface ReportFee {
  _id?: string;
  student?: any;
  course?: any;
  billingMonth?: string;
  amount?: number;
  amountPaid?: number;
  dueDate?: string;
  paymentDate?: string;
  paymentMethod?: string;
  transactionId?: string;
  status?: string;
}

interface ReportPaymentRequest {
  _id?: string;
  amount?: number;
  senderNumber?: string;
  transactionId?: string;
  status?: string;
  createdAt?: string;
  reviewedAt?: string;
  rejectionReason?: string;
  student?: any;
  fee?: any;
}

interface Props {
  results: ResultPdfRecord[];
  fees: ReportFee[];
  paymentRequests: ReportPaymentRequest[];
}

function money(value: number) {
  return `BDT ${Number(value || 0).toLocaleString("en-BD")}`;
}

function studentName(student: any) {
  if (!student) return "Unknown Student";

  if (typeof student === "string") return student;

  return (
    student.fullName ||
    student.name ||
    "Unknown Student"
  );
}

function studentId(student: any) {
  if (!student || typeof student === "string") return "-";

  return student.studentId || student._id || "-";
}

function getStudentKey(student: any) {
  if (!student) return "unknown";

  if (typeof student === "string") return student;

  return String(student._id || student.studentId || student.fullName || "unknown");
}

function formatDate(value?: string | Date) {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "-";

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getResultStudent(result: ResultPdfRecord) {
  return result.student;
}

function getResultSummary(results: ResultPdfRecord[]) {
  const groups = new Map<string, {
    name: string;
    id: string;
    results: ResultPdfRecord[];
  }>();

  results.forEach((result) => {
    const student = getResultStudent(result);
    const key = getStudentKey(student);

    if (!groups.has(key)) {
      groups.set(key, {
        name: studentName(student),
        id: studentId(student),
        results: [],
      });
    }

    groups.get(key)!.results.push(result);
  });

  return Array.from(groups.values()).sort((a, b) =>
    a.name.localeCompare(b.name)
  );
}

export function downloadAdminCombinedReport({
  results,
  fees,
  paymentRequests,
}: Props) {
  if (!results.length && !fees.length) {
    alert("No result or fee records found.");
    return;
  }

  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
    compress: true,
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  const students = getResultSummary(results);

  const totalFee = fees.reduce(
    (sum, fee) => sum + Number(fee.amount || 0),
    0
  );

  const totalPaid = fees.reduce(
    (sum, fee) => sum + Number(fee.amountPaid || 0),
    0
  );

  const totalDue = Math.max(0, totalFee - totalPaid);

  const reportDate = formatDate(new Date());

  function header(title: string, subtitle: string) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(17);
    doc.setTextColor(15, 23, 42);
    doc.text("REMON ACADEMY", 14, 16);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text(title, 14, 23);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(100);
    doc.text(subtitle, 14, 29);
    doc.text(`Report Date: ${reportDate}`, pageWidth - 14, 29, {
      align: "right",
    });

    doc.setDrawColor(200, 205, 215);
    doc.line(14, 33, pageWidth - 14, 33);
  }

  function footer() {
    const pageCount = doc.getNumberOfPages();

    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(7);
      doc.setTextColor(120);

      doc.text(
        `REMON ACADEMY | ADMIN REPORT | Page ${i} of ${pageCount}`,
        pageWidth / 2,
        pageHeight - 5,
        { align: "center" }
      );
    }
  }

  // ==========================================
  // MODEL TEST RESULTS
  // 20 STUDENTS PER PAGE
  // ==========================================

  const resultPages = Math.max(1, Math.ceil(students.length / 20));

  for (let page = 0; page < resultPages; page++) {
    if (page > 0) doc.addPage();

    header(
      "MODEL TEST RESULT REPORT",
      `Students: ${students.length} | Maximum 20 students per page`
    );

    const pageStudents = students.slice(page * 20, page * 20 + 20);

    const body = pageStudents.map((student, index) => {
      const resultText = student.results.map((result) => {
        return `${result.subject}: ${result.obtainedMarks}/${result.totalMarks}`;
      }).join("\n");

      const averageGpa = student.results.length
        ? student.results.reduce(
            (sum, result) => sum + Number(result.gpa || 0),
            0
          ) / student.results.length
        : 0;

      const averageMarks = student.results.length
        ? student.results.reduce(
            (sum, result) =>
              sum +
              (Number(result.totalMarks) > 0
                ? (Number(result.obtainedMarks) / Number(result.totalMarks)) * 100
                : 0),
            0
          ) / student.results.length
        : 0;

      return [
        String(page * 20 + index + 1),
        student.name,
        student.id,
        resultText || "-",
        `${averageMarks.toFixed(1)}%`,
        averageGpa.toFixed(2),
      ];
    });

    autoTable(doc, {
      startY: 39,
      head: [[
        "SL",
        "Student Name",
        "Student ID",
        "Subject-wise Marks",
        "Avg. Marks",
        "Avg. GPA",
      ]],
      body,
      theme: "grid",
      margin: { left: 10, right: 10, bottom: 12 },
      styles: {
        font: "helvetica",
        fontSize: 7,
        cellPadding: 2,
        overflow: "linebreak",
        valign: "middle",
        lineColor: [210, 215, 223],
        lineWidth: 0.15,
      },
      headStyles: {
        fillColor: [15, 23, 42],
        textColor: [255, 255, 255],
        fontStyle: "bold",
        fontSize: 7,
      },
      alternateRowStyles: {
        fillColor: [245, 247, 250],
      },
      columnStyles: {
        0: { cellWidth: 9, halign: "center" },
        1: { cellWidth: 38 },
        2: { cellWidth: 25 },
        3: { cellWidth: 73 },
        4: { cellWidth: 20, halign: "center" },
        5: { cellWidth: 17, halign: "center" },
      },
      pageBreak: "avoid",
      rowPageBreak: "avoid",
    });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(90);
    doc.text(
      `Result page ${page + 1} of ${resultPages}`,
      pageWidth - 14,
      pageHeight - 12,
      { align: "right" }
    );
  }

  // ==========================================
  // FINANCIAL SUMMARY
  // ==========================================

  doc.addPage();

  header(
    "STUDENT FEE SUMMARY",
    "Monthly fee records and payment overview"
  );

  autoTable(doc, {
    startY: 40,
    head: [["Total Fee", "Total Paid", "Total Due", "Fee Records"]],
    body: [[
      money(totalFee),
      money(totalPaid),
      money(totalDue),
      String(fees.length),
    ]],
    theme: "grid",
    styles: {
      font: "helvetica",
      fontSize: 10,
      cellPadding: 5,
      halign: "center",
    },
    headStyles: {
      fillColor: [15, 23, 42],
      textColor: [255, 255, 255],
    },
  });

  const feeBody = fees.map((fee, index) => {
    const amount = Number(fee.amount || 0);
    const paid = Number(fee.amountPaid || 0);
    const due = Math.max(0, amount - paid);

    return [
      String(index + 1),
      studentName(fee.student),
      studentId(fee.student),
      fee.billingMonth || "-",
      money(amount),
      money(paid),
      money(due),
      fee.status || (due <= 0 ? "PAID" : paid > 0 ? "PARTIAL" : "PENDING"),
    ];
  });

  autoTable(doc, {
    startY: (doc as any).lastAutoTable?.finalY + 10 || 75,
    head: [[
      "SL",
      "Student",
      "Student ID",
      "Month",
      "Fee",
      "Paid",
      "Due",
      "Status",
    ]],
    body: feeBody,
    theme: "grid",
    showHead: "everyPage",
    margin: { left: 10, right: 10, top: 12, bottom: 15 },
    styles: {
      font: "helvetica",
      fontSize: 7,
      cellPadding: 2,
      overflow: "linebreak",
      valign: "middle",
    },
    headStyles: {
      fillColor: [15, 23, 42],
      textColor: [255, 255, 255],
      fontStyle: "bold",
    },
    columnStyles: {
      0: { cellWidth: 8 },
      1: { cellWidth: 38 },
      2: { cellWidth: 24 },
      3: { cellWidth: 20 },
      4: { cellWidth: 25 },
      5: { cellWidth: 25 },
      6: { cellWidth: 25 },
      7: { cellWidth: 22 },
    },
  });

  // ==========================================
  // PAYMENT REQUEST HISTORY
  // ==========================================

  doc.addPage();

  header(
    "BKASH PAYMENT REQUEST HISTORY",
    `Total payment requests: ${paymentRequests.length}`
  );

  const paymentBody = paymentRequests.map((request, index) => [
    String(index + 1),
    studentName(request.student),
    studentId(request.student),
    money(Number(request.amount || 0)),
    request.senderNumber || "-",
    request.transactionId || "-",
    request.status || "-",
    formatDate(request.createdAt),
  ]);

  autoTable(doc, {
    startY: 40,
    head: [[
      "SL",
      "Student",
      "Student ID",
      "Amount",
      "Sender",
      "Transaction ID",
      "Status",
      "Submitted",
    ]],
    body: paymentBody,
    theme: "grid",
    showHead: "everyPage",
    margin: { left: 9, right: 9, top: 12, bottom: 25 },
    styles: {
      font: "helvetica",
      fontSize: 6.5,
      cellPadding: 2,
      overflow: "linebreak",
      valign: "middle",
    },
    headStyles: {
      fillColor: [15, 23, 42],
      textColor: [255, 255, 255],
      fontStyle: "bold",
    },
    columnStyles: {
      0: { cellWidth: 8 },
      1: { cellWidth: 34 },
      2: { cellWidth: 22 },
      3: { cellWidth: 22 },
      4: { cellWidth: 24 },
      5: { cellWidth: 35 },
      6: { cellWidth: 22 },
      7: { cellWidth: 25 },
    },
  });

  // ==========================================
  // SIGNATURE AREA ON LAST PAGE
  // ==========================================

  const lastPage = doc.getNumberOfPages();
  doc.setPage(lastPage);

  let signatureY = pageHeight - 28;

  doc.setDrawColor(80, 80, 80);
  doc.setLineWidth(0.3);

  doc.line(18, signatureY, 75, signatureY);
  doc.line(pageWidth - 75, signatureY, pageWidth - 18, signatureY);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(60);

  doc.text("Prepared By", 46, signatureY + 5, { align: "center" });
  doc.text("Authorized Signature", pageWidth - 46, signatureY + 5, {
    align: "center",
  });

  footer();

  doc.save(`REMON-Academy-Combined-Admin-Report-${new Date().toISOString().slice(0, 10)}.pdf`);
}
