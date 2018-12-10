import { Document } from 'mongoose';

export interface IAnnouncement extends Document {
  title: string;
  body: string;

  created_at: Date;
  updated_at: Date;
}