import { Body, Controller, Post } from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';
import { LogService } from 'src/shared/logger/log.service';
import { ILogger } from 'src/shared/logger/logger.interface';
import { StripeEventDto } from 'src/webhooks/stripe/stripe-event.dto';
import { StripeEvent } from 'src/webhooks/stripe/stripe.event';

@Controller('webhooks/stripe')
export class StripeController {

  log: ILogger;

  constructor(
    private readonly eventBus: EventBus,
    log: LogService,
  ) {
    this.log = log.createLogger('stripe');
  }

  @Post()
  event(@Body() body: StripeEventDto) {

    this.log.info(body);
    this.log.info(body.type);

    this.eventBus.publish(
      new StripeEvent(body.type, body.data.object),
    );
  }

}


const etst = {
  id: 'evt_1DhPN7EKyb0MHKeOoMP7excc',
  object: 'event',
  api_version: '2018-09-24',
  created: 1544827385,
  data: {
    object: {
      id: 'cus_E9i8SEXdNOm4CA',
      object: 'customer',
      account_balance: 0,
      created: 1544824873,
      currency: 'usd',
      default_source: 'card_1DhOmqEKyb0MHKeOwVdyFF4M',
      delinquent: false,
      description: 'tajuan (ski. wahkir) dixon',
      discount: null,
      email: 'tajuannation@gmail.com',
      invoice_prefix: '679090D',
      livemode: true,
      metadata:
        {
          _id: '5c142828ce42060013ee4da9',
          name: 'tajuan (ski. wahkir) dixon',
        },
      shipping: null,
      sources:
        {
          object: 'list',
          data: [[Object]],
          has_more: false,
          total_count: 1,
          url: '/v1/customers/cus_E9i8SEXdNOm4CA/sources',
        },
      subscriptions:
        {
          object: 'list',
          data: [[Object]],
          has_more: false,
          total_count: 1,
          url: '/v1/customers/cus_E9i8SEXdNOm4CA/subscriptions',
        },
      tax_info: null,
      tax_info_verification: null,
    },
    previous_attributes: { metadata: { name: 'Tajuan (ski. wahkir) dixon' } },
  },
  livemode: true,
  pending_webhooks: 3,
  request: { id: 'req_8k6Ai29eUA3v0S', idempotency_key: null },
  type: 'customer.updated',
};