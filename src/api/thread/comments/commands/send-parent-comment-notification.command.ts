import { ICommand } from '@nestjs/cqrs';
import { IComment } from 'src/api/thread/comments/comment.interface';

export class SendParentCommentNotificationCommand implements ICommand {
  constructor(
    public comment: IComment,
  ) {
  }
}