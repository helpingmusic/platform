import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SendDiscountNotificationCommand } from 'src/api/discount/commands/send-discount-notification.command';
import { NotificationTypes } from 'src/api/notifications/notification-types.enum';
import { UserNotificationsService } from 'src/users/services/user-notifications.service';

@CommandHandler(SendDiscountNotificationCommand)
export class SendDiscountNotificationHandler implements ICommandHandler<SendDiscountNotificationCommand> {
  constructor(
    private userNotifications: UserNotificationsService,
  ) {
  }

  async execute(cmd: SendDiscountNotificationCommand, resolve: (value?) => void) {
    const { discount } = cmd;

    await this.userNotifications.notifyValidUsers({
      type: NotificationTypes.DISCOUNT,
      title: `New Discount Available`,
      description: `${discount.title}: ${discount.body}`,
      link: `/discounts?id=${discount._id}`,
      data: { discountId: discount._id },
    });

    resolve();
  }
}