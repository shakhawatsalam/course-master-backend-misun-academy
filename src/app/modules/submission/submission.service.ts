/* eslint-disable @typescript-eslint/no-explicit-any */

import httpStatus from "http-status";
import { IGenericResponse } from "../../../interfaces/common";
import { ISubmission } from "./submission.interface";
import { Submission } from "./submission.model";
import { IPaginationOptions } from "../../../interfaces/pagination";
import { paginationHelpers } from "../../../helpers/paginationHelper";

import { submissionSearchableFields } from "./submission.constant";
import ApiError from "../../../errors/Apierror";

/**
 * Create Submission
 */
const createSubmission = async (
  data: Partial<ISubmission>
): Promise<ISubmission> => {
  const result = await Submission.create(data);

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Unable to create submission");
  }

  return result;
};

/**
 * Get All Submissions (with search, filter, pagination)
 */
const getAllSubmissions = async (
  filters: any,
  options: IPaginationOptions
): Promise<IGenericResponse<ISubmission[]>> => {
  const { searchTerm, ...filterData } = filters;

  const { limit, skip, page } = paginationHelpers.calculatePagination(options);

  const andConditions = [];

  // Search Term
  if (searchTerm) {
    andConditions.push({
      $or: submissionSearchableFields.map((field) => ({
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

  const result = await Submission.find(whereCondition)
    .populate("assignment_id")
    .populate("student_id")
    .populate("graded_by")
    .sort(
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : { createdAt: -1 }
    )
    .skip(skip)
    .limit(limit);

  const total = await Submission.countDocuments(whereCondition);

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
 * Get Submission by ID
 */
const getSubmissionById = async (id: string): Promise<ISubmission | null> => {
  const result = await Submission.findById(id)
    .populate("assignment_id")
    .populate("student_id")
    .populate("graded_by");

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Submission not found");
  }

  return result;
};

/**
 * Update Submission (grading / status / feedback)
 */
const updateSubmission = async (
  id: string,
  payload: Partial<ISubmission>
): Promise<ISubmission | null> => {
  const result = await Submission.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Unable to update submission");
  }

  return result;
};

/**
 * Delete Submission
 */
const deleteSubmission = async (id: string): Promise<ISubmission | null> => {
  const result = await Submission.findByIdAndDelete(id);

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Unable to delete submission");
  }

  return result;
};

export const SubmissionService = {
  createSubmission,
  getAllSubmissions,
  getSubmissionById,
  updateSubmission,
  deleteSubmission,
};
