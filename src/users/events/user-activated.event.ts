import { IEvent } from '@nestjs/cqrs';
import { IUser } from 'src/users/interfaces/user.interface';

/**
 * Emitted when user is made active for the first time
 */
export class UserActivatedEvent implements IEvent {
  constructor(public user: IUser) {
  }
}
