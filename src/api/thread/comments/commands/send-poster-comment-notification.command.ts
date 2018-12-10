import { ICommand } from '@nestjs/cqrs';
import { IComment } from 'src/api/thread/comments/comment.interface';

export class SendPosterCommentNotificationCommand implements ICommand {
  constructor(
    public comment: IComment,
  ) {
  }
}