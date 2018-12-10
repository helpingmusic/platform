import { IEvent } from '@nestjs/cqrs';
import { INotification } from 'src/api/notifications/notification.interface';

export class NotificationCreatedEvent implements IEvent {
  constructor(public notification: INotification) {
  }
}
