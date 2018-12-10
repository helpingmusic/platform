import { Document } from 'mongoose';
import { NotificationTypes } from './notification-types.enum';

export interface INotification extends Document {
  type: NotificationTypes;

  users: Array<{
    user: string;
    read: boolean;
    readAt: Date;
  }>;

  title: string;
  description: string;
  link: string;

  data: object;
}
