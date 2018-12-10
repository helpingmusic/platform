import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateNotificationDto } from 'src/api/notifications/dto/create-notification.dto';
import { NotificationTypes } from 'src/api/notifications/notification-types.enum';
import { INotification } from 'src/api/notifications/notification.interface';
import { NotificationsService } from 'src/api/notifications/notifications.service';
import { INotificationSettings } from 'src/users/interfaces/notification-settings.interface';
import { IPushSubscription } from 'src/users/interfaces/push-subscription.interface';
import { IUser } from 'src/users/interfaces/user.interface';

@Injectable()
export class UserNotificationsService {

  constructor(
    @InjectModel('User') private readonly userModel: Model<IUser>,
    private notificationService: NotificationsService,
  ) {
  }

  /**
   * Get valid users for notification
   */
  async notifyValidUsers(n: CreateNotificationDto): Promise<INotification> {
    const nt = n.type;

    const isAdminNotification = nt.split('.')[0] === 'admin';

    const query = this.userModel.find({});

    // If is an admin notification, notify admin,
    // otherwise query members by active subscription and proper notification settings
    if (isAdminNotification) {
      query.where('role').equals('admin');
    } else {
      query.where('stripe.subscriptionId').exists()
        .where('stripe.status').ne('cancelled')
        .where('active_until').lte(new Date())
        .or([
          { [`notifications.${nt}.browser`]: true },
          { [`notifications.${nt}.email`]: true },
        ]);
    }

    const users = await query.select('_id').exec();

    return this.notificationService.notify({ ...n, users: users.map(u => u._id) });
  }

  addPushSubscription(user: IUser, pushSub: IPushSubscription) {
    const i = user.pushSubscriptions.findIndex(p => p.endpoint === pushSub.endpoint);
    if (i === -1) {
      user.pushSubscriptions.push(pushSub);
    } else {
      Object.assign(user.pushSubscriptions[i], pushSub);
    }
    return user.save();
  }

  async updateSettings(user: string | IUser, notifications: INotificationSettings) {
    const u = (typeof user === 'string') ? await this.userModel.findById(user) : user;
    await u.update({ notifications });
    return u.notifications;
  }

}
