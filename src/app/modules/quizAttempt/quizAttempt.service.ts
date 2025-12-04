/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import { IGenericResponse } from "../../../interfaces/common";
import { IQuizAttempt } from "./quizAttempt.interface";
import { QuizAttempt } from "./quizAttempt.model";
import ApiError from "../../../errors/Apierror";
import { IPaginationOptions } from "../../../interfaces/pagination";
import { paginationHelpers } from "../../../helpers/paginationHelper";

/**
 * Create Quiz Attempt
 */
const createQuizAttempt = async (
  data: Partial<IQuizAttempt>
): Promise<IQuizAttempt> => {
  const result = await QuizAttempt.create(data);

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Unable to create quiz attempt");
  }

  return result;
};

/**
 * Get all quiz attempts (search + pagination)
 */
const getAllQuizAttempts = async (
  filters: any,
  options: IPaginationOptions
): Promise<IGenericResponse<IQuizAttempt[]>> => {
  const { searchTerm, ...filterData } = filters;

  const { limit, skip, page } = paginationHelpers.calculatePagination(options);

  const andConditions = [];

  // Search by score
  if (searchTerm) {
    andConditions.push({
      $or: [
        { score: { $regex: searchTerm, $options: "i" } },
        { passed: { $regex: searchTerm, $options: "i" } },
      ],
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

  const result = await QuizAttempt.find(whereCondition)
    .sort(
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : { createdAt: -1 }
    )
    .skip(skip)
    .limit(limit)
    .populate("quiz_id")
    .populate("student_id")
    .populate("answers.question_id")
    .populate("answers.selected_option_id");

  const total = await QuizAttempt.countDocuments(whereCondition);

  return {
    meta: { page, limit, total },
    data: result,
  };
};

/**
 * Get single quiz attempt
 */
const getQuizAttemptById = async (id: string): Promise<IQuizAttempt | null> => {
  const result = await QuizAttempt.findById(id)
    .populate("quiz_id")
    .populate("student_id")
    .populate("answers.question_id")
    .populate("answers.selected_option_id");

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Quiz attempt not found");
  }

  return result;
};

/**
 * Delete quiz attempt
 */
const deleteQuizAttempt = async (id: string): Promise<IQuizAttempt | null> => {
  const result = await QuizAttempt.findByIdAndDelete(id);

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Unable to delete quiz attempt");
  }

  return result;
};

export const QuizAttemptService = {
  createQuizAttempt,
  getAllQuizAttempts,
  getQuizAttemptById,
  deleteQuizAttempt,
};
