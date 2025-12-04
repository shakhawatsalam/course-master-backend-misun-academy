import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import pick from "../../../shared/pick";
import { QuizService } from "./quiz.service";
import { quizFilterableFields } from "./quiz.constant";

/**
 * Create Quiz
 */
const createQuiz = catchAsync(async (req: Request, res: Response) => {
  const result = await QuizService.createQuiz(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Quiz created successfully",
    data: result,
  });
});

/**
 * Get All Quizzes
 */
const getAllQuizzes = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, quizFilterableFields);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);

  const result = await QuizService.getAllQuizzes(filters, options);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Quizzes fetched successfully",
    meta: result.meta,
    data: result.data,
  });
});

/**
 * Get Quiz by ID
 */
const getQuizById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await QuizService.getQuizById(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Quiz fetched successfully",
    data: result,
  });
});

/**
 * Update Quiz
 */
const updateQuiz = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await QuizService.updateQuiz(id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Quiz updated successfully",
    data: result,
  });
});

/**
 * Delete Quiz
 */
const deleteQuiz = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await QuizService.deleteQuiz(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Quiz deleted successfully",
    data: result,
  });
});

export const QuizController = {
  createQuiz,
  getAllQuizzes,
  getQuizById,
  updateQuiz,
  deleteQuiz,
};
