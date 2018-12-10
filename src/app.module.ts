import { ClassSerializerInterceptor, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggerMiddleware } from 'src/common/logger.middleware';
import { ErrorReporterInterceptor } from 'src/core/error-reporter.interceptor';
import { UsersModule } from 'src/users/users.module';
import { ApiModule } from './api/api.module';
import { AuthModule } from './auth/auth.module';
import { CoreModule } from './core/core.module';
import { DatabaseModule } from './database/database.module';
import { SearchModule } from './search/search.module';
import { SharedModule } from './shared/shared.module';
import { WebhooksModule } from './webhooks/webhooks.module';

@Module({
  imports: [
    SharedModule,
    DatabaseModule,
    CoreModule,
    UsersModule,
    AuthModule,
    ApiModule,
    WebhooksModule,
    SearchModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ErrorReporterInterceptor,
    },
  ],
})
export class AppModule implements NestModule {

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes('*');
  }

}
