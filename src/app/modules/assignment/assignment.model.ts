import { Schema, model } from "mongoose";
import { IAssignment } from "./assignment.interface";

const assignmentSchema = new Schema<IAssignment>(
  {
    lesson_id: {
      type: Schema.Types.ObjectId,
      ref: "Lesson",
      required: [true, "Lesson is required"],
    },
    title: {
      type: String,
      required: [true, "Assignment title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    due_date: {
      type: Date,
      required: [true, "Due date is required"],
    },
    max_score: {
      type: Number,
      default: 100,
      min: [1, "Max score must be at least 1"],
    },
  },
  {
    timestamps: true,
  }
);

// Index
assignmentSchema.index({ lesson_id: 1 });

export const Assignment = model<IAssignment>("Assignment", assignmentSchema);
