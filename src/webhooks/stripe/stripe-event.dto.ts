import { StripeEvents } from 'src/webhooks/stripe/stripe-events.enum';

export class StripeEventDto {
  type: StripeEvents;
  object: any;
}