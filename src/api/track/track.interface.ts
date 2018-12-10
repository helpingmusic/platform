import { Document } from 'mongoose';

export interface ITrack extends Document {
  title: string;
  user: string;
  href: string;
  tags: Array<string>;
  duration: number;
  filename: string;
  byteLength: number;
  mediaType: string;
  s3: {
    key: string;
    ETag: string;
  };

  created_at: Date;
  updated_at: Date;
}