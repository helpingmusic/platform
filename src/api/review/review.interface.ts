import { Document } from 'mongoose';

export interface IReview extends Document {
  content: string;
  rating: number;
  hidden: boolean;

  poster: string;
  reviewee: string;

  created_at: Date;
  updated_at: Date;
}