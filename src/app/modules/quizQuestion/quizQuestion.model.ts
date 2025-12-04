import { Schema, model } from "mongoose";
import { IQuizQuestion } from "./quizQuestion.interface";

const quizQuestionSchema = new Schema<IQuizQuestion>(
  {
    quiz_id: {
      type: Schema.Types.ObjectId,
      ref: "Quiz",
      required: [true, "Quiz is required"],
    },
    question_text: {
      type: String,
      required: [true, "Question text is required"],
    },
    type: {
      type: String,
      enum: {
        values: ["mcq", "true_false"],
        message: "Type must be mcq or true_false",
      },
      required: true,
    },
    points: {
      type: Number,
      default: 1,
      min: [1, "Points must be at least 1"],
    },
    order: {
      type: Number,
      min: [1, "Order must be at least 1"],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
quizQuestionSchema.index({ quiz_id: 1, order: 1 });

// Virtual populate for options
quizQuestionSchema.virtual("options", {
  ref: "QuizOption",
  localField: "_id",
  foreignField: "question_id",
});

export const QuizQuestion = model<IQuizQuestion>(
  "QuizQuestion",
  quizQuestionSchema
);
