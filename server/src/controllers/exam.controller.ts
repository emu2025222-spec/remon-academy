
import { Request, Response } from "express";
import mongoose from "mongoose";

import { Exam } from "../models/Exam";
import { ExamAttempt } from "../models/ExamAttempt";
import { Student } from "../models/Student";
import { Course } from "../models/Course";
import { User } from "../models/User";

import { ApiError } from "../utils/ApiError";
import { success } from "../utils/apiResponse";
import { asyncHandler } from "../utils/asyncHandler";

// ==========================================
// HELPERS
// ==========================================

async function getActiveStudent(userId: string) {
  const student = await Student.findOne({
    user: userId,
    isActive: true,
  });

  if (!student) {
    throw new ApiError(403, "Active student profile not found");
  }

  const user = await User.findById(userId);

  if (!user || !user.isActive || user.role !== "STUDENT") {
    throw new ApiError(403, "Student account is inactive");
  }

  return student;
}

function hasCourseAccess(student: any, courseId: string) {
  const enrolledCourses = [
    ...(student.courses || []),
    ...(student.course ? [student.course] : []),
  ].map((id: any) => String(id));

  return enrolledCourses.includes(String(courseId));
}

function getSafeExam(exam: any) {
  const data = exam.toObject();

  data.questions = data.questions.map((question: any) => ({
    _id: question._id,
    question: question.question,
    options: question.options,
    marks: question.marks,
    negativeMarks: question.negativeMarks,
  }));

  return data;
}

/**
 * Calculate result using ONLY the answers saved in MongoDB.
 * Never trust answers submitted directly in the submit request.
 */
async function gradeAndSubmitAttempt(attempt: any, exam: any) {
  if (attempt.status === "SUBMITTED") {
    return attempt;
  }

  const answerMap = new Map<string, number>();

  for (const answer of attempt.answers || []) {
    answerMap.set(
      String(answer.questionId),
      Number(answer.selectedAnswer)
    );
  }

  let obtainedMarks = 0;
  let correctCount = 0;
  let wrongCount = 0;
  let unansweredCount = 0;

  const finalAnswers: any[] = [];

  for (const question of exam.questions as any[]) {
    const selectedAnswer = answerMap.get(String(question._id));

    if (
      selectedAnswer === undefined ||
      !Number.isInteger(selectedAnswer)
    ) {
      unansweredCount++;
      continue;
    }

    if (
      selectedAnswer < 0 ||
      selectedAnswer >= question.options.length
    ) {
      unansweredCount++;
      continue;
    }

    finalAnswers.push({
      questionId: question._id,
      selectedAnswer,
    });

    if (selectedAnswer === question.correctAnswer) {
      obtainedMarks += Number(question.marks || 0);
      correctCount++;
    } else {
      wrongCount++;

      if (exam.negativeMarking) {
        obtainedMarks -= Number(question.negativeMarks || 0);
      }
    }
  }

  obtainedMarks = Math.max(
    0,
    Math.round(obtainedMarks * 100) / 100
  );

  // Persist the final result.
  attempt.answers = finalAnswers;
  attempt.obtainedMarks = obtainedMarks;
  attempt.totalMarks = exam.totalMarks;
  attempt.correctCount = correctCount;
  attempt.wrongCount = wrongCount;
  attempt.unansweredCount = unansweredCount;
  attempt.submittedAt = new Date();
  attempt.status = "SUBMITTED";

  await attempt.save();

  return attempt;
}

/**
 * Automatically finalize an expired attempt when it is accessed.
 *
 * A background scheduler is still needed for unattended,
 * exact-time automatic submission.
 */
async function submitIfExpired(attempt: any) {
  if (!attempt || attempt.status !== "IN_PROGRESS") {
    return attempt;
  }

  const exam = await Exam.findById(attempt.exam);

  if (!exam) {
    return attempt;
  }

  const now = new Date();

  const expired =
    now >= new Date(attempt.expiresAt) ||
    now >= new Date(exam.endTime);

  if (!expired) {
    return attempt;
  }

  return gradeAndSubmitAttempt(attempt, exam);
}

