import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { LogService } from 'src/shared/logger/log.service';
import { WorkerModule } from 'src/worker/worker.module';

(async function bootstrap() {

  const worker = await NestFactory.createMicroservice(WorkerModule, {
    transport: Transport.REDIS,
    options: {
      url: process.env.REDIS_URI,
    },
  });

  const log = worker.get<LogService>(LogService).createLogger('worker');
  worker.useLogger({ log: log.info, error: log.error, warn: log.debug });

  await worker.listenAsync();

})();
