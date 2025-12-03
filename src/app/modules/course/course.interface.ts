import { Types, Decimal128, Document } from "mongoose";

export interface ICourse extends Document {
  title: string;
  slug: string;
  description: string;

  thumbnail_url?: string | null;

  level: "beginner" | "intermediate" | "advanced";

  price: Decimal128;

  category_id: Types.ObjectId;
  instructor_id: Types.ObjectId;

  duration_hours?: number;
  language?: string;

  requirements?: string;

  what_you_will_learn?: string[];

  status: "draft" | "published" | "archived";
  is_published: boolean;

  enrollment_count: number;
  average_rating: Decimal128;

  deleted_at?: Date | null;

  createdAt?: Date;
  updatedAt?: Date;
}
