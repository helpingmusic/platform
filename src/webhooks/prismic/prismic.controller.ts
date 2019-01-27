import { Controller, Post } from '@nestjs/common';
import { LogService } from 'src/shared/logger/log.service';
import { EventBus } from '@nestjs/cqrs';
import { ILogger } from 'src/shared/logger/logger.interface';
import { PrismicEvent } from 'src/webhooks/prismic/prismic.event';

@Controller('webhooks/prismic')
export class PrismicController {

  log: ILogger;

  constructor(
    private readonly eventBus: EventBus,
    log: LogService,
  ) {
    this.log = log.createLogger('prismic');
  }

  @Post()
  event() {
    this.log.info('Webhook');
    this.eventBus.publish(new PrismicEvent());
  }

}
