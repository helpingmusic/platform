import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import compression from 'compression';
import helmet from 'helmet';

import { ConfigService } from 'src/shared/config/config.service';
import { LogService } from 'src/shared/logger/log.service';

import { AppModule } from './app.module';

(async function bootstrap() {

  const app = await NestFactory.create(AppModule);

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

  const log = app.get<LogService>(LogService).createLogger('nest');
  app.useLogger({ log: log.info, error: log.error, warn: log.debug });

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

  await app.listen(process.env.PORT);

})();
