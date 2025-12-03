/* eslint-disable @typescript-eslint/no-explicit-any */

import httpStatus from "http-status";
import { IGenericResponse } from "../../../interfaces/common";
import { ICategory } from "./category.interface";
import { Category } from "./category.model";
import { categorySearchableFields } from "./category.constant";
import { IPaginationOptions } from "../../../interfaces/pagination";
import { paginationHelpers } from "../../../helpers/paginationHelper";
import ApiError from "../../../errors/Apierror";

const createCategory = async (data: Partial<ICategory>): Promise<ICategory> => {
  const result = await Category.create(data);

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Unable to create category");
  }

  return result;
};

const getAllCategories = async (
  filters: any,
  options: IPaginationOptions
): Promise<IGenericResponse<ICategory[]>> => {
  const { searchTerm, ...filterData } = filters;

  const { limit, skip, page } = paginationHelpers.calculatePagination(options);

  const andConditions = [];

  // Search
  if (searchTerm) {
    andConditions.push({
      $or: categorySearchableFields.map((field) => ({
        [field]: { $regex: searchTerm, $options: "i" },
      })),
    });
  }

  // Exact filters
  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      $and: Object.entries(filterData).map(([key, value]) => ({
        [key]: value,
      })),
    });
  }

  const whereCondition =
    andConditions.length > 0 ? { $and: andConditions } : {};

  const result = await Category.find(whereCondition)
    .sort(
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : { createdAt: -1 }
    )
    .skip(skip)
    .limit(limit);

  const total = await Category.countDocuments(whereCondition);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getCategoryById = async (id: string): Promise<ICategory | null> => {
  const result = await Category.findById(id);

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Category not found");
  }

  return result;
};

const updateCategory = async (
  id: string,
  payload: Partial<ICategory>
): Promise<ICategory | null> => {
  const result = await Category.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Unable to update category");
  }

  return result;
};

const deleteCategory = async (id: string): Promise<ICategory | null> => {
  const result = await Category.findByIdAndDelete(id);

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Unable to delete category");
  }

  return result;
};

export const CategoryService = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
