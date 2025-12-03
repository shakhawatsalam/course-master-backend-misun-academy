import { Schema, model, Types } from "mongoose";
import { ICourse } from "./course.interface";

const courseSchema = new Schema<ICourse>(
  {
    title: {
      type: String,
      required: [true, "Course title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    thumbnail_url: {
      type: String,
      default: null,
    },
    level: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      default: "beginner",
    },
    price: {
      type: Schema.Types.Decimal128,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    category_id: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category is required"],
    },
    instructor_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Instructor is required"],
    },
    duration_hours: {
      type: Number,
      min: [0, "Duration cannot be negative"],
    },
    language: {
      type: String,
      default: "English",
    },
    requirements: {
      type: String,
    },
    what_you_will_learn: [
      {
        type: String,
      },
    ],
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
    },
    is_published: {
      type: Boolean,
      default: false,
    },
    enrollment_count: {
      type: Number,
      default: 0,
      min: 0,
    },
    average_rating: {
      type: Schema.Types.Decimal128,
      default: 0,
      min: 0,
      max: 5,
    },
    deleted_at: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
courseSchema.index({ slug: 1 });
courseSchema.index({ title: "text" });
courseSchema.index({ category_id: 1 });
courseSchema.index({ instructor_id: 1 });
courseSchema.index({ level: 1 });
courseSchema.index({ is_published: 1 });
courseSchema.index({ created_at: -1 });
courseSchema.index({ price: 1 });

// Virtuals
courseSchema.virtual("modules", {
  ref: "Module",
  localField: "_id",
  foreignField: "course_id",
});

// courseSchema.virtual("reviews", {
//   ref: "Review",
//   localField: "_id",
//   foreignField: "course_id",
// });

export const Course = model<ICourse>("Course", courseSchema);
