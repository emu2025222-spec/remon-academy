import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import type { ResultPdfRecord } from "./resultPdf";

interface ReportFee {
  _id?: string;
  student?: any;
  billingMonth?: string;
  amount?: number;
  amountPaid?: number;
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
  student?: any;
  fee?: any;
}

interface Props {
  results: ResultPdfRecord[];
  fees: ReportFee[];
  paymentRequests: ReportPaymentRequest[];
}

interface StudentGroup {
  key: string;
  name: string;
  id: string;
  results: ResultPdfRecord[];
  fees: ReportFee[];
  payments: ReportPaymentRequest[];
}

const C = {
  navy: [15, 23, 42] as [number, number, number],
  blue: [30, 64, 110] as [number, number, number],
  gold: [194, 151, 67] as [number, number, number],
  light: [245, 247, 251] as [number, number, number],
  muted: [105, 116, 135] as [number, number, number],
  border: [220, 225, 233] as [number, number, number],
  white: [255, 255, 255] as [number, number, number],
  green: [22, 120, 82] as [number, number, number],
  red: [180, 55, 55] as [number, number, number],
};

const num = (value: any): number => {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
};

const money = (value: number): string =>
  `BDT ${num(value).toLocaleString("en-BD")}`;

const getId = (value: any): string => {
  if (!value) return "";
  if (typeof value === "string") return value;

  return String(
    value._id ||
    value.id ||
    value.studentId ||
    ""
  );
};

const getKey = (student: any): string => {
  return (
    getId(student) ||
    String(
      student?.fullName ||
      student?.name ||
      student ||
      "unknown"
    )
  ).toLowerCase();
};

const getName = (student: any): string => {
  if (!student) return "Unknown Student";
  if (typeof student === "string") return student;

  return (
    student.fullName ||
    student.name ||
    student.studentName ||
    "Unknown Student"
  );
};

const getStudentId = (student: any): string => {
  if (!student || typeof student === "string") return "-";

  return String(
    student.studentId ||
    student._id ||
    student.id ||
    "-"
  );
};

