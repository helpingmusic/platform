import { Injectable } from '@nestjs/common';
import { EventObservable } from '@nestjs/cqrs';
import { map } from 'rxjs/operators';
import { SendDiscountNotificationCommand } from 'src/api/discount/commands/send-discount-notification.command';
import { DiscountCreatedEvent } from 'src/api/discount/events/discount-created.event';

@Injectable()
export class DiscountSagas {

  sendNotification = (events$: EventObservable<DiscountCreatedEvent>) =>
    events$.ofType(DiscountCreatedEvent)
      .pipe(map(event => new SendDiscountNotificationCommand(event.discount)))

  sagas = [
    this.sendNotification,
  ];
}