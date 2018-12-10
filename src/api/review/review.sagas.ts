import { Injectable } from '@nestjs/common';
import { EventObservable } from '@nestjs/cqrs';
import { map } from 'rxjs/operators';
import { SendReviewNotificationCommand } from 'src/api/review/commands/send-review-notification.command';
import { ReviewCreatedEvent } from 'src/api/review/events/review-created.event';

@Injectable()
export class ReviewSagas {

  sendNotification = (events$: EventObservable<ReviewCreatedEvent>) =>
    events$.ofType(ReviewCreatedEvent)
      .pipe(map(event => new SendReviewNotificationCommand(event.review)));

  sagas = [
    this.sendNotification,
  ];
}