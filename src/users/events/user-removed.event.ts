import { IEvent } from '@nestjs/cqrs';
import { IUser } from 'src/users/interfaces/user.interface';

export class UserRemovedEvent implements IEvent {
  constructor(public user: IUser) {
  }
}
