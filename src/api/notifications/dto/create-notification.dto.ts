import { NotificationTypes } from 'src/api/notifications/notification-types.enum';

export class CreateNotificationDto {
  type: NotificationTypes;
  title: string;
  description: string;
  link: string;
  users?: Array<string>;
  data: object;
}