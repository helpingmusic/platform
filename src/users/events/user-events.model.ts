import { Injectable } from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';
import { UserCreatedEvent } from 'src/users/events/user-created.event';
import { UserRemovedEvent } from 'src/users/events/user-removed.event';
import { UserUpdatedEvent } from 'src/users/events/user-updated.event';
import { IUser } from 'src/users/interfaces/user.interface';
import { UserSchema } from 'src/users/schemas/user.schema';
import { SchemaEventModel } from 'src/common/abstract/shema-event-model';

@Injectable()
export class UserEventsModel extends SchemaEventModel<IUser> {
  constructor(protected events$: EventBus) {
    super(UserSchema, events$);
  }

  created(u: IUser) {
    this.events$.publish(
      new UserCreatedEvent(u),
    );
  }

  saved(u: IUser, changes: IUser) {
    this.events$.publish(
      new UserUpdatedEvent(u, changes),
    );
  }

  removed(u: IUser) {
    this.events$.publish(
      new UserRemovedEvent(u),
    );
  }
}
