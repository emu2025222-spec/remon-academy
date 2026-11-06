
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export interface ResultPdfRecord {
  _id?: string;
  student?: any;
  course?: any;
  examName: string;
  subject: string;
  totalMarks: number;
  obtainedMarks: number;
  grade: string;
  gpa: number;
  examDate: string | Date;
}

interface StudentGroup {
  id: string;
  name: string;
  studentId: string;
  className: string;
  groupName: string;
  records: ResultPdfRecord[];
}

const EXAMS_PER_PAGE = 12;

const getStudentInfo = (result: ResultPdfRecord) => {
  const student =
    result.student && typeof result.student === "object"
      ? result.student
      : {};

  const studentId =
    student._id ||
    (typeof result.student === "string"
      ? result.student
      : "unknown");

  return {
    id: String(studentId),
    name: student.fullName || "Student",
    studentId: student.studentId || "N/A",
    className: student.class || student.className || "N/A",
    groupName: student.group || "N/A",
  };
};

const formatDate = (date: string | Date) => {
  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return "N/A";
  }

  return parsed.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const safeFileName = (value: string) =>
  value
    .trim()
    .replace(/[^a-z0-9-_]+/gi, "_")
    .replace(/^_+|_+$/g, "") || "Student";

const groupResultsByStudent = (
  results: ResultPdfRecord[]
): StudentGroup[] => {
  const map = new Map<string, StudentGroup>();

  for (const result of results) {
    const info = getStudentInfo(result);

    if (!map.has(info.id)) {
      map.set(info.id, {
        ...info,
        records: [],
      });
    }

    map.get(info.id)!.records.push(result);
  }

  return Array.from(map.values()).map((student) => ({
    ...student,
    records: [...student.records].sort(
      (a, b) =>
        new Date(a.examDate).getTime() -
        new Date(b.examDate).getTime()
    ),
  }));
};

/*
==================================================
ADMIN ORIGINAL MARKSHEET
==================================================
*/

