import { IEvent } from '@nestjs/cqrs';
import { IComment } from 'src/api/thread/comments/comment.interface';

export class CommentCreatedEvent implements IEvent {
  constructor(
    public comment: IComment,
  ) {
  }
}