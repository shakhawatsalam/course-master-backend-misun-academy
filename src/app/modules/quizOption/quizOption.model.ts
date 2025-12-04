import { Schema, model } from "mongoose";
import { IQuizOption } from "./quizOption.interface";

const quizOptionSchema = new Schema<IQuizOption>(
  {
    question_id: {
      type: Schema.Types.ObjectId,
      ref: "QuizQuestion",
      required: [true, "Question is required"],
    },
    text: {
      type: String,
      required: [true, "Option text is required"],
    },
    is_correct: {
      type: Boolean,
      required: true,
      default: false,
    },
    order: {
      type: Number,
      min: [1, "Order must be at least 1"],
    },
  },
  {
    timestamps: true,
  }
);

// Index
quizOptionSchema.index({ question_id: 1 });

export const QuizOption = model<IQuizOption>("QuizOption", quizOptionSchema);