const drawStudentMarksheet = (
  doc: jsPDF,
  student: StudentGroup
) => {
  const pageWidth = doc.internal.pageSize.getWidth();

  const totalMarks = student.records.reduce(
    (sum, item) => sum + Number(item.totalMarks || 0),
    0
  );

  const obtainedMarks = student.records.reduce(
    (sum, item) => sum + Number(item.obtainedMarks || 0),
    0
  );

  const gpaValues = student.records
    .map((item) => Number(item.gpa))
    .filter(Number.isFinite);

  const averageGpa = gpaValues.length
    ? gpaValues.reduce((sum, value) => sum + value, 0) /
      gpaValues.length
    : 0;

  const percentage =
    totalMarks > 0
      ? (obtainedMarks / totalMarks) * 100
      : 0;

  doc.setFillColor(13, 27, 48);
  doc.rect(0, 0, pageWidth, 43, "F");

  doc.setTextColor(218, 181, 105);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(23);
  doc.text("REMON ACADEMY", pageWidth / 2, 17, {
    align: "center",
  });

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.text("ACADEMIC PERFORMANCE REPORT", pageWidth / 2, 25, {
    align: "center",
  });

  doc.setFontSize(8);
  doc.setTextColor(220, 225, 232);
  doc.text("COMPLETE EXAMINATION MARKSHEET", pageWidth / 2, 33, {
    align: "center",
  });

  doc.setTextColor(25, 35, 50);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("STUDENT INFORMATION", 14, 55);

  doc.setDrawColor(190, 155, 85);
  doc.setLineWidth(0.6);
  doc.line(14, 58, pageWidth - 14, 58);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(70, 78, 90);

  doc.text(`Student Name: ${student.name}`, 14, 68);
  doc.text(`Student ID: ${student.studentId}`, 14, 75);
  doc.text(`Class: ${student.className}`, 14, 82);
  doc.text(`Group: ${student.groupName}`, 14, 89);

  const summaryY = 99;
  const cardGap = 4;
  const cardWidth = (pageWidth - 28 - cardGap * 2) / 3;

  const summaries = [
    { label: "TOTAL MARKS", value: String(totalMarks) },
    { label: "OBTAINED MARKS", value: String(obtainedMarks) },
    { label: "AVERAGE GPA", value: averageGpa.toFixed(2) },
  ];

  summaries.forEach((item, index) => {
    const x = 14 + index * (cardWidth + cardGap);

    doc.setFillColor(246, 247, 249);
    doc.roundedRect(x, summaryY, cardWidth, 21, 2, 2, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    doc.setTextColor(110, 115, 125);
    doc.text(item.label, x + 4, summaryY + 7);

    doc.setFontSize(13);
    doc.setTextColor(25, 35, 50);
    doc.text(item.value, x + 4, summaryY + 16);
  });

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(25, 35, 50);
  doc.text("EXAMINATION RESULTS", 14, 132);

  const tableRows = student.records.map((item) => [
    item.examName || "N/A",
    item.subject || "N/A",
    formatDate(item.examDate),
    `${item.obtainedMarks}/${item.totalMarks}`,
    item.grade || "N/A",
    Number(item.gpa || 0).toFixed(2),
  ]);

  autoTable(doc, {
    startY: 137,
    head: [[
      "Examination",
      "Subject",
      "Date",
      "Marks",
      "Grade",
      "GPA",
    ]],
    body: tableRows,
    theme: "grid",
    styles: {
      font: "helvetica",
      fontSize: 8,
      cellPadding: 3,
      textColor: [45, 52, 63],
      lineColor: [225, 228, 233],
      lineWidth: 0.2,
    },
    headStyles: {
      fillColor: [13, 27, 48],
      textColor: [255, 255, 255],
      fontStyle: "bold",
    },
    alternateRowStyles: {
      fillColor: [247, 248, 250],
    },
    margin: {
      left: 14,
      right: 14,
      bottom: 22,
    },
  });

  const finalY =
    (doc as jsPDF & { lastAutoTable?: { finalY: number } })
      .lastAutoTable?.finalY || 145;

  const noteY = Math.min(
    finalY + 12,
    doc.internal.pageSize.getHeight() - 25
  );

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(25, 35, 50);
  doc.text(
    `Overall Percentage: ${percentage.toFixed(2)}%`,
    14,
    noteY
  );

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(120, 125, 135);

  doc.text(
    "Generated by REMON ACADEMY Result Management System",
    pageWidth / 2,
    doc.internal.pageSize.getHeight() - 10,
    { align: "center" }
  );
};

/*
==================================================
STUDENT MARKSHEET PAGE
12 EXAMS PER PAGE
==================================================
*/

const drawStudentPage = (
  doc: jsPDF,
  student: StudentGroup,
  records: ResultPdfRecord[],
  pageNumber: number,
  totalPages: number,
  totalMarks: number,
  obtainedMarks: number,
  averageGpa: number,
  percentage: number
) => {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  const margin = 12;
  const contentWidth = pageWidth - margin * 2;

  // Header
  doc.setFillColor(13, 27, 48);
  doc.rect(0, 0, pageWidth, 37, "F");

  doc.setTextColor(218, 181, 105);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(21);
  doc.text("REMON ACADEMY", pageWidth / 2, 14, {
    align: "center",
  });

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.text("ACADEMIC PERFORMANCE REPORT", pageWidth / 2, 22, {
    align: "center",
  });

  doc.setFontSize(7);
  doc.setTextColor(220, 225, 232);
  doc.text("COMPLETE EXAMINATION MARKSHEET", pageWidth / 2, 29, {
    align: "center",
  });

  // Student information
  let y = 45;

  doc.setTextColor(25, 35, 50);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("STUDENT INFORMATION", margin, y);

  doc.setDrawColor(190, 155, 85);
  doc.setLineWidth(0.5);
  doc.line(margin, y + 3, pageWidth - margin, y + 3);

  y += 11;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(70, 78, 90);

  doc.text(`Name: ${student.name}`, margin, y);
  doc.text(`Student ID: ${student.studentId}`, pageWidth / 2, y);

  y += 7;

  doc.text(`Class: ${student.className}`, margin, y);
  doc.text(`Group: ${student.groupName}`, pageWidth / 2, y);

  // Summary cards
  y += 7;

  const cardGap = 3;
  const cardWidth = (contentWidth - cardGap * 2) / 3;

  const summaries = [
    { label: "TOTAL MARKS", value: String(totalMarks) },
    { label: "OBTAINED MARKS", value: String(obtainedMarks) },
    { label: "AVERAGE GPA", value: averageGpa.toFixed(2) },
  ];

  summaries.forEach((item, index) => {
    const x = margin + index * (cardWidth + cardGap);

    doc.setFillColor(246, 247, 249);
    doc.roundedRect(x, y, cardWidth, 17, 1.5, 1.5, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(6.5);
    doc.setTextColor(110, 115, 125);
    doc.text(item.label, x + 3, y + 6);

    doc.setFontSize(11);
    doc.setTextColor(25, 35, 50);
    doc.text(item.value, x + 3, y + 13);
  });

  y += 25;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(25, 35, 50);
  doc.text("EXAMINATION RESULTS", margin, y);

  y += 5;

  // Table columns
  const columns = [
    { title: "Examination", width: 43 },
    { title: "Subject", width: 39 },
    { title: "Date", width: 25 },
    { title: "Marks", width: 27 },
    { title: "Grade", width: 23 },
    { title: "GPA", width: 17 },
  ];

  const tableWidth = columns.reduce(
    (sum, column) => sum + column.width,
    0
  );

  const columnScale = contentWidth / tableWidth;

  columns.forEach((column) => {
    column.width *= columnScale;
  });

  const headerHeight = 8;
  const rowHeight = 8;

  // Table header
  doc.setFillColor(13, 27, 48);
  doc.rect(margin, y, contentWidth, headerHeight, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);

  let x = margin;

  columns.forEach((column) => {
    doc.text(
      column.title,
      x + column.width / 2,
      y + 5.3,
      { align: "center" }
    );

    x += column.width;
  });

  y += headerHeight;

  // Result rows
  records.forEach((item, index) => {
    const rowY = y + index * rowHeight;

    if (index % 2 === 0) {
      doc.setFillColor(247, 248, 250);
      doc.rect(margin, rowY, contentWidth, rowHeight, "F");
    }

    doc.setDrawColor(225, 228, 233);
    doc.setLineWidth(0.15);
    doc.rect(margin, rowY, contentWidth, rowHeight);

    const values = [
      item.examName || "N/A",
      item.subject || "N/A",
      formatDate(item.examDate),
      `${item.obtainedMarks}/${item.totalMarks}`,
      item.grade || "N/A",
      Number(item.gpa || 0).toFixed(2),
    ];

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(45, 52, 63);

    let cellX = margin;

    values.forEach((value, cellIndex) => {
      const column = columns[cellIndex];

      const text = String(value).replace(/\s+/g, " ").trim();

      const maxWidth = column.width - 3;

      const displayText =
        doc.getTextWidth(text) <= maxWidth
          ? text
          : doc.splitTextToSize(text, maxWidth)[0] || "";

      doc.text(
        displayText,
        cellX + column.width / 2,
        rowY + 5.2,
        { align: "center" }
      );

      cellX += column.width;
    });
  });

  // Vertical lines
  let lineX = margin;

  columns.forEach((column) => {
    lineX += column.width;

    doc.setDrawColor(225, 228, 233);
    doc.setLineWidth(0.15);

    doc.line(
      lineX,
      y,
      lineX,
      y + records.length * rowHeight
    );
  });

  const tableEndY = y + records.length * rowHeight;

  // Overall percentage only on the final page
  if (pageNumber === totalPages) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(25, 35, 50);

    doc.text(
      `Overall Percentage: ${percentage.toFixed(2)}%`,
      margin,
      tableEndY + 9
    );
  }

  // Page number
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(120, 125, 135);

  doc.text(
    `Page ${pageNumber} of ${totalPages}`,
    pageWidth - margin,
    pageHeight - 12,
    { align: "right" }
  );

  doc.setFontSize(7);

  doc.text(
    "Generated by REMON ACADEMY Result Management System",
    pageWidth / 2,
    pageHeight - 6,
    { align: "center" }
  );
};

/*
==================================================
STUDENT INDIVIDUAL PDF
12 EXAMS PER PAGE
==================================================
*/

export const downloadStudentMarksheetPdf = (
  results: ResultPdfRecord[]
) => {
  if (!results.length) return;

  const students = groupResultsByStudent(results);

  if (!students.length) return;

  const student = students[0];
  const records = student.records;

  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const totalMarks = records.reduce(
    (sum, item) => sum + Number(item.totalMarks || 0),
    0
  );

  const obtainedMarks = records.reduce(
    (sum, item) => sum + Number(item.obtainedMarks || 0),
    0
  );

  const gpaValues = records
    .map((item) => Number(item.gpa))
    .filter(Number.isFinite);

  const averageGpa = gpaValues.length
    ? gpaValues.reduce((sum, value) => sum + value, 0) /
      gpaValues.length
    : 0;

  const percentage =
    totalMarks > 0
      ? (obtainedMarks / totalMarks) * 100
      : 0;

  const totalPages = Math.ceil(
    records.length / EXAMS_PER_PAGE
  );

  for (let page = 0; page < totalPages; page++) {
    if (page > 0) {
      doc.addPage("a4", "portrait");
    }

    const start = page * EXAMS_PER_PAGE;
    const end = start + EXAMS_PER_PAGE;

    const pageRecords = records.slice(start, end);

    drawStudentPage(
      doc,
      student,
      pageRecords,
      page + 1,
      totalPages,
      totalMarks,
      obtainedMarks,
      averageGpa,
      percentage
    );
  }

  doc.save(
    `REMON-Academy-Marksheet-${safeFileName(student.name)}.pdf`
  );
};

/*
==================================================
ADMIN ALL STUDENTS MARKSHEETS
ORIGINAL BEHAVIOR
==================================================
*/

export const downloadAllStudentMarksheetsPdf = (
  results: ResultPdfRecord[]
) => {
  if (!results.length) return;

  const students = groupResultsByStudent(results);

  if (!students.length) return;

  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4",
  });

  students.forEach((student, index) => {
    if (index > 0) {
      doc.addPage();
    }

    drawStudentMarksheet(doc, student);
  });

  doc.save("REMON-Academy-All-Students-Marksheets.pdf");
};

export const getResultStudentGroups = (
  results: ResultPdfRecord[]
) => groupResultsByStudent(results);
