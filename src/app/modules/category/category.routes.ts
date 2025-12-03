import express from "express";
import auth from "../../middlewares/auth";
import { ENUM_USER_ROLE } from "../../../enums/user";
import { CategoryController } from "./category.controller";

const router = express.Router();

router.post("/", CategoryController.createCategory);

router.get("/", CategoryController.getAllCategories);

router.get("/:id", CategoryController.getCategoryById);

router.patch("/:id", CategoryController.updateCategory);

router.delete("/:id", CategoryController.deleteCategory);

export const CategoryRoutes = router;
