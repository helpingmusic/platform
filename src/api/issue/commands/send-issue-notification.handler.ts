import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SendIssueNotificationCommand } from 'src/api/issue/commands/send-issue-notification.command';
import { NotificationTypes } from 'src/api/notifications/notification-types.enum';
import { UserNotificationsService } from 'src/users/services/user-notifications.service';

@CommandHandler(SendIssueNotificationCommand)
export class SendIssueNotificationHandler implements ICommandHandler<SendIssueNotificationCommand> {
  constructor(
    private userNotifications: UserNotificationsService,
  ) {
  }

  async execute(cmd: SendIssueNotificationCommand, resolve: (value?) => void) {
    const { issue } = cmd;

    await this.userNotifications.notifyValidUsers({
      type: NotificationTypes.ADMIN_ISSUE,
      title: `New ${issue.type} Reported`,
      description: issue.description,
      link: `/admin/issues?id=${issue._id}`,
      data: { issueId: issue._id },
    });

    resolve();
  }
}