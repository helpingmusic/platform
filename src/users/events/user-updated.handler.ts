import { EventBus, EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { UserActivatedEvent } from 'src/users/events/user-activated.event';
import { UserDeactivatedEvent } from 'src/users/events/user-deactivated.event';
import { UserProfileUpdatedEvent } from 'src/users/events/user-profile-updated.event';
import { UserUpdatedEvent } from 'src/users/events/user-updated.event';

@EventsHandler(UserUpdatedEvent)
export class UserUpdatedHandler implements IEventHandler<UserUpdatedEvent> {
  constructor(private eventBus: EventBus) {
  }

  handle(event: UserUpdatedEvent) {
    const { user, changes } = event;

    const statusChanged = ['stripe.status', 'active_until'].some(p => changes.hasOwnProperty(p));
    if (!user.isActive && statusChanged) {
      this.eventBus.publish(
        new UserDeactivatedEvent(user),
      );
    }

    if (user.isActive && statusChanged) {
      this.eventBus.publish(
        new UserActivatedEvent(user),
      );
    }

    const profileFields = [ 'first_name', 'last_name', 'city', 'state', 'profession', 'bio', 'membership_types', 'genres', 'instruments', 'skills', 'resources', 'profile_pic', 'banner' ];
    const profileChanged = profileFields.some(f => changes.hasOwnProperty(f));
    if (profileChanged) {
      this.eventBus.publish(
        new UserProfileUpdatedEvent(user, changes),
      );
    }

  }
}