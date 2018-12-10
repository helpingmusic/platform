import { ICommand } from '@nestjs/cqrs';
import { IAnnouncement } from 'src/api/announcement/announcement.interface';

export class SendNotificationCommand implements ICommand {
  constructor(public announcement: IAnnouncement) {}
}