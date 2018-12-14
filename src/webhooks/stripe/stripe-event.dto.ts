import { Allow, ValidateNested } from 'class-validator';
import { StripeEvents } from 'src/webhooks/stripe/stripe-events.enum';

export class StripeData {
  @Allow()
  type: StripeEvents;
  @Allow()
  object: any;
}

export class StripeEventDto {
  @Allow()
  @ValidateNested()
  data: StripeData;
}
