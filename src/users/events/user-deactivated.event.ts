import { IEvent } from '@nestjs/cqrs';
import { IUser } from 'src/users/interfaces/user.interface';

/**
 * Emitted when user subscription is deactivated
 */
export class UserDeactivatedEvent implements IEvent {
  constructor(public user: IUser) {
  }
}
