import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NotificationTypes } from 'src/api/notifications/notification-types.enum';
import { SendAdminReportNotificationCommand } from 'src/api/report/commands/send-admin-report-notification.command';
import { UserNotificationsService } from 'src/users/services/user-notifications.service';

@CommandHandler(SendAdminReportNotificationCommand)
export class SendAdminReportNotificationHandler implements ICommandHandler<SendAdminReportNotificationCommand> {
  constructor(
    private notifications: UserNotificationsService,
  ) {
  }

  async execute(cmd: SendAdminReportNotificationCommand, resolve: (value?) => void) {
    const { report } = cmd;

    await this.notifications.notifyValidUsers({
      type: NotificationTypes.ADMIN_REPORT,
      title: `${report.media.kind} Reported for "${report.reason}"`,
      description: report.description,
      link: `/admin/reports?id=${report._id}`,
      data: { reportId: report._id },
    });

    resolve();
  }
}