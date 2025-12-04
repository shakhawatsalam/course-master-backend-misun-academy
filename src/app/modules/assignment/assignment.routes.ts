import express from "express";
import { AssignmentController } from "./assignment.controller";

const router = express.Router();

// CREATE Assignment
router.post("/", AssignmentController.createAssignment);

// GET all Assignments
router.get("/", AssignmentController.getAllAssignments);

// GET Assignment by ID
router.get("/:id", AssignmentController.getAssignmentById);

// UPDATE Assignment
router.patch("/:id", AssignmentController.updateAssignment);

// DELETE Assignment
router.delete("/:id", AssignmentController.deleteAssignment);

export const AssignmentRoutes = router;
