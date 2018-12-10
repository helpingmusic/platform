import { Document } from 'mongoose';
import { IComment } from 'src/api/thread/comments/comment.interface';

export interface IThread extends Document {

  media: {
    kind: string,
    item: string | Document,
  };

  locked: boolean;

  comments: Array<IComment>;

}