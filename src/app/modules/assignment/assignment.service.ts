/* eslint-disable @typescript-eslint/no-explicit-any */

import httpStatus from "http-status";
import ApiError from "../../../errors/Apierror";
import { IGenericResponse } from "../../../interfaces/common";
import { IPaginationOptions } from "../../../interfaces/pagination";
import { paginationHelpers } from "../../../helpers/paginationHelper";

import { IAssignment } from "./assignment.interface";
import { Assignment } from "./assignment.model";
import { assignmentSearchableFields } from "./assignment.constant";

/**
 * Create Assignment
 */
const createAssignment = async (
  data: Partial<IAssignment>
): Promise<IAssignment> => {
  const result = await Assignment.create(data);

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Unable to create assignment");
  }

  return result;
};

/**
 * Get All Assignments (search, filter, pagination)
 */
const getAllAssignments = async (
  filters: any,
  options: IPaginationOptions
): Promise<IGenericResponse<IAssignment[]>> => {
  const { searchTerm, ...filterData } = filters;

  const { limit, skip, page } = paginationHelpers.calculatePagination(options);

  const andConditions = [];

  // SEARCH
  if (searchTerm) {
    andConditions.push({
      $or: assignmentSearchableFields.map((field) => ({
        [field]: { $regex: searchTerm, $options: "i" },
      })),
    });
  }

  // FILTERS
  if (Object.keys(filterData).length) {
    andConditions.push({
      $and: Object.entries(filterData).map(([key, value]) => ({
        [key]: value,
      })),
    });
  }

  const whereCondition =
    andConditions.length > 0 ? { $and: andConditions } : {};

  const result = await Assignment.find(whereCondition)
    .sort(
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : { createdAt: -1 }
    )
    .skip(skip)
    .limit(limit)
    .populate("lesson_id");

  const total = await Assignment.countDocuments(whereCondition);

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
 * Get Assignment by ID
 */
const getAssignmentById = async (id: string): Promise<IAssignment | null> => {
  const result = await Assignment.findById(id).populate("lesson_id");

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Assignment not found");
  }

  return result;
};

/**
 * Update Assignment
 */
const updateAssignment = async (
  id: string,
  payload: Partial<IAssignment>
): Promise<IAssignment | null> => {
  const result = await Assignment.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Unable to update assignment");
  }

  return result;
};

/**
 * Delete Assignment
 */
const deleteAssignment = async (id: string): Promise<IAssignment | null> => {
  const result = await Assignment.findByIdAndDelete(id);

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Unable to delete assignment");
  }

  return result;
};

export const AssignmentService = {
  createAssignment,
  getAllAssignments,
  getAssignmentById,
  updateAssignment,
  deleteAssignment,
};
