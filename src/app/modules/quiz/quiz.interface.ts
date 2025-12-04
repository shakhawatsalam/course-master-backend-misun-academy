import { Document, Types } from "mongoose";

export interface IQuiz extends Document {
  lesson_id: Types.ObjectId;
  title: string;
  passing_score?: number;
  time_limit_minutes?: number;
  questions?: unknown[];
  createdAt?: Date;
  updatedAt?: Date;
}
