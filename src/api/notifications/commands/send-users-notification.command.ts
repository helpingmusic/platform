import { ICommand } from '@nestjs/cqrs';
import { INotification } from '../notification.interface';

export class SendUsersNotificationCommand implements ICommand {
  constructor(
    public readonly notification: INotification,
  ) {
  }
}