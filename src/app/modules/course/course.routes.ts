import express from "express";
import { CourseController } from "./course.controller";
// import auth from "../../middlewares/auth";
// import { ENUM_USER_ROLE } from "../../../enums/user";

const router = express.Router();

// CREATE course
router.post("/", CourseController.createCourse);

// GET all courses
router.get("/", CourseController.getAllCourses);

// GET single course by ID
router.get("/:id", CourseController.getCourseById);

// UPDATE course
router.patch("/:id", CourseController.updateCourse);

// DELETE course 
router.delete("/:id", CourseController.deleteCourse);

export const CourseRoutes = router;
