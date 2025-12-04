/* eslint-disable @typescript-eslint/no-explicit-any */

import httpStatus from "http-status";
import { IGenericResponse } from "../../../interfaces/common";
import { IQuiz } from "./quiz.interface";
import { Quiz } from "./quiz.model";

import { IPaginationOptions } from "../../../interfaces/pagination";
import { paginationHelpers } from "../../../helpers/paginationHelper";
import ApiError from "../../../errors/Apierror";
import { quizSearchableFields } from "./quiz.constant";

/**
 * Create Quiz
 */
const createQuiz = async (data: Partial<IQuiz>): Promise<IQuiz> => {
  const result = await Quiz.create(data);

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Unable to create quiz");
  }

  return result;
};

/**
 * Get All Quizzes (search + filter + pagination)
 */
const getAllQuizzes = async (
  filters: any,
  options: IPaginationOptions
): Promise<IGenericResponse<IQuiz[]>> => {
  const { searchTerm, ...filterData } = filters;

  const { limit, skip, page } = paginationHelpers.calculatePagination(options);

  const andConditions = [];

  // Search Term
  if (searchTerm) {
    andConditions.push({
      $or: quizSearchableFields.map((field) => ({
        [field]: { $regex: searchTerm, $options: "i" },
      })),
    });
  }

  // Filter Fields
  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      $and: Object.entries(filterData).map(([key, value]) => ({
        [key]: value,
      })),
    });
  }

  const whereCondition =
    andConditions.length > 0 ? { $and: andConditions } : {};

  // Query execution
  const result = await Quiz.find(whereCondition)
    .sort(
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : { createdAt: -1 }
    )
    .skip(skip)
    .limit(limit)
    .populate("lesson_id")
    .populate("questions");

  const total = await Quiz.countDocuments(whereCondition);

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
 * Get Quiz by ID
 */
const getQuizById = async (id: string): Promise<IQuiz | null> => {
  const result = await Quiz.findById(id)
    .populate("lesson_id")
    .populate("questions");

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Quiz not found");
  }

  return result;
};

/**
 * Update Quiz
 */
const updateQuiz = async (
  id: string,
  payload: Partial<IQuiz>
): Promise<IQuiz | null> => {
  const result = await Quiz.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Unable to update quiz");
  }

  return result;
};

/**
 * Delete Quiz
 */
const deleteQuiz = async (id: string): Promise<IQuiz | null> => {
  const result = await Quiz.findByIdAndDelete(id);

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Unable to delete quiz");
  }

  return result;
};

export const QuizService = {
  createQuiz,
  getAllQuizzes,
  getQuizById,
  updateQuiz,
  deleteQuiz,
};
