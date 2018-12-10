import { Document } from 'mongoose';
import { IThread } from 'src/api/thread/thread.interface';
import { IUser } from 'src/users/interfaces/user.interface';

export interface IPost extends Document {
  content: string;
  poster: IUser;

  hidden: boolean;

  thread: IThread;

  created_at: Date;
  updated_at: Date;
}