import { Request, Response } from "express";
import mongoose, { Types } from "mongoose";

import { Fee } from "../models/Fee";
import { Student } from "../models/Student";
import { Course } from "../models/Course";

import { makeCrudControllers } from "../utils/crudFactory";
import { asyncHandler } from "../utils/asyncHandler";
import { success } from "../utils/apiResponse";
import { ApiError } from "../utils/ApiError";

const base = makeCrudControllers(Fee, {
  populate: ["student", "course"],
});

/* =========================================================
   HELPERS
========================================================= */

function normalizeAmount(
  value: unknown,
  fieldName: string
): number {
  const amount = Number(value);

  if (!Number.isFinite(amount) || amount < 0) {
    throw new ApiError(
      400,
      `${fieldName} must be a valid non-negative number`
    );
  }

  return amount;
}

function validateBillingMonth(
  value: unknown
): string | undefined {
  if (
    value === undefined ||
    value === null ||
    value === ""
  ) {
    return undefined;
  }

  const billingMonth = String(value).trim();

  if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(billingMonth)) {
    throw new ApiError(
      400,
      "billingMonth must be in YYYY-MM format"
    );
  }

  return billingMonth;
}

function calculateStatus(
  amount: number,
  amountPaid: number
): "PAID" | "PENDING" | "PARTIAL" {
  if (amountPaid <= 0) {
    return "PENDING";
  }

  if (amountPaid >= amount) {
    return "PAID";
  }

  return "PARTIAL";
}

/**
 * Get all courses assigned to a student.
 *
 * Supports:
 * - old `course`
 * - new `courses[]`
 */
function getStudentCourseIds(student: {
  course?: Types.ObjectId | string;
  courses?: (Types.ObjectId | string)[];
}): string[] {
  const ids = new Set<string>();

  if (
    student.courses &&
    Array.isArray(student.courses)
  ) {
    for (const course of student.courses) {
      if (course) {
        ids.add(String(course));
      }
    }
  }

  if (student.course) {
    ids.add(String(student.course));
  }

  return Array.from(ids);
}

/**
 * Validate that a course belongs to a student.
 */
async function validateStudentCourse(
  studentId: string,
  courseId: string
) {
  if (!mongoose.Types.ObjectId.isValid(studentId)) {
    throw new ApiError(
      400,
      "Invalid student ID"
    );
  }

  if (!mongoose.Types.ObjectId.isValid(courseId)) {
    throw new ApiError(
      400,
      "Invalid course ID"
    );
  }

  const student = await Student.findById(
    studentId
  ).select(
    "fullName studentId class course courses"
  );

  if (!student) {
    throw new ApiError(
      404,
      "Student not found"
    );
  }

  const assignedCourseIds =
    getStudentCourseIds(student);

  if (
    !assignedCourseIds.includes(
      String(courseId)
    )
  ) {
    throw new ApiError(
      400,
      `The selected course is not assigned to student ${student.fullName}. Please select one of the student's assigned courses.`
    );
  }

  const course = await Course.findById(
    courseId
  ).select(
    "title subject classLevel"
  );

  if (!course) {
    throw new ApiError(
      404,
      "Course not found"
    );
  }

  return {
    student,
    course,
  };
}

/**
 * Safely convert Mongo populated course
 * into summary information.
 */
function getCourseInfo(fee: any) {
  const populatedCourse =
    fee.course &&
    typeof fee.course === "object"
      ? fee.course
      : null;

  const courseId = populatedCourse?._id
    ? String(populatedCourse._id)
    : String(fee.course || "");

  const courseName =
    populatedCourse?.title ||
    "Unknown Course";

  const subject =
    populatedCourse?.subject || "";

  return {
    courseId,
    courseName,
    subject,
  };
}

/* =========================================================
   LIST / GET
========================================================= */

export const listFees = base.list;

export const getFee = base.getOne;

/* =========================================================
   CREATE FEE
========================================================= */

