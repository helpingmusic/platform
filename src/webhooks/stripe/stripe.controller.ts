import { Body, Controller, Post } from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';
import { LogService } from 'src/shared/logger/log.service';
import { ILogger } from 'src/shared/logger/logger.interface';
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
  event(@Body() body: any) {
    this.log.info(body.type);

    this.eventBus.publish(
      new StripeEvent(body.type, body.data.object),
    );
  }

}
