import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { QuizAttemptService } from "./quizAttempt.service";

const createQuizAttempt = catchAsync(async (req: Request, res: Response) => {
  const result = await QuizAttemptService.createQuizAttempt(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Quiz attempt created successfully",
    data: result,
  });
});

const getAllQuizAttempts = catchAsync(async (req: Request, res: Response) => {
  const result = await QuizAttemptService.getAllQuizAttempts(
    req.query,
    req.query
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Quiz attempts retrieved successfully",
    data: result,
  });
});

const getQuizAttemptById = catchAsync(async (req: Request, res: Response) => {
  const result = await QuizAttemptService.getQuizAttemptById(req.params.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Quiz attempt retrieved successfully",
    data: result,
  });
});

const deleteQuizAttempt = catchAsync(async (req: Request, res: Response) => {
  const result = await QuizAttemptService.deleteQuizAttempt(req.params.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Quiz attempt deleted successfully",
    data: result,
  });
});

export const QuizAttemptController = {
  createQuizAttempt,
  getAllQuizAttempts,
  getQuizAttemptById,
  deleteQuizAttempt,
};
