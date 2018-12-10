import { Document } from 'mongoose';

export interface IPasswordReset extends Document {
  _id: string;
  user: string;
  token: string;
  usedAt: Date;
  expiresAt: Date;
}