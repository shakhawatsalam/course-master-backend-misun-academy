import { Schema, model } from "mongoose";
import { IQuizAttempt } from "./quizAttempt.interface";

const quizAnswerSchema = new Schema(
  {
    question_id: {
      type: Schema.Types.ObjectId,
      ref: "QuizQuestion",
      required: true,
    },
    selected_option_id: {
      type: Schema.Types.ObjectId,
      ref: "QuizOption",
      required: true,
    },
    is_correct: {
      type: Boolean,
      required: true,
    },
  },
  { _id: false }
);

const quizAttemptSchema = new Schema<IQuizAttempt>(
  {
    quiz_id: {
      type: Schema.Types.ObjectId,
      ref: "Quiz",
      required: [true, "Quiz is required"],
    },
    student_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Student is required"],
    },
    score: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    answers: [quizAnswerSchema],
    passed: {
      type: Boolean,
      default: false,
    },
    attempted_at: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
quizAttemptSchema.index({ student_id: 1, quiz_id: 1, attempted_at: -1 });

export const QuizAttempt = model<IQuizAttempt>(
  "QuizAttempt",
  quizAttemptSchema
);
