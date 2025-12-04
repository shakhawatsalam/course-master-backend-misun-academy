import { Schema, model } from "mongoose";
import { ISubmission } from "./submission.interface";

const submissionSchema = new Schema<ISubmission>(
  {
    assignment_id: {
      type: Schema.Types.ObjectId,
      ref: "Assignment",
      required: [true, "Assignment is required"],
    },
    student_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Student is required"],
    },
    file_url: {
      type: String,
    },
    text_answer: {
      type: String,
    },
    submitted_at: {
      type: Date,
      default: Date.now,
    },
    grade: {
      type: Number,
      min: [0, "Grade cannot be negative"],
      max: [100, "Grade cannot exceed 100"],
    },
    feedback: {
      type: String,
    },
    status: {
      type: String,
      enum: ["pending", "graded", "rejected"],
      default: "pending",
    },
    graded_by: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    graded_at: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
submissionSchema.index({ assignment_id: 1, student_id: 1 });
submissionSchema.index({ status: 1 });

export const Submission = model<ISubmission>("Submission", submissionSchema);
