import { Body, Controller, Get } from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';
import { LogService } from 'src/shared/logger/log.service';
import { ILogger } from 'src/shared/logger/logger.interface';
import { StripeEventDto } from 'src/webhooks/stripe/stripe-event.dto';
import { StripeEvent } from 'src/webhooks/stripe/stripe.event';

@Controller('stripe')
export class StripeController {

  log: ILogger;

  constructor(
    private readonly eventBus: EventBus,
    log: LogService,
  ) {
    this.log = log.createLogger('stripe');
  }

  @Get()
  get(@Body() body: StripeEventDto) {

    this.log.info(body.type);

    this.eventBus.publish(
      new StripeEvent(body.type, body.object),
    );

  }

}
