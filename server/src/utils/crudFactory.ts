import { Request, Response } from "express";
import { Model, FilterQuery, Query } from "mongoose";
import { asyncHandler } from "./asyncHandler";
import { success } from "./apiResponse";
import { ApiError } from "./ApiError";

interface CrudOptions {
  searchFields?: string[];
  populate?: string | string[];
  defaultSort?: string;
}

function applyPopulate<T>(
  query: Query<T, any>,
  populate?: string | string[]
): Query<T, any> {
  if (!populate) return query;

  return query.populate(populate);
}

export function makeCrudControllers<T>(
  model: Model<T>,
  options: CrudOptions = {}
) {
  const {
    searchFields = [],
    populate,
    defaultSort = "-createdAt",
  } = options;

  const list = asyncHandler(async (req: Request, res: Response) => {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 10));
    const search = (req.query.search as string) || "";

    const filter: FilterQuery<T> = {};

    if (search && searchFields.length) {
      (filter as Record<string, unknown>).$or = searchFields.map((f) => ({
        [f]: { $regex: search, $options: "i" },
      }));
    }

    // Allow simple exact-match filters passed as query params
    for (const [key, value] of Object.entries(req.query)) {
      if (["page", "limit", "search"].includes(key)) continue;
      if (value === undefined || value === "") continue;

      (filter as Record<string, unknown>)[key] = value;
    }

    const baseQuery = model
      .find(filter)
      .sort(defaultSort)
      .skip((page - 1) * limit)
      .limit(limit);

    const query = applyPopulate(baseQuery, populate);

    const [data, total] = await Promise.all([
      query.exec(),
      model.countDocuments(filter),
    ]);

    return success(res, {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    });
  });

  const getOne = asyncHandler(async (req: Request, res: Response) => {
    const query = applyPopulate(
      model.findById(req.params.id),
      populate
    );

    const doc = await query.exec();

    if (!doc) {
      throw new ApiError(404, "Record not found");
    }

    return success(res, doc);
  });

  const create = asyncHandler(async (req: Request, res: Response) => {
    const doc = await model.create(req.body);

    return success(
      res,
      doc,
      "Created successfully",
      201
    );
  });

  const update = asyncHandler(async (req: Request, res: Response) => {
    const doc = await model.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!doc) {
      throw new ApiError(404, "Record not found");
    }

    return success(
      res,
      doc,
      "Updated successfully"
    );
  });

  const remove = asyncHandler(async (req: Request, res: Response) => {
    const doc = await model.findByIdAndDelete(
      req.params.id
    );

    if (!doc) {
      throw new ApiError(404, "Record not found");
    }

    return success(
      res,
      {},
      "Deleted successfully"
    );
  });

  return {
    list,
    getOne,
    create,
    update,
    remove,
  };
}