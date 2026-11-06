import { Request, Response } from "express";
import mongoose from "mongoose";

import { ResultPublication } from "../models/ResultPublication";
import { Result } from "../models/Result";
import { Student } from "../models/Student";

import { ApiError } from "../utils/ApiError";
import { success } from "../utils/apiResponse";
import { asyncHandler } from "../utils/asyncHandler";

// ==========================================
// HELPERS
// ==========================================

function normalizeExamName(value: unknown): string {
  return String(value || "").trim().replace(/\s+/g, " ");
}

function isReleased(publication: any, now = new Date()) {
  return (
    publication &&
    publication.status === "SCHEDULED" &&
    new Date(publication.publishAt).getTime() <= now.getTime()
  );
}

// ==========================================
// ADMIN: LIST PUBLICATION SCHEDULES
// ==========================================

export const listResultPublications = asyncHandler(
  async (_req: Request, res: Response) => {
    const publications = await ResultPublication.find()
      .sort({ publishAt: -1 });

    const now = new Date();

    const data = publications.map((item) => ({
      ...item.toObject(),
      isReleased: isReleased(item, now),
    }));

    return success(
      res,
      data,
      "Result publication schedules retrieved"
    );
  }
);

// ==========================================
// ADMIN: CREATE SCHEDULE
// ==========================================

export const createResultPublication = asyncHandler(
  async (req: Request, res: Response) => {
    const examName = normalizeExamName(req.body.examName);
    const publishAt = new Date(req.body.publishAt);

    if (!examName || !req.body.publishAt) {
      throw new ApiError(
        400,
        "Exam name and publication date are required"
      );
    }

    if (Number.isNaN(publishAt.getTime())) {
      throw new ApiError(400, "Invalid publication date");
    }

    const resultExists = await Result.exists({ examName });

    if (!resultExists) {
      throw new ApiError(
        404,
        "No results found for this exam name"
      );
    }

    const existing = await ResultPublication.findOne({ examName });

    if (existing) {
      throw new ApiError(
        409,
        "A publication schedule already exists for this exam"
      );
    }

    const publication = await ResultPublication.create({
      examName,
      publishAt,
      status: "SCHEDULED",
    });

    return success(
      res,
      {
        ...publication.toObject(),
        isReleased: isReleased(publication),
      },
      "Publication schedule created",
      201
    );
  }
);

// ==========================================
// ADMIN: UPDATE SCHEDULE
// ==========================================

export const updateResultPublication = asyncHandler(
  async (req: Request, res: Response) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
      throw new ApiError(400, "Invalid schedule ID");
    }

    const publication = await ResultPublication.findById(req.params.id);

    if (!publication) {
      throw new ApiError(404, "Publication schedule not found");
    }

    if (req.body.publishAt !== undefined) {
      const publishAt = new Date(req.body.publishAt);

      if (Number.isNaN(publishAt.getTime())) {
        throw new ApiError(400, "Invalid publication date");
      }

      publication.publishAt = publishAt;
    }

    if (req.body.status !== undefined) {
      if (!["SCHEDULED", "CANCELLED"].includes(req.body.status)) {
        throw new ApiError(400, "Invalid publication status");
      }

      publication.status = req.body.status;
    }

    await publication.save();

    return success(
      res,
      {
        ...publication.toObject(),
        isReleased: isReleased(publication),
      },
      "Publication schedule updated"
    );
  }
);

// ==========================================
// ADMIN: CANCEL / RE-ENABLE SCHEDULE
// ==========================================

export const toggleResultPublication = asyncHandler(
  async (req: Request, res: Response) => {
    const publication = await ResultPublication.findById(req.params.id);

    if (!publication) {
      throw new ApiError(404, "Publication schedule not found");
    }

    publication.status =
      publication.status === "SCHEDULED"
        ? "CANCELLED"
        : "SCHEDULED";

    await publication.save();

    return success(
      res,
      {
        ...publication.toObject(),
        isReleased: isReleased(publication),
      },
      publication.status === "SCHEDULED"
        ? "Publication schedule enabled"
        : "Publication schedule cancelled"
    );
  }
);

// ==========================================
// ADMIN: DELETE SCHEDULE
// ==========================================

export const deleteResultPublication = asyncHandler(
  async (req: Request, res: Response) => {
    const publication = await ResultPublication.findById(req.params.id);

    if (!publication) {
      throw new ApiError(404, "Publication schedule not found");
    }

    await publication.deleteOne();

    return success(
      res,
      {},
      "Publication schedule deleted"
    );
  }
);

// ==========================================
// PUBLIC: GET PUBLICATION STATUS
// ==========================================

export const getPublicResultPublicationStatus = asyncHandler(
  async (_req: Request, res: Response) => {
    const now = new Date();

    const publications = await ResultPublication.find({
      status: "SCHEDULED",
    })
      .select("examName publishAt status")
      .sort({ publishAt: 1 });

    const data = publications.map((item) => ({
      examName: item.examName,
      publishAt: item.publishAt,
      isReleased: isReleased(item, now),
    }));

    return success(
      res,
      {
        serverTime: now,
        publications: data,
      },
      "Publication status retrieved"
    );
  }
);

// ==========================================
// PUBLIC: SEARCH RESULT BY ROLL NUMBER
// ==========================================

export const publicSearchResult = asyncHandler(
  async (req: Request, res: Response) => {
    const studentId = String(req.body.studentId || "").trim();
    const examName = normalizeExamName(req.body.examName);

    if (!studentId) {
      throw new ApiError(400, "Roll number is required");
    }

    if (!examName) {
      throw new ApiError(400, "Exam name is required");
    }

    const publication = await ResultPublication.findOne({
      examName,
      status: "SCHEDULED",
      publishAt: { $lte: new Date() },
    });

    if (!publication) {
      throw new ApiError(
        403,
        "This result has not been published yet"
      );
    }

    const student = await Student.findOne({
      studentId,
      isActive: true,
    }).select("studentId fullName class group");

    if (!student) {
      throw new ApiError(404, "No result found for this roll number");
    }

    const results = await Result.find({
      student: student._id,
      examName: publication.examName,
    })
      .populate("course", "title classLevel subject")
      .select("-__v");

    if (!results.length) {
      throw new ApiError(404, "No result found for this examination");
    }

    const totalMarks = results.reduce(
      (sum, item) => sum + Number(item.totalMarks || 0),
      0
    );

    const obtainedMarks = results.reduce(
      (sum, item) => sum + Number(item.obtainedMarks || 0),
      0
    );

    const averageGpa =
      results.reduce(
        (sum, item) => sum + Number(item.gpa || 0),
        0
      ) / results.length;

    return success(
      res,
      {
        student,
        examName: publication.examName,
        results,
        summary: {
          totalSubjects: results.length,
          totalMarks,
          obtainedMarks,
          averageGpa: Number(averageGpa.toFixed(2)),
        },
      },
      "Result retrieved successfully"
    );
  }
);