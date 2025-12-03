/* eslint-disable @typescript-eslint/no-explicit-any */

import httpStatus from "http-status";
import { IGenericResponse } from "../../../interfaces/common";
import { IModule } from "./module.interface";
import { Module } from "./module.model";

import { IPaginationOptions } from "../../../interfaces/pagination";
import { paginationHelpers } from "../../../helpers/paginationHelper";
import ApiError from "../../../errors/Apierror";
import { moduleSearchableFields } from "./module.constant";

/**
 * Create Module
 */
const createModule = async (data: Partial<IModule>): Promise<IModule> => {
  const result = await Module.create(data);

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Unable to create module");
  }

  return result;
};

/**
 * Get All Modules with search + filter + pagination
 */
const getAllModules = async (
  filters: any,
  options: IPaginationOptions
): Promise<IGenericResponse<IModule[]>> => {
  const { searchTerm, ...filterData } = filters;

  const { limit, skip, page } = paginationHelpers.calculatePagination(options);

  const andConditions = [];

  // Search Term
  if (searchTerm) {
    andConditions.push({
      $or: moduleSearchableFields.map((field) => ({
        [field]: { $regex: searchTerm, $options: "i" },
      })),
    });
  }

  // Filter fields
  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      $and: Object.entries(filterData).map(([key, value]) => ({
        [key]: value,
      })),
    });
  }

  const whereCondition =
    andConditions.length > 0 ? { $and: andConditions } : {};

  // Query
  const result = await Module.find(whereCondition)
    .sort(
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : { createdAt: -1 }
    )
    .skip(skip)
    .limit(limit)
    .populate("course_id")
    .populate("lessons");

  const total = await Module.countDocuments(whereCondition);

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
 * Get Module by ID
 */
const getModuleById = async (id: string): Promise<IModule | null> => {
  const result = await Module.findById(id)
    // .populate("course_id")
    .populate("lessons");

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Module not found");
  }

  return result;
};

/**
 * Update Module
 */
const updateModule = async (
  id: string,
  payload: Partial<IModule>
): Promise<IModule | null> => {
  const result = await Module.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Unable to update module");
  }

  return result;
};

/**
 * Delete Module
 */
const deleteModule = async (id: string): Promise<IModule | null> => {
  const result = await Module.findByIdAndDelete(id);

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Unable to delete module");
  }

  return result;
};

export const ModuleService = {
  createModule,
  getAllModules,
  getModuleById,
  updateModule,
  deleteModule,
};