// ==========================================
// ADMIN: CREATE EXAM
// ==========================================

export const createExam = asyncHandler(
  async (req: Request, res: Response) => {
    const {
      title,
      description,
      course,
      subject,
      startTime,
      endTime,
      duration,
      totalMarks,
      passMarks,
      negativeMarking,
      questions,
    } = req.body;

    if (
      !title ||
      !course ||
      !subject ||
      !startTime ||
      !endTime ||
      !duration ||
      !totalMarks ||
      !Array.isArray(questions) ||
      questions.length === 0
    ) {
      throw new ApiError(400, "Please provide all required exam information");
    }

    if (!mongoose.isValidObjectId(course)) {
      throw new ApiError(400, "Invalid course ID");
    }

    const courseExists = await Course.findById(course);

    if (!courseExists) {
      throw new ApiError(404, "Course not found");
    }

    const exam = await Exam.create({
      title,
      description,
      course,
      subject,
      startTime,
      endTime,
      duration,
      totalMarks,
      passMarks: passMarks ?? 0,
      negativeMarking: negativeMarking ?? false,
      questions,
      isPublished: false,
    });

    return success(res, exam, "Exam created successfully", 201);
  }
);

// ==========================================
// ADMIN: LIST EXAMS
// ==========================================

export const listExams = asyncHandler(
  async (_req: Request, res: Response) => {
    const exams = await Exam.find()
      .populate("course", "title classLevel subject")
      .sort({ createdAt: -1 });

    return success(res, exams, "Exams retrieved successfully");
  }
);

// ==========================================
// ADMIN: GET SINGLE EXAM
// ==========================================

export const getExam = asyncHandler(
  async (req: Request, res: Response) => {
    const exam = await Exam.findById(req.params.id)
      .populate("course", "title classLevel subject");

    if (!exam) {
      throw new ApiError(404, "Exam not found");
    }

    return success(res, exam, "Exam retrieved successfully");
  }
);

// ==========================================
// ADMIN: UPDATE EXAM
// ==========================================

export const updateExam = asyncHandler(
  async (req: Request, res: Response) => {
    const exam = await Exam.findById(req.params.id);

    if (!exam) {
      throw new ApiError(404, "Exam not found");
    }

    const attemptExists = await ExamAttempt.exists({
      exam: exam._id,
    });

    if (attemptExists) {
      throw new ApiError(
        409,
        "This exam already has attempts and cannot be edited"
      );
    }

    const allowedFields = [
      "title",
      "description",
      "course",
      "subject",
      "startTime",
      "endTime",
      "duration",
      "totalMarks",
      "passMarks",
      "negativeMarking",
      "questions",
    ];

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        (exam as any)[field] = req.body[field];
      }
    }

    if (
      exam.course &&
      !mongoose.isValidObjectId(String(exam.course))
    ) {
      throw new ApiError(400, "Invalid course ID");
    }

    await exam.save();

    return success(res, exam, "Exam updated successfully");
  }
);

// ==========================================
// ADMIN: DELETE EXAM
// ==========================================

export const deleteExam = asyncHandler(
  async (req: Request, res: Response) => {
    const exam = await Exam.findById(req.params.id);

    if (!exam) {
      throw new ApiError(404, "Exam not found");
    }

    const attemptExists = await ExamAttempt.exists({
      exam: exam._id,
    });

    if (attemptExists) {
      throw new ApiError(
        409,
        "Cannot delete an exam that already has attempts"
      );
    }

    await exam.deleteOne();

    return success(res, {}, "Exam deleted successfully");
  }
);

// ==========================================
// ADMIN: PUBLISH / UNPUBLISH
// ==========================================

export const toggleExamPublish = asyncHandler(
  async (req: Request, res: Response) => {
    const exam = await Exam.findById(req.params.id);

    if (!exam) {
      throw new ApiError(404, "Exam not found");
    }

    exam.isPublished = !exam.isPublished;

    await exam.save();

    return success(
      res,
      exam,
      exam.isPublished ? "Exam published" : "Exam unpublished"
    );
  }
);

