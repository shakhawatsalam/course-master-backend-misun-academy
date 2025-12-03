import { Schema, model } from "mongoose";
import { ILesson } from "./lesson.interface";

const resourceSchema = new Schema(
  {
    name: { type: String },
    url: { type: String },
    type: { type: String },
  },
  { _id: false }
);

const lessonSchema = new Schema<ILesson>(
  {
    module_id: {
      type: Schema.Types.ObjectId,
      ref: "Module",
      required: [true, "Module is required"],
    },
    title: {
      type: String,
      required: [true, "Lesson title is required"],
      trim: true,
    },
    content: {
      type: Schema.Types.Mixed,
    },
    video_url: {
      type: String,
    },
    duration_minutes: {
      type: Number,
      min: [0, "Duration cannot be negative"],
    },
    resources: [resourceSchema],
    order: {
      type: Number,
      required: [true, "Order is required"],
      min: [1, "Order must be at least 1"],
    },
    is_free_preview: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Index
lessonSchema.index({ module_id: 1, order: 1 });

export const Lesson = model<ILesson>("Lesson", lessonSchema);
