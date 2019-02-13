import { Injectable } from '@nestjs/common';
import { EventObservable } from '@nestjs/cqrs';
import { map } from 'rxjs/operators';
import { SendUsersNotificationCommand } from 'src/api/notifications/commands/send-users-notification.command';
import { NotificationCreatedEvent } from 'src/api/notifications/events/notification-created.event';

@Injectable()
export class NotificationSagas {

  sendNotification = (events$: EventObservable<NotificationCreatedEvent>) =>
    events$.ofType(NotificationCreatedEvent)
      .pipe(map(event => new SendUsersNotificationCommand(event.notification)))

  sagas = [
    this.sendNotification,
  ];
}