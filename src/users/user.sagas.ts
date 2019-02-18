import { Injectable } from '@nestjs/common';
import { EventObservable } from '@nestjs/cqrs';
import { merge } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { ConfirmUserEmailCommand } from 'src/users/commands/impl/confirm-user-email.command';
import { CreateReferralCouponCommand } from 'src/users/commands/impl/create-referral-coupon.command';
import { CreateStripeCustomerCommand } from 'src/users/commands/impl/create-stripe-customer.command';
import { RemoveUserIndexCommand } from 'src/users/commands/impl/remove-user-index.command';
import { SendWelcomeEmailCommand } from 'src/users/commands/impl/send-welcome-email.command';
import { UpdateStripeCustomerCommand } from 'src/users/commands/impl/update-stripe-customer.command';
import { UpdateUserIndexCommand } from 'src/users/commands/impl/update-user-index.command';
import { UserActivatedEvent } from 'src/users/events/user-activated.event';
import { UserCreatedEvent } from 'src/users/events/user-created.event';
import { UserDeactivatedEvent } from 'src/users/events/user-deactivated.event';
import { UserProfileUpdatedEvent } from 'src/users/events/user-profile-updated.event';
import { UserRemovedEvent } from 'src/users/events/user-removed.event';
import { UserUpdatedEvent } from 'src/users/events/user-updated.event';
import { IUser } from 'src/users/interfaces/user.interface';

@Injectable()
export class UserSagas {

  /**
   * Add user to stripe customers
   */
  createStripeCustomer = (events$: EventObservable<UserCreatedEvent>) =>
    events$.ofType(UserCreatedEvent)
      .pipe(map(event => new CreateStripeCustomerCommand(event.user)))

  /**
   * Update user search index when user is created/updated
   */
  updateUserIndex = (events$: EventObservable<UserProfileUpdatedEvent>) =>
    events$.ofType(UserProfileUpdatedEvent)
      .pipe(
        // only update if user is active
        filter(({ user }: { user: IUser }) => user.isActive),
        map(event => new UpdateUserIndexCommand(event.user)),
      )

  /**
   * Update user search index when user is created/updated
   */
  removeUserIndex = (events$: EventObservable<UserRemovedEvent | UserDeactivatedEvent>) =>
    merge(
      events$.ofType(UserRemovedEvent),
      events$.ofType(UserDeactivatedEvent),
    )
      .pipe(map(event => new RemoveUserIndexCommand(event.user._id)))

  /**
   * Confirm user email if they change it
   */
  confirmUserEmail = (events$: EventObservable<UserUpdatedEvent>) =>
    events$.ofType(UserUpdatedEvent)
      .pipe(
        filter((event) => event.changes.hasOwnProperty('email')),
        map(event => new ConfirmUserEmailCommand(event.user)),
      )

  /**
   *  Update User representation in stripe
   */
  updateStripeCustomer = (events$: EventObservable<UserUpdatedEvent>) =>
    events$.ofType(UserUpdatedEvent)
      .pipe(
        filter((event) => ['email', 'first_name', 'last_name']
          .some(p => event.changes.hasOwnProperty(p)),
        ),
        map(event => new UpdateStripeCustomerCommand(event.user)),
      )

  /**
   * Create user's referral code in stripe
   */
  createReferralCoupon = (events$: EventObservable<UserActivatedEvent>) =>
    events$.ofType(UserActivatedEvent)
      .pipe(map(event => new CreateReferralCouponCommand(event.user._id)))

  /**
   * Send welcome email on signup
   */
  emailWelcome$ = (events$: EventObservable<UserActivatedEvent>) =>
    events$.ofType(UserActivatedEvent)
      .pipe(map(event => new SendWelcomeEmailCommand(event.user)))

  sagas = [
    this.createStripeCustomer,
    this.updateUserIndex,
    this.removeUserIndex,
    this.confirmUserEmail,
    this.updateStripeCustomer,
    this.createReferralCoupon,
    this.emailWelcome$,
  ];
}
