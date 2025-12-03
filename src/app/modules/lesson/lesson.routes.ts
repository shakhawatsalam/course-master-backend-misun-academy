import express from "express";
import { LessonController } from "./lesson.controller";
// import auth from "../../middlewares/auth";
// import { ENUM_USER_ROLE } from "../../../enums/user";

const router = express.Router();

// CREATE lesson
router.post("/", LessonController.createLesson);

// GET all lessons (with optional module filtering)
router.get("/", LessonController.getAllLessons);

// GET lessons by module ID
router.get("/module/:moduleId", LessonController.getLessonsByModule);

// GET single lesson by ID
router.get("/:id", LessonController.getLessonById);

// UPDATE lesson
router.patch("/:id", LessonController.updateLesson);

// UPDATE lesson order (for reordering)
router.patch("/:id/order", LessonController.updateLessonOrder);

// DELETE lesson
router.delete("/:id", LessonController.deleteLesson);

export const LessonRoutes = router;
