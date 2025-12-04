/* eslint-disable @typescript-eslint/no-explicit-any */

import httpStatus from "http-status";
import ApiError from "../../../errors/Apierror";

import { IGenericResponse } from "../../../interfaces/common";
import { IPaginationOptions } from "../../../interfaces/pagination";

import { paginationHelpers } from "../../../helpers/paginationHelper";
import { quizOptionSearchableFields } from "./quizOption.constant";

import { IQuizOption } from "./quizOption.interface";
import { QuizOption } from "./quizOption.model";

/**
 * Create Quiz Option
 */
const createQuizOption = async (
  data: Partial<IQuizOption>
): Promise<IQuizOption> => {
  const result = await QuizOption.create(data);

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Unable to create quiz option");
  }

  return result;
};

/**
 * Get All Quiz Options
 */
const getAllQuizOptions = async (
  filters: any,
  options: IPaginationOptions
): Promise<IGenericResponse<IQuizOption[]>> => {
  const { searchTerm, ...filterData } = filters;

  const { limit, skip, page } = paginationHelpers.calculatePagination(options);

  const andConditions = [];

  // Search
  if (searchTerm) {
    andConditions.push({
      $or: quizOptionSearchableFields.map((field) => ({
        [field]: { $regex: searchTerm, $options: "i" },
      })),
    });
  }

  // Filter
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
  const result = await QuizOption.find(whereCondition)
    .sort(
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : { createdAt: -1 }
    )
    .skip(skip)
    .limit(limit)
    .populate("question_id");

  const total = await QuizOption.countDocuments(whereCondition);

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
 * Get Quiz Option by ID
 */
const getQuizOptionById = async (id: string): Promise<IQuizOption | null> => {
  const result = await QuizOption.findById(id).populate("question_id");

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Quiz option not found");
  }

  return result;
};

/**
 * Update Quiz Option
 */
const updateQuizOption = async (
  id: string,
  payload: Partial<IQuizOption>
): Promise<IQuizOption | null> => {
  const result = await QuizOption.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Unable to update quiz option");
  }

  return result;
};

/**
 * Delete Quiz Option
 */
const deleteQuizOption = async (id: string): Promise<IQuizOption | null> => {
  const result = await QuizOption.findByIdAndDelete(id);

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Unable to delete quiz option");
  }

  return result;
};

export const QuizOptionService = {
  createQuizOption,
  getAllQuizOptions,
  getQuizOptionById,
  updateQuizOption,
  deleteQuizOption,
};
