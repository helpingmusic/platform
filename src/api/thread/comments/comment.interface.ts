import { Document } from 'mongoose';

export interface IComment extends Document {
  thread: string;
  // parent comment
  parent: string | IComment;

  commenter: string;

  body: string;

  createdAt: Date;
  updatedAt: Date;
  removedAt: Date;
}