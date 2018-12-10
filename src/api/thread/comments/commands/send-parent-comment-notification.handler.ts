import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NotificationTypes } from 'src/api/notifications/notification-types.enum';
import { NotificationsService } from 'src/api/notifications/notifications.service';
import { SendParentCommentNotificationCommand } from 'src/api/thread/comments/commands/send-parent-comment-notification.command';
import { CommentService } from 'src/api/thread/comments/comment.service';
import { UsersService } from 'src/users/services/users.service';

@CommandHandler(SendParentCommentNotificationCommand)
export class SendParentCommentNotificationHandler implements ICommandHandler<SendParentCommentNotificationCommand> {

  constructor(
    private notificationService: NotificationsService,
    private commentService: CommentService,
    private userService: UsersService,
  ) {
  }

  async execute(cmd: SendParentCommentNotificationCommand, resolve: (value?) => void) {
    const { comment } = cmd;

    const thread: any = await this.commentService.populateThread(comment);
    const poster = thread.media.item.poster;
    const commenter = await this.userService.getById(comment.commenter);
    const parent = await this.commentService.getParent(comment._id);

    await this.notificationService.notify({
      type: NotificationTypes.POST_COMMENT_RESPONSE,
      title: `${commenter.first_name} Responded To Your Comment On ${poster.first_name}'s post.`,
      description: comment.body.substr(0, 140),
      link: `/posts/${thread.media.item._id}?com=${comment._id}`,
      users: [parent.commenter],
      data: { commentId: comment._id },
    });

    resolve();
  }
}