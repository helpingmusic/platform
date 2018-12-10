import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SendUsersNotificationCommand } from 'src/api/notifications/commands/send-users-notification.command';
import { INotification } from 'src/api/notifications/notification.interface';
import { EmailTemplates } from 'src/core/email/email-templates.enum';
import { EmailService } from 'src/core/email/email.service';
import { ConfigService } from 'src/shared/config/config.service';
import { INotificationSetting } from 'src/users/interfaces/notification-settings.interface';
import { IUser } from 'src/users/interfaces/user.interface';
import wp from 'web-push';

@CommandHandler(SendUsersNotificationCommand)
export class SendUsersNotificationHandler implements ICommandHandler<SendUsersNotificationCommand> {

  private readonly webpush: any;

  constructor(
    private config: ConfigService,
    private emailService: EmailService,
  ) {
    wp.setVapidDetails(
      'mailto:home@helpingmusic.org',
      config.get('WEB_PUSH_PUBLIC_KEY'),
      config.get('WEB_PUSH_PRIVATE_KEY'),
    );
    this.webpush = wp;
  }

  async execute(cmd: SendUsersNotificationCommand, resolve: (value?) => void) {
    const { notification } = cmd;

    await notification.populate({
      path: 'users.user',
      model: 'User',
    });

    await Promise.all(
      notification.users.map(async (u) => {
        const user = (u.user as any) as IUser;
        const ns: INotificationSetting = (user.notifications || {})[notification.type];

        if (!ns) return;

        if (ns.browser) {
          await this.notifyByBrowser(user, notification);
        }

        if (ns.email) {
          await this.notifyByEmail(user, notification);
        }
      }),
    );

    resolve();
  }

  async notifyByBrowser(u: IUser, n: INotification) {

    const failedPushes = [];

    await Promise.all(
      u.pushSubscriptions.map((sub, i) => {
        return this.webpush.sendNotification(sub, JSON.stringify(n))
          .catch(e => failedPushes.push(sub));
      }),
    );

    // push subscription failed, so remove it from user
    if (failedPushes.length) {
      const pushSubscriptions = u.pushSubscriptions.filter(sub => !failedPushes.includes(sub));
      await u.update({ pushSubscriptions });
    }

  }

  async notifyByEmail(u: IUser, n: INotification) {
    return this.emailService.send({
      template: EmailTemplates.NOTIFICATION,
      to: [{ name: u.first_name, email: u.email }],
      content: {
        subject: n.title,
        name: u.first_name,
        userId: u._id,
        notification: n,
      },
    });
  }
}