export const createFee = asyncHandler(
  async (req: Request, res: Response) => {
    const {
      student,
      course,
      billingMonth,
      amount,
      amountPaid,
      dueDate,
      paymentDate,
      paymentMethod,
      transactionId,
      note,
    } = req.body;

    if (!student) {
      throw new ApiError(
        400,
        "Student is required"
      );
    }

    if (!course) {
      throw new ApiError(
        400,
        "Course is required"
      );
    }

    if (!dueDate) {
      throw new ApiError(
        400,
        "Due date is required"
      );
    }

    if (
      !mongoose.Types.ObjectId.isValid(
        String(student)
      )
    ) {
      throw new ApiError(
        400,
        "Invalid student ID"
      );
    }

    if (
      !mongoose.Types.ObjectId.isValid(
        String(course)
      )
    ) {
      throw new ApiError(
        400,
        "Invalid course ID"
      );
    }

    const normalizedBillingMonth =
      validateBillingMonth(
        billingMonth
      );

    const normalizedAmount =
      normalizeAmount(
        amount,
        "amount"
      );

    const normalizedAmountPaid =
      normalizeAmount(
        amountPaid ?? 0,
        "amountPaid"
      );

    if (
      normalizedAmountPaid >
      normalizedAmount
    ) {
      throw new ApiError(
        400,
        "amountPaid cannot be greater than amount"
      );
    }

    /* ---------------------------------------------
       Validate student + course relationship
    --------------------------------------------- */

    await validateStudentCourse(
      String(student),
      String(course)
    );

    /* ---------------------------------------------
       Prevent duplicate monthly fee
    --------------------------------------------- */

    if (normalizedBillingMonth) {
      const existingFee =
        await Fee.findOne({
          student,
          course,
          billingMonth:
            normalizedBillingMonth,
        });

      if (existingFee) {
        throw new ApiError(
          409,
          "A fee record already exists for this student, course and billing month"
        );
      }
    }

    const parsedDueDate =
      new Date(dueDate);

    if (
      Number.isNaN(
        parsedDueDate.getTime()
      )
    ) {
      throw new ApiError(
        400,
        "Invalid due date"
      );
    }

    let parsedPaymentDate:
      | Date
      | undefined;

    if (paymentDate) {
      parsedPaymentDate =
        new Date(paymentDate);

      if (
        Number.isNaN(
          parsedPaymentDate.getTime()
        )
      ) {
        throw new ApiError(
          400,
          "Invalid payment date"
        );
      }
    }

    const fee = await Fee.create({
      student,
      course,
      billingMonth:
        normalizedBillingMonth,
      amount: normalizedAmount,
      amountPaid:
        normalizedAmountPaid,
      dueDate: parsedDueDate,
      status: calculateStatus(
        normalizedAmount,
        normalizedAmountPaid
      ),
      paymentDate:
        parsedPaymentDate,
      paymentMethod,
      transactionId,
      note,
    });

    const populatedFee =
      await Fee.findById(fee._id)
        .populate("student")
        .populate("course");

    return success(
      res,
      populatedFee,
      "Fee created successfully",
      201
    );
  }
);

/* =========================================================
   UPDATE FEE
========================================================= */

