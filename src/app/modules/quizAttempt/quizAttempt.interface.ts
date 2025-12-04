import { Document, Types } from "mongoose";

export interface IQuizAnswer {
  question_id: Types.ObjectId;
  selected_option_id: Types.ObjectId;
  is_correct: boolean;
}

export interface IQuizAttempt extends Document {
  quiz_id: Types.ObjectId;
  student_id: Types.ObjectId;
  score: number;
  answers: IQuizAnswer[];
  passed: boolean;
  attempted_at?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
