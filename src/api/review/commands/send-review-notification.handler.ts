import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NotificationTypes } from 'src/api/notifications/notification-types.enum';
import { NotificationsService } from 'src/api/notifications/notifications.service';
import { SendReviewNotificationCommand } from 'src/api/review/commands/send-review-notification.command';
import { UsersService } from 'src/users/services/users.service';

@CommandHandler(SendReviewNotificationCommand)
export class SendReviewNotificationHandler implements ICommandHandler<SendReviewNotificationCommand> {
  constructor(
    private notifications: NotificationsService,
    private userService: UsersService,
  ) {
  }

  async execute(cmd: SendReviewNotificationCommand, resolve: (value?) => void) {
    const { review } = cmd;

    const poster = await this.userService.getById(review.poster);

    await this.notifications.notify({
      type: NotificationTypes.REVIEW,
      title: `${poster.first_name} Left a Review on Your Account`,
      description: `${review.rating} Stars: ${review.content}`,
      link: `/member/${review.reviewee}/reviews?id=${review._id}`,
      users: [review.reviewee],
      data: { reviewId: review._id },
    });

    resolve();
  }
}