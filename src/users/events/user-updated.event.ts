import { IEvent } from '@nestjs/cqrs';
import { IUser } from 'src/users/interfaces/user.interface';
import { IModelChanges } from 'src/common/abstract/shema-event-model';

export class UserUpdatedEvent implements IEvent {
  constructor(public user: IUser, public changes: IModelChanges) {
  }
}
