import express from "express";
import { SubmissionController } from "./submission.controller";

const router = express.Router();

// CREATE submission
router.post("/", SubmissionController.createSubmission);

// GET all submissions
router.get("/", SubmissionController.getAllSubmissions);

// GET submission by ID
router.get("/:id", SubmissionController.getSubmissionById);

// UPDATE submission (e.g., grading, status update)
router.patch("/:id", SubmissionController.updateSubmission);

// DELETE submission
router.delete("/:id", SubmissionController.deleteSubmission);

export const SubmissionRoutes = router;
