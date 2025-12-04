import mongoose, { Schema, model } from "mongoose";
import { IQuiz } from "./quiz.interface";

const quizSchema = new Schema<IQuiz>(
  {
    lesson_id: {
      type: Schema.Types.ObjectId,
      ref: "Lesson",
      required: [true, "Lesson is required"],
    },
    title: {
      type: String,
      required: [true, "Quiz title is required"],
      trim: true,
    },
    passing_score: {
      type: Number,
      default: 70,
      min: 0,
      max: 100,
    },
    time_limit_minutes: {
      type: Number,
      min: [1, "Time limit must be at least 1 minute"],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual populate
quizSchema.virtual("questions", {
  ref: "QuizQuestion",
  localField: "_id",
  foreignField: "quiz_id",
});

export const Quiz = model<IQuiz>("Quiz", quizSchema);
