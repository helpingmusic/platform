import { Module } from '@nestjs/common';
import { StripeModule } from './stripe/stripe.module';
import { PrismicModule } from './prismic/prismic.module';

@Module({
  imports: [StripeModule, PrismicModule],
})
export class WebhooksModule {
}