const dateText = (value?: string | Date): string => {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "-";

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getPaymentStudent = (
  payment: ReportPaymentRequest
) => {
  if (payment.student) return payment.student;

  if (payment.fee && typeof payment.fee === "object") {
    return payment.fee.student;
  }

  return null;
};

function buildStudents(
  results: ResultPdfRecord[],
  fees: ReportFee[],
  payments: ReportPaymentRequest[]
): StudentGroup[] {
  const map = new Map<string, StudentGroup>();

  const ensure = (student: any) => {
    const key = getKey(student);

    if (!map.has(key)) {
      map.set(key, {
        key,
        name: getName(student),
        id: getStudentId(student),
        results: [],
        fees: [],
        payments: [],
      });
    }

    const item = map.get(key)!;

    if (item.name === "Unknown Student") {
      item.name = getName(student);
    }

    if (item.id === "-") {
      item.id = getStudentId(student);
    }

    return item;
  };

  results.forEach((r) => ensure(r.student).results.push(r));
  fees.forEach((f) => ensure(f.student).fees.push(f));

  payments.forEach((p) => {
    const student = getPaymentStudent(p);
    if (student) ensure(student).payments.push(p);
  });

  return [...map.values()].sort((a, b) =>
    a.name.localeCompare(b.name)
  );
}

export function downloadAdminCombinedReport({
  results,
  fees,
  paymentRequests,
}: Props) {
  if (!results.length && !fees.length && !paymentRequests.length) {
    window.alert("No report data found.");
    return;
  }

  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
    compress: true,
  });

  const W = doc.internal.pageSize.getWidth();
  const H = doc.internal.pageSize.getHeight();
  const M = 12;

  const students = buildStudents(
    results,
    fees,
    paymentRequests
  );

  const totalFee = fees.reduce(
    (sum, f) => sum + num(f.amount),
    0
  );

  const totalPaid = fees.reduce(
    (sum, f) => sum + num(f.amountPaid),
    0
  );

  const totalDue = fees.reduce(
    (sum, f) =>
      sum + Math.max(0, num(f.amount) - num(f.amountPaid)),
    0
  );

  const today = dateText(new Date());

  // ---------------------------------------------
  // PAGE HEADER
  // ---------------------------------------------

  function drawHeader(
    title: string,
    subtitle: string
  ) {
    doc.setFillColor(...C.navy);
    doc.rect(0, 0, W, 35, "F");

    doc.setFillColor(...C.gold);
    doc.rect(0, 35, W, 1.3, "F");

    doc.setTextColor(...C.white);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(17);
    doc.text("REMON ACADEMY", M, 13);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(220, 226, 237);
    doc.text("LEARN. GROW. ACHIEVE.", M, 19);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(...C.gold);
    doc.text(title.toUpperCase(), M, 27);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(220, 226, 237);
    doc.text(subtitle, W - M, 27, {
      align: "right",
    });

    doc.setTextColor(...C.muted);
    doc.setFontSize(7);
    doc.text(
      `Generated: ${today}`,
      W - M,
      41,
      { align: "right" }
    );
  }

  // ---------------------------------------------
  // SECTION TITLE
  // ---------------------------------------------

  function drawSectionTitle(
    title: string,
    description: string,
    y: number
  ) {
    doc.setFillColor(...C.light);
    doc.roundedRect(M, y, W - M * 2, 13, 2, 2, "F");

    doc.setFillColor(...C.gold);
    doc.roundedRect(M, y, 2, 13, 1, 1, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(...C.navy);
    doc.text(title, M + 6, y + 5.5);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(...C.muted);
    doc.text(description, M + 6, y + 10);

    return y + 19;
  }

  // ---------------------------------------------
  // SUMMARY CARDS
  // ---------------------------------------------

  function drawSummaryCards(
    cards: { label: string; value: string }[],
    y: number
  ) {
    const gap = 4;
    const cardWidth = (W - M * 2 - gap * (cards.length - 1)) /
      cards.length;

    cards.forEach((card, i) => {
      const x = M + i * (cardWidth + gap);

      doc.setFillColor(...C.light);
      doc.roundedRect(x, y, cardWidth, 20, 2, 2, "F");

      doc.setDrawColor(...C.border);
      doc.roundedRect(x, y, cardWidth, 20, 2, 2, "S");

      doc.setFont("helvetica", "normal");
      doc.setFontSize(6.5);
      doc.setTextColor(...C.muted);
      doc.text(card.label, x + 4, y + 7);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(...C.navy);
      doc.text(card.value, x + 4, y + 15);
    });

    return y + 26;
  }

  // ---------------------------------------------
  // TABLE DEFAULT STYLE
  // ---------------------------------------------

  const tableTheme = {
    theme: "grid" as const,
    styles: {
      font: "helvetica",
      fontSize: 7,
      cellPadding: 2.2,
      overflow: "linebreak" as const,
      valign: "middle" as const,
      textColor: C.navy,
      lineColor: C.border,
      lineWidth: 0.15,
    },
    headStyles: {
      fillColor: C.navy,
      textColor: C.white,
      fontStyle: "bold" as const,
      fontSize: 7,
      cellPadding: 2.7,
    },
    alternateRowStyles: {
      fillColor: C.light,
    },
    margin: {
      left: M,
      right: M,
      bottom: 17,
      top: 43,
    },
    showHead: "everyPage" as const,
  };

  // ---------------------------------------------
  // RESULT REPORT
  // ---------------------------------------------

  const resultStudents = students.filter(
    (s) => s.results.length > 0
  );

  if (resultStudents.length) {
    drawHeader(
      "Academic Performance Report",
      `${resultStudents.length} Students`
    );

    let y = drawSectionTitle(
      "MODEL TEST RESULTS",
      "Student-wise academic performance overview",
      46
    );

    y = drawSummaryCards(
      [
        {
          label: "Students",
          value: String(resultStudents.length),
        },
        {
          label: "Result Records",
          value: String(results.length),
        },
        {
          label: "Report Date",
          value: today,
        },
      ],
      y
    );

    const body = resultStudents.map((student, index) => {
      const subjectDetails = student.results.map((r) => {
        const subject = r.subject || "Subject";

        return `${subject}: ${num(r.obtainedMarks)}/${num(
          r.totalMarks
        )}`;
      });

      const avgGpa =
        student.results.reduce(
          (sum, r) => sum + num(r.gpa),
          0
        ) / student.results.length;

      const avgMarks =
        student.results.reduce((sum, r) => {
          const total = num(r.totalMarks);
          if (!total) return sum;

          return sum + (num(r.obtainedMarks) / total) * 100;
        }, 0) / student.results.length;

      return [
        String(index + 1),
        student.name,
        student.id,
        subjectDetails.join("\n"),
        `${avgMarks.toFixed(1)}%`,
        avgGpa.toFixed(2),
      ];
    });

    autoTable(doc, {
      ...tableTheme,
      startY: y,
      head: [[
        "#",
        "Student Name",
        "Student ID",
        "Subject-wise Marks",
        "Average",
        "GPA",
      ]],
      body,
      pageBreak: "auto",
      rowPageBreak: "auto",
      columnStyles: {
        0: { cellWidth: 8, halign: "center" },
        1: { cellWidth: 35 },
        2: { cellWidth: 23 },
        3: { cellWidth: 78 },
        4: { cellWidth: 19, halign: "center" },
        5: { cellWidth: 15, halign: "center" },
      },
      didDrawPage: () => {
        if (doc.getCurrentPageInfo().pageNumber > 1) {
          drawHeader(
            "Academic Performance Report",
            "Continued"
          );
        }
      },
    });
  }

  // ---------------------------------------------
  // FEE REPORT
  // ---------------------------------------------

  if (fees.length) {
    doc.addPage();

    drawHeader(
      "Financial Report",
      `${fees.length} Fee Records`
    );

    let y = drawSectionTitle(
      "STUDENT FEE SUMMARY",
      "Monthly fee collection and outstanding balance",
      46
    );

    y = drawSummaryCards(
      [
        {
          label: "Total Fee",
          value: money(totalFee),
        },
        {
          label: "Total Paid",
          value: money(totalPaid),
        },
        {
          label: "Outstanding Due",
          value: money(totalDue),
        },
      ],
      y
    );

    const feeBody = fees.map((fee, index) => {
      const amount = num(fee.amount);
      const paid = num(fee.amountPaid);
      const due = Math.max(0, amount - paid);

      const status =
        fee.status ||
        (due <= 0
          ? "PAID"
          : paid > 0
          ? "PARTIAL"
          : "PENDING");

      return [
        String(index + 1),
        getName(fee.student),
        getStudentId(fee.student),
        fee.billingMonth || "-",
        money(amount),
        money(paid),
        money(due),
        status,
      ];
    });

    autoTable(doc, {
      ...tableTheme,
      startY: y,
      head: [[
        "#",
        "Student",
        "Student ID",
        "Month",
        "Fee",
        "Paid",
        "Due",
        "Status",
      ]],
      body: feeBody,
      columnStyles: {
        0: { cellWidth: 8, halign: "center" },
        1: { cellWidth: 35 },
        2: { cellWidth: 23 },
        3: { cellWidth: 20 },
        4: { cellWidth: 25 },
        5: { cellWidth: 25 },
        6: { cellWidth: 25 },
        7: { cellWidth: 19, halign: "center" },
      },
    });
  }

  // ---------------------------------------------
  // PAYMENT REQUEST REPORT
  // ---------------------------------------------

  if (paymentRequests.length) {
    doc.addPage();

    drawHeader(
      "Payment Verification Report",
      `${paymentRequests.length} Requests`
    );

    const y = drawSectionTitle(
      "BKASH PAYMENT REQUEST HISTORY",
      "Submitted transactions and verification status",
      46
    );

    const paymentBody = paymentRequests.map((p, index) => {
      const student = getPaymentStudent(p);

      return [
        String(index + 1),
        getName(student),
        getStudentId(student),
        money(num(p.amount)),
        p.senderNumber || "-",
        p.transactionId || "-",
        p.status || "PENDING",
        dateText(p.createdAt),
      ];
    });

    autoTable(doc, {
      ...tableTheme,
      startY: y,
      head: [[
        "#",
        "Student",
        "Student ID",
        "Amount",
        "Sender",
        "Transaction ID",
        "Status",
        "Date",
      ]],
      body: paymentBody,
      styles: {
        ...tableTheme.styles,
        fontSize: 6.5,
      },
      columnStyles: {
        0: { cellWidth: 8, halign: "center" },
        1: { cellWidth: 32 },
        2: { cellWidth: 21 },
        3: { cellWidth: 22 },
        4: { cellWidth: 24 },
        5: { cellWidth: 39 },
        6: { cellWidth: 22 },
        7: { cellWidth: 20 },
      },
    });
  }

  // ---------------------------------------------
  // PROFESSIONAL FOOTER
  // ---------------------------------------------

  const pageCount = doc.getNumberOfPages();

  for (let page = 1; page <= pageCount; page++) {
    doc.setPage(page);

    doc.setDrawColor(...C.gold);
    doc.setLineWidth(0.35);
    doc.line(M, H - 12, W - M, H - 12);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(...C.muted);

    doc.text(
      "REMON ACADEMY  |  OFFICIAL ADMIN REPORT",
      M,
      H - 7
    );

    doc.setFont("helvetica", "bold");
    doc.setTextColor(...C.navy);

    doc.text(
      `PAGE ${page} / ${pageCount}`,
      W - M,
      H - 7,
      { align: "right" }
    );
  }

  const filename =
    `REMON-Academy-Combined-Report-${new Date()
      .toISOString()
      .slice(0, 10)}.pdf`;

  doc.save(filename);
}