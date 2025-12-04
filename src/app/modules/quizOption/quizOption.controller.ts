import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import pick from "../../../shared/pick";
import { QuizOptionService } from "./quizOption.service";
import { quizOptionFilterableFields } from "./quizOption.constant";

/**
 * Create Quiz Option
 */
const createQuizOption = catchAsync(async (req: Request, res: Response) => {
  const result = await QuizOptionService.createQuizOption(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Quiz option created successfully",
    data: result,
  });
});

/**
 * Get All Quiz Options
 */
const getAllQuizOptions = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, quizOptionFilterableFields);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);

  const result = await QuizOptionService.getAllQuizOptions(filters, options);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Quiz options fetched successfully",
    meta: result.meta,
    data: result.data,
  });
});

/**
 * Get Quiz Option By ID
 */
const getQuizOptionById = catchAsync(async (req: Request, res: Response) => {
  const result = await QuizOptionService.getQuizOptionById(req.params.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Quiz option fetched successfully",
    data: result,
  });
});

/**
 * Update Quiz Option
 */
const updateQuizOption = catchAsync(async (req: Request, res: Response) => {
  const result = await QuizOptionService.updateQuizOption(
    req.params.id,
    req.body
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Quiz option updated successfully",
    data: result,
  });
});

/**
 * Delete Quiz Option
 */
const deleteQuizOption = catchAsync(async (req: Request, res: Response) => {
  const result = await QuizOptionService.deleteQuizOption(req.params.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Quiz option deleted successfully",
    data: result,
  });
});

export const QuizOptionController = {
  createQuizOption,
  getAllQuizOptions,
  getQuizOptionById,
  updateQuizOption,
  deleteQuizOption,
};