export const updateFee = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    if (
      !mongoose.Types.ObjectId.isValid(id)
    ) {
      throw new ApiError(
        400,
        "Invalid fee ID"
      );
    }

    const existingFee =
      await Fee.findById(id);

    if (!existingFee) {
      throw new ApiError(
        404,
        "Fee not found"
      );
    }

    const {
      student,
      course,
      billingMonth,
      amount,
      amountPaid,
      dueDate,
      paymentDate,
      paymentMethod,
      transactionId,
      note,
    } = req.body;

    /* ---------------------------------------------
       Determine final student/course
    --------------------------------------------- */

    const finalStudentId = student
      ? String(student)
      : String(existingFee.student);

    const finalCourseId = course
      ? String(course)
      : String(existingFee.course);

    /* ---------------------------------------------
       Always validate student + course
    --------------------------------------------- */

    await validateStudentCourse(
      finalStudentId,
      finalCourseId
    );

    /* ---------------------------------------------
       Billing month
    --------------------------------------------- */

    let finalBillingMonth:
      | string
      | undefined;

    if (billingMonth !== undefined) {
      finalBillingMonth =
        validateBillingMonth(
          billingMonth
        );
    } else {
      finalBillingMonth =
        existingFee.billingMonth;
    }

    /* ---------------------------------------------
       Amount
    --------------------------------------------- */

    const finalAmount =
      amount !== undefined
        ? normalizeAmount(
            amount,
            "amount"
          )
        : Number(existingFee.amount);

    const finalAmountPaid =
      amountPaid !== undefined
        ? normalizeAmount(
            amountPaid,
            "amountPaid"
          )
        : Number(
            existingFee.amountPaid
          );

    if (
      finalAmountPaid >
      finalAmount
    ) {
      throw new ApiError(
        400,
        "amountPaid cannot be greater than amount"
      );
    }

    /* ---------------------------------------------
       Duplicate monthly fee check
    --------------------------------------------- */

    if (finalBillingMonth) {
      const duplicate =
        await Fee.findOne({
          _id: { $ne: id },
          student: finalStudentId,
          course: finalCourseId,
          billingMonth:
            finalBillingMonth,
        });

      if (duplicate) {
        throw new ApiError(
          409,
          "Another fee record already exists for this student, course and billing month"
        );
      }
    }

    /* ---------------------------------------------
       Build update object
    --------------------------------------------- */

    const updateData: Record<
      string,
      unknown
    > = {
      student: finalStudentId,
      course: finalCourseId,
      billingMonth:
        finalBillingMonth,
      amount: finalAmount,
      amountPaid:
        finalAmountPaid,
      status: calculateStatus(
        finalAmount,
        finalAmountPaid
      ),
    };

    /* ---------------------------------------------
       Due date
    --------------------------------------------- */

    if (dueDate !== undefined) {
      const parsedDueDate =
        new Date(dueDate);

      if (
        Number.isNaN(
          parsedDueDate.getTime()
        )
      ) {
        throw new ApiError(
          400,
          "Invalid due date"
        );
      }

      updateData.dueDate =
        parsedDueDate;
    }

    /* ---------------------------------------------
       Payment date
    --------------------------------------------- */

    if (
      paymentDate !== undefined
    ) {
      if (!paymentDate) {
        updateData.paymentDate =
          undefined;
      } else {
        const parsedPaymentDate =
          new Date(paymentDate);

        if (
          Number.isNaN(
            parsedPaymentDate.getTime()
          )
        ) {
          throw new ApiError(
            400,
            "Invalid payment date"
          );
        }

        updateData.paymentDate =
          parsedPaymentDate;
      }
    }

    /* ---------------------------------------------
       Other fields
    --------------------------------------------- */

    if (
      paymentMethod !== undefined
    ) {
      updateData.paymentMethod =
        paymentMethod;
    }

    if (
      transactionId !== undefined
    ) {
      updateData.transactionId =
        transactionId;
    }

    if (note !== undefined) {
      updateData.note = note;
    }

    /* ---------------------------------------------
       Update
    --------------------------------------------- */

    const updatedFee =
      await Fee.findByIdAndUpdate(
        id,
        updateData,
        {
          new: true,
          runValidators: true,
        }
      )
        .populate("student")
        .populate("course");

    return success(
      res,
      updatedFee,
      "Fee updated successfully"
    );
  }
);

/* =========================================================
   DELETE
========================================================= */

export const deleteFee = base.remove;

/* =========================================================
   ADMIN FEE SUMMARY
========================================================= */

export const summaryFees = asyncHandler(
  async (_req: Request, res: Response) => {
    const fees = await Fee.find()
      .populate("student")
      .populate("course")
      .sort({
        billingMonth: 1,
        createdAt: 1,
      });

    let totalAmount = 0;
    let totalPaid = 0;
    let totalDue = 0;

    const monthlyMap = new Map<
      string,
      {
        month: string;
        amount: number;
        paid: number;
        due: number;
        count: number;
      }
    >();

    const courseMap = new Map<
      string,
      {
        courseId: string;
        courseName: string;
        subject: string;
        amount: number;
        paid: number;
        due: number;
        count: number;
      }
    >();

    for (const fee of fees) {
      const amount = Number(
        fee.amount || 0
      );

      const paid = Number(
        fee.amountPaid || 0
      );

      const due = Math.max(
        amount - paid,
        0
      );

      totalAmount += amount;
      totalPaid += paid;
      totalDue += due;

      /* ---------------------------------------------
         Monthly summary
      --------------------------------------------- */

      const month =
        fee.billingMonth ||
        "Legacy";

      const existingMonth =
        monthlyMap.get(month);

      if (existingMonth) {
        existingMonth.amount +=
          amount;

        existingMonth.paid +=
          paid;

        existingMonth.due +=
          due;

        existingMonth.count += 1;
      } else {
        monthlyMap.set(month, {
          month,
          amount,
          paid,
          due,
          count: 1,
        });
      }

      /* ---------------------------------------------
         Course summary
      --------------------------------------------- */

      const {
        courseId,
        courseName,
        subject,
      } = getCourseInfo(fee);

      const existingCourse =
        courseMap.get(courseId);

      if (existingCourse) {
        existingCourse.amount +=
          amount;

        existingCourse.paid +=
          paid;

        existingCourse.due +=
          due;

        existingCourse.count +=
          1;
      } else {
        courseMap.set(courseId, {
          courseId,
          courseName,
          subject,
          amount,
          paid,
          due,
          count: 1,
        });
      }
    }

    return success(res, {
      totals: {
        amount: totalAmount,
        paid: totalPaid,
        due: totalDue,
        count: fees.length,
      },

      monthly: Array.from(
        monthlyMap.values()
      ).sort((a, b) =>
        a.month.localeCompare(
          b.month
        )
      ),

      courseWise: Array.from(
        courseMap.values()
      ).sort((a, b) =>
        a.courseName.localeCompare(
          b.courseName
        )
      ),
    });
  }
);

