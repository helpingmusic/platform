import { IEvent } from '@nestjs/cqrs';
import { IAnnouncement } from 'src/api/announcement/announcement.interface';

export class AnnouncementCreatedEvent implements IEvent {
  constructor(public announcement: IAnnouncement) {}
}