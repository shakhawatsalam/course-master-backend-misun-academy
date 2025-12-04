import express from "express";
import { QuizAttemptController } from "./quizAttempt.controller";

const router = express.Router();

// Create attempt
router.post("/", QuizAttemptController.createQuizAttempt);

// Get all attempts
router.get("/", QuizAttemptController.getAllQuizAttempts);

// Get single attempt
router.get("/:id", QuizAttemptController.getQuizAttemptById);

// Delete attempt
router.delete("/:id", QuizAttemptController.deleteQuizAttempt);

export const QuizAttemptRoutes = router;
