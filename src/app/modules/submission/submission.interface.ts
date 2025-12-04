import { Document, Types } from "mongoose";

export interface ISubmissionAnswer {
  file_url?: string;
  text_answer?: string;
}

export interface ISubmission extends Document {
  assignment_id: Types.ObjectId;
  student_id: Types.ObjectId;

  file_url?: string;
  text_answer?: string;

  submitted_at?: Date;

  grade?: number;
  feedback?: string;

  status: "pending" | "graded" | "rejected";

  graded_by?: Types.ObjectId;
  graded_at?: Date;

  createdAt?: Date;
  updatedAt?: Date;
}
