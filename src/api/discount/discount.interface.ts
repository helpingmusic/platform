import { Document } from 'mongoose';

export interface IDiscount extends Document {
  title: string;
  body: string;

  created_at: Date;
  updated_at: Date;
}