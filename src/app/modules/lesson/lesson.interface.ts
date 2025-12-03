import { Types, Document } from "mongoose";

export interface IResource {
  name: string;
  url: string;
  type: string; // pdf, doc, zip etc.
}

export interface ILesson extends Document {
  module_id: Types.ObjectId;
  title: string;
  content?: any;
  video_url?: string;
  duration_minutes?: number;
  resources?: IResource[];
  order: number;
  is_free_preview?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
