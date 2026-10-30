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
    .filter((value) => Number.isFinite(value));

  const averageGpa = gpaValues.length
    ? gpaValues.reduce((sum, value) => sum + value, 0) /
      gpaValues.length
    : 0;

  const percentage =
    totalMarks > 0
      ? (obtainedMarks / totalMarks) * 100
      : 0;

  // Academy header
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

  // Student details
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

  // Summary cards
  const summaryY = 99;
  const cardGap = 4;
  const cardWidth = (pageWidth - 28 - cardGap * 2) / 3;

  const summaries = [
    {
      label: "TOTAL MARKS",
      value: String(totalMarks),
    },
    {
      label: "OBTAINED MARKS",
      value: String(obtainedMarks),
    },
    {
      label: "AVERAGE GPA",
      value: averageGpa.toFixed(2),
    },
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

  // Result table
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
    head: [
      [
        "Examination",
        "Subject",
        "Date",
        "Marks",
        "Grade",
        "GPA",
      ],
    ],
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

  // Overall percentage and footer
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

export const downloadStudentMarksheetPdf = (
  results: ResultPdfRecord[]
) => {
  if (!results.length) {
    return;
  }

  const students = groupResultsByStudent(results);

  if (!students.length) {
    return;
  }

  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4",
  });

  drawStudentMarksheet(doc, students[0]);

  doc.save(
    `REMON-Academy-Marksheet-${safeFileName(
      students[0].name
    )}.pdf`
  );
};

export const downloadAllStudentMarksheetsPdf = (
  results: ResultPdfRecord[]
) => {
  if (!results.length) {
    return;
  }

  const students = groupResultsByStudent(results);

  if (!students.length) {
    return;
  }

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