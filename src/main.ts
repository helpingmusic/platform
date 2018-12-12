import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import compression from 'compression';
import helmet from 'helmet';
import { CronModule } from 'src/cron/cron.module';

import { ConfigService } from 'src/shared/config/config.service';
import { LogService } from 'src/shared/logger/log.service';
import { WorkerModule } from 'src/worker/worker.module';

import { AppModule } from './app.module';

(async function bootstrap() {

  process.on('unhandledRejection', r => console.log(r));

  const app = await NestFactory.create(AppModule);

  const worker = await NestFactory.createMicroservice(WorkerModule, {
    transport: Transport.REDIS,
    options: {
      url: process.env.REDIS_URI,
    },
  });

  const clock = await NestFactory.create(CronModule);

  const config = app.get<ConfigService>(ConfigService);

  app.enableCors({
    origin: [
      config.get('APP_ORIGIN'),
      'https://home-admin.herokuapp.com',
    ],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    methods: '*',
  });
  app.use(helmet());
  // app.use(csurf());
  app.use(compression());

  const createLogger = name => {
    const l = app.get<LogService>(LogService).createLogger(name);
    return { log: l.info, error: l.error, warn: l.debug };
  };
  app.useLogger(createLogger('web'));
  worker.useLogger(createLogger('worker'));
  clock.useLogger(createLogger('clock'));

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // strips unnamed props
    transform: true,
  }));

  const options = new DocumentBuilder()
    .setTitle('HOME API')
    .setDescription('Helping Our Music Evolve')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  await worker.listenAsync();
  await app.listen(process.env.PORT);

})();
