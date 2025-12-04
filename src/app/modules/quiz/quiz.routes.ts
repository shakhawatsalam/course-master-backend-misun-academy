import express from "express";
import { QuizController } from "./quiz.controller";
// import auth from "../../middlewares/auth";
// import { ENUM_USER_ROLE } from "../../../enums/user";

const router = express.Router();

// CREATE quiz
router.post("/", QuizController.createQuiz);

// GET all quizzes
router.get("/", QuizController.getAllQuizzes);

// GET single quiz by ID
router.get("/:id", QuizController.getQuizById);

// UPDATE quiz
router.patch("/:id", QuizController.updateQuiz);

// DELETE quiz
router.delete("/:id", QuizController.deleteQuiz);

export const QuizRoutes = router;
