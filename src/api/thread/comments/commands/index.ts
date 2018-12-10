import { SendParentCommentNotificationHandler } from 'src/api/thread/comments/commands/send-parent-comment-notification.handler';
import { SendPosterCommentNotificationHandler } from 'src/api/thread/comments/commands/send-poster-comment-notification.handler';

export const CommandHandlers = [
  SendParentCommentNotificationHandler,
  SendPosterCommentNotificationHandler,
];