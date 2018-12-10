import { NestFactory } from '@nestjs/core';
import { CronModule } from 'src/cron/cron.module';
import { LogService } from 'src/shared/logger/log.service';

(async function bootstrap() {

  const app = await NestFactory.create(CronModule);

  const log = app.get<LogService>(LogService).createLogger('cron');
  app.useLogger({ log: log.info, error: log.error, warn: log.debug });

})();
