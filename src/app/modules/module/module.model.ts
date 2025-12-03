import { Schema, model } from "mongoose";
import { IModule } from "./module.interface";

const moduleSchema = new Schema<IModule>(
  {
    course_id: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: [true, "Course is required"],
    },
    title: {
      type: String,
      required: [true, "Module title is required"],
      trim: true,
    },
    description: {
      type: String,
    },
    order: {
      type: Number,
      required: [true, "Order is required"],
      min: [1, "Order must be at least 1"],
    },
    duration_minutes: {
      type: Number,
      min: [0, "Duration cannot be negative"],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Index
moduleSchema.index({ course_id: 1, order: 1 });

// Virtual populate
moduleSchema.virtual("lessons", {
  ref: "Lesson",
  localField: "_id",
  foreignField: "module_id",
});

export const Module = model<IModule>("Module", moduleSchema);
