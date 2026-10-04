import { Request, Response } from "express";
import { Student } from "../models/Student";
import { User } from "../models/User";
import { asyncHandler } from "../utils/asyncHandler";
import { success } from "../utils/apiResponse";
import { ApiError } from "../utils/ApiError";
import {
  hashPassword,
  generateUniqueStudentId,
} from "../services/auth.service";

export const listStudents = asyncHandler(
  async (req: Request, res: Response) => {
    const page = Math.max(
      1,
      Number(req.query.page) || 1
    );

    const limit = Math.min(
      100,
      Math.max(1, Number(req.query.limit) || 10)
    );

    const search =
      (req.query.search as string) || "";

    const status =
      req.query.status as string | undefined;

    const course =
      req.query.course as string | undefined;

    const filter: Record<string, unknown> = {};

    if (search) {
      filter.$or = [
        {
          fullName: {
            $regex: search,
            $options: "i",
          },
        },
        {
          studentId: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    if (status) {
      filter.isActive = status === "active";
    }

    // Support both old single-course data
    // and new multiple-course data.
    if (course) {
      filter.$or = [
        {
          course: course,
        },
        {
          courses: course,
        },
      ];
    }

    const [data, total] = await Promise.all([
      Student.find(filter)
        .populate(
          "user",
          "email isActive"
        )
        .populate(
          "course",
          "title"
        )
        .populate(
          "courses",
          "title fee schedule"
        )
        .sort("-createdAt")
        .skip((page - 1) * limit)
        .limit(limit),

      Student.countDocuments(filter),
    ]);

    return success(res, {
      data,
      total,
      page,
      limit,
      totalPages:
        Math.ceil(total / limit) || 1,
    });
  }
);

export const getStudent = asyncHandler(
  async (req: Request, res: Response) => {
    const student = await Student.findById(
      req.params.id
    )
      .populate(
        "user",
        "email isActive"
      )
      .populate(
        "course",
        "title fee schedule"
      )
      .populate(
        "courses",
        "title fee schedule"
      );

    if (!student) {
      throw new ApiError(
        404,
        "Student not found"
      );
    }

    return success(res, student);
  }
);

// Admin creates a student directly.
export const createStudent = asyncHandler(
  async (req: Request, res: Response) => {
    const {
      fullName,
      email,
      phone,
      password,
      dateOfBirth,
      gender,
      address,
      class: className,
      group,
      course,
      courses,
    } = req.body;

    const existing = await User.findOne({
      email: email.toLowerCase(),
    });

    if (existing) {
      throw new ApiError(
        409,
        "An account with this email already exists"
      );
    }

    const passwordHash =
      await hashPassword(
        password || "Student123!"
      );

    const user = await User.create({
      email: email.toLowerCase(),
      passwordHash,
      role: "STUDENT",
    });

    const studentId =
      await generateUniqueStudentId();

    // New multiple-course support.
    const selectedCourses: string[] =
      Array.isArray(courses)
        ? courses.filter(Boolean)
        : course
          ? [course]
          : [];

    const student =
      await Student.create({
        user: user._id,
        studentId,
        fullName,
        phone,
        dateOfBirth,
        gender,
        address,
        class: className,
        group,

        // Keep old field for compatibility.
        course:
          selectedCourses[0] ||
          undefined,

        // New field.
        courses:
          selectedCourses,
      });

    return success(
      res,
      student,
      "Student created successfully",
      201
    );
  }
);

export const updateStudent = asyncHandler(
  async (req: Request, res: Response) => {
    const allowed = [
      "fullName",
      "phone",
      "address",
      "class",
      "group",
      "course",
      "courses",
      "profilePhoto",
    ];

    const updates: Record<
      string,
      unknown
    > = {};

    for (const key of allowed) {
      if (key in req.body) {
        updates[key] = req.body[key];
      }
    }

    // If Admin sends multiple courses,
    // keep the first course in the old field
    // for backward compatibility.
    if (Array.isArray(req.body.courses)) {
      const selectedCourses =
        req.body.courses.filter(Boolean);

      updates.courses = selectedCourses;

      updates.course =
        selectedCourses[0] || undefined;
    }

    // If old frontend/API sends only "course",
    // convert it into the new courses array.
    if (
      !Array.isArray(req.body.courses) &&
      "course" in req.body
    ) {
      updates.courses = req.body.course
        ? [req.body.course]
        : [];
    }

    const student =
      await Student.findByIdAndUpdate(
        req.params.id,
        updates,
        {
          new: true,
          runValidators: true,
        }
      )
        .populate(
          "course",
          "title fee schedule"
        )
        .populate(
          "courses",
          "title fee schedule"
        );

    if (!student) {
      throw new ApiError(
        404,
        "Student not found"
      );
    }

    return success(
      res,
      student,
      "Student updated successfully"
    );
  }
);

export const deleteStudent = asyncHandler(
  async (req: Request, res: Response) => {
    const student =
      await Student.findByIdAndDelete(
        req.params.id
      );

    if (!student) {
      throw new ApiError(
        404,
        "Student not found"
      );
    }

    await User.findByIdAndDelete(
      student.user
    );

    return success(
      res,
      {},
      "Student deleted successfully"
    );
  }
);

export const toggleStudentActive =
  asyncHandler(
    async (req: Request, res: Response) => {
      const student =
        await Student.findById(
          req.params.id
        );

      if (!student) {
        throw new ApiError(
          404,
          "Student not found"
        );
      }

      student.isActive =
        !student.isActive;

      await student.save();

      await User.findByIdAndUpdate(
        student.user,
        {
          isActive:
            student.isActive,
        }
      );

      return success(
        res,
        student,
        `Student ${
          student.isActive
            ? "activated"
            : "deactivated"
        }`
      );
    }
  );

export const resetStudentPassword =
  asyncHandler(
    async (req: Request, res: Response) => {
      const { newPassword } =
        req.body;

      if (
        !newPassword ||
        newPassword.length < 8
      ) {
        throw new ApiError(
          422,
          "New password must be at least 8 characters"
        );
      }

      const student =
        await Student.findById(
          req.params.id
        );

      if (!student) {
        throw new ApiError(
          404,
          "Student not found"
        );
      }

      const passwordHash =
        await hashPassword(
          newPassword
        );

      await User.findByIdAndUpdate(
        student.user,
        {
          passwordHash,
        }
      );

      return success(
        res,
        {},
        "Student password reset successfully"
      );
    }
  );

// Student can view their own profile.
// Course changes are NOT allowed here.
export const getMyProfile =
  asyncHandler(
    async (req: Request, res: Response) => {
      const student =
        await Student.findOne({
          user: req.auth!.userId,
        })
          .populate(
            "course",
            "title fee schedule"
          )
          .populate(
            "courses",
            "title fee schedule"
          );

      if (!student) {
        throw new ApiError(
          404,
          "Student profile not found"
        );
      }

      return success(
        res,
        student
      );
    }
  );

// Student can only update these fields.
// Courses are intentionally excluded.
export const updateMyProfile =
  asyncHandler(
    async (req: Request, res: Response) => {
      const allowed = [
        "phone",
        "address",
        "profilePhoto",
      ];

      const updates: Record<
        string,
        unknown
      > = {};

      for (const key of allowed) {
        if (key in req.body) {
          updates[key] =
            req.body[key];
        }
      }

      const student =
        await Student.findOneAndUpdate(
          {
            user:
              req.auth!.userId,
          },
          updates,
          {
            new: true,
            runValidators: true,
          }
        )
          .populate(
            "course",
            "title fee schedule"
          )
          .populate(
            "courses",
            "title fee schedule"
          );

      if (!student) {
        throw new ApiError(
          404,
          "Student profile not found"
        );
      }

      return success(
        res,
        student,
        "Profile updated successfully"
      );
    }
  );

export const changeMyPassword =
  asyncHandler(
    async (req: Request, res: Response) => {
      const {
        currentPassword,
        newPassword,
      } = req.body;

      if (
        !newPassword ||
        newPassword.length < 8
      ) {
        throw new ApiError(
          422,
          "New password must be at least 8 characters"
        );
      }

      const user =
        await User.findById(
          req.auth!.userId
        ).select("+passwordHash");

      if (!user) {
        throw new ApiError(
          404,
          "User not found"
        );
      }

      const isMatch =
        await user.comparePassword(
          currentPassword
        );

      if (!isMatch) {
        throw new ApiError(
          401,
          "Current password is incorrect"
        );
      }

      user.passwordHash =
        await hashPassword(
          newPassword
        );

      await user.save();

      return success(
        res,
        {},
        "Password changed successfully"
      );
    }
  );