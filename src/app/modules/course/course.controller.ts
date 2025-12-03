import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import pick from "../../../shared/pick";
import { CourseService } from "./course.service";
import { courseFilterableFields } from "./course.constant";

/**
 * Create Course
 */
const createCourse = catchAsync(async (req: Request, res: Response) => {
  const result = await CourseService.createCourse(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Course created successfully",
    data: result,
  });
});

/**
 * Get All Courses
 */
const getAllCourses = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, courseFilterableFields);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);

  const result = await CourseService.getAllCourses(filters, options);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Courses fetched successfully",
    meta: result.meta,
    data: result.data,
  });
});

/**
 * Get Course by ID
 */
const getCourseById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await CourseService.getCourseById(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Course fetched successfully",
    data: result,
  });
});

/**
 * Update Course
 */
const updateCourse = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await CourseService.updateCourse(id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Course updated successfully",
    data: result,
  });
});

/**
 * Delete Course
 */
const deleteCourse = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await CourseService.deleteCourse(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Course deleted successfully",
    data: result,
  });
});

export const CourseController = {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
};
