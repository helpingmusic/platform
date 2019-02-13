import { Injectable } from '@nestjs/common';
import { EventObservable } from '@nestjs/cqrs';
import { map } from 'rxjs/operators';
import { SendIssueNotificationCommand } from 'src/api/issue/commands/send-issue-notification.command';
import { IssueCreatedEvent } from 'src/api/issue/events/issue-created.event';

@Injectable()
export class IssueSagas {

  sendNotification = (events$: EventObservable<IssueCreatedEvent>) =>
    events$.ofType(IssueCreatedEvent)
      .pipe(map(event => new SendIssueNotificationCommand(event.issue)))

  sagas = [
    this.sendNotification,
  ];
}