import { Types, Document } from "mongoose";

export interface IModule extends Document {
  course_id: Types.ObjectId;
  title: string;
  description?: string;
  order: number;
  duration_minutes?: number;

  lessons?: Types.ObjectId[] | any[];
}
