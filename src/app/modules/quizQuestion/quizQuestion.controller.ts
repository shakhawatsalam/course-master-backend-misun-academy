import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import pick from "../../../shared/pick";
import { QuizQuestionService } from "./quizQuestion.service";
import { quizQuestionFilterableFields } from "./quizQuestion.constant";

/**
 * Create Quiz Question
 */
const createQuizQuestion = catchAsync(async (req: Request, res: Response) => {
  const result = await QuizQuestionService.createQuizQuestion(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Quiz Question created successfully",
    data: result,
  });
});

/**
 * Get All Quiz Questions
 */
const getAllQuizQuestions = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, quizQuestionFilterableFields);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);

  const result = await QuizQuestionService.getAllQuizQuestions(
    filters,
    options
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Quiz Questions fetched successfully",
    meta: result.meta,
    data: result.data,
  });
});

/**
 * Get Quiz Question by ID
 */
const getQuizQuestionById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await QuizQuestionService.getQuizQuestionById(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Quiz Question fetched successfully",
    data: result,
  });
});

/**
 * Update Quiz Question
 */
const updateQuizQuestion = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await QuizQuestionService.updateQuizQuestion(id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Quiz Question updated successfully",
    data: result,
  });
});

/**
 * Delete Quiz Question
 */
const deleteQuizQuestion = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await QuizQuestionService.deleteQuizQuestion(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Quiz Question deleted successfully",
    data: result,
  });
});

export const QuizQuestionController = {
  createQuizQuestion,
  getAllQuizQuestions,
  getQuizQuestionById,
  updateQuizQuestion,
  deleteQuizQuestion,
};
