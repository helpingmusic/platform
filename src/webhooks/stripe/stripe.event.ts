import { IEvent } from '@nestjs/cqrs';
import { StripeEvents } from 'src/webhooks/stripe/stripe-events.enum';

export class StripeEvent implements IEvent {
  constructor(
    public type: StripeEvents,
    public payload: any,
  ) {
  }
}