// ==========================================
// STUDENT: LIST AVAILABLE EXAMS
// ==========================================

export const listMyExams = asyncHandler(
  async (req: Request, res: Response) => {
    const student = await getActiveStudent(req.auth!.userId);

    const enrolledCourses = [
      ...(student.courses || []),
      ...(student.course ? [student.course] : []),
    ];

    const exams = await Exam.find({
      course: { $in: enrolledCourses },
      isPublished: true,
    })
      .populate("course", "title classLevel subject")
      .select("-questions.correctAnswer")
      .sort({ startTime: -1 });

    const attempts = await ExamAttempt.find({
      student: student._id,
    }).select("exam status obtainedMarks totalMarks expiresAt");

    // Finalize expired attempts when the student next accesses exams.
    for (const attempt of attempts) {
      if (attempt.status === "IN_PROGRESS") {
        await submitIfExpired(attempt);
      }
    }

    // Reload attempts because some may have just been submitted.
    const updatedAttempts = await ExamAttempt.find({
      student: student._id,
    }).select("exam status obtainedMarks totalMarks");

    const attemptMap = new Map(
      updatedAttempts.map((attempt: any) => [
        String(attempt.exam),
        attempt,
      ])
    );

    const result = exams.map((exam: any) => {
      const attempt = attemptMap.get(String(exam._id));

      return {
        ...exam.toObject(),
        attempt: attempt || null,
      };
    });

    return success(res, result, "Available exams retrieved");
  }
);

// ==========================================
// STUDENT: GET EXAM DETAILS
// ==========================================

export const getStudentExam = asyncHandler(
  async (req: Request, res: Response) => {
    const student = await getActiveStudent(req.auth!.userId);

    const exam = await Exam.findOne({
      _id: req.params.id,
      isPublished: true,
    }).select("-questions.correctAnswer");

    if (!exam) {
      throw new ApiError(404, "Exam not found");
    }

    if (!hasCourseAccess(student, String(exam.course))) {
      throw new ApiError(403, "You are not enrolled in this course");
    }

    let attempt: any = await ExamAttempt.findOne({
      exam: exam._id,
      student: student._id,
    });

    if (attempt) {
      attempt = await submitIfExpired(attempt);
    }

    if (attempt?.status === "SUBMITTED") {
      throw new ApiError(409, "You have already submitted this exam");
    }

    return success(
      res,
      {
        exam: getSafeExam(exam),
        attempt,
      },
      "Exam details retrieved"
    );
  }
);

// ==========================================
// STUDENT: START EXAM
// ==========================================

export const startExam = asyncHandler(
  async (req: Request, res: Response) => {
    const student = await getActiveStudent(req.auth!.userId);

    const exam = await Exam.findOne({
      _id: req.params.id,
      isPublished: true,
    });

    if (!exam) {
      throw new ApiError(404, "Exam not found");
    }

    if (!hasCourseAccess(student, String(exam.course))) {
      throw new ApiError(403, "You are not enrolled in this course");
    }

    const now = new Date();

    if (now < exam.startTime) {
      throw new ApiError(400, "Exam has not started yet");
    }

    if (now >= exam.endTime) {
      throw new ApiError(400, "Exam time has ended");
    }

    let existing: any = await ExamAttempt.findOne({
      exam: exam._id,
      student: student._id,
    });

    if (existing) {
      existing = await submitIfExpired(existing);

      if (existing.status === "SUBMITTED") {
        throw new ApiError(409, "You have already submitted this exam");
      }

      return success(
        res,
        {
          attempt: existing,
          exam: getSafeExam(exam),
        },
        "Existing exam attempt restored"
      );
    }

    const durationEnd = new Date(
      now.getTime() + exam.duration * 60 * 1000
    );

    const expiresAt = new Date(
      Math.min(durationEnd.getTime(), exam.endTime.getTime())
    );

    let attempt;

    try {
      attempt = await ExamAttempt.create({
        exam: exam._id,
        student: student._id,
        answers: [],
        startedAt: now,
        expiresAt,
        totalMarks: exam.totalMarks,
        status: "IN_PROGRESS",
      });
    } catch (error: any) {
      if (error.code === 11000) {
        throw new ApiError(409, "Exam attempt already exists");
      }

      throw error;
    }

    return success(
      res,
      {
        attempt,
        exam: getSafeExam(exam),
      },
      "Exam started successfully",
      201
    );
  }
);

// ==========================================
// STUDENT: SAVE ANSWERS
// ==========================================

export const saveExamAnswers = asyncHandler(
  async (req: Request, res: Response) => {
    const student = await getActiveStudent(req.auth!.userId);

    const { answers } = req.body;

    if (!Array.isArray(answers)) {
      throw new ApiError(400, "Answers must be an array");
    }

    const attempt: any = await ExamAttempt.findOne({
      _id: req.params.attemptId,
      student: student._id,
      status: "IN_PROGRESS",
    });

    if (!attempt) {
      throw new ApiError(404, "Active exam attempt not found");
    }

    const exam = await Exam.findById(attempt.exam);

    if (!exam) {
      throw new ApiError(404, "Exam not found");
    }

    const now = new Date();

    if (
      now >= new Date(attempt.expiresAt) ||
      now >= new Date(exam.endTime)
    ) {
      await gradeAndSubmitAttempt(attempt, exam);
      throw new ApiError(400, "Exam time expired. Your saved answers were submitted.");
    }

    const questionMap = new Map(
      exam.questions.map((question: any) => [
        String(question._id),
        question,
      ])
    );

    const validatedAnswers = [];

    for (const answer of answers) {
      if (
        !answer ||
        !mongoose.isValidObjectId(String(answer.questionId))
      ) {
        throw new ApiError(400, "Invalid question ID");
      }

      const question = questionMap.get(String(answer.questionId)) as any;

      if (!question) {
        throw new ApiError(400, "Invalid question ID");
      }

      if (
        !Number.isInteger(answer.selectedAnswer) ||
        answer.selectedAnswer < 0 ||
        answer.selectedAnswer >= question.options.length
      ) {
        throw new ApiError(400, "Invalid selected option");
      }

      validatedAnswers.push({
        questionId: question._id,
        selectedAnswer: answer.selectedAnswer,
      });
    }

    const uniqueIds = new Set(
      validatedAnswers.map((answer) => String(answer.questionId))
    );

    if (uniqueIds.size !== validatedAnswers.length) {
      throw new ApiError(400, "Duplicate question answers are not allowed");
    }

    attempt.answers = validatedAnswers as any;

    await attempt.save();

    return success(res, attempt, "Answers saved successfully");
  }
);

// ==========================================
// STUDENT: SUBMIT EXAM
// ==========================================

export const submitExam = asyncHandler(
  async (req: Request, res: Response) => {
    const student = await getActiveStudent(req.auth!.userId);

    const attempt: any = await ExamAttempt.findOne({
      _id: req.params.attemptId,
      student: student._id,
    });

    if (!attempt) {
      throw new ApiError(404, "Exam attempt not found");
    }

    if (attempt.status === "SUBMITTED") {
      return success(res, attempt, "Exam was already submitted");
    }

    const exam = await Exam.findById(attempt.exam);

    if (!exam) {
      throw new ApiError(404, "Exam not found");
    }

    // Ignore req.body.answers completely.
    // Only answers already saved in the database are graded.
    await gradeAndSubmitAttempt(attempt, exam);

    return success(
      res,
      {
        attemptId: attempt._id,
        obtainedMarks: attempt.obtainedMarks,
        totalMarks: exam.totalMarks,
        percentage: Number(
          ((attempt.obtainedMarks / exam.totalMarks) * 100).toFixed(2)
        ),
        passed: attempt.obtainedMarks >= exam.passMarks,
        correctCount: attempt.correctCount,
        wrongCount: attempt.wrongCount,
        unansweredCount: attempt.unansweredCount,
        submittedAt: attempt.submittedAt,
      },
      "Exam submitted successfully"
    );
  }
);

// ==========================================
// STUDENT: RESULT AND ANSWER REVIEW
// ==========================================

export const getExamReview = asyncHandler(
  async (req: Request, res: Response) => {
    const student = await getActiveStudent(req.auth!.userId);

    let attempt: any = await ExamAttempt.findOne({
      exam: req.params.id,
      student: student._id,
    });

    if (!attempt) {
      throw new ApiError(404, "Exam attempt not found");
    }

    if (attempt.status === "IN_PROGRESS") {
      attempt = await submitIfExpired(attempt);
    }

    if (attempt.status !== "SUBMITTED") {
      throw new ApiError(409, "Exam has not been submitted yet");
    }

    const exam = await Exam.findById(attempt.exam);

    if (!exam) {
      throw new ApiError(404, "Exam not found");
    }

    const answerMap = new Map(
      attempt.answers.map((answer: any) => [
        String(answer.questionId),
        answer.selectedAnswer,
      ])
    );

    const questions = exam.questions.map((question: any) => {
      const selectedAnswer = answerMap.get(String(question._id));

      return {
        questionId: String(question._id),
        question: question.question,
        options: question.options,
        marks: question.marks,
        negativeMarks: question.negativeMarks,
        selectedAnswer:
          selectedAnswer === undefined ? null : selectedAnswer,
        correctAnswer: question.correctAnswer,
        isCorrect: selectedAnswer === question.correctAnswer,
      };
    });

    // Response shape matches client/src/pages/student/Exams.tsx
    return success(
      res,
      {
        exam: {
          title: exam.title,
          subject: exam.subject,
          totalMarks: exam.totalMarks,
          passMarks: exam.passMarks,
        },
        obtainedMarks: attempt.obtainedMarks,
        totalMarks: attempt.totalMarks,
        percentage: Number(
          ((attempt.obtainedMarks / attempt.totalMarks) * 100).toFixed(2)
        ),
        passed: attempt.obtainedMarks >= exam.passMarks,
        correctCount: attempt.correctCount,
        wrongCount: attempt.wrongCount,
        unansweredCount: attempt.unansweredCount,
        submittedAt: attempt.submittedAt,
        questions,
      },
      "Exam review retrieved successfully"
    );
  }
);

// ==========================================
// ADMIN: VIEW EXAM RESULTS
// ==========================================

export const getExamResults = asyncHandler(
  async (req: Request, res: Response) => {
    const exam = await Exam.findById(req.params.id);

    if (!exam) {
      throw new ApiError(404, "Exam not found");
    }

    const attempts = await ExamAttempt.find({
      exam: exam._id,
      status: "SUBMITTED",
    })
      .populate("student", "studentId fullName phone")
      .sort({ obtainedMarks: -1 });

    return success(
      res,
      {
        exam: {
          title: exam.title,
          totalMarks: exam.totalMarks,
          passMarks: exam.passMarks,
        },
        results: attempts,
      },
      "Exam results retrieved successfully"
    );
  }
);

// ==========================================
// BACKGROUND: AUTO-SUBMIT EXPIRED EXAMS
// ==========================================

let processingExpiredExams = false;

export async function processExpiredExamAttempts() {
  // Prevent overlapping runs in the same server process.
  if (processingExpiredExams) return;

  processingExpiredExams = true;

  try {
    const now = new Date();

    const expiredAttempts = await ExamAttempt.find({
      status: "IN_PROGRESS",
      expiresAt: { $lte: now },
    });

    for (const attempt of expiredAttempts) {
      try {
        const exam = await Exam.findById(attempt.exam);

        if (!exam) {
          console.error(
            `[EXAM SCHEDULER] Exam not found for attempt ${attempt._id}`
          );
          continue;
        }

        if (attempt.status === "IN_PROGRESS") {
          await gradeAndSubmitAttempt(attempt, exam);

          console.log(
            `[EXAM SCHEDULER] Auto-submitted attempt ${attempt._id}`
          );
        }
      } catch (error) {
        console.error(
          `[EXAM SCHEDULER] Failed to submit attempt ${attempt._id}:`,
          error
        );
      }
    }
  } catch (error) {
    console.error("[EXAM SCHEDULER] Processing error:", error);
  } finally {
    processingExpiredExams = false;
  }
}