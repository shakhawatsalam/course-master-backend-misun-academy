import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import pick from "../../../shared/pick";
import { SubmissionService } from "./submission.service";
import { submissionFilterableFields } from "./submission.constant";

/**
 * Create Submission
 */
const createSubmission = catchAsync(async (req: Request, res: Response) => {
  const result = await SubmissionService.createSubmission(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Submission created successfully",
    data: result,
  });
});

/**
 * Get All Submissions
 */
const getAllSubmissions = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, submissionFilterableFields);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);

  const result = await SubmissionService.getAllSubmissions(filters, options);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Submissions retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
});

/**
 * Get Submission by ID
 */
const getSubmissionById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await SubmissionService.getSubmissionById(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Submission fetched successfully",
    data: result,
  });
});

/**
 * Update Submission (grading / feedback / status update)
 */
const updateSubmission = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await SubmissionService.updateSubmission(id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Submission updated successfully",
    data: result,
  });
});

/**
 * Delete Submission
 */
const deleteSubmission = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await SubmissionService.deleteSubmission(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Submission deleted successfully",
    data: result,
  });
});

export const SubmissionController = {
  createSubmission,
  getAllSubmissions,
  getSubmissionById,
  updateSubmission,
  deleteSubmission,
};