/* =========================================================
   STUDENT OWN FEES
========================================================= */

export const myFees = asyncHandler(
  async (req: Request, res: Response) => {
    const studentId =
      req.params.studentDocId;

    if (!studentId) {
      throw new ApiError(
        400,
        "Student ID is required"
      );
    }

    if (
      !mongoose.Types.ObjectId.isValid(
        studentId
      )
    ) {
      throw new ApiError(
        400,
        "Invalid student ID"
      );
    }

    const fees = await Fee.find({
      student: studentId,
    })
      .populate("course")
      .sort({
        billingMonth: 1,
        createdAt: 1,
      });

    let totalAmount = 0;
    let totalPaid = 0;
    let totalDue = 0;

    const monthlyMap = new Map<
      string,
      {
        month: string;
        amount: number;
        paid: number;
        due: number;
        count: number;
      }
    >();

    const courseMap = new Map<
      string,
      {
        courseId: string;
        courseName: string;
        subject: string;
        amount: number;
        paid: number;
        due: number;
        count: number;
      }
    >();

    for (const fee of fees) {
      const amount = Number(
        fee.amount || 0
      );

      const paid = Number(
        fee.amountPaid || 0
      );

      const due = Math.max(
        amount - paid,
        0
      );

      /* ---------------------------------------------
         Overall totals
      --------------------------------------------- */

      totalAmount += amount;
      totalPaid += paid;
      totalDue += due;

      /* ---------------------------------------------
         Monthly summary
      --------------------------------------------- */

      const month =
        fee.billingMonth ||
        "Legacy";

      const existingMonth =
        monthlyMap.get(month);

      if (existingMonth) {
        existingMonth.amount +=
          amount;

        existingMonth.paid +=
          paid;

        existingMonth.due +=
          due;

        existingMonth.count += 1;
      } else {
        monthlyMap.set(month, {
          month,
          amount,
          paid,
          due,
          count: 1,
        });
      }

      /* ---------------------------------------------
         Course summary
      --------------------------------------------- */

      const {
        courseId,
        courseName,
        subject,
      } = getCourseInfo(fee);

      const existingCourse =
        courseMap.get(courseId);

      if (existingCourse) {
        existingCourse.amount +=
          amount;

        existingCourse.paid +=
          paid;

        existingCourse.due +=
          due;

        existingCourse.count +=
          1;
      } else {
        courseMap.set(courseId, {
          courseId,
          courseName,
          subject,
          amount,
          paid,
          due,
          count: 1,
        });
      }
    }

    /* ---------------------------------------------
       Return student fee data
    --------------------------------------------- */

    return success(res, {
      totals: {
        amount: totalAmount,
        paid: totalPaid,
        due: totalDue,
        count: fees.length,
      },

      monthly: Array.from(
        monthlyMap.values()
      ).sort((a, b) =>
        a.month.localeCompare(
          b.month
        )
      ),

      courseWise: Array.from(
        courseMap.values()
      ).sort((a, b) =>
        a.courseName.localeCompare(
          b.courseName
        )
      ),

      fees,
    });
  }
);