import { Injectable } from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';
import { INotification } from 'src/api/notifications/notification.interface';
import { NotificationSchema } from 'src/api/notifications/schemas/notification.schema';
import { NotificationCreatedEvent } from 'src/api/notifications/events/notification-created.event';
import { IModelChanges, SchemaEventModel } from 'src/common/abstract/shema-event-model';

@Injectable()
export class NotificationEventsModel extends SchemaEventModel<INotification> {
  constructor(protected events$: EventBus) {
    super(NotificationSchema, events$);
  }

  created(n: INotification) {
    this.events$.publish(
      new NotificationCreatedEvent(n),
    );
  }

  saved(n: INotification, changes: IModelChanges) {
  }

  removed(n: INotification) {
  }
}
