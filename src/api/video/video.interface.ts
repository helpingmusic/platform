import { Document } from 'mongoose';
import { VideoTypes } from 'src/api/video/video-types.enum';

export interface IVideo extends Document {
  title: string;
  body: string;
  type: VideoTypes;
  publish: boolean;
  url: string;
  mediumId: string;

  createdAt: Date;
  updatedAt: Date;
}