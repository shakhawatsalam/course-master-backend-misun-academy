import { Document, Types } from "mongoose";

export interface IAssignment extends Document {
  lesson_id: Types.ObjectId;
  title: string;
  description: string;
  due_date: Date;
  max_score?: number;
  createdAt?: Date;
  updatedAt?: Date;
}
