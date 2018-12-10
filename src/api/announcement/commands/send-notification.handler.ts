import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SendNotificationCommand } from 'src/api/announcement/commands/send-notification.command';
import { NotificationTypes } from 'src/api/notifications/notification-types.enum';
import { UserNotificationsService } from 'src/users/services/user-notifications.service';

@CommandHandler(SendNotificationCommand)
export class SendNotificationHandler implements ICommandHandler<SendNotificationCommand> {

  constructor(
    private notificationService: UserNotificationsService,
  ) {
  }

  async execute(cmd: SendNotificationCommand, resolve: (value?) => void) {

    const { announcement: a } = cmd;

    await this.notificationService.notifyValidUsers({
      type: NotificationTypes.ANNOUNCEMENT,
      title: a.title,
      description: a.body,
      link: `/?id=${a._id}`,
      data: { announcementId: a._id },
    });

    resolve();
  }

}
