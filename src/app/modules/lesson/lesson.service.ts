import httpStatus from "http-status";
import { IGenericResponse } from "../../../interfaces/common";
import { ILesson } from "./lesson.interface";
import { Lesson } from "./lesson.model";
import { IPaginationOptions } from "../../../interfaces/pagination";
import { paginationHelpers } from "../../../helpers/paginationHelper";
import ApiError from "../../../errors/Apierror";
import { lessonSearchableFields } from "./lesson.constant";
import { SortOrder } from "mongoose";

/**
 * Create Lesson
 */
const createLesson = async (data: Partial<ILesson>): Promise<ILesson> => {
  // Check if lesson with same order exists in the module
  const existingLesson = await Lesson.findOne({
    module_id: data.module_id,
    order: data.order,
  });

  if (existingLesson) {
    // Shift all lessons with order >= new order by 1
    await Lesson.updateMany(
      {
        module_id: data.module_id,
        order: { $gte: data.order },
        _id: { $ne: existingLesson._id },
      },
      { $inc: { order: 1 } }
    );
  }

  const result = await Lesson.create(data);

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Unable to create lesson");
  }

  return result;
};

/**
 * Get All Lessons with search + filter + pagination
 */
const getAllLessons = async (
  filters: any,
  options: IPaginationOptions
): Promise<IGenericResponse<ILesson[]>> => {
  const { searchTerm, ...filterData } = filters;

  const { limit, skip, page } = paginationHelpers.calculatePagination(options);

  const andConditions = [];

  // Search Term
  if (searchTerm) {
    andConditions.push({
      $or: lessonSearchableFields.map((field) => ({
        [field]: { $regex: searchTerm, $options: "i" },
      })),
    });
  }

  // Filter fields
  if (Object.keys(filterData).length > 0) {
    const filterConditions = Object.entries(filterData).map(([key, value]) => {
      // Handle special cases for number filters
      if (key === "duration_minutes" && typeof value === "string") {
        return { [key]: parseInt(value, 10) };
      }
      // Handle boolean filters
      if (key === "is_free_preview") {
        return { [key]: value === "true" || value === true };
      }
      return { [key]: value };
    });
    andConditions.push({ $and: filterConditions });
  }

  const whereCondition =
    andConditions.length > 0 ? { $and: andConditions } : {};

  // Default sort by order if no sort options provided
  const sortConditions: { [key: string]: SortOrder } = {};
  if (options.sortBy && options.sortOrder) {
    sortConditions[options.sortBy] = options.sortOrder;
  } else {
    // Default sort: by module_id and then by order
    sortConditions.module_id = 1;
    sortConditions.order = 1;
  }

  // Query
  const result = await Lesson.find(whereCondition)
    .sort(sortConditions)
    .skip(skip)
    .limit(limit)
    .populate("module_id");

  const total = await Lesson.countDocuments(whereCondition);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

/**
 * Get Lessons by Module ID
 */
const getLessonsByModule = async (
  moduleId: string,
  options: IPaginationOptions
): Promise<IGenericResponse<ILesson[]>> => {
  const { limit, skip, page } = paginationHelpers.calculatePagination(options);

  // Query lessons for specific module, sorted by order
  const result = await Lesson.find({ module_id: moduleId })
    .sort({ order: 1 })
    .skip(skip)
    .limit(limit)
    .populate("module_id");

  const total = await Lesson.countDocuments({ module_id: moduleId });

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

/**
 * Get Lesson by ID
 */
const getLessonById = async (id: string): Promise<ILesson | null> => {
  const result = await Lesson.findById(id).populate("module_id");

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Lesson not found");
  }

  return result;
};

/**
 * Update Lesson
 */
const updateLesson = async (
  id: string,
  payload: Partial<ILesson>
): Promise<ILesson | null> => {
  const lesson = await Lesson.findById(id);

  if (!lesson) {
    throw new ApiError(httpStatus.NOT_FOUND, "Lesson not found");
  }

  // If order is being updated, handle reordering
  if (payload.order && payload.order !== lesson.order) {
    const moduleId = payload.module_id || lesson.module_id;

    if (payload.order > lesson.order) {
      // Moving lesson down (increasing order)
      await Lesson.updateMany(
        {
          module_id: moduleId,
          order: { $gt: lesson.order, $lte: payload.order },
          _id: { $ne: id },
        },
        { $inc: { order: -1 } }
      );
    } else {
      // Moving lesson up (decreasing order)
      await Lesson.updateMany(
        {
          module_id: moduleId,
          order: { $gte: payload.order, $lt: lesson.order },
          _id: { $ne: id },
        },
        { $inc: { order: 1 } }
      );
    }
  }

  const result = await Lesson.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Unable to update lesson");
  }

  return result;
};

/**
 * Update Lesson Order (specialized for order updates only)
 */
const updateLessonOrder = async (
  id: string,
  newOrder: number
): Promise<ILesson | null> => {
  const lesson = await Lesson.findById(id);

  if (!lesson) {
    throw new ApiError(httpStatus.NOT_FOUND, "Lesson not found");
  }

  if (newOrder < 1) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Order must be at least 1");
  }

  const moduleId = lesson.module_id;

  if (newOrder > lesson.order) {
    // Moving lesson down (increasing order)
    await Lesson.updateMany(
      {
        module_id: moduleId,
        order: { $gt: lesson.order, $lte: newOrder },
        _id: { $ne: id },
      },
      { $inc: { order: -1 } }
    );
  } else if (newOrder < lesson.order) {
    // Moving lesson up (decreasing order)
    await Lesson.updateMany(
      {
        module_id: moduleId,
        order: { $gte: newOrder, $lt: lesson.order },
        _id: { $ne: id },
      },
      { $inc: { order: 1 } }
    );
  }

  const result = await Lesson.findByIdAndUpdate(
    id,
    { order: newOrder },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Unable to update lesson order");
  }

  return result;
};

/**
 * Delete Lesson
 */
const deleteLesson = async (id: string): Promise<ILesson | null> => {
  const lesson = await Lesson.findById(id);

  if (!lesson) {
    throw new ApiError(httpStatus.NOT_FOUND, "Lesson not found");
  }

  // Decrement order of subsequent lessons in the same module
  await Lesson.updateMany(
    {
      module_id: lesson.module_id,
      order: { $gt: lesson.order },
    },
    { $inc: { order: -1 } }
  );

  const result = await Lesson.findByIdAndDelete(id);

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Unable to delete lesson");
  }

  return result;
};

export const LessonService = {
  createLesson,
  getAllLessons,
  getLessonsByModule,
  getLessonById,
  updateLesson,
  updateLessonOrder,
  deleteLesson,
};
