/* eslint-disable @typescript-eslint/no-explicit-any */

import httpStatus from "http-status";
import ApiError from "../../../errors/Apierror";

import { IGenericResponse } from "../../../interfaces/common";
import { IPaginationOptions } from "../../../interfaces/pagination";

import { paginationHelpers } from "../../../helpers/paginationHelper";
import { quizQuestionSearchableFields } from "./quizQuestion.constant";

import { IQuizQuestion } from "./quizQuestion.interface";
import { QuizQuestion } from "./quizQuestion.model";

/**
 * Create Quiz Question
 */
const createQuizQuestion = async (
  data: Partial<IQuizQuestion>
): Promise<IQuizQuestion> => {
  const result = await QuizQuestion.create(data);

  if (!result) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Unable to create quiz question"
    );
  }

  return result;
};

/**
 * Get All Quiz Questions (search + filter + pagination)
 */
const getAllQuizQuestions = async (
  filters: any,
  options: IPaginationOptions
): Promise<IGenericResponse<IQuizQuestion[]>> => {
  const { searchTerm, ...filterData } = filters;

  const { limit, skip, page } = paginationHelpers.calculatePagination(options);

  const andConditions = [];

  // Search term
  if (searchTerm) {
    andConditions.push({
      $or: quizQuestionSearchableFields.map((field) => ({
        [field]: { $regex: searchTerm, $options: "i" },
      })),
    });
  }

  // Filters
  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      $and: Object.entries(filterData).map(([key, value]) => ({
        [key]: value,
      })),
    });
  }

  const whereCondition =
    andConditions.length > 0 ? { $and: andConditions } : {};

  const result = await QuizQuestion.find(whereCondition)
    .sort(
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : { createdAt: -1 }
    )
    .skip(skip)
    .limit(limit)
    .populate("quiz_id")
    .populate("options");

  const total = await QuizQuestion.countDocuments(whereCondition);

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
 * Get Quiz Question by ID
 */
const getQuizQuestionById = async (
  id: string
): Promise<IQuizQuestion | null> => {
  const result = await QuizQuestion.findById(id)
    .populate("quiz_id")
    .populate("options");

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Quiz question not found");
  }

  return result;
};

/**
 * Update Quiz Question
 */
const updateQuizQuestion = async (
  id: string,
  payload: Partial<IQuizQuestion>
): Promise<IQuizQuestion | null> => {
  const result = await QuizQuestion.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  if (!result) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Unable to update quiz question"
    );
  }

  return result;
};

/**
 * Delete Quiz Question
 */
const deleteQuizQuestion = async (
  id: string
): Promise<IQuizQuestion | null> => {
  const result = await QuizQuestion.findByIdAndDelete(id);

  if (!result) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Unable to delete quiz question"
    );
  }

  return result;
};

export const QuizQuestionService = {
  createQuizQuestion,
  getAllQuizQuestions,
  getQuizQuestionById,
  updateQuizQuestion,
  deleteQuizQuestion,
};
