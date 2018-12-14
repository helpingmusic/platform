import { Allow, ValidateNested } from 'class-validator';
import { StripeEvents } from 'src/webhooks/stripe/stripe-events.enum';

export class StripeData {
  @Allow()
  object: any;
}

export class StripeEventDto {
  @Allow()
  @ValidateNested()
  data: StripeData;
  @Allow()
  type: StripeEvents;
}
