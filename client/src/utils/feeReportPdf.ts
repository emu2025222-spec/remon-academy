import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Fee } from "../types";

interface FeeReportRecord extends Fee {
  billingMonth?: string;
  paymentDate?: string;
  paymentMethod?: string;
  transactionId?: string;
  note?: string;
}

function getStudentInfo(student: Fee["student"]) {
  if (typeof student === "object" && student) {
    const data = student as {
      fullName?: string;
      studentId?: string;
    };

    return {
      name: data.fullName || "Unknown Student",
      id: data.studentId || "-",
    };
  }

  return {
    name: "Unknown Student",
    id: "-",
  };
}

function getCourseInfo(course: Fee["course"]) {
  if (typeof course === "object" && course) {
    const data = course as {
      title?: string;
      classLevel?: string;
      subject?: string;
    };

    return [
      data.title || "Unknown Course",
      data.classLevel,
      data.subject,
    ]
      .filter(Boolean)
      .join(" / ");
  }

  return "Unknown Course";
}

function formatReportDate(value?: string) {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getBillingMonth(month?: string) {
  if (!month) return "Unassigned";

  const [year, monthNumber] = month.split("-");

  if (!year || !monthNumber) return month;

  const date = new Date(
    Number(year),
    Number(monthNumber) - 1,
    1
  );

  return date.toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}

function getFeeStatus(
  amount: number,
  paid: number,
  savedStatus?: string
) {
  if (savedStatus) return savedStatus.toUpperCase();

  if (paid >= amount && amount > 0) {
    return "PAID";
  }

  if (paid > 0) {
    return "PARTIAL";
  }

  return "PENDING";
}

function formatAmount(value: number) {
  return Number(value || 0).toLocaleString("en-BD", {
    maximumFractionDigits: 2,
  });
}

export function exportFeeReportPdf(
  records: FeeReportRecord[]
) {
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4",
    compress: true,
  });

  const totalFee = records.reduce(
    (sum, fee) => sum + Number(fee.amount || 0),
    0
  );

  const totalPaid = records.reduce(
    (sum, fee) => sum + Number(fee.amountPaid || 0),
    0
  );

  const totalDue = Math.max(0, totalFee - totalPaid);

  const paidCount = records.filter((fee) => {
    const amount = Number(fee.amount || 0);
    const paid = Number(fee.amountPaid || 0);

    return getFeeStatus(amount, paid, fee.status) === "PAID";
  }).length;

  const partialCount = records.filter((fee) => {
    const amount = Number(fee.amount || 0);
    const paid = Number(fee.amountPaid || 0);

    return getFeeStatus(amount, paid, fee.status) === "PARTIAL";
  }).length;

  const pendingCount = records.filter((fee) => {
    const amount = Number(fee.amount || 0);
    const paid = Number(fee.amountPaid || 0);

    return getFeeStatus(amount, paid, fee.status) === "PENDING";
  }).length;

  const reportDate = new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const tableRows = records.map((fee, index) => {
    const student = getStudentInfo(fee.student);

    const amount = Number(fee.amount || 0);
    const paid = Number(fee.amountPaid || 0);
    const due = Math.max(0, amount - paid);

    const status = getFeeStatus(
      amount,
      paid,
      fee.status
    );

    return [
      String(index + 1),
      student.name,
      student.id,
      getCourseInfo(fee.course),
      getBillingMonth(fee.billingMonth),
      formatAmount(amount),
      formatAmount(paid),
      formatAmount(due),
      status,
      formatReportDate(fee.dueDate),
      formatReportDate(fee.paymentDate),
      fee.paymentMethod || "-",
      fee.transactionId || "-",
      fee.note || "-",
    ];
  });

  const drawPageHeader = () => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(17);
    doc.text("REMON ACADEMY", 10, 12);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.text("STUDENT FEE REPORT", 10, 18);

    doc.text(`Report Date: ${reportDate}`, 287, 12, {
      align: "right",
    });

    doc.text(`Total Records: ${records.length}`, 287, 18, {
      align: "right",
    });

    doc.setDrawColor(180, 180, 180);
    doc.line(10, 21, 287, 21);
  };

  drawPageHeader();

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);

  doc.text(
    `Total Fee: BDT ${formatAmount(totalFee)}`,
    10,
    27
  );

  doc.text(
    `Total Paid: BDT ${formatAmount(totalPaid)}`,
    75,
    27
  );

  doc.text(
    `Total Due: BDT ${formatAmount(totalDue)}`,
    145,
    27
  );

  doc.text(
    `Paid: ${paidCount}   Partial: ${partialCount}   Pending: ${pendingCount}`,
    287,
    27,
    { align: "right" }
  );

  autoTable(doc, {
    startY: 32,

    head: [[
      "#",
      "Student Name",
      "Student ID",
      "Course",
      "Billing Month",
      "Fee",
      "Paid",
      "Due",
      "Status",
      "Due Date",
      "Payment Date",
      "Method",
      "Transaction ID",
      "Note",
    ]],

    body: tableRows,

    theme: "grid",

    margin: {
      top: 25,
      right: 10,
      bottom: 12,
      left: 10,
    },

    styles: {
      font: "helvetica",
      fontSize: 4.7,
      cellPadding: 1.15,
      overflow: "linebreak",
      valign: "middle",
      lineWidth: 0.1,
      textColor: [35, 35, 35],
    },

    headStyles: {
      fillColor: [20, 35, 60],
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 5,
      halign: "center",
    },

    columnStyles: {
      0: { cellWidth: 6, halign: "center" },
      1: { cellWidth: 28 },
      2: { cellWidth: 17 },
      3: { cellWidth: 32 },
      4: { cellWidth: 17 },
      5: { cellWidth: 14, halign: "right" },
      6: { cellWidth: 14, halign: "right" },
      7: { cellWidth: 14, halign: "right" },
      8: { cellWidth: 15, halign: "center" },
      9: { cellWidth: 17 },
      10: { cellWidth: 17 },
      11: { cellWidth: 17 },
      12: { cellWidth: 27 },
      13: { cellWidth: 28 },
    },

    showHead: "everyPage",
    pageBreak: "auto",
    rowPageBreak: "avoid",

    didDrawPage: () => {
      drawPageHeader();

      const pageNumber = doc.getNumberOfPages();

      doc.setFont("helvetica", "normal");
      doc.setFontSize(7);

      doc.text(
        `REMON ACADEMY | Fee Report | Page ${pageNumber}`,
        148.5,
        205,
        { align: "center" }
      );
    },
  });

  const fileDate = new Date()
    .toISOString()
    .slice(0, 10);

  doc.save(`REMON-Academy-Fee-Report-${fileDate}.pdf`);
}