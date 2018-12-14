import { Body, Controller, Get, Post } from '@nestjs/common';
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
    this.log.info(body.data.type);

    this.eventBus.publish(
      new StripeEvent(body.data.type, body.data.object),
    );

  }

}
