import express from "express";
import { QuizQuestionController } from "./quizQuestion.controller";
// import auth from "../../middlewares/auth";
// import { ENUM_USER_ROLE } from "../../../enums/user";

const router = express.Router();

// CREATE QuizQuestion
router.post("/", QuizQuestionController.createQuizQuestion);

// GET all QuizQuestions
router.get("/", QuizQuestionController.getAllQuizQuestions);

// GET single QuizQuestion by ID
router.get("/:id", QuizQuestionController.getQuizQuestionById);

// UPDATE QuizQuestion
router.patch("/:id", QuizQuestionController.updateQuizQuestion);

// DELETE QuizQuestion
router.delete("/:id", QuizQuestionController.deleteQuizQuestion);

export const QuizQuestionRoutes = router;
