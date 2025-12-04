import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import pick from "../../../shared/pick";
import { AssignmentService } from "./assignment.service";
import { assignmentFilterableFields } from "./assignment.constant";

/**
 * Create Assignment
 */
const createAssignment = catchAsync(async (req: Request, res: Response) => {
  const result = await AssignmentService.createAssignment(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Assignment created successfully",
    data: result,
  });
});

/**
 * Get All Assignments
 */
const getAllAssignments = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, assignmentFilterableFields);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);

  const result = await AssignmentService.getAllAssignments(filters, options);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Assignments fetched successfully",
    meta: result.meta,
    data: result.data,
  });
});

/**
 * Get Assignment by ID
 */
const getAssignmentById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await AssignmentService.getAssignmentById(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Assignment fetched successfully",
    data: result,
  });
});

/**
 * Update Assignment
 */
const updateAssignment = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await AssignmentService.updateAssignment(id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Assignment updated successfully",
    data: result,
  });
});

/**
 * Delete Assignment
 */
const deleteAssignment = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await AssignmentService.deleteAssignment(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Assignment deleted successfully",
    data: result,
  });
});

export const AssignmentController = {
  createAssignment,
  getAllAssignments,
  getAssignmentById,
  updateAssignment,
  deleteAssignment,
};
