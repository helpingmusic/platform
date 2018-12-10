import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NotificationTypes } from 'src/api/notifications/notification-types.enum';
import { NotificationsService } from 'src/api/notifications/notifications.service';
import { SendPosterCommentNotificationCommand } from 'src/api/thread/comments/commands/send-poster-comment-notification.command';
import { CommentService } from 'src/api/thread/comments/comment.service';
import { UsersService } from 'src/users/services/users.service';

@CommandHandler(SendPosterCommentNotificationCommand)
export class SendPosterCommentNotificationHandler implements ICommandHandler<SendPosterCommentNotificationCommand> {

  constructor(
    private notificationService: NotificationsService,
    private commentService: CommentService,
    private userService: UsersService,
  ) {
  }

  async execute(cmd: SendPosterCommentNotificationCommand, resolve: (value?) => void) {
    const { comment } = cmd;

    const thread: any = await this.commentService.populateThread(comment);
    const poster = thread.media.item.poster;
    const commenter = await this.userService.getById(comment.commenter);

    await this.notificationService.notify({
      type: NotificationTypes.POST_COMMENT,
      title: `${commenter.first_name} Left A Comment On Your Post`,
      description: comment.body.substr(0, 140),
      link: `/posts/${thread.media.item._id}?com=${comment._id}`,
      users: [poster._id],
      data: { commentId: comment._id },
    });

    resolve();
  }
}