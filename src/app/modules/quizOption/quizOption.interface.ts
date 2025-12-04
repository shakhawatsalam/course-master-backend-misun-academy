import { Document, Types } from "mongoose";

export interface IQuizOption extends Document {
  question_id: Types.ObjectId;
  text: string;

  is_correct: boolean;
  order?: number;

  createdAt?: Date;
  updatedAt?: Date;
}
