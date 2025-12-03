/* eslint-disable @typescript-eslint/no-explicit-any */

import httpStatus from "http-status";
import { IGenericResponse } from "../../../interfaces/common";
import { ICourse } from "./course.interface";
import { Course } from "./course.model";
import { courseSearchableFields } from "./course.constant";
import { IPaginationOptions } from "../../../interfaces/pagination";
import { paginationHelpers } from "../../../helpers/paginationHelper";
import ApiError from "../../../errors/Apierror";

/**
 * Create Course
 */
const createCourse = async (data: Partial<ICourse>): Promise<ICourse> => {
  const result = await Course.create(data);

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Unable to create course");
  }

  return result;
};

/**
 * Get All Courses with search + filter + pagination
 */
const getAllCourses = async (
  filters: any,
  options: IPaginationOptions
): Promise<IGenericResponse<ICourse[]>> => {
  const { searchTerm, ...filterData } = filters;

  const { limit, skip, page } = paginationHelpers.calculatePagination(options);

  const andConditions = [];

  // Search Term
  if (searchTerm) {
    andConditions.push({
      $or: courseSearchableFields.map((field) => ({
        [field]: { $regex: searchTerm, $options: "i" },
      })),
    });
  }

  // Filtering Fields
  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      $and: Object.entries(filterData).map(([key, value]) => ({
        [key]: value,
      })),
    });
  }

  const whereCondition =
    andConditions.length > 0 ? { $and: andConditions } : {};

  // Query
  const result = await Course.find(whereCondition)
    .sort(
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : { createdAt: -1 }
    )
    .skip(skip)
    .limit(limit)
    .populate("category_id")
    .populate("instructor_id");

  const total = await Course.countDocuments(whereCondition);

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
 * Get Course by ID
 */
const getCourseById = async (id: string): Promise<ICourse | null> => {
  const result = await Course.findById(id)
    .populate("modules")
    .populate("reviews")
    .populate("category_id")
    .populate("instructor_id");

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Course not found");
  }

  return result;
};

/**
 * Update Course
 */
const updateCourse = async (
  id: string,
  payload: Partial<ICourse>
): Promise<ICourse | null> => {
  const result = await Course.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Unable to update course");
  }

  return result;
};

/**
 * Delete Course
 */
const deleteCourse = async (id: string): Promise<ICourse | null> => {
  const result = await Course.findByIdAndDelete(id);

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Unable to delete course");
  }

  return result;
};

export const CourseService = {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
};
