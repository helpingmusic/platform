import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateNotificationDto } from 'src/api/notifications/dto/create-notification.dto';
import { INotification } from 'src/api/notifications/notification.interface';
import { MarkNotificationsReadDto } from 'src/users/dto/mark-notifications-read.dto';
import { EntityService } from 'src/common/abstract/entity.service';

@Injectable()
export class NotificationsService extends EntityService<INotification> {

  constructor(
    @InjectModel('Notification') model: Model<INotification>,
  ) {
    super(model);
  }

  /**
   * Get all notifications for a user
   * @param userId
   * @param page? - page of notification to look at
   */
  async getForUser(userId: string, page = 0) {
    const query = { users: { $elemMatch: { user: userId } } };
    const notifications = await this.paginate(query, page);

    return notifications.map(n => {
      const user = n.users.find(u => String(u.user) === String(userId));
      return { ...n.toObject(), readAt: user.readAt };
    });
  }

  async markRead({ notifications, type }: MarkNotificationsReadDto, userId: string) {
    const notificationsToMark = await this.model.find({
      users: { $elemMatch: { user: userId } },
    })
      .or([
        type ? { type } : {},
        ...(notifications || []).map(_id => ({ _id })),
      ])
      .exec();

    return Promise.all(
      notificationsToMark.map(n => {
        const u = n.users.find(({ user }) => String(user) === userId);
        if (!u) return n;

        u.readAt = new Date();
        return n.save();
      }),
    );
  }

  async notify(n: CreateNotificationDto): Promise<INotification> {
    const users = n.users.map(user => ({ user }));
    return this.model.create({ ...n, users });
  }

}
