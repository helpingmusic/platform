import { Injectable } from '@nestjs/common';
import { EventObservable } from '@nestjs/cqrs';
import { map } from 'rxjs/operators';
import { SendNotificationCommand } from 'src/api/announcement/commands/send-notification.command';
import { AnnouncementCreatedEvent } from 'src/api/announcement/events/announcement-created.event';

@Injectable()
export class AnnouncementSagas {

  notifyUsers = (events$: EventObservable<AnnouncementCreatedEvent>) =>
    events$.ofType(AnnouncementCreatedEvent)
      .pipe(map((event: AnnouncementCreatedEvent) => new SendNotificationCommand(event.announcement)))

  sagas = [
    this.notifyUsers,
  ];
}