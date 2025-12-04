import { Document, Types } from "mongoose";

export interface IQuizQuestion extends Document {
  quiz_id: Types.ObjectId;
  question_text: string;

  type: "mcq" | "true_false";

  points?: number;
  order?: number;

  // Virtual population
  options?: unknown[];

  createdAt?: Date;
  updatedAt?: Date;
}
