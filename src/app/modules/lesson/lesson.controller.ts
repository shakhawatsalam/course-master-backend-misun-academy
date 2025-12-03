import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import pick from "../../../shared/pick";
import { LessonService } from "./lesson.service";
import { lessonFilterableFields } from "./lesson.constant";

/**
 * Create Lesson
 */
const createLesson = catchAsync(async (req: Request, res: Response) => {
  const result = await LessonService.createLesson(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Lesson created successfully",
    data: result,
  });
});

/**
 * Get All Lessons
 */
const getAllLessons = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, lessonFilterableFields);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);

  const result = await LessonService.getAllLessons(filters, options);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Lessons fetched successfully",
    meta: result.meta,
    data: result.data,
  });
});

/**
 * Get Lessons by Module ID
 */
const getLessonsByModule = catchAsync(async (req: Request, res: Response) => {
  const { moduleId } = req.params;
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);

  const result = await LessonService.getLessonsByModule(moduleId, options);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Lessons by module fetched successfully",
    meta: result.meta,
    data: result.data,
  });
});

/**
 * Get Lesson by ID
 */
const getLessonById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await LessonService.getLessonById(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Lesson fetched successfully",
    data: result,
  });
});

/**
 * Update Lesson
 */
const updateLesson = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await LessonService.updateLesson(id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Lesson updated successfully",
    data: result,
  });
});

/**
 * Update Lesson Order
 */
const updateLessonOrder = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { order } = req.body;

  const result = await LessonService.updateLessonOrder(id, order);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Lesson order updated successfully",
    data: result,
  });
});

/**
 * Delete Lesson
 */
const deleteLesson = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await LessonService.deleteLesson(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Lesson deleted successfully",
    data: result,
  });
});

export const LessonController = {
  createLesson,
  getAllLessons,
  getLessonsByModule,
  getLessonById,
  updateLesson,
  updateLessonOrder,
  deleteLesson,
};
