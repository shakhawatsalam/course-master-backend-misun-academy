import express from "express";
import { QuizOptionController } from "./quizOption.controller";

const router = express.Router();

// CREATE Quiz Option
router.post("/", QuizOptionController.createQuizOption);

// GET all Quiz Options
router.get("/", QuizOptionController.getAllQuizOptions);

// GET single Quiz Option by ID
router.get("/:id", QuizOptionController.getQuizOptionById);

// UPDATE Quiz Option
router.patch("/:id", QuizOptionController.updateQuizOption);

// DELETE Quiz Option
router.delete("/:id", QuizOptionController.deleteQuizOption);

export const QuizOptionRoutes = router